# Type, status and master constants contracts


## CONST-ADMIN_TABS

src/admin-console.tsx:97-108

```typescript
ADMIN_TABS = [
  "Users",
  "Team Structure",
  "Service Task Catalog",
  "Roles & Page Access",
  "Business Settings",
  "App Theme",
  "Company Settings",
  "Report Templates",
  "Inventory Import",
  "Support & Logs",
] as const
```

## TYPE-AdminTab

src/admin-console.tsx:109-109

```typescript
type AdminTab = (typeof ADMIN_TABS)[number];
```

## CONST-ADMIN_TAB_LABELS

src/admin-console.tsx:110-112

```typescript
ADMIN_TAB_LABELS: Partial<Record<AdminTab, string>> = {
  "Service Task Catalog": "Service Task",
}
```

## TYPE-LogEntryInput

src/admin-console.tsx:114-114

```typescript
type LogEntryInput = Omit<DemoLogEntry, "id" | "timestamp">;
```

## TYPE-TeamAdvisor

src/admin-console.tsx:348-348

```typescript
type TeamAdvisor = { managerId: number; advisor: User };
```

## CONST-ALL_PAGE_KEYS

src/admin-console.tsx:374-376

```typescript
ALL_PAGE_KEYS: AdminPageKey[] = ADMIN_PAGE_GROUPS.flatMap((group) =>
  group.pages.map((page) => page.key),
)
```

## TYPE-ServiceTaskSubTab

src/admin-console.tsx:378-378

```typescript
type ServiceTaskSubTab = "tasks" | "catalogs";
```

## CONST-CATALOG_GST_OPTIONS

src/admin-console.tsx:578-581

```typescript
CATALOG_GST_OPTIONS = [
  { value: 0, label: "No GST (0%)" },
  ...GST_RATES.map((rate) => ({ value: rate, label: `${rate}%` })),
]
```

## CONST-SETTINGS_GROUPS

src/admin-console.tsx:1453-1461

```typescript
SETTINGS_GROUPS = [
  { key: "profile", label: "Workshop Profile" },
  { key: "branch", label: "Branch & Working Hours" },
  { key: "jobs", label: "Jobs & Workflow" },
  { key: "pricing", label: "Estimates & Pricing" },
  { key: "billing", label: "Tax & Billing" },
  { key: "inventory", label: "Inventory" },
  { key: "notifications", label: "Notifications & Documents" },
] as const
```

## TYPE-SettingsGroupKey

src/admin-console.tsx:1462-1462

```typescript
type SettingsGroupKey = (typeof SETTINGS_GROUPS)[number]["key"];
```

## CONST-WEEKDAYS

src/admin-console.tsx:1464-1472

```typescript
WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]
```

## CONST-PAYMENT_MODE_OPTIONS

src/admin-console.tsx:1473-1473

```typescript
PAYMENT_MODE_OPTIONS = ["Cash", "Card", "UPI", "Bank Transfer", "Cheque"]
```

## CONST-NOTIFICATION_CHANNEL_OPTIONS

src/admin-console.tsx:1474-1474

```typescript
NOTIFICATION_CHANNEL_OPTIONS = ["sms", "email", "whatsapp"] as const
```

## CONST-IMAGE_TYPES

src/admin-console.tsx:2170-2170

```typescript
IMAGE_TYPES = new Set(["image/png", "image/jpeg"])
```

## CONST-MAX_COMPANY_IMAGE_BYTES

src/admin-console.tsx:2171-2171

```typescript
MAX_COMPANY_IMAGE_BYTES = 500 * 1024
```

## CONST-MAX_IMAGE_EDGE

src/admin-console.tsx:2172-2172

```typescript
MAX_IMAGE_EDGE = 800
```

## CONST-REPORT_CATEGORIES

src/admin-console.tsx:2458-2460

```typescript
REPORT_CATEGORIES = Object.keys(
  REPORT_CATEGORY_LABELS,
) as ReportCategory[]
```

## TYPE-WizardStep

src/admin-console.tsx:2791-2791

```typescript
type WizardStep = 1 | 2 | 3 | 4;
```

## CONST-SUPPORT_SUB_TABS

src/admin-console.tsx:3155-3159

```typescript
SUPPORT_SUB_TABS = [
  "Daily Operational Logs",
  "Feature Activity",
  "Retention Settings",
] as const
```

## TYPE-SupportSubTab

src/admin-console.tsx:3160-3160

```typescript
type SupportSubTab = (typeof SUPPORT_SUB_TABS)[number];
```

## CONST-LOG_LEVELS

src/admin-console.tsx:3161-3161

```typescript
LOG_LEVELS = ["info", "warning", "error"] as const
```

## CONST-ADMIN_DEMO_STATE_VERSION

src/admin-demo-state.ts:6-6

```typescript
ADMIN_DEMO_STATE_VERSION = 2
```

## CONST-ADMIN_DEMO_STORAGE_KEY

src/admin-demo-state.ts:7-7

```typescript
ADMIN_DEMO_STORAGE_KEY = `workshopos.admin-demo.v${ADMIN_DEMO_STATE_VERSION}`
```

## CONST-LEGACY_ADMIN_DEMO_STORAGE_KEY

src/admin-demo-state.ts:8-8

```typescript
LEGACY_ADMIN_DEMO_STORAGE_KEY = "workshopos.admin-demo.v1"
```

## CONST-BUILT_IN_ROLE_LABELS

src/admin-demo-state.ts:10-18

```typescript
BUILT_IN_ROLE_LABELS: Record<Role, string> = {
  admin: "Owner/Admin",
  service: "Service Advisor",
  service_manager: "Service Department Manager",
  reception: "Reception",
  accounts: "Accounts",
  store: "Store",
  tech: "Technician",
}
```

## TYPE-AdminPageKey

src/admin-demo-state.ts:20-52

```typescript
export type AdminPageKey =
  | "receive-vehicle"
  | "advance-bookings"
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
  | "approvals"
  | "inward-purchases"
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
  | "manage"
  | "admin-console"
  | "sales-leads"
  | "quotations"
  | "quotation-settings";
```

## TYPE-AdminPageDefinition

src/admin-demo-state.ts:54-57

```typescript
export interface AdminPageDefinition {
  key: AdminPageKey;
  label: string;
}
```

## TYPE-AdminPageGroup

src/admin-demo-state.ts:59-63

```typescript
export interface AdminPageGroup {
  key: "front-desk" | "workshop" | "inventory" | "finance" | "sales" | "administration";
  label: string;
  pages: readonly AdminPageDefinition[];
}
```

## CONST-SALES_CRM_PAGES

src/admin-demo-state.ts:65-69

```typescript
SALES_CRM_PAGES = [
  { key: "sales-leads" as const, label: "Leads" },
  { key: "quotations" as const, label: "Quotations" },
  { key: "quotation-settings" as const, label: "Quotation Settings" },
] as const
```

## CONST-ADMIN_PAGE_GROUPS

src/admin-demo-state.ts:71-136

```typescript
ADMIN_PAGE_GROUPS: readonly AdminPageGroup[] = [
  {
    key: "front-desk",
    label: "Front Desk",
    pages: [
      { key: "receive-vehicle", label: "Receive Vehicle" },
      { key: "today-queue", label: "Today Queue" },
      { key: "advance-bookings", label: "Advance Bookings" },
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
      { key: "approvals", label: "Approvals" },
      { key: "inward-purchases", label: "Purchase Orders" },
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
    key: "sales",
    label: "Sales CRM",
    pages: SALES_CRM_PAGES,
  },
  {
    key: "administration",
    label: "Administration",
    pages: [
      { key: "dashboard", label: "Dashboard" },
      { key: "data-flow", label: "Data Flow" },
      { key: "jobs", label: "Job Cards" },
      { key: "manage", label: "Manage" },
      { key: "admin-console", label: "Admin Console" },
    ],
  },
] as const
```

## CONST-PAGE_KEY_BY_MENU_LABEL

src/admin-demo-state.ts:138-140

```typescript
PAGE_KEY_BY_MENU_LABEL: Readonly<Record<string, AdminPageKey>> = Object.fromEntries(
  ADMIN_PAGE_GROUPS.flatMap((group) => group.pages.map((page) => [page.label, page.key])),
) as Record<string, AdminPageKey>
```

## CONST-PAGE_LABEL_BY_KEY

src/admin-demo-state.ts:142-144

```typescript
PAGE_LABEL_BY_KEY: Readonly<Record<AdminPageKey, string>> = Object.fromEntries(
  ADMIN_PAGE_GROUPS.flatMap((group) => group.pages.map((page) => [page.key, page.label])),
) as Record<AdminPageKey, string>
```

## CONST-ROLE_MENU_PAGE_KEYS

src/admin-demo-state.ts:147-155

```typescript
ROLE_MENU_PAGE_KEYS: Readonly<Record<Role, readonly AdminPageKey[]>> = {
  reception: ["today-queue", "advance-bookings", "customers", "vehicles", "search"],
  service: ["my-queue", "job-card", "estimate", "follow-ups", "media", "search"],
  service_manager: ["my-queue", "job-card", "estimate", "follow-ups", "media", "search"],
  store: ["material-requests", "issue-material", "reconcile", "stock", "inward-purchases", "search"],
  tech: ["my-tasks", "work-update", "qc-prep", "search"],
  accounts: ["ready-to-invoice", "invoice", "payment", "delivery", "search"],
  admin: ["dashboard", "advance-bookings", "approvals", "data-flow", "jobs", "media", "inward-purchases", "manage", "search", "sales-leads", "quotations", "quotation-settings", "admin-console"],
}
```

## CONST-ADMIN_SEARCH_OPERATIONAL_PAGE_KEYS

src/admin-demo-state.ts:164-164

```typescript
ADMIN_SEARCH_OPERATIONAL_PAGE_KEYS: readonly AdminPageKey[] = ["material-requests", "issue-material", "reconcile", "stock", "estimate", "follow-ups"]
```

## TYPE-DemoRole

src/admin-demo-state.ts:166-176

```typescript
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
```

## TYPE-RolePageAccess

src/admin-demo-state.ts:178-178

```typescript
export type RolePageAccess = Record<string, AdminPageKey[]>;
```

## CONST-APP_THEME_FONTS

src/admin-demo-state.ts:180-186

```typescript
APP_THEME_FONTS = [
  { id: "system", label: "System UI", cssFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  { id: "arial", label: "Arial", cssFamily: "Arial, sans-serif" },
  { id: "verdana", label: "Verdana", cssFamily: "Verdana, sans-serif" },
  { id: "trebuchet", label: "Trebuchet MS", cssFamily: '"Trebuchet MS", sans-serif' },
  { id: "georgia", label: "Georgia", cssFamily: "Georgia, serif" },
] as const
```

## CONST-APP_THEME_PALETTES

src/admin-demo-state.ts:188-193

```typescript
APP_THEME_PALETTES = [
  { id: "go-lite", label: "Go Lite", tokens: { background: "#f4f6f8", sidebar: "#e1f1eb", sidebarBorder: "#c6ded4", sidebarText: "#3f4e58", active: "rgb(195, 225, 170)", activeBorder: "#9edfc7", hover: "#c6e7b7", accent: "#15616d", focus: "rgba(21, 97, 109, 0.35)", tableHeader: "rgb(195, 225, 170)" } },
  { id: "go-yellow", label: "Go Yellow", tokens: { background: "#fffaf0", sidebar: "#fff0bf", sidebarBorder: "#ead18a", sidebarText: "#51451f", active: "#ffe28a", activeBorder: "#d7af38", hover: "#ffe28a", accent: "#976b00", focus: "rgba(151, 107, 0, 0.35)", tableHeader: "#ffebad" } },
  { id: "go-orange", label: "Go Orange", tokens: { background: "#fff7f2", sidebar: "#ffe3d1", sidebarBorder: "#efbc9c", sidebarText: "#5d3929", active: "#ffd0ad", activeBorder: "#d9824d", hover: "#ffd0ad", accent: "#b94f16", focus: "rgba(185, 79, 22, 0.35)", tableHeader: "#ffdbbf" } },
  { id: "go-blue", label: "Go Blue", tokens: { background: "#f3f8ff", sidebar: "#dcecff", sidebarBorder: "#b7d0ed", sidebarText: "#263f5a", active: "#c8e1ff", activeBorder: "#7eb5e8", hover: "#c8e1ff", accent: "#1667aa", focus: "rgba(22, 103, 170, 0.35)", tableHeader: "#d4e8fb" } },
] as const
```

## TYPE-AppThemeFontId

src/admin-demo-state.ts:195-195

```typescript
export type AppThemeFontId = (typeof APP_THEME_FONTS)[number]["id"];
```

## TYPE-AppThemePaletteId

src/admin-demo-state.ts:196-196

```typescript
export type AppThemePaletteId = (typeof APP_THEME_PALETTES)[number]["id"];
```

## TYPE-AppTheme

src/admin-demo-state.ts:197-197

```typescript
export interface AppTheme { fontId: AppThemeFontId; paletteId: AppThemePaletteId; }
```

## CONST-DEFAULT_APP_THEME

src/admin-demo-state.ts:198-198

```typescript
DEFAULT_APP_THEME: Readonly<AppTheme> = { fontId: "system", paletteId: "go-lite" }
```

## TYPE-WorkshopBusinessSettings

src/admin-demo-state.ts:200-264

```typescript
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
    jobCardCreatedWhatsAppTemplate: string;
    jobCardCreatedEmailTemplate: string;
    jobCardClosedWhatsAppTemplate: string;
    jobCardClosedEmailTemplate: string;
  };
  logRetention: {
    operationalDays: number;
    featureDays: number;
  };
}
```

## TYPE-DemoLogStream

src/admin-demo-state.ts:266-266

```typescript
export type DemoLogStream = "operational" | "feature";
```

## TYPE-DemoLogLevel

src/admin-demo-state.ts:267-267

```typescript
export type DemoLogLevel = "info" | "warning" | "error";
```

## TYPE-DemoLogEntry

src/admin-demo-state.ts:269-281

```typescript
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
```

## TYPE-DemoLogFilter

src/admin-demo-state.ts:283-292

```typescript
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
```

## TYPE-SessionInventoryItem

src/admin-demo-state.ts:294-305

```typescript
export interface SessionInventoryItem {
  id: string;
  importBatchId: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  stockQty: number;
  lowStockQty: number;
  sellingPrice: number;
  importedAt: string;
}
```

## TYPE-DemoImportError

src/admin-demo-state.ts:307-311

```typescript
export interface DemoImportError {
  row: number;
  field?: string;
  message: string;
}
```

## TYPE-DemoImportBatch

src/admin-demo-state.ts:313-324

```typescript
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
```

## TYPE-AdminDemoState

src/admin-demo-state.ts:326-337

```typescript
export interface AdminDemoState {
  version: typeof ADMIN_DEMO_STATE_VERSION;
  roles: DemoRole[];
  rolePageAccess: RolePageAccess;
  businessSettings: WorkshopBusinessSettings;
  appTheme: AppTheme;
  logs: DemoLogEntry[];
  importBatches: DemoImportBatch[];
  sessionInventory: SessionInventoryItem[];
  reportTemplates: ReportTemplate[];
  companyAssets: CompanyAssets;
}
```

## TYPE-PersistedAdminDemoState

src/admin-demo-state.ts:343-345

```typescript
type PersistedAdminDemoState = Omit<Partial<AdminDemoState>, "version"> & {
  version?: number;
};
```

## TYPE-SessionStorageLike

src/admin-demo-state.ts:347-351

```typescript
export interface SessionStorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
```

## TYPE-DeepPartial

src/admin-demo-state.ts:353-355

```typescript
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<unknown> ? T[P] : T[P] extends object ? DeepPartial<T[P]> : T[P];
};
```

## CONST-ALL_PAGE_KEYS

src/admin-demo-state.ts:357-357

```typescript
ALL_PAGE_KEYS = new Set<AdminPageKey>(ADMIN_PAGE_GROUPS.flatMap((group) => group.pages.map((page) => page.key)))
```

## CONST-OWNER_ROLE_ID

src/admin-demo-state.ts:358-358

```typescript
OWNER_ROLE_ID: Role = "admin"
```

## CONST-PROTECTED_OWNER_PAGE

src/admin-demo-state.ts:359-359

```typescript
PROTECTED_OWNER_PAGE: AdminPageKey = "admin-console"
```

## CONST-DEFAULT_ROLE_PAGE_ACCESS

src/admin-demo-state.ts:361-369

```typescript
DEFAULT_ROLE_PAGE_ACCESS: Readonly<RolePageAccess> = {
  reception: [...ROLE_MENU_PAGE_KEYS.reception],
  service: [...ROLE_MENU_PAGE_KEYS.service],
  service_manager: [...ROLE_MENU_PAGE_KEYS.service_manager],
  store: [...ROLE_MENU_PAGE_KEYS.store],
  tech: [...ROLE_MENU_PAGE_KEYS.tech],
  accounts: [...ROLE_MENU_PAGE_KEYS.accounts],
  admin: [...ROLE_MENU_PAGE_KEYS.admin, ...ADMIN_SEARCH_OPERATIONAL_PAGE_KEYS],
}
```

## CONST-DEFAULT_SETTINGS

src/admin-demo-state.ts:371-436

```typescript
DEFAULT_SETTINGS: WorkshopBusinessSettings = {
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
    jobCardCreatedWhatsAppTemplate:
      "Your job card {{jobCardNo}} for {{vehicleRegistrationNo}} has been created at {{workshopName}}. Your service advisor is {{serviceAdvisorName}}.",
    jobCardCreatedEmailTemplate:
      "Your job card {{jobCardNo}} for {{vehicleRegistrationNo}} has been created at {{workshopName}}. Your service advisor is {{serviceAdvisorName}}.",
    jobCardClosedWhatsAppTemplate:
      "Your job card {{jobCardNo}} for {{vehicleRegistrationNo}} has been closed at {{workshopName}}.",
    jobCardClosedEmailTemplate:
      "Your job card {{jobCardNo}} for {{vehicleRegistrationNo}} has been closed at {{workshopName}}.",
  },
  logRetention: { operationalDays: 30, featureDays: 30 },
}
```

## CONST-DEFAULT_TIMESTAMP

src/admin-demo-state.ts:438-438

```typescript
DEFAULT_TIMESTAMP = "2026-09-22T09:00:00.000Z"
```

## CONST-DEFAULT_ADMIN_DEMO_STATE

src/admin-demo-state.ts:491-491

```typescript
DEFAULT_ADMIN_DEMO_STATE: Readonly<AdminDemoState> = createDefaultAdminDemoState()
```

## TYPE-CompanyDetails

src/admin-demo-state.ts:831-831

```typescript
export interface CompanyDetails { address: string; phone: string; email: string; gstin: string; footer: string }
```

## TYPE-InventoryImportRowInput

src/admin-demo-state.ts:891-899

```typescript
export interface InventoryImportRowInput {
  sku: string;
  name: string;
  category: string;
  unit: string;
  stockQty: number;
  lowStockQty: number;
  sellingPrice?: number;
}
```

## TYPE-AdminRole

src/admin-users-api.ts:3-3

```typescript
export type AdminRole = { id: string; name: string; permissions: string[] };
```

## TYPE-AdminBranch

src/admin-users-api.ts:4-4

```typescript
export type AdminBranch = { id: string; name: string };
```

## TYPE-AdminUser

src/admin-users-api.ts:5-9

```typescript
export type AdminUser = {
  id: string; name: string; email: string; status: "INVITED" | "ACTIVE" | "ARCHIVED";
  roleIds: string[]; roles: AdminRole[]; branchIds: string[]; branches: AdminBranch[];
  version: number; invitedAt?: string; lastInvitedAt?: string; createdAt: string; updatedAt: string;
};
```

## TYPE-ServiceDepartment

src/admin-users-api.ts:10-15

```typescript
export type ServiceDepartment = {
  id: string; branchId: string; branchName: string; name: string; status: "ACTIVE" | "ARCHIVED";
  managers: Array<{ membershipId: string; userId: string; name: string }>;
  advisorTeams: Array<{ managerMembershipId: string; managerUserId: string; managerName: string; advisorMembershipId: string; advisorUserId: string; advisorName: string }>;
  createdAt: string; updatedAt: string;
};
```

## TYPE-AdminDirectory

src/admin-users-api.ts:16-16

```typescript
export type AdminDirectory = { users: AdminUser[]; roles: AdminRole[]; branches: AdminBranch[]; serviceDepartments: ServiceDepartment[] };
```

## TYPE-AdvanceBookingRange

src/advance-booking-range.ts:1-1

```typescript
export type AdvanceBookingRange = { min: string; max: string; firstMonth: string; lastMonth: string };
```

## TYPE-MenuItem

src/App.tsx:353-357

```typescript
type MenuItem = {
  key: AdminPageKey;
  label: string;
  icon: React.ReactNode;
};
```

## CONST-MENU_ICON_BY_PAGE_KEY

src/App.tsx:359-391

```typescript
MENU_ICON_BY_PAGE_KEY: Partial<Record<AdminPageKey, React.ReactNode>> = {
  "advance-bookings": <CalendarDays size={18} />,
  "today-queue": <Car size={18} />,
  customers: <UserRound size={18} />,
  vehicles: <Car size={18} />,
  search: <Search size={18} />,
  "my-queue": <ClipboardList size={18} />,
  "job-card": <FileText size={18} />,
  estimate: <ReceiptText size={18} />,
  "follow-ups": <ClipboardCheck size={18} />,
  media: <Camera size={18} />,
  "material-requests": <PackageCheck size={18} />,
  "issue-material": <Package size={18} />,
  reconcile: <Check size={18} />,
  stock: <Boxes size={18} />,
  approvals: <ShieldCheck size={18} />,
  "inward-purchases": <ReceiptText size={18} />,
  "my-tasks": <Wrench size={18} />,
  "work-update": <ClipboardCheck size={18} />,
  "qc-prep": <ShieldCheck size={18} />,
  "ready-to-invoice": <ClipboardList size={18} />,
  invoice: <ReceiptText size={18} />,
  payment: <Banknote size={18} />,
  delivery: <DoorOpen size={18} />,
  dashboard: <Gauge size={18} />,
  "data-flow": <ClipboardCheck size={18} />,
  jobs: <FileText size={18} />,
  manage: <ShieldCheck size={18} />,
  "admin-console": <Settings size={18} />,
  "sales-leads": <UsersRound size={18} />,
  quotations: <ReceiptText size={18} />,
  "quotation-settings": <Settings size={18} />,
}
```

## TYPE-SearchTableCategory

src/App.tsx:416-417

```typescript
export type SearchTableCategory =
  "job" | "customer" | "vehicle" | "invoice" | "payment" | "stock";
```

## TYPE-AdminOperationalSearchCategory

src/App.tsx:418-424

```typescript
type AdminOperationalSearchCategory =
  | "material-requests"
  | "issue-material"
  | "reconcile"
  | "stock"
  | "estimate"
  | "follow-ups";
```

## TYPE-SearchCategorySelection

src/App.tsx:425-426

```typescript
type SearchCategorySelection =
  SearchTableCategory | Exclude<AdminOperationalSearchCategory, "stock">;
```

## CONST-CATEGORY_PAGE_KEYS

src/App.tsx:428-442

```typescript
CATEGORY_PAGE_KEYS: Record<SearchTableCategory, AdminPageKey[]> = {
  job: [
    "jobs",
    "my-queue",
    "today-queue",
    "material-requests",
    "my-tasks",
    "ready-to-invoice",
  ],
  customer: ["customers"],
  vehicle: ["vehicles"],
  invoice: ["jobs", "my-queue", "invoice"],
  payment: ["admin-console"],
  stock: ["stock"],
}
```

## CONST-SEARCH_CATEGORY_LABELS

src/App.tsx:444-451

```typescript
SEARCH_CATEGORY_LABELS: Record<SearchTableCategory, string> = {
  job: "Job Card",
  customer: "Customer",
  vehicle: "Vehicle",
  invoice: "Invoice",
  payment: "Payments",
  stock: "Stock",
}
```

## CONST-ADMIN_OPERATIONAL_SEARCH_CATEGORIES

src/App.tsx:452-460

```typescript
ADMIN_OPERATIONAL_SEARCH_CATEGORIES: readonly AdminOperationalSearchCategory[] =
  [
    "material-requests",
    "issue-material",
    "reconcile",
    "stock",
    "estimate",
    "follow-ups",
  ]
```

## CONST-ADMIN_OPERATIONAL_SEARCH_LABELS

src/App.tsx:493-503

```typescript
ADMIN_OPERATIONAL_SEARCH_LABELS: Record<
  AdminOperationalSearchCategory,
  string
> = {
  "material-requests": "Material Requests",
  "issue-material": "Issue Material",
  reconcile: "Reconcile Stock",
  stock: "Stock",
  estimate: "Estimate",
  "follow-ups": "Follow-ups",
}
```

## CONST-SEARCH_MONTH_YEAR_FORMATTER

src/App.tsx:504-508

```typescript
SEARCH_MONTH_YEAR_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})
```

## TYPE-PaymentSearchRow

src/App.tsx:509-509

```typescript
type PaymentSearchRow = { view: JobView; payment: Payment };
```

## TYPE-DashboardDrilldown

src/App.tsx:510-519

```typescript
type DashboardDrilldown = {
  destination: string;
  month?: string;
  date?: string;
  status?: string;
  category?: SearchTableCategory;
  lowStockOnly?: boolean;
  stockTab?: "Inventory List" | "Low Stock";
  served?: "customers" | "vehicles";
};
```

## TYPE-ProcurementDraft

src/App.tsx:1454-1457

```typescript
type ProcurementDraft = {
  lines: PurchaseRequestInput["lines"];
  source: string;
};
```

## CONST-SEARCH_STATUS_OPTIONS

src/App.tsx:1763-1770

```typescript
SEARCH_STATUS_OPTIONS: (MainStatus | "ALL")[] = [
  "ALL",
  "NEW",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "CLOSED",
]
```

## TYPE-ServiceListKind

src/App.tsx:3639-3639

```typescript
type ServiceListKind = "job-cards" | "estimates" | "followups";
```

## TYPE-PurchaseFormLine

src/App.tsx:5086-5086

```typescript
type PurchaseFormLine = InwardPurchaseLineInput & { key: string };
```

## TYPE-PurchaseRequestFormLine

src/App.tsx:5088-5095

```typescript
type PurchaseRequestFormLine = {
  key: string;
  new_item: boolean;
  item_id?: number;
  item_name?: string;
  unit?: string;
  ordered_qty: number;
};
```

## TYPE-PurchaseRequestApprovalFormLine

src/App.tsx:5097-5107

```typescript
type PurchaseRequestApprovalFormLine = {
  purchase_order_line_id: number;
  supplier_id: number;
  unit_cost: number;
  sku: string;
  category: string;
  name: string;
  unit: string;
  low_stock_qty: number;
  selling_price: number;
};
```

## TYPE-StoreListKind

src/App.tsx:8123-8123

```typescript
type StoreListKind = "stock" | "requests" | "issue" | "reconcile";
```

## TYPE-StoreRequestRow

src/App.tsx:8124-8128

```typescript
type StoreRequestRow = {
  view: JobView;
  request: MaterialRequest;
  item?: InventoryItem;
};
```

## TYPE-StorePurchaseRow

src/App.tsx:8129-8129

```typescript
type StorePurchaseRow = { view: JobView; purchase: LocalPurchase };
```

## TYPE-StoreHistoryRow

src/App.tsx:8130-8130

```typescript
type StoreHistoryRow = StoreRequestRow | StorePurchaseRow;
```

## TYPE-DashboardMetric

src/App.tsx:9444-9451

```typescript
type DashboardMetric = {
  label: string;
  value: string | number;
  tone: string;
  drilldown: DashboardDrilldown;
  layout?: "primary" | "projection" | "supporting" | "secondary";
  context?: string;
};
```

## TYPE-DashboardCard

src/App.tsx:9452-9459

```typescript
type DashboardCard = {
  title: string;
  subtitle: string;
  tone: string;
  action: string;
  drilldown: DashboardDrilldown;
  metrics: DashboardMetric[];
};
```

## TYPE-ManagementArea

src/App.tsx:9861-9861

```typescript
type ManagementArea = (typeof managementAreas)[number];
```

## TYPE-RemoteDraft

src/App.tsx:11223-11226

```typescript
type RemoteDraft = Pick<
  AdminUser,
  "id" | "name" | "email" | "roleIds" | "branchIds" | "version"
>;
```

## TYPE-EstimateDraftRow

src/App.tsx:12726-12734

```typescript
type EstimateDraftRow = {
  key: string;
  kind: "Service" | "Material";
  description: string;
  qty: number;
  rate: number;
  gst_type: GstType;
  gst_rate: number;
};
```

## CONST-GST_RATE_OPTIONS

src/App.tsx:12735-12738

```typescript
GST_RATE_OPTIONS = GST_RATES.map((rate) => ({
  value: rate,
  label: `${rate}%`,
}))
```

## TYPE-DocumentEditor

src/App.tsx:15489-15489

```typescript
type DocumentEditor = "estimate" | "approve-estimate" | "invoice" | undefined;
```

## TYPE-EntityKind

src/App.tsx:17536-17536

```typescript
type EntityKind = "jobs" | "customers" | "vehicles" | "media";
```

## TYPE-EntityFilters

src/App.tsx:17537-17548

```typescript
type EntityFilters = {
  search: string;
  primary: string;
  secondary: string;
  date: string;
  month: string;
  customer: string;
  vehicle: string;
  advisor: string;
  sort: string;
  archivedOnly: boolean;
};
```

## TYPE-JobCardFilterValues

src/App.tsx:17550-17553

```typescript
type JobCardFilterValues = Pick<
  EntityFilters,
  "search" | "primary" | "secondary" | "date" | "month" | "customer" | "advisor" | "sort" | "archivedOnly"
>;
```

## CONST-CHIP_LABELS

src/App.tsx:19085-19090

```typescript
CHIP_LABELS: Record<string, string> = {
  estimate: "Est",
  invoice: "Inv",
  "payment-receipt": "Rcpt",
  "gate-pass": "GP",
}
```

## TYPE-Mutate

src/App.tsx:19596-19599

```typescript
export type Mutate = (
  action: (database: Database) => void,
  onError?: (message: string) => void,
) => boolean;
```

## TYPE-CognitoConfig

src/auth.ts:1-10

```typescript
export type CognitoConfig = {
  mode: "cognito";
  clientId: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  logoutEndpoint: string;
  callbackUri: string;
  logoutUri: string;
  scopes: string[];
};
```

## TYPE-AuthConfig

src/auth.ts:12-12

```typescript
export type AuthConfig = CognitoConfig | { mode: "local"; allowDemo: boolean };
```

## TYPE-SessionMembership

src/auth.ts:14-25

```typescript
export type SessionMembership = {
  id: string;
  displayName: string;
  email: string;
  status: "INVITED" | "ACTIVE" | "ARCHIVED";
  roleIds: string[];
  roles: Array<{ id: string; name: string; permissions: string[] }>;
  branchIds: string[];
  branches: Array<{ id: string; name: string }>;
  permissions: string[];
  version: number;
};
```

## TYPE-WorkshopSession

src/auth.ts:27-27

```typescript
export type WorkshopSession = { membership: SessionMembership; tenant: { id: string; name: string } };
```

## TYPE-Tokens

src/auth.ts:29-29

```typescript
type Tokens = { accessToken: string; refreshToken?: string; expiresAt: number };
```

## CONST-TOKEN_KEY

src/auth.ts:30-30

```typescript
TOKEN_KEY = "workshopos.cognito.tokens.v1"
```

## CONST-OAUTH_KEY

src/auth.ts:31-31

```typescript
OAUTH_KEY = "workshopos.cognito.oauth.v1"
```

## TYPE-BillingMode

src/billing-manager.tsx:22-22

```typescript
export type BillingMode = "Invoices" | "Payments" | "Delivery";
```

## TYPE-Mutate

src/billing-manager.tsx:23-23

```typescript
type Mutate = (action: (database: Database) => void, onError?: (message: string) => void) => boolean;
```

## TYPE-BillingRecord

src/billing-manager.tsx:24-24

```typescript
type BillingRecord = { key: string; view: JobView; payment?: Payment; kind?: PaymentListKind };
```

## TYPE-InvoiceItemDraft

src/billing-manager.tsx:25-25

```typescript
type InvoiceItemDraft = { id?: number; kind: "Service" | "Material"; description: string; qty: number; rate: number; gst_type: GstType; gst_rate: number; material_row_id?: number };
```

## CONST-GST_RATE_OPTIONS

src/billing-manager.tsx:26-26

```typescript
GST_RATE_OPTIONS = GST_RATES.map((rate) => ({ value: rate, label: `${rate}%` }))
```

## TYPE-InvoiceDialogProps

src/billing-manager.tsx:270-278

```typescript
export interface InvoiceDialogProps {
  action: "create" | "view" | "edit";
  view: JobView;
  candidates?: JobView[];
  fixedJob?: boolean;
  actor: User;
  mutate: Mutate;
  onClose: () => void;
}
```

## TYPE-BodyMarkMeta

src/body-mark.tsx:5-11

```typescript
export interface BodyMarkMeta {
  jobNo?: string;
  vehicleName: string;
  color?: string;
  regNo: string;
  recordedAt?: string | null;
}
```

## TYPE-Mutate

src/booking-calendar.tsx:9-9

```typescript
type Mutate = (action: (database: Database) => void, onError?: (message: string) => void) => boolean;
```

## TYPE-BookingDraft

src/booking-calendar.tsx:25-25

```typescript
type BookingDraft = { customerName: string; mobile: string; customerType: string; vehicleNo: string; make: string; model: string; color: string; requestedWork: string; serviceType: BookingServiceType; bookingDate: string; arrivalWindow: BookingArrivalWindow; capacityOverrideReason: string; };
```

## TYPE-Mutate

src/booking-check-in.tsx:9-9

```typescript
type Mutate = (action: (database: Database) => void, onError?: (message: string) => void) => boolean;
```

## TYPE-FuelUnit

src/booking-check-in.tsx:10-10

```typescript
type FuelUnit = "bars" | "%" | "litres" | "Other";
```

## TYPE-Mutate

src/booking-expected-today.tsx:20-20

```typescript
type Mutate = (action: (database: Database) => void, onError?: (message: string) => void) => boolean;
```

## TYPE-Action

src/booking-expected-today.tsx:21-21

```typescript
type Action = "call" | "reschedule" | "cancel" | "no-show" | "check-in";
```

## TYPE-ExpectedTodayFilter

src/booking-followup.ts:3-3

```typescript
export type ExpectedTodayFilter = "ALL" | "NEEDS_FOLLOW_UP" | "CALLED";
```

## TYPE-ExpectedBookingRow

src/booking-followup.ts:5-9

```typescript
export interface ExpectedBookingRow {
  booking: Booking;
  calls: BookingCallLog[];
  lastCall?: BookingCallLog;
}
```

## TYPE-DashboardFacts

src/dashboard-metrics.ts:3-26

```typescript
export type DashboardFacts = {
  currentMonth: string;
  monthLabel: string;
  cashflowMonth: string;
  cashflowMonthLabel: string;
  cashflowMonthComplete: boolean;
  daysElapsed: number;
  daysInMonth: number;
  activeToday: number;
  totalVisits: number;
  inProgress: number;
  closed: number;
  onHold: number;
  customersServed: number;
  vehiclesServed: number;
  invoicesGenerated: number;
  paymentsReceived: number;
  totalCollections: number;
  projectedMonthlyCollection: number;
  lowStock: number;
  pendingApprovals: number;
  materialRequests: number;
  materialsIssued: number;
};
```

## TYPE-CashflowFacts

src/dashboard-metrics.ts:30-40

```typescript
export type CashflowFacts = {
  month: string;
  monthLabel: string;
  monthComplete: boolean;
  daysElapsed: number;
  daysInMonth: number;
  invoicesGenerated: number;
  paymentsReceived: number;
  totalCollections: number;
  projectedMonthlyCollection: number;
};
```

## TYPE-DataFlowFilters

src/data-flow.ts:6-10

```typescript
export interface DataFlowFilters {
  query: string;
  month: string;
  date: string;
}
```

## TYPE-DataFlowEventKind

src/data-flow.ts:36-36

```typescript
export type DataFlowEventKind = "visit" | "checklist" | "status" | "estimate" | "invoice" | "payment" | "document" | "media" | "material";
```

## TYPE-DataFlowEvent

src/data-flow.ts:38-48

```typescript
export interface DataFlowEvent {
  id: string;
  kind: DataFlowEventKind;
  timestamp: string;
  title: string;
  detail: string;
  actor?: string;
  state?: "current" | "historical" | "voided" | "archived";
  /** Set on document-creating events so the page can offer a PDF button. */
  document?: { kind: DocumentKind; number: string; void?: boolean };
}
```

## TYPE-LifecycleSummary

src/data-flow.ts:50-56

```typescript
export interface LifecycleSummary {
  stage: string;
  cycle: number | null;
  activeStep: string;
  remainingSteps: string[];
  completed: boolean;
}
```

## TYPE-GhostStep

src/data-flow.ts:162-167

```typescript
export interface GhostStep {
  id: string;
  kind: "checklist" | "document";
  title: string;
  reason: string;
}
```

## TYPE-StageRow

src/data-flow.ts:188-194

```typescript
export interface StageRow {
  id: string;
  label: string;
  value: string;
  done: boolean;
  document?: DocumentKind;
}
```

## CONST-STORAGE_KEY

src/db.ts:102-102

```typescript
STORAGE_KEY = "workshopos.sqlite.v2"
```

## CONST-DELIVERY_DATES_MIGRATION_KEY

src/db.ts:103-103

```typescript
DELIVERY_DATES_MIGRATION_KEY = "workshopos.delivery-dates.2026-10-09.v1"
```

## CONST-DEFAULT_SERVICE_WORK_BOOKING_CAPACITY

src/db.ts:104-104

```typescript
DEFAULT_SERVICE_WORK_BOOKING_CAPACITY = 8
```

## CONST-DEFAULT_GENERAL_CHECKUP_FOLLOWUP_BOOKING_CAPACITY

src/db.ts:105-105

```typescript
DEFAULT_GENERAL_CHECKUP_FOLLOWUP_BOOKING_CAPACITY = 4
```

## TYPE-DbValue

src/db.ts:110-110

```typescript
type DbValue = number | string | Uint8Array | null;
```

## CONST-LIFECYCLE_CHECKLIST

src/db.ts:112-131

```typescript
LIFECYCLE_CHECKLIST: Record<ChecklistStage, readonly SubStatus[]> =
  {
    NEW: ["Gather Requirements", "Create Estimate", "Get Confirmation"],
    IN_PROGRESS: [
      "Material Requested",
      "Material Issued",
      "Washing Needed",
      "Work Started",
      "Follow-up Needed",
      "Photos Shared",
      "QC Pending",
    ],
    COMPLETED: [
      "Customer Verification",
      "Invoice Ready",
      "Remind Customer for Sharing Google Review/Feedback",
      "Payment Received",
    ],
    CLOSED: ["Receipt Generated", "Gate Pass Generated", "Delivered"],
  }
```

## CONST-UNASSIGNED_ADVISOR

src/db.ts:606-612

```typescript
UNASSIGNED_ADVISOR: User = {
  id: 0,
  email: "",
  name: "Not mapped",
  role: "service",
  password: "",
}
```

## CONST-ADVISOR_NOT_MAPPED_LABEL

src/db.ts:613-613

```typescript
ADVISOR_NOT_MAPPED_LABEL = "Pending - Service Advisor not mapped"
```

## TYPE-BookingInput

src/db.ts:1348-1364

```typescript
export interface BookingInput {
  customerId?: number;
  vehicleId?: number;
  customerName: string;
  mobile: string;
  customerType?: string;
  vehicleNo: string;
  make: string;
  model: string;
  color?: string;
  requestedWork: string;
  serviceType: BookingServiceType;
  bookingDate: string;
  arrivalWindow?: BookingArrivalWindow;
  /** Required only when an Admin deliberately books over the selected date's capacity. */
  capacityOverrideReason?: string;
}
```

## TYPE-BookingCheckInInput

src/db.ts:1367-1375

```typescript
export interface BookingCheckInInput {
  odoReading: number;
  fuelLevelValue: string;
  fuelLevelUnit: "bars" | "%" | "litres" | "Other";
  keys: string;
  accessories: string;
  requestedWork: string;
  damageMarks?: string;
}
```

## CONST-BOOKING_WINDOWS

src/db.ts:1377-1382

```typescript
BOOKING_WINDOWS: readonly BookingArrivalWindow[] = [
  "",
  "Morning",
  "Afternoon",
  "Evening",
]
```

## CONST-TERMINAL_BOOKING_STATUSES

src/db.ts:1383-1387

```typescript
TERMINAL_BOOKING_STATUSES: readonly BookingStatus[] = [
  "Arrived",
  "Cancelled",
  "No-show",
]
```

## CONST-CAPACITY_BOOKING_STATUSES

src/db.ts:1388-1392

```typescript
CAPACITY_BOOKING_STATUSES: readonly BookingStatus[] = [
  "Booked",
  "Confirmed",
  "Rescheduled",
]
```

## CONST-MAIN_STATUS_TRANSITIONS

src/db.ts:2043-2050

```typescript
MAIN_STATUS_TRANSITIONS: Record<MainStatus, MainStatus[]> = {
  NEW: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED", "HOLD", "CANCELLED"],
  HOLD: ["IN_PROGRESS", "CANCELLED"],
  COMPLETED: ["IN_PROGRESS"],
  CANCELLED: [],
  CLOSED: [],
}
```

## TYPE-EstimateDraftInput

src/db.ts:2391-2401

```typescript
export interface EstimateDraftInput {
  discount: number;
  gst_rate: number;
  notes: string;
  items: Array<
    Pick<
      EstimateItem,
      "kind" | "description" | "qty" | "rate" | "gst_type" | "gst_rate"
    >
  >;
}
```

## TYPE-JobSheetInput

src/db.ts:2571-2579

```typescript
export interface JobSheetInput {
  service_type?: string;
  pickup_drop?: string;
  estimated_delivery?: string;
  fuel?: string;
  accessories?: string;
  engine_no?: string;
  address?: string;
}
```

## TYPE-JobDetailsInput

src/db.ts:2581-2589

```typescript
export interface JobDetailsInput extends JobSheetInput {
  advisor_id?: number;
  technician_id?: number;
  work_list?: string;
  promised_at?: string;
  advisor_notes?: string;
  customer_instructions?: string;
  internal_instructions?: string;
}
```

## TYPE-LocalPurchaseInput

src/db.ts:2956-2959

```typescript
type LocalPurchaseInput = Omit<
  LocalPurchase,
  "id" | "archived_at" | "archived_reason" | "created_at" | "updated_at"
>;
```

## TYPE-MaterialPurchaseRequestInput

src/db.ts:3028-3032

```typescript
export interface MaterialPurchaseRequestInput {
  item_name: string;
  quantity: number;
  unit: string;
}
```

## TYPE-PurchaseStockAndIssueInput

src/db.ts:3034-3042

```typescript
export interface PurchaseStockAndIssueInput {
  inventory_item_id?: number;
  sku?: string;
  category?: string;
  unit_cost: number;
  vendor: string;
  bill_reference: string;
  note?: string;
}
```

## TYPE-SupplierInput

src/db.ts:3083-3090

```typescript
export interface SupplierInput {
  name: string;
  contact_name?: string;
  phone?: string;
  email?: string;
  gstin?: string;
  status?: SupplierStatus;
}
```

## TYPE-InwardPurchaseLineInput

src/db.ts:3092-3100

```typescript
export interface InwardPurchaseLineInput {
  /** Present on approved receipts so each actual receipt row reconciles to its frozen PO row. */
  purchase_order_line_id?: number | null;
  item_id: number;
  received_qty: number;
  unit_cost: number;
  discount?: number;
  gst_rate?: number;
}
```

## TYPE-InwardPurchaseAttachmentInput

src/db.ts:3102-3108

```typescript
export interface InwardPurchaseAttachmentInput {
  original_name: string;
  mime_type: string;
  byte_size: number;
  /** Production adapters persist this private object key instead of a browser data URL. */
  document_url: string;
}
```

## TYPE-InwardPurchaseDraftInput

src/db.ts:3110-3117

```typescript
export interface InwardPurchaseDraftInput {
  supplier_id?: number;
  supplier_invoice_no?: string;
  invoice_date?: string;
  po_number?: string;
  lines?: InwardPurchaseLineInput[];
  attachments?: InwardPurchaseAttachmentInput[];
}
```

## TYPE-InwardPurchaseRevisionInput

src/db.ts:3785-3788

```typescript
export interface InwardPurchaseRevisionInput {
  reason: string;
  lines: InwardPurchaseLineInput[];
}
```

## TYPE-PurchaseOrderLineInput

src/db.ts:3790-3796

```typescript
export interface PurchaseOrderLineInput {
  item_id: number;
  ordered_qty: number;
  unit_cost: number;
  discount?: number;
  gst_rate?: number;
}
```

## TYPE-PurchaseOrderInput

src/db.ts:3797-3803

```typescript
export interface PurchaseOrderInput {
  supplier_id: number;
  po_number: string;
  order_date: string;
  notes?: string;
  lines: PurchaseOrderLineInput[];
}
```

## TYPE-PurchaseRequestLineInput

src/db.ts:3806-3808

```typescript
export type PurchaseRequestLineInput =
  | { item_id: number; ordered_qty: number }
  | { item_name: string; unit: string; ordered_qty: number };
```

## TYPE-PurchaseRequestInput

src/db.ts:3810-3814

```typescript
export interface PurchaseRequestInput {
  order_date: string;
  notes?: string;
  lines: PurchaseRequestLineInput[];
}
```

## TYPE-NewItemSkuInput

src/db.ts:3816-3823

```typescript
export interface NewItemSkuInput {
  sku: string;
  category: string;
  name: string;
  unit: string;
  low_stock_qty: number;
  selling_price: number;
}
```

## TYPE-PurchaseRequestApprovalLineInput

src/db.ts:3825-3831

```typescript
export interface PurchaseRequestApprovalLineInput {
  purchase_order_line_id: number;
  supplier_id: number;
  unit_cost: number;
  /** Required when approving a New Item Request that has no SKU yet. */
  inventory_item?: NewItemSkuInput;
}
```

## TYPE-PurchaseRequestApprovalInput

src/db.ts:3833-3835

```typescript
export interface PurchaseRequestApprovalInput {
  lines: PurchaseRequestApprovalLineInput[];
}
```

## TYPE-PurchaseOrderQuotationInput

src/db.ts:3837-3844

```typescript
export interface PurchaseOrderQuotationInput {
  purchase_order_line_id: number;
  supplier_name: string;
  quote_date?: string;
  quoted_qty: number;
  unit_cost: number;
  notes?: string;
}
```

## TYPE-PreviousPurchaseRecord

src/db.ts:3846-3851

```typescript
export interface PreviousPurchaseRecord {
  supplier_name: string;
  purchase_date: string;
  unit_cost: number;
  quantity: number;
}
```

## TYPE-PurchaseOrderReceiptInput

src/db.ts:4208-4211

```typescript
export interface PurchaseOrderReceiptInput {
  note?: string;
  lines: Array<{ purchase_order_line_id: number; delivered_qty: number }>;
}
```

## TYPE-PurchaseOrderConfirmationInput

src/db.ts:4252-4254

```typescript
export interface PurchaseOrderConfirmationInput {
  lines: Array<{ purchase_order_line_id: number; accepted_qty: number; returned_qty: number; damaged_qty: number; wasted_qty: number }>;
}
```

## CONST-MATERIAL_ACTION_VERB

src/db.ts:4865-4873

```typescript
MATERIAL_ACTION_VERB: Record<MaterialRowAction, string> = {
  release: "released",
  "edit-issued": "edited",
  request: "requested",
  edit: "edited",
  "re-request": "re-requested",
  cancel: "cancelled",
  delete: "deleted",
}
```

## TYPE-InvoiceItemInput

src/db.ts:5654-5662

```typescript
export interface InvoiceItemInput {
  kind: "Service" | "Material";
  description: string;
  qty: number;
  rate: number;
  gst_type?: GstType | null;
  gst_rate?: number | null;
  material_row_id?: number;
}
```

## TYPE-CreateInvoiceInput

src/db.ts:5664-5670

```typescript
export interface CreateInvoiceInput {
  tallyInvoiceNo: string;
  discount?: number;
  gstRate?: number;
  items?: InvoiceItemInput[];
  notes: string;
}
```

## TYPE-InvoiceFieldsInput

src/db.ts:5671-5675

```typescript
export interface InvoiceFieldsInput {
  tallyInvoiceNo: string;
  discount: number;
  notes: string;
}
```

## TYPE-InvoiceEditorInput

src/db.ts:6122-6125

```typescript
export interface InvoiceEditorInput extends InvoiceFieldsInput {
  items: Array<InvoiceItemInput & { id?: number }>;
  note?: string;
}
```

## TYPE-PaymentInput

src/db.ts:6304-6309

```typescript
export interface PaymentInput {
  mode: PaymentMode;
  otherDetail: string;
  reference: string;
  notes?: string;
}
```

## CONST-PAYMENT_MODES

src/db.ts:6310-6316

```typescript
PAYMENT_MODES: readonly PaymentMode[] = [
  "UPI",
  "Cash",
  "Card",
  "Bank transfer",
  "Other",
]
```

## TYPE-JobPhotoInput

src/db.ts:6827-6834

```typescript
export interface JobPhotoInput {
  label: string;
  category: JobMediaCategory;
  src: string;
  originalName: string;
  width: number;
  height: number;
}
```

## CONST-OPTIONAL_CHECKLIST_ITEMS

src/db.ts:7667-7670

```typescript
OPTIONAL_CHECKLIST_ITEMS: readonly SubStatus[] = [
  "Washing Needed",
  "Follow-up Needed",
]
```

## CONST-DOCUMENT_GATED_ITEMS

src/db.ts:7672-7685

```typescript
DOCUMENT_GATED_ITEMS: Partial<
  Record<SubStatus, { table: string; noun: string; live: string }>
> = {
  "Create Estimate": {
    table: "estimates",
    noun: "estimate",
    live: "archived_at is null",
  },
  "Invoice Ready": {
    table: "invoices",
    noun: "invoice",
    live: "voided_at is null",
  },
}
```

## TYPE-LocalLeadInput

src/db.ts:8557-8557

```typescript
export type LocalLeadInput = Omit<SalesLead, "id" | "created_at" | "updated_at" | "company_not_entered" | "email_not_entered" | "site_visit_completed"> & { company_not_entered?: number; email_not_entered?: number; site_visit_completed?: number };
```

## TYPE-LocalQuotationInput

src/db.ts:8558-8558

```typescript
export type LocalQuotationInput = { lead_id: number; valid_until?: string | null; customer_notes?: string; discount?: number; template_id: string; template_html: string; lines: Array<Omit<SalesQuotationLine, "id" | "quotation_id" | "line_no">> };
```

## CONST-DEVELOPER_EMAIL

src/developer-control-plane.ts:3-3

```typescript
DEVELOPER_EMAIL = "developer@admin.com"
```

## CONST-DEVELOPER_PASSWORD

src/developer-control-plane.ts:4-4

```typescript
DEVELOPER_PASSWORD = "admin123"
```

## CONST-DEVELOPER_CONTROL_PLANE_VERSION

src/developer-control-plane.ts:5-5

```typescript
DEVELOPER_CONTROL_PLANE_VERSION = 1
```

## CONST-DEVELOPER_CONTROL_PLANE_STORAGE_KEY

src/developer-control-plane.ts:6-6

```typescript
DEVELOPER_CONTROL_PLANE_STORAGE_KEY = `workshopos.developer-control-plane.v${DEVELOPER_CONTROL_PLANE_VERSION}`
```

## TYPE-TenantLifecycle

src/developer-control-plane.ts:8-8

```typescript
export type TenantLifecycle = "active" | "disabled";
```

## TYPE-EmulationRole

src/developer-control-plane.ts:9-9

```typescript
export type EmulationRole = "admin" | "service" | "reception" | "accounts" | "tech";
```

## TYPE-TenantProfile

src/developer-control-plane.ts:11-22

```typescript
export interface TenantProfile {
  name: string;
  brandName: string;
  address: string;
  contactName: string;
  email: string;
  phone: string;
  gstin: string;
  timezone: string;
  currency: string;
  invoicePrefix: string;
}
```

## TYPE-DemoTenant

src/developer-control-plane.ts:24-29

```typescript
export interface DemoTenant {
  id: string;
  lifecycle: TenantLifecycle;
  profile: TenantProfile;
  createdAt: string;
}
```

## TYPE-CommunicationChannel

src/developer-control-plane.ts:31-34

```typescript
export interface CommunicationChannel {
  active: boolean;
  sender: string;
}
```

## TYPE-CommunicationLog

src/developer-control-plane.ts:36-43

```typescript
export interface CommunicationLog {
  id: string;
  channel: "email" | "whatsapp";
  tenantId: string;
  recipient: string;
  result: "simulated" | "blocked";
  createdAt: string;
}
```

## TYPE-PlatformChargePayment

src/developer-control-plane.ts:45-45

```typescript
export interface PlatformChargePayment { id: string; amount: number; paidAt: string; note: string; }
```

## TYPE-PlatformCharge

src/developer-control-plane.ts:46-54

```typescript
export interface PlatformCharge {
  id: string;
  tenantId: string;
  description: string;
  amount: number;
  dueDate: string;
  payments: PlatformChargePayment[];
  createdAt: string;
}
```

## TYPE-DeveloperControlPlaneState

src/developer-control-plane.ts:56-63

```typescript
export interface DeveloperControlPlaneState {
  version: number;
  tenants: DemoTenant[];
  selectedTenantId: string;
  communications: { email: CommunicationChannel; whatsapp: CommunicationChannel };
  communicationLogs: CommunicationLog[];
  charges: PlatformCharge[];
}
```

## TYPE-SessionStorageLike

src/developer-control-plane.ts:65-65

```typescript
export interface SessionStorageLike { getItem(key: string): string | null; setItem(key: string, value: string): void; removeItem(key: string): void; }
```

## CONST-EMULATION_ROLE_LABELS

src/developer-control-plane.ts:69-71

```typescript
EMULATION_ROLE_LABELS: Record<EmulationRole, string> = {
  admin: "Owner/Admin", service: "Service", reception: "Reception", accounts: "Accounts", tech: "Technician",
}
```

## TYPE-DocumentSnapshot

src/document-snapshots.ts:10-23

```typescript
export interface DocumentSnapshot {
  id: string;
  jobId: number;
  jobNo: string;
  kind: DocumentKind;
  number: string;
  state: "frozen" | "void";
  templateId: string;
  html: string;
  values: Record<string, string>;
  lines: ReportLine[];
  frozenAt: string;
  voidedAt?: string;
}
```

## CONST-DOCUMENT_SNAPSHOT_KEY

src/document-snapshots.ts:25-25

```typescript
DOCUMENT_SNAPSHOT_KEY = "workshopos.documentSnapshots.v1"
```

## TYPE-SnapshotStorage

src/document-snapshots.ts:27-27

```typescript
export interface SnapshotStorage { getItem(key: string): string | null; setItem(key: string, value: string): void; removeItem?(key: string): void }
```

## TYPE-Templates

src/document-snapshots.ts:48-48

```typescript
type Templates = Pick<AdminDemoState, "reportTemplates" | "businessSettings" | "companyAssets">;
```

## TYPE-ExportColumn

src/export-utils.ts:4-7

```typescript
export interface ExportColumn<T> {
  header: string;
  value: (row: T) => string | number;
}
```

## TYPE-ExportReport

src/export-utils.ts:9-15

```typescript
export interface ExportReport<T> {
  title: string;
  filters: string[];
  columns: ExportColumn<T>[];
  rows: T[];
  generatedAt?: Date;
}
```

## TYPE-RemoteFinancialDocument

src/finance-api.ts:3-3

```typescript
export type RemoteFinancialDocument = { id: number; jobId: number; type: "INVOICE" | "RECEIPT" | "GATE_PASS"; number: string; fiscalYear: string; templateVersion: string; issuedAt: string; voided: boolean; contentPath: string };
```

## TYPE-RemoteInvoiceLine

src/finance-api.ts:4-4

```typescript
export type RemoteInvoiceLine = { lineNo: number; description: string; quantity: number; unitAmountPaise: number; gstRateBps: number; taxablePaise: number; taxPaise: number; totalPaise: number };
```

## TYPE-RemoteInvoice

src/finance-api.ts:5-5

```typescript
export type RemoteInvoice = { id: number; jobId: number; documentId: number; number: string; fiscalYear: string; subtotalPaise: number; discountPaise: number; taxPaise: number; totalPaise: number; paidPaise: number; creditedPaise: number; balancePaise: number; status: "UNPAID" | "PARTIAL" | "SETTLED" | "CREDITED" | "VOID"; voided: boolean; issuedAt: string; contentPath: string; lines: RemoteInvoiceLine[] };
```

## TYPE-RemotePayment

src/finance-api.ts:6-6

```typescript
export type RemotePayment = { id: number; invoiceId: number; receiptDocumentId: number; receiptNumber: string; amountPaise: number; method: "CASH" | "CARD" | "UPI" | "BANK_TRANSFER" | "OTHER"; reference: string; payer: string; receivedAt: string; contentPath: string; supportingAttachmentPath: string | null };
```

## TYPE-RemoteHandover

src/finance-api.ts:7-7

```typescript
export type RemoteHandover = { id: number; jobId: number; invoiceId: number; gatePassDocumentId: number; gatePassNumber: string; deliveredBy: string; finalOdometer: number; acknowledgement: string; handoverAt: string; contentPath: string };
```

## TYPE-RemoteCreditNote

src/finance-api.ts:8-8

```typescript
export type RemoteCreditNote = { id: number; invoiceId: number; documentId: number; number: string; amountPaise: number; reason: string; refundedPaise: number; issuedAt: string; contentPath: string };
```

## TYPE-RemoteFollowup

src/followups-api.ts:3-8

```typescript
export type RemoteFollowup = {
  id: number; jobId: number; branchId: string; jobNo: string; customerName: string; vehicleNo: string;
  note: string; dueAt: string | null; status: "OPEN" | "COMPLETED"; outcome: string;
  completedAt: string | null; archivedAt: string | null; archiveReason: string | null; version: number;
  createdAt: string; updatedAt: string;
};
```

## TYPE-FollowupJob

src/followups-api.ts:9-9

```typescript
export type FollowupJob = { id: number; branchId: string; jobNo: string; status: string; customerName: string; vehicleNo: string };
```

## TYPE-SearchResult

src/followups-api.ts:10-10

```typescript
export type SearchResult = { entity: "customer" | "vehicle" | "job" | "invoice"; id: number; branchId: string; title: string; subtitle: string; rank: number };
```

## CONST-INVENTORY_IMPORT_FIELDS

src/inventory-import.ts:4-11

```typescript
INVENTORY_IMPORT_FIELDS = [
  "sku",
  "name",
  "category",
  "unit",
  "stock_qty",
  "low_stock_qty",
] as const
```

## TYPE-InventoryImportField

src/inventory-import.ts:13-13

```typescript
export type InventoryImportField = (typeof INVENTORY_IMPORT_FIELDS)[number];
```

## TYPE-InventoryColumnMapping

src/inventory-import.ts:14-14

```typescript
export type InventoryColumnMapping = Partial<Record<InventoryImportField, string>>;
```

## TYPE-InventoryImportSourceRow

src/inventory-import.ts:15-15

```typescript
export type InventoryImportSourceRow = Record<string, unknown>;
```

## TYPE-ParsedInventoryWorkbook

src/inventory-import.ts:17-21

```typescript
export interface ParsedInventoryWorkbook {
  sheetName: string;
  headers: string[];
  rows: InventoryImportSourceRow[];
}
```

## TYPE-InventoryImportIssueCode

src/inventory-import.ts:23-30

```typescript
export type InventoryImportIssueCode =
  | "MISSING_MAPPING"
  | "UNKNOWN_COLUMN"
  | "MISSING_VALUE"
  | "INVALID_QUANTITY"
  | "NEGATIVE_QUANTITY"
  | "DUPLICATE_SKU_FILE"
  | "DUPLICATE_SKU_EXISTING";
```

## TYPE-InventoryImportIssue

src/inventory-import.ts:32-36

```typescript
export interface InventoryImportIssue {
  code: InventoryImportIssueCode;
  field: InventoryImportField;
  message: string;
}
```

## TYPE-ValidInventoryImportRow

src/inventory-import.ts:38-42

```typescript
export interface ValidInventoryImportRow {
  sourceRowNumber: number;
  source: InventoryImportSourceRow;
  item: InventoryItem;
}
```

## TYPE-RejectedInventoryImportRow

src/inventory-import.ts:44-49

```typescript
export interface RejectedInventoryImportRow {
  sourceRowNumber: number;
  source: InventoryImportSourceRow;
  normalized: Partial<Omit<InventoryItem, "id">>;
  issues: InventoryImportIssue[];
}
```

## TYPE-InventoryImportPreview

src/inventory-import.ts:51-56

```typescript
export interface InventoryImportPreview {
  totalRows: number;
  validRows: ValidInventoryImportRow[];
  rejectedRows: RejectedInventoryImportRow[];
  mappingIssues: InventoryImportIssue[];
}
```

## CONST-FIELD_ALIASES

src/inventory-import.ts:58-65

```typescript
FIELD_ALIASES: Record<InventoryImportField, string[]> = {
  sku: ["sku", "stockkeepingunit", "itemcode", "productcode", "partcode", "partnumber"],
  name: ["name", "itemname", "productname", "itemdescription", "description"],
  category: ["category", "itemcategory", "productcategory", "group", "itemgroup"],
  unit: ["unit", "uom", "unitofmeasure", "measure"],
  stock_qty: ["stockqty", "stockquantity", "openingqty", "openingquantity", "openingstock", "quantity", "qty"],
  low_stock_qty: ["lowstockqty", "lowstockthreshold", "minimumstock", "minstock", "reorderlevel", "reorderqty", "minimumquantity"],
}
```

## CONST-UNIT_PATTERNS

src/inventory-import.ts:91-97

```typescript
UNIT_PATTERNS: [RegExp, string][] = [
  [/\b(ltr|litre|liter)\b|\d\s*l\b/i, "ltr"],
  [/\d\s*ml\b/i, "ml"],
  [/\d\s*kg\b|\bkg\b/i, "kg"],
  [/\d\s*gm?\b|\bgms?\b/i, "g"],
  [/\broll\b/i, "roll"],
]
```

## TYPE-BuildInventoryImportPreviewOptions

src/inventory-import.ts:220-225

```typescript
export interface BuildInventoryImportPreviewOptions {
  headers: string[];
  rows: InventoryImportSourceRow[];
  mapping: InventoryColumnMapping;
  existingInventory?: Pick<InventoryItem, "id" | "sku">[];
}
```

## CONST-INVENTORY_TEMPLATE_HEADERS

src/inventory-import.ts:293-300

```typescript
INVENTORY_TEMPLATE_HEADERS: Record<InventoryImportField, string> = {
  sku: "SKU",
  name: "Item Name",
  category: "Category",
  unit: "Unit",
  stock_qty: "Opening Quantity",
  low_stock_qty: "Low Stock Threshold",
}
```

## CONST-WORKBOOK_INVENTORY_SEED

src/inventory-seed.ts:2-1019

```typescript
WORKBOOK_INVENTORY_SEED: ReadonlyArray<readonly [sku: string, category: string, name: string, unit: string, stock: number, low: number]> = [
 [
  "PPF-001",
  "PPF",
  "TPU Gloss PPF 5yrs warranty [1.5mx15m] (UG)",
  "piece",
  10,
  3
 ],
 [
  "PPF-002",
  "PPF",
  "TPU Matte PPF 5yrs warranty (UG)",
  "piece",
  10,
  3
 ],
 [
  "PPF-003",
  "PPF",
  "Super MAX 7yrs warranty PPF Roll (UG)",
  "piece",
  10,
  3
 ],
 [
  "PPF-004",
  "PPF",
  "Super MAX 10yrs warranty PPF Roll (UG)",
  "piece",
  10,
  3
 ],
 [
  "PPF-005",
  "PPF",
  "Carbon Fibre PPF (UG)",
  "piece",
  10,
  3
 ],
 [
  "PPF-006",
  "PPF",
  "Magic PPF (UG)",
  "piece",
  10,
  3
 ],
 [
  "PPF-007",
  "PPF",
  "Black PPF (UG)",
  "piece",
  10,
  3
 ],
 [
  "PPF-008",
  "PPF",
  "Purple PPF (UG)",
  "piece",
  10,
  3
 ],
 [
  "PPF-009",
  "PPF",
  "Sunroof PPF 8yrs (UG)",
  "piece",
  10,
  3
 ],
 [
  "PPF-010",
  "PPF",
  "Interior Pre Cut Kit for XEV9S (UG)",
  "piece",
  10,
  3
 ],
 [
  "PPF-011",
  "PPF",
  "Interior Pre Cut Kit for ScorpioN (UG)",
  "piece",
  10,
  3
 ],
 [
  "PPF-012",
  "PPF",
  "Interior Pre Cut Kit for 7XO (UG)",
  "piece",
  10,
  3
 ],
 [
  "PPF-013",
  "PPF",
  "50%VLT Nano Carbon Tint Sun Film [30m] (UG)",
  "piece",
  10,
  3
 ],
 [
  "PPF-014",
  "PPF",
  "70%VLT Nano Carbon Tint Sun Film (UG)",
  "piece",
  10,
  3
 ],
 [
  "PPF-015",
  "PPF",
  "50% VLT Nano Ceramic Film 50% [NCT50] (UG)",
  "piece",
  10,
  3
 ],
 [
  "PPF-016",
  "PPF",
  "70%VLT Nano Ceramic Film (UG)",
  "piece",
  10,
  3
 ],
 [
  "PPF-017",
  "PPF",
  "70%VLT Blue Carbon Tint Film (UG)",
  "piece",
  10,
  3
 ],
 [
  "PPF-018",
  "PPF",
  "Primer #94 (3M)",
  "piece",
  10,
  3
 ],
 [
  "PPF-019",
  "PPF",
  "Premium Liquid Wax High Gloss 1Kg (3M)",
  "piece",
  10,
  3
 ],
 [
  "PPF-020",
  "PPF",
  "4-Way Spray Plus 325g (3M)",
  "piece",
  10,
  3
 ],
 [
  "PPF-021",
  "PPF",
  "Double Side Adhesive Tape (3M)",
  "piece",
  10,
  3
 ],
 [
  "PPF-022",
  "PPF",
  "Double Side Adhesive Tape (WURTH)",
  "piece",
  10,
  3
 ],
 [
  "PPF-023",
  "PPF",
  "Glass Ceramic 50ml Super Hydrophobic (Fireball)",
  "piece",
  10,
  3
 ],
 [
  "PPF-024",
  "PPF",
  "Ceramic Coating 40ml #39901 (3M)",
  "piece",
  10,
  3
 ],
 [
  "PPF-025",
  "PPF",
  "Ceramic Coating 50ml 1yr (MAFRA)",
  "piece",
  10,
  3
 ],
 [
  "PPF-026",
  "PPF",
  "Ceramic Coating 50ml (WURTH)",
  "piece",
  10,
  3
 ],
 [
  "PPF-027",
  "PPF",
  "Graphine Coating 50ml (3M)",
  "piece",
  10,
  3
 ],
 [
  "PPF-028",
  "PPF",
  "Graphine Coating 50ml (WURTH)",
  "piece",
  10,
  3
 ],
 [
  "PPF-029",
  "PPF",
  "Rubbing Compound 1Kg (3M)",
  "piece",
  10,
  3
 ],
 [
  "PPF-030",
  "PPF",
  "Heavy Cut Compound 4.5Kg (MAFRA)",
  "piece",
  10,
  3
 ],
 [
  "PPF-031",
  "PPF",
  "Cream Wax 220g (3M)",
  "piece",
  10,
  3
 ],
 [
  "PPF-032",
  "PPF",
  "Cutting Blade [Pro Cut Blade] #1361 (SDI)",
  "piece",
  10,
  3
 ],
 [
  "PPF-033",
  "PPF",
  "Cutter Frame",
  "piece",
  10,
  3
 ],
 [
  "PPF-034",
  "PPF",
  "Ceramic Cloth/Micro Fibre Cloth Yellow 350gsm (Saint Gobin)",
  "piece",
  10,
  3
 ],
 [
  "PPF-035",
  "PPF",
  "Bodywash Shampoo",
  "piece",
  10,
  3
 ],
 [
  "PPF-036",
  "PPF",
  "Degreaser 20Ltr [For Detailing] (MAFRA)",
  "piece",
  10,
  3
 ],
 [
  "PPF-037",
  "PPF",
  "Glass Cleaner 500ml (3M)",
  "piece",
  10,
  3
 ],
 [
  "PPF-038",
  "PPF",
  "Super Cleaner 480ml M.Suzuki (EC-Star)",
  "piece",
  10,
  3
 ],
 [
  "PPF-039",
  "PPF",
  "Compound Polish Pad 5\" High Pro Foam pad Heavy Cutting Green (MaxShine)",
  "piece",
  10,
  3
 ],
 [
  "PPF-040",
  "PPF",
  "Compound Polish Pad 5\" High Pro Foam pad Cutting Blue (MaxShine)",
  "piece",
  10,
  3
 ],
 [
  "PPF-041",
  "PPF",
  "Clay Bar",
  "piece",
  10,
  3
 ],
 [
  "PPF-042",
  "PPF",
  "AC Rubbing Compound 1Ltr (3M)",
  "piece",
  10,
  3
 ],
 [
  "PPF-043",
  "PPF",
  "AC Cleaner Foam [AC Vent Foam] (3M)",
  "piece",
  10,
  3
 ],
 [
  "PPF-044",
  "PPF",
  "Foaming Car Interior Cleaner (3M)",
  "piece",
  10,
  3
 ],
 [
  "PPF-045",
  "PPF",
  "AR Anti Rain Hydrophobic Gloss Coating #135500",
  "piece",
  10,
  3
 ],
 [
  "PPF-046",
  "PPF",
  "Glaze Booster Gloss (MAFRA)",
  "piece",
  10,
  3
 ],
 [
  "PPF-047",
  "PPF",
  "Tyre Dresser 250ml (3M)",
  "piece",
  10,
  3
 ],
 [
  "PPF-048",
  "PPF",
  "Maxx Wash 3-in-1 Dresser 5Ltr (3M)",
  "piece",
  10,
  3
 ],
 [
  "PPF-049",
  "PPF",
  "Duster for Glass Ceramic Coating",
  "piece",
  10,
  3
 ],
 [
  "PPF-050",
  "PPF",
  "Pad for Glass Ceramic Coating",
  "piece",
  10,
  3
 ],
 [
  "PPF-051",
  "PPF",
  "Silencer Coating SL-250ml (3M)",
  "piece",
  10,
  3
 ],
 [
  "PPF-052",
  "PPF",
  "Air Die Grinder DSW-22 Art#0703231014",
  "piece",
  10,
  3
 ],
 [
  "PPF-053",
  "PPF",
  "Hand Gloves Bluee [Pairs]",
  "piece",
  10,
  3
 ],
 [
  "PPF-054",
  "PPF",
  "Mask",
  "piece",
  10,
  3
 ],
 [
  "PPF-055",
  "PPF",
  "Detailing Brush Set of 3pcs (MaxShine)",
  "piece",
  10,
  3
 ],
 [
  "PPF-056",
  "PPF",
  "Car No Plate Frame (Priya)",
  "piece",
  10,
  3
 ],
 [
  "PPF-057",
  "PPF",
  "PPF & Vinyl Surface Cleaner&Preparation Gel 4L (UG)",
  "piece",
  10,
  3
 ],
 [
  "PPF-058",
  "PPF",
  "PPF & Vinyl Residual Remoover 4L (UG)",
  "piece",
  10,
  3
 ],
 [
  "PPF-059",
  "PPF",
  "Shampoo 500ml for PPF (J&J)",
  "piece",
  10,
  3
 ],
 [
  "PPF-060",
  "PPF",
  "Dendrite Gum",
  "piece",
  10,
  3
 ],
 [
  "PPF-061",
  "PPF",
  "Super Glue",
  "piece",
  10,
  3
 ],
 [
  "PAINT-001",
  "Paint",
  "Teflon Cloth/Tack Cloth #50401 (3M)",
  "piece",
  14,
  2
 ],
 [
  "PAINT-002",
  "Paint",
  "Putty 1Kg [DX90] (DUXONE)",
  "piece",
  8,
  2
 ],
 [
  "PAINT-003",
  "Paint",
  "Hardner Paste (DUXONE)",
  "piece",
  22,
  2
 ],
 [
  "PAINT-004",
  "Paint",
  "PU Matt Clear DX491 (DUXONE)",
  "piece",
  4,
  2
 ],
 [
  "PAINT-005",
  "Paint",
  "Clear [Ltr] 3050S (CROMAX)",
  "piece",
  20,
  2
 ],
 [
  "PAINT-006",
  "Paint",
  "Hi-Temp Thinner AB385 (CROMAX)",
  "piece",
  10,
  2
 ],
 [
  "PAINT-007",
  "Paint",
  "Hardner [Ltr] AK260/XK205 [Hi Solid Activator] (CROMAX)",
  "piece",
  3,
  2
 ],
 [
  "PAINT-008",
  "Paint",
  "L/W Body Filler 1Kg [DX91] (DUXONE)",
  "piece",
  8,
  2
 ],
 [
  "PAINT-009",
  "Paint",
  "Body Filler 1Kg (Wurth)",
  "piece",
  3,
  2
 ],
 [
  "PAINT-010",
  "Paint",
  "HS Productive Surfacer DX62R (DUXONE)",
  "piece",
  1,
  2
 ],
 [
  "PAINT-011",
  "Paint",
  "Water Paper #80 (3M)",
  "piece",
  90,
  2
 ],
 [
  "PAINT-012",
  "Paint",
  "Water Paper #150 (3M)",
  "piece",
  90,
  2
 ],
 [
  "PAINT-013",
  "Paint",
  "Water Paper #220 (3M)",
  "piece",
  65,
  2
 ],
 [
  "PAINT-014",
  "Paint",
  "Water Paper #320 (3M)",
  "piece",
  80,
  2
 ],
 [
  "PAINT-015",
  "Paint",
  "Water Paper #400 (3M)",
  "piece",
  160,
  2
 ],
 [
  "PAINT-016",
  "Paint",
  "Water Paper #600 (3M)",
  "piece",
  150,
  2
 ],
 [
  "PAINT-017",
  "Paint",
  "Water Paper #800 (3M)",
  "piece",
  140,
  2
 ],
 [
  "PAINT-018",
  "Paint",
  "Water Paper #1000 (3M)",
  "piece",
  60,
  2
 ],
 [
  "PAINT-019",
  "Paint",
  "Water Paper #1500 (3M)",
  "piece",
  7,
  2
 ],
 [
  "PAINT-020",
  "Paint",
  "Water Paper #2000 (3M)",
  "piece",
  90,
  2
 ],
 [
  "PAINT-021",
  "Paint",
  "Disk Paper #80 (3M)",
  "piece",
  104,
  2
 ],
 [
  "PAINT-022",
  "Paint",
  "Disk Paper #120 (MIRKA/3M)",
  "piece",
  102,
  2
 ],
 [
  "PAINT-023",
  "Paint",
  "Disk Paper #180 (3M)",
  "piece",
  100,
  2
 ],
 [
  "PAINT-024",
  "Paint",
  "Disk Paper #220 (3M)",
  "piece",
  3,
  2
 ],
 [
  "PAINT-025",
  "Paint",
  "Disk Paper #320 (3M)",
  "piece",
  5,
  2
 ],
 [
  "PAINT-026",
  "Paint",
  "Block/File Paper #80 (3M)",
  "piece",
  51,
  2
 ],
 [
  "PAINT-027",
  "Paint",
  "Block/File Paper #120 (3M)",
  "piece",
  14,
  2
 ],
 [
  "PAINT-028",
  "Paint",
  "Block/File Paper #180 (3M)",
  "piece",
  190,
  2
 ],
 [
  "PAINT-029",
  "Paint",
  "1K Primer Grey [1Ltr] EW511 (WURTH)",
  "piece",
  6,
  2
 ],
 [
  "PAINT-030",
  "Paint",
  "1K Primer White [1Ltr] EW512 (WURTH)",
  "piece",
  7,
  2
 ],
 [
  "PAINT-031",
  "Paint",
  "1K Primer White 1Ltr (NIPPON)",
  "piece",
  2,
  2
 ],
 [
  "PAINT-032",
  "Paint",
  "1K Primer White 1Ltr DX73 (DUXONE)",
  "piece",
  0,
  2
 ],
 [
  "PAINT-033",
  "Paint",
  "2K Primer Grey 1Ltr (WURTH)",
  "piece",
  0,
  2
 ],
 [
  "PAINT-034",
  "Paint",
  "2K Primer Grey 1054R [Surfacer] (DUXONE)",
  "piece",
  0,
  2
 ],
 [
  "PAINT-035",
  "Paint",
  "2K Primer White 1Ltr (WURTH)",
  "piece",
  0,
  2
 ],
 [
  "PAINT-036",
  "Paint",
  "2K Primer White 1051R [Surfacer] (CROMAX)",
  "piece",
  0,
  2
 ],
 [
  "PAINT-037",
  "Paint",
  "Plastic Primer DX68 [Ltr] (DUXONE)",
  "piece",
  3,
  2
 ],
 [
  "PAINT-038",
  "Paint",
  "NC Putty 1Kg",
  "piece",
  3,
  2
 ],
 [
  "PAINT-039",
  "Paint",
  "NC Thinner [Ltr]",
  "piece",
  20,
  2
 ],
 [
  "PAINT-040",
  "Paint",
  "Thinner [Ltr] DX32 (DUXONE)",
  "piece",
  0,
  2
 ],
 [
  "PAINT-041",
  "Paint",
  "Base Coat Black",
  "piece",
  0,
  2
 ],
 [
  "PAINT-042",
  "Paint",
  "Cherry Red [Ltr]",
  "piece",
  0,
  2
 ],
 [
  "PAINT-043",
  "Paint",
  "Super Color Spray Paint GP Black Gloss 400ml (SAINT GOBAIN)",
  "piece",
  9,
  2
 ],
 [
  "PAINT-044",
  "Paint",
  "Super Color Spray Paint GP Black Matte 400ml (SAINT GOBAIN/IKULOR)",
  "piece",
  11,
  2
 ],
 [
  "PAINT-045",
  "Paint",
  "Metallic Spray Paint Silver (IKULOR)",
  "piece",
  1,
  2
 ],
 [
  "PAINT-046",
  "Paint",
  "Paint Strainer (WURTH)",
  "piece",
  30,
  2
 ],
 [
  "PAINT-047",
  "Paint",
  "Underbody Coating/Antirust UnderChasis Coating (3M)",
  "piece",
  26,
  2
 ],
 [
  "PAINT-048",
  "Paint",
  "Masking Tape (3M)",
  "piece",
  108,
  2
 ],
 [
  "PAINT-049",
  "Paint",
  "Masking Paper Roll Big 900mm*150m (3M)",
  "piece",
  1,
  2
 ],
 [
  "PAINT-050",
  "Paint",
  "Masking Paper Roll Small 450mm (3M)",
  "piece",
  0,
  2
 ],
 [
  "PAINT-051",
  "Paint",
  "Transparent Film Roll",
  "piece",
  3,
  2
 ],
 [
  "PAINT-052",
  "Paint",
  "Paint Remover 500ml (MARIGOLD)",
  "piece",
  1,
  2
 ],
 [
  "PAINT-053",
  "Paint",
  "Disposable Mask",
  "piece",
  16,
  2
 ],
 [
  "PAINT-054",
  "Paint",
  "Black Silicone Selant for glass fitting",
  "piece",
  1,
  2
 ],
 [
  "PAINT-055",
  "Paint",
  "White Silicone Selant",
  "piece",
  1,
  2
 ],
 [
  "PAINT-056",
  "Paint",
  "Iron Remover 1Ltr for Detailing (MAFRA)",
  "piece",
  3,
  2
 ],
 [
  "PAINT-057",
  "Paint",
  "Water Spot Mineral Remover 500ml MF78 for Detailing (MAFRA)",
  "piece",
  2,
  2
 ],
 [
  "PAINT-058",
  "Paint",
  "Ceramic Sealant MF110 (MAFRA)",
  "piece",
  3,
  2
 ],
 [
  "PAINT-059",
  "Paint",
  "Ceramic Shampoo 500ml MF67 (MAFRA)",
  "piece",
  3,
  2
 ],
 [
  "PAINT-060",
  "Paint",
  "CARLUX [Shiine Wax] 250ml (MAFRA)",
  "piece",
  10,
  2
 ],
 [
  "PAINT-061",
  "Paint",
  "Wheel & Tyre Cleaner 1Ltr MF76 (MAFRA)",
  "piece",
  6,
  2
 ],
 [
  "PAINT-062",
  "Paint",
  "Leather Care Kit (MAFRA)",
  "piece",
  6,
  2
 ],
 [
  "PAINT-063",
  "Paint",
  "Medium Cut Polish 1Ltr (MENZERNA)",
  "piece",
  1,
  2
 ],
 [
  "PAINT-064",
  "Paint",
  "Power Protect Altra Wax (MENZERNA)",
  "piece",
  1,
  2
 ],
 [
  "PAINT-065",
  "Paint",
  "Berger Rock 1L [Auto Refinish]",
  "piece",
  1,
  2
 ],
 [
  "PAINT-066",
  "Paint",
  "Micro Clean 500ml Art#5997782192",
  "piece",
  24,
  2
 ]
]
```

## TYPE-BillingKind

src/invoice-math.ts:3-3

```typescript
export type BillingKind = "Service" | "Material";
```

## TYPE-GstType

src/invoice-math.ts:4-4

```typescript
export type GstType = "CGST+SGST" | "IGST" | "No GST";
```

## CONST-DEFAULT_GST_BY_KIND

src/invoice-math.ts:7-7

```typescript
DEFAULT_GST_BY_KIND: Record<BillingKind, number> = { Service: 18, Material: 18 }
```

## CONST-GST_RATES

src/invoice-math.ts:8-8

```typescript
GST_RATES = [5, 9, 12, 18, 28] as const
```

## CONST-GST_TYPES

src/invoice-math.ts:9-9

```typescript
GST_TYPES: readonly GstType[] = ["CGST+SGST", "IGST", "No GST"]
```

## TYPE-PricedLine

src/invoice-math.ts:17-17

```typescript
export interface PricedLine { qty: number; rate: number; gst_rate: number; gst_type?: GstType | null }
```

## TYPE-PricedLineTotals

src/invoice-math.ts:19-19

```typescript
export interface PricedLineTotals { amount: number; discount: number; taxable: number; gst: number; total: number }
```

## TYPE-InvoiceTotals

src/invoice-math.ts:21-21

```typescript
export interface InvoiceTotals { lines: PricedLineTotals[]; subtotal: number; discount: number; taxable: number; gst: number; total: number }
```

## TYPE-InvoiceDraftLine

src/invoice-math.ts:47-47

```typescript
export interface InvoiceDraftLine { kind: BillingKind; description: string; qty: number; rate: number; gst_type: GstType; gst_rate: number; material_row_id?: number }
```

## TYPE-InvoiceDraft

src/invoice-math.ts:49-49

```typescript
export interface InvoiceDraft { lines: InvoiceDraftLine[]; unissuedRows: number; discount: number }
```

## TYPE-Actor

src/invoice-math.ts:75-75

```typescript
type Actor = Pick<User, "id" | "role">;
```

## TYPE-JobRef

src/invoice-math.ts:76-76

```typescript
type JobRef = { advisor_id: number; main_status: MainStatus };
```

## TYPE-PaymentListKind

src/invoice-math.ts:116-116

```typescript
export type PaymentListKind = "unpaid" | "received" | "void";
```

## TYPE-PaymentListRow

src/invoice-math.ts:117-117

```typescript
export interface PaymentListRow<V extends Pick<JobView, "invoice" | "payments">, P = V["payments"][number]> { key: string; kind: PaymentListKind; view: V; payment?: P }
```

## CONST-JOB_CARD_TABS

src/job-card-layout.ts:9-18

```typescript
JOB_CARD_TABS = [
  { key: "details", label: "Details" },
  { key: "task-list", label: "Task List" },
  { key: "bodymark", label: "Body Mark" },
  { key: "materials", label: "Materials" },
  { key: "documents", label: "Documents" },
  { key: "media", label: "Photos / Media" },
  { key: "invoice", label: "Invoice" },
  { key: "payment", label: "Payment" },
] as const
```

## TYPE-JobCardTabKey

src/job-card-layout.ts:20-20

```typescript
export type JobCardTabKey = (typeof JOB_CARD_TABS)[number]["key"];
```

## CONST-JOB_CARD_STUB_TABS

src/job-card-layout.ts:23-23

```typescript
JOB_CARD_STUB_TABS: readonly JobCardTabKey[] = []
```

## TYPE-FooterAction

src/job-card-layout.ts:29-29

```typescript
export type FooterAction = Exclude<JobDocumentAction, "download">;
```

## TYPE-FooterDownload

src/job-card-layout.ts:31-36

```typescript
export interface FooterDownload {
  kind: DocumentKind;
  label: string;
  enabled: boolean;
  reason?: string;
}
```

## TYPE-JobCardFooter

src/job-card-layout.ts:38-41

```typescript
export interface JobCardFooter {
  actions: FooterAction[];
  downloads: FooterDownload[];
}
```

## CONST-ACTION_ORDER

src/job-card-layout.ts:43-49

```typescript
ACTION_ORDER: FooterAction[] = [
  "create-estimate",
  "edit-estimate",
  "approve-estimate",
  "create-invoice",
  "edit-invoice",
]
```

## TYPE-JobCardNotificationEvent

src/job-card-notifications.ts:4-4

```typescript
export type JobCardNotificationEvent = "created" | "closed";
```

## TYPE-JobCardNotificationPayload

src/job-card-notifications.ts:6-10

```typescript
export interface JobCardNotificationPayload {
  event: JobCardNotificationEvent;
  whatsapp: string;
  email: string;
}
```

## TYPE-TemplateValues

src/job-card-notifications.ts:12-17

```typescript
type TemplateValues = {
  jobCardNo: string;
  vehicleRegistrationNo: string;
  serviceAdvisorName: string;
  workshopName: string;
};
```

## TYPE-DocumentKind

src/job-documents.ts:8-8

```typescript
export type DocumentKind = "estimate" | "invoice" | "gate-pass" | "job-card" | "payment-receipt";
```

## TYPE-JobDocumentAction

src/job-documents.ts:10-10

```typescript
export type JobDocumentAction = "create-estimate" | "edit-estimate" | "approve-estimate" | "create-invoice" | "edit-invoice" | "download";
```

## CONST-DOCUMENT_LABELS

src/job-documents.ts:28-28

```typescript
DOCUMENT_LABELS = labels
```

## CONST-SLOT_KINDS

src/job-documents.ts:29-29

```typescript
SLOT_KINDS: DocumentKind[] = ["estimate", "invoice", "payment-receipt", "gate-pass"]
```

## TYPE-DocumentSlotState

src/job-documents.ts:48-48

```typescript
export type DocumentSlotState = "ready" | "frozen" | "void" | "missing";
```

## TYPE-JobDocumentDescriptor

src/job-documents.ts:50-60

```typescript
export interface JobDocumentDescriptor {
  kind: DocumentKind;
  label: string;
  available: boolean;
  expected: boolean;
  state: DocumentSlotState;
  number?: string;
  message?: string;
  /** Set on a void document listed from its frozen snapshot. */
  snapshotId?: string;
}
```

## TYPE-RenderedDocument

src/job-documents.ts:90-90

```typescript
export interface RenderedDocument { html: string; title: string; number: string; filename: string; frozen: boolean }
```

## CONST-DAMAGE_PLACEHOLDER

src/job-documents.ts:93-93

```typescript
DAMAGE_PLACEHOLDER = /{{\s*blocks\.damage_diagram\s*}}/
```

## TYPE-PrintJobDocumentResult

src/job-documents.ts:130-130

```typescript
export interface PrintJobDocumentResult { ok: boolean; error?: string }
```

## CONST-ACCEPTED_MEDIA_MIME_TYPES

src/job-media.ts:1-1

```typescript
ACCEPTED_MEDIA_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const
```

## TYPE-JobMediaCategory

src/job-media.ts:2-2

```typescript
export type JobMediaCategory = "Before Work" | "After Work";
```

## CONST-MAX_MEDIA_FILE_BYTES

src/job-media.ts:4-4

```typescript
MAX_MEDIA_FILE_BYTES = 10 * 1024 * 1024
```

## CONST-MAX_MEDIA_DATA_URL_BYTES

src/job-media.ts:5-5

```typescript
MAX_MEDIA_DATA_URL_BYTES = 1_000_000
```

## CONST-MAX_MEDIA_DIMENSION

src/job-media.ts:6-6

```typescript
MAX_MEDIA_DIMENSION = 1600
```

## TYPE-PreparedJobMedia

src/job-media.ts:39-46

```typescript
export interface PreparedJobMedia {
  src: string;
  mimeType: string;
  byteSize: number;
  originalName: string;
  width: number;
  height: number;
}
```

## TYPE-JobPeriod

src/job-picker.tsx:6-6

```typescript
export type JobPeriod = { monthYear: string };
```

## TYPE-DamageMark

src/job-sheet.ts:2-10

```typescript
export interface DamageMark {
  id: number;
  /** Percent (0-100) across the diagram width. */
  x: number;
  /** Percent (0-100) down the diagram height. */
  y: number;
  /** Body-mark panel the mark belongs to; absent on legacy top-view marks. */
  view?: BodyView;
}
```

## CONST-BODY_VIEWS

src/job-sheet.ts:12-17

```typescript
BODY_VIEWS = [
  { key: "LF", label: "Left Front" },
  { key: "LR", label: "Left Rear" },
  { key: "RF", label: "Right Front" },
  { key: "RR", label: "Right Rear" },
] as const
```

## TYPE-BodyView

src/job-sheet.ts:18-18

```typescript
export type BodyView = (typeof BODY_VIEWS)[number]["key"];
```

## CONST-SERVICE_TYPES

src/job-sheet.ts:21-21

```typescript
SERVICE_TYPES = ["Repair", "Service", "Detailing", "PPF", "Paint", "Other"] as const
```

## CONST-PICKUP_DROP_OPTIONS

src/job-sheet.ts:22-22

```typescript
PICKUP_DROP_OPTIONS = ["Customer drop-in", "Workshop pickup", "Pickup and drop", "Drop only"] as const
```

## CONST-FUEL_LEVELS

src/job-sheet.ts:23-23

```typescript
FUEL_LEVELS = ["Empty", "Quarter", "Half", "Three-quarter", "Full"] as const
```

## CONST-DAMAGE_SLOT

src/job-sheet.ts:64-64

```typescript
DAMAGE_SLOT = '<div class="damage-diagram-slot"></div>'
```

## CONST-DAMAGE_DIAGRAM_ASSET

src/job-sheet.ts:65-65

```typescript
DAMAGE_DIAGRAM_ASSET = "/car-damage-diagram.png"
```

## CONST-DAMAGE_DIAGRAM_ASPECT_RATIO

src/job-sheet.ts:66-66

```typescript
DAMAGE_DIAGRAM_ASPECT_RATIO = 682 / 511
```

## TYPE-RemoteEstimateLine

src/jobs-api.ts:3-3

```typescript
export type RemoteEstimateLine = { id?: number; kind: string; description: string; quantity: number; rate: number; gstRate: number };
```

## TYPE-RemoteEstimate

src/jobs-api.ts:4-4

```typescript
export type RemoteEstimate = { id: number; jobId: number; revision: number; status: "DRAFT" | "APPROVED" | "DECLINED"; discount: number; gstRate: number; note: string; supersededAt: string | null; approvedSnapshot: unknown; createdAt: string; updatedAt: string; lines: RemoteEstimateLine[] };
```

## TYPE-RemoteAssignmentHistory

src/jobs-api.ts:5-5

```typescript
export type RemoteAssignmentHistory = { id: number; action: "ROUTED_TO_MANAGER" | "ADVISOR_ASSIGNED" | "MANAGER_TRANSFERRED"; reason: string; at: string; actorId: string; departmentId: string | null; departmentName: string | null; managerId: string | null; managerName: string | null; advisorId: string | null; advisorName: string | null };
```

## TYPE-RemoteJob

src/jobs-api.ts:6-6

```typescript
export type RemoteJob = { id: number; jobNo: string; visitId: number; branchId: string; departmentId: string | null; responsibleManagerId: string | null; advisorId: string | null; assignmentState: "LEGACY" | "AWAITING_ADVISOR_ASSIGNMENT" | "ASSIGNED_TO_ADVISOR"; department: { id: string; name: string } | null; responsibleManager: { id: string; name: string } | null; advisor: { id: string; name: string } | null; assignmentHistory: RemoteAssignmentHistory[]; status: string; workList: string; promisedAt: string | null; createdAt: string; updatedAt: string; estimates: RemoteEstimate[]; events: Array<{ id: number; command: string; fromStatus: string; toStatus: string; reason: string; requestKey: string | null; at: string }> };
```

## CONST-DEFAULT_PAGE_SIZE

src/list-utils.ts:3-3

```typescript
DEFAULT_PAGE_SIZE = 10
```

## CONST-PAGE_SIZE_OPTIONS

src/list-utils.ts:4-4

```typescript
PAGE_SIZE_OPTIONS = [10, 20, 50] as const
```

## TYPE-FilterDraftState

src/list-utils.ts:55-59

```typescript
export interface FilterDraftState<T> {
  draft: T;
  applied: T;
  page: number;
}
```

## TYPE-MaterialRowStatus

src/materials.ts:3-3

```typescript
export type MaterialRowStatus = "Draft" | "Requested" | "Re-requested" | "Issued" | "Cancelled";
```

## CONST-MATERIALS_CHECKLIST_LABELS

src/materials.ts:5-5

```typescript
MATERIALS_CHECKLIST_LABELS = ["Material Requested", "Material Issued"] as const
```

## TYPE-MaterialRowAction

src/materials.ts:7-7

```typescript
export type MaterialRowAction = "request" | "edit" | "re-request" | "cancel" | "delete" | "release" | "edit-issued";
```

## TYPE-MaterialDemandTriage

src/materials.ts:40-40

```typescript
export type MaterialDemandTriage = "issuable" | "procurement";
```

## TYPE-MaterialDemand

src/materials.ts:42-45

```typescript
export type MaterialDemand = Pick<
  MaterialRequest,
  "id" | "item_id" | "requested_qty" | "issued_qty"
>;
```

## TYPE-MaterialDemandAllocation

src/materials.ts:47-50

```typescript
export interface MaterialDemandAllocation {
  outcome: MaterialDemandTriage;
  procurementQty: number;
}
```

## TYPE-Actor

src/materials.ts:112-112

```typescript
type Actor = Pick<User, "id" | "role">;
```

## TYPE-JobRef

src/materials.ts:113-113

```typescript
type JobRef = { advisor_id: number; main_status: MainStatus; materialApprovalStatus?: "Pending" | "Approved" | "Rejected" };
```

## TYPE-PaginationToolbarProps

src/pagination-toolbar.tsx:6-17

```typescript
type PaginationToolbarProps = {
  from: number;
  to: number;
  totalCount: number;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeAriaLabel?: string;
  controls?: ReactNode;
};
```

## CONST-PAGE_WIDTH_PX

src/pdf-render.ts:7-7

```typescript
PAGE_WIDTH_PX = 794
```

## CONST-A4_RATIO

src/pdf-render.ts:8-8

```typescript
A4_RATIO = 841.89 / 595.28
```

## CONST-SCALE

src/pdf-render.ts:9-9

```typescript
SCALE = 2
```

## TYPE-Template

src/quotation-dialog.tsx:10-10

```typescript
export type Template = { id: string; name: string; html: string; active?: boolean };
```

## TYPE-QuotationInput

src/quotation-dialog.tsx:11-11

```typescript
export type QuotationInput = { leadId: number; validUntil?: string; customerNotes?: string; discount?: number; templateId: string; templateHtml: string; lines: QuotationLine[] };
```

## TYPE-Mode

src/remote-finance.tsx:7-7

```typescript
type Mode = "invoice" | "payment" | "delivery";
```

## TYPE-Mode

src/remote-followups.tsx:5-5

```typescript
type Mode = "followups" | "search";
```

## TYPE-LeadInput

src/remote-sales.tsx:12-12

```typescript
type LeadInput = Omit<Lead, "id" | "branchId" | "createdAt" | "updatedAt">;
```

## TYPE-ReportCategory

src/report-templates.ts:7-7

```typescript
export type ReportCategory = "estimate" | "quotation" | "invoice" | "gate-pass" | "job-card" | "payment-receipt";
```

## TYPE-ReportTemplate

src/report-templates.ts:9-19

```typescript
export interface ReportTemplate {
  id: string;
  category: ReportCategory;
  name: string;
  html: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  /** Set on seeded defaults: the DEFAULT_TEMPLATE_VERSION they were generated from. */
  seedVersion?: number;
}
```

## TYPE-CompanyAssets

src/report-templates.ts:21-25

```typescript
export interface CompanyAssets {
  logo: string | null;
  stamp: string | null;
  authorizedSignature: string | null;
}
```

## CONST-REPORT_CATEGORY_LABELS

src/report-templates.ts:27-34

```typescript
REPORT_CATEGORY_LABELS: Record<ReportCategory, string> = {
  estimate: "Estimate",
  quotation: "Quotation",
  invoice: "Invoice",
  "gate-pass": "Gate Pass",
  "job-card": "Job Card",
  "payment-receipt": "Receipt",
}
```

## CONST-COMMON_PLACEHOLDERS

src/report-templates.ts:36-46

```typescript
COMMON_PLACEHOLDERS = [
  "company.name", "company.legal_name", "company.address", "company.phone", "company.email", "company.gstin", "company.footer",
  "report.title", "report.number", "report.date", "report.subtotal", "report.discount", "report.gst", "report.amount_words",
  "job.number", "job.status", "job.sub_status", "job.work_list",
  "customer.name", "customer.mobile", "customer.type",
  "vehicle.registration", "vehicle.description", "vehicle.make", "vehicle.model", "vehicle.color", "vehicle.km",
  "dates.received", "dates.promised", "dates.delivered",
  "staff.advisor", "staff.technician",
  "blocks.company_logo", "blocks.authorized_signature",
  "company.logo", "company.signature",
] as const
```

## CONST-LINE_PLACEHOLDERS

src/report-templates.ts:49-49

```typescript
LINE_PLACEHOLDERS = ["line.kind", "line.description", "line.qty", "line.rate", "line.amount"] as const
```

## TYPE-ReportLine

src/report-templates.ts:50-50

```typescript
export type ReportLine = Record<"kind" | "description" | "qty" | "rate" | "amount", string>;
```

## CONST-CATEGORY_PLACEHOLDERS

src/report-templates.ts:52-59

```typescript
CATEGORY_PLACEHOLDERS: Record<ReportCategory, readonly string[]> = {
  estimate: ["estimate.total", "blocks.line_items", "blocks.company_stamp", "company.stamp"],
  quotation: ["quotation.total", "quotation.valid_until", "quotation.notes", "blocks.line_items", "blocks.company_stamp", "company.stamp"],
  invoice: ["company.bank_account_holder", "company.bank_name", "company.bank_account_number", "company.bank_ifsc", "company.bank_branch", "company.upi_id", "invoice.total", "invoice.paid", "invoice.balance", "blocks.line_items", "blocks.payments", "blocks.payment_details", "blocks.company_stamp", "company.stamp"],
  "gate-pass": ["invoice.status", "blocks.tasks", "blocks.qc_rows", "blocks.company_stamp"],
  "job-card": ["blocks.line_items", "blocks.tasks", "blocks.qc_rows", "blocks.damage_diagram", "blocks.company_stamp"],
  "payment-receipt": ["receipt.number", "invoice.total", "invoice.paid", "invoice.balance", "blocks.payments", "blocks.company_stamp"],
}
```

## CONST-REPORT_PLACEHOLDERS

src/report-templates.ts:61-63

```typescript
REPORT_PLACEHOLDERS: Record<ReportCategory, readonly string[]> = Object.fromEntries(
  (Object.keys(REPORT_CATEGORY_LABELS) as ReportCategory[]).map((category) => [category, [...COMMON_PLACEHOLDERS, ...CATEGORY_PLACEHOLDERS[category]]]),
) as unknown as Record<ReportCategory, readonly string[]>
```

## CONST-DEFAULT_TEMPLATE_VERSION

src/report-templates.ts:66-66

```typescript
DEFAULT_TEMPLATE_VERSION = 4
```

## CONST-ACCENT

src/report-templates.ts:68-68

```typescript
ACCENT = "#1f5f99"
```

## CONST-INK

src/report-templates.ts:69-69

```typescript
INK = "#18222d"
```

## CONST-MUTED

src/report-templates.ts:70-70

```typescript
MUTED = "#5d6b79"
```

## CONST-LINE

src/report-templates.ts:71-71

```typescript
LINE = "#d5dce3"
```

## CONST-DEFAULT_TEMPLATE_HTML

src/report-templates.ts:97-104

```typescript
DEFAULT_TEMPLATE_HTML: Record<ReportCategory, string> = {
  estimate: layout("ESTIMATE", "{{report.number}} · {{report.date}}", `${parties("Prepared for")}${lineItems}${totals("estimate.total")}<p style="margin:12px 0;color:${MUTED}">Valid for 7 days from the date above. Estimate only; final charges are per the Tax Invoice.</p>${words}`),
  quotation: layout("QUOTATION", "{{report.number}} · {{report.date}}", `${parties("Prepared for")}${lineItems}${totals("quotation.total")}<p style="margin:12px 0;color:${MUTED}">Valid until {{quotation.valid_until}}.</p><p>{{quotation.notes}}</p>${words}`),
  invoice: layout("TAX INVOICE", "{{report.number}} · {{report.date}}", `${parties("Bill to")}${lineItems}${totals("invoice.total")}${words}<p style="margin:4px 0;text-align:right">Paid: {{invoice.paid}} · Balance: <strong>{{invoice.balance}}</strong></p>{{blocks.payments}}{{blocks.payment_details}}`),
  "payment-receipt": layout("PAYMENT RECEIPT", "{{receipt.number}} · {{report.date}}", `${parties("Received from")}<div style="margin:6px 0 14px;padding:14px 16px;border:1.5px solid ${INK};border-radius:6px"><div style="color:${MUTED}">Amount received</div><div style="font-size:26px;font-weight:700">{{invoice.paid}}</div><div style="color:${MUTED}">{{report.amount_words}}</div></div>{{blocks.payments}}${cards(card("Invoice total", "{{invoice.total}}"), card("Balance", "<strong>{{invoice.balance}}</strong>"))}`),
  "gate-pass": layout("GATE PASS", "{{report.number}} · {{report.date}}", `${parties("Released to")}<div style="margin:6px 0 14px;padding:14px;border:1.5px solid ${INK};border-radius:6px;text-align:center"><div style="color:${MUTED};letter-spacing:.06em">AUTHORISED TO EXIT PREMISES</div><div style="font-size:22px;font-weight:700;letter-spacing:.08em;margin:4px 0">{{vehicle.registration}}</div><div>Released on {{report.date}} · Payment: <strong>{{invoice.status}}</strong></div></div>${cards(card("Completed work", "{{job.work_list}}"), card("Received by", `<div style="height:46px"></div><div style="border-top:1px solid ${INK};padding-top:4px;font-size:11px">Customer signature · {{customer.name}}</div>`))}${section("Tasks", "{{blocks.tasks}}")}${section("Quality checks", "{{blocks.qc_rows}}")}`),
  "job-card": layout("JOB CARD", "{{job.number}} · {{report.date}}", `${parties("Customer")}${cards(card("Intake", "Received: {{dates.received}}<br>Promised: {{dates.promised}}<br>Advisor: {{staff.advisor}}<br>Technician: {{staff.technician}}"), card("Work requested / approved", "{{job.work_list}}"))}${cards(card("Damage diagram", "{{blocks.damage_diagram}}"), `<div style="flex:1;min-width:0">${section("Tasks", "{{blocks.tasks}}")}${section("Quality checks", "{{blocks.qc_rows}}")}</div>`)}`),
}
```

## CONST-LOOP_PATTERN

src/report-templates.ts:132-132

```typescript
LOOP_PATTERN = /{{\s*#lines\s*}}([\s\S]*?){{\s*\/lines\s*}}/g
```

## CONST-IMAGE_SRC

src/report-templates.ts:169-169

```typescript
IMAGE_SRC = /^data:image\/(png|jpeg);base64,[A-Za-z0-9+/=]+$/
```

## CONST-SAFE_ELEMENTS

src/report-templates.ts:268-268

```typescript
SAFE_ELEMENTS = new Set(["A", "ARTICLE", "ASIDE", "B", "BLOCKQUOTE", "BR", "CAPTION", "CODE", "COL", "COLGROUP", "DIV", "EM", "FIGCAPTION", "FIGURE", "FOOTER", "H1", "H2", "H3", "H4", "HEADER", "HR", "I", "IMG", "LI", "MAIN", "OL", "P", "SECTION", "SMALL", "SPAN", "STRONG", "TABLE", "TBODY", "TD", "TFOOT", "TH", "THEAD", "TR", "U", "UL"])
```

## CONST-DROP_WITH_CONTENT

src/report-templates.ts:269-269

```typescript
DROP_WITH_CONTENT = new Set(["SCRIPT", "IFRAME", "FRAME", "FRAMESET", "FORM", "INPUT", "BUTTON", "TEXTAREA", "SELECT", "OPTION", "OBJECT", "EMBED", "META", "LINK", "BASE", "SVG", "MATH", "STYLE"])
```

## CONST-PRINT_CSP

src/report-templates.ts:311-311

```typescript
PRINT_CSP = "default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'; script-src 'none'; frame-src 'none'; connect-src 'none'; font-src 'none'; base-uri 'none'; form-action 'none'"
```

## TYPE-LeadStage

src/sales-api.ts:3-3

```typescript
export type LeadStage = "NEW" | "QUALIFIED" | "QUOTATION_SENT" | "WON" | "LOST";
```

## TYPE-LeadTemperature

src/sales-api.ts:4-4

```typescript
export type LeadTemperature = "HOT" | "WARM" | "COLD";
```

## TYPE-QuotationStatus

src/sales-api.ts:5-5

```typescript
export type QuotationStatus = "DRAFT" | "SENT" | "ACCEPTED" | "REJECTED" | "EXPIRED";
```

## TYPE-Lead

src/sales-api.ts:6-6

```typescript
export type Lead = { id: number; branchId: string; displayName: string; phone: string; company: string; companyNotEntered: boolean; email: string; emailNotEntered: boolean; address: string; serviceInterest: string; notes: string; stage: LeadStage; temperature: LeadTemperature; followUpDue: string | null; siteVisitCompleted: boolean; siteVisitDate: string | null; createdAt: string; updatedAt: string };
```

## TYPE-QuotationLine

src/sales-api.ts:7-7

```typescript
export type QuotationLine = { id?: number; kind: string; description: string; quantity: number; rate: number; gstRate: number };
```

## TYPE-Quotation

src/sales-api.ts:8-8

```typescript
export type Quotation = { id: number; branchId: string; leadId: number; quotationNo: string; status: QuotationStatus; validUntil: string | null; customerNotes: string; discount: number; subtotal: number; gstAmount: number; total: number; templateId: string; templateHtml?: string; createdAt: string; updatedAt: string; lines: QuotationLine[] };
```

## TYPE-ServiceTask

src/sales-api.ts:9-9

```typescript
export type ServiceTask = { id: number; name: string; description: string; rate: number; gstRate: number };
```

## TYPE-QuotationDocument

src/sales-api.ts:10-10

```typescript
export type QuotationDocument = { quotationNo: string; createdAt: string; templateHtml: string; snapshot: { leadName?: string; phone?: string; validUntil?: string | null; customerNotes?: string; discount?: number; subtotal?: number; gstAmount?: number; total?: number; lines?: QuotationLine[] } };
```

## TYPE-LeadFormDraft

src/sales-lead-dialog.tsx:4-19

```typescript
export type LeadFormDraft = {
  displayName: string;
  phone: string;
  company: string;
  companyNotEntered: boolean;
  email: string;
  emailNotEntered: boolean;
  address: string;
  serviceInterest: string;
  notes: string;
  stage: "NEW" | "QUALIFIED" | "QUOTATION_SENT" | "WON" | "LOST";
  temperature: "HOT" | "WARM" | "COLD";
  followUpDue: string | null;
  siteVisitCompleted: boolean;
  siteVisitDate: string | null;
};
```

## CONST-SERVICE_ACTIVE_JOB_STATUSES

src/service-advisor.ts:3-3

```typescript
SERVICE_ACTIVE_JOB_STATUSES: MainStatus[] = ["NEW", "IN_PROGRESS", "HOLD", "COMPLETED"]
```

## CONST-FOLLOWUP_EDITABLE_JOB_STATUSES

src/service-advisor.ts:4-4

```typescript
FOLLOWUP_EDITABLE_JOB_STATUSES: MainStatus[] = ["NEW", "IN_PROGRESS", "COMPLETED"]
```

## TYPE-Role

src/types.ts:1-2

```typescript
export type Role =
  "admin" | "service" | "service_manager" | "reception" | "accounts" | "store" | "tech";
```

## TYPE-LeadStage

src/types.ts:4-4

```typescript
export type LeadStage = "NEW" | "QUALIFIED" | "QUOTATION_SENT" | "WON" | "LOST";
```

## TYPE-LeadTemperature

src/types.ts:5-5

```typescript
export type LeadTemperature = "HOT" | "WARM" | "COLD";
```

## TYPE-QuotationStatus

src/types.ts:6-6

```typescript
export type QuotationStatus = "DRAFT" | "SENT" | "ACCEPTED" | "REJECTED" | "EXPIRED";
```

## TYPE-SalesLead

src/types.ts:7-7

```typescript
export interface SalesLead { id: number; display_name: string; phone: string; company: string; company_not_entered: number; email: string; email_not_entered: number; address: string; service_interest: string; notes: string; stage: LeadStage; temperature: LeadTemperature; follow_up_due: string | null; site_visit_completed: number; site_visit_date: string | null; created_at: string; updated_at: string; }
```

## TYPE-SalesQuotationLine

src/types.ts:8-8

```typescript
export interface SalesQuotationLine { id: number; quotation_id: number; line_no: number; kind: string; description: string; quantity: number; rate: number; gst_rate: number; }
```

## TYPE-SalesQuotation

src/types.ts:9-9

```typescript
export interface SalesQuotation { id: number; lead_id: number; quotation_no: string; status: QuotationStatus; valid_until: string | null; customer_notes: string; discount: number; subtotal: number; gst_amount: number; total: number; template_id: string; template_html: string; created_at: string; updated_at: string; lines: SalesQuotationLine[]; }
```

## TYPE-ServiceDepartmentAdvisorTeam

src/types.ts:10-10

```typescript
export interface ServiceDepartmentAdvisorTeam { manager_id: number; advisor_id: number; }
```

## TYPE-ServiceDepartment

src/types.ts:11-11

```typescript
export interface ServiceDepartment { id: number; name: string; status: "ACTIVE" | "ARCHIVED"; created_at: string; updated_at: string; manager_ids: number[]; advisor_team_ids: number[]; advisor_teams: ServiceDepartmentAdvisorTeam[]; }
```

## TYPE-ServiceCatalogMaster

src/types.ts:12-12

```typescript
export interface ServiceCatalogMaster { id: number; name: string; status: "ACTIVE" | "ARCHIVED"; created_at: string; updated_at: string; }
```

## TYPE-MainStatus

src/types.ts:14-15

```typescript
export type MainStatus =
  "NEW" | "IN_PROGRESS" | "HOLD" | "COMPLETED" | "CLOSED" | "CANCELLED";
```

## TYPE-ChecklistStage

src/types.ts:17-17

```typescript
export type ChecklistStage = Exclude<MainStatus, "CANCELLED" | "HOLD">;
```

## TYPE-SubStatus

src/types.ts:19-36

```typescript
export type SubStatus =
  | "Gather Requirements"
  | "Create Estimate"
  | "Get Confirmation"
  | "Material Requested"
  | "Material Issued"
  | "Washing Needed"
  | "Work Started"
  | "Follow-up Needed"
  | "Photos Shared"
  | "QC Pending"
  | "Customer Verification"
  | "Invoice Ready"
  | "Remind Customer for Sharing Google Review/Feedback"
  | "Payment Received"
  | "Receipt Generated"
  | "Gate Pass Generated"
  | "Delivered";
```

## TYPE-TaskStatus

src/types.ts:38-38

```typescript
export type TaskStatus = "Pending" | "Started" | "Paused" | "Completed";
```

## TYPE-QcStatus

src/types.ts:39-39

```typescript
export type QcStatus = "Pending" | "Pass" | "Fail";
```

## TYPE-PaymentStatus

src/types.ts:40-40

```typescript
export type PaymentStatus = "Pending" | "Partial" | "Paid";
```

## TYPE-PaymentMode

src/types.ts:41-41

```typescript
export type PaymentMode = "UPI" | "Cash" | "Card" | "Bank transfer" | "Other";
```

## TYPE-ViewMode

src/types.ts:42-42

```typescript
export type ViewMode = "grid" | "table";
```

## TYPE-BookingStatus

src/types.ts:43-44

```typescript
export type BookingStatus =
  "Booked" | "Confirmed" | "Arrived" | "Rescheduled" | "Cancelled" | "No-show";
```

## TYPE-BookingArrivalWindow

src/types.ts:45-45

```typescript
export type BookingArrivalWindow = "" | "Morning" | "Afternoon" | "Evening";
```

## TYPE-BookingServiceType

src/types.ts:46-46

```typescript
export type BookingServiceType = "Service Work" | "General Checkup / Follow-up";
```

## TYPE-ListQuery

src/types.ts:48-54

```typescript
export interface ListQuery {
  search: string;
  filters: Record<string, string>;
  sort: string;
  page: number;
  pageSize: number;
}
```

## TYPE-PagedResult

src/types.ts:56-63

```typescript
export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageCount: number;
  page: number;
  from: number;
  to: number;
}
```

## TYPE-JobListSummary

src/types.ts:65-74

```typescript
export interface JobListSummary {
  id: number;
  jobNo: string;
  vehicle: string;
  customer: string;
  status: MainStatus;
  workflow: SubStatus;
  total: number;
  createdAt: string;
}
```

## TYPE-VehicleListSummary

src/types.ts:76-84

```typescript
export interface VehicleListSummary {
  id: number;
  registration: string;
  makeModel: string;
  color: string;
  customer: string;
  km: number;
  createdAt: string;
}
```

## TYPE-CustomerListSummary

src/types.ts:86-95

```typescript
export interface CustomerListSummary {
  id: number;
  name: string;
  mobile: string;
  type: string;
  vehicleCount: number;
  openJobCount: number;
  lastVisit: string;
  createdAt: string;
}
```

## TYPE-MediaListSummary

src/types.ts:97-105

```typescript
export interface MediaListSummary {
  id: number;
  label: string;
  category: string;
  jobNo: string;
  vehicle: string;
  src: string;
  createdAt: string;
}
```

## TYPE-SearchCategory

src/types.ts:106-107

```typescript
export type SearchCategory =
  "all" | "job" | "customer" | "vehicle" | "invoice" | "payment";
```

## TYPE-SearchCriteria

src/types.ts:109-113

```typescript
export interface SearchCriteria {
  query: string;
  category: SearchCategory;
  status: MainStatus | "ALL";
}
```

## TYPE-SearchMatchMetadata

src/types.ts:115-118

```typescript
export interface SearchMatchMetadata {
  categories: Exclude<SearchCategory, "all">[];
  normalizedQuery: string;
}
```

## TYPE-SearchResult

src/types.ts:120-123

```typescript
export interface SearchResult {
  view: JobView;
  match: SearchMatchMetadata;
}
```

## TYPE-User

src/types.ts:125-137

```typescript
export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
  password: string;
  archived_at?: string;
  archived_reason?: string;
  created_at?: string;
  updated_at?: string;
  externalAuth?: boolean;
  externalId?: string;
}
```

## TYPE-Customer

src/types.ts:139-149

```typescript
export interface Customer {
  id: number;
  name: string;
  mobile: string;
  type: string;
  address?: string;
  archived_at?: string;
  archived_reason?: string;
  created_at?: string;
  updated_at?: string;
}
```

## TYPE-Vehicle

src/types.ts:151-164

```typescript
export interface Vehicle {
  id: number;
  customer_id: number;
  number: string;
  make: string;
  model: string;
  color: string;
  km: number;
  engine_no?: string;
  archived_at?: string;
  archived_reason?: string;
  created_at?: string;
  updated_at?: string;
}
```

## TYPE-Visit

src/types.ts:166-187

```typescript
export interface Visit {
  id: number;
  customer_id: number;
  vehicle_id: number;
  advisor_id: number;
  received_by: number;
  received_at: string;
  fuel: string;
  /** Immutable odometer snapshot captured at check-in. */
  odo_reading?: number;
  /** Structured fuel/battery reading retained alongside the legacy `fuel` display value. */
  fuel_level_value?: string;
  fuel_level_unit?: "bars" | "%" | "litres" | "Other";
  keys: string;
  accessories: string;
  requested_work: string;
  photos_note: string;
  archived_at?: string;
  archived_reason?: string;
  created_at?: string;
  updated_at?: string;
}
```

## TYPE-Booking

src/types.ts:190-221

```typescript
export interface Booking {
  id: number;
  customer_id?: number | null;
  vehicle_id?: number | null;
  customer_name: string;
  mobile: string;
  customer_type: string;
  vehicle_no: string;
  make: string;
  model: string;
  color: string;
  requested_work: string;
  service_type: BookingServiceType;
  booking_date: string;
  arrival_window: BookingArrivalWindow;
  status: BookingStatus;
  created_by: number;
  confirmed_at?: string | null;
  arrived_at?: string | null;
  rescheduled_at?: string | null;
  cancelled_at?: string | null;
  no_show_at?: string | null;
  reschedule_reason?: string | null;
  cancellation_reason?: string | null;
  no_show_reason?: string | null;
  /** Set once this future reservation is received at reception. */
  visit_id?: number | null;
  /** Set once this future reservation is received at reception. */
  job_card_id?: number | null;
  created_at: string;
  updated_at: string;
}
```

## TYPE-BookingCallLog

src/types.ts:223-229

```typescript
export interface BookingCallLog {
  id: number;
  booking_id: number;
  note: string;
  called_by: number;
  called_at: string;
}
```

## TYPE-BookingEvent

src/types.ts:231-240

```typescript
export interface BookingEvent {
  id: number;
  booking_id: number;
  kind: BookingStatus;
  actor_id: number;
  at: string;
  note: string;
  previous_booking_date?: string | null;
  booking_date: string;
}
```

## TYPE-BookingCapacityLimit

src/types.ts:243-249

```typescript
export interface BookingCapacityLimit {
  booking_date: string;
  service_work_capacity: number;
  general_checkup_followup_capacity: number;
  set_by: number;
  updated_at: string;
}
```

## TYPE-BookingCapacityOverride

src/types.ts:252-259

```typescript
export interface BookingCapacityOverride {
  id: number;
  booking_id: number;
  booking_date: string;
  reason: string;
  approved_by: number;
  approved_at: string;
}
```

## TYPE-JobCard

src/types.ts:261-291

```typescript
export interface JobCard {
  id: number;
  job_no: string;
  visit_id: number;
  advisor_id: number;
  technician_id: number;
  main_status: MainStatus;
  sub_status: SubStatus;
  work_list: string;
  promised_at: string;
  qc_status: QcStatus;
  washing_needed: number;
  closed_at: string;
  advisor_notes?: string;
  customer_instructions?: string;
  internal_instructions?: string;
  delivery_by?: string;
  final_km?: number;
  acknowledgement?: string;
  service_type?: string;
  pickup_drop?: string;
  estimated_delivery?: string;
  /** JSON array of DamageMark; see job-sheet.ts. */
  damage_marks?: string;
  /** Timestamp of the most recent explicit body-mark save. */
  damage_marks_recorded_at?: string | null;
  archived_at?: string;
  archived_reason?: string;
  created_at?: string;
  updated_at?: string;
}
```

## TYPE-Estimate

src/types.ts:293-304

```typescript
export interface Estimate {
  id: number;
  job_card_id: number;
  status: "Draft" | "Approved";
  discount: number;
  gst_rate: number;
  approval_note: string;
  archived_at?: string;
  archived_reason?: string;
  created_at?: string;
  updated_at?: string;
}
```

## TYPE-EstimateItem

src/types.ts:306-320

```typescript
export interface EstimateItem {
  id: number;
  estimate_id: number;
  kind: "Service" | "Material";
  description: string;
  qty: number;
  rate: number;
  gst_type?: "CGST+SGST" | "IGST" | "No GST" | null;
  gst_rate?: number | null;
  archived_at?: string;
  archived_reason?: string;
  created_at?: string;
  updated_at?: string;
  task_list_item_id?: number | null;
}
```

## TYPE-ServiceCatalogItem

src/types.ts:322-337

```typescript
export interface ServiceCatalogItem {
  id: number;
  name: string;
  base_rate: number;
  gst_rate: number;
  service_department_id?: number | null;
  brand_id?: number | null;
  car_segment_id?: number | null;
  department_name?: string | null;
  brand_name?: string | null;
  car_segment_name?: string | null;
  archived_at?: string | null;
  archived_reason?: string | null;
  created_at?: string;
  updated_at?: string;
}
```

## TYPE-JobTaskListItem

src/types.ts:339-351

```typescript
export interface JobTaskListItem {
  id: number;
  job_card_id: number;
  service_catalog_item_id?: number | null;
  name: string;
  base_rate: number;
  gst_rate: number;
  done: number;
  archived_at?: string | null;
  archived_reason?: string | null;
  created_at?: string;
  updated_at?: string;
}
```

## TYPE-MaterialRequest

src/types.ts:353-369

```typescript
export interface MaterialRequest {
  id: number;
  job_card_id: number;
  item_id: number;
  requested_qty: number;
  issued_qty: number;
  used_qty: number;
  returned_qty: number;
  wasted_qty: number;
  status?: "Draft" | "Requested" | "Re-requested" | "Issued" | "Cancelled";
  invoiced_in?: number | null;
  note?: string;
  archived_at?: string;
  archived_reason?: string;
  created_at?: string;
  updated_at?: string;
}
```

## TYPE-MaterialApprovalStatus

src/types.ts:371-371

```typescript
export type MaterialApprovalStatus = "Pending" | "Approved" | "Rejected";
```

## TYPE-MaterialApproval

src/types.ts:374-384

```typescript
export interface MaterialApproval {
  id: number;
  job_card_id: number;
  status: MaterialApprovalStatus;
  submitted_by: number;
  submitted_at: string;
  reviewed_by?: number | null;
  reviewed_at?: string | null;
  rejection_reason?: string | null;
  revision: number;
}
```

## TYPE-MaterialApprovalEvent

src/types.ts:386-395

```typescript
export interface MaterialApprovalEvent {
  id: number;
  approval_id: number;
  job_card_id: number;
  action: "Submitted" | "Approved" | "Rejected" | "Resubmitted";
  actor_id: number;
  at: string;
  note: string;
  revision: number;
}
```

## TYPE-LocalPurchase

src/types.ts:398-412

```typescript
export interface LocalPurchase {
  id: number;
  job_card_id: number;
  item_description: string;
  quantity: number;
  unit: string;
  unit_cost: number;
  vendor: string;
  bill_reference: string;
  note?: string;
  archived_at?: string;
  archived_reason?: string;
  created_at?: string;
  updated_at?: string;
}
```

## TYPE-MaterialPurchaseRequest

src/types.ts:415-429

```typescript
export interface MaterialPurchaseRequest {
  id: number;
  job_card_id: number;
  item_name: string;
  quantity: number;
  unit: string;
  status: "Pending" | "Completed" | "Cancelled";
  mapped_inventory_item_id?: number | null;
  material_request_id?: number | null;
  local_purchase_id?: number | null;
  completed_by?: number | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}
```

## TYPE-MaterialEvent

src/types.ts:431-443

```typescript
export interface MaterialEvent {
  id: number;
  job_card_id: number;
  material_row_id: number;
  kind: "release" | "issued-edit";
  by_user: number;
  at: string;
  note: string;
  old_item_id: number | null;
  old_qty: number | null;
  new_item_id: number;
  new_qty: number;
}
```

## TYPE-InventoryItem

src/types.ts:445-459

```typescript
export interface InventoryItem {
  id: number;
  sku: string;
  category: string;
  name: string;
  unit: string;
  stock_qty: number;
  low_stock_qty: number;
  /** Default customer-facing rate (INR) for material invoice lines. */
  selling_price: number;
  archived_at?: string;
  archived_reason?: string;
  created_at?: string;
  updated_at?: string;
}
```

## TYPE-SupplierStatus

src/types.ts:461-461

```typescript
export type SupplierStatus = "Active" | "On hold" | "Archived";
```

## TYPE-Supplier

src/types.ts:464-475

```typescript
export interface Supplier {
  id: number;
  name: string;
  contact_name: string;
  phone: string;
  email: string;
  gstin: string;
  status: SupplierStatus;
  created_by: number;
  created_at: string;
  updated_at: string;
}
```

## TYPE-InwardPurchaseStatus

src/types.ts:477-478

```typescript
export type InwardPurchaseStatus =
  "Draft" | "Awaiting PO Approval" | "Approved" | "Received" | "Submitted";
```

## TYPE-InwardPurchase

src/types.ts:480-499

```typescript
export interface InwardPurchase {
  id: number;
  supplier_id: number;
  supplier_invoice_no: string;
  invoice_date: string;
  po_number: string;
  status: InwardPurchaseStatus;
  subtotal: number;
  discount_total: number;
  gst_total: number;
  total: number;
  created_by: number;
  submitted_by: number | null;
  submitted_at: string | null;
  purchase_order_id: number | null;
  approved_by: number | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}
```

## TYPE-InwardPurchaseLine

src/types.ts:501-513

```typescript
export interface InwardPurchaseLine {
  id: number;
  purchase_id: number;
  item_id: number;
  received_qty: number;
  unit_cost: number;
  discount: number;
  gst_rate: number;
  subtotal: number;
  gst_amount: number;
  total: number;
  purchase_order_line_id: number | null;
}
```

## TYPE-InwardPurchaseAttachment

src/types.ts:516-526

```typescript
export interface InwardPurchaseAttachment {
  id: number;
  purchase_id: number;
  original_name: string;
  mime_type: string;
  byte_size: number;
  storage_key: string;
  document_url: string;
  uploaded_by: number;
  uploaded_at: string;
}
```

## TYPE-InwardPurchaseRevision

src/types.ts:528-535

```typescript
export interface InwardPurchaseRevision {
  id: number;
  purchase_id: number;
  revision_no: number;
  reason: string;
  revised_by: number;
  revised_at: string;
}
```

## TYPE-PurchaseOrderStatus

src/types.ts:537-548

```typescript
export type PurchaseOrderStatus =
  | "PO Request"
  | "PO Request Approved"
  | "PO Issued"
  | "PO Received"
  | "PO Confirmation"
  | "Draft"
  | "Sent"
  | "Partially Received"
  | "Ready to Close"
  | "Closed"
  | "Cancelled";
```

## TYPE-PurchaseOrder

src/types.ts:551-567

```typescript
export interface PurchaseOrder {
  id: number;
  supplier_id: number;
  po_number: string;
  order_date: string;
  notes: string;
  status: PurchaseOrderStatus;
  subtotal: number;
  discount_total: number;
  gst_total: number;
  total: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  /** Child orders created when Admin splits a Purchase Request by supplier. */
  source_purchase_order_id?: number | null;
}
```

## TYPE-PurchaseOrderLine

src/types.ts:569-585

```typescript
export interface PurchaseOrderLine {
  id: number;
  purchase_order_id: number;
  item_id: number;
  /** Populated for a New Item Request before Admin creates its SKU. */
  item_name: string;
  unit: string;
  ordered_qty: number;
  unit_cost: number;
  discount: number;
  gst_rate: number;
  subtotal: number;
  gst_amount: number;
  total: number;
  /** The requested line copied into a supplier-specific child Purchase Order. */
  source_purchase_order_line_id?: number | null;
}
```

## TYPE-PurchaseOrderQuotation

src/types.ts:588-600

```typescript
export interface PurchaseOrderQuotation {
  id: number;
  purchase_order_id: number;
  purchase_order_line_id: number;
  supplier_name: string;
  quote_date: string;
  quoted_qty: number;
  unit_cost: number;
  notes: string;
  created_by: number;
  created_at: string;
  updated_at: string;
}
```

## TYPE-PurchaseOrderReceipt

src/types.ts:603-609

```typescript
export interface PurchaseOrderReceipt {
  id: number;
  purchase_order_id: number;
  received_by: number;
  received_at: string;
  note: string;
}
```

## TYPE-PurchaseOrderReceiptLine

src/types.ts:611-616

```typescript
export interface PurchaseOrderReceiptLine {
  id: number;
  purchase_order_receipt_id: number;
  purchase_order_line_id: number;
  delivered_qty: number;
}
```

## TYPE-PurchaseOrderConfirmation

src/types.ts:619-629

```typescript
export interface PurchaseOrderConfirmation {
  id: number;
  purchase_order_id: number;
  purchase_order_line_id: number;
  accepted_qty: number;
  returned_qty: number;
  damaged_qty: number;
  wasted_qty: number;
  confirmed_by: number;
  confirmed_at: string;
}
```

## TYPE-StockInward

src/types.ts:632-642

```typescript
export interface StockInward {
  id: number;
  item_id: number;
  qty: number;
  note: string;
  purchase_order_id: number | null;
  purchase_order_line_id: number | null;
  ledger_id: number | null;
  received_by: number;
  received_at: string;
}
```

## TYPE-Task

src/types.ts:644-658

```typescript
export interface Task {
  id: number;
  job_card_id: number;
  technician_id: number;
  title: string;
  status: TaskStatus;
  notes: string;
  started_at?: string;
  paused_at?: string;
  completed_at?: string;
  archived_at?: string;
  archived_reason?: string;
  created_at?: string;
  updated_at?: string;
}
```

## TYPE-Invoice

src/types.ts:660-679

```typescript
export interface Invoice {
  id: number;
  job_card_id: number;
  invoice_no: string;
  tally_invoice_no: string;
  discount: number;
  gst_rate: number;
  subtotal: number;
  gst_amount: number;
  total: number;
  /** Partial is retained only for imported/audit history; new invoices are Pending or Cleared. */
  status: "Pending" | "Partial" | "Cleared";
  notes: string;
  document_available: number;
  document_generated_at?: string;
  voided_at?: string;
  void_reason?: string;
  created_at?: string;
  updated_at?: string;
}
```

## TYPE-InvoiceEvent

src/types.ts:681-692

```typescript
export interface InvoiceEvent {
  id: number;
  job_card_id: number;
  invoice_id: number;
  kind: "create" | "edit" | "void";
  by_user: number;
  at: string;
  note: string;
  old_total: number | null;
  new_total: number | null;
  detail: string;
}
```

## TYPE-InvoiceItem

src/types.ts:694-708

```typescript
export interface InvoiceItem {
  id: number;
  invoice_id: number;
  gst_rate?: number | null;
  gst_type?: "CGST+SGST" | "IGST" | "No GST" | null;
  material_row_id?: number | null;
  kind: "Service" | "Material";
  description: string;
  qty: number;
  rate: number;
  archived_at?: string;
  archived_reason?: string;
  created_at?: string;
  updated_at?: string;
}
```

## TYPE-Payment

src/types.ts:710-723

```typescript
export interface Payment {
  id: number;
  job_card_id: number;
  invoice_id: number;
  amount: number;
  mode: PaymentMode;
  reference: string;
  notes: string;
  other_detail: string;
  voided_at?: string;
  void_reason?: string;
  created_at?: string;
  updated_at?: string;
}
```

## TYPE-Receipt

src/types.ts:725-733

```typescript
export interface Receipt {
  id: number;
  job_card_id: number;
  receipt_no: string;
  invoice_id: number;
  voided_at?: string;
  void_reason?: string;
  created_at?: string;
}
```

## TYPE-GatePass

src/types.ts:735-743

```typescript
export interface GatePass {
  id: number;
  job_card_id: number;
  gate_pass_no: string;
  invoice_id: number;
  voided_at?: string;
  void_reason?: string;
  created_at?: string;
}
```

## TYPE-Photo

src/types.ts:745-760

```typescript
export interface Photo {
  id: number;
  job_card_id: number;
  label: string;
  src: string;
  category?: string;
  mime_type?: string;
  byte_size?: number;
  original_name?: string;
  width?: number;
  height?: number;
  archived_at?: string;
  archived_reason?: string;
  created_at?: string;
  updated_at?: string;
}
```

## TYPE-Followup

src/types.ts:762-773

```typescript
export interface Followup {
  id: number;
  job_card_id: number;
  note: string;
  due_at: string;
  done: number;
  outcome?: string;
  archived_at?: string;
  archived_reason?: string;
  created_at?: string;
  updated_at?: string;
}
```

## TYPE-QcCheck

src/types.ts:775-782

```typescript
export interface QcCheck {
  id: number;
  job_card_id: number;
  label: string;
  passed: number;
  fail_reason?: string;
  archived_at?: string;
}
```

## TYPE-StatusHistory

src/types.ts:784-791

```typescript
export interface StatusHistory {
  id: number;
  job_card_id: number;
  main_status: MainStatus;
  sub_status: SubStatus;
  note: string;
  created_at: string;
}
```

## TYPE-ChecklistCycle

src/types.ts:793-800

```typescript
export interface ChecklistCycle {
  id: number;
  job_card_id: number;
  stage: ChecklistStage;
  cycle_number: number;
  started_at: string;
  completed_at: string | null;
}
```

## TYPE-ChecklistItem

src/types.ts:802-818

```typescript
export interface ChecklistItem {
  id: number;
  checklist_cycle_id: number;
  job_card_id: number;
  stage: ChecklistStage;
  cycle_number: number;
  item_key: string;
  label: SubStatus;
  sort_order: number;
  checked_by: number | null;
  checked_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  required: 0 | 1;
  na_at: string | null;
  na_by: number | null;
}
```

## TYPE-MaterialMovement

src/types.ts:820-828

```typescript
export interface MaterialMovement {
  id: number;
  job_card_id: number;
  item_id: number;
  direction: string;
  qty: number;
  note: string;
  created_at: string;
}
```

## TYPE-JobView

src/types.ts:830-868

```typescript
export interface JobView {
  job: JobCard;
  visit: Visit;
  customer: Customer;
  vehicle: Vehicle;
  advisor: User;
  technician: User;
  estimate?: Estimate;
  estimate_items: EstimateItem[];
  task_list_items: JobTaskListItem[];
  material_requests: MaterialRequest[];
  local_purchases: LocalPurchase[];
  material_purchase_requests: MaterialPurchaseRequest[];
  material_approval?: MaterialApproval;
  material_approval_history?: MaterialApprovalEvent[];
  material_events?: MaterialEvent[];
  invoice_events?: InvoiceEvent[];
  inventory: InventoryItem[];
  tasks: Task[];
  invoice?: Invoice;
  invoice_items: InvoiceItem[];
  payments: Payment[];
  receipt?: Receipt;
  gate_pass?: GatePass;
  photos: Photo[];
  followups: Followup[];
  qc_checks: QcCheck[];
  status_history: StatusHistory[];
  checklist_cycles: ChecklistCycle[];
  checklist_items: ChecklistItem[];
  material_movements: MaterialMovement[];
  /** All records, including superseded/voided rows, for the read-only Data Flow audit trail. */
  estimate_history?: Estimate[];
  invoice_history?: Invoice[];
  payment_history?: Payment[];
  receipt_history?: Receipt[];
  gate_pass_history?: GatePass[];
  photo_history?: Photo[];
}
```

## TYPE-WorkshopState

src/types.ts:870-905

```typescript
export interface WorkshopState {
  users: User[];
  customers: Customer[];
  vehicles: Vehicle[];
  visits: Visit[];
  bookings: Booking[];
  booking_call_logs: BookingCallLog[];
  booking_events: BookingEvent[];
  booking_capacity_limits: BookingCapacityLimit[];
  booking_capacity_overrides: BookingCapacityOverride[];
  jobs: JobView[];
  /** Historical records are deliberately separate so operational screens stay active-only. */
  archived_customers: Customer[];
  archived_vehicles: Vehicle[];
  archived_jobs: JobView[];
  inventory: InventoryItem[];
  service_catalog: ServiceCatalogItem[];
  attendance: AdvisorAttendance[];
  suppliers: Supplier[];
  inward_purchases: InwardPurchase[];
  inward_purchase_lines: InwardPurchaseLine[];
  inward_purchase_attachments: InwardPurchaseAttachment[];
  inward_purchase_revisions: InwardPurchaseRevision[];
  purchase_orders: PurchaseOrder[];
  purchase_order_lines: PurchaseOrderLine[];
  purchase_order_quotations: PurchaseOrderQuotation[];
  purchase_order_receipts: PurchaseOrderReceipt[];
  purchase_order_receipt_lines: PurchaseOrderReceiptLine[];
  purchase_order_confirmations: PurchaseOrderConfirmation[];
  stock_inwards: StockInward[];
  sales_leads: SalesLead[];
  sales_quotations: SalesQuotation[];
  service_departments: ServiceDepartment[];
  service_brands: ServiceCatalogMaster[];
  car_segments: ServiceCatalogMaster[];
}
```

## TYPE-AdvisorAttendance

src/types.ts:907-911

```typescript
export interface AdvisorAttendance {
  user_id: number;
  date: string;
  present: number;
}
```

## TYPE-SearchSelectOption

src/ui-kit.tsx:86-86

```typescript
export interface SearchSelectOption { value: number | string; label: string }
```