# Operation and workflow source contracts

Each exported function has its exact implementation, inputs, call dependencies, SQL evidence, validation/error branches and source span. This is static VERIFIED evidence; runtime effects are PARTIALLY VERIFIED until exercised. Helper calls are linked by literal symbol. No proposed endpoint path is implied.

## OP-admin-demo-state-resolveRoleMenuPageKeys

Source: src/admin-demo-state.ts:158-161

Dependencies: ROLE_MENU_PAGE_KEYS[role].filter, permitted.has

```typescript
export function resolveRoleMenuPageKeys(role: Role, permittedPages: readonly AdminPageKey[]): AdminPageKey[] {
  const permitted = new Set(permittedPages);
  return ROLE_MENU_PAGE_KEYS[role].filter((key) => permitted.has(key));
}
```

## OP-admin-demo-state-createDefaultAdminDemoState

Source: src/admin-demo-state.ts:469-483

Dependencies: new Date(now).toISOString, builtInRoles, clone, defaultLogs, seedReportTemplates

```typescript
export function createDefaultAdminDemoState(now: Date | string = DEFAULT_TIMESTAMP): AdminDemoState {
  const timestamp = new Date(now).toISOString();
  return {
    version: ADMIN_DEMO_STATE_VERSION,
    roles: builtInRoles(timestamp),
    rolePageAccess: clone(DEFAULT_ROLE_PAGE_ACCESS),
    businessSettings: clone(DEFAULT_SETTINGS),
    appTheme: { ...DEFAULT_APP_THEME },
    logs: defaultLogs(timestamp),
    importBatches: [],
    sessionInventory: [],
    reportTemplates: seedReportTemplates(timestamp),
    companyAssets: { logo: null, stamp: null, authorizedSignature: null },
  };
}
```

## OP-admin-demo-state-normalizeAppTheme

Source: src/admin-demo-state.ts:485-489

Dependencies: APP_THEME_FONTS.some, APP_THEME_PALETTES.some

```typescript
export function normalizeAppTheme(theme?: Partial<AppTheme>): AppTheme {
  const fontId = APP_THEME_FONTS.some((font) => font.id === theme?.fontId) ? theme!.fontId! : DEFAULT_APP_THEME.fontId;
  const paletteId = APP_THEME_PALETTES.some((palette) => palette.id === theme?.paletteId) ? theme!.paletteId! : DEFAULT_APP_THEME.paletteId;
  return { fontId, paletteId };
}
```

## OP-admin-demo-state-loadAdminDemoState

Source: src/admin-demo-state.ts:564-574

Dependencies: browserSessionStorage, createDefaultAdminDemoState, storage.getItem, hydrateState, JSON.parse, enforceLogRetention

```typescript
export function loadAdminDemoState(storage: SessionStorageLike | undefined = browserSessionStorage(), now: Date | string = new Date()): AdminDemoState {
  if (!storage) return createDefaultAdminDemoState(now);
  try {
    const raw = storage.getItem(ADMIN_DEMO_STORAGE_KEY) ?? storage.getItem(LEGACY_ADMIN_DEMO_STORAGE_KEY);
    if (!raw) return createDefaultAdminDemoState(now);
    const hydrated = hydrateState(JSON.parse(raw));
    return hydrated ? enforceLogRetention(hydrated, now) : createDefaultAdminDemoState(now);
  } catch {
    return createDefaultAdminDemoState(now);
  }
}
```

## OP-admin-demo-state-saveAdminDemoState

Source: src/admin-demo-state.ts:576-580

Dependencies: browserSessionStorage, enforceLogRetention, storage?.setItem, JSON.stringify

```typescript
export function saveAdminDemoState(state: AdminDemoState, storage: SessionStorageLike | undefined = browserSessionStorage(), now: Date | string = new Date()): AdminDemoState {
  const retained = enforceLogRetention({ ...state, version: ADMIN_DEMO_STATE_VERSION }, now);
  storage?.setItem(ADMIN_DEMO_STORAGE_KEY, JSON.stringify(retained));
  return retained;
}
```

## OP-admin-demo-state-resetAdminDemoState

Source: src/admin-demo-state.ts:582-585

Dependencies: browserSessionStorage, storage?.removeItem, createDefaultAdminDemoState

```typescript
export function resetAdminDemoState(storage: SessionStorageLike | undefined = browserSessionStorage(), now: Date | string = new Date()): AdminDemoState {
  storage?.removeItem(ADMIN_DEMO_STORAGE_KEY);
  return createDefaultAdminDemoState(now);
}
```

## OP-admin-demo-state-addDemoRole

Source: src/admin-demo-state.ts:599-625

Dependencies: normalizedRoleLabel, assertUniqueRoleLabel, new Date(now).toISOString, state.roles.reduce, /^custom-(\d+)$/.exec, Math.max, Number, input.description?.trim, sanitizePages

```typescript
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
```

## OP-admin-demo-state-updateDemoRole

Source: src/admin-demo-state.ts:627-646

Dependencies: state.roles.find, normalizedRoleLabel, assertUniqueRoleLabel, state.roles.map, updates.description.trim, new Date(now).toISOString

```typescript
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
```

## OP-admin-demo-state-archiveDemoRole

Source: src/admin-demo-state.ts:648-656

Dependencies: state.roles.some, new Date(now).toISOString, state.roles.map

```typescript
export function archiveDemoRole(state: AdminDemoState, roleId: string, now: Date | string = new Date()): AdminDemoState {
  if (roleId === OWNER_ROLE_ID) throw new Error("Owner/Admin cannot be archived.");
  if (!state.roles.some((role) => role.id === roleId)) throw new Error("Role not found.");
  const timestamp = new Date(now).toISOString();
  return {
    ...state,
    roles: state.roles.map((role) => role.id === roleId ? { ...role, status: "archived", archivedAt: timestamp, updatedAt: timestamp } : role),
  };
}
```

## OP-admin-demo-state-updateRolePageAccess

Source: src/admin-demo-state.ts:667-671

Dependencies: state.roles.some, protectOwnerAccess, sanitizePages

```typescript
export function updateRolePageAccess(state: AdminDemoState, roleId: string, pages: readonly AdminPageKey[]): AdminDemoState {
  if (!state.roles.some((role) => role.id === roleId)) throw new Error("Role not found.");
  const nextPages = roleId === OWNER_ROLE_ID ? protectOwnerAccess(pages) : sanitizePages(pages);
  return { ...state, rolePageAccess: { ...state.rolePageAccess, [roleId]: nextPages } };
}
```

## OP-admin-demo-state-resolvePermittedPages

Source: src/admin-demo-state.ts:673-678

Dependencies: state.roles.find, sanitizePages, protectOwnerAccess

```typescript
export function resolvePermittedPages(state: AdminDemoState, roleId: string): AdminPageKey[] {
  const role = state.roles.find((candidate) => candidate.id === roleId);
  if (!role || role.status === "archived") return [];
  const pages = sanitizePages(state.rolePageAccess[roleId] ?? []);
  return roleId === OWNER_ROLE_ID ? protectOwnerAccess(pages) : pages;
}
```

## OP-admin-demo-state-updateBusinessSettings

Source: src/admin-demo-state.ts:680-682

Dependencies: normalizeBusinessSettings, mergeSettings

```typescript
export function updateBusinessSettings(state: AdminDemoState, updates: DeepPartial<WorkshopBusinessSettings>): AdminDemoState {
  return { ...state, businessSettings: normalizeBusinessSettings(mergeSettings(updates, state.businessSettings)) };
}
```

## OP-admin-demo-state-updateAppTheme

Source: src/admin-demo-state.ts:684-686

Dependencies: normalizeAppTheme

```typescript
export function updateAppTheme(state: AdminDemoState, appTheme: Partial<AppTheme>): AdminDemoState {
  return { ...state, appTheme: normalizeAppTheme(appTheme) };
}
```

## OP-admin-demo-state-normalizeBusinessSettings

Source: src/admin-demo-state.ts:688-740

Dependencies: value.trim, trim, settings.branch.workingDays.map, trim(settings.billing.gstin).toUpperCase, trim(settings.billing.bankIfsc).toUpperCase, settings.billing.paymentModes.map

```typescript
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
      jobCardCreatedWhatsAppTemplate: trim(
        settings.notifications.jobCardCreatedWhatsAppTemplate,
      ),
      jobCardCreatedEmailTemplate: trim(
        settings.notifications.jobCardCreatedEmailTemplate,
      ),
      jobCardClosedWhatsAppTemplate: trim(
        settings.notifications.jobCardClosedWhatsAppTemplate,
      ),
      jobCardClosedEmailTemplate: trim(
        settings.notifications.jobCardClosedEmailTemplate,
      ),
    },
    logRetention: { ...settings.logRetention },
  };
}
```

## OP-admin-demo-state-validateBusinessSettings

Source: src/admin-demo-state.ts:742-763

Dependencies: settings.profile.businessName.trim, errors.push, /^\S+@\S+\.\S+$/.test, settings.profile.email.trim, settings.branch.name.trim, /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test, /^[A-Z]{4}0[A-Z0-9]{6}$/.test, /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+$/.test

```typescript
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
  if (!settings.notifications.jobCardCreatedWhatsAppTemplate)
    errors.push("Job-card creation WhatsApp template is required.");
  if (!settings.notifications.jobCardCreatedEmailTemplate)
    errors.push("Job-card creation email template is required.");
  if (!settings.notifications.jobCardClosedWhatsAppTemplate)
    errors.push("Job-card closure WhatsApp template is required.");
  if (!settings.notifications.jobCardClosedEmailTemplate)
    errors.push("Job-card closure email template is required.");
  return errors;
}
```

## OP-admin-demo-state-createReportTemplate

Source: src/admin-demo-state.ts:786-796

Dependencies: assertTemplateInput, new Date(now).toISOString, nextTemplateId, input.name.trim, input.html.trim, Boolean, state.reportTemplates.map

```typescript
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
```

## OP-admin-demo-state-updateReportTemplate

Source: src/admin-demo-state.ts:798-818

Dependencies: state.reportTemplates.find, assertTemplateInput, new Date(now).toISOString, state.reportTemplates.map, name.trim, html.trim

```typescript
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
```

## OP-admin-demo-state-activateReportTemplate

Source: src/admin-demo-state.ts:820-822

Dependencies: updateReportTemplate

```typescript
export function activateReportTemplate(state: AdminDemoState, templateId: string, now: Date | string = new Date()): AdminDemoState {
  return updateReportTemplate(state, templateId, { active: true }, now);
}
```

## OP-admin-demo-state-deleteReportTemplate

Source: src/admin-demo-state.ts:824-829

Dependencies: state.reportTemplates.find, state.reportTemplates.filter

```typescript
export function deleteReportTemplate(state: AdminDemoState, templateId: string): AdminDemoState {
  const current = state.reportTemplates.find((template) => template.id === templateId);
  if (!current) throw new Error("Template not found.");
  if (current.active) throw new Error("Activate another template before deleting the active template.");
  return { ...state, reportTemplates: state.reportTemplates.filter((template) => template.id !== templateId) };
}
```

## OP-admin-demo-state-saveCompanyIdentity

Source: src/admin-demo-state.ts:834-843

Dependencies: companyName.trim, normalizeBusinessSettings, mergeSettings

```typescript
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
```

## OP-admin-demo-state-appendDemoLog

Source: src/admin-demo-state.ts:853-864

Dependencies: nextLogId, new Date(entry.timestamp ?? now).toISOString, enforceLogRetention

```typescript
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
```

## OP-admin-demo-state-filterDemoLogs

Source: src/admin-demo-state.ts:866-885

Dependencies: filter.search?.trim().toLowerCase, filter.search?.trim, new Date(`${filter.dateFrom}T00:00:00.000`).getTime, new Date(`${filter.dateTo}T23:59:59.999`).getTime, logs.filter((log) => {
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
  }).sort, logs.filter, new Date(log.timestamp).getTime, filter.levels.includes, [log.message, log.area, log.feature, log.userName, log.referenceId].filter(Boolean).join(" ").toLowerCase, [log.message, log.area, log.feature, log.userName, log.referenceId].filter(Boolean).join, [log.message, log.area, log.feature, log.userName, log.referenceId].filter, haystack.includes, new Date(right.timestamp).getTime, new Date(left.timestamp).getTime

```typescript
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
```

## OP-admin-demo-state-clearDemoLogs

Source: src/admin-demo-state.ts:887-889

Dependencies: state.logs.filter

```typescript
export function clearDemoLogs(state: AdminDemoState, stream: DemoLogStream | "all" = "all"): AdminDemoState {
  return { ...state, logs: stream === "all" ? [] : state.logs.filter((log) => log.stream !== stream) };
}
```

## OP-admin-demo-state-confirmInventoryImport

Source: src/admin-demo-state.ts:921-967

Dependencies: new Date(now).toISOString, nextImportBatchId, nextSessionInventoryId, created.push

```typescript
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
      sellingPrice: row.sellingPrice ?? 0,
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
```

## OP-admin-demo-state-enforceLogRetention

Source: src/admin-demo-state.ts:969-980

Dependencies: new Date(now).getTime, Math.max, state.logs.filter, new Date(log.timestamp).getTime, Number.isFinite, retentionMs

```typescript
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
```

## OP-advance-booking-range-shiftCalendarMonth

Source: src/advance-booking-range.ts:11-15

Dependencies: parseMonth, Math.floor, pad

```typescript
export function shiftCalendarMonth(month: string, amount: number) {
  const parsed = parseMonth(month);
  const absoluteMonth = parsed.year * 12 + parsed.month - 1 + amount;
  return `${Math.floor(absoluteMonth / 12)}-${pad((absoluteMonth % 12) + 1)}`;
}
```

## OP-advance-booking-range-localDateOnly

Source: src/advance-booking-range.ts:23-25

Dependencies: now.getFullYear, pad, now.getMonth, now.getDate

```typescript
export function localDateOnly(now = new Date()) {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}
```

## OP-advance-booking-range-advanceBookingRange

Source: src/advance-booking-range.ts:31-38

Dependencies: localDateOnly, today.slice, shiftCalendarMonth, now.getFullYear, now.getMonth, now.getDate, daysInMonth

```typescript
export function advanceBookingRange(now = new Date()): AdvanceBookingRange {
  const today = localDateOnly(now);
  const currentMonth = today.slice(0, 7);
  const firstMonth = currentMonth;
  const lastMonth = shiftCalendarMonth(currentMonth, 3);
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return { min: localDateOnly(tomorrow), max: `${lastMonth}-${daysInMonth(lastMonth)}`, firstMonth, lastMonth };
}
```

## OP-advance-booking-range-isAdvanceBookingDate

Source: src/advance-booking-range.ts:40-42

Dependencies: 

```typescript
export function isAdvanceBookingDate(date: string, range: AdvanceBookingRange) {
  return date >= range.min && date <= range.max;
}
```

## OP-advance-booking-range-clampAdvanceBookingDate

Source: src/advance-booking-range.ts:44-48

Dependencies: 

```typescript
export function clampAdvanceBookingDate(date: string, range: AdvanceBookingRange) {
  if (date < range.min) return range.min;
  if (date > range.max) return range.max;
  return date;
}
```

## OP-advance-booking-range-datesForCalendarMonth

Source: src/advance-booking-range.ts:50-59

Dependencies: parseMonth, new Date(Date.UTC(year, monthNumber - 1, 1)).getUTCDay, Date.UTC, Array.from, date.setUTCDate, firstDate.getUTCDate, date.getUTCFullYear, pad, date.getUTCMonth, date.getUTCDate

```typescript
export function datesForCalendarMonth(month: string) {
  const { year, month: monthNumber } = parseMonth(month);
  const firstWeekday = new Date(Date.UTC(year, monthNumber - 1, 1)).getUTCDay();
  const firstDate = new Date(Date.UTC(year, monthNumber - 1, 1 - firstWeekday));
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(firstDate);
    date.setUTCDate(firstDate.getUTCDate() + index);
    return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
  });
}
```

## OP-auth-loadAuthConfig

Source: src/auth.ts:46-55

Dependencies: fetch, response.headers.get("content-type")?.includes, response.headers.get, response.json

```typescript
export async function loadAuthConfig(): Promise<AuthConfig> {
  const localDemo = import.meta.env.DEV || location.hostname === "localhost" || location.hostname === "127.0.0.1";
  try {
    const response = await fetch("/api/v1/auth/config", { headers: { accept: "application/json" } });
    if (!response.ok || !response.headers.get("content-type")?.includes("application/json")) return { mode: "local", allowDemo: localDemo };
    return await response.json() as AuthConfig;
  } catch {
    return { mode: "local", allowDemo: localDemo };
  }
}
```

## OP-auth-beginCognitoLogin

Source: src/auth.ts:57-72

Dependencies: randomValue, sessionStorage.setItem, JSON.stringify, new URLSearchParams({
    client_id: config.clientId,
    response_type: "code",
    redirect_uri: config.callbackUri,
    scope: config.scopes.join(" "),
    state,
    code_challenge_method: "S256",
    code_challenge: base64Url(await sha256(verifier)),
  }).toString, config.scopes.join, base64Url, sha256, location.assign

```typescript
export async function beginCognitoLogin(config: CognitoConfig) {
  const verifier = randomValue();
  const state = randomValue();
  sessionStorage.setItem(OAUTH_KEY, JSON.stringify({ verifier, state }));
  const url = new URL(config.authorizationEndpoint);
  url.search = new URLSearchParams({
    client_id: config.clientId,
    response_type: "code",
    redirect_uri: config.callbackUri,
    scope: config.scopes.join(" "),
    state,
    code_challenge_method: "S256",
    code_challenge: base64Url(await sha256(verifier)),
  }).toString();
  location.assign(url);
}
```

## OP-auth-completeCognitoCallback

Source: src/auth.ts:99-113

Dependencies: params.get, sessionStorage.getItem, JSON.parse, exchange, sessionStorage.setItem, JSON.stringify, sessionStorage.removeItem, history.replaceState

```typescript
export async function completeCognitoCallback(config: CognitoConfig) {
  const params = new URLSearchParams(location.search);
  const code = params.get("code");
  if (!code) return;
  const saved = sessionStorage.getItem(OAUTH_KEY);
  const oauth = saved ? JSON.parse(saved) as { verifier: string; state: string } : undefined;
  if (!oauth || params.get("state") !== oauth.state) throw new Error("Cognito sign-in state was invalid.");
  const result = await exchange(config, new URLSearchParams({
    grant_type: "authorization_code", client_id: config.clientId, code,
    redirect_uri: config.callbackUri, code_verifier: oauth.verifier,
  }));
  sessionStorage.setItem(TOKEN_KEY, JSON.stringify(result));
  sessionStorage.removeItem(OAUTH_KEY);
  history.replaceState({}, document.title, `${location.pathname}${location.hash}`);
}
```

## OP-auth-authenticatedFetch

Source: src/auth.ts:115-119

Dependencies: tokens, fetch

```typescript
export async function authenticatedFetch(config: CognitoConfig, path: string, init: RequestInit = {}) {
  const current = await tokens(config);
  if (!current) throw new Error("AUTHENTICATION_REQUIRED");
  return fetch(path, { ...init, headers: { ...init.headers, authorization: `Bearer ${current.accessToken}`, accept: "application/json" } });
}
```

## OP-auth-loadWorkshopSession

Source: src/auth.ts:121-129

Dependencies: completeCognitoCallback, tokens, authenticatedFetch, sessionStorage.removeItem, response.json

```typescript
export async function loadWorkshopSession(config: CognitoConfig): Promise<WorkshopSession | undefined> {
  await completeCognitoCallback(config);
  const current = await tokens(config);
  if (!current) return undefined;
  const response = await authenticatedFetch(config, "/api/v1/session");
  if (response.status === 401) { sessionStorage.removeItem(TOKEN_KEY); return undefined; }
  if (!response.ok) throw new Error((await response.json() as { code?: string }).code ?? "SESSION_FAILED");
  return response.json() as Promise<WorkshopSession>;
}
```

## OP-auth-endCognitoSession

Source: src/auth.ts:131-136

Dependencies: sessionStorage.removeItem, new URLSearchParams({ client_id: config.clientId, logout_uri: config.logoutUri }).toString, location.assign

```typescript
export function endCognitoSession(config: CognitoConfig) {
  sessionStorage.removeItem(TOKEN_KEY);
  const url = new URL(config.logoutEndpoint);
  url.search = new URLSearchParams({ client_id: config.clientId, logout_uri: config.logoutUri }).toString();
  location.assign(url);
}
```

## OP-booking-followup-expectedBookingsForDate

Source: src/booking-followup.ts:12-56

Dependencies: callsByBooking.get, calls.push, callsByBooking.set, bookings
    .filter(
      (booking) =>
        booking.booking_date === bookingDate &&
        expectedStatuses.includes(booking.status),
    )
    .map((booking) => {
      const calls = [...(callsByBooking.get(booking.id) ?? [])].sort((left, right) =>
        right.called_at.localeCompare(left.called_at),
      );
      return { booking, calls, lastCall: calls[0] };
    })
    .filter((row) =>
      filter === "ALL"
        ? true
        : filter === "CALLED"
          ? row.calls.length > 0
          : row.calls.length === 0,
    )
    .sort, bookings
    .filter(
      (booking) =>
        booking.booking_date === bookingDate &&
        expectedStatuses.includes(booking.status),
    )
    .map((booking) => {
      const calls = [...(callsByBooking.get(booking.id) ?? [])].sort((left, right) =>
        right.called_at.localeCompare(left.called_at),
      );
      return { booking, calls, lastCall: calls[0] };
    })
    .filter, bookings
    .filter(
      (booking) =>
        booking.booking_date === bookingDate &&
        expectedStatuses.includes(booking.status),
    )
    .map, bookings
    .filter, expectedStatuses.includes, [...(callsByBooking.get(booking.id) ?? [])].sort, right.called_at.localeCompare, windowOrder.indexOf, left.booking.customer_name.localeCompare

```typescript
export function expectedBookingsForDate(
  bookings: readonly Booking[],
  callLogs: readonly BookingCallLog[],
  bookingDate: string,
  filter: ExpectedTodayFilter = "ALL",
): ExpectedBookingRow[] {
  const callsByBooking = new Map<number, BookingCallLog[]>();
  for (const call of callLogs) {
    const calls = callsByBooking.get(call.booking_id) ?? [];
    calls.push(call);
    callsByBooking.set(call.booking_id, calls);
  }

  const expectedStatuses: BookingStatus[] = [
    "Booked",
    "Confirmed",
    "Rescheduled",
  ];
  return bookings
    .filter(
      (booking) =>
        booking.booking_date === bookingDate &&
        expectedStatuses.includes(booking.status),
    )
    .map((booking) => {
      const calls = [...(callsByBooking.get(booking.id) ?? [])].sort((left, right) =>
        right.called_at.localeCompare(left.called_at),
      );
      return { booking, calls, lastCall: calls[0] };
    })
    .filter((row) =>
      filter === "ALL"
        ? true
        : filter === "CALLED"
          ? row.calls.length > 0
          : row.calls.length === 0,
    )
    .sort((left, right) => {
      const windowOrder = ["Morning", "Afternoon", "Evening", ""];
      const windowDifference =
        windowOrder.indexOf(left.booking.arrival_window) -
        windowOrder.indexOf(right.booking.arrival_window);
      return windowDifference || left.booking.customer_name.localeCompare(right.booking.customer_name);
    });
}
```

## OP-dashboard-metrics-cashflowFacts

Source: src/dashboard-metrics.ts:43-73

Dependencies: today.slice, month.split("-").map, month.split, Number.isFinite, new Date(year, monthNumber, 0).getDate, Number, Math.min, Math.max, inMonth, clearedInvoiceById.set, [...clearedInvoiceById.values()].reduce, clearedInvoiceById.values, new Date(`${month}-01T00:00:00`).toLocaleDateString, jobs.filter

```typescript
export function cashflowFacts(jobs: JobView[], today: string, month = today.slice(0, 7)): CashflowFacts {
  const currentMonth = today.slice(0, 7);
  const [year, monthNumber] = month.split("-").map(Number);
  const daysInMonth = Number.isFinite(year) && Number.isFinite(monthNumber) ? new Date(year, monthNumber, 0).getDate() : 0;
  const parsedDay = Number(today.slice(8, 10));
  const daysElapsed = month === currentMonth ? Math.min(Math.max(Number.isFinite(parsedDay) ? parsedDay : 0, 0), daysInMonth) : daysInMonth;
  const clearedInvoiceById = new Map<number, NonNullable<JobView["invoice"]>>();
  let paymentsReceived = 0;
  for (const view of jobs) {
    const invoice = view.invoice;
    if (!invoice || invoice.voided_at || invoice.status !== "Cleared") continue;
    for (const payment of view.payments) {
      if (!payment.voided_at && payment.invoice_id === invoice.id && inMonth(payment.created_at, month)) {
        paymentsReceived += 1;
        clearedInvoiceById.set(invoice.id, invoice);
      }
    }
  }
  const totalCollections = [...clearedInvoiceById.values()].reduce((total, invoice) => total + invoice.total, 0);
  return {
    month,
    monthLabel: new Date(`${month}-01T00:00:00`).toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
    monthComplete: month !== currentMonth,
    daysElapsed,
    daysInMonth,
    invoicesGenerated: jobs.filter((view) => !view.invoice?.voided_at && inMonth(view.invoice?.created_at, month)).length,
    paymentsReceived,
    totalCollections,
    projectedMonthlyCollection: daysElapsed > 0 ? totalCollections / daysElapsed * daysInMonth : 0,
  };
}
```

## OP-dashboard-metrics-dashboardFacts

Source: src/dashboard-metrics.ts:79-111

Dependencies: today.slice, new Date(`${currentMonth}-01T00:00:00`).toLocaleDateString, jobs.filter, ["CLOSED", "CANCELLED"].includes, jobs.flatMap((view) => view.material_requests).filter, jobs.flatMap, inMonth, cashflowFacts, jobs.map, inventory.filter, monthlyRequests.filter

```typescript
export function dashboardFacts(jobs: JobView[], inventory: { stock_qty: number; low_stock_qty: number }[], today: string, cashflowMonth = today.slice(0, 7)): DashboardFacts {
  const currentMonth = today.slice(0, 7);
  const monthLabel = new Date(`${currentMonth}-01T00:00:00`).toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  const activeJobs = jobs.filter((view) => !["CLOSED", "CANCELLED"].includes(view.job.main_status));
  const monthlyRequests = jobs.flatMap((view) => view.material_requests).filter((request) => inMonth(request.created_at, currentMonth));
  const cashflow = cashflowFacts(jobs, today, cashflowMonth);

  return {
    currentMonth,
    monthLabel,
    cashflowMonth: cashflow.month,
    cashflowMonthLabel: cashflow.monthLabel,
    cashflowMonthComplete: cashflow.monthComplete,
    daysElapsed: cashflow.daysElapsed,
    daysInMonth: cashflow.daysInMonth,
    activeToday: activeJobs.length,
    totalVisits: jobs.length,
    inProgress: jobs.filter((view) => view.job.main_status === "IN_PROGRESS").length,
    closed: jobs.filter((view) => view.job.main_status === "CLOSED").length,
    onHold: jobs.filter((view) => view.job.main_status === "HOLD").length,
    customersServed: new Set(jobs.map((view) => view.customer.id)).size,
    vehiclesServed: new Set(jobs.map((view) => view.vehicle.id)).size,
    invoicesGenerated: cashflow.invoicesGenerated,
    paymentsReceived: cashflow.paymentsReceived,
    totalCollections: cashflow.totalCollections,
    projectedMonthlyCollection: cashflow.projectedMonthlyCollection,
    lowStock: inventory.filter((item) => item.stock_qty < item.low_stock_qty).length,
    pendingApprovals: jobs.filter((view) => view.material_approval?.status === "Pending" && inMonth(view.material_approval.submitted_at, currentMonth)).length,
    materialRequests: monthlyRequests.length,
    materialsIssued: monthlyRequests.filter((request) => request.issued_qty > 0 || request.status === "Issued").length,
  };
}
```

## OP-data-flow-dataFlowMonths

Source: src/data-flow.ts:15-17

Dependencies: Array.from(new Set(jobs.map(visitMonth).filter(Boolean))).sort().reverse, Array.from(new Set(jobs.map(visitMonth).filter(Boolean))).sort, Array.from, jobs.map(visitMonth).filter, jobs.map

```typescript
export function dataFlowMonths(jobs: JobView[]) {
  return Array.from(new Set(jobs.map(visitMonth).filter(Boolean))).sort().reverse();
}
```

## OP-data-flow-dataFlowDates

Source: src/data-flow.ts:19-21

Dependencies: Array.from(new Set(jobs.filter((view) => !month || visitMonth(view) === month).map(visitDate).filter(Boolean))).sort().reverse, Array.from(new Set(jobs.filter((view) => !month || visitMonth(view) === month).map(visitDate).filter(Boolean))).sort, Array.from, jobs.filter((view) => !month || visitMonth(view) === month).map(visitDate).filter, jobs.filter((view) => !month || visitMonth(view) === month).map, jobs.filter, visitMonth

```typescript
export function dataFlowDates(jobs: JobView[], month: string) {
  return Array.from(new Set(jobs.filter((view) => !month || visitMonth(view) === month).map(visitDate).filter(Boolean))).sort().reverse();
}
```

## OP-data-flow-dataFlowSearchText

Source: src/data-flow.ts:23-25

Dependencies: 

```typescript
export function dataFlowSearchText(view: JobView) {
  return `${view.job.job_no} ${view.vehicle.number} ${view.vehicle.make} ${view.vehicle.model} ${view.customer.name} ${view.customer.mobile}`;
}
```

## OP-data-flow-filterDataFlowJobs

Source: src/data-flow.ts:27-34

Dependencies: normalizeSearch, jobs.filter, visitMonth, visitDate, normalizeSearch(dataFlowSearchText(view)).includes, dataFlowSearchText

```typescript
export function filterDataFlowJobs(jobs: JobView[], filters: DataFlowFilters) {
  const needle = normalizeSearch(filters.query);
  return jobs.filter((view) =>
    (!filters.month || visitMonth(view) === filters.month)
    && (!filters.date || visitDate(view) === filters.date)
    && (!needle || normalizeSearch(dataFlowSearchText(view)).includes(needle))
  );
}
```

## OP-data-flow-summarizeJobLifecycle

Source: src/data-flow.ts:62-75

Dependencies: [...view.checklist_cycles].sort, view.checklist_items.filter((item) => item.checklist_cycle_id === cycle.id).sort, view.checklist_items.filter, items.filter((item) => !item.checked_at).map, items.filter, Boolean

```typescript
export function summarizeJobLifecycle(view: JobView): LifecycleSummary {
  if (view.job.main_status === "CANCELLED") return { stage: "CANCELLED", cycle: null, activeStep: "Cancelled", remainingSteps: [], completed: true };
  const cycle = [...view.checklist_cycles].sort((left, right) => right.id - left.id)[0];
  if (!cycle) return { stage: view.job.main_status, cycle: null, activeStep: view.job.sub_status, remainingSteps: [], completed: false };
  const items = view.checklist_items.filter((item) => item.checklist_cycle_id === cycle.id).sort((left, right) => left.sort_order - right.sort_order);
  const remainingSteps = items.filter((item) => !item.checked_at).map((item) => item.label);
  return {
    stage: cycle.stage,
    cycle: cycle.cycle_number,
    activeStep: remainingSteps[0] ?? (cycle.completed_at ? "Stage complete" : view.job.sub_status),
    remainingSteps,
    completed: Boolean(cycle.completed_at) || (items.length > 0 && remainingSteps.length === 0),
  };
}
```

## OP-data-flow-buildDataFlowTimeline

Source: src/data-flow.ts:88-160

Dependencies: actorName, hasTime, events.push, view.checklist_items.forEach, checklistEvents, [...view.status_history].sort, a.created_at.localeCompare, view.status_history.forEach, documentNumber, sameTime, payment.amount.toFixed, view.inventory.find, item, event.old_total.toFixed, event.new_total.toFixed, events.filter((event) => hasTime(event.timestamp)).sort, events.filter, new Date(left.timestamp).getTime, new Date(right.timestamp).getTime, Number.isNaN, left.timestamp.localeCompare, left.id.localeCompare

```typescript
export function buildDataFlowTimeline(view: JobView, users: User[] = []): DataFlowEvent[] {
  const events: DataFlowEvent[] = [{ id: `visit-${view.visit.id}`, kind: "visit", timestamp: view.visit.received_at, title: "Vehicle visit received", detail: `${view.vehicle.number} · ${view.visit.requested_work}`, actor: actorName(view.visit.received_by, users) }];
  for (const cycle of view.checklist_cycles) {
    if (hasTime(cycle.started_at)) events.push({ id: `cycle-start-${cycle.id}`, kind: "checklist", timestamp: cycle.started_at, title: `${cycle.stage} checklist started`, detail: `Cycle ${cycle.cycle_number}`, actor: "System" });
    if (hasTime(cycle.completed_at)) events.push({ id: `cycle-complete-${cycle.id}`, kind: "checklist", timestamp: cycle.completed_at, title: `${cycle.stage} checklist completed`, detail: `Cycle ${cycle.cycle_number}`, actor: "System" });
  }
  view.checklist_items.forEach((item) => events.push(...checklistEvents(item, users)));
  const firstStatusId = [...view.status_history].sort((a, b) => a.created_at.localeCompare(b.created_at) || a.id - b.id)[0]?.id;
  view.status_history.forEach((item) => events.push({ id: `status-${item.id}`, kind: "status", timestamp: item.created_at, title: `Status changed to ${item.main_status}`, detail: `${item.sub_status} · ${item.note}`, document: item.id === firstStatusId ? { kind: "job-card", number: view.job.job_no } : undefined }));

  for (const estimate of view.estimate_history ?? (view.estimate ? [view.estimate] : [])) {
    if (hasTime(estimate.created_at)) events.push({ id: `estimate-create-${estimate.id}`, kind: "estimate", timestamp: estimate.created_at, title: "Estimate created", detail: `${estimate.status} · GST ${estimate.gst_rate}%`, state: estimate.archived_at ? "historical" : "current", document: estimate.archived_at ? undefined : { kind: "estimate", number: view.estimate?.id === estimate.id ? documentNumber("estimate", view) : "" } });
    if (hasTime(estimate.updated_at) && !sameTime(estimate.updated_at, estimate.created_at) && !sameTime(estimate.updated_at, estimate.archived_at)) events.push({ id: `estimate-update-${estimate.id}`, kind: "estimate", timestamp: estimate.updated_at, title: "Estimate updated", detail: estimate.approval_note || estimate.status, state: estimate.archived_at ? "historical" : "current" });
    if (hasTime(estimate.archived_at)) events.push({ id: `estimate-archive-${estimate.id}`, kind: "document", timestamp: estimate.archived_at, title: "Estimate document archived", detail: estimate.archived_reason || "Superseded", state: "archived" });
  }

  for (const invoice of view.invoice_history ?? (view.invoice ? [view.invoice] : [])) {
    const current = invoice.id === view.invoice?.id && !invoice.voided_at;
    if (hasTime(invoice.created_at)) {
      events.push({ id: `invoice-create-${invoice.id}`, kind: "invoice", timestamp: invoice.created_at, title: "Invoice created", detail: `${invoice.invoice_no} · ${invoice.status}`, state: current ? "current" : "historical" });
    }
    if (hasTime(invoice.document_generated_at)) events.push({ id: `invoice-document-${invoice.id}`, kind: "document", timestamp: invoice.document_generated_at, title: "Invoice PDF generated", detail: invoice.invoice_no, state: current ? "current" : "historical", document: current ? { kind: "invoice", number: invoice.invoice_no } : undefined });
    if (hasTime(invoice.updated_at) && !sameTime(invoice.updated_at, invoice.created_at) && !sameTime(invoice.updated_at, invoice.voided_at)) events.push({ id: `invoice-update-${invoice.id}`, kind: "invoice", timestamp: invoice.updated_at, title: "Invoice updated", detail: `${invoice.invoice_no} · ${invoice.status}`, state: current ? "current" : "historical" });
    if (hasTime(invoice.voided_at)) {
      events.push({ id: `invoice-void-${invoice.id}`, kind: "invoice", timestamp: invoice.voided_at, title: "Invoice voided", detail: `${invoice.invoice_no} · ${invoice.void_reason || "No reason recorded"}`, state: "voided" });
      if (invoice.document_generated_at) events.push({ id: `invoice-document-void-${invoice.id}`, kind: "document", timestamp: invoice.voided_at, title: "Invoice PDF voided", detail: invoice.void_reason || invoice.invoice_no, state: "voided", document: { kind: "invoice", number: invoice.invoice_no, void: true } });
    }
  }

  for (const payment of view.payment_history ?? view.payments) {
    const current = !payment.voided_at && payment.invoice_id === view.invoice?.id;
    if (hasTime(payment.created_at)) events.push({ id: `payment-create-${payment.id}`, kind: "payment", timestamp: payment.created_at, title: "Payment recorded", detail: `${payment.mode}${payment.reference ? ` · ${payment.reference}` : ""} · ₹${payment.amount.toFixed(2)}`, state: current ? "current" : "historical" });
    if (hasTime(payment.updated_at) && !sameTime(payment.updated_at, payment.created_at) && !sameTime(payment.updated_at, payment.voided_at)) events.push({ id: `payment-update-${payment.id}`, kind: "payment", timestamp: payment.updated_at, title: "Payment updated", detail: `${payment.mode} · ₹${payment.amount.toFixed(2)}`, state: current ? "current" : "historical" });
    if (hasTime(payment.voided_at)) events.push({ id: `payment-void-${payment.id}`, kind: "payment", timestamp: payment.voided_at, title: "Payment voided", detail: payment.void_reason || `₹${payment.amount.toFixed(2)}`, state: "voided" });
  }

  for (const receipt of view.receipt_history ?? (view.receipt ? [view.receipt] : [])) {
    const current = receipt.id === view.receipt?.id && receipt.invoice_id === view.invoice?.id && !receipt.voided_at;
    if (hasTime(receipt.created_at)) events.push({ id: `receipt-create-${receipt.id}`, kind: "document", timestamp: receipt.created_at, title: "Payment Receipt PDF generated", detail: receipt.receipt_no, state: current ? "current" : "historical", document: current ? { kind: "payment-receipt", number: receipt.receipt_no } : undefined });
    if (hasTime(receipt.voided_at)) events.push({ id: `receipt-void-${receipt.id}`, kind: "document", timestamp: receipt.voided_at, title: "Payment Receipt PDF voided", detail: receipt.void_reason || receipt.receipt_no, state: "voided", document: { kind: "payment-receipt", number: receipt.receipt_no, void: true } });
  }
  for (const pass of view.gate_pass_history ?? (view.gate_pass ? [view.gate_pass] : [])) {
    const current = pass.id === view.gate_pass?.id && pass.invoice_id === view.invoice?.id && !pass.voided_at;
    if (hasTime(pass.created_at)) events.push({ id: `gate-pass-create-${pass.id}`, kind: "document", timestamp: pass.created_at, title: "Gate Pass PDF generated", detail: pass.gate_pass_no, state: current ? "current" : "historical", document: current ? { kind: "gate-pass", number: pass.gate_pass_no } : undefined });
    if (hasTime(pass.voided_at)) events.push({ id: `gate-pass-void-${pass.id}`, kind: "document", timestamp: pass.voided_at, title: "Gate Pass PDF voided", detail: pass.void_reason || pass.gate_pass_no, state: "voided", document: { kind: "gate-pass", number: pass.gate_pass_no, void: true } });
  }

  for (const event of view.material_events ?? []) {
    const item = (id: number | null) => view.inventory.find((candidate) => candidate.id === id)?.name ?? `Item ${id}`;
    const detail = event.kind === "release"
      ? `${item(event.new_item_id)} x ${event.new_qty} released to job`
      : `${item(event.old_item_id)} x ${event.old_qty} -> ${item(event.new_item_id)} x ${event.new_qty} · ${event.note}`;
    if (hasTime(event.at)) events.push({ id: `material-${event.kind}-${event.id}`, kind: "material", timestamp: event.at, title: event.kind === "release" ? "Material released" : "Issued material edited", detail, actor: actorName(event.by_user, users), state: "current" });
  }

  for (const event of view.invoice_events ?? []) {
    if (!hasTime(event.at) || event.kind === "create") continue;
    const totals = event.old_total !== null && event.new_total !== null ? ` (total ${event.old_total.toFixed(2)} -> ${event.new_total.toFixed(2)})` : "";
    events.push({ id: `invoice-audit-${event.id}`, kind: "invoice", timestamp: event.at, title: event.kind === "edit" ? "Invoice edited" : "Invoice void audited", detail: `${event.detail}${totals}${event.note ? ` - ${event.note}` : ""}`, actor: actorName(event.by_user, users), state: "current" });
  }

  for (const photo of view.photo_history ?? view.photos) {
    const category = photo.category || "Job";
    if (hasTime(photo.created_at)) events.push({ id: `media-upload-${photo.id}`, kind: "media", timestamp: photo.created_at, title: "Media uploaded", detail: `${category} · ${photo.label}`, state: photo.archived_at ? "historical" : "current" });
    if (hasTime(photo.updated_at) && !sameTime(photo.updated_at, photo.created_at) && !sameTime(photo.updated_at, photo.archived_at)) events.push({ id: `media-edit-${photo.id}`, kind: "media", timestamp: photo.updated_at, title: "Media details edited", detail: `${category} · ${photo.label}`, state: photo.archived_at ? "historical" : "current" });
    if (hasTime(photo.archived_at)) events.push({ id: `media-archive-${photo.id}`, kind: "media", timestamp: photo.archived_at, title: "Media archived", detail: `${photo.label} · ${photo.archived_reason || "No reason recorded"}`, state: "archived" });
  }

  return events.filter((event) => hasTime(event.timestamp)).sort((left, right) => {
    const byTime = new Date(left.timestamp).getTime() - new Date(right.timestamp).getTime();
    return (Number.isNaN(byTime) ? left.timestamp.localeCompare(right.timestamp) : byTime) || left.id.localeCompare(right.id);
  });
}
```

## OP-data-flow-buildGhostSteps

Source: src/data-flow.ts:170-186

Dependencies: [...view.checklist_cycles].sort, view.checklist_items
        .filter((item) => item.checklist_cycle_id === cycle.id && !item.checked_at && !item.na_at)
        .sort((left, right) => left.sort_order - right.sort_order)
        .forEach, view.checklist_items
        .filter((item) => item.checklist_cycle_id === cycle.id && !item.checked_at && !item.na_at)
        .sort, view.checklist_items
        .filter, ghosts.push, resolveJobDocuments

```typescript
export function buildGhostSteps(view: JobView, snapshots: readonly DocumentSnapshot[] = []): GhostStep[] {
  const ghosts: GhostStep[] = [];
  if (view.job.main_status !== "CANCELLED") {
    const cycle = [...view.checklist_cycles].sort((left, right) => right.id - left.id)[0];
    if (cycle) {
      view.checklist_items
        .filter((item) => item.checklist_cycle_id === cycle.id && !item.checked_at && !item.na_at)
        .sort((left, right) => left.sort_order - right.sort_order)
        .forEach((item) => ghosts.push({ id: `ghost-checklist-${item.id}`, kind: "checklist", title: item.label, reason: `${cycle.stage} checklist${item.required ? "" : " (optional)"}` }));
    }
  }
  if (view.job.main_status === "CANCELLED") return ghosts;
  for (const doc of resolveJobDocuments(view, snapshots)) {
    if (!doc.available) ghosts.push({ id: `ghost-document-${doc.kind}`, kind: "document", title: doc.label, reason: doc.message ?? `${doc.label} not created` });
  }
  return ghosts;
}
```

## OP-data-flow-buildStageRows

Source: src/data-flow.ts:197-213

Dependencies: view.tasks.filter, view.qc_checks.every, Boolean, view.payments.reduce((sum, payment) => sum + payment.amount, 0).toLocaleString, view.payments.reduce

```typescript
export function buildStageRows(view: JobView): StageRow[] {
  const material = view.material_requests.length;
  const tasksDone = view.tasks.filter((task) => task.status === "Completed").length;
  const qc = view.qc_checks.length ? (view.qc_checks.every((check) => check.passed) ? "Pass" : "Fail") : view.job.qc_status;
  return [
    { id: "visit", label: "Visit", value: view.visit.received_at, done: true },
    { id: "estimate", label: "Estimate", value: view.estimate ? view.estimate.status : "Not created", done: Boolean(view.estimate), document: view.estimate ? "estimate" : undefined },
    { id: "job-card", label: "Job Card", value: view.job.main_status === "CLOSED" ? "Delivered" : view.job.sub_status, done: view.job.main_status !== "NEW", document: "job-card" },
    { id: "material", label: "Material", value: material ? `${material} request(s)` : "None requested", done: material > 0 },
    { id: "work", label: "Work", value: `${tasksDone}/${view.tasks.length} complete`, done: view.tasks.length > 0 && tasksDone === view.tasks.length },
    { id: "qc", label: "QC", value: qc || "Pending", done: qc === "Pass" },
    { id: "invoice", label: "Invoice", value: view.invoice ? view.invoice.invoice_no : "Not created", done: Boolean(view.invoice), document: view.invoice ? "invoice" : undefined },
    { id: "payment", label: "Payment", value: view.payments.length ? `Rs ${view.payments.reduce((sum, payment) => sum + payment.amount, 0).toLocaleString("en-IN")}` : "Not received", done: view.payments.length > 0 },
    { id: "receipt", label: "Payment Receipt", value: view.receipt ? view.receipt.receipt_no : "Not generated", done: Boolean(view.receipt), document: view.receipt ? "payment-receipt" : undefined },
    { id: "gate-pass", label: "Gate Pass", value: view.gate_pass ? view.gate_pass.gate_pass_no : "Not generated", done: Boolean(view.gate_pass), document: view.gate_pass ? "gate-pass" : undefined },
  ];
}
```

## OP-db-deriveChecklistSubStatus

Source: src/db.ts:133-141

Dependencies: [...items].sort, ordered.find, ordered.at

```typescript
export function deriveChecklistSubStatus(
  items: readonly Pick<ChecklistItem, "label" | "sort_order" | "checked_at">[],
): SubStatus {
  const ordered = [...items].sort(
    (left, right) => left.sort_order - right.sort_order,
  );
  if (ordered.length === 0) return "Gather Requirements";
  return (ordered.find((item) => !item.checked_at) ?? ordered.at(-1)!).label;
}
```

## OP-db-openWorkshopDb

Source: src/db.ts:156-186

Dependencies: initSqlJs, localStorage.getItem, Uint8Array.from, atob, char.charCodeAt, fetch, response.arrayBuffer, createSchema, migrateSchema, scalar, seed, ensureDemoAdvisors, ensureDemoTeamStructure, Object.entries, db.run, persist, localStorage.setItem

```typescript
export async function openWorkshopDb() {
  SQL ??= await initSqlJs({ locateFile: () => wasmUrl });
  const saved =
    localStorage.getItem(STORAGE_KEY) ??
    localStorage.getItem("workshopos.sqlite.v1");
  let bytes: Uint8Array;
  if (saved) {
    bytes = Uint8Array.from(atob(saved), (char) => char.charCodeAt(0));
  } else {
    const response = await fetch(`${import.meta.env.BASE_URL}workshopos-demo.sqlite`);
    if (!response.ok) throw new Error("Could not load the WorkshopOS demo database.");
    bytes = new Uint8Array(await response.arrayBuffer());
  }
  const db = new SQL.Database(bytes);
  createSchema(db);
  migrateSchema(db);
  if (scalar<number>(db, "select count(*) from users") === 0) seed(db);
  ensureDemoAdvisors(db);
  ensureDemoTeamStructure(db);
  if (saved && !localStorage.getItem(DELIVERY_DATES_MIGRATION_KEY)) {
    for (const [jobNo, date] of Object.entries(demoDeliveryDates)) {
      db.run(
        "update job_cards set estimated_delivery=? where job_no=? and main_status in ('NEW','IN_PROGRESS','HOLD')",
        [date, jobNo],
      );
    }
  }
  persist(db);
  localStorage.setItem(DELIVERY_DATES_MIGRATION_KEY, "1");
  return db;
}
```

## OP-db-persist

Source: src/db.ts:188-199

Dependencies: exportPersistableDatabase, binary.forEach, String.fromCharCode, localStorage.setItem, btoa

```typescript
export function persist(db: Database) {
  if (!SQL) throw new Error("SQL.js is not initialized.");
  const binary = exportPersistableDatabase(
    db,
    (bytes) => new SQL!.Database(bytes),
  );
  let encoded = "";
  binary.forEach((byte: number) => {
    encoded += String.fromCharCode(byte);
  });
  localStorage.setItem(STORAGE_KEY, btoa(encoded));
}
```

## OP-db-exportPersistableDatabase

Source: src/db.ts:201-217

Dependencies: cloneDatabase, db.export, clone.run, resetMissingPhotoEvidence, clone.export, clone.close

```typescript
export function exportPersistableDatabase(
  db: Database,
  cloneDatabase: (bytes: Uint8Array) => Database,
) {
  const clone = cloneDatabase(db.export());
  try {
    // Image payloads deliberately live only in the active SQL.js session database.
    clone.run(
      "delete from photos where trim(coalesce(mime_type,''))<>'' or src like 'data:image/%'",
    );
    resetMissingPhotoEvidence(clone);
    clone.run("vacuum");
    return clone.export();
  } finally {
    clone.close();
  }
}
```

## OP-db-readState

Source: src/db.ts:219-603

Dependencies: all, rows.map, rows.forEach, grouped.set, key, grouped.get, byId, allEstimates.filter, groupBy, allInvoices.filter, allPayments.filter, allReceipts.filter, allPasses.filter, allPhotos.filter, movementsByJob.get, allVisits.get, allCustomers.get, allVehicles.get, allUsers.get, estimatesByJob.get, jobEstimates.at, estimateItemsByEstimate.get, materialByJob.get, materialEventsByJob.get, material_requests.map, jobMaterialEvents.flatMap, [...materialItemIds]
        .map((id) => allInventory.get(id as number))
        .filter, [...materialItemIds]
        .map, allInventory.get, (invoicesByJob.get(job.id) ?? []).at, invoicesByJob.get, taskListByJob.get, localPurchasesByJob.get, purchaseRequestsByJob.get, [...approvalsByJob.values()].find, approvalsByJob.values, approvalEventsByJob.get, invoiceEventsByJob.get, tasksByJob.get, invoiceItemsByInvoice.get, paymentsByJob.get, (receiptsByJob.get(job.id) ?? []).at, receiptsByJob.get, (passesByJob.get(job.id) ?? []).at, passesByJob.get, photosByJob.get, followupsByJob.get, qcByJob.get, historyByJob.get, cyclesByJob.get, checklistByJob.get, estimateHistoryByJob.get, invoiceHistoryByJob.get, paymentHistoryByJob.get, receiptHistoryByJob.get, passHistoryByJob.get, photoHistoryByJob.get, jobViews, all<Omit<SalesQuotation, "lines">>(db, "select * from sales_quotations order by created_at desc, id desc").map, salesLines.filter, all<Omit<ServiceDepartment, "manager_ids" | "advisor_team_ids" | "advisor_teams">>(db, "select * from service_departments order by status, name").map, all<{ manager_id: number }>(db, "select manager_id from service_department_managers where department_id=? order by manager_id", [department.id]).map, advisor_teams.map

```typescript
export function readState(db: Database): WorkshopState {
  const users = all<User>(
    db,
    "select * from users where archived_at is null order by id",
  );
  const customers = all<Customer>(
    db,
    "select * from customers where archived_at is null order by id",
  );
  const vehicles = all<Vehicle>(
    db,
    "select * from vehicles where archived_at is null order by id",
  );
  const visits = all<Visit>(
    db,
    "select * from visits where archived_at is null order by id desc",
  );
  const bookings = all<Booking>(
    db,
    "select * from bookings order by booking_date, id desc",
  );
  const booking_call_logs = all<BookingCallLog>(
    db,
    "select * from booking_call_logs order by called_at desc, id desc",
  );
  const booking_events = all<BookingEvent>(
    db,
    "select * from booking_events order by at desc, id desc",
  );
  const booking_capacity_limits = all<BookingCapacityLimit>(
    db,
    "select * from booking_capacity_limits order by booking_date",
  );
  const booking_capacity_overrides = all<BookingCapacityOverride>(
    db,
    "select * from booking_capacity_overrides order by approved_at desc, id desc",
  );
  const inventory = all<InventoryItem>(
    db,
    "select i.*, i.stock_qty - coalesce((select sum(l.qty) from stock_ledger l where l.item_id=i.id),0) as stock_qty from inventory i where i.archived_at is null order by i.category, i.name",
  );
  const service_catalog = all<ServiceCatalogItem>(
    db,
    `select catalog.*, department.name as department_name, brand.name as brand_name, segment.name as car_segment_name
     from service_catalog_items catalog
     left join service_departments department on department.id=catalog.service_department_id
     left join service_brands brand on brand.id=catalog.brand_id
     left join car_segments segment on segment.id=catalog.car_segment_id
     where catalog.archived_at is null order by catalog.name, catalog.id`,
  );
  // Keep archived suppliers in the read model so historical receipts never lose their supplier identity.
  const suppliers = all<Supplier>(db, "select * from suppliers order by name");
  const inward_purchases = all<InwardPurchase>(
    db,
    "select * from inward_purchases order by coalesce(submitted_at, created_at) desc, id desc",
  );
  const inward_purchase_lines = all<InwardPurchaseLine>(
    db,
    "select * from inward_purchase_lines order by id",
  );
  const inward_purchase_attachments = all<InwardPurchaseAttachment>(
    db,
    "select * from inward_purchase_attachments order by id",
  );
  const inward_purchase_revisions = all<InwardPurchaseRevision>(
    db,
    "select * from inward_purchase_revisions order by purchase_id, revision_no",
  );
  const purchase_orders = all<PurchaseOrder>(
    db,
    "select * from purchase_orders order by order_date desc, id desc",
  );
  const purchase_order_lines = all<PurchaseOrderLine>(
    db,
    "select * from purchase_order_lines order by id",
  );
  const purchase_order_quotations = all<PurchaseOrderQuotation>(
    db,
    "select * from purchase_order_quotations order by purchase_order_line_id, quote_date desc, id desc",
  );
  const purchase_order_receipts = all<PurchaseOrderReceipt>(
    db,
    "select * from purchase_order_receipts order by received_at, id",
  );
  const purchase_order_receipt_lines = all<PurchaseOrderReceiptLine>(
    db,
    "select * from purchase_order_receipt_lines order by id",
  );
  const purchase_order_confirmations = all<PurchaseOrderConfirmation>(
    db,
    "select * from purchase_order_confirmations order by purchase_order_line_id",
  );
  const stock_inwards = all<StockInward>(
    db,
    "select * from stock_inwards order by received_at desc, id desc",
  );
  const jobRows = all<JobCard>(
    db,
    "select * from job_cards where archived_at is null order by id desc",
  );
  const archivedJobRows = all<JobCard>(
    db,
    "select * from job_cards where archived_at is not null order by id desc",
  );
  const archived_customers = all<Customer>(
    db,
    "select * from customers where archived_at is not null order by id",
  );
  const archived_vehicles = all<Vehicle>(
    db,
    "select * from vehicles where archived_at is not null order by id",
  );
  const byId = <T extends { id: number }>(rows: T[]) =>
    new Map(rows.map((row) => [row.id, row]));
  const groupBy = <T>(rows: T[], key: (row: T) => number) => {
    const grouped = new Map<number, T[]>();
    rows.forEach((row) =>
      grouped.set(key(row), [...(grouped.get(key(row)) ?? []), row]),
    );
    return grouped;
  };
  const allUsers = byId(all<User>(db, "select * from users"));
  const allCustomers = byId(all<Customer>(db, "select * from customers"));
  const allVehicles = byId(all<Vehicle>(db, "select * from vehicles"));
  const allVisits = byId(all<Visit>(db, "select * from visits"));
  const allInventory = byId(all<InventoryItem>(db, "select * from inventory"));
  const allEstimates = all<Estimate>(db, "select * from estimates order by id");
  const estimates = allEstimates.filter((row) => !row.archived_at);
  const estimatesByJob = groupBy(estimates, (row) => row.job_card_id);
  const estimateItemsByEstimate = groupBy(
    all<EstimateItem>(
      db,
      "select * from estimate_items where archived_at is null",
    ),
    (row) => row.estimate_id,
  );
  const taskListByJob = groupBy(
    all<JobTaskListItem>(
      db,
      "select * from job_task_list_items where archived_at is null order by id",
    ),
    (row) => row.job_card_id,
  );
  const materialByJob = groupBy(
    all<MaterialRequest>(
      db,
      "select * from material_requests where archived_at is null",
    ),
    (row) => row.job_card_id,
  );
  const approvalsByJob = byId(
    all<MaterialApproval>(db, "select * from material_approvals order by id"),
  );
  const approvalEventsByJob = groupBy(
    all<MaterialApprovalEvent>(
      db,
      "select * from material_approval_events order by id",
    ),
    (row) => row.job_card_id,
  );
  const localPurchasesByJob = groupBy(
    all<LocalPurchase>(
      db,
      "select * from local_purchases where archived_at is null order by id desc",
    ),
    (row) => row.job_card_id,
  );
  const purchaseRequestsByJob = groupBy(
    all<MaterialPurchaseRequest>(
      db,
      "select * from material_purchase_requests order by id desc",
    ),
    (row) => row.job_card_id,
  );
  const tasksByJob = groupBy(
    all<Task>(db, "select * from tasks where archived_at is null"),
    (row) => row.job_card_id,
  );
  const allInvoices = all<Invoice>(db, "select * from invoices order by id");
  const invoicesByJob = groupBy(
    allInvoices.filter((row) => !row.voided_at),
    (row) => row.job_card_id,
  );
  const invoiceItemsByInvoice = groupBy(
    all<InvoiceItem>(
      db,
      "select * from invoice_items where archived_at is null order by id",
    ),
    (row) => row.invoice_id,
  );
  const allPayments = all<Payment>(db, "select * from payments order by id");
  const allReceipts = all<Receipt>(db, "select * from receipts order by id");
  const allPasses = all<GatePass>(db, "select * from gate_passes order by id");
  const allPhotos = all<Photo>(db, "select * from photos order by id");
  const paymentsByJob = groupBy(
    allPayments.filter((row) => !row.voided_at),
    (row) => row.job_card_id,
  );
  const receiptsByJob = groupBy(
    allReceipts.filter((row) => !row.voided_at),
    (row) => row.job_card_id,
  );
  const passesByJob = groupBy(
    allPasses.filter((row) => !row.voided_at),
    (row) => row.job_card_id,
  );
  const photosByJob = groupBy(
    allPhotos.filter((row) => !row.archived_at),
    (row) => row.job_card_id,
  );
  const estimateHistoryByJob = groupBy(allEstimates, (row) => row.job_card_id);
  const invoiceHistoryByJob = groupBy(allInvoices, (row) => row.job_card_id);
  const paymentHistoryByJob = groupBy(allPayments, (row) => row.job_card_id);
  const receiptHistoryByJob = groupBy(allReceipts, (row) => row.job_card_id);
  const passHistoryByJob = groupBy(allPasses, (row) => row.job_card_id);
  const photoHistoryByJob = groupBy(allPhotos, (row) => row.job_card_id);
  const followupsByJob = groupBy(
    all<Followup>(db, "select * from followups where archived_at is null"),
    (row) => row.job_card_id,
  );
  const qcByJob = groupBy(
    all<QcCheck>(db, "select * from qc_checks where archived_at is null"),
    (row) => row.job_card_id,
  );
  const historyByJob = groupBy(
    all<StatusHistory>(db, "select * from status_history order by id desc"),
    (row) => row.job_card_id,
  );
  const cyclesByJob = groupBy(
    all<ChecklistCycle>(
      db,
      "select * from checklist_cycles order by cycle_number, id",
    ),
    (row) => row.job_card_id,
  );
  const checklistByJob = groupBy(
    all<ChecklistItem>(
      db,
      "select * from checklist_items order by cycle_number, sort_order, id",
    ),
    (row) => row.job_card_id,
  );
  const invoiceEventsByJob = groupBy(
    all<InvoiceEvent>(db, "select * from invoice_events order by id"),
    (row) => row.job_card_id,
  );
  const materialEventsByJob = groupBy(
    all<MaterialEvent>(db, "select * from material_events order by id"),
    (row) => row.job_card_id,
  );
  const movements = all<MaterialMovement>(
    db,
    "select * from material_movements order by id desc",
  );
  const movementsByJob = groupBy(movements, (row) => row.job_card_id);
  const globalMovements = movementsByJob.get(0) ?? [];
  const jobViews = (rows: JobCard[]): JobView[] =>
    rows.map((job) => {
      const visit = allVisits.get(job.visit_id)!;
      const customer = allCustomers.get(visit.customer_id)!;
      const vehicle = allVehicles.get(visit.vehicle_id)!;
      const advisor = allUsers.get(job.advisor_id) ?? UNASSIGNED_ADVISOR;
      const technician = allUsers.get(job.technician_id)!;
      const jobEstimates = estimatesByJob.get(job.id) ?? [];
      const estimate = jobEstimates.at(-1);
      const estimate_items = estimate
        ? (estimateItemsByEstimate.get(estimate.id) ?? [])
        : [];
      const material_requests = materialByJob.get(job.id) ?? [];
      const jobMaterialEvents = materialEventsByJob.get(job.id) ?? [];
      const materialItemIds = new Set([
        ...material_requests.map((request) => request.item_id),
        ...jobMaterialEvents.flatMap((event) => [
          event.old_item_id,
          event.new_item_id,
        ]),
      ]);
      const materialInventory = [...materialItemIds]
        .map((id) => allInventory.get(id as number))
        .filter(Boolean) as InventoryItem[];
      const invoice = (invoicesByJob.get(job.id) ?? []).at(-1);
      return {
        job,
        visit,
        customer,
        vehicle,
        advisor,
        technician,
        estimate,
        estimate_items,
        task_list_items: taskListByJob.get(job.id) ?? [],
        material_requests,
        local_purchases: localPurchasesByJob.get(job.id) ?? [],
        material_purchase_requests: purchaseRequestsByJob.get(job.id) ?? [],
        material_approval: [...approvalsByJob.values()].find(
          (approval) => approval.job_card_id === job.id,
        ),
        material_approval_history: approvalEventsByJob.get(job.id) ?? [],
        material_events: jobMaterialEvents,
        invoice_events: invoiceEventsByJob.get(job.id) ?? [],
        inventory: materialInventory,
        tasks: tasksByJob.get(job.id) ?? [],
        invoice,
        invoice_items: invoice
          ? (invoiceItemsByInvoice.get(invoice.id) ?? [])
          : [],
        payments: paymentsByJob.get(job.id) ?? [],
        receipt: (receiptsByJob.get(job.id) ?? []).at(-1),
        gate_pass: (passesByJob.get(job.id) ?? []).at(-1),
        photos: photosByJob.get(job.id) ?? [],
        followups: followupsByJob.get(job.id) ?? [],
        qc_checks: qcByJob.get(job.id) ?? [],
        status_history: historyByJob.get(job.id) ?? [],
        checklist_cycles: cyclesByJob.get(job.id) ?? [],
        checklist_items: checklistByJob.get(job.id) ?? [],
        material_movements: [
          ...(movementsByJob.get(job.id) ?? []),
          ...globalMovements,
        ],
        estimate_history: estimateHistoryByJob.get(job.id) ?? [],
        invoice_history: invoiceHistoryByJob.get(job.id) ?? [],
        payment_history: paymentHistoryByJob.get(job.id) ?? [],
        receipt_history: receiptHistoryByJob.get(job.id) ?? [],
        gate_pass_history: passHistoryByJob.get(job.id) ?? [],
        photo_history: photoHistoryByJob.get(job.id) ?? [],
      };
    });
  const jobs = jobViews(jobRows);
  // Historical jobs intentionally resolve through the all-record maps above: their visit,
  // customer and vehicle may themselves have been archived.
  const archived_jobs = jobViews(archivedJobRows);
  const attendance = all<AdvisorAttendance>(
    db,
    "select user_id, date, present from advisor_attendance order by date, user_id",
  );
  const sales_leads = all<SalesLead>(db, "select * from sales_leads order by created_at desc, id desc");
  const salesLines = all<SalesQuotationLine>(db, "select * from sales_quotation_lines order by quotation_id, line_no");
  const sales_quotations = all<Omit<SalesQuotation, "lines">>(db, "select * from sales_quotations order by created_at desc, id desc").map((quotation) => ({ ...quotation, lines: salesLines.filter((line) => line.quotation_id === quotation.id) }));
  const service_departments = all<Omit<ServiceDepartment, "manager_ids" | "advisor_team_ids" | "advisor_teams">>(db, "select * from service_departments order by status, name").map((department) => {
    const advisor_teams = all<{ manager_id: number; advisor_id: number }>(db, "select manager_id, advisor_id from service_advisor_teams where department_id=? order by manager_id, advisor_id", [department.id]);
    return {
      ...department,
      manager_ids: all<{ manager_id: number }>(db, "select manager_id from service_department_managers where department_id=? order by manager_id", [department.id]).map((row) => row.manager_id),
      advisor_team_ids: advisor_teams.map((row) => row.advisor_id),
      advisor_teams,
    };
  });
  const service_brands = all<ServiceCatalogMaster>(db, "select * from service_brands order by status, name");
  const car_segments = all<ServiceCatalogMaster>(db, "select * from car_segments order by status, name");
  return {
    users,
    customers,
    vehicles,
    visits,
    bookings,
    booking_call_logs,
    booking_events,
    booking_capacity_limits,
    booking_capacity_overrides,
    jobs,
    archived_customers,
    archived_vehicles,
    archived_jobs,
    inventory,
    service_catalog,
    attendance,
    suppliers,
    inward_purchases,
    inward_purchase_lines,
    inward_purchase_attachments,
    inward_purchase_revisions,
    purchase_orders,
    purchase_order_lines,
    purchase_order_quotations,
    purchase_order_receipts,
    purchase_order_receipt_lines,
    purchase_order_confirmations,
    stock_inwards,
    sales_leads,
    sales_quotations,
    service_departments,
    service_brands,
    car_segments,
  };
}
```

## OP-db-presentAdvisors

Source: src/db.ts:617-628

Dependencies: todayKey, users.filter, attendance.find

```typescript
export function presentAdvisors(
  users: User[],
  attendance: AdvisorAttendance[],
  date = todayKey(),
) {
  return users.filter(
    (user) =>
      user.role === "service" &&
      attendance.find((row) => row.user_id === user.id && row.date === date)
        ?.present !== 0,
  );
}
```

## OP-db-setAdvisorPresent

Source: src/db.ts:630-640

Dependencies: todayKey, db.run

```typescript
export function setAdvisorPresent(
  db: Database,
  userId: number,
  present: boolean,
  date = todayKey(),
) {
  db.run(
    "insert into advisor_attendance(user_id, date, present) values (?, ?, ?) on conflict(user_id, date) do update set present=excluded.present",
    [userId, date, present ? 1 : 0],
  );
}
```

## OP-db-assignAdvisor

Source: src/db.ts:643-666

Dependencies: maybe, one, db.run, history

```typescript
export function assignAdvisor(db: Database, jobId: number, advisorId: number) {
  const advisor = maybe<User>(
    db,
    "select * from users where id=? and role='service' and archived_at is null",
    [advisorId],
  );
  if (!advisor) throw new Error("Pick a Service Advisor.");
  const job = one<JobCard>(db, "select * from job_cards where id=?", [jobId]);
  db.run(
    "update job_cards set advisor_id=?, updated_at=datetime('now') where id=?",
    [advisorId, jobId],
  );
  db.run(
    "update visits set advisor_id=?, updated_at=datetime('now') where id=?",
    [advisorId, job.visit_id],
  );
  history(
    db,
    jobId,
    job.main_status,
    job.sub_status,
    `Assigned to ${advisor.name}`,
  );
}
```

## OP-db-ensureDemoAdvisors

Source: src/db.ts:669-723

Dependencies: db.run, [
    ["advisor.aa@example.com", "Service advisor AA"],
    ["advisor.bb1@example.com", "Service advisor BB1"],
  ].forEach, scalar, all, advisors.find, jobs.forEach

```typescript
export function ensureDemoAdvisors(db: Database) {
  db.run(
    "update users set name='Service advisor 1' where email='service@example.com' and name='Service Advisor'",
  );
  [
    ["advisor.aa@example.com", "Service advisor AA"],
    ["advisor.bb1@example.com", "Service advisor BB1"],
  ].forEach(([email, name]) => {
    if (
      scalar<number>(db, "select count(*) from users where email=?", [
        email,
      ]) === 0
    )
      db.run(
        "insert into users(email, name, role, password, created_at, updated_at) values (?, ?, 'service', 'admin123', datetime('now'), datetime('now'))",
        [email, name],
      );
  });
  // A fresh (or older persisted) demo used one advisor for every seeded job.
  // Rebalance only that unmistakable demo shape, so real assignments stay intact.
  const advisors = all<{ id: number }>(
    db,
    "select id from users where email in ('service@example.com','advisor.aa@example.com','advisor.bb1@example.com') order by email",
  );
  const jobCount = scalar<number>(db, "select count(*) from job_cards");
  const primaryId = advisors.find(
    (advisor) =>
      scalar<string>(db, "select email from users where id=?", [advisor.id]) ===
      "service@example.com",
  )?.id;
  if (
    primaryId &&
    advisors.length === 3 &&
    jobCount > 0 &&
    scalar<number>(db, "select count(*) from job_cards where advisor_id=?", [
      primaryId,
    ]) === jobCount
  ) {
    const jobs = all<{ id: number; visit_id: number }>(
      db,
      "select id, visit_id from job_cards order by id",
    );
    jobs.forEach((job, index) => {
      const advisorId = advisors[index % advisors.length].id;
      db.run("update job_cards set advisor_id=? where id=?", [
        advisorId,
        job.id,
      ]);
      db.run("update visits set advisor_id=? where id=?", [
        advisorId,
        job.visit_id,
      ]);
    });
  }
}
```

## OP-db-ensureDemoTeamStructure

Source: src/db.ts:731-763

Dependencies: seededManagers.forEach, maybe, insert, one, createServiceDepartment, db.run, appointServiceDepartmentManager

```typescript
export function ensureDemoTeamStructure(db: Database) {
  const seededManagers = [
    ["general.service.manager@example.com", "General Service Manager", "General Service Work"],
    ["ppf.paint.manager@example.com", "PPF/Paint Manager", "PPF/Paint Work"],
  ] as const;

  seededManagers.forEach(([email, name, departmentName]) => {
    let manager = maybe<User>(db, "select * from users where email=?", [email]);
    if (!manager) {
      const id = insert(
        db,
        "insert into users(email, name, role, password, created_at, updated_at) values (?, ?, 'service_manager', 'admin123', datetime('now'), datetime('now'))",
        [email, name],
      );
      manager = one<User>(db, "select * from users where id=?", [id]);
    }

    let department = maybe<{ id: number }>(
      db,
      "select id from service_departments where lower(name)=lower(?)",
      [departmentName],
    );
    if (!department) {
      const id = createServiceDepartment(db, departmentName);
      department = { id };
    }

    if (manager.archived_at) {
      db.run("update users set archived_at=null, archived_reason=null, updated_at=datetime('now') where id=?", [manager.id]);
    }
    appointServiceDepartmentManager(db, department.id, manager.id);
  });
}
```

## OP-db-loadLargeDemoDataset

Source: src/db.ts:769-1083

Dependencies: db.run, tables.forEach, [
      ["PPF-ROLL", "PPF", "Gloss PPF roll", "metre", 500, 40],
      ["CERAMIC-1L", "Detailing", "Ceramic coating", "litre", 80, 10],
      ["PAINT-CLEAR", "Paint", "Clear coat", "litre", 60, 8],
    ].forEach, String(((i - 1) % 8) + 1).padStart, String, String(((i * 3) % 27) + 1).padStart, String(i).padStart, String(100000000 + i).padStart, String((i % 30) + 1).padStart, String(((i * 5) % 27) + 1).padStart, String(8 + (i % 9)).padStart, insert, String(2000 + i).padStart, ensureLifecycleChecklist, ["Edges checked", "Surface cleaned", "Customer items verified"].forEach, date.slice, Math.max, Math.round, one, validateLargeDemoDataset, ensureDemoAdvisors

```typescript
export function loadLargeDemoDataset(db: Database) {
  const subStatuses: SubStatus[] = [
    "Gather Requirements",
    "Create Estimate",
    "Get Confirmation",
    "Material Requested",
    "Material Issued",
    "Washing Needed",
    "Work Started",
    "Follow-up Needed",
    "Photos Shared",
    "QC Pending",
    "Customer Verification",
    "Invoice Ready",
    "Payment Received",
    "Receipt Generated",
    "Gate Pass Generated",
    "Delivered",
  ];
  const makes = [
    ["Hyundai", "Creta"],
    ["Mahindra", "Thar"],
    ["Tata", "Nexon"],
    ["Maruti", "Brezza"],
    ["Honda", "City"],
    ["Toyota", "Fortuner"],
    ["Kia", "Seltos"],
    ["BMW", "X1"],
  ];
  const colors = ["White", "Black", "Silver", "Blue", "Red", "Grey"];
  const categories = ["Before", "After", "Inspection", "Progress", "Job Sheet"];
  const tables = [
    "approvals",
    "material_movements",
    "material_requests",
    "inventory",
    "gate_passes",
    "receipts",
    "payments",
    "invoices",
    "qc_checks",
    "tasks",
    "estimate_items",
    "estimates",
    "status_history",
    "checklist_items",
    "checklist_cycles",
    "photos",
    "followups",
    "job_cards",
    "visits",
    "vehicles",
    "customers",
  ];
  db.run("begin transaction");
  try {
    tables.forEach((table) => db.run(`delete from ${table}`));
    [
      ["PPF-ROLL", "PPF", "Gloss PPF roll", "metre", 500, 40],
      ["CERAMIC-1L", "Detailing", "Ceramic coating", "litre", 80, 10],
      ["PAINT-CLEAR", "Paint", "Clear coat", "litre", 60, 8],
    ].forEach((row) =>
      db.run(
        "insert into inventory(sku,category,name,unit,stock_qty,low_stock_qty,created_at,updated_at) values(?,?,?,?,?,?,?,?)",
        [...row, "2026-01-01T08:00:00.000Z", "2026-01-01T08:00:00.000Z"],
      ),
    );
    for (let i = 1; i <= 120; i += 1) {
      const stamp = `2026-${String(((i - 1) % 8) + 1).padStart(2, "0")}-${String(((i * 3) % 27) + 1).padStart(2, "0")}T09:00:00.000Z`;
      db.run(
        "insert into customers(name,mobile,type,created_at,updated_at) values(?,?,?,?,?)",
        [
          `Demo Customer ${String(i).padStart(3, "0")}`,
          `8${String(100000000 + i).padStart(9, "0")}`,
          i % 5 === 0 ? "Dealer" : "Individual",
          stamp,
          stamp,
        ],
      );
    }
    for (let i = 1; i <= 132; i += 1) {
      const [make, model] = makes[(i - 1) % makes.length];
      const customerId = ((i - 1) % 120) + 1;
      const stamp = `2026-${String(((i - 1) % 8) + 1).padStart(2, "0")}-15T10:00:00.000Z`;
      db.run(
        "insert into vehicles(customer_id,number,make,model,color,km,created_at,updated_at) values(?,?,?,?,?,?,?,?)",
        [
          customerId,
          `OD${String((i % 30) + 1).padStart(2, "0")}DM${String(1000 + i)}`,
          make,
          model,
          colors[(i - 1) % colors.length],
          5000 + i * 317,
          stamp,
          stamp,
        ],
      );
    }
    for (let i = 1; i <= 144; i += 1) {
      const vehicleId = ((i - 1) % 132) + 1;
      const customerId = ((vehicleId - 1) % 120) + 1;
      const subIndex = (i - 1) % subStatuses.length;
      const sub = subStatuses[subIndex];
      let main: MainStatus =
        subIndex <= 2
          ? "NEW"
          : subIndex <= 9
            ? "IN_PROGRESS"
            : subIndex <= 12
              ? "COMPLETED"
              : "CLOSED";
      // Fixed overrides keep cancellation coverage deterministic without adding a sixth lifecycle status.
      if (i % 48 === 12) main = "CANCELLED";
      const date = `2026-${String(((i - 1) % 8) + 1).padStart(2, "0")}-${String(((i * 5) % 27) + 1).padStart(2, "0")}T${String(8 + (i % 9)).padStart(2, "0")}:00:00.000Z`;
      const work = [
        "Full body PPF",
        "Ceramic coating",
        "Paint correction",
        "Interior detailing",
      ][i % 4];
      const visitId = insert(
        db,
        "insert into visits(customer_id,vehicle_id,advisor_id,received_by,received_at,fuel,keys,accessories,requested_work,photos_note,created_at,updated_at) values(?,?,?,?,?,'Half','2 keys','Mats',?,'Offline demo media',?,?)",
        [customerId, vehicleId, 2, 3, date, work, date, date],
      );
      const jobId = insert(
        db,
        "insert into job_cards(job_no,visit_id,advisor_id,technician_id,main_status,sub_status,work_list,promised_at,qc_status,washing_needed,closed_at,advisor_notes,delivery_by,final_km,acknowledgement,created_at,updated_at) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          `JC-2026-${String(2000 + i).padStart(6, "0")}`,
          visitId,
          2,
          6,
          main,
          sub,
          work,
          "Next business day",
          main === "NEW" || main === "IN_PROGRESS" ? "Pending" : "Pass",
          i % 3 === 0 ? 1 : 0,
          main === "CLOSED" ? date : "",
          "Deterministic large demo",
          main === "CLOSED" ? "Demo Accounts" : "",
          main === "CLOSED" ? 5000 + vehicleId * 317 : 0,
          main === "CLOSED" ? "Vehicle received in good condition" : "",
          date,
          date,
        ],
      );
      ensureLifecycleChecklist(db, jobId, main, sub, date);
      const estimateId = insert(
        db,
        "insert into estimates(job_card_id,status,discount,gst_rate,approval_note,created_at,updated_at) values(?,?,?,?,?,?,?)",
        [
          jobId,
          subIndex < 2 ? "Draft" : "Approved",
          i % 4 === 0 ? 500 : 0,
          18,
          subIndex < 2 ? "Awaiting approval" : "Approved for demo",
          date,
          date,
        ],
      );
      const rate = 3500 + (i % 12) * 750;
      insert(
        db,
        "insert into estimate_items(estimate_id,kind,description,qty,rate,created_at,updated_at) values(?,'Service',?,1,?,?,?)",
        [estimateId, work, rate, date, date],
      );
      if (subIndex >= 3)
        insert(
          db,
          "insert into material_requests(job_card_id,item_id,requested_qty,issued_qty,used_qty,returned_qty,wasted_qty,created_at,updated_at) values(?,?,2,?,?,?,?,?,?)",
          [
            jobId,
            (i % 3) + 1,
            subIndex >= 4 ? 2 : 0,
            subIndex >= 6 ? 1.8 : 0,
            main === "CLOSED" ? 0.1 : 0,
            main === "CLOSED" ? 0.1 : 0,
            date,
            date,
          ],
        );
      insert(
        db,
        "insert into tasks(job_card_id,technician_id,title,status,notes,created_at,updated_at,started_at,completed_at) values(?,?,?,?,?,?,?,?,?)",
        [
          jobId,
          6,
          work,
          main === "NEW"
            ? "Pending"
            : main === "IN_PROGRESS"
              ? "Started"
              : "Completed",
          "Generated demo task",
          date,
          date,
          main === "NEW" ? null : date,
          main === "COMPLETED" || main === "CLOSED" ? date : null,
        ],
      );
      ["Edges checked", "Surface cleaned", "Customer items verified"].forEach(
        (label) =>
          insert(
            db,
            "insert into qc_checks(job_card_id,label,passed) values(?,?,?)",
            [jobId, label, main === "COMPLETED" || main === "CLOSED" ? 1 : 0],
          ),
      );
      if (main !== "NEW")
        insert(
          db,
          "insert into followups(job_card_id,note,due_at,done,outcome,created_at,updated_at) values(?,?,?,?,?,?,?)",
          [
            jobId,
            "Customer progress update",
            date.slice(0, 10),
            main === "CLOSED" ? 1 : 0,
            main === "CLOSED" ? "Delivered" : "",
            date,
            date,
          ],
        );
      let invoiceId = 0;
      if (main === "COMPLETED" || main === "CLOSED") {
        const invoiceDiscount = i % 4 === 0 ? 500 : 0;
        const taxable = Math.max(0, rate - invoiceDiscount);
        const gstAmount = Math.round(taxable * 18) / 100;
        const demoTotal = Math.round((taxable + gstAmount) * 100) / 100;
        invoiceId = insert(
          db,
          "insert into invoices(job_card_id,invoice_no,tally_invoice_no,discount,gst_rate,subtotal,gst_amount,total,status,notes,document_available,created_at,updated_at) values(?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
            jobId,
            `INV-2026-${String(i).padStart(5, "0")}`,
            `TLY-${String(5000 + i)}`,
            invoiceDiscount,
            18,
            rate,
            gstAmount,
            demoTotal,
            main === "CLOSED" ? "Cleared" : "Pending",
            "Generated demo invoice",
            1,
            date,
            date,
          ],
        );
        insert(
          db,
          "insert into invoice_items(invoice_id,kind,description,qty,rate,created_at,updated_at) values(?,'Service',?,1,?,?,?)",
          [invoiceId, work, rate, date, date],
        );
      }
      if (main === "CLOSED") {
        const demoTotal = one<Invoice>(
          db,
          "select * from invoices where id=?",
          [invoiceId],
        ).total;
        insert(
          db,
          "insert into payments(job_card_id,invoice_id,amount,mode,other_detail,reference,notes,created_at,updated_at) values(?,?,?,?,?,?,?,?,?)",
          [
            jobId,
            invoiceId,
            demoTotal,
            "UPI",
            "",
            `PAY-${String(i).padStart(5, "0")}`,
            "Generated demo payment",
            date,
            date,
          ],
        );
        insert(
          db,
          "insert into receipts(job_card_id,invoice_id,receipt_no,created_at) values(?,?,?,?)",
          [jobId, invoiceId, `REC-2026-${String(i).padStart(5, "0")}`, date],
        );
        insert(
          db,
          "insert into gate_passes(job_card_id,invoice_id,gate_pass_no,created_at) values(?,?,?,?)",
          [jobId, invoiceId, `GP-2026-${String(i).padStart(5, "0")}`, date],
        );
      }
      const photoCount = 2;
      for (let p = 0; p < photoCount; p += 1)
        insert(
          db,
          "insert into photos(job_card_id,label,src,category,created_at,updated_at) values(?,?,?,?,?,?)",
          [
            jobId,
            `${categories[(i + p) % categories.length]} documentation`,
            "/media-placeholder.svg",
            categories[(i + p) % categories.length],
            date,
            date,
          ],
        );
      insert(
        db,
        "insert into status_history(job_card_id,main_status,sub_status,note,created_at) values(?,?,?,?,?)",
        [jobId, main, sub, "Generated coherent demo lifecycle", date],
      );
    }
    validateLargeDemoDataset(db);
    ensureDemoAdvisors(db);
    db.run("commit");
  } catch (error) {
    db.run("rollback");
    throw error;
  }
}
```

## OP-db-login

Source: src/db.ts:1134-1140

Dependencies: state.users.find, user.email.toLowerCase, email.trim().toLowerCase, email.trim

```typescript
export function login(state: WorkshopState, email: string, password: string) {
  return state.users.find(
    (user) =>
      user.email.toLowerCase() === email.trim().toLowerCase() &&
      user.password === password,
  );
}
```

## OP-db-createUser

Source: src/db.ts:1152-1167

Dependencies: validateUser, insert, payload.email.trim().toLowerCase, payload.email.trim, payload.name.trim

```typescript
export function createUser(
  db: Database,
  payload: Pick<User, "email" | "name" | "role" | "password">,
) {
  validateUser(db, payload);
  return insert(
    db,
    "insert into users(email, name, role, password, created_at, updated_at) values (?, ?, ?, ?, datetime('now'), datetime('now'))",
    [
      payload.email.trim().toLowerCase(),
      payload.name.trim(),
      payload.role,
      payload.password,
    ],
  );
}
```

## OP-db-updateUser

Source: src/db.ts:1169-1187

Dependencies: one, isPreloadedServiceManager, validateUser, db.run, payload.email.trim().toLowerCase, payload.email.trim, payload.name.trim

```typescript
export function updateUser(
  db: Database,
  id: number,
  payload: Pick<User, "email" | "name" | "role" | "password">,
) {
  const existing = one<User>(db, "select * from users where id=? and archived_at is null", [id]);
  if (isPreloadedServiceManager(existing)) throw new Error("Preloaded Service Department Manager accounts are locked.");
  validateUser(db, payload, id);
  db.run(
    "update users set email=?, name=?, role=?, password=?, updated_at=datetime('now') where id=?",
    [
      payload.email.trim().toLowerCase(),
      payload.name.trim(),
      payload.role,
      payload.password,
      id,
    ],
  );
}
```

## OP-db-archiveUser

Source: src/db.ts:1189-1215

Dependencies: one, isPreloadedServiceManager, reason.trim, scalar, archive

```typescript
export function archiveUser(
  db: Database,
  id: number,
  reason: string,
  actingUserId: number,
) {
  const target = one<User>(
    db,
    "select * from users where id=? and archived_at is null",
    [id],
  );
  if (isPreloadedServiceManager(target))
    throw new Error("Preloaded Service Department Manager accounts are locked.");
  if (id === actingUserId)
    throw new Error("You cannot archive your own signed-in account.");
  if (!reason.trim()) throw new Error("An archive reason is required.");
  if (
    target.role === "admin" &&
    scalar<number>(
      db,
      "select count(*) from users where role='admin' and archived_at is null",
    ) <= 1
  ) {
    throw new Error("The final active Admin cannot be archived.");
  }
  archive(db, "users", id, reason.trim());
}
```

## OP-db-createCustomer

Source: src/db.ts:1237-1252

Dependencies: validateCustomer, insert, payload.name.trim, payload.mobile.trim, payload.type.trim, (payload.address ?? "").trim

```typescript
export function createCustomer(
  db: Database,
  payload: Pick<Customer, "name" | "mobile" | "type"> & { address?: string },
) {
  validateCustomer(db, payload);
  return insert(
    db,
    "insert into customers(name, mobile, type, address, created_at, updated_at) values (?, ?, ?, ?, datetime('now'), datetime('now'))",
    [
      payload.name.trim(),
      payload.mobile.trim(),
      payload.type.trim(),
      (payload.address ?? "").trim(),
    ],
  );
}
```

## OP-db-updateCustomer

Source: src/db.ts:1254-1270

Dependencies: validateCustomer, db.run, payload.name.trim, payload.mobile.trim, payload.type.trim, payload.address.trim

```typescript
export function updateCustomer(
  db: Database,
  id: number,
  payload: Pick<Customer, "name" | "mobile" | "type"> & { address?: string },
) {
  validateCustomer(db, payload, id);
  db.run(
    "update customers set name=?, mobile=?, type=?, address=coalesce(?, address), updated_at=datetime('now') where id=?",
    [
      payload.name.trim(),
      payload.mobile.trim(),
      payload.type.trim(),
      payload.address == null ? null : payload.address.trim(),
      id,
    ],
  );
}
```

## OP-db-archiveCustomer

Source: src/db.ts:1272-1274

Dependencies: archive

```typescript
export function archiveCustomer(db: Database, id: number, reason: string) {
  archive(db, "customers", id, reason);
}
```

## OP-db-createVehicle

Source: src/db.ts:1276-1291

Dependencies: validateVehicle, insert, payload.number.trim().toUpperCase, payload.number.trim, payload.make.trim, payload.model.trim, payload.color.trim, (payload.engine_no ?? "").trim

```typescript
export function createVehicle(db: Database, payload: Omit<Vehicle, "id">) {
  validateVehicle(db, payload);
  return insert(
    db,
    "insert into vehicles(customer_id, number, make, model, color, km, engine_no, created_at, updated_at) values (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))",
    [
      payload.customer_id,
      payload.number.trim().toUpperCase(),
      payload.make.trim(),
      payload.model.trim(),
      payload.color.trim(),
      payload.km,
      (payload.engine_no ?? "").trim(),
    ],
  );
}
```

## OP-db-updateVehicle

Source: src/db.ts:1293-1312

Dependencies: validateVehicle, db.run, payload.number.trim().toUpperCase, payload.number.trim, payload.make.trim, payload.model.trim, payload.color.trim, payload.engine_no.trim

```typescript
export function updateVehicle(
  db: Database,
  id: number,
  payload: Omit<Vehicle, "id">,
) {
  validateVehicle(db, payload, id);
  db.run(
    "update vehicles set customer_id=?, number=?, make=?, model=?, color=?, km=?, engine_no=coalesce(?, engine_no), updated_at=datetime('now') where id=?",
    [
      payload.customer_id,
      payload.number.trim().toUpperCase(),
      payload.make.trim(),
      payload.model.trim(),
      payload.color.trim(),
      payload.km,
      payload.engine_no == null ? null : payload.engine_no.trim(),
      id,
    ],
  );
}
```

## OP-db-archiveVehicle

Source: src/db.ts:1314-1316

Dependencies: archive

```typescript
export function archiveVehicle(db: Database, id: number, reason: string) {
  archive(db, "vehicles", id, reason);
}
```

## OP-db-updateVisit

Source: src/db.ts:1318-1346

Dependencies: one, db.run

```typescript
export function updateVisit(
  db: Database,
  id: number,
  payload: Partial<
    Pick<
      Visit,
      | "advisor_id"
      | "fuel"
      | "keys"
      | "accessories"
      | "requested_work"
      | "photos_note"
    >
  >,
) {
  const visit = one<Visit>(db, "select * from visits where id=?", [id]);
  db.run(
    "update visits set advisor_id=?, fuel=?, keys=?, accessories=?, requested_work=?, photos_note=?, updated_at=datetime('now') where id=?",
    [
      payload.advisor_id ?? visit.advisor_id,
      payload.fuel ?? visit.fuel,
      payload.keys ?? visit.keys,
      payload.accessories ?? visit.accessories,
      payload.requested_work ?? visit.requested_work,
      payload.photos_note ?? visit.photos_note,
      id,
    ],
  );
}
```

## OP-db-bookingCapacityForDate

Source: src/db.ts:1394-1417

Dependencies: all, scalar, Math.max, quota, Boolean

```typescript
export function bookingCapacityForDate(db: Database, bookingDate: string) {
  const configured = all<BookingCapacityLimit>(
    db,
    "select * from booking_capacity_limits where booking_date=?",
    [bookingDate],
  )[0];
  const quota = (serviceType: BookingServiceType) => {
    const limit = serviceType === "Service Work"
      ? configured?.service_work_capacity ?? DEFAULT_SERVICE_WORK_BOOKING_CAPACITY
      : configured?.general_checkup_followup_capacity ?? DEFAULT_GENERAL_CHECKUP_FOLLOWUP_BOOKING_CAPACITY;
    const count = scalar<number>(
      db,
      "select count(*) from bookings where booking_date=? and service_type=? and status in ('Booked','Confirmed','Rescheduled')",
      [bookingDate, serviceType],
    );
    return { limit, count, remaining: Math.max(0, limit - count) };
  };
  return {
    bookingDate,
    serviceWork: quota("Service Work"),
    generalCheckupFollowup: quota("General Checkup / Follow-up"),
    configured: Boolean(configured),
  };
}
```

## OP-db-setBookingCapacityForDate

Source: src/db.ts:1420-1438

Dependencies: new Date().toISOString, assertBookingInput, one, Number.isInteger, db.run

```typescript
export function setBookingCapacityForDate(
  db: Database,
  actorId: number,
  bookingDate: string,
  capacities: { serviceWork: number; generalCheckupFollowup: number },
  timestamp = new Date().toISOString(),
) {
  assertBookingInput({
    customerName: "capacity", mobile: "capacity", vehicleNo: "capacity", make: "capacity", model: "capacity", requestedWork: "capacity", serviceType: "Service Work", bookingDate,
  });
  const actor = one<User>(db, "select * from users where id=?", [actorId]);
  if (actor.role !== "admin") throw new Error("Only Admin can change daily booking capacity.");
  if (!Number.isInteger(capacities.serviceWork) || capacities.serviceWork < 0 || !Number.isInteger(capacities.generalCheckupFollowup) || capacities.generalCheckupFollowup < 0)
    throw new Error("Booking capacities must be whole numbers of zero or more.");
  db.run(
    "insert into booking_capacity_limits(booking_date,service_work_capacity,general_checkup_followup_capacity,set_by,updated_at) values(?,?,?,?,?) on conflict(booking_date) do update set service_work_capacity=excluded.service_work_capacity,general_checkup_followup_capacity=excluded.general_checkup_followup_capacity,set_by=excluded.set_by,updated_at=excluded.updated_at",
    [bookingDate, capacities.serviceWork, capacities.generalCheckupFollowup, actorId, timestamp],
  );
}
```

## OP-db-createBooking

Source: src/db.ts:1546-1601

Dependencies: new Date().toISOString, assertBookingInput, timestamp.slice, assertBookingCapacity, insert, input.customerName.trim, input.mobile.trim, input.customerType?.trim, input.vehicleNo.trim().toUpperCase, input.vehicleNo.trim, input.make.trim, input.model.trim, input.color?.trim, input.requestedWork.trim, bookingEvent, one, recordBookingCapacityOverride

```typescript
export function createBooking(
  db: Database,
  actorId: number,
  input: BookingInput,
  timestamp = new Date().toISOString(),
) {
  assertBookingInput(input, timestamp.slice(0, 10));
  if (!actorId) throw new Error("Creating user is required.");
  const isOverride = assertBookingCapacity(
    db,
    actorId,
    input.bookingDate,
    input.serviceType,
    input.capacityOverrideReason,
  );
  const id = insert(
    db,
    "insert into bookings(customer_id,vehicle_id,customer_name,mobile,customer_type,vehicle_no,make,model,color,requested_work,service_type,booking_date,arrival_window,status,created_by,created_at,updated_at) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [
      input.customerId ?? null,
      input.vehicleId ?? null,
      input.customerName.trim(),
      input.mobile.trim(),
      input.customerType?.trim() || "Individual",
      input.vehicleNo.trim().toUpperCase(),
      input.make.trim(),
      input.model.trim(),
      input.color?.trim() ?? "",
      input.requestedWork.trim(),
      input.serviceType,
      input.bookingDate,
      input.arrivalWindow ?? "",
      "Booked",
      actorId,
      timestamp,
      timestamp,
    ],
  );
  bookingEvent(
    db,
    one<Booking>(db, "select * from bookings where id=?", [id]),
    "Booked",
    actorId,
    timestamp,
  );
  if (isOverride)
    recordBookingCapacityOverride(
      db,
      id,
      input.bookingDate,
      actorId,
      input.capacityOverrideReason!,
      timestamp,
    );
  return id;
}
```

## OP-db-updateBooking

Source: src/db.ts:1604-1651

Dependencies: new Date().toISOString, assertBookingInput, timestamp.slice, operationalBooking, assertBookingCapacity, db.run, input.customerName.trim, input.mobile.trim, input.customerType?.trim, input.vehicleNo.trim().toUpperCase, input.vehicleNo.trim, input.make.trim, input.model.trim, input.color?.trim, input.requestedWork.trim, recordBookingCapacityOverride

```typescript
export function updateBooking(
  db: Database,
  bookingId: number,
  actorId: number,
  input: BookingInput,
  timestamp = new Date().toISOString(),
) {
  assertBookingInput(input, timestamp.slice(0, 10));
  const booking = operationalBooking(db, bookingId);
  if (!actorId) throw new Error("Updating user is required.");
  const isOverride = assertBookingCapacity(
    db,
    actorId,
    input.bookingDate,
    input.serviceType,
    input.capacityOverrideReason,
    bookingId,
  );
  db.run(
    "update bookings set customer_id=?,vehicle_id=?,customer_name=?,mobile=?,customer_type=?,vehicle_no=?,make=?,model=?,color=?,requested_work=?,service_type=?,booking_date=?,arrival_window=?,updated_at=? where id=?",
    [
      input.customerId ?? booking.customer_id ?? null,
      input.vehicleId ?? booking.vehicle_id ?? null,
      input.customerName.trim(),
      input.mobile.trim(),
      input.customerType?.trim() || "Individual",
      input.vehicleNo.trim().toUpperCase(),
      input.make.trim(),
      input.model.trim(),
      input.color?.trim() ?? "",
      input.requestedWork.trim(),
      input.serviceType,
      input.bookingDate,
      input.arrivalWindow ?? "",
      timestamp,
      bookingId,
    ],
  );
  if (isOverride)
    recordBookingCapacityOverride(
      db,
      bookingId,
      input.bookingDate,
      actorId,
      input.capacityOverrideReason!,
      timestamp,
    );
}
```

## OP-db-confirmBooking

Source: src/db.ts:1653-1667

Dependencies: new Date().toISOString, operationalBooking, (["Booked", "Rescheduled"] as BookingStatus[]).includes, db.run, bookingEvent

```typescript
export function confirmBooking(
  db: Database,
  bookingId: number,
  actorId: number,
  timestamp = new Date().toISOString(),
) {
  const booking = operationalBooking(db, bookingId);
  if (!(["Booked", "Rescheduled"] as BookingStatus[]).includes(booking.status))
    throw new Error(`A ${booking.status} booking cannot be confirmed.`);
  db.run(
    "update bookings set status='Confirmed',confirmed_at=?,updated_at=? where id=?",
    [timestamp, timestamp, bookingId],
  );
  bookingEvent(db, booking, "Confirmed", actorId, timestamp);
}
```

## OP-db-rescheduleBooking

Source: src/db.ts:1669-1739

Dependencies: new Date().toISOString, operationalBooking, assertBookingInput, timestamp.slice, reason.trim, assertBookingCapacity, db.run, bookingEvent, recordBookingCapacityOverride

```typescript
export function rescheduleBooking(
  db: Database,
  bookingId: number,
  actorId: number,
  bookingDate: string,
  reason: string,
  arrivalWindow: BookingArrivalWindow = "",
  timestamp = new Date().toISOString(),
  capacityOverrideReason?: string,
) {
  const booking = operationalBooking(db, bookingId);
  assertBookingInput(
    {
      customerName: booking.customer_name,
      mobile: booking.mobile,
      vehicleNo: booking.vehicle_no,
      make: booking.make,
      model: booking.model,
      requestedWork: booking.requested_work,
      serviceType: booking.service_type,
      bookingDate,
      arrivalWindow,
    },
    timestamp.slice(0, 10),
  );
  if (!reason.trim()) throw new Error("A reschedule reason is required.");
  if (
    booking.booking_date === bookingDate &&
    booking.arrival_window === arrivalWindow
  )
    throw new Error(
      "Choose a different date or arrival window when rescheduling.",
    );
  const isOverride = assertBookingCapacity(
    db,
    actorId,
    bookingDate,
    booking.service_type,
    capacityOverrideReason,
    bookingId,
  );
  db.run(
    "update bookings set booking_date=?,arrival_window=?,status='Rescheduled',rescheduled_at=?,reschedule_reason=?,updated_at=? where id=?",
    [
      bookingDate,
      arrivalWindow,
      timestamp,
      reason.trim(),
      timestamp,
      bookingId,
    ],
  );
  bookingEvent(
    db,
    { ...booking, booking_date: bookingDate },
    "Rescheduled",
    actorId,
    timestamp,
    reason.trim(),
    booking.booking_date,
  );
  if (isOverride)
    recordBookingCapacityOverride(
      db,
      bookingId,
      bookingDate,
      actorId,
      capacityOverrideReason!,
      timestamp,
    );
}
```

## OP-db-cancelBooking

Source: src/db.ts:1741-1755

Dependencies: new Date().toISOString, operationalBooking, reason.trim, db.run, bookingEvent

```typescript
export function cancelBooking(
  db: Database,
  bookingId: number,
  actorId: number,
  reason: string,
  timestamp = new Date().toISOString(),
) {
  const booking = operationalBooking(db, bookingId);
  if (!reason.trim()) throw new Error("A cancellation reason is required.");
  db.run(
    "update bookings set status='Cancelled',cancelled_at=?,cancellation_reason=?,updated_at=? where id=?",
    [timestamp, reason.trim(), timestamp, bookingId],
  );
  bookingEvent(db, booking, "Cancelled", actorId, timestamp, reason.trim());
}
```

## OP-db-markBookingNoShow

Source: src/db.ts:1757-1771

Dependencies: new Date().toISOString, operationalBooking, reason.trim, db.run, bookingEvent

```typescript
export function markBookingNoShow(
  db: Database,
  bookingId: number,
  actorId: number,
  reason: string,
  timestamp = new Date().toISOString(),
) {
  const booking = operationalBooking(db, bookingId);
  if (!reason.trim()) throw new Error("A no-show reason is required.");
  db.run(
    "update bookings set status='No-show',no_show_at=?,no_show_reason=?,updated_at=? where id=?",
    [timestamp, reason.trim(), timestamp, bookingId],
  );
  bookingEvent(db, booking, "No-show", actorId, timestamp, reason.trim());
}
```

## OP-db-recordBookingCall

Source: src/db.ts:1773-1787

Dependencies: new Date().toISOString, operationalBooking, note.trim, insert

```typescript
export function recordBookingCall(
  db: Database,
  bookingId: number,
  actorId: number,
  note: string,
  timestamp = new Date().toISOString(),
) {
  operationalBooking(db, bookingId);
  if (!note.trim()) throw new Error("A call note is required.");
  return insert(
    db,
    "insert into booking_call_logs(booking_id,note,called_by,called_at) values(?,?,?,?)",
    [bookingId, note.trim(), actorId, timestamp],
  );
}
```

## OP-db-checkInBooking

Source: src/db.ts:1795-1852

Dependencies: new Date().toISOString, operationalBooking, CAPACITY_BOOKING_STATUSES.includes, input.requestedWork.trim, Number.isFinite, input.fuelLevelValue.trim, db.run, receiveVehicle, input.keys.trim, input.accessories.trim, one, bookingEvent

```typescript
export function checkInBooking(
  db: Database,
  bookingId: number,
  receptionId: number,
  input: BookingCheckInInput,
  timestamp = new Date().toISOString(),
) {
  const booking = operationalBooking(db, bookingId);
  if (!CAPACITY_BOOKING_STATUSES.includes(booking.status))
    throw new Error(`A ${booking.status} booking cannot be checked in.`);
  if (!receptionId) throw new Error("Receiving user is required.");
  if (!input.requestedWork.trim()) throw new Error("Requested work is required.");
  if (!Number.isFinite(input.odoReading) || input.odoReading < 0)
    throw new Error("Enter the ODO meter reading in km.");
  if (!input.fuelLevelValue.trim())
    throw new Error("Enter the fuel level or battery percentage.");

  const fuel = input.fuelLevelUnit === "Other"
    ? input.fuelLevelValue.trim()
    : `${input.fuelLevelValue.trim()} ${input.fuelLevelUnit}`;
  db.run("savepoint booking_check_in");
  try {
    const jobId = receiveVehicle(db, {
      customerId: booking.customer_id ?? undefined,
      vehicleId: booking.vehicle_id ?? undefined,
      customerName: booking.customer_name,
      mobile: booking.mobile,
      customerType: booking.customer_type,
      vehicleNo: booking.vehicle_no,
      make: booking.make,
      model: booking.model,
      color: booking.color,
      km: input.odoReading,
      odoReading: input.odoReading,
      fuel,
      fuelLevelValue: input.fuelLevelValue.trim(),
      fuelLevelUnit: input.fuelLevelUnit,
      keys: input.keys.trim(),
      accessories: input.accessories.trim(),
      requestedWork: input.requestedWork.trim(),
      serviceType: booking.service_type,
      receptionId,
      damageMarks: input.damageMarks,
    });
    const visitId = one<JobCard>(db, "select * from job_cards where id=?", [jobId]).visit_id;
    db.run(
      "update bookings set status='Arrived',arrived_at=?,visit_id=?,job_card_id=?,updated_at=? where id=?",
      [timestamp, visitId, jobId, timestamp, bookingId],
    );
    bookingEvent(db, booking, "Arrived", receptionId, timestamp, "Checked in at reception");
    db.run("release savepoint booking_check_in");
    return { jobId, visitId };
  } catch (error) {
    db.run("rollback to savepoint booking_check_in");
    db.run("release savepoint booking_check_in");
    throw error;
  }
}
```

## OP-db-receiveVehicle

Source: src/db.ts:1854-2035

Dependencies: payload.customerName.trim, payload.mobile.trim, payload.vehicleNo.trim, payload.make.trim, payload.model.trim, payload.requestedWork.trim, Number.isFinite, payload.fuel.trim, payload.fuelLevelValue?.trim, db.run, maybe, createCustomer, payload.vehicleNo.toUpperCase, createVehicle, updateCustomer, updateVehicle, insert, new Date().getFullYear, String(1247 + visitId).padStart, String, ensureLifecycleChecklist, payload.requestedWork.split, ["Edges checked", "Surface cleaned", "Customer items verified"].forEach, createPhoto, history

```typescript
export function receiveVehicle(
  db: Database,
  payload: {
    customerId?: number;
    vehicleId?: number;
    customerName: string;
    mobile: string;
    customerType: string;
    vehicleNo: string;
    make: string;
    model: string;
    color: string;
    km: number;
    fuel: string;
    odoReading?: number;
    fuelLevelValue?: string;
    fuelLevelUnit?: "bars" | "%" | "litres" | "Other";
    keys: string;
    accessories: string;
    requestedWork: string;
    advisorId?: number;
    receptionId: number;
    damageMarks?: string;
    address?: string;
    engineNo?: string;
    serviceType?: string;
    pickupDrop?: string;
    estimatedDelivery?: string;
  },
) {
  if (!payload.customerName.trim())
    throw new Error("Customer name is required.");
  if (!payload.mobile.trim()) throw new Error("Customer mobile is required.");
  if (!payload.vehicleNo.trim()) throw new Error("Vehicle number is required.");
  if (!payload.make.trim() || !payload.model.trim())
    throw new Error("Vehicle make and model are required.");
  if (!payload.requestedWork.trim())
    throw new Error("Requested work is required.");
  if (!payload.receptionId) throw new Error("Receiving user is required.");
  const odoReading = payload.odoReading ?? payload.km;
  if (!Number.isFinite(odoReading) || odoReading < 0)
    throw new Error("Enter the ODO meter reading in km.");
  if (!payload.fuel.trim())
    throw new Error("Enter the fuel level or battery percentage.");
  if (payload.fuelLevelUnit && !payload.fuelLevelValue?.trim())
    throw new Error("Enter the fuel or battery level.");
  const advisorId = payload.advisorId || 0;
  db.run("savepoint reception_intake");
  try {
    const customerId =
      payload.customerId ||
      maybe<{ id: number }>(
        db,
        "select id from customers where mobile=? and archived_at is null",
        [payload.mobile],
      )?.id ||
      createCustomer(db, {
        name: payload.customerName,
        mobile: payload.mobile,
        type: payload.customerType || "Individual",
        address: payload.address,
      });
    const vehicleId =
      payload.vehicleId ||
      maybe<{ id: number }>(
        db,
        "select id from vehicles where number=? and archived_at is null",
        [payload.vehicleNo.toUpperCase()],
      )?.id ||
      createVehicle(db, {
        customer_id: customerId,
        number: payload.vehicleNo,
        make: payload.make,
        model: payload.model,
        color: payload.color,
        km: odoReading,
        engine_no: payload.engineNo,
      });
    updateCustomer(db, customerId, {
      name: payload.customerName,
      mobile: payload.mobile,
      type: payload.customerType || "Individual",
      address: payload.address,
    });
    updateVehicle(db, vehicleId, {
      customer_id: customerId,
      number: payload.vehicleNo,
      make: payload.make,
      model: payload.model,
      color: payload.color,
      km: odoReading,
      engine_no: payload.engineNo,
    });
    const visitId = insert(
      db,
      "insert into visits(customer_id, vehicle_id, advisor_id, received_by, received_at, fuel, odo_reading, fuel_level_value, fuel_level_unit, keys, accessories, requested_work, photos_note, created_at, updated_at) values (?, ?, ?, ?, datetime('now'), ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))",
      [
        customerId,
        vehicleId,
        advisorId,
        payload.receptionId,
        payload.fuel,
        odoReading,
        payload.fuelLevelValue ?? "",
        payload.fuelLevelUnit ?? "",
        payload.keys,
        payload.accessories,
        payload.requestedWork,
        "Reception intake",
      ],
    );
    const jobId = insert(
      db,
      "insert into job_cards(job_no, visit_id, advisor_id, technician_id, main_status, sub_status, work_list, promised_at, qc_status, washing_needed, closed_at, advisor_notes, customer_instructions, internal_instructions, created_at, updated_at) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))",
      [
        `JC-${new Date().getFullYear()}-${String(1247 + visitId).padStart(6, "0")}`,
        visitId,
        advisorId,
        6,
        "NEW",
        "Gather Requirements",
        payload.requestedWork,
        "Tomorrow 6:00 PM",
        "Pending",
        0,
        "",
        "",
        payload.requestedWork,
        "",
      ],
    );
    db.run(
      "update job_cards set service_type=?, pickup_drop=?, estimated_delivery=?, damage_marks=? where id=?",
      [
        payload.serviceType ?? "",
        payload.pickupDrop ?? "",
        payload.estimatedDelivery ?? "",
        payload.damageMarks || "[]",
        jobId,
      ],
    );
    ensureLifecycleChecklist(db, jobId, "NEW", "Gather Requirements");
    insert(
      db,
      "insert into tasks(job_card_id, technician_id, title, status, notes, created_at, updated_at) values (?, ?, ?, ?, ?, datetime('now'), datetime('now'))",
      [
        jobId,
        6,
        payload.requestedWork.split(",")[0] || "Workshop inspection",
        "Pending",
        "Created at reception check-in.",
      ],
    );
    ["Edges checked", "Surface cleaned", "Customer items verified"].forEach(
      (label) =>
        insert(
          db,
          "insert into qc_checks(job_card_id, label, passed) values (?, ?, 0)",
          [jobId, label],
        ),
    );
    createPhoto(db, {
      job_card_id: jobId,
      label: "Reception intake",
      category: "Reception",
      src: "",
    });
    history(
      db,
      jobId,
      "NEW",
      "Gather Requirements",
      "Visit received and job card opened",
    );
    db.run("release savepoint reception_intake");
    return jobId;
  } catch (error) {
    db.run("rollback to savepoint reception_intake");
    db.run("release savepoint reception_intake");
    throw error;
  }
}
```

## OP-db-isTerminalMainStatus

Source: src/db.ts:2052-2054

Dependencies: 

```typescript
export function isTerminalMainStatus(status: MainStatus) {
  return MAIN_STATUS_TRANSITIONS[status].length === 0;
}
```

## OP-db-canMutateJobLifecycle

Source: src/db.ts:2056-2064

Dependencies: 

```typescript
export function canMutateJobLifecycle(
  actor: Pick<User, "id" | "role">,
  job: Pick<JobCard, "advisor_id">,
) {
  return (
    actor.role === "admin" ||
    (actor.role === "service" && actor.id === job.advisor_id)
  );
}
```

## OP-db-canTransitionJobStatus

Source: src/db.ts:2068-2076

Dependencies: MAIN_STATUS_TRANSITIONS[job.main_status].includes

```typescript
export function canTransitionJobStatus(
  actor: Pick<User, "id" | "role">,
  job: Pick<JobCard, "advisor_id" | "main_status">,
  to: MainStatus,
) {
  if (!MAIN_STATUS_TRANSITIONS[job.main_status].includes(to)) return false;
  if (actor.role === "admin") return true;
  return actor.role === "service" && actor.id === job.advisor_id;
}
```

## OP-db-assertJobLifecycleMutationAccess

Source: src/db.ts:2078-2100

Dependencies: one, isTerminalMainStatus, canMutateJobLifecycle

```typescript
export function assertJobLifecycleMutationAccess(
  db: Database,
  jobId: number,
  actorId: number,
) {
  const actor = one<User>(
    db,
    "select * from users where id=? and archived_at is null",
    [actorId],
  );
  const job = one<JobCard>(
    db,
    "select * from job_cards where id=? and archived_at is null",
    [jobId],
  );
  if (isTerminalMainStatus(job.main_status))
    throw new Error(`A ${job.main_status} job card is read-only.`);
  if (!canMutateJobLifecycle(actor, job)) {
    throw new Error(
      "Only the Owner or the linked Service Advisor can change this job lifecycle or estimate.",
    );
  }
}
```

## OP-db-createServiceCatalogItemForActor

Source: src/db.ts:2125-2156

Dependencies: assertAdminAccess, input.name.trim, assertCatalogAssignments, Number.isFinite, GST_RATES.includes, insert

```typescript
export function createServiceCatalogItemForActor(
  db: Database,
  actorId: number,
  input: Pick<ServiceCatalogItem, "name" | "base_rate" | "service_department_id" | "brand_id" | "car_segment_id"> & {
    gst_rate?: number;
  },
) {
  assertAdminAccess(db, actorId);
  const name = input.name.trim();
  if (!name) throw new Error("Service name is required.");
  assertCatalogAssignments(db, input);
  if (!Number.isFinite(input.base_rate) || input.base_rate < 0)
    throw new Error("Base rate must be zero or greater.");
  const gstRate = input.gst_rate ?? 18;
  if (
    !Number.isFinite(gstRate) ||
    (gstRate !== 0 && !GST_RATES.includes(gstRate as (typeof GST_RATES)[number]))
  )
    throw new Error("GST rate must be No GST (0%) or 5%, 9%, 12%, 18%, or 28%.");
  return insert(
    db,
    "insert into service_catalog_items(name,base_rate,gst_rate,service_department_id,brand_id,car_segment_id,created_at,updated_at) values(?,?,?,?,?,?,datetime('now'),datetime('now'))",
    [
      name,
      input.base_rate,
      gstRate,
      input.service_department_id!,
      input.brand_id ?? null,
      input.car_segment_id ?? null,
    ],
  );
}
```

## OP-db-updateServiceCatalogItemForActor

Source: src/db.ts:2158-2190

Dependencies: assertAdminAccess, input.name.trim, assertCatalogAssignments, Number.isFinite, GST_RATES.includes, db.run

```typescript
export function updateServiceCatalogItemForActor(
  db: Database,
  actorId: number,
  id: number,
  input: Pick<ServiceCatalogItem, "name" | "base_rate" | "service_department_id" | "brand_id" | "car_segment_id"> & {
    gst_rate?: number;
  },
) {
  assertAdminAccess(db, actorId);
  const name = input.name.trim();
  if (!name) throw new Error("Service name is required.");
  assertCatalogAssignments(db, input);
  if (!Number.isFinite(input.base_rate) || input.base_rate < 0)
    throw new Error("Base rate must be zero or greater.");
  const gstRate = input.gst_rate ?? 18;
  if (
    !Number.isFinite(gstRate) ||
    (gstRate !== 0 && !GST_RATES.includes(gstRate as (typeof GST_RATES)[number]))
  )
    throw new Error("GST rate must be No GST (0%) or 5%, 9%, 12%, 18%, or 28%.");
  db.run(
    "update service_catalog_items set name=?,base_rate=?,gst_rate=?,service_department_id=?,brand_id=?,car_segment_id=?,updated_at=datetime('now') where id=?",
    [
      name,
      input.base_rate,
      gstRate,
      input.service_department_id!,
      input.brand_id ?? null,
      input.car_segment_id ?? null,
      id,
    ],
  );
}
```

## OP-db-archiveServiceCatalogItemForActor

Source: src/db.ts:2199-2209

Dependencies: assertAdminAccess, db.run

```typescript
export function archiveServiceCatalogItemForActor(
  db: Database,
  actorId: number,
  id: number,
) {
  assertAdminAccess(db, actorId);
  db.run(
    "update service_catalog_items set archived_at=datetime('now'),archived_reason='Archived from Service Task Catalog',updated_at=datetime('now') where id=?",
    [id],
  );
}
```

## OP-db-addJobTaskListItemForActor

Source: src/db.ts:2211-2247

Dependencies: assertTaskListMutationAccess, one, (catalog?.name ?? input.name ?? "").trim, Number.isFinite, GST_RATES.includes, insert

```typescript
export function addJobTaskListItemForActor(
  db: Database,
  jobId: number,
  actorId: number,
  input: {
    service_catalog_item_id?: number;
    name?: string;
    base_rate?: number;
    gst_rate?: number;
  },
) {
  assertTaskListMutationAccess(db, jobId, actorId);
  const catalog =
    input.service_catalog_item_id == null
      ? undefined
      : one<ServiceCatalogItem>(
          db,
          "select * from service_catalog_items where id=? and archived_at is null",
          [input.service_catalog_item_id],
        );
  const name = (catalog?.name ?? input.name ?? "").trim();
  const baseRate = catalog?.base_rate ?? input.base_rate;
  const gstRate = catalog?.gst_rate ?? input.gst_rate ?? 18;
  if (!name) throw new Error("Task name is required.");
  if (!Number.isFinite(baseRate) || baseRate! < 0)
    throw new Error("Task rate must be zero or greater.");
  if (
    !Number.isFinite(gstRate) ||
    (gstRate !== 0 && !GST_RATES.includes(gstRate as (typeof GST_RATES)[number]))
  )
    throw new Error("Task GST rate must be No GST (0%) or 5%, 9%, 12%, 18%, or 28%.");
  return insert(
    db,
    "insert into job_task_list_items(job_card_id,service_catalog_item_id,name,base_rate,gst_rate,done,created_at,updated_at) values(?,?,?,?,?,0,datetime('now'),datetime('now'))",
    [jobId, catalog?.id ?? null, name, baseRate!, gstRate],
  );
}
```

## OP-db-updateJobTaskListItemForActor

Source: src/db.ts:2249-2269

Dependencies: one, assertTaskListMutationAccess, input.name.trim, Number.isFinite, db.run

```typescript
export function updateJobTaskListItemForActor(
  db: Database,
  id: number,
  actorId: number,
  input: Pick<JobTaskListItem, "name" | "base_rate" | "done">,
) {
  const row = one<JobTaskListItem>(
    db,
    "select * from job_task_list_items where id=? and archived_at is null",
    [id],
  );
  assertTaskListMutationAccess(db, row.job_card_id, actorId);
  const name = input.name.trim();
  if (!name) throw new Error("Task name is required.");
  if (!Number.isFinite(input.base_rate) || input.base_rate < 0)
    throw new Error("Task rate must be zero or greater.");
  db.run(
    "update job_task_list_items set name=?,base_rate=?,done=?,updated_at=datetime('now') where id=?",
    [name, input.base_rate, input.done ? 1 : 0, id],
  );
}
```

## OP-db-archiveJobTaskListItemForActor

Source: src/db.ts:2271-2286

Dependencies: one, assertTaskListMutationAccess, db.run

```typescript
export function archiveJobTaskListItemForActor(
  db: Database,
  id: number,
  actorId: number,
) {
  const row = one<JobTaskListItem>(
    db,
    "select * from job_task_list_items where id=? and archived_at is null",
    [id],
  );
  assertTaskListMutationAccess(db, row.job_card_id, actorId);
  db.run(
    "update job_task_list_items set archived_at=datetime('now'),archived_reason='Removed from Task List',updated_at=datetime('now') where id=?",
    [id],
  );
}
```

## OP-db-prefillEstimateFromTaskListForActor

Source: src/db.ts:2289-2346

Dependencies: assertTaskListMutationAccess, maybe, db.run, insert, all, scalar, reconcileArtifactChecklist

```typescript
export function prefillEstimateFromTaskListForActor(
  db: Database,
  jobId: number,
  actorId: number,
) {
  assertTaskListMutationAccess(db, jobId, actorId);
  const existing = maybe<Estimate>(
    db,
    "select * from estimates where job_card_id=? and archived_at is null order by id desc limit 1",
    [jobId],
  );
  if (existing?.status === "Approved")
    throw new Error("An approved estimate cannot be prefilled.");
  db.run("savepoint prefill_task_list");
  try {
    const estimateId =
      existing?.id ??
      insert(
        db,
        "insert into estimates(job_card_id,status,discount,gst_rate,approval_note,created_at,updated_at) values(?,'Draft',0,18,'Awaiting customer confirmation',datetime('now'),datetime('now'))",
        [jobId],
      );
    const rows = all<JobTaskListItem>(
      db,
      "select * from job_task_list_items where job_card_id=? and archived_at is null order by id",
      [jobId],
    );
    for (const row of rows) {
      if (
        scalar<number>(
          db,
          "select count(*) from estimate_items where estimate_id=? and task_list_item_id=? and archived_at is null",
          [estimateId, row.id],
        )
      )
        continue;
      insert(
        db,
        "insert into estimate_items(estimate_id,kind,description,qty,rate,gst_type,gst_rate,task_list_item_id,created_at,updated_at) values(?,'Service',?,1,?,?,?,?,datetime('now'),datetime('now'))",
        [
          estimateId,
          row.name,
          row.base_rate,
          row.gst_rate === 0 ? "No GST" : "CGST+SGST",
          row.gst_rate,
          row.id,
        ],
      );
    }
    reconcileArtifactChecklist(db, jobId, actorId);
    db.run("release savepoint prefill_task_list");
    return estimateId;
  } catch (error) {
    db.run("rollback to savepoint prefill_task_list");
    db.run("release savepoint prefill_task_list");
    throw error;
  }
}
```

## OP-db-transitionJobStatusForActor

Source: src/db.ts:2348-2389

Dependencies: new Date().toISOString, one, MAIN_STATUS_TRANSITIONS[job.main_status].includes, canTransitionJobStatus, maybe, canCompleteWithInvoice, transitionJobStatus

```typescript
export function transitionJobStatusForActor(
  db: Database,
  jobId: number,
  actorId: number,
  to: MainStatus,
  note: string,
  timestamp = new Date().toISOString(),
) {
  const actor = one<User>(
    db,
    "select * from users where id=? and archived_at is null",
    [actorId],
  );
  const job = one<JobCard>(
    db,
    "select * from job_cards where id=? and archived_at is null",
    [jobId],
  );
  if (to === "CLOSED")
    throw new Error(
      "A completed job can only close when a valid payment is recorded.",
    );
  if (!MAIN_STATUS_TRANSITIONS[job.main_status].includes(to))
    throw new Error(`Cannot move a job card from ${job.main_status} to ${to}.`);
  if (!canTransitionJobStatus(actor, job, to)) {
    throw new Error(
      to === "CANCELLED"
        ? "Only the Owner or the linked Service Advisor can cancel a job card."
        : "Only the Owner or the linked Service Advisor can change this job lifecycle.",
    );
  }
  if (to === "COMPLETED") {
    const invoice = maybe<Invoice>(
      db,
      "select * from invoices where job_card_id=? and voided_at is null order by id desc limit 1",
      [jobId],
    );
    if (!canCompleteWithInvoice({ invoice }))
      throw new Error("Create an Invoice before completing the job.");
  }
  transitionJobStatus(db, jobId, to, note, timestamp);
}
```

## OP-db-saveEstimateForActor

Source: src/db.ts:2423-2492

Dependencies: assertJobLifecycleMutationAccess, Number.isFinite, draft.items.forEach, item.description.trim, normalizeAndValidateGst, db.run, maybe, insert, draft.notes.trim, createEstimateItem, reconcileArtifactChecklist

```typescript
export function saveEstimateForActor(
  db: Database,
  jobId: number,
  actorId: number,
  draft: EstimateDraftInput,
) {
  assertJobLifecycleMutationAccess(db, jobId, actorId);
  if (!Number.isFinite(draft.discount) || draft.discount < 0)
    throw new Error("Discount must be zero or greater.");
  if (!Number.isFinite(draft.gst_rate) || draft.gst_rate < 0)
    throw new Error("GST must be zero or greater.");
  if (draft.items.length === 0)
    throw new Error("Add at least one estimate item.");
  draft.items.forEach((item) => {
    if (!item.description.trim())
      throw new Error("Every estimate item needs a description.");
    if (!Number.isFinite(item.qty) || item.qty <= 0)
      throw new Error("Item quantity must be greater than zero.");
    if (!Number.isFinite(item.rate) || item.rate < 0)
      throw new Error("Item rate must be zero or greater.");
    normalizeAndValidateGst(item.gst_type, item.gst_rate, draft.gst_rate);
  });
  db.run("savepoint save_estimate");
  try {
    const existing = maybe<Estimate>(
      db,
      "select * from estimates where job_card_id=? and archived_at is null order by id desc limit 1",
      [jobId],
    );
    const estimateId =
      existing?.id ??
      insert(
        db,
        "insert into estimates(job_card_id,status,discount,gst_rate,approval_note,created_at,updated_at) values (?,'Draft',?,?,?,datetime('now'),datetime('now'))",
        [jobId, draft.discount, draft.gst_rate, draft.notes.trim()],
      );
    if (existing) {
      db.run(
        "update estimates set discount=?,gst_rate=?,approval_note=?,updated_at=datetime('now') where id=?",
        [draft.discount, draft.gst_rate, draft.notes.trim(), estimateId],
      );
      db.run(
        "update estimate_items set archived_at=datetime('now'),archived_reason='Replaced by estimate edit',updated_at=datetime('now') where estimate_id=? and archived_at is null",
        [estimateId],
      );
    }
    draft.items.forEach((item) => {
      const tax = normalizeAndValidateGst(
        item.gst_type,
        item.gst_rate,
        draft.gst_rate,
      );
      createEstimateItem(db, {
        estimate_id: estimateId,
        kind: item.kind,
        description: item.description.trim(),
        qty: item.qty,
        rate: item.rate,
        ...tax,
      });
    });
    reconcileArtifactChecklist(db, jobId, actorId);
    db.run("release savepoint save_estimate");
    return estimateId;
  } catch (error) {
    db.run("rollback to savepoint save_estimate");
    db.run("release savepoint save_estimate");
    throw error;
  }
}
```

## OP-db-updateJobCard

Source: src/db.ts:2501-2548

Dependencies: one, transitionJobStatus, checklistSubStatus, db.run, history, note?.trim

```typescript
export function updateJobCard(
  db: Database,
  jobId: number,
  payload: Partial<
    Pick<
      JobCard,
      | "advisor_id"
      | "technician_id"
      | "main_status"
      | "sub_status"
      | "work_list"
      | "promised_at"
      | "advisor_notes"
      | "customer_instructions"
      | "internal_instructions"
    >
  >,
  note?: string,
) {
  let job = one<JobCard>(db, "select * from job_cards where id=?", [jobId]);
  if (payload.main_status && payload.main_status !== job.main_status) {
    transitionJobStatus(db, jobId, payload.main_status, note ?? "");
    job = one<JobCard>(db, "select * from job_cards where id=?", [jobId]);
  }
  const sub = checklistSubStatus(db, jobId, job.sub_status);
  db.run(
    "update job_cards set advisor_id=?, technician_id=?, sub_status=?, work_list=?, promised_at=?, advisor_notes=?, customer_instructions=?, internal_instructions=?, updated_at=datetime('now') where id=?",
    [
      payload.advisor_id ?? job.advisor_id,
      payload.technician_id ?? job.technician_id,
      sub,
      payload.work_list ?? job.work_list,
      payload.promised_at ?? job.promised_at,
      payload.advisor_notes ?? job.advisor_notes ?? "",
      payload.customer_instructions ?? job.customer_instructions ?? "",
      payload.internal_instructions ?? job.internal_instructions ?? "",
      jobId,
    ],
  );
  if (sub !== job.sub_status)
    history(
      db,
      jobId,
      job.main_status,
      sub,
      note?.trim() || "Job card updated",
    );
}
```

## OP-db-updateJobCardForActor

Source: src/db.ts:2550-2569

Dependencies: assertJobLifecycleMutationAccess, updateJobCard

```typescript
export function updateJobCardForActor(
  db: Database,
  jobId: number,
  actorId: number,
  payload: Partial<
    Pick<
      JobCard,
      | "advisor_id"
      | "technician_id"
      | "work_list"
      | "promised_at"
      | "advisor_notes"
      | "customer_instructions"
      | "internal_instructions"
    >
  >,
) {
  assertJobLifecycleMutationAccess(db, jobId, actorId);
  updateJobCard(db, jobId, payload);
}
```

## OP-db-saveJobDetailsForActor

Source: src/db.ts:2592-2641

Dependencies: assertJobLifecycleMutationAccess, db.run, updateJobCard, one, input.engine_no.trim, input.address.trim

```typescript
export function saveJobDetailsForActor(
  db: Database,
  jobId: number,
  actorId: number,
  input: JobDetailsInput,
) {
  assertJobLifecycleMutationAccess(db, jobId, actorId);
  db.run("savepoint save_job_details");
  try {
    // Advisor assignment is established when the job is created and is not editable from job details.
    const { advisor_id: _advisorId, ...editableInput } = input;
    updateJobCard(db, jobId, editableInput);
    const job = one<JobCard>(db, "select * from job_cards where id=?", [jobId]);
    const visit = one<Visit>(db, "select * from visits where id=?", [
      job.visit_id,
    ]);
    db.run(
      "update job_cards set service_type=?, pickup_drop=?, estimated_delivery=?, updated_at=datetime('now') where id=?",
      [
        input.service_type ?? job.service_type ?? "",
        input.pickup_drop ?? job.pickup_drop ?? "",
        input.estimated_delivery ?? job.estimated_delivery ?? "",
        jobId,
      ],
    );
    db.run(
      "update visits set fuel=?, accessories=?, updated_at=datetime('now') where id=?",
      [
        input.fuel ?? visit.fuel,
        input.accessories ?? visit.accessories,
        visit.id,
      ],
    );
    if (input.engine_no !== undefined)
      db.run(
        "update vehicles set engine_no=?, updated_at=datetime('now') where id=?",
        [input.engine_no.trim(), visit.vehicle_id],
      );
    if (input.address !== undefined)
      db.run(
        "update customers set address=?, updated_at=datetime('now') where id=?",
        [input.address.trim(), visit.customer_id],
      );
    db.run("release savepoint save_job_details");
  } catch (error) {
    db.run("rollback to savepoint save_job_details");
    db.run("release savepoint save_job_details");
    throw error;
  }
}
```

## OP-db-updateJobSheetForActor

Source: src/db.ts:2644-2651

Dependencies: saveJobDetailsForActor

```typescript
export function updateJobSheetForActor(
  db: Database,
  jobId: number,
  actorId: number,
  input: JobSheetInput,
) {
  saveJobDetailsForActor(db, jobId, actorId, input);
}
```

## OP-db-updateEstimatedDeliveryForActor

Source: src/db.ts:2654-2665

Dependencies: assertJobLifecycleMutationAccess, db.run

```typescript
export function updateEstimatedDeliveryForActor(
  db: Database,
  jobId: number,
  actorId: number,
  estimatedDelivery: string,
) {
  assertJobLifecycleMutationAccess(db, jobId, actorId);
  db.run(
    "update job_cards set estimated_delivery=?, updated_at=datetime('now') where id=?",
    [estimatedDelivery, jobId],
  );
}
```

## OP-db-setDamageMarksForActor

Source: src/db.ts:2668-2679

Dependencies: assertJobLifecycleMutationAccess, db.run, serializeDamageMarks

```typescript
export function setDamageMarksForActor(
  db: Database,
  jobId: number,
  actorId: number,
  marks: DamageMark[],
) {
  assertJobLifecycleMutationAccess(db, jobId, actorId);
  db.run(
    "update job_cards set damage_marks=?, damage_marks_recorded_at=datetime('now'), updated_at=datetime('now') where id=?",
    [serializeDamageMarks(marks), jobId],
  );
}
```

## OP-db-cancelJobCard

Source: src/db.ts:2684-2695

Dependencies: one, archive, history

```typescript
export function cancelJobCard(db: Database, jobId: number, reason: string) {
  const job = one<JobCard>(db, "select * from job_cards where id=?", [jobId]);
  archive(db, "job_cards", jobId, reason || "Cancelled");
  archive(db, "visits", job.visit_id, reason || "Cancelled");
  history(
    db,
    jobId,
    job.main_status,
    job.sub_status,
    `Cancelled: ${reason || "No reason"}`,
  );
}
```

## OP-db-archiveJobCardForActor

Source: src/db.ts:2697-2706

Dependencies: assertJobLifecycleMutationAccess, reason.trim, cancelJobCard

```typescript
export function archiveJobCardForActor(
  db: Database,
  jobId: number,
  actorId: number,
  reason: string,
) {
  assertJobLifecycleMutationAccess(db, jobId, actorId);
  if (!reason.trim()) throw new Error("An archive reason is required.");
  cancelJobCard(db, jobId, reason.trim());
}
```

## OP-db-cancelJobCardStatus

Source: src/db.ts:2712-2714

Dependencies: transitionJobStatus

```typescript
export function cancelJobCardStatus(db: Database, jobId: number, note: string) {
  transitionJobStatus(db, jobId, "CANCELLED", note);
}
```

## OP-db-createEstimate

Source: src/db.ts:2716-2746

Dependencies: maybe, insert, scalar, createEstimateItem, reconcileArtifactChecklist

```typescript
export function createEstimate(db: Database, jobId: number) {
  const existing = maybe<Estimate>(
    db,
    "select * from estimates where job_card_id=? and archived_at is null order by id desc limit 1",
    [jobId],
  );
  const estimateId =
    existing?.id ??
    insert(
      db,
      "insert into estimates(job_card_id, status, discount, gst_rate, approval_note, created_at, updated_at) values (?, ?, ?, ?, ?, datetime('now'), datetime('now'))",
      [jobId, "Draft", 0, 18, "Awaiting customer confirmation"],
    );
  if (
    scalar<number>(
      db,
      "select count(*) from estimate_items where estimate_id=? and archived_at is null",
      [estimateId],
    ) === 0
  ) {
    createEstimateItem(db, {
      estimate_id: estimateId,
      kind: "Service",
      description: "Workshop labour",
      qty: 1,
      rate: 5000,
    });
  }
  reconcileArtifactChecklist(db, jobId);
  return estimateId;
}
```

## OP-db-updateEstimate

Source: src/db.ts:2748-2769

Dependencies: one, db.run, reconcileArtifactChecklist

```typescript
export function updateEstimate(
  db: Database,
  id: number,
  payload: Partial<
    Pick<Estimate, "status" | "discount" | "gst_rate" | "approval_note">
  >,
) {
  const estimate = one<Estimate>(db, "select * from estimates where id=?", [
    id,
  ]);
  db.run(
    "update estimates set status=?, discount=?, gst_rate=?, approval_note=?, updated_at=datetime('now') where id=?",
    [
      payload.status ?? estimate.status,
      payload.discount ?? estimate.discount,
      payload.gst_rate ?? estimate.gst_rate,
      payload.approval_note ?? estimate.approval_note,
      id,
    ],
  );
  reconcileArtifactChecklist(db, estimate.job_card_id);
}
```

## OP-db-createEstimateItem

Source: src/db.ts:2771-2793

Dependencies: normalizeAndValidateGst, insert

```typescript
export function createEstimateItem(
  db: Database,
  payload: Omit<EstimateItem, "id">,
) {
  const tax = normalizeAndValidateGst(
    payload.gst_type,
    payload.gst_rate,
    DEFAULT_GST_BY_KIND[payload.kind],
  );
  return insert(
    db,
    "insert into estimate_items(estimate_id, kind, description, qty, rate, gst_type, gst_rate, created_at, updated_at) values (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))",
    [
      payload.estimate_id,
      payload.kind,
      payload.description,
      payload.qty,
      payload.rate,
      tax.gst_type,
      tax.gst_rate,
    ],
  );
}
```

## OP-db-updateEstimateItem

Source: src/db.ts:2795-2817

Dependencies: normalizeAndValidateGst, db.run

```typescript
export function updateEstimateItem(
  db: Database,
  id: number,
  payload: Omit<EstimateItem, "id">,
) {
  const tax = normalizeAndValidateGst(
    payload.gst_type,
    payload.gst_rate,
    DEFAULT_GST_BY_KIND[payload.kind],
  );
  db.run(
    "update estimate_items set kind=?, description=?, qty=?, rate=?, gst_type=?, gst_rate=?, updated_at=datetime('now') where id=?",
    [
      payload.kind,
      payload.description,
      payload.qty,
      payload.rate,
      tax.gst_type,
      tax.gst_rate,
      id,
    ],
  );
}
```

## OP-db-archiveEstimateItem

Source: src/db.ts:2819-2821

Dependencies: archive

```typescript
export function archiveEstimateItem(db: Database, id: number, reason: string) {
  archive(db, "estimate_items", id, reason);
}
```

## OP-db-approveEstimateForActor

Source: src/db.ts:2824-2845

Dependencies: assertJobLifecycleMutationAccess, maybe, note.trim, updateEstimate, auditEvidence

```typescript
export function approveEstimateForActor(
  db: Database,
  jobId: number,
  actorId: number,
  note: string,
) {
  assertJobLifecycleMutationAccess(db, jobId, actorId);
  const estimate = maybe<Estimate>(
    db,
    "select * from estimates where job_card_id=? and archived_at is null order by id desc limit 1",
    [jobId],
  );
  if (!estimate) throw new Error("Generate the Estimate before approving it.");
  if (estimate.status === "Approved")
    throw new Error("The Estimate is already approved.");
  if (!note.trim()) throw new Error("An approval note is required.");
  updateEstimate(db, estimate.id, {
    status: "Approved",
    approval_note: note.trim(),
  });
  auditEvidence(db, jobId, `Estimate approved: ${note.trim()}`);
}
```

## OP-db-approveEstimate

Source: src/db.ts:2847-2872

Dependencies: createEstimate, updateEstimate, scalar, createMaterialRequest, reconcileArtifactChecklist

```typescript
export function approveEstimate(
  db: Database,
  jobId: number,
  note = "Customer approved",
) {
  const estimateId = createEstimate(db, jobId);
  updateEstimate(db, estimateId, { status: "Approved", approval_note: note });
  if (
    scalar<number>(
      db,
      "select count(*) from material_requests where job_card_id=? and archived_at is null",
      [jobId],
    ) === 0
  ) {
    createMaterialRequest(db, {
      job_card_id: jobId,
      item_id: 1,
      requested_qty: 6,
      issued_qty: 0,
      used_qty: 0,
      returned_qty: 0,
      wasted_qty: 0,
    });
  }
  reconcileArtifactChecklist(db, jobId);
}
```

## OP-db-createMaterialRequest

Source: src/db.ts:2874-2901

Dependencies: approvalBlocksMaterialOperations, materialApprovalForJob, insert, reconcileArtifactChecklist

```typescript
export function createMaterialRequest(
  db: Database,
  payload: Omit<MaterialRequest, "id">,
) {
  if (
    approvalBlocksMaterialOperations(
      materialApprovalForJob(db, payload.job_card_id),
    )
  )
    throw new Error(
      "Material activity is frozen while job approval is pending or rejected.",
    );
  const id = insert(
    db,
    "insert into material_requests(job_card_id, item_id, requested_qty, issued_qty, used_qty, returned_qty, wasted_qty, created_at, updated_at) values (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))",
    [
      payload.job_card_id,
      payload.item_id,
      payload.requested_qty,
      payload.issued_qty,
      payload.used_qty,
      payload.returned_qty,
      payload.wasted_qty,
    ],
  );
  reconcileArtifactChecklist(db, payload.job_card_id);
  return id;
}
```

## OP-db-updateMaterialRequest

Source: src/db.ts:2903-2933

Dependencies: one, approvalBlocksMaterialOperations, materialApprovalForJob, db.run

```typescript
export function updateMaterialRequest(
  db: Database,
  id: number,
  payload: Omit<MaterialRequest, "id">,
) {
  const current = one<MaterialRequest>(
    db,
    "select * from material_requests where id=?",
    [id],
  );
  if (
    approvalBlocksMaterialOperations(
      materialApprovalForJob(db, current.job_card_id),
    )
  )
    throw new Error(
      "Material activity is frozen while job approval is pending or rejected.",
    );
  db.run(
    "update material_requests set item_id=?, requested_qty=?, issued_qty=?, used_qty=?, returned_qty=?, wasted_qty=?, updated_at=datetime('now') where id=?",
    [
      payload.item_id,
      payload.requested_qty,
      payload.issued_qty,
      payload.used_qty,
      payload.returned_qty,
      payload.wasted_qty,
      id,
    ],
  );
}
```

## OP-db-archiveMaterialRequest

Source: src/db.ts:2935-2954

Dependencies: one, approvalBlocksMaterialOperations, materialApprovalForJob, archive

```typescript
export function archiveMaterialRequest(
  db: Database,
  id: number,
  reason: string,
) {
  const current = one<MaterialRequest>(
    db,
    "select * from material_requests where id=?",
    [id],
  );
  if (
    approvalBlocksMaterialOperations(
      materialApprovalForJob(db, current.job_card_id),
    )
  )
    throw new Error(
      "Material activity is frozen while job approval is pending or rejected.",
    );
  archive(db, "material_requests", id, reason);
}
```

## OP-db-createLocalPurchase

Source: src/db.ts:2983-2999

Dependencies: assertLocalPurchaseInput, insert, payload.item_description.trim, payload.unit.trim, payload.vendor.trim, payload.bill_reference.trim, payload.note?.trim

```typescript
export function createLocalPurchase(db: Database, payload: LocalPurchaseInput) {
  assertLocalPurchaseInput(db, payload);
  return insert(
    db,
    "insert into local_purchases(job_card_id,item_description,quantity,unit,unit_cost,vendor,bill_reference,note,created_at,updated_at) values(?,?,?,?,?,?,?,?,datetime('now'),datetime('now'))",
    [
      payload.job_card_id,
      payload.item_description.trim(),
      payload.quantity,
      payload.unit.trim(),
      payload.unit_cost,
      payload.vendor.trim(),
      payload.bill_reference.trim(),
      payload.note?.trim() ?? "",
    ],
  );
}
```

## OP-db-updateLocalPurchase

Source: src/db.ts:3002-3022

Dependencies: assertLocalPurchaseInput, db.run, payload.item_description.trim, payload.unit.trim, payload.vendor.trim, payload.bill_reference.trim, payload.note?.trim

```typescript
export function updateLocalPurchase(
  db: Database,
  id: number,
  payload: LocalPurchaseInput,
) {
  assertLocalPurchaseInput(db, payload);
  db.run(
    "update local_purchases set job_card_id=?,item_description=?,quantity=?,unit=?,unit_cost=?,vendor=?,bill_reference=?,note=?,updated_at=datetime('now') where id=? and archived_at is null",
    [
      payload.job_card_id,
      payload.item_description.trim(),
      payload.quantity,
      payload.unit.trim(),
      payload.unit_cost,
      payload.vendor.trim(),
      payload.bill_reference.trim(),
      payload.note?.trim() ?? "",
      id,
    ],
  );
}
```

## OP-db-archiveLocalPurchase

Source: src/db.ts:3024-3026

Dependencies: archive

```typescript
export function archiveLocalPurchase(db: Database, id: number, reason: string) {
  archive(db, "local_purchases", id, reason);
}
```

## OP-db-createMaterialPurchaseRequestForActor

Source: src/db.ts:3045-3061

Dependencies: assertMaterialManager, input.item_name.trim, input.unit.trim, Number.isFinite, insert

```typescript
export function createMaterialPurchaseRequestForActor(
  db: Database,
  jobId: number,
  actorId: number,
  input: MaterialPurchaseRequestInput,
) {
  assertMaterialManager(db, jobId, actorId);
  if (!input.item_name.trim()) throw new Error("Item name is required.");
  if (!input.unit.trim()) throw new Error("Unit is required.");
  if (!Number.isFinite(input.quantity) || input.quantity <= 0)
    throw new Error("Requested quantity must be greater than zero.");
  return insert(
    db,
    "insert into material_purchase_requests(job_card_id,item_name,quantity,unit,status,created_at,updated_at) values(?,?,?,?, 'Pending',datetime('now'),datetime('now'))",
    [jobId, input.item_name.trim(), input.quantity, input.unit.trim()],
  );
}
```

## OP-db-purchaseStockAndIssueForActor

Source: src/db.ts:3068-3081

Dependencies: 

```typescript
export function purchaseStockAndIssueForActor(
  db: Database,
  requestId: number,
  actorId: number,
  input: PurchaseStockAndIssueInput,
) {
  void db;
  void requestId;
  void actorId;
  void input;
  throw new Error(
    "Direct purchase, stock and issue is unavailable. Create a Purchase Request and wait for PO closure.",
  );
}
```

## OP-db-createSupplierForActor

Source: src/db.ts:3145-3165

Dependencies: assertPurchaseActor, assertSupplierInput, insert, input.name.trim, input.contact_name?.trim, input.phone?.trim, input.email?.trim, input.gstin?.trim

```typescript
export function createSupplierForActor(
  db: Database,
  actorId: number,
  input: SupplierInput,
) {
  assertPurchaseActor(db, actorId, true);
  assertSupplierInput(input);
  return insert(
    db,
    "insert into suppliers(name,contact_name,phone,email,gstin,status,created_by,created_at,updated_at) values(?,?,?,?,?,?,?,datetime('now'),datetime('now'))",
    [
      input.name.trim(),
      input.contact_name?.trim() ?? "",
      input.phone?.trim() ?? "",
      input.email?.trim() ?? "",
      input.gstin?.trim() ?? "",
      input.status ?? "Active",
      actorId,
    ],
  );
}
```

## OP-db-updateSupplierForActor

Source: src/db.ts:3167-3188

Dependencies: assertPurchaseActor, assertSupplierInput, one, db.run, input.name.trim, input.contact_name?.trim, input.phone?.trim, input.email?.trim, input.gstin?.trim

```typescript
export function updateSupplierForActor(
  db: Database,
  id: number,
  actorId: number,
  input: SupplierInput,
) {
  assertPurchaseActor(db, actorId, true);
  assertSupplierInput(input);
  one<Supplier>(db, "select * from suppliers where id=?", [id]);
  db.run(
    "update suppliers set name=?,contact_name=?,phone=?,email=?,gstin=?,status=?,updated_at=datetime('now') where id=?",
    [
      input.name.trim(),
      input.contact_name?.trim() ?? "",
      input.phone?.trim() ?? "",
      input.email?.trim() ?? "",
      input.gstin?.trim() ?? "",
      input.status ?? "Active",
      id,
    ],
  );
}
```

## OP-db-archiveSupplierForActor

Source: src/db.ts:3190-3200

Dependencies: assertPurchaseActor, db.run

```typescript
export function archiveSupplierForActor(
  db: Database,
  id: number,
  actorId: number,
) {
  assertPurchaseActor(db, actorId, true);
  db.run(
    "update suppliers set status='Archived',updated_at=datetime('now') where id=?",
    [id],
  );
}
```

## OP-db-createInwardPurchaseDraft

Source: src/db.ts:3321-3342

Dependencies: assertPurchaseActor, insert, input.supplier_invoice_no?.trim, input.po_number?.trim, replacePurchaseLines, addPurchaseAttachments

```typescript
export function createInwardPurchaseDraft(
  db: Database,
  actorId: number,
  input: InwardPurchaseDraftInput = {},
) {
  assertPurchaseActor(db, actorId);
  const id = insert(
    db,
    "insert into inward_purchases(supplier_id,supplier_invoice_no,invoice_date,po_number,status,subtotal,discount_total,gst_total,total,created_by,created_at,updated_at) values(?,?,?,?, 'Draft',0,0,0,0,?,datetime('now'),datetime('now'))",
    [
      input.supplier_id ?? null,
      input.supplier_invoice_no?.trim() ?? "",
      input.invoice_date ?? "",
      input.po_number?.trim() ?? "",
      actorId,
    ],
  );
  if (input.lines?.length) replacePurchaseLines(db, id, input.lines);
  if (input.attachments?.length)
    addPurchaseAttachments(db, id, actorId, input.attachments);
  return id;
}
```

## OP-db-updateInwardPurchaseDraftForActor

Source: src/db.ts:3344-3378

Dependencies: assertPurchaseActor, one, db.run, input.supplier_invoice_no?.trim, input.po_number?.trim, replacePurchaseLines, addPurchaseAttachments

```typescript
export function updateInwardPurchaseDraftForActor(
  db: Database,
  purchaseId: number,
  actorId: number,
  input: InwardPurchaseDraftInput,
) {
  assertPurchaseActor(db, actorId);
  const purchase = one<InwardPurchase>(
    db,
    "select * from inward_purchases where id=?",
    [purchaseId],
  );
  if (purchase.status !== "Draft")
    throw new Error(
      "Submitted purchases cannot be edited. Create an Admin revision instead.",
    );
  if (
    purchase.created_by !== actorId &&
    one<User>(db, "select * from users where id=?", [actorId]).role !== "admin"
  )
    throw new Error("Only the draft creator or Admin can edit this draft.");
  db.run(
    "update inward_purchases set supplier_id=?,supplier_invoice_no=?,invoice_date=?,po_number=?,updated_at=datetime('now') where id=?",
    [
      input.supplier_id ?? null,
      input.supplier_invoice_no?.trim() ?? "",
      input.invoice_date ?? "",
      input.po_number?.trim() ?? "",
      purchaseId,
    ],
  );
  if (input.lines) replacePurchaseLines(db, purchaseId, input.lines);
  if (input.attachments?.length)
    addPurchaseAttachments(db, purchaseId, actorId, input.attachments);
}
```

## OP-db-sendInwardPurchaseForPoApprovalForActor

Source: src/db.ts:3447-3531

Dependencies: assertPurchaseActor, db.run, one, poSubmissionValidation, purchase.po_number?.trim, insert, new Date().toISOString().slice, new Date().toISOString, totalsForPurchaseLine

```typescript
export function sendInwardPurchaseForPoApprovalForActor(
  db: Database,
  purchaseId: number,
  actorId: number,
) {
  assertPurchaseActor(db, actorId);
  db.run("begin immediate transaction");
  try {
    const purchase = one<InwardPurchase>(
      db,
      "select * from inward_purchases where id=?",
      [purchaseId],
    );
    if (purchase.status === "Awaiting PO Approval") return purchaseId;
    if (purchase.status !== "Draft")
      throw new Error("Only draft purchases can be sent for PO approval.");
    if (
      purchase.created_by !== actorId &&
      one<User>(db, "select * from users where id=?", [actorId]).role !==
        "admin"
    )
      throw new Error(
        "Only the draft creator or Admin can send this purchase.",
      );
    const lines = poSubmissionValidation(db, purchase);
    const poNumber = purchase.po_number?.trim() || `PO-INW-${purchaseId}`;
    const orderId = insert(
      db,
      "insert into purchase_orders(supplier_id,po_number,order_date,notes,status,created_by,created_at,updated_at) values(?,?,?,?, 'Draft',?,datetime('now'),datetime('now'))",
      [
        purchase.supplier_id,
        poNumber,
        new Date().toISOString().slice(0, 10),
        `Linked inward purchase #${purchaseId}`,
        actorId,
      ],
    );
    for (const line of lines) {
      const values = totalsForPurchaseLine(line);
      const poLineId = insert(
        db,
        "insert into purchase_order_lines(purchase_order_id,item_id,ordered_qty,unit_cost,discount,gst_rate,subtotal,gst_amount,total) values(?,?,?,?,?,?,?,?,?)",
        [
          orderId,
          line.item_id,
          values.qty,
          values.unitCost,
          values.discount,
          values.gstRate,
          values.subtotal,
          values.gstAmount,
          values.total,
        ],
      );
      db.run(
        "update inward_purchase_lines set purchase_order_line_id=? where id=?",
        [poLineId, line.id],
      );
    }
    db.run(
      "update purchase_orders set subtotal=?,discount_total=?,gst_total=?,total=? where id=?",
      [
        purchase.subtotal,
        purchase.discount_total,
        purchase.gst_total,
        purchase.total,
        orderId,
      ],
    );
    db.run(
      "update inward_purchases set po_number=?,purchase_order_id=?,status='Awaiting PO Approval',updated_at=datetime('now') where id=?",
      [poNumber, orderId, purchaseId],
    );
    insert(
      db,
      "insert into inward_purchase_events(purchase_id,kind,actor_id,at,note) values(?,?,?,datetime('now'),?)",
      [purchaseId, "sent-for-po", actorId, `Created PO ${poNumber}`],
    );
    db.run("commit");
    return purchaseId;
  } catch (error) {
    db.run("rollback");
    throw error;
  }
}
```

## OP-db-approveInwardPurchaseForActor

Source: src/db.ts:3533-3571

Dependencies: assertPurchaseActor, db.run, one, insert

```typescript
export function approveInwardPurchaseForActor(
  db: Database,
  purchaseId: number,
  actorId: number,
) {
  assertPurchaseActor(db, actorId, true);
  db.run("begin immediate transaction");
  try {
    const purchase = one<InwardPurchase>(
      db,
      "select * from inward_purchases where id=?",
      [purchaseId],
    );
    if (purchase.status === "Approved") return purchaseId;
    if (
      purchase.status !== "Awaiting PO Approval" ||
      !purchase.purchase_order_id
    )
      throw new Error("Only purchases awaiting PO approval can be approved.");
    db.run(
      "update purchase_orders set status='Sent',updated_at=datetime('now') where id=? and status='Draft'",
      [purchase.purchase_order_id],
    );
    db.run(
      "update inward_purchases set status='Approved',approved_by=?,approved_at=datetime('now'),updated_at=datetime('now') where id=?",
      [actorId, purchaseId],
    );
    insert(
      db,
      "insert into inward_purchase_events(purchase_id,kind,actor_id,at,note) values(?,?,?,datetime('now'),?)",
      [purchaseId, "approved", actorId, "PO authorized and sent"],
    );
    db.run("commit");
    return purchaseId;
  } catch (error) {
    db.run("rollback");
    throw error;
  }
}
```

## OP-db-receiveAndPostInwardPurchaseForActor

Source: src/db.ts:3573-3725

Dependencies: assertPurchaseActor, db.run, one, input.supplier_invoice_no?.trim, all, current.map, byPoLine.get, current.find, matchedPoLines.has, matchedPoLines.add, assertPurchaseLine, addPurchaseAttachments, submitPurchaseValidation, insert, movement, reconcilePurchaseOrder

```typescript
export function receiveAndPostInwardPurchaseForActor(
  db: Database,
  purchaseId: number,
  actorId: number,
  input: InwardPurchaseDraftInput = {},
) {
  assertPurchaseActor(db, actorId);
  db.run("begin immediate transaction");
  try {
    const purchase = one<InwardPurchase>(
      db,
      "select * from inward_purchases where id=?",
      [purchaseId],
    );
    if (purchase.status === "Received") return purchaseId;
    if (purchase.status !== "Approved" || !purchase.purchase_order_id)
      throw new Error("Only approved purchases can be received and posted.");
    if (
      input.supplier_invoice_no !== undefined ||
      input.invoice_date !== undefined
    )
      db.run(
        "update inward_purchases set supplier_invoice_no=?,invoice_date=?,updated_at=datetime('now') where id=?",
        [
          input.supplier_invoice_no?.trim() ?? purchase.supplier_invoice_no,
          input.invoice_date ?? purchase.invoice_date,
          purchaseId,
        ],
      );
    if (input.lines) {
      const current = all<InwardPurchaseLine>(
        db,
        "select * from inward_purchase_lines where purchase_id=?",
        [purchaseId],
      );
      if (current.length !== input.lines.length)
        throw new Error(
          "Receipt lines must exactly match the linked PO lines.",
        );
      const byPoLine = new Map(
        current.map((line) => [line.purchase_order_line_id, line]),
      );
      const matchedPoLines = new Set<number>();
      for (const line of input.lines) {
        const target = line.purchase_order_line_id
          ? byPoLine.get(line.purchase_order_line_id)
          : current.find((row) => row.item_id === line.item_id);
        if (
          !target ||
          !target.purchase_order_line_id ||
          matchedPoLines.has(target.purchase_order_line_id) ||
          target.item_id !== line.item_id ||
          byPoLine.get(target.purchase_order_line_id) !== target
        )
          throw new Error(
            "Receipt lines must exactly match the linked PO lines.",
          );
        matchedPoLines.add(target.purchase_order_line_id);
        const values = assertPurchaseLine(db, line);
        db.run(
          "update inward_purchase_lines set received_qty=?,unit_cost=?,discount=?,gst_rate=?,subtotal=?,gst_amount=?,total=? where id=?",
          [
            values.qty,
            values.unitCost,
            values.discount,
            values.gstRate,
            values.subtotal,
            values.gstAmount,
            values.total,
            target.id,
          ],
        );
      }
      if (matchedPoLines.size !== current.length)
        throw new Error(
          "Receipt lines must exactly match the linked PO lines.",
        );
    }
    if (input.attachments?.length)
      addPurchaseAttachments(db, purchaseId, actorId, input.attachments);
    const fresh = one<InwardPurchase>(
      db,
      "select * from inward_purchases where id=?",
      [purchaseId],
    );
    if (!fresh.purchase_order_id)
      throw new Error(
        "The approved purchase is missing its purchase order link.",
      );
    const lines = submitPurchaseValidation(db, fresh);
    for (const line of lines) {
      if (!line.purchase_order_line_id)
        throw new Error("Each receipt line must be linked to a PO line.");
      const poLine = one<PurchaseOrderLine>(
        db,
        "select * from purchase_order_lines where id=?",
        [line.purchase_order_line_id],
      );
      if (
        poLine.purchase_order_id !== fresh.purchase_order_id ||
        poLine.item_id !== line.item_id
      )
        throw new Error("Receipt line does not match its linked PO line.");
      const ledgerId = insert(
        db,
        "insert into stock_ledger(job_card_id,material_row_id,item_id,qty,type,by_user,at,note,inward_purchase_line_id) values(0,0,?,-?,'inward',?,datetime('now'),?,?)",
        [
          line.item_id,
          line.received_qty,
          actorId,
          `Inward receipt #${purchaseId} / ${fresh.supplier_invoice_no}`,
          line.id,
        ],
      );
      insert(
        db,
        "insert into stock_inwards(item_id,qty,note,purchase_order_id,purchase_order_line_id,ledger_id,received_by,received_at) values(?,?,?,?,?,?,?,datetime('now'))",
        [
          line.item_id,
          line.received_qty,
          `Inward receipt #${purchaseId}`,
          fresh.purchase_order_id,
          line.purchase_order_line_id,
          ledgerId,
          actorId,
        ],
      );
      movement(
        db,
        0,
        line.item_id,
        "INWARD_PURCHASE",
        line.received_qty,
        `Inward receipt #${purchaseId}`,
      );
    }
    reconcilePurchaseOrder(db, fresh.purchase_order_id);
    db.run(
      "update inward_purchases set status='Received',submitted_by=?,submitted_at=datetime('now'),updated_at=datetime('now') where id=?",
      [actorId, purchaseId],
    );
    insert(
      db,
      "insert into inward_purchase_events(purchase_id,kind,actor_id,at,note) values(?,?,?,datetime('now'),?)",
      [purchaseId, "received", actorId, "Posted linked PO receipt"],
    );
    db.run("commit");
    return purchaseId;
  } catch (error) {
    db.run("rollback");
    throw error;
  }
}
```

## OP-db-submitInwardPurchaseForActor

Source: src/db.ts:3728-3783

Dependencies: assertPurchaseActor, one, db.run, submitPurchaseValidation, movement, insert

```typescript
export function submitInwardPurchaseForActor(
  db: Database,
  purchaseId: number,
  actorId: number,
) {
  assertPurchaseActor(db, actorId);
  const existing = one<InwardPurchase>(
    db,
    "select * from inward_purchases where id=?",
    [purchaseId],
  );
  if (existing.status === "Submitted") return purchaseId;
  db.run("begin immediate transaction");
  try {
    const purchase = one<InwardPurchase>(
      db,
      "select * from inward_purchases where id=?",
      [purchaseId],
    );
    const lines = submitPurchaseValidation(db, purchase);
    db.run(
      "update inward_purchases set status='Submitted',submitted_by=?,submitted_at=datetime('now'),updated_at=datetime('now') where id=?",
      [actorId, purchaseId],
    );
    for (const line of lines) {
      db.run(
        "insert into stock_ledger(job_card_id,material_row_id,item_id,qty,type,by_user,at,note,inward_purchase_line_id) values(0,0,?,-?,'inward',?,datetime('now'),?,?)",
        [
          line.item_id,
          line.received_qty,
          actorId,
          `Inward receipt #${purchaseId} / ${purchase.supplier_invoice_no}`,
          line.id,
        ],
      );
      movement(
        db,
        0,
        line.item_id,
        "INWARD_PURCHASE",
        line.received_qty,
        `Inward receipt #${purchaseId}`,
      );
    }
    insert(
      db,
      "insert into inward_purchase_events(purchase_id,kind,actor_id,at,note) values(?,?,?,datetime('now'),?)",
      [purchaseId, "submitted", actorId, "Posted inbound ledger movements"],
    );
    db.run("commit");
    return purchaseId;
  } catch (error) {
    db.run("rollback");
    throw error;
  }
}
```

## OP-db-previousPurchaseHistoryForItem

Source: src/db.ts:3854-3872

Dependencies: Number.isInteger, Math.max, Math.min, Math.floor, all<PreviousPurchaseRecord>(
    db,
    `select supplier.name as supplier_name, purchase_order.order_date as purchase_date,
      line.unit_cost, line.ordered_qty as quantity
      from purchase_order_lines line
      join purchase_orders purchase_order on purchase_order.id=line.purchase_order_id
      left join suppliers supplier on supplier.id=purchase_order.supplier_id
      where line.item_id=? and purchase_order.status='Closed'
      order by purchase_order.order_date desc, purchase_order.id desc, line.id desc limit ${safeLimit}`,
    [itemId],
  ).map, all

```typescript
export function previousPurchaseHistoryForItem(
  db: Database,
  itemId: number,
  limit = 3,
): PreviousPurchaseRecord[] {
  if (!Number.isInteger(itemId) || itemId <= 0) return [];
  const safeLimit = Math.max(1, Math.min(10, Math.floor(limit)));
  return all<PreviousPurchaseRecord>(
    db,
    `select supplier.name as supplier_name, purchase_order.order_date as purchase_date,
      line.unit_cost, line.ordered_qty as quantity
      from purchase_order_lines line
      join purchase_orders purchase_order on purchase_order.id=line.purchase_order_id
      left join suppliers supplier on supplier.id=purchase_order.supplier_id
      where line.item_id=? and purchase_order.status='Closed'
      order by purchase_order.order_date desc, purchase_order.id desc, line.id desc limit ${safeLimit}`,
    [itemId],
  ).map((row) => ({ ...row, supplier_name: row.supplier_name || "Supplier unavailable" }));
}
```

## OP-db-savePurchaseOrderQuotationForActor

Source: src/db.ts:3874-3903

Dependencies: assertPurchaseActor, one, all, input.supplier_name?.trim, Number.isFinite, input.quote_date?.trim, new Date().toISOString().slice, new Date().toISOString, /^\d{4}-\d{2}-\d{2}$/.test, insert, input.notes?.trim

```typescript
export function savePurchaseOrderQuotationForActor(
  db: Database,
  purchaseOrderId: number,
  actorId: number,
  input: PurchaseOrderQuotationInput,
) {
  assertPurchaseActor(db, actorId, true);
  const order = one<PurchaseOrder>(db, "select * from purchase_orders where id=?", [purchaseOrderId]);
  if (order.status !== "PO Request")
    throw new Error("Quotations can only be recorded while a Purchase Request is under review.");
  const line = all<PurchaseOrderLine>(
    db,
    "select * from purchase_order_lines where id=? and purchase_order_id=?",
    [input.purchase_order_line_id, purchaseOrderId],
  )[0];
  if (!line) throw new Error("Select a line from this Purchase Request.");
  const supplierName = input.supplier_name?.trim();
  if (!supplierName) throw new Error("Supplier name is required for a quotation.");
  if (!Number.isFinite(input.quoted_qty) || input.quoted_qty <= 0)
    throw new Error("Quoted quantity must be greater than zero.");
  if (!Number.isFinite(input.unit_cost) || input.unit_cost < 0)
    throw new Error("Pre-GST unit price cannot be negative.");
  const quoteDate = input.quote_date?.trim() || new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(quoteDate)) throw new Error("A valid quotation date is required.");
  return insert(
    db,
    "insert into purchase_order_quotations(purchase_order_id,purchase_order_line_id,supplier_name,quote_date,quoted_qty,unit_cost,notes,created_by,created_at,updated_at) values(?,?,?,?,?,?,?,?,datetime('now'),datetime('now'))",
    [purchaseOrderId, input.purchase_order_line_id, supplierName, quoteDate, input.quoted_qty, input.unit_cost, input.notes?.trim() ?? "", actorId],
  );
}
```

## OP-db-purchaseRequestNumberForOrdinal

Source: src/db.ts:3905-3914

Dependencies: Math.floor, String.fromCharCode, String((ordinal % 99_999) + 1).padStart, String

```typescript
export function purchaseRequestNumberForOrdinal(ordinal: number) {
  let value = Math.floor(ordinal / 99_999) + 1;
  let letters = "";
  while (value > 0) {
    value -= 1;
    letters = String.fromCharCode(65 + (value % 26)) + letters;
    value = Math.floor(value / 26);
  }
  return `PO-WOS-${letters}-${String((ordinal % 99_999) + 1).padStart(5, "0")}`;
}
```

## OP-db-purchaseRequestOrdinal

Source: src/db.ts:3916-3925

Dependencies: /^PO-WOS-([A-Z]+)-(\d{5})$/.exec, [...match[1]].reduce, letter.charCodeAt, Number

```typescript
export function purchaseRequestOrdinal(poNumber: string) {
  const match = /^PO-WOS-([A-Z]+)-(\d{5})$/.exec(poNumber);
  if (!match) return -1;
  const letters = [...match[1]].reduce(
    (value, letter) => value * 26 + letter.charCodeAt(0) - 64,
    0,
  );
  const serial = Number(match[2]);
  return (letters - 1) * 99_999 + serial - 1;
}
```

## OP-db-nextPurchaseRequestNumberForOrders

Source: src/db.ts:3927-3935

Dependencies: orders.reduce, Math.max, purchaseRequestOrdinal, purchaseRequestNumberForOrdinal

```typescript
export function nextPurchaseRequestNumberForOrders(
  orders: readonly Pick<PurchaseOrder, "po_number">[],
) {
  const latest = orders.reduce(
    (max, order) => Math.max(max, purchaseRequestOrdinal(order.po_number)),
    -1,
  );
  return purchaseRequestNumberForOrdinal(latest + 1);
}
```

## OP-db-createPurchaseRequestForActor

Source: src/db.ts:4009-4030

Dependencies: assertPurchaseActor, assertPurchaseRequestInput, db.run, insert, nextPurchaseRequestNumber, input.notes?.trim, replacePurchaseRequestLines

```typescript
export function createPurchaseRequestForActor(
  db: Database,
  actorId: number,
  input: PurchaseRequestInput,
) {
  const actor = assertPurchaseActor(db, actorId);
  assertPurchaseRequestInput(db, input);
  db.run("begin immediate transaction");
  try {
    const id = insert(
      db,
      "insert into purchase_orders(supplier_id,po_number,order_date,notes,status,created_by,created_at,updated_at) values(?,?,?,?, 'PO Request',?,datetime('now'),datetime('now'))",
      [0, nextPurchaseRequestNumber(db), input.order_date, input.notes?.trim() ?? "", actor.id],
    );
    replacePurchaseRequestLines(db, id, input.lines);
    db.run("commit");
    return id;
  } catch (error) {
    db.run("rollback");
    throw error;
  }
}
```

## OP-db-updatePurchaseRequestForActor

Source: src/db.ts:4033-4053

Dependencies: assertMutablePurchaseRequestAccess, assertPurchaseRequestInput, db.run, input.notes?.trim, replacePurchaseRequestLines

```typescript
export function updatePurchaseRequestForActor(
  db: Database,
  id: number,
  actorId: number,
  input: PurchaseRequestInput,
) {
  assertMutablePurchaseRequestAccess(db, id, actorId);
  assertPurchaseRequestInput(db, input);
  db.run("begin immediate transaction");
  try {
    db.run(
      "update purchase_orders set order_date=?,notes=?,updated_at=datetime('now') where id=?",
      [input.order_date, input.notes?.trim() ?? "", id],
    );
    replacePurchaseRequestLines(db, id, input.lines);
    db.run("commit");
  } catch (error) {
    db.run("rollback");
    throw error;
  }
}
```

## OP-db-cancelPurchaseRequestForActor

Source: src/db.ts:4055-4065

Dependencies: assertMutablePurchaseRequestAccess, db.run

```typescript
export function cancelPurchaseRequestForActor(
  db: Database,
  id: number,
  actorId: number,
) {
  assertMutablePurchaseRequestAccess(db, id, actorId);
  db.run(
    "update purchase_orders set status='Cancelled',updated_at=datetime('now') where id=?",
    [id],
  );
}
```

## OP-db-approvePurchaseRequestForActor

Source: src/db.ts:4073-4165

Dependencies: assertPurchaseActor, one, all, input.lines.map, requestLines.some, byId.has, byId.get, maybe, Number.isFinite, item.sku.trim, item.category.trim, item.name.trim, item.unit.trim, item.sku.trim().toUpperCase, suppliedSkus.has, suppliedSkus.add, db.run, requestLines.map, createInventoryItem, groups.get, group.push, groups.set, [...groups.values()].sort, groups.values, totalsForPurchaseLine, insert, firstGroup.map, [...retained].map(() => "?").join, [...retained].map, firstGroup.reduce, writeLine, supplierGroups.slice, nextPurchaseRequestNumber, group.reduce, approvedIds.push

```typescript
export function approvePurchaseRequestForActor(
  db: Database,
  purchaseOrderId: number,
  actorId: number,
  input: PurchaseRequestApprovalInput,
) {
  assertPurchaseActor(db, actorId, true);
  const order = one<PurchaseOrder>(
    db,
    "select * from purchase_orders where id=?",
    [purchaseOrderId],
  );
  if (order.status !== "PO Request")
    throw new Error("Only Purchase Requests under review can be approved.");
  const requestLines = all<PurchaseOrderLine>(
    db,
    "select * from purchase_order_lines where purchase_order_id=? order by id",
    [purchaseOrderId],
  );
  if (!input.lines?.length || input.lines.length !== requestLines.length)
    throw new Error("Approval needs a supplier and pre-GST price for every requested line.");
  const byId = new Map(input.lines.map((line) => [line.purchase_order_line_id, line]));
  if (byId.size !== requestLines.length || requestLines.some((line) => !byId.has(line.id)))
    throw new Error("Approval must cover every requested line exactly once.");
  const suppliedSkus = new Set<string>();
  for (const requestLine of requestLines) {
    const line = byId.get(requestLine.id)!;
    const supplier = maybe<Supplier>(db, "select * from suppliers where id=?", [line.supplier_id]);
    if (!supplier || supplier.status !== "Active")
      throw new Error("Select an active supplier for every requested line.");
    if (!Number.isFinite(line.unit_cost) || line.unit_cost <= 0)
      throw new Error("Enter a pre-GST unit price greater than zero for every requested line.");
    if (requestLine.item_id !== 0) continue;
    const item = line.inventory_item;
    if (!item || !item.sku.trim() || !item.category.trim() || !item.name.trim() || !item.unit.trim())
      throw new Error(`Complete SKU, category, name, and unit for New Item Request \"${requestLine.item_name}\".`);
    if (!Number.isFinite(item.low_stock_qty) || item.low_stock_qty < 0 || !Number.isFinite(item.selling_price) || item.selling_price < 0)
      throw new Error("New Item SKU stock threshold and selling price cannot be negative.");
    const sku = item.sku.trim().toUpperCase();
    if (suppliedSkus.has(sku) || maybe<InventoryItem>(db, "select * from inventory where upper(sku)=?", [sku]))
      throw new Error(`SKU ${sku} already exists in inventory.`);
    suppliedSkus.add(sku);
  }

  db.run("begin immediate transaction");
  try {
    const resolved = requestLines.map((requestLine) => {
      const approval = byId.get(requestLine.id)!;
      let itemId = requestLine.item_id;
      if (itemId === 0) {
        const item = approval.inventory_item!;
        itemId = createInventoryItem(db, {
          sku: item.sku.trim().toUpperCase(), category: item.category.trim(), name: item.name.trim(),
          unit: item.unit.trim(), stock_qty: 0, low_stock_qty: item.low_stock_qty, selling_price: item.selling_price,
        });
      }
      return { requestLine, approval, itemId };
    });
    const groups = new Map<number, typeof resolved>();
    for (const entry of resolved) {
      const group = groups.get(entry.approval.supplier_id) ?? [];
      group.push(entry);
      groups.set(entry.approval.supplier_id, group);
    }
    const supplierGroups = [...groups.values()].sort((left, right) => left[0].requestLine.id - right[0].requestLine.id);
    const writeLine = (targetOrderId: number, entry: typeof resolved[number], sourceLineId: number | null) => {
      const values = totalsForPurchaseLine({ item_id: entry.itemId, received_qty: entry.requestLine.ordered_qty, unit_cost: entry.approval.unit_cost, discount: 0, gst_rate: 0 });
      if (sourceLineId === null) {
        db.run("update purchase_order_lines set item_id=?,unit_cost=?,discount=0,gst_rate=0,subtotal=?,gst_amount=?,total=? where id=?", [entry.itemId, values.unitCost, values.subtotal, values.gstAmount, values.total, entry.requestLine.id]);
      } else {
        insert(db, "insert into purchase_order_lines(purchase_order_id,item_id,item_name,unit,ordered_qty,unit_cost,discount,gst_rate,subtotal,gst_amount,total,source_purchase_order_line_id) values(?,?,?,?,?,?,?,?,?,?,?,?)", [targetOrderId, entry.itemId, entry.requestLine.item_name, entry.requestLine.unit, entry.requestLine.ordered_qty, values.unitCost, 0, 0, values.subtotal, values.gstAmount, values.total, sourceLineId]);
      }
      return values.total;
    };
    const firstGroup = supplierGroups[0];
    const retained = new Set(firstGroup.map((entry) => entry.requestLine.id));
    db.run(`delete from purchase_order_lines where purchase_order_id=? and id not in (${[...retained].map(() => "?").join(",")})`, [purchaseOrderId, ...retained]);
    const firstTotal = firstGroup.reduce((total, entry) => total + writeLine(purchaseOrderId, entry, null), 0);
    db.run("update purchase_orders set supplier_id=?,status='PO Request Approved',subtotal=?,discount_total=0,gst_total=0,total=?,updated_at=datetime('now') where id=?", [firstGroup[0].approval.supplier_id, firstTotal, firstTotal, purchaseOrderId]);
    const approvedIds = [purchaseOrderId];
    for (const group of supplierGroups.slice(1)) {
      const childId = insert(db, "insert into purchase_orders(supplier_id,po_number,order_date,notes,status,subtotal,discount_total,gst_total,total,created_by,created_at,updated_at,source_purchase_order_id) values(?,?,?,?,'PO Request Approved',0,0,0,0,?,datetime('now'),datetime('now'),?)", [group[0].approval.supplier_id, nextPurchaseRequestNumber(db), order.order_date, `Split from ${order.po_number}${order.notes ? ` · ${order.notes}` : ""}`, order.created_by, purchaseOrderId]);
      const childTotal = group.reduce((total, entry) => total + writeLine(childId, entry, entry.requestLine.id), 0);
      db.run("update purchase_orders set subtotal=?,total=? where id=?", [childTotal, childTotal, childId]);
      approvedIds.push(childId);
    }
    db.run("commit");
    return approvedIds;
  } catch (error) {
    db.run("rollback");
    throw error;
  }
}
```

## OP-db-issuePurchaseOrderForActor

Source: src/db.ts:4171-4206

Dependencies: assertPurchaseActor, one, maybe, all, lines.some, db.run

```typescript
export function issuePurchaseOrderForActor(
  db: Database,
  purchaseOrderId: number,
  actorId: number,
) {
  assertPurchaseActor(db, actorId, true);
  const order = one<PurchaseOrder>(
    db,
    "select * from purchase_orders where id=?",
    [purchaseOrderId],
  );
  if (order.status !== "PO Request Approved")
    throw new Error(
      "A Purchase Order can only be issued after it is fully approved.",
    );
  const supplier = maybe<Supplier>(
    db,
    "select * from suppliers where id=?",
    [order.supplier_id],
  );
  if (!supplier || supplier.status !== "Active")
    throw new Error("Assign an active supplier before issuing this Purchase Order.");
  const lines = all<PurchaseOrderLine>(
    db,
    "select * from purchase_order_lines where purchase_order_id=?",
    [purchaseOrderId],
  );
  if (!lines.length || lines.some((line) => line.item_id <= 0 || line.ordered_qty <= 0 || line.unit_cost <= 0))
    throw new Error(
      "Complete every item, quantity, and pre-GST price before issuing this Purchase Order.",
    );
  db.run(
    "update purchase_orders set status='PO Issued',updated_at=datetime('now') where id=?",
    [purchaseOrderId],
  );
}
```

## OP-db-recordPurchaseOrderReceiptForActor

Source: src/db.ts:4214-4250

Dependencies: assertPurchaseActor, one, ["PO Issued", "PO Received"].includes, all, input.lines.map, input.lines.some, Number.isFinite, orderLines.some, requested.get, scalar, db.run, insert, input.note?.trim

```typescript
export function recordPurchaseOrderReceiptForActor(
  db: Database,
  purchaseOrderId: number,
  actorId: number,
  input: PurchaseOrderReceiptInput,
) {
  assertPurchaseActor(db, actorId, true);
  const order = one<PurchaseOrder>(db, "select * from purchase_orders where id=?", [purchaseOrderId]);
  if (!["PO Issued", "PO Received"].includes(order.status))
    throw new Error("Deliveries can only be recorded for an issued or received Purchase Order.");
  if (!input.lines?.length) throw new Error("Record at least one delivered quantity.");
  const orderLines = all<PurchaseOrderLine>(db, "select * from purchase_order_lines where purchase_order_id=?", [purchaseOrderId]);
  const requested = new Map(input.lines.map((line) => [line.purchase_order_line_id, line]));
  if (requested.size !== input.lines.length || input.lines.some((line) => !Number.isFinite(line.delivered_qty) || line.delivered_qty <= 0))
    throw new Error("Each delivered quantity must be greater than zero.");
  if (input.lines.some((line) => !orderLines.some((orderLine) => orderLine.id === line.purchase_order_line_id)))
    throw new Error("Every delivery line must belong to this Purchase Order.");
  for (const line of orderLines) {
    const deliveredNow = requested.get(line.id)?.delivered_qty ?? 0;
    if (!deliveredNow) continue;
    const deliveredBefore = scalar<number>(db, `select coalesce(sum(receipt_line.delivered_qty),0) from purchase_order_receipt_lines receipt_line join purchase_order_receipts receipt on receipt.id=receipt_line.purchase_order_receipt_id where receipt.purchase_order_id=? and receipt_line.purchase_order_line_id=?`, [purchaseOrderId, line.id]);
    if (deliveredBefore + deliveredNow > line.ordered_qty)
      throw new Error("Delivered quantity cannot exceed the ordered quantity.");
  }
  db.run("begin immediate transaction");
  try {
    const receiptId = insert(db, "insert into purchase_order_receipts(purchase_order_id,received_by,received_at,note) values(?,?,datetime('now'),?)", [purchaseOrderId, actorId, input.note?.trim() ?? ""]);
    for (const line of input.lines)
      insert(db, "insert into purchase_order_receipt_lines(purchase_order_receipt_id,purchase_order_line_id,delivered_qty) values(?,?,?)", [receiptId, line.purchase_order_line_id, line.delivered_qty]);
    db.run("update purchase_orders set status='PO Received',updated_at=datetime('now') where id=?", [purchaseOrderId]);
    db.run("commit");
    return receiptId;
  } catch (error) {
    db.run("rollback");
    throw error;
  }
}
```

## OP-db-confirmPurchaseOrderForActor

Source: src/db.ts:4257-4290

Dependencies: assertPurchaseActor, one, all, input.lines?.map, orderLines.some, confirmations.has, scalar, confirmations.get, quantities.some, Number.isFinite, quantities.reduce, db.run, insert

```typescript
export function confirmPurchaseOrderForActor(
  db: Database,
  purchaseOrderId: number,
  actorId: number,
  input: PurchaseOrderConfirmationInput,
) {
  assertPurchaseActor(db, actorId, true);
  const order = one<PurchaseOrder>(db, "select * from purchase_orders where id=?", [purchaseOrderId]);
  if (order.status !== "PO Received") throw new Error("Only a received Purchase Order can be confirmed.");
  const orderLines = all<PurchaseOrderLine>(db, "select * from purchase_order_lines where purchase_order_id=? order by id", [purchaseOrderId]);
  const confirmations = new Map(input.lines?.map((line) => [line.purchase_order_line_id, line]) ?? []);
  if (confirmations.size !== input.lines.length || confirmations.size !== orderLines.length || orderLines.some((line) => !confirmations.has(line.id)))
    throw new Error("Confirmation must account for every Purchase Order line.");
  for (const line of orderLines) {
    const delivery = scalar<number>(db, `select coalesce(sum(receipt_line.delivered_qty),0) from purchase_order_receipt_lines receipt_line join purchase_order_receipts receipt on receipt.id=receipt_line.purchase_order_receipt_id where receipt.purchase_order_id=? and receipt_line.purchase_order_line_id=?`, [purchaseOrderId, line.id]);
    const confirmation = confirmations.get(line.id)!;
    const quantities = [confirmation.accepted_qty, confirmation.returned_qty, confirmation.damaged_qty, confirmation.wasted_qty];
    if (quantities.some((quantity) => !Number.isFinite(quantity) || quantity < 0)) throw new Error("Confirmation quantities cannot be negative.");
    if (quantities.reduce((sum, quantity) => sum + quantity, 0) !== delivery)
      throw new Error("Accepted, returned, damaged, and wasted quantities must equal the delivered quantity.");
  }
  db.run("begin immediate transaction");
  try {
    for (const line of orderLines) {
      const confirmation = confirmations.get(line.id)!;
      insert(db, "insert into purchase_order_confirmations(purchase_order_id,purchase_order_line_id,accepted_qty,returned_qty,damaged_qty,wasted_qty,confirmed_by,confirmed_at) values(?,?,?,?,?,?,?,datetime('now'))", [purchaseOrderId, line.id, confirmation.accepted_qty, confirmation.returned_qty, confirmation.damaged_qty, confirmation.wasted_qty, actorId]);
    }
    db.run("update purchase_orders set status='PO Confirmation',updated_at=datetime('now') where id=?", [purchaseOrderId]);
    db.run("commit");
  } catch (error) {
    db.run("rollback");
    throw error;
  }
}
```

## OP-db-closePurchaseOrderForActor

Source: src/db.ts:4297-4370

Dependencies: assertPurchaseActor, db.run, one, all<{ id: number }>(
        db,
        "select id from stock_inwards where purchase_order_id=? order by id",
        [purchaseOrderId],
      ).map, all, confirmations.map, lines.some, confirmationForLine.has, confirmationForLine.get, insert, movement, inwardIds.push

```typescript
export function closePurchaseOrderForActor(
  db: Database,
  purchaseOrderId: number,
  actorId: number,
) {
  assertPurchaseActor(db, actorId, true);
  db.run("begin immediate transaction");
  try {
    const order = one<PurchaseOrder>(
      db,
      "select * from purchase_orders where id=?",
      [purchaseOrderId],
    );
    if (order.status === "Closed") {
      const inwardIds = all<{ id: number }>(
        db,
        "select id from stock_inwards where purchase_order_id=? order by id",
        [purchaseOrderId],
      ).map((inward) => inward.id);
      db.run("commit");
      return inwardIds;
    }
    if (order.status !== "PO Confirmation")
      throw new Error("Only a fully confirmed Purchase Order can be closed.");

    const lines = all<PurchaseOrderLine>(
      db,
      "select * from purchase_order_lines where purchase_order_id=? order by id",
      [purchaseOrderId],
    );
    const confirmations = all<PurchaseOrderConfirmation>(
      db,
      "select * from purchase_order_confirmations where purchase_order_id=? order by purchase_order_line_id",
      [purchaseOrderId],
    );
    const confirmationForLine = new Map(
      confirmations.map((confirmation) => [confirmation.purchase_order_line_id, confirmation]),
    );
    if (
      !lines.length ||
      confirmations.length !== lines.length ||
      lines.some((line) => !confirmationForLine.has(line.id))
    )
      throw new Error("Every Purchase Order line must be confirmed before closure.");

    const inwardIds: number[] = [];
    for (const line of lines) {
      const acceptedQty = confirmationForLine.get(line.id)!.accepted_qty;
      if (acceptedQty <= 0) continue;
      const note = `Accepted on PO closure: ${order.po_number}`;
      const ledgerId = insert(
        db,
        "insert into stock_ledger(job_card_id,material_row_id,item_id,qty,type,by_user,at,note) values(0,0,?,-?,'po-closure-inward',?,datetime('now'),?)",
        [line.item_id, acceptedQty, actorId, note],
      );
      const inwardId = insert(
        db,
        "insert into stock_inwards(item_id,qty,note,purchase_order_id,purchase_order_line_id,ledger_id,received_by,received_at) values(?,?,?,?,?,?,?,datetime('now'))",
        [line.item_id, acceptedQty, note, purchaseOrderId, line.id, ledgerId, actorId],
      );
      movement(db, 0, line.item_id, "STOCK_IN", acceptedQty, note);
      inwardIds.push(inwardId);
    }
    db.run(
      "update purchase_orders set status='Closed',updated_at=datetime('now') where id=?",
      [purchaseOrderId],
    );
    db.run("commit");
    return inwardIds;
  } catch (error) {
    db.run("rollback");
    throw error;
  }
}
```

## OP-db-createPurchaseOrderForActor

Source: src/db.ts:4428-4448

Dependencies: assertPurchaseActor, assertPurchaseOrderInput, insert, input.po_number.trim, input.notes?.trim, replacePurchaseOrderLines

```typescript
export function createPurchaseOrderForActor(
  db: Database,
  actorId: number,
  input: PurchaseOrderInput,
) {
  assertPurchaseActor(db, actorId, true);
  assertPurchaseOrderInput(db, input);
  const id = insert(
    db,
    "insert into purchase_orders(supplier_id,po_number,order_date,notes,status,created_by,created_at,updated_at) values(?,?,?,?, 'Draft',?,datetime('now'),datetime('now'))",
    [
      input.supplier_id,
      input.po_number.trim(),
      input.order_date,
      input.notes?.trim() ?? "",
      actorId,
    ],
  );
  replacePurchaseOrderLines(db, id, input.lines);
  return id;
}
```

## OP-db-updatePurchaseOrderForActor

Source: src/db.ts:4449-4475

Dependencies: assertPurchaseActor, assertPurchaseOrderInput, one, db.run, input.po_number.trim, input.notes?.trim, replacePurchaseOrderLines

```typescript
export function updatePurchaseOrderForActor(
  db: Database,
  id: number,
  actorId: number,
  input: PurchaseOrderInput,
) {
  assertPurchaseActor(db, actorId, true);
  assertPurchaseOrderInput(db, input);
  const order = one<PurchaseOrder>(
    db,
    "select * from purchase_orders where id=?",
    [id],
  );
  if (order.status !== "Draft")
    throw new Error("Only draft purchase orders can be edited.");
  db.run(
    "update purchase_orders set supplier_id=?,po_number=?,order_date=?,notes=?,updated_at=datetime('now') where id=?",
    [
      input.supplier_id,
      input.po_number.trim(),
      input.order_date,
      input.notes?.trim() ?? "",
      id,
    ],
  );
  replacePurchaseOrderLines(db, id, input.lines);
}
```

## OP-db-setPurchaseOrderStatusForActor

Source: src/db.ts:4476-4512

Dependencies: assertPurchaseActor, one, db.run, ["Draft", "Sent", "Partially Received", "Ready to Close"].includes, ["Partially Received", "Ready to Close", "Sent"].includes

```typescript
export function setPurchaseOrderStatusForActor(
  db: Database,
  id: number,
  actorId: number,
  action: "send" | "cancel" | "close",
) {
  assertPurchaseActor(db, actorId, true);
  const order = one<PurchaseOrder>(
    db,
    "select * from purchase_orders where id=?",
    [id],
  );
  if (action === "send" && order.status === "Draft")
    db.run(
      "update purchase_orders set status='Sent',updated_at=datetime('now') where id=?",
      [id],
    );
  else if (
    action === "cancel" &&
    ["Draft", "Sent", "Partially Received", "Ready to Close"].includes(
      order.status,
    )
  )
    db.run(
      "update purchase_orders set status='Cancelled',updated_at=datetime('now') where id=?",
      [id],
    );
  else if (
    action === "close" &&
    ["Partially Received", "Ready to Close", "Sent"].includes(order.status)
  )
    db.run(
      "update purchase_orders set status='Closed',updated_at=datetime('now') where id=?",
      [id],
    );
  else throw new Error(`Cannot ${action} a ${order.status} purchase order.`);
}
```

## OP-db-recordStockInwardForActor

Source: src/db.ts:4553-4624

Dependencies: assertPurchaseActor, Number.isFinite, one, db.run, ["Draft", "Cancelled", "Closed"].includes, order.status.startsWith, input.note?.trim, insert, movement, reconcilePurchaseOrder

```typescript
export function recordStockInwardForActor(
  db: Database,
  actorId: number,
  input: {
    item_id: number;
    qty: number;
    note?: string;
    purchase_order_line_id?: number;
  },
) {
  assertPurchaseActor(db, actorId);
  if (!Number.isFinite(input.qty) || input.qty <= 0)
    throw new Error("Inward quantity must be greater than zero.");
  one<InventoryItem>(
    db,
    "select * from inventory where id=? and archived_at is null",
    [input.item_id],
  );
  db.run("begin immediate transaction");
  try {
    let orderId: number | null = null;
    if (input.purchase_order_line_id) {
      const line = one<PurchaseOrderLine>(
        db,
        "select * from purchase_order_lines where id=?",
        [input.purchase_order_line_id],
      );
      if (line.item_id !== input.item_id)
        throw new Error(
          "The selected PO line is for a different inventory item.",
        );
      const order = one<PurchaseOrder>(
        db,
        "select * from purchase_orders where id=?",
        [line.purchase_order_id],
      );
      if (["Draft", "Cancelled", "Closed"].includes(order.status))
        throw new Error("Select an open purchase order line.");
      if (order.status.startsWith("PO "))
        throw new Error(
          "Purchase Order Stock Inward is posted automatically when the confirmed PO closes.",
        );
      orderId = order.id;
    }
    const note = input.note?.trim() || "Stock inward";
    const ledgerId = insert(
      db,
      "insert into stock_ledger(job_card_id,material_row_id,item_id,qty,type,by_user,at,note) values(0,0,?,-?,'manual-inward',?,datetime('now'),?)",
      [input.item_id, input.qty, actorId, note],
    );
    const inwardId = insert(
      db,
      "insert into stock_inwards(item_id,qty,note,purchase_order_id,purchase_order_line_id,ledger_id,received_by,received_at) values(?,?,?,?,?,?,?,datetime('now'))",
      [
        input.item_id,
        input.qty,
        note,
        orderId,
        input.purchase_order_line_id ?? null,
        ledgerId,
        actorId,
      ],
    );
    movement(db, 0, input.item_id, "STOCK_IN", input.qty, note);
    if (orderId) reconcilePurchaseOrder(db, orderId);
    db.run("commit");
    return inwardId;
  } catch (error) {
    db.run("rollback");
    throw error;
  }
}
```

## OP-db-reviseInwardPurchaseForActor

Source: src/db.ts:4627-4737

Dependencies: assertPurchaseActor, input.reason?.trim, one, ["Submitted", "Received"].includes, db.run, input.lines.forEach, assertPurchaseLine, scalar, insert, input.reason.trim, maybe, all, priorLines.map, nextByItem.set, nextByItem.get, Number, totalsForPurchaseLine, previousByItem.keys, nextByItem.keys, previousByItem.get, movement

```typescript
export function reviseInwardPurchaseForActor(
  db: Database,
  purchaseId: number,
  actorId: number,
  input: InwardPurchaseRevisionInput,
) {
  assertPurchaseActor(db, actorId, true);
  if (!input.reason?.trim())
    throw new Error("A correction reason is required.");
  const purchase = one<InwardPurchase>(
    db,
    "select * from inward_purchases where id=?",
    [purchaseId],
  );
  if (!["Submitted", "Received"].includes(purchase.status))
    throw new Error("Only received purchases can be revised.");
  if (!input.lines.length)
    throw new Error("A revision requires one or more inventory lines.");
  db.run("begin immediate transaction");
  try {
    input.lines.forEach((line) => assertPurchaseLine(db, line));
    const revisionNo = scalar<number>(
      db,
      "select coalesce(max(revision_no),0)+1 from inward_purchase_revisions where purchase_id=?",
      [purchaseId],
    );
    const revisionId = insert(
      db,
      "insert into inward_purchase_revisions(purchase_id,revision_no,reason,revised_by,revised_at) values(?,?,?,?,datetime('now'))",
      [purchaseId, revisionNo, input.reason.trim(), actorId],
    );
    const priorRevision = maybe<{ id: number }>(
      db,
      "select id from inward_purchase_revisions where purchase_id=? and id<>? order by revision_no desc limit 1",
      [purchaseId, revisionId],
    );
    const priorLines = priorRevision
      ? all<InwardPurchaseLine>(
          db,
          "select item_id,received_qty,unit_cost,discount,gst_rate,subtotal,gst_amount,total,0 as id,0 as purchase_id from inward_purchase_revision_lines where revision_id=?",
          [priorRevision.id],
        )
      : all<InwardPurchaseLine>(
          db,
          "select * from inward_purchase_lines where purchase_id=?",
          [purchaseId],
        );
    const previousByItem = new Map(
      priorLines.map((line) => [line.item_id, line.received_qty]),
    );
    const nextByItem = new Map<number, number>();
    for (const line of input.lines)
      nextByItem.set(
        line.item_id,
        (nextByItem.get(line.item_id) ?? 0) + Number(line.received_qty),
      );
    for (const line of input.lines) {
      const values = totalsForPurchaseLine(line);
      insert(
        db,
        "insert into inward_purchase_revision_lines(revision_id,item_id,received_qty,unit_cost,discount,gst_rate,subtotal,gst_amount,total) values(?,?,?,?,?,?,?,?,?)",
        [
          revisionId,
          line.item_id,
          values.qty,
          values.unitCost,
          values.discount,
          values.gstRate,
          values.subtotal,
          values.gstAmount,
          values.total,
        ],
      );
    }
    for (const itemId of new Set([
      ...previousByItem.keys(),
      ...nextByItem.keys(),
    ])) {
      const delta =
        (nextByItem.get(itemId) ?? 0) - (previousByItem.get(itemId) ?? 0);
      if (!delta) continue;
      db.run(
        "insert into stock_ledger(job_card_id,material_row_id,item_id,qty,type,by_user,at,note,inward_purchase_line_id) values(0,0,?,-?,'inward-revision',?,datetime('now'),?,null)",
        [
          itemId,
          delta,
          actorId,
          `Inward receipt #${purchaseId} revision ${revisionNo}: ${input.reason.trim()}`,
        ],
      );
      movement(
        db,
        0,
        itemId,
        "INWARD_REVISION",
        delta,
        `Inward receipt #${purchaseId} revision ${revisionNo}`,
      );
    }
    insert(
      db,
      "insert into inward_purchase_events(purchase_id,kind,actor_id,at,note) values(?,?,?,datetime('now'),?)",
      [purchaseId, "revised", actorId, input.reason.trim()],
    );
    db.run("commit");
    return revisionId;
  } catch (error) {
    db.run("rollback");
    throw error;
  }
}
```

## OP-db-issueMaterialQty

Source: src/db.ts:4739-4781

Dependencies: one, approvalBlocksMaterialOperations, materialApprovalForJob, materialStockOnHand, db.run, ledger, movement, reconcileArtifactChecklist

```typescript
export function issueMaterialQty(db: Database, requestId: number, qty: number) {
  const request = one<MaterialRequest>(
    db,
    "select * from material_requests where id=?",
    [requestId],
  );
  const job = one<JobCard>(db, "select * from job_cards where id=?", [
    request.job_card_id,
  ]);
  if (
    job.main_status !== "IN_PROGRESS" ||
    approvalBlocksMaterialOperations(materialApprovalForJob(db, job.id))
  )
    throw new Error(
      "Material issue requires an IN_PROGRESS job with no pending or rejected approval.",
    );
  const onHand = materialStockOnHand(db, request.item_id);
  if (qty <= 0 || qty > onHand)
    throw new Error(`Cannot issue ${qty}; stock available is ${onHand}`);
  db.run(
    "update material_requests set issued_qty=issued_qty + ?, status=case when issued_qty + ? >= requested_qty then 'Issued' else status end, updated_at=datetime('now') where id=?",
    [qty, qty, requestId],
  );
  ledger(
    db,
    request.job_card_id,
    requestId,
    request.item_id,
    qty,
    "issue",
    0,
    "Issued to job",
  );
  movement(
    db,
    request.job_card_id,
    request.item_id,
    "ISSUE",
    qty,
    "Issued to job",
  );
  reconcileArtifactChecklist(db, request.job_card_id);
}
```

## OP-db-issueMaterial

Source: src/db.ts:4783-4794

Dependencies: one, issueMaterialQty, Math.max

```typescript
export function issueMaterial(db: Database, requestId: number) {
  const request = one<MaterialRequest>(
    db,
    "select * from material_requests where id=?",
    [requestId],
  );
  issueMaterialQty(
    db,
    requestId,
    Math.max(0, request.requested_qty - request.issued_qty),
  );
}
```

## OP-db-reconcileMaterialQty

Source: src/db.ts:4796-4853

Dependencies: one, quantities.some, Number.isFinite, db.run, movement, auditEvidence

```typescript
export function reconcileMaterialQty(
  db: Database,
  requestId: number,
  used: number,
  returned: number,
  wasted: number,
) {
  const request = one<MaterialRequest>(
    db,
    "select * from material_requests where id=?",
    [requestId],
  );
  const quantities = [used, returned, wasted];
  if (quantities.some((quantity) => !Number.isFinite(quantity) || quantity < 0))
    throw new Error(
      "Reconciliation quantities must be finite, non-negative numbers.",
    );
  if (used + returned + wasted > request.issued_qty)
    throw new Error(
      `Reconciliation total cannot exceed the ${request.issued_qty} issued.`,
    );
  db.run(
    "update material_requests set used_qty=?, returned_qty=?, wasted_qty=?, updated_at=datetime('now') where id=?",
    [used, returned, wasted, requestId],
  );
  const returnDelta = returned - request.returned_qty;
  if (returnDelta !== 0) {
    const note =
      returnDelta > 0
        ? "Returned after job reconciliation"
        : "Return reduced after job reconciliation";
    db.run(
      "insert into stock_ledger(job_card_id,material_row_id,item_id,qty,type,by_user,at,note) values(?,?,?,?,'return-adjustment',0,datetime('now'),?)",
      [request.job_card_id, requestId, request.item_id, -returnDelta, note],
    );
    movement(
      db,
      request.job_card_id,
      request.item_id,
      "RETURN",
      returnDelta,
      note,
    );
  }
  const wasteDelta = wasted - request.wasted_qty;
  if (wasteDelta !== 0)
    movement(
      db,
      request.job_card_id,
      request.item_id,
      "WASTAGE",
      wasteDelta,
      wasteDelta > 0
        ? "Recorded wastage"
        : "Wastage reduced after job reconciliation",
    );
  auditEvidence(db, request.job_card_id, "Material reconciled");
}
```

## OP-db-reconcileMaterial

Source: src/db.ts:4855-4863

Dependencies: reconcileMaterialQty

```typescript
export function reconcileMaterial(
  db: Database,
  requestId: number,
  used: number,
  returned: number,
  wasted: number,
) {
  reconcileMaterialQty(db, requestId, used, returned, wasted);
}
```

## OP-db-approvalBlocksMaterialOperations

Source: src/db.ts:4884-4888

Dependencies: 

```typescript
export function approvalBlocksMaterialOperations(
  approval?: Pick<MaterialApproval, "status"> | null,
) {
  return approval?.status === "Pending" || approval?.status === "Rejected";
}
```

## OP-db-submitMaterialApprovalForActor

Source: src/db.ts:4921-4970

Dependencies: actorAndJob, ["Requested", "Re-requested"].includes, materialRowStatus, materialApprovalForJob, insert, one, approvalEvent, transitionJobStatusInternal

```typescript
export function submitMaterialApprovalForActor(
  db: Database,
  rowId: number,
  actorId: number,
) {
  const { row, actor, job } = actorAndJob(db, rowId, actorId);
  if (actor.role !== "store")
    throw new Error("Only Store can submit a material approval.");
  if (
    row.invoiced_in ||
    !["Requested", "Re-requested"].includes(materialRowStatus(row))
  )
    throw new Error(
      "Only non-invoiced Requested or Re-requested material can be submitted for approval.",
    );
  const existing = materialApprovalForJob(db, job.id);
  if (existing?.status === "Pending") return existing.id;
  if (job.main_status !== "IN_PROGRESS")
    throw new Error(
      "Material approval can only be submitted for an IN_PROGRESS job.",
    );
  if (existing)
    throw new Error(
      "The rejected approval must be corrected and resubmitted by the linked Service Advisor.",
    );
  const approvalId = insert(
    db,
    "insert into material_approvals(job_card_id,status,submitted_by,submitted_at,revision) values(?,'Pending',?,datetime('now'),1)",
    [job.id, actorId],
  );
  const approval = one<MaterialApproval>(
    db,
    "select * from material_approvals where id=?",
    [approvalId],
  );
  approvalEvent(
    db,
    approval,
    "Submitted",
    actorId,
    "Store requested material approval",
  );
  transitionJobStatusInternal(
    db,
    job.id,
    "HOLD",
    "Material approval pending: Store submitted consolidated request",
  );
  return approvalId;
}
```

## OP-db-decideMaterialApprovalForActor

Source: src/db.ts:4972-5039

Dependencies: one, materialApprovalForJob, rejectionReason.trim, new Date().toISOString, db.run, approvalEvent, transitionJobStatusInternal, history

```typescript
export function decideMaterialApprovalForActor(
  db: Database,
  jobId: number,
  actorId: number,
  decision: "Approved" | "Rejected",
  rejectionReason = "",
) {
  const actor = one<User>(
    db,
    "select * from users where id=? and archived_at is null",
    [actorId],
  );
  if (actor.role !== "admin")
    throw new Error("Only Admin can decide material approvals.");
  const approval = materialApprovalForJob(db, jobId);
  const job = one<JobCard>(
    db,
    "select * from job_cards where id=? and archived_at is null",
    [jobId],
  );
  if (!approval || approval.status !== "Pending")
    throw new Error("There is no pending material approval for this job.");
  if (job.main_status !== "HOLD")
    throw new Error("A pending material approval must keep the job on HOLD.");
  const reason = rejectionReason.trim();
  if (decision === "Rejected" && !reason)
    throw new Error("A rejection reason is required.");
  const now = new Date().toISOString();
  db.run(
    "update material_approvals set status=?,reviewed_by=?,reviewed_at=?,rejection_reason=? where id=?",
    [
      decision,
      actorId,
      now,
      decision === "Rejected" ? reason : null,
      approval.id,
    ],
  );
  const reviewed = one<MaterialApproval>(
    db,
    "select * from material_approvals where id=?",
    [approval.id],
  );
  approvalEvent(
    db,
    reviewed,
    decision,
    actorId,
    decision === "Approved" ? "Admin approved material issue" : reason,
  );
  if (decision === "Approved")
    transitionJobStatusInternal(
      db,
      jobId,
      "IN_PROGRESS",
      "Material approval approved: Store may issue retained requests",
      now,
    );
  else
    history(
      db,
      jobId,
      "HOLD",
      job.sub_status,
      `Material approval rejected: ${reason}`,
      now,
    );
}
```

## OP-db-resubmitMaterialApprovalForActor

Source: src/db.ts:5041-5094

Dependencies: one, materialApprovalForJob, outstandingMaterialRows, new Date().toISOString, db.run, approvalEvent, history

```typescript
export function resubmitMaterialApprovalForActor(
  db: Database,
  jobId: number,
  actorId: number,
) {
  const actor = one<User>(
    db,
    "select * from users where id=? and archived_at is null",
    [actorId],
  );
  const job = one<JobCard>(
    db,
    "select * from job_cards where id=? and archived_at is null",
    [jobId],
  );
  const approval = materialApprovalForJob(db, jobId);
  if (actor.role !== "service" || actor.id !== job.advisor_id)
    throw new Error(
      "Only the linked Service Advisor can resubmit a rejected material approval.",
    );
  if (!approval || approval.status !== "Rejected" || job.main_status !== "HOLD")
    throw new Error(
      "Only a rejected held job can be resubmitted for approval.",
    );
  if (!outstandingMaterialRows(db, jobId).length)
    throw new Error(
      "Add or correct a Requested material row before resubmitting.",
    );
  const now = new Date().toISOString();
  db.run(
    "update material_approvals set status='Pending',submitted_by=?,submitted_at=?,reviewed_by=null,reviewed_at=null,rejection_reason=null,revision=revision+1 where id=?",
    [actorId, now, approval.id],
  );
  const resubmitted = one<MaterialApproval>(
    db,
    "select * from material_approvals where id=?",
    [approval.id],
  );
  approvalEvent(
    db,
    resubmitted,
    "Resubmitted",
    actorId,
    "Service Advisor corrected and resubmitted material approval",
  );
  history(
    db,
    jobId,
    "HOLD",
    job.sub_status,
    "Material approval resubmitted and pending",
    now,
  );
}
```

## OP-db-materialStockOnHand

Source: src/db.ts:5154-5160

Dependencies: scalar

```typescript
export function materialStockOnHand(db: Database, itemId: number) {
  return scalar<number>(
    db,
    "select stock_qty - coalesce((select sum(qty) from stock_ledger where item_id=inventory.id),0) from inventory where id=?",
    [itemId],
  );
}
```

## OP-db-addMaterialRowForActor

Source: src/db.ts:5162-5176

Dependencies: assertMaterialManager, assertMaterialInput, insert

```typescript
export function addMaterialRowForActor(
  db: Database,
  jobId: number,
  actorId: number,
  itemId: number,
  qty: number,
) {
  assertMaterialManager(db, jobId, actorId);
  assertMaterialInput(db, itemId, qty);
  return insert(
    db,
    "insert into material_requests(job_card_id,item_id,requested_qty,issued_qty,used_qty,returned_qty,wasted_qty,status,created_at,updated_at) values(?,?,?,0,0,0,0,'Draft',datetime('now'),datetime('now'))",
    [jobId, itemId, qty],
  );
}
```

## OP-db-updateMaterialRowForActor

Source: src/db.ts:5178-5191

Dependencies: materialRowFor, assertMaterialInput, db.run

```typescript
export function updateMaterialRowForActor(
  db: Database,
  rowId: number,
  actorId: number,
  itemId: number,
  qty: number,
) {
  materialRowFor(db, rowId, actorId, "edit");
  assertMaterialInput(db, itemId, qty);
  db.run(
    "update material_requests set item_id=?, requested_qty=?, updated_at=datetime('now') where id=?",
    [itemId, qty, rowId],
  );
}
```

## OP-db-deleteMaterialRowForActor

Source: src/db.ts:5193-5200

Dependencies: materialRowFor, db.run

```typescript
export function deleteMaterialRowForActor(
  db: Database,
  rowId: number,
  actorId: number,
) {
  materialRowFor(db, rowId, actorId, "delete");
  db.run("delete from material_requests where id=?", [rowId]);
}
```

## OP-db-requestMaterialRowForActor

Source: src/db.ts:5231-5242

Dependencies: materialRowFor, db.run, afterMaterialRequest

```typescript
export function requestMaterialRowForActor(
  db: Database,
  rowId: number,
  actorId: number,
) {
  const row = materialRowFor(db, rowId, actorId, "request");
  db.run(
    "update material_requests set status='Requested', updated_at=datetime('now') where id=?",
    [rowId],
  );
  return afterMaterialRequest(db, row, actorId);
}
```

## OP-db-reRequestMaterialRowForActor

Source: src/db.ts:5245-5265

Dependencies: materialRowFor, assertMaterialInput, db.run, afterMaterialRequest, one

```typescript
export function reRequestMaterialRowForActor(
  db: Database,
  rowId: number,
  actorId: number,
  itemId: number,
  qty: number,
) {
  materialRowFor(db, rowId, actorId, "re-request");
  assertMaterialInput(db, itemId, qty);
  db.run(
    "update material_requests set item_id=?, requested_qty=?, status='Re-requested', updated_at=datetime('now') where id=?",
    [itemId, qty, rowId],
  );
  return afterMaterialRequest(
    db,
    one<MaterialRequest>(db, "select * from material_requests where id=?", [
      rowId,
    ]),
    actorId,
  );
}
```

## OP-db-releaseMaterialRowForActor

Source: src/db.ts:5303-5357

Dependencies: actorAndJob, materialApprovalForJob, approvalBlocksMaterialOperations, approval!.status.toLowerCase, canReleaseMaterialRows, materialRowActionsFor(actor, job, row).includes, materialRowActionsFor, materialRowStatus, materialStockOnHand, db.run, ledger, new Date().toISOString, reconcileArtifactChecklist

```typescript
export function releaseMaterialRowForActor(
  db: Database,
  rowId: number,
  actorId: number,
) {
  const { row, actor, job } = actorAndJob(db, rowId, actorId);
  const approval = materialApprovalForJob(db, job.id);
  if (approvalBlocksMaterialOperations(approval))
    throw new Error(
      `Material issue is blocked while approval is ${approval!.status.toLowerCase()}.`,
    );
  if (!canReleaseMaterialRows(actor, job) || job.main_status !== "IN_PROGRESS")
    throw new Error(
      "Only Store or the Owner can release material while the job card is IN_PROGRESS.",
    );
  if (!materialRowActionsFor(actor, job, row).includes("release"))
    throw new Error(
      `A ${materialRowStatus(row)} material row cannot be released.`,
    );
  const onHand = materialStockOnHand(db, row.item_id);
  if (row.requested_qty > onHand)
    throw new Error(
      `Cannot release ${row.requested_qty}; only ${onHand} in stock.`,
    );
  db.run(
    "update material_requests set status='Issued', issued_qty=requested_qty, updated_at=datetime('now') where id=?",
    [rowId],
  );
  ledger(
    db,
    job.id,
    rowId,
    row.item_id,
    row.requested_qty,
    "issue",
    actorId,
    "Released to job",
  );
  db.run(
    "insert into material_events(job_card_id,material_row_id,kind,by_user,at,note,old_item_id,old_qty,new_item_id,new_qty) values(?,?,?,?,?,?,?,?,?,?)",
    [
      job.id,
      rowId,
      "release",
      actorId,
      new Date().toISOString(),
      "Released to job",
      null,
      null,
      row.item_id,
      row.requested_qty,
    ],
  );
  reconcileArtifactChecklist(db, job.id, actorId);
}
```

## OP-db-editIssuedMaterialRowForActor

Source: src/db.ts:5360-5423

Dependencies: actorAndJob, canEditIssuedMaterialRows, materialRowActionsFor(actor, job, row).includes, materialRowActionsFor, materialRowStatus, note.trim, assertMaterialInput, materialStockOnHand, ledger, db.run, new Date().toISOString

```typescript
export function editIssuedMaterialRowForActor(
  db: Database,
  rowId: number,
  actorId: number,
  itemId: number,
  qty: number,
  note: string,
) {
  const { row, actor, job } = actorAndJob(db, rowId, actorId);
  if (!canEditIssuedMaterialRows(actor, job))
    throw new Error(
      "Only Store, the Owner or the linked Service Advisor can edit an Issued row.",
    );
  if (!materialRowActionsFor(actor, job, row).includes("edit-issued"))
    throw new Error(
      `A ${materialRowStatus(row)} material row cannot be edited this way.`,
    );
  if (!note.trim())
    throw new Error("A note is required to edit an Issued row.");
  assertMaterialInput(db, itemId, qty);
  const oldItem = row.item_id,
    oldQty = row.issued_qty || row.requested_qty;
  if (itemId === oldItem && qty === oldQty) throw new Error("Nothing changed.");
  const needed = itemId === oldItem ? qty - oldQty : qty;
  if (needed > 0 && needed > materialStockOnHand(db, itemId))
    throw new Error(
      `Cannot issue ${needed} more; only ${materialStockOnHand(db, itemId)} in stock.`,
    );
  const reason = note.trim();
  if (itemId === oldItem)
    ledger(
      db,
      job.id,
      rowId,
      itemId,
      qty - oldQty,
      "adjustment",
      actorId,
      reason,
    );
  else {
    ledger(db, job.id, rowId, oldItem, -oldQty, "adjustment", actorId, reason);
    ledger(db, job.id, rowId, itemId, qty, "adjustment", actorId, reason);
  }
  db.run(
    "update material_requests set item_id=?, requested_qty=?, issued_qty=?, updated_at=datetime('now') where id=?",
    [itemId, qty, qty, rowId],
  );
  db.run(
    "insert into material_events(job_card_id,material_row_id,kind,by_user,at,note,old_item_id,old_qty,new_item_id,new_qty) values(?,?,?,?,?,?,?,?,?,?)",
    [
      job.id,
      rowId,
      "issued-edit",
      actorId,
      new Date().toISOString(),
      reason,
      oldItem,
      oldQty,
      itemId,
      qty,
    ],
  );
}
```

## OP-db-cancelMaterialRowForActor

Source: src/db.ts:5426-5437

Dependencies: materialRowFor, db.run, reconcileArtifactChecklist

```typescript
export function cancelMaterialRowForActor(
  db: Database,
  rowId: number,
  actorId: number,
) {
  const row = materialRowFor(db, rowId, actorId, "cancel");
  db.run(
    "update material_requests set status='Cancelled', updated_at=datetime('now') where id=?",
    [rowId],
  );
  reconcileArtifactChecklist(db, row.job_card_id, actorId);
}
```

## OP-db-createInventoryItem

Source: src/db.ts:5439-5456

Dependencies: insert

```typescript
export function createInventoryItem(
  db: Database,
  payload: Omit<InventoryItem, "id">,
) {
  return insert(
    db,
    "insert into inventory(sku, category, name, unit, stock_qty, low_stock_qty, selling_price, created_at, updated_at) values (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))",
    [
      payload.sku,
      payload.category,
      payload.name,
      payload.unit,
      payload.stock_qty,
      payload.low_stock_qty,
      payload.selling_price,
    ],
  );
}
```

## OP-db-updateInventoryItem

Source: src/db.ts:5458-5475

Dependencies: db.run

```typescript
export function updateInventoryItem(
  db: Database,
  id: number,
  payload: Omit<InventoryItem, "id">,
) {
  db.run(
    "update inventory set sku=?, category=?, name=?, unit=?, low_stock_qty=?, selling_price=?, updated_at=datetime('now') where id=?",
    [
      payload.sku,
      payload.category,
      payload.name,
      payload.unit,
      payload.low_stock_qty,
      payload.selling_price,
      id,
    ],
  );
}
```

## OP-db-archiveInventoryItem

Source: src/db.ts:5477-5479

Dependencies: archive

```typescript
export function archiveInventoryItem(db: Database, id: number, reason: string) {
  archive(db, "inventory", id, reason);
}
```

## OP-db-stockIn

Source: src/db.ts:5482-5500

Dependencies: Number.isFinite, one, db.run, movement

```typescript
export function stockIn(
  db: Database,
  itemId: number,
  qty: number,
  note: string,
) {
  if (!Number.isFinite(qty) || qty <= 0)
    throw new Error("Inward quantity must be greater than zero.");
  one<InventoryItem>(
    db,
    "select * from inventory where id=? and archived_at is null",
    [itemId],
  );
  db.run(
    "insert into stock_ledger(job_card_id,material_row_id,item_id,qty,type,by_user,at,note) values(0,0,?,-?,'manual-inward',0,datetime('now'),?)",
    [itemId, qty, note || "Manual stock-in"],
  );
  movement(db, 0, itemId, "STOCK_IN", qty, note || "Stock-in");
}
```

## OP-db-adjustStock

Source: src/db.ts:5502-5525

Dependencies: Number.isFinite, materialStockOnHand, db.run, movement

```typescript
export function adjustStock(
  db: Database,
  itemId: number,
  qty: number,
  note: string,
) {
  if (!Number.isFinite(qty) || qty < 0)
    throw new Error("Adjusted stock must be zero or greater.");
  const onHand = materialStockOnHand(db, itemId);
  const delta = onHand - qty;
  if (delta)
    db.run(
      "insert into stock_ledger(job_card_id,material_row_id,item_id,qty,type,by_user,at,note) values(0,0,?,?, 'manual-adjustment',0,datetime('now'),?)",
      [itemId, delta, note || "Stock adjustment"],
    );
  movement(
    db,
    0,
    itemId,
    "ADJUSTMENT",
    qty - onHand,
    note || "Stock adjustment",
  );
}
```

## OP-db-createTask

Source: src/db.ts:5527-5539

Dependencies: insert

```typescript
export function createTask(db: Database, payload: Omit<Task, "id">) {
  return insert(
    db,
    "insert into tasks(job_card_id, technician_id, title, status, notes, created_at, updated_at) values (?, ?, ?, ?, ?, datetime('now'), datetime('now'))",
    [
      payload.job_card_id,
      payload.technician_id,
      payload.title,
      payload.status,
      payload.notes,
    ],
  );
}
```

## OP-db-updateTask

Source: src/db.ts:5541-5562

Dependencies: one, db.run, auditEvidence, reconcileArtifactChecklist

```typescript
export function updateTask(
  db: Database,
  taskId: number,
  status: TaskStatus,
  notes: string,
) {
  const task = one<Task>(db, "select * from tasks where id=?", [taskId]);
  const timeColumn =
    status === "Started"
      ? "started_at"
      : status === "Paused"
        ? "paused_at"
        : status === "Completed"
          ? "completed_at"
          : "";
  db.run(
    `update tasks set status=?, notes=?, updated_at=datetime('now')${timeColumn ? `, ${timeColumn}=coalesce(${timeColumn}, datetime('now'))` : ""} where id=?`,
    [status, notes, taskId],
  );
  if (status === "Paused") auditEvidence(db, task.job_card_id, "Task paused");
  reconcileArtifactChecklist(db, task.job_card_id);
}
```

## OP-db-archiveTask

Source: src/db.ts:5564-5566

Dependencies: archive

```typescript
export function archiveTask(db: Database, id: number, reason: string) {
  archive(db, "tasks", id, reason);
}
```

## OP-db-markWashingNeeded

Source: src/db.ts:5568-5574

Dependencies: db.run, reconcileArtifactChecklist

```typescript
export function markWashingNeeded(db: Database, jobId: number) {
  db.run(
    "update job_cards set washing_needed=1, updated_at=datetime('now') where id=?",
    [jobId],
  );
  reconcileArtifactChecklist(db, jobId);
}
```

## OP-db-updateQcCheck

Source: src/db.ts:5576-5600

Dependencies: one, db.run, auditEvidence, reconcileArtifactChecklist

```typescript
export function updateQcCheck(
  db: Database,
  id: number,
  passed: boolean,
  failReason = "",
) {
  const check = one<QcCheck>(db, "select * from qc_checks where id=?", [id]);
  db.run("update qc_checks set passed=?, fail_reason=? where id=?", [
    passed ? 1 : 0,
    failReason,
    id,
  ]);
  db.run("update job_cards set qc_status=? where id=?", [
    passed ? "Pass" : "Fail",
    check.job_card_id,
  ]);
  auditEvidence(
    db,
    check.job_card_id,
    passed
      ? `QC passed: ${check.label}`
      : `QC failed: ${failReason || check.label}`,
  );
  reconcileArtifactChecklist(db, check.job_card_id);
}
```

## OP-db-failQcWithRework

Source: src/db.ts:5602-5619

Dependencies: one, updateQcCheck, createTask

```typescript
export function failQcWithRework(
  db: Database,
  checkId: number,
  technicianId: number,
  reason: string,
) {
  const check = one<QcCheck>(db, "select * from qc_checks where id=?", [
    checkId,
  ]);
  updateQcCheck(db, checkId, false, reason);
  createTask(db, {
    job_card_id: check.job_card_id,
    technician_id: technicianId,
    title: `Rework: ${check.label}`,
    status: "Pending",
    notes: reason,
  });
}
```

## OP-db-passQc

Source: src/db.ts:5621-5631

Dependencies: db.run, reconcileArtifactChecklist

```typescript
export function passQc(db: Database, jobId: number) {
  db.run(
    "update qc_checks set passed=1 where job_card_id=? and archived_at is null",
    [jobId],
  );
  db.run(
    "update job_cards set qc_status='Pass', updated_at=datetime('now') where id=?",
    [jobId],
  );
  reconcileArtifactChecklist(db, jobId);
}
```

## OP-db-generateInvoice

Source: src/db.ts:5633-5652

Dependencies: one, all, createInvoiceFromEstimate, reconcileArtifactChecklist

```typescript
export function generateInvoice(db: Database, jobId: number, tally: string) {
  const estimate = one<Estimate>(
    db,
    "select * from estimates where job_card_id=? and archived_at is null order by id desc limit 1",
    [jobId],
  );
  const items = all<EstimateItem>(
    db,
    "select * from estimate_items where estimate_id=? and archived_at is null order by id",
    [estimate.id],
  );
  createInvoiceFromEstimate(db, jobId, {
    tallyInvoiceNo: tally,
    discount: estimate.discount,
    gstRate: estimate.gst_rate,
    items,
    notes: "",
  });
  reconcileArtifactChecklist(db, jobId);
}
```

## OP-db-canMutateBilling

Source: src/db.ts:5677-5679

Dependencies: 

```typescript
export function canMutateBilling(actor: Pick<User, "role">) {
  return actor.role === "admin" || actor.role === "accounts";
}
```

## OP-db-updateInvoiceFields

Source: src/db.ts:5817-5850

Dependencies: one, assertInvoiceFinancialsEditable, Number.isFinite, db.run, input.tallyInvoiceNo.trim, input.notes.trim, recalculateInvoice, reconcileArtifactChecklist

```typescript
export function updateInvoiceFields(
  db: Database,
  invoiceId: number,
  input: InvoiceFieldsInput,
) {
  const current = one<Invoice>(
    db,
    "select * from invoices where id=? and voided_at is null",
    [invoiceId],
  );
  if (input.discount !== current.discount)
    assertInvoiceFinancialsEditable(db, invoiceId);
  if (!Number.isFinite(input.discount) || input.discount < 0)
    throw new Error("Invoice discount cannot be negative.");
  db.run("savepoint update_invoice_fields");
  try {
    db.run(
      "update invoices set tally_invoice_no=?,discount=?,notes=?,document_available=1,document_generated_at=coalesce(document_generated_at,datetime('now')),updated_at=datetime('now') where id=? and voided_at is null",
      [
        input.tallyInvoiceNo.trim(),
        input.discount,
        input.notes.trim(),
        invoiceId,
      ],
    );
    recalculateInvoice(db, invoiceId);
    reconcileArtifactChecklist(db, current.job_card_id);
    db.run("release savepoint update_invoice_fields");
  } catch (error) {
    db.run("rollback to savepoint update_invoice_fields");
    db.run("release savepoint update_invoice_fields");
    throw error;
  }
}
```

## OP-db-createInvoiceItem

Source: src/db.ts:5852-5890

Dependencies: assertInvoiceFinancialsEditable, validateInvoiceItem, one, pickUpMaterialRow, normalizeAndValidateGst, insert, input.description.trim, recalculateInvoice

```typescript
export function createInvoiceItem(
  db: Database,
  invoiceId: number,
  input: InvoiceItemInput,
) {
  assertInvoiceFinancialsEditable(db, invoiceId);
  validateInvoiceItem(input);
  const invoice = one<Invoice>(db, "select * from invoices where id=?", [
    invoiceId,
  ]);
  if (input.material_row_id)
    pickUpMaterialRow(
      db,
      invoice.job_card_id,
      input.material_row_id,
      invoiceId,
    );
  const tax = normalizeAndValidateGst(
    input.gst_type,
    input.gst_rate,
    DEFAULT_GST_BY_KIND[input.kind],
  );
  const id = insert(
    db,
    "insert into invoice_items(invoice_id,kind,description,qty,rate,gst_type,gst_rate,material_row_id,created_at,updated_at) values(?,?,?,?,?,?,?,?,datetime('now'),datetime('now'))",
    [
      invoiceId,
      input.kind,
      input.description.trim(),
      input.qty,
      input.rate,
      tax.gst_type,
      tax.gst_rate,
      input.material_row_id ?? null,
    ],
  );
  recalculateInvoice(db, invoiceId);
  return id;
}
```

## OP-db-updateInvoiceItem

Source: src/db.ts:5892-5922

Dependencies: one, assertInvoiceFinancialsEditable, validateInvoiceItem, normalizeAndValidateGst, db.run, input.description.trim, recalculateInvoice

```typescript
export function updateInvoiceItem(
  db: Database,
  itemId: number,
  input: InvoiceItemInput,
) {
  const item = one<InvoiceItem>(
    db,
    "select * from invoice_items where id=? and archived_at is null",
    [itemId],
  );
  assertInvoiceFinancialsEditable(db, item.invoice_id);
  validateInvoiceItem(input);
  const tax = normalizeAndValidateGst(
    input.gst_type ?? item.gst_type,
    input.gst_rate ?? item.gst_rate,
    DEFAULT_GST_BY_KIND[input.kind],
  );
  db.run(
    "update invoice_items set kind=?,description=?,qty=?,rate=?,gst_type=?,gst_rate=?,updated_at=datetime('now') where id=?",
    [
      input.kind,
      input.description.trim(),
      input.qty,
      input.rate,
      tax.gst_type,
      tax.gst_rate,
      itemId,
    ],
  );
  recalculateInvoice(db, item.invoice_id);
}
```

## OP-db-archiveInvoiceItem

Source: src/db.ts:5925-5953

Dependencies: one, assertInvoiceFinancialsEditable, reason.trim, db.run, archive, recalculateInvoice

```typescript
export function archiveInvoiceItem(
  db: Database,
  itemId: number,
  reason: string,
) {
  const item = one<InvoiceItem>(
    db,
    "select * from invoice_items where id=? and archived_at is null",
    [itemId],
  );
  assertInvoiceFinancialsEditable(db, item.invoice_id);
  if (!reason.trim())
    throw new Error("An invoice item archive reason is required.");
  db.run("savepoint archive_invoice_item");
  try {
    archive(db, "invoice_items", itemId, reason.trim());
    if (item.material_row_id)
      db.run(
        "update material_requests set invoiced_in=null,updated_at=datetime('now') where id=? and invoiced_in=?",
        [item.material_row_id, item.invoice_id],
      );
    recalculateInvoice(db, item.invoice_id);
    db.run("release savepoint archive_invoice_item");
  } catch (error) {
    db.run("rollback to savepoint archive_invoice_item");
    db.run("release savepoint archive_invoice_item");
    throw error;
  }
}
```

## OP-db-createInvoiceFromEstimate

Source: src/db.ts:5955-6064

Dependencies: maybe, one, all, estimateItems.map, Number.isFinite, items.forEach, db.run, items.map, normalizeAndValidateGst, invoiceTotals, insert, nextDocumentNumber, input.tallyInvoiceNo.trim, input.notes.trim, pickUpMaterialRow, item.description.trim, invoiceEvent, priced.filter, reconcileArtifactChecklist

```typescript
export function createInvoiceFromEstimate(
  db: Database,
  jobId: number,
  input: CreateInvoiceInput,
  actorId = 0,
) {
  const existing = maybe<Invoice>(
    db,
    "select * from invoices where job_card_id=? and voided_at is null order by id desc limit 1",
    [jobId],
  );
  if (existing) return existing.id;
  const estimate = one<Estimate>(
    db,
    "select * from estimates where job_card_id=? and archived_at is null order by id desc limit 1",
    [jobId],
  );
  const estimateItems = all<EstimateItem>(
    db,
    "select * from estimate_items where estimate_id=? and archived_at is null order by id",
    [estimate.id],
  );
  const items: InvoiceItemInput[] =
    input.items ??
    estimateItems.map((item) => ({
      kind: item.kind,
      description: item.description,
      qty: item.qty,
      rate: item.rate,
      gst_type: item.gst_type ?? undefined,
      gst_rate: item.gst_rate ?? undefined,
    }));
  const discount = input.discount ?? estimate.discount;
  const fallbackGst = input.gstRate ?? estimate.gst_rate;
  if (items.length === 0)
    throw new Error("An invoice requires at least one item.");
  if (!Number.isFinite(discount) || discount < 0)
    throw new Error("Invoice discount cannot be negative.");
  items.forEach(validateInvoiceItem);
  db.run("savepoint create_invoice");
  try {
    const priced = items.map((item) => ({
      ...item,
      ...normalizeAndValidateGst(
        item.gst_type,
        item.gst_rate,
        fallbackGst ?? DEFAULT_GST_BY_KIND[item.kind],
      ),
    }));
    const totals = invoiceTotals(priced, discount);
    const id = insert(
      db,
      "insert into invoices(job_card_id,invoice_no,tally_invoice_no,discount,gst_rate,subtotal,gst_amount,total,status,notes,document_available,document_generated_at,created_at,updated_at) values(?,?,?,?,?,?,?,?,?,?,1,datetime('now'),datetime('now'),datetime('now'))",
      [
        jobId,
        nextDocumentNumber(
          db,
          "invoices",
          "invoice_no",
          "INV-",
          8900 + jobId,
          5,
        ),
        input.tallyInvoiceNo.trim(),
        totals.discount,
        0,
        totals.subtotal,
        totals.gst,
        totals.total,
        "Pending",
        input.notes.trim(),
      ],
    );
    for (const item of priced) {
      if (item.material_row_id)
        pickUpMaterialRow(db, jobId, item.material_row_id, id);
      insert(
        db,
        "insert into invoice_items(invoice_id,kind,description,qty,rate,gst_type,gst_rate,material_row_id,created_at,updated_at) values(?,?,?,?,?,?,?,?,datetime('now'),datetime('now'))",
        [
          id,
          item.kind,
          item.description.trim(),
          item.qty,
          item.rate,
          item.gst_type,
          item.gst_rate,
          item.material_row_id ?? null,
        ],
      );
    }
    invoiceEvent(
      db,
      { id, job_card_id: jobId },
      "create",
      actorId,
      "",
      null,
      totals.total,
      `${priced.length} line${priced.length === 1 ? "" : "s"}, ${priced.filter((item) => item.material_row_id).length} material row(s) picked up`,
    );
    reconcileArtifactChecklist(db, jobId);
    db.run("release savepoint create_invoice");
    return id;
  } catch (error) {
    db.run("rollback to savepoint create_invoice");
    db.run("release savepoint create_invoice");
    throw error;
  }
}
```

## OP-db-createInvoiceForActor

Source: src/db.ts:6066-6094

Dependencies: one, canCreateInvoice, maybe, createInvoiceFromEstimate

```typescript
export function createInvoiceForActor(
  db: Database,
  jobId: number,
  actorId: number,
  input: CreateInvoiceInput,
) {
  const actor = one<User>(
    db,
    "select * from users where id=? and archived_at is null",
    [actorId],
  );
  const job = one<JobCard>(
    db,
    "select * from job_cards where id=? and archived_at is null",
    [jobId],
  );
  if (!canCreateInvoice(actor, job))
    throw new Error(
      "This user cannot create an invoice for this job card right now.",
    );
  const estimate = maybe<Estimate>(
    db,
    "select * from estimates where job_card_id=? and archived_at is null order by id desc limit 1",
    [jobId],
  );
  if (estimate?.status !== "Approved")
    throw new Error("Approve the Estimate before creating an invoice.");
  return createInvoiceFromEstimate(db, jobId, input, actorId);
}
```

## OP-db-updateInvoiceForActor

Source: src/db.ts:6096-6120

Dependencies: one, canEditInvoice, updateInvoiceFields

```typescript
export function updateInvoiceForActor(
  db: Database,
  invoiceId: number,
  actorId: number,
  input: InvoiceFieldsInput,
) {
  const actor = one<User>(
    db,
    "select * from users where id=? and archived_at is null",
    [actorId],
  );
  const invoice = one<Invoice>(
    db,
    "select * from invoices where id=? and voided_at is null",
    [invoiceId],
  );
  const job = one<JobCard>(
    db,
    "select * from job_cards where id=? and archived_at is null",
    [invoice.job_card_id],
  );
  if (!canEditInvoice(actor, job) || invoice.status !== "Pending")
    throw new Error("This user cannot edit this invoice.");
  updateInvoiceFields(db, invoiceId, input);
}
```

## OP-db-saveInvoiceForActor

Source: src/db.ts:6164-6251

Dependencies: one, canEditInvoice, activeInvoiceItems, existing.map, input.items.some, existingIds.has, input.items.forEach, scalar, changeSummary, input.note?.trim, db.run, updateInvoiceFields, updateInvoiceItem, createInvoiceItem, input.items.flatMap, retained.has, archiveInvoiceItem, invoiceEvent, input.note!.trim

```typescript
export function saveInvoiceForActor(
  db: Database,
  invoiceId: number,
  actorId: number,
  input: InvoiceEditorInput,
) {
  const actor = one<User>(
    db,
    "select * from users where id=? and archived_at is null",
    [actorId],
  );
  const invoice = one<Invoice>(
    db,
    "select * from invoices where id=? and voided_at is null",
    [invoiceId],
  );
  const job = one<JobCard>(db, "select * from job_cards where id=?", [
    invoice.job_card_id,
  ]);
  if (invoice.status !== "Pending")
    throw new Error(
      "Only a Pending invoice can be edited; cleared invoices are locked.",
    );
  if (!canEditInvoice(actor, job))
    throw new Error("This user cannot edit the invoice for this job card.");
  if (input.items.length === 0)
    throw new Error("An invoice requires at least one item.");
  const existing = activeInvoiceItems(db, invoiceId);
  const existingIds = new Set(existing.map((item) => item.id));
  if (input.items.some((item) => item.id && !existingIds.has(item.id)))
    throw new Error("Invoice item does not belong to this invoice.");
  input.items.forEach(validateInvoiceItem);
  const financialsLocked =
    scalar<number>(
      db,
      "select count(*) from payments where invoice_id=? and voided_at is null",
      [invoiceId],
    ) > 0;
  const summary = changeSummary(
    existing,
    input.items,
    invoice.discount,
    input.discount,
    invoice.gst_rate,
  );
  if (financialsLocked && summary)
    throw new Error(
      "Invoice financial fields are locked after the first active payment.",
    );
  if (summary && !input.note?.trim())
    throw new Error("A note is required to edit invoice lines or discount.");
  db.run("savepoint save_invoice_editor");
  try {
    updateInvoiceFields(db, invoiceId, input);
    if (!financialsLocked) {
      for (const item of input.items) {
        if (item.id) updateInvoiceItem(db, item.id, item);
        else createInvoiceItem(db, invoiceId, item);
      }
      const retained = new Set(
        input.items.flatMap((item) => (item.id ? [item.id] : [])),
      );
      for (const item of existing)
        if (!retained.has(item.id))
          archiveInvoiceItem(db, item.id, "Removed in invoice editor");
    }
    if (summary) {
      const after = one<Invoice>(db, "select * from invoices where id=?", [
        invoiceId,
      ]);
      invoiceEvent(
        db,
        invoice,
        "edit",
        actorId,
        input.note!.trim(),
        invoice.total,
        after.total,
        summary,
      );
    }
    db.run("release savepoint save_invoice_editor");
  } catch (error) {
    db.run("rollback to savepoint save_invoice_editor");
    db.run("release savepoint save_invoice_editor");
    throw error;
  }
}
```

## OP-db-voidInvoice

Source: src/db.ts:6254-6291

Dependencies: reason.trim, scalar, one, db.run, invoiceEvent, reconcileArtifactChecklist

```typescript
export function voidInvoice(
  db: Database,
  invoiceId: number,
  reason: string,
  actorId = 0,
) {
  if (!reason.trim()) throw new Error("An invoice void reason is required.");
  if (
    scalar<number>(
      db,
      "select count(*) from payments where invoice_id=? and voided_at is null",
      [invoiceId],
    ) > 0
  )
    throw new Error("An invoice with active payments cannot be voided.");
  const invoice = one<Invoice>(db, "select * from invoices where id=?", [
    invoiceId,
  ]);
  db.run(
    "update invoices set voided_at=datetime('now'), void_reason=?, updated_at=datetime('now') where id=?",
    [reason, invoiceId],
  );
  db.run(
    "update material_requests set invoiced_in=null,updated_at=datetime('now') where invoiced_in=?",
    [invoiceId],
  );
  invoiceEvent(
    db,
    invoice,
    "void",
    actorId,
    reason.trim(),
    invoice.total,
    null,
    "Material rows unlocked",
  );
  reconcileArtifactChecklist(db, invoice.job_card_id);
}
```

## OP-db-voidInvoiceForActor

Source: src/db.ts:6293-6301

Dependencies: assertBillingMutationAccess, voidInvoice

```typescript
export function voidInvoiceForActor(
  db: Database,
  invoiceId: number,
  actorId: number,
  reason: string,
) {
  assertBillingMutationAccess(db, actorId);
  voidInvoice(db, invoiceId, reason, actorId);
}
```

## OP-db-recordPayment

Source: src/db.ts:6388-6515

Dependencies: validatePaymentInput, maybe, one, scalar, activePaidAmount, db.run, new Date().toISOString, insert, input.otherDetail.trim, input.reference.trim, (input.notes ?? "").trim, nextDocumentNumber, reconcileArtifactChecklist, transitionJobStatusInternal, ensureGatePassOnClose, updateDeliveryDetails, setChecklistItemChecked

```typescript
export function recordPayment(
  db: Database,
  invoiceId: number,
  input: PaymentInput,
  actorId = 0,
) {
  validatePaymentInput(input);
  const invoice = maybe<Invoice>(
    db,
    "select * from invoices where id=? and voided_at is null",
    [invoiceId],
  );
  if (!invoice) throw new Error("Record Payment requires a current Invoice.");
  const job = one<JobCard>(db, "select * from job_cards where id=?", [
    invoice.job_card_id,
  ]);
  if (job.main_status === "CANCELLED")
    throw new Error("A CANCELLED job card is read-only.");
  if (job.main_status !== "COMPLETED")
    throw new Error("Only a completed job card can be paid and handed over.");
  if (
    scalar<number>(
      db,
      "select count(*) from checklist_items where job_card_id=? and stage='COMPLETED' and label='Remind Customer for Sharing Google Review/Feedback' and checked_at is not null and checklist_cycle_id=(select max(id) from checklist_cycles where job_card_id=?)",
      [invoice.job_card_id, invoice.job_card_id],
    ) === 0
  ) {
    throw new Error(
      "Confirm the Google review/feedback reminder before recording payment.",
    );
  }
  if (activePaidAmount(db, invoiceId) > 0)
    throw new Error(
      "This invoice already has a payment. Void it before recording another.",
    );
  if (invoice.status !== "Pending")
    throw new Error("Only a Pending invoice can be paid.");
  if (!(invoice.total > 0))
    throw new Error("An invoice with no amount due cannot be paid.");
  db.run("savepoint record_payment");
  try {
    const timestamp = new Date().toISOString();
    const id = insert(
      db,
      "insert into payments(job_card_id,invoice_id,amount,mode,other_detail,reference,notes,created_at,updated_at) values(?,?,?,?,?,?,?,datetime('now'),datetime('now'))",
      [
        invoice.job_card_id,
        invoiceId,
        invoice.total,
        input.mode,
        input.mode === "Other" ? input.otherDetail.trim() : "",
        input.reference.trim(),
        (input.notes ?? "").trim(),
      ],
    );
    if (
      !maybe<Receipt>(
        db,
        "select * from receipts where invoice_id=? and voided_at is null",
        [invoiceId],
      )
    ) {
      insert(
        db,
        "insert into receipts(job_card_id,invoice_id,receipt_no,created_at) values (?,?,?,datetime('now'))",
        [
          invoice.job_card_id,
          invoiceId,
          nextDocumentNumber(
            db,
            "receipts",
            "receipt_no",
            "RCT-",
            4500 + invoiceId,
            5,
          ),
        ],
      );
    }
    db.run(
      "update invoices set status='Cleared',updated_at=datetime('now') where id=?",
      [invoiceId],
    );
    reconcileArtifactChecklist(db, invoice.job_card_id, actorId, timestamp);
    transitionJobStatusInternal(
      db,
      invoice.job_card_id,
      "CLOSED",
      "Payment received and vehicle handed over",
      timestamp,
      true,
    );
    ensureGatePassOnClose(db, invoice.job_card_id);
    const actor = actorId
      ? one<User>(
          db,
          "select * from users where id=? and archived_at is null",
          [actorId],
        )
      : undefined;
    const vehicle = maybe<Vehicle>(
      db,
      "select v.* from vehicles v join visits visit on visit.vehicle_id=v.id join job_cards jc on jc.visit_id=visit.id where jc.id=?",
      [invoice.job_card_id],
    );
    updateDeliveryDetails(
      db,
      invoice.job_card_id,
      actor?.name ?? job.delivery_by ?? "Accounts",
      job.final_km ?? vehicle?.km ?? 0,
      job.acknowledgement || "Payment confirmed and vehicle handed over",
    );
    reconcileArtifactChecklist(db, invoice.job_card_id, actorId, timestamp);
    const deliveredItem = maybe<ChecklistItem>(
      db,
      "select * from checklist_items where job_card_id=? and stage='CLOSED' and label='Delivered' order by cycle_number desc,id desc limit 1",
      [invoice.job_card_id],
    );
    if (deliveredItem && !deliveredItem.checked_at)
      setChecklistItemChecked(db, deliveredItem.id, actorId, true, timestamp);
    db.run("release savepoint record_payment");
    return id;
  } catch (error) {
    db.run("rollback to savepoint record_payment");
    db.run("release savepoint record_payment");
    throw error;
  }
}
```

## OP-db-recordPaymentForActor

Source: src/db.ts:6517-6525

Dependencies: assertBillingMutationAccess, recordPayment

```typescript
export function recordPaymentForActor(
  db: Database,
  invoiceId: number,
  actorId: number,
  input: PaymentInput,
) {
  assertBillingMutationAccess(db, actorId);
  return recordPayment(db, invoiceId, input, actorId);
}
```

## OP-db-voidPayment

Source: src/db.ts:6528-6574

Dependencies: reason.trim, one, db.run, maybe, writeChecklistItemState, new Date().toISOString

```typescript
export function voidPayment(db: Database, id: number, reason: string) {
  if (!reason.trim()) throw new Error("A payment void reason is required.");
  const payment = one<Payment>(
    db,
    "select * from payments where id=? and voided_at is null",
    [id],
  );
  const job = one<JobCard>(db, "select * from job_cards where id=?", [
    payment.job_card_id,
  ]);
  if (job.main_status === "CLOSED" || job.main_status === "CANCELLED")
    throw new Error(`A ${job.main_status} job card is read-only.`);
  db.run("savepoint void_payment");
  try {
    db.run(
      "update payments set voided_at=datetime('now'),void_reason=?,updated_at=datetime('now') where id=?",
      [reason.trim(), id],
    );
    db.run(
      "update receipts set voided_at=datetime('now'),void_reason=? where invoice_id=? and voided_at is null",
      [reason.trim(), payment.invoice_id],
    );
    db.run(
      "update invoices set status='Pending',updated_at=datetime('now') where id=? and voided_at is null",
      [payment.invoice_id],
    );
    const item = maybe<ChecklistItem>(
      db,
      "select * from checklist_items where job_card_id=? and label='Payment Received' and checked_at is not null and checklist_cycle_id=(select max(id) from checklist_cycles where job_card_id=?)",
      [payment.job_card_id, payment.job_card_id],
    );
    if (item)
      writeChecklistItemState(
        db,
        item,
        0,
        false,
        false,
        new Date().toISOString(),
      );
    db.run("release savepoint void_payment");
  } catch (error) {
    db.run("rollback to savepoint void_payment");
    db.run("release savepoint void_payment");
    throw error;
  }
}
```

## OP-db-voidPaymentForActor

Source: src/db.ts:6576-6584

Dependencies: assertAdminBillingAccess, voidPayment

```typescript
export function voidPaymentForActor(
  db: Database,
  id: number,
  actorId: number,
  reason: string,
) {
  assertAdminBillingAccess(db, actorId);
  voidPayment(db, id, reason);
}
```

## OP-db-updateDeliveryDetails

Source: src/db.ts:6620-6631

Dependencies: db.run

```typescript
export function updateDeliveryDetails(
  db: Database,
  jobId: number,
  deliveredBy: string,
  finalKm: number,
  acknowledgement: string,
) {
  db.run(
    "update job_cards set delivery_by=?, final_km=?, acknowledgement=?, updated_at=datetime('now') where id=?",
    [deliveredBy, finalKm, acknowledgement, jobId],
  );
}
```

## OP-db-updateDeliveryForActor

Source: src/db.ts:6633-6652

Dependencies: assertAdminBillingAccess, deliveredBy.trim, Number.isFinite, updateDeliveryDetails, acknowledgement.trim

```typescript
export function updateDeliveryForActor(
  db: Database,
  jobId: number,
  actorId: number,
  deliveredBy: string,
  finalKm: number,
  acknowledgement: string,
) {
  assertAdminBillingAccess(db, actorId);
  if (!deliveredBy.trim()) throw new Error("Delivered by is required.");
  if (!Number.isFinite(finalKm) || finalKm < 0)
    throw new Error("Final KM cannot be negative.");
  updateDeliveryDetails(
    db,
    jobId,
    deliveredBy.trim(),
    finalKm,
    acknowledgement.trim(),
  );
}
```

## OP-db-markJobDeliveredForActor

Source: src/db.ts:6654-6702

Dependencies: new Date().toISOString, assertAdminBillingAccess, one, maybe, db.run, updateDeliveryForActor, setChecklistItemChecked

```typescript
export function markJobDeliveredForActor(
  db: Database,
  jobId: number,
  actorId: number,
  deliveredBy: string,
  finalKm: number,
  acknowledgement: string,
  timestamp = new Date().toISOString(),
) {
  assertAdminBillingAccess(db, actorId);
  const job = one<JobCard>(db, "select * from job_cards where id=?", [jobId]);
  if (job.main_status !== "CLOSED")
    throw new Error("Only a closed job can be marked Delivered.");
  if (
    !maybe<GatePass>(
      db,
      "select * from gate_passes where job_card_id=? and voided_at is null",
      [jobId],
    )
  )
    throw new Error("A current gate pass is required before delivery.");
  const item = one<ChecklistItem>(
    db,
    "select * from checklist_items where job_card_id=? and stage='CLOSED' and label='Delivered' order by cycle_number desc,id desc limit 1",
    [jobId],
  );
  if (item.checked_at) throw new Error("This job is already marked Delivered.");
  db.run("savepoint mark_delivered");
  try {
    updateDeliveryForActor(
      db,
      jobId,
      actorId,
      deliveredBy,
      finalKm,
      acknowledgement,
    );
    setChecklistItemChecked(db, item.id, actorId, true, timestamp);
    db.run(
      "update job_cards set closed_at=coalesce(nullif(closed_at,''),?),updated_at=? where id=?",
      [timestamp, timestamp, jobId],
    );
    db.run("release savepoint mark_delivered");
  } catch (error) {
    db.run("rollback to savepoint mark_delivered");
    db.run("release savepoint mark_delivered");
    throw error;
  }
}
```

## OP-db-closeJob

Source: src/db.ts:6704-6708

Dependencies: 

```typescript
export function closeJob(db: Database, jobId: number) {
  throw new Error(
    "A completed job can only close when a valid payment is recorded.",
  );
}
```

## OP-db-createFollowup

Source: src/db.ts:6710-6724

Dependencies: insert, reconcileArtifactChecklist

```typescript
export function createFollowup(db: Database, payload: Omit<Followup, "id">) {
  const id = insert(
    db,
    "insert into followups(job_card_id, note, due_at, done, outcome, created_at, updated_at) values (?, ?, ?, ?, ?, datetime('now'), datetime('now'))",
    [
      payload.job_card_id,
      payload.note,
      payload.due_at,
      payload.done,
      payload.outcome ?? "",
    ],
  );
  reconcileArtifactChecklist(db, payload.job_card_id);
  return id;
}
```

## OP-db-createResolvedFollowup

Source: src/db.ts:6730-6761

Dependencies: new Date().toISOString, db.run, insert, reconcileArtifactChecklist

```typescript
export function createResolvedFollowup(
  db: Database,
  payload: Omit<Followup, "id">,
  timestamp = new Date().toISOString(),
) {
  db.run("savepoint create_resolved_followup");
  try {
    const id = insert(
      db,
      "insert into followups(job_card_id, note, due_at, done, outcome, created_at, updated_at) values (?, ?, ?, 1, ?, ?, ?)",
      [
        payload.job_card_id,
        payload.note,
        payload.due_at,
        payload.outcome ?? "",
        timestamp,
        timestamp,
      ],
    );
    db.run(
      "update followups set done=1, updated_at=? where job_card_id=? and archived_at is null and done=0 and id<>?",
      [timestamp, payload.job_card_id, id],
    );
    reconcileArtifactChecklist(db, payload.job_card_id, 0, timestamp);
    db.run("release savepoint create_resolved_followup");
    return id;
  } catch (error) {
    db.run("rollback to savepoint create_resolved_followup");
    db.run("release savepoint create_resolved_followup");
    throw error;
  }
}
```

## OP-db-updateFollowup

Source: src/db.ts:6763-6772

Dependencies: db.run

```typescript
export function updateFollowup(
  db: Database,
  id: number,
  payload: Omit<Followup, "id">,
) {
  db.run(
    "update followups set note=?, due_at=?, done=?, outcome=?, updated_at=datetime('now') where id=?",
    [payload.note, payload.due_at, payload.done, payload.outcome ?? "", id],
  );
}
```

## OP-db-archiveFollowup

Source: src/db.ts:6774-6776

Dependencies: archive

```typescript
export function archiveFollowup(db: Database, id: number, reason: string) {
  archive(db, "followups", id, reason);
}
```

## OP-db-markFollowupDone

Source: src/db.ts:6778-6783

Dependencies: db.run

```typescript
export function markFollowupDone(db: Database, id: number, outcome: string) {
  db.run(
    "update followups set done=1, outcome=?, updated_at=datetime('now') where id=?",
    [outcome, id],
  );
}
```

## OP-db-addFollowup

Source: src/db.ts:6785-6793

Dependencies: createFollowup, new Date(Date.now() + 86400000).toISOString().slice, new Date(Date.now() + 86400000).toISOString, Date.now

```typescript
export function addFollowup(db: Database, jobId: number, note: string) {
  createFollowup(db, {
    job_card_id: jobId,
    note,
    due_at: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    done: 0,
    outcome: "",
  });
}
```

## OP-db-createPhoto

Source: src/db.ts:6795-6808

Dependencies: insert, reconcileArtifactChecklist

```typescript
export function createPhoto(db: Database, payload: Omit<Photo, "id">) {
  const id = insert(
    db,
    "insert into photos(job_card_id, label, src, category, created_at, updated_at) values (?, ?, ?, ?, datetime('now'), datetime('now'))",
    [
      payload.job_card_id,
      payload.label,
      payload.src,
      payload.category ?? "General",
    ],
  );
  reconcileArtifactChecklist(db, payload.job_card_id);
  return id;
}
```

## OP-db-updatePhoto

Source: src/db.ts:6810-6819

Dependencies: db.run

```typescript
export function updatePhoto(
  db: Database,
  id: number,
  payload: Omit<Photo, "id">,
) {
  db.run(
    "update photos set label=?, src=?, category=?, updated_at=datetime('now') where id=?",
    [payload.label, payload.src, payload.category ?? "General", id],
  );
}
```

## OP-db-archivePhoto

Source: src/db.ts:6821-6825

Dependencies: one, archive, resetMissingPhotoEvidence

```typescript
export function archivePhoto(db: Database, id: number, reason: string) {
  const photo = one<Photo>(db, "select * from photos where id=?", [id]);
  archive(db, "photos", id, reason);
  resetMissingPhotoEvidence(db, photo.job_card_id);
}
```

## OP-db-saveJobPhotoForActor

Source: src/db.ts:6877-6910

Dependencies: assertJobMediaMutationAccess, validatePhotoMetadata, validateMediaDataUrl, Number.isFinite, insert, input.originalName.trim, Math.round, reconcileArtifactChecklist

```typescript
export function saveJobPhotoForActor(
  db: Database,
  jobId: number,
  actorId: number,
  input: JobPhotoInput,
) {
  assertJobMediaMutationAccess(db, jobId, actorId, input.category);
  const metadata = validatePhotoMetadata(input.label, input.category);
  const image = validateMediaDataUrl(input.src);
  if (
    !Number.isFinite(input.width) ||
    input.width < 1 ||
    !Number.isFinite(input.height) ||
    input.height < 1
  )
    throw new Error("Image dimensions are invalid.");
  const id = insert(
    db,
    "insert into photos(job_card_id,label,src,category,mime_type,byte_size,original_name,width,height,created_at,updated_at) values(?,?,?,?,?,?,?,?,?,datetime('now'),datetime('now'))",
    [
      jobId,
      metadata.label,
      input.src,
      metadata.category,
      image.mimeType,
      image.byteSize,
      input.originalName.trim(),
      Math.round(input.width),
      Math.round(input.height),
    ],
  );
  reconcileArtifactChecklist(db, jobId, actorId);
  return id;
}
```

## OP-db-updateJobPhotoForActor

Source: src/db.ts:6912-6935

Dependencies: one, assertJobMediaMutationAccess, validatePhotoMetadata, db.run

```typescript
export function updateJobPhotoForActor(
  db: Database,
  id: number,
  actorId: number,
  input: Pick<JobPhotoInput, "label" | "category">,
) {
  const photo = one<Photo>(
    db,
    "select * from photos where id=? and archived_at is null",
    [id],
  );
  assertJobMediaMutationAccess(
    db,
    photo.job_card_id,
    actorId,
    photo.category === "After Work" ? "After Work" : "Before Work",
  );
  assertJobMediaMutationAccess(db, photo.job_card_id, actorId, input.category);
  const metadata = validatePhotoMetadata(input.label, input.category);
  db.run(
    "update photos set label=?,category=?,updated_at=datetime('now') where id=?",
    [metadata.label, metadata.category, id],
  );
}
```

## OP-db-archiveJobPhotoForActor

Source: src/db.ts:6937-6956

Dependencies: one, assertJobMediaMutationAccess, reason.trim, archivePhoto

```typescript
export function archiveJobPhotoForActor(
  db: Database,
  id: number,
  actorId: number,
  reason: string,
) {
  const photo = one<Photo>(
    db,
    "select * from photos where id=? and archived_at is null",
    [id],
  );
  assertJobMediaMutationAccess(
    db,
    photo.job_card_id,
    actorId,
    photo.category === "After Work" ? "After Work" : "Before Work",
  );
  if (!reason.trim()) throw new Error("An archive reason is required.");
  archivePhoto(db, id, reason.trim());
}
```

## OP-db-addPhoto

Source: src/db.ts:6958-6960

Dependencies: createPhoto

```typescript
export function addPhoto(db: Database, jobId: number, label: string) {
  createPhoto(db, { job_card_id: jobId, label, src: "", category: "General" });
}
```

## OP-db-searchJobs

Source: src/db.ts:6962-7030

Dependencies: criteria.query.trim().toLowerCase, criteria.query.trim, state.jobs.flatMap, view.estimate_items.map, view.photos.map, view.material_movements.map, view.payments.map, view.payments.flatMap, (
      Object.keys(searchable) as Exclude<SearchCriteria["category"], "all">[]
    ).filter, Object.keys, searchable[category].join(" ").toLowerCase().includes, searchable[category].join(" ").toLowerCase, searchable[category].join, categories.filter

```typescript
export function searchJobs(
  state: WorkshopState,
  criteria: SearchCriteria,
): SearchResult[] {
  const normalizedQuery = criteria.query.trim().toLowerCase();
  return state.jobs.flatMap((view) => {
    if (criteria.status !== "ALL" && view.job.main_status !== criteria.status)
      return [];
    const searchable: Record<
      Exclude<SearchCriteria["category"], "all">,
      string[]
    > = {
      job: [
        view.job.job_no,
        view.advisor.name,
        view.job.work_list,
        ...view.estimate_items.map((item) => item.description),
        ...view.photos.map((photo) => `${photo.label} ${photo.category}`),
        ...view.material_movements.map(
          (movement) => `${movement.direction} ${movement.note}`,
        ),
      ],
      customer: [view.customer.name, view.customer.mobile],
      vehicle: [
        view.vehicle.number,
        view.vehicle.make,
        view.vehicle.model,
        view.vehicle.color,
      ],
      invoice: [
        view.invoice?.invoice_no ?? "",
        view.invoice?.tally_invoice_no ?? "",
        ...view.payments.map(
          (payment) => `${payment.mode} ${payment.reference}`,
        ),
      ],
      payment: view.payments.flatMap((payment) => [
        view.job.job_no,
        view.invoice?.invoice_no ?? "",
        view.invoice?.tally_invoice_no ?? "",
        view.customer.name,
        view.customer.mobile,
        view.vehicle.number,
        payment.mode,
        payment.reference,
        payment.other_detail,
      ]),
    };
    const categories = (
      Object.keys(searchable) as Exclude<SearchCriteria["category"], "all">[]
    ).filter((category) =>
      searchable[category].join(" ").toLowerCase().includes(normalizedQuery),
    );
    const permitted =
      criteria.category === "all"
        ? categories
        : categories.filter((category) => category === criteria.category);
    if (normalizedQuery && permitted.length === 0) return [];
    return [
      {
        view,
        match: {
          categories: normalizedQuery ? permitted : [],
          normalizedQuery,
        },
      },
    ];
  });
}
```

## OP-db-closureBlockers

Source: src/db.ts:7071-7095

Dependencies: blockers.push, view.material_requests.some, Math.abs, view.payments.reduce

```typescript
export function closureBlockers(view?: JobView) {
  if (!view) return ["Select a job"];
  const blockers: string[] = [];
  if (view.job.qc_status !== "Pass") blockers.push("QC pass required");
  if (
    view.material_requests.some(
      (request) =>
        Math.abs(
          request.issued_qty -
            request.used_qty -
            request.returned_qty -
            request.wasted_qty,
        ) > 0.001,
    )
  )
    blockers.push("Material reconciliation required");
  if (!view.invoice || view.invoice.voided_at || !view.invoice.tally_invoice_no)
    blockers.push("Available Tally invoice required");
  const paid = view.payments.reduce((sum, payment) => sum + payment.amount, 0);
  if (!view.invoice || paid < view.invoice.total)
    blockers.push("Full payment required");
  if (!view.receipt) blockers.push("Receipt required");
  if (!view.gate_pass) blockers.push("Gate pass required");
  return blockers;
}
```

## OP-db-paymentStatus

Source: src/db.ts:7097-7105

Dependencies: invoiceItemsTotal, view.payments.reduce

```typescript
export function paymentStatus(view: JobView): PaymentStatus {
  const total =
    view.invoice?.total ??
    invoiceItemsTotal(view.estimate_items, view.estimate);
  const paid = view.payments.reduce((sum, payment) => sum + payment.amount, 0);
  if (paid <= 0) return "Pending";
  if (paid < total) return "Partial";
  return "Paid";
}
```

## OP-db-invoiceItemsTotal

Source: src/db.ts:7107-7120

Dependencies: invoiceTotals, items.map, normalizeGstLine

```typescript
export function invoiceItemsTotal(items: EstimateItem[], estimate?: Estimate) {
  return invoiceTotals(
    items.map((item) => ({
      qty: item.qty,
      rate: item.rate,
      ...normalizeGstLine(
        item.gst_type,
        item.gst_rate,
        estimate?.gst_rate ?? 18,
      ),
    })),
    estimate?.discount ?? 0,
  ).total;
}
```

## OP-db-createSchema

Source: src/db.ts:7122-7176

Dependencies: db.run

```typescript
export function createSchema(db: Database) {
  db.run(`
    create table if not exists users(id integer primary key, email text unique, name text, role text, password text);
    create table if not exists customers(id integer primary key, name text, mobile text unique, type text, address text);
    create table if not exists vehicles(id integer primary key, customer_id integer, number text unique, make text, model text, color text, km integer, engine_no text);
    create table if not exists visits(id integer primary key, customer_id integer, vehicle_id integer, advisor_id integer, received_by integer, received_at text, fuel text, odo_reading real, fuel_level_value text, fuel_level_unit text, keys text, accessories text, requested_work text, photos_note text);
    create table if not exists job_cards(id integer primary key, job_no text unique, visit_id integer, advisor_id integer, technician_id integer, main_status text, sub_status text, work_list text, promised_at text, qc_status text, washing_needed integer, closed_at text, service_type text, pickup_drop text, estimated_delivery text, damage_marks text, damage_marks_recorded_at text);
    create table if not exists status_history(id integer primary key, job_card_id integer, main_status text, sub_status text, note text, created_at text);
    create table if not exists checklist_cycles(id integer primary key, job_card_id integer not null, stage text not null, cycle_number integer not null, started_at text not null, completed_at text, unique(job_card_id, stage, cycle_number));
    create table if not exists checklist_items(id integer primary key, checklist_cycle_id integer not null, job_card_id integer not null, stage text not null, cycle_number integer not null, item_key text not null, label text not null, sort_order integer not null, checked_by integer, checked_at text, started_at text, completed_at text, unique(checklist_cycle_id, item_key));
    create table if not exists estimates(id integer primary key, job_card_id integer, status text, discount real, gst_rate real, approval_note text);
    create table if not exists estimate_items(id integer primary key, estimate_id integer, kind text, description text, qty real, rate real, gst_type text, gst_rate real);
    create table if not exists approvals(id integer primary key, job_card_id integer, approved_by text, note text, created_at text);
    create table if not exists tasks(id integer primary key, job_card_id integer, technician_id integer, title text, status text, notes text);
    create table if not exists qc_checks(id integer primary key, job_card_id integer, label text, passed integer);
    create table if not exists invoices(id integer primary key, job_card_id integer, invoice_no text, tally_invoice_no text, discount real default 0, gst_rate real default 18, subtotal real default 0, gst_amount real default 0, total real, status text, notes text default '', document_available integer default 1, document_generated_at text);
    create table if not exists invoice_items(id integer primary key, invoice_id integer, kind text, description text, qty real, rate real, gst_type text, gst_rate real);
    create table if not exists payments(id integer primary key, job_card_id integer, invoice_id integer, amount real, mode text, other_detail text default '', reference text, notes text default '');
    create table if not exists receipts(id integer primary key, job_card_id integer, invoice_id integer, receipt_no text, voided_at text, void_reason text, created_at text);
    create table if not exists gate_passes(id integer primary key, job_card_id integer, invoice_id integer, gate_pass_no text, voided_at text, void_reason text, created_at text);
    create table if not exists inventory(id integer primary key, sku text, category text, name text, unit text, stock_qty real, low_stock_qty real, selling_price real default 0);
    create table if not exists material_requests(id integer primary key, job_card_id integer, item_id integer, requested_qty real, issued_qty real, used_qty real, returned_qty real, wasted_qty real);
    create table if not exists material_approvals(id integer primary key, job_card_id integer not null unique, status text not null, submitted_by integer not null, submitted_at text not null, reviewed_by integer, reviewed_at text, rejection_reason text, revision integer not null default 1);
    create table if not exists material_approval_events(id integer primary key, approval_id integer not null, job_card_id integer not null, action text not null, actor_id integer not null, at text not null, note text not null, revision integer not null);
    create table if not exists local_purchases(id integer primary key, job_card_id integer, item_description text, quantity real, unit text, unit_cost real, vendor text, bill_reference text, note text, archived_at text, archived_reason text, created_at text, updated_at text);
    create table if not exists material_purchase_requests(id integer primary key, job_card_id integer not null, item_name text not null, quantity real not null, unit text not null, status text not null default 'Pending', mapped_inventory_item_id integer, material_request_id integer, local_purchase_id integer, completed_by integer, completed_at text, created_at text, updated_at text);
    create table if not exists material_movements(id integer primary key, job_card_id integer, item_id integer, direction text, qty real, note text, created_at text);
    create table if not exists suppliers(id integer primary key, name text not null, contact_name text default '', phone text default '', email text default '', gstin text default '', status text not null default 'Active', created_by integer not null, created_at text not null, updated_at text not null);
    create table if not exists inward_purchases(id integer primary key, supplier_id integer, supplier_invoice_no text default '', invoice_date text default '', po_number text default '', status text not null default 'Draft', subtotal real not null default 0, discount_total real not null default 0, gst_total real not null default 0, total real not null default 0, created_by integer not null, submitted_by integer, submitted_at text, purchase_order_id integer, approved_by integer, approved_at text, created_at text not null, updated_at text not null);
    create table if not exists inward_purchase_lines(id integer primary key, purchase_id integer not null, item_id integer not null, received_qty real not null, unit_cost real not null, discount real not null default 0, gst_rate real not null default 0, subtotal real not null, gst_amount real not null, total real not null, purchase_order_line_id integer);
    create table if not exists inward_purchase_attachments(id integer primary key, purchase_id integer not null, original_name text not null, mime_type text not null, byte_size integer not null, storage_key text not null, document_url text not null, uploaded_by integer not null, uploaded_at text not null);
    create table if not exists inward_purchase_revisions(id integer primary key, purchase_id integer not null, revision_no integer not null, reason text not null, revised_by integer not null, revised_at text not null, unique(purchase_id, revision_no));
    create table if not exists inward_purchase_revision_lines(id integer primary key, revision_id integer not null, item_id integer not null, received_qty real not null, unit_cost real not null, discount real not null default 0, gst_rate real not null default 0, subtotal real not null, gst_amount real not null, total real not null);
    create table if not exists inward_purchase_events(id integer primary key, purchase_id integer not null, kind text not null, actor_id integer not null, at text not null, note text not null);
    create table if not exists purchase_orders(id integer primary key, supplier_id integer not null, po_number text not null, order_date text not null, notes text not null default '', status text not null default 'Draft', subtotal real not null default 0, discount_total real not null default 0, gst_total real not null default 0, total real not null default 0, created_by integer not null, created_at text not null, updated_at text not null, source_purchase_order_id integer);
    create unique index if not exists purchase_orders_number_unique on purchase_orders(po_number);
    create table if not exists purchase_order_lines(id integer primary key, purchase_order_id integer not null, item_id integer not null, item_name text not null default '', unit text not null default '', ordered_qty real not null, unit_cost real not null, discount real not null default 0, gst_rate real not null, subtotal real not null, gst_amount real not null, total real not null, source_purchase_order_line_id integer);
    create table if not exists purchase_order_quotations(id integer primary key, purchase_order_id integer not null, purchase_order_line_id integer not null, supplier_name text not null, quote_date text not null, quoted_qty real not null, unit_cost real not null, notes text not null default '', created_by integer not null, created_at text not null, updated_at text not null);
    create table if not exists purchase_order_receipts(id integer primary key, purchase_order_id integer not null, received_by integer not null, received_at text not null, note text not null default '');
    create table if not exists purchase_order_receipt_lines(id integer primary key, purchase_order_receipt_id integer not null, purchase_order_line_id integer not null, delivered_qty real not null);
    create table if not exists purchase_order_confirmations(id integer primary key, purchase_order_id integer not null, purchase_order_line_id integer not null unique, accepted_qty real not null, returned_qty real not null, damaged_qty real not null, wasted_qty real not null, confirmed_by integer not null, confirmed_at text not null);
    create table if not exists stock_inwards(id integer primary key, item_id integer not null, qty real not null, note text not null default '', purchase_order_id integer, purchase_order_line_id integer, ledger_id integer, received_by integer not null default 0, received_at text not null);
    create table if not exists photos(id integer primary key, job_card_id integer, label text, src text);
    create table if not exists followups(id integer primary key, job_card_id integer, note text, due_at text, done integer);
    create table if not exists service_catalog_items(id integer primary key, name text not null, base_rate real not null, gst_rate real not null default 18, service_department_id integer, brand_id integer, car_segment_id integer, archived_at text, archived_reason text, created_at text, updated_at text);
    create table if not exists service_brands(id integer primary key, name text not null unique, status text not null default 'ACTIVE', created_at text not null, updated_at text not null);
    create table if not exists car_segments(id integer primary key, name text not null unique, status text not null default 'ACTIVE', created_at text not null, updated_at text not null);
    create table if not exists job_task_list_items(id integer primary key, job_card_id integer not null, service_catalog_item_id integer, name text not null, base_rate real not null, gst_rate real not null default 18, done integer not null default 0, archived_at text, archived_reason text, created_at text, updated_at text);
    create table if not exists bookings(id integer primary key, customer_id integer, vehicle_id integer, customer_name text not null, mobile text not null, customer_type text not null default 'Individual', vehicle_no text not null, make text not null, model text not null, color text not null default '', requested_work text not null, service_type text not null default 'Service Work', booking_date text not null, arrival_window text not null default '', status text not null default 'Booked', created_by integer not null, confirmed_at text, arrived_at text, rescheduled_at text, cancelled_at text, no_show_at text, reschedule_reason text, cancellation_reason text, no_show_reason text, visit_id integer, job_card_id integer, created_at text not null, updated_at text not null);
    create table if not exists booking_call_logs(id integer primary key, booking_id integer not null, note text not null, called_by integer not null, called_at text not null);
    create table if not exists booking_events(id integer primary key, booking_id integer not null, kind text not null, actor_id integer not null, at text not null, note text not null default '', previous_booking_date text, booking_date text not null);
    create table if not exists booking_capacity_limits(booking_date text primary key, service_work_capacity integer not null default 8, general_checkup_followup_capacity integer not null default 4, set_by integer not null, updated_at text not null);
    create table if not exists booking_capacity_overrides(id integer primary key, booking_id integer not null, booking_date text not null, reason text not null, approved_by integer not null, approved_at text not null);
  `);
}
```

## OP-db-migrateSchema

Source: src/db.ts:7178-7489

Dependencies: db.run, ensureColumn, all<{ name: string }>(db, "pragma table_info(booking_capacity_limits)").some, all, [
    "users",
    "customers",
    "vehicles",
    "visits",
    "job_cards",
    "estimates",
    "estimate_items",
    "invoice_items",
    "tasks",
    "inventory",
    "material_requests",
    "photos",
    "followups",
  ].forEach, ["archived_at", "archived_reason", "created_at", "updated_at"].forEach, ["invoices", "payments"].forEach, scalar, maybe, insert, recalculateInvoice, syncInvoicePaymentStatus, migrateLifecycleStorage

```typescript
export function migrateSchema(db: Database) {
  db.run("create table if not exists service_departments(id integer primary key, name text not null unique, status text not null default 'ACTIVE', created_at text not null, updated_at text not null)");
  db.run("create table if not exists service_brands(id integer primary key, name text not null unique, status text not null default 'ACTIVE', created_at text not null, updated_at text not null)");
  db.run("create table if not exists car_segments(id integer primary key, name text not null unique, status text not null default 'ACTIVE', created_at text not null, updated_at text not null)");
  db.run("create table if not exists service_department_managers(department_id integer not null, manager_id integer not null, primary key(department_id, manager_id))");
  db.run("create table if not exists service_advisor_teams(department_id integer not null, manager_id integer not null, advisor_id integer not null unique, primary key(department_id, advisor_id))");
  db.run("create table if not exists sales_leads(id integer primary key, display_name text not null, phone text not null, company text not null default '', company_not_entered integer not null default 0, email text not null default '', email_not_entered integer not null default 0, address text not null default '', service_interest text not null default '', notes text not null default '', stage text not null default 'NEW', temperature text not null default 'WARM', follow_up_due text, site_visit_completed integer not null default 0, site_visit_date text, created_at text not null, updated_at text not null)");
  db.run("create table if not exists sales_quotations(id integer primary key, lead_id integer not null, quotation_no text not null unique, status text not null default 'DRAFT', valid_until text, customer_notes text not null default '', discount real not null default 0, subtotal real not null default 0, gst_amount real not null default 0, total real not null default 0, template_id text not null, template_html text not null, created_at text not null, updated_at text not null)");
  db.run("create table if not exists sales_quotation_lines(id integer primary key, quotation_id integer not null, line_no integer not null, kind text not null, description text not null, quantity real not null, rate real not null, gst_rate real not null)");
  db.run(
    "create table if not exists service_catalog_items(id integer primary key, name text not null, base_rate real not null, gst_rate real not null default 18, service_department_id integer, brand_id integer, car_segment_id integer, archived_at text, archived_reason text, created_at text, updated_at text)",
  );
  db.run(
    "create table if not exists job_task_list_items(id integer primary key, job_card_id integer not null, service_catalog_item_id integer, name text not null, base_rate real not null, gst_rate real not null default 18, done integer not null default 0, archived_at text, archived_reason text, created_at text, updated_at text)",
  );
  ensureColumn(db, "service_catalog_items", "gst_rate", "real not null default 18");
  ensureColumn(db, "service_catalog_items", "service_department_id", "integer");
  ensureColumn(db, "service_catalog_items", "brand_id", "integer");
  ensureColumn(db, "service_catalog_items", "car_segment_id", "integer");
  ensureColumn(db, "job_task_list_items", "gst_rate", "real not null default 18");
  ensureColumn(db, "sales_leads", "company_not_entered", "integer not null default 0");
  ensureColumn(db, "sales_leads", "email_not_entered", "integer not null default 0");
  db.run("update service_catalog_items set gst_rate=18 where gst_rate is null");
  db.run("update job_task_list_items set gst_rate=18 where gst_rate is null");
  ensureColumn(db, "estimate_items", "task_list_item_id", "integer");
  db.run(
    "create table if not exists bookings(id integer primary key, customer_id integer, vehicle_id integer, customer_name text not null default '', mobile text not null default '', customer_type text not null default 'Individual', vehicle_no text not null default '', make text not null default '', model text not null default '', color text not null default '', requested_work text not null default '', booking_date text not null default '', arrival_window text not null default '', status text not null default 'Booked', created_by integer not null default 0, confirmed_at text, arrived_at text, rescheduled_at text, cancelled_at text, no_show_at text, reschedule_reason text, cancellation_reason text, no_show_reason text, visit_id integer, job_card_id integer, created_at text not null default '', updated_at text not null default '')",
  );
  ensureColumn(db, "bookings", "visit_id", "integer");
  ensureColumn(db, "bookings", "job_card_id", "integer");
  ensureColumn(db, "bookings", "service_type", "text not null default 'Service Work'");
  db.run("update bookings set service_type='Service Work' where service_type is null or service_type='' ");
  db.run(
    "create table if not exists booking_call_logs(id integer primary key, booking_id integer not null, note text not null, called_by integer not null, called_at text not null)",
  );
  db.run(
    "create table if not exists booking_events(id integer primary key, booking_id integer not null, kind text not null, actor_id integer not null, at text not null, note text not null default '', previous_booking_date text, booking_date text not null default '')",
  );
  db.run(
    "create table if not exists booking_capacity_limits(booking_date text primary key, service_work_capacity integer not null default 8, general_checkup_followup_capacity integer not null default 4, set_by integer not null, updated_at text not null)",
  );
  ensureColumn(db, "booking_capacity_limits", "service_work_capacity", "integer");
  ensureColumn(db, "booking_capacity_limits", "general_checkup_followup_capacity", "integer");
  const hasLegacyBookingCapacity = all<{ name: string }>(db, "pragma table_info(booking_capacity_limits)").some((column) => column.name === "capacity");
  db.run(hasLegacyBookingCapacity
    ? "update booking_capacity_limits set service_work_capacity=coalesce(service_work_capacity,capacity,8),general_checkup_followup_capacity=coalesce(general_checkup_followup_capacity,4)"
    : "update booking_capacity_limits set service_work_capacity=coalesce(service_work_capacity,8),general_checkup_followup_capacity=coalesce(general_checkup_followup_capacity,4)");
  db.run(
    "create table if not exists booking_capacity_overrides(id integer primary key, booking_id integer not null, booking_date text not null, reason text not null, approved_by integer not null, approved_at text not null)",
  );
  db.run(
    "create table if not exists advisor_attendance(user_id integer not null, date text not null, present integer not null default 1, primary key(user_id, date))",
  );
  db.run(
    "create table if not exists material_events(id integer primary key, job_card_id integer, material_row_id integer, kind text, by_user integer, at text, note text, old_item_id integer, old_qty real, new_item_id integer, new_qty real)",
  );
  db.run(
    "create table if not exists stock_ledger(id integer primary key, job_card_id integer, material_row_id integer, item_id integer, qty real, type text, by_user integer, at text, note text)",
  );
  ensureColumn(db, "stock_ledger", "inward_purchase_line_id", "integer");
  db.run(
    "create table if not exists suppliers(id integer primary key, name text not null, contact_name text default '', phone text default '', email text default '', gstin text default '', status text not null default 'Active', created_by integer not null default 0, created_at text not null default '', updated_at text not null default '')",
  );
  db.run(
    "create table if not exists inward_purchases(id integer primary key, supplier_id integer, supplier_invoice_no text default '', invoice_date text default '', po_number text default '', status text not null default 'Draft', subtotal real not null default 0, discount_total real not null default 0, gst_total real not null default 0, total real not null default 0, created_by integer not null default 0, submitted_by integer, submitted_at text, created_at text not null default '', updated_at text not null default '')",
  );
  db.run(
    "create table if not exists inward_purchase_lines(id integer primary key, purchase_id integer not null, item_id integer not null, received_qty real not null, unit_cost real not null, discount real not null default 0, gst_rate real not null default 0, subtotal real not null, gst_amount real not null, total real not null)",
  );
  db.run(
    "create table if not exists inward_purchase_attachments(id integer primary key, purchase_id integer not null, original_name text not null, mime_type text not null, byte_size integer not null, storage_key text not null, document_url text not null, uploaded_by integer not null default 0, uploaded_at text not null default '')",
  );
  db.run(
    "create table if not exists inward_purchase_revisions(id integer primary key, purchase_id integer not null, revision_no integer not null, reason text not null, revised_by integer not null, revised_at text not null, unique(purchase_id, revision_no))",
  );
  db.run(
    "create table if not exists inward_purchase_revision_lines(id integer primary key, revision_id integer not null, item_id integer not null, received_qty real not null, unit_cost real not null, discount real not null default 0, gst_rate real not null default 0, subtotal real not null, gst_amount real not null, total real not null)",
  );
  db.run(
    "create table if not exists inward_purchase_events(id integer primary key, purchase_id integer not null, kind text not null, actor_id integer not null, at text not null, note text not null)",
  );
  db.run(
    "create table if not exists purchase_orders(id integer primary key, supplier_id integer not null, po_number text not null, order_date text not null, notes text not null default '', status text not null default 'Draft', subtotal real not null default 0, discount_total real not null default 0, gst_total real not null default 0, total real not null default 0, created_by integer not null, created_at text not null, updated_at text not null)",
  );
  db.run(
    "create unique index if not exists purchase_orders_number_unique on purchase_orders(po_number)",
  );
  db.run(
    "create table if not exists purchase_order_lines(id integer primary key, purchase_order_id integer not null, item_id integer not null, ordered_qty real not null, unit_cost real not null, discount real not null default 0, gst_rate real not null default 0, subtotal real not null, gst_amount real not null, total real not null)",
  );
  ensureColumn(db, "purchase_order_lines", "item_name", "text not null default ''");
  ensureColumn(db, "purchase_order_lines", "unit", "text not null default ''");
  ensureColumn(db, "purchase_orders", "source_purchase_order_id", "integer");
  ensureColumn(db, "purchase_order_lines", "source_purchase_order_line_id", "integer");
  db.run(
    "create table if not exists purchase_order_quotations(id integer primary key, purchase_order_id integer not null, purchase_order_line_id integer not null, supplier_name text not null, quote_date text not null, quoted_qty real not null, unit_cost real not null, notes text not null default '', created_by integer not null, created_at text not null, updated_at text not null)",
  );
  db.run(
    "create table if not exists purchase_order_receipts(id integer primary key, purchase_order_id integer not null, received_by integer not null, received_at text not null, note text not null default '')",
  );
  db.run(
    "create table if not exists purchase_order_receipt_lines(id integer primary key, purchase_order_receipt_id integer not null, purchase_order_line_id integer not null, delivered_qty real not null)",
  );
  db.run(
    "create table if not exists purchase_order_confirmations(id integer primary key, purchase_order_id integer not null, purchase_order_line_id integer not null unique, accepted_qty real not null, returned_qty real not null, damaged_qty real not null, wasted_qty real not null, confirmed_by integer not null, confirmed_at text not null)",
  );
  db.run(
    "create table if not exists stock_inwards(id integer primary key, item_id integer not null, qty real not null, note text not null default '', purchase_order_id integer, purchase_order_line_id integer, ledger_id integer, received_by integer not null default 0, received_at text not null)",
  );
  db.run(
    "create unique index if not exists inward_supplier_invoice_submitted on inward_purchases(supplier_id, supplier_invoice_no) where status='Submitted'",
  );
  ensureColumn(db, "inward_purchases", "purchase_order_id", "integer");
  ensureColumn(db, "inward_purchases", "approved_by", "integer");
  ensureColumn(db, "inward_purchases", "approved_at", "text");
  ensureColumn(
    db,
    "inward_purchase_lines",
    "purchase_order_line_id",
    "integer",
  );
  // Legacy posted receipts already affected stock; retain them as read-only received history.
  db.run(
    "update inward_purchases set status='Received' where status='Submitted'",
  );
  db.run("drop index if exists inward_supplier_invoice_submitted");
  db.run(
    "create unique index if not exists inward_supplier_invoice_received on inward_purchases(supplier_id, supplier_invoice_no) where status in ('Received','Submitted')",
  );
  db.run(
    "create table if not exists local_purchases(id integer primary key, job_card_id integer, item_description text, quantity real, unit text, unit_cost real, vendor text, bill_reference text, note text, archived_at text, archived_reason text, created_at text, updated_at text)",
  );
  db.run(
    "create table if not exists material_purchase_requests(id integer primary key, job_card_id integer not null, item_name text not null, quantity real not null, unit text not null, status text not null default 'Pending', mapped_inventory_item_id integer, material_request_id integer, local_purchase_id integer, completed_by integer, completed_at text, created_at text, updated_at text)",
  );
  ensureColumn(
    db,
    "material_requests",
    "status",
    "text not null default 'Requested'",
  );
  db.run(
    "create table if not exists material_approvals(id integer primary key, job_card_id integer not null unique, status text not null, submitted_by integer not null, submitted_at text not null, reviewed_by integer, reviewed_at text, rejection_reason text, revision integer not null default 1)",
  );
  db.run(
    "create table if not exists material_approval_events(id integer primary key, approval_id integer not null, job_card_id integer not null, action text not null, actor_id integer not null, at text not null, note text not null, revision integer not null)",
  );
  ensureColumn(db, "material_requests", "invoiced_in", "integer");
  ensureColumn(db, "estimate_items", "gst_type", "text");
  ensureColumn(db, "estimate_items", "gst_rate", "real");
  ensureColumn(db, "invoice_items", "gst_type", "text");
  ensureColumn(db, "invoice_items", "gst_rate", "real");
  ensureColumn(db, "invoice_items", "material_row_id", "integer");
  db.run(
    "create table if not exists invoice_events(id integer primary key, job_card_id integer, invoice_id integer, kind text, by_user integer, at text, note text, old_total real, new_total real, detail text)",
  );
  db.run(
    "update estimate_items set gst_rate=(select gst_rate from estimates where estimates.id=estimate_items.estimate_id) where gst_rate is null",
  );
  db.run(
    "update invoice_items set gst_rate=(select gst_rate from invoices where invoices.id=invoice_items.invoice_id) where gst_rate is null",
  );
  db.run(
    "update estimate_items set gst_type=case when coalesce(gst_rate, 18)=0 then 'No GST' else 'CGST+SGST' end where gst_type is null",
  );
  db.run(
    "update invoice_items set gst_type=case when coalesce(gst_rate, 18)=0 then 'No GST' else 'CGST+SGST' end where gst_type is null",
  );
  ensureColumn(db, "material_requests", "note", "text");
  ensureColumn(db, "inventory", "selling_price", "real default 0");
  db.run("update inventory set selling_price=0 where selling_price is null");
  db.run(
    "update material_requests set status='Issued' where status='Requested' and issued_qty>0 and issued_qty>=requested_qty",
  );
  [
    "users",
    "customers",
    "vehicles",
    "visits",
    "job_cards",
    "estimates",
    "estimate_items",
    "invoice_items",
    "tasks",
    "inventory",
    "material_requests",
    "photos",
    "followups",
  ].forEach((table) => {
    ensureColumn(db, table, "archived_at", "text");
    ensureColumn(db, table, "archived_reason", "text");
    ensureColumn(db, table, "created_at", "text");
    ensureColumn(db, table, "updated_at", "text");
  });
  ["archived_at", "archived_reason", "created_at", "updated_at"].forEach(
    (column) => ensureColumn(db, "local_purchases", column, "text"),
  );
  ensureColumn(db, "local_purchases", "note", "text");
  ["invoices", "payments"].forEach((table) => {
    ensureColumn(db, table, "voided_at", "text");
    ensureColumn(db, table, "void_reason", "text");
    ensureColumn(db, table, "created_at", "text");
    ensureColumn(db, table, "updated_at", "text");
  });
  ensureColumn(db, "invoices", "discount", "real default 0");
  ensureColumn(db, "invoices", "gst_rate", "real default 18");
  ensureColumn(db, "invoices", "subtotal", "real default 0");
  ensureColumn(db, "invoices", "gst_amount", "real default 0");
  ensureColumn(db, "invoices", "notes", "text default ''");
  ensureColumn(db, "invoices", "document_available", "integer default 1");
  ensureColumn(db, "invoices", "document_generated_at", "text");
  // Retain the legacy column for stored-data compatibility, but active invoices
  // are documents by definition. Backfill generation metadata at the same time.
  db.run(
    "update invoices set document_available=1,document_generated_at=coalesce(document_generated_at,created_at,datetime('now')) where voided_at is null",
  );
  ensureColumn(db, "payments", "invoice_id", "integer");
  ensureColumn(db, "payments", "other_detail", "text default ''");
  ensureColumn(db, "payments", "notes", "text default ''");
  for (const table of ["receipts", "gate_passes"]) {
    ensureColumn(db, table, "invoice_id", "integer");
    ensureColumn(db, table, "voided_at", "text");
    ensureColumn(db, table, "void_reason", "text");
    ensureColumn(db, table, "created_at", "text");
  }
  db.run(
    "update invoices set status='Pending' where status in ('Open','Draft','Generated')",
  );
  db.run(
    "update payments set invoice_id=(select id from invoices where invoices.job_card_id=payments.job_card_id and invoices.voided_at is null order by id desc limit 1) where invoice_id is null",
  );
  db.run(
    "update receipts set invoice_id=(select id from invoices where invoices.job_card_id=receipts.job_card_id and invoices.voided_at is null order by id desc limit 1) where invoice_id is null",
  );
  db.run(
    "update gate_passes set invoice_id=(select id from invoices where invoices.job_card_id=gate_passes.job_card_id and invoices.voided_at is null order by id desc limit 1) where invoice_id is null",
  );
  for (const invoice of all<Invoice>(
    db,
    "select * from invoices where voided_at is null order by id",
  )) {
    if (
      scalar<number>(
        db,
        "select count(*) from invoice_items where invoice_id=?",
        [invoice.id],
      ) === 0
    ) {
      const estimate = maybe<Estimate>(
        db,
        "select * from estimates where job_card_id=? and archived_at is null order by id desc limit 1",
        [invoice.job_card_id],
      );
      if (estimate) {
        for (const item of all<EstimateItem>(
          db,
          "select * from estimate_items where estimate_id=? and archived_at is null order by id",
          [estimate.id],
        )) {
          insert(
            db,
            "insert into invoice_items(invoice_id,kind,description,qty,rate,created_at,updated_at) values(?,?,?,?,?,datetime('now'),datetime('now'))",
            [invoice.id, item.kind, item.description, item.qty, item.rate],
          );
        }
        db.run("update invoices set discount=?,gst_rate=? where id=?", [
          estimate.discount,
          estimate.gst_rate,
          invoice.id,
        ]);
        if (
          scalar<number>(
            db,
            "select count(*) from invoice_items where invoice_id=?",
            [invoice.id],
          ) > 0
        )
          recalculateInvoice(db, invoice.id);
      }
    }
    syncInvoicePaymentStatus(db, invoice.id);
  }
  ensureColumn(db, "job_cards", "advisor_notes", "text");
  ensureColumn(db, "job_cards", "customer_instructions", "text");
  ensureColumn(db, "job_cards", "internal_instructions", "text");
  ensureColumn(db, "job_cards", "delivery_by", "text");
  ensureColumn(db, "job_cards", "final_km", "real");
  ensureColumn(db, "job_cards", "acknowledgement", "text");
  ensureColumn(db, "job_cards", "service_type", "text");
  ensureColumn(db, "job_cards", "pickup_drop", "text");
  ensureColumn(db, "job_cards", "estimated_delivery", "text");
  ensureColumn(db, "job_cards", "damage_marks", "text");
  ensureColumn(db, "job_cards", "damage_marks_recorded_at", "text");
  ensureColumn(db, "visits", "odo_reading", "real");
  ensureColumn(db, "visits", "fuel_level_value", "text");
  ensureColumn(db, "visits", "fuel_level_unit", "text");
  ensureColumn(db, "vehicles", "engine_no", "text");
  ensureColumn(db, "customers", "address", "text");
  ensureColumn(db, "tasks", "started_at", "text");
  ensureColumn(db, "tasks", "paused_at", "text");
  ensureColumn(db, "tasks", "completed_at", "text");
  ensureColumn(db, "qc_checks", "fail_reason", "text");
  ensureColumn(db, "qc_checks", "archived_at", "text");
  ensureColumn(db, "photos", "category", "text");
  ensureColumn(db, "photos", "mime_type", "text");
  ensureColumn(db, "photos", "byte_size", "integer");
  ensureColumn(db, "photos", "original_name", "text");
  ensureColumn(db, "photos", "width", "integer");
  ensureColumn(db, "photos", "height", "integer");
  ensureColumn(db, "followups", "outcome", "text");
  migrateLifecycleStorage(db);
}
```

## OP-db-migrateLifecycleStorage

Source: src/db.ts:7491-7521

Dependencies: db.run, ensureColumn, OPTIONAL_CHECKLIST_ITEMS.map((label) => `'${label}'`).join, OPTIONAL_CHECKLIST_ITEMS.map, backfillGoogleReviewReminder, all<{
    id: number;
    main_status: MainStatus;
    sub_status: SubStatus;
    created_at: string | null;
  }>(
    db,
    "select id, main_status, sub_status, created_at from job_cards",
  ).forEach, all, ensureLifecycleChecklist, syncSubStatusFromChecklist

```typescript
export function migrateLifecycleStorage(db: Database) {
  db.run(`
    create table if not exists checklist_cycles(id integer primary key, job_card_id integer not null, stage text not null, cycle_number integer not null, started_at text not null, completed_at text, unique(job_card_id, stage, cycle_number));
    create table if not exists checklist_items(id integer primary key, checklist_cycle_id integer not null, job_card_id integer not null, stage text not null, cycle_number integer not null, item_key text not null, label text not null, sort_order integer not null, checked_by integer, checked_at text, started_at text, completed_at text, unique(checklist_cycle_id, item_key));
  `);
  ensureColumn(db, "checklist_items", "required", "integer not null default 1");
  ensureColumn(db, "checklist_items", "na_at", "text");
  ensureColumn(db, "checklist_items", "na_by", "integer");
  db.run(
    `update checklist_items set required=case when label in (${OPTIONAL_CHECKLIST_ITEMS.map((label) => `'${label}'`).join(",")}) then 0 else 1 end`,
  );
  backfillGoogleReviewReminder(db);
  all<{
    id: number;
    main_status: MainStatus;
    sub_status: SubStatus;
    created_at: string | null;
  }>(
    db,
    "select id, main_status, sub_status, created_at from job_cards",
  ).forEach((job) => {
    ensureLifecycleChecklist(
      db,
      job.id,
      job.main_status,
      job.sub_status,
      job.created_at ?? undefined,
    );
    syncSubStatusFromChecklist(db, job.id);
  });
}
```

## OP-db-ensureLifecycleChecklist

Source: src/db.ts:7571-7598

Dependencies: maybe, checklistStageForSubStatus, new Date().toISOString, createLifecycleCycle

```typescript
export function ensureLifecycleChecklist(
  db: Database,
  jobId: number,
  mainStatus: MainStatus,
  currentSubStatus: SubStatus,
  timestamp?: string,
) {
  const existing = maybe<{ id: number }>(
    db,
    "select id from checklist_cycles where job_card_id=? limit 1",
    [jobId],
  );
  if (existing) return existing.id;
  const stage = checklistStageForSubStatus(currentSubStatus);
  const stamp = timestamp || new Date().toISOString();
  const cycleComplete =
    mainStatus === "CLOSED" &&
    stage === "CLOSED" &&
    currentSubStatus === "Delivered";
  return createLifecycleCycle(
    db,
    jobId,
    stage,
    stamp,
    currentSubStatus,
    cycleComplete,
  );
}
```

## OP-db-syncSubStatusFromChecklist

Source: src/db.ts:7648-7665

Dependencies: maybe, all, db.run, deriveChecklistSubStatus

```typescript
export function syncSubStatusFromChecklist(db: Database, jobId: number) {
  const cycle = maybe<ChecklistCycle>(
    db,
    "select * from checklist_cycles where job_card_id=? order by id desc limit 1",
    [jobId],
  );
  if (!cycle) return;
  const items = all<ChecklistItem>(
    db,
    "select * from checklist_items where checklist_cycle_id=? order by sort_order",
    [cycle.id],
  );
  if (items.length === 0) return;
  db.run("update job_cards set sub_status=? where id=?", [
    deriveChecklistSubStatus(items),
    jobId,
  ]);
}
```

## OP-db-setChecklistItemChecked

Source: src/db.ts:7687-7720

Dependencies: new Date().toISOString, one, scalar, writeChecklistItemState

```typescript
export function setChecklistItemChecked(
  db: Database,
  itemId: number,
  actorId: number,
  checked: boolean,
  timestamp = new Date().toISOString(),
) {
  const item = one<ChecklistItem>(
    db,
    "select * from checklist_items where id=?",
    [itemId],
  );
  if (
    checked &&
    scalar<number>(
      db,
      "select count(*) from checklist_items where checklist_cycle_id=? and sort_order<? and required=1 and checked_at is null",
      [item.checklist_cycle_id, item.sort_order],
    ) > 0
  ) {
    throw new Error("Checklist items must be completed in order.");
  }
  if (
    !checked &&
    scalar<number>(
      db,
      "select count(*) from checklist_items where checklist_cycle_id=? and sort_order>? and required=1 and checked_at is not null",
      [item.checklist_cycle_id, item.sort_order],
    ) > 0
  ) {
    throw new Error("Later checklist items must be reopened first.");
  }
  writeChecklistItemState(db, item, actorId, checked, false, timestamp);
}
```

## OP-db-setChecklistItemNotApplicable

Source: src/db.ts:7723-7775

Dependencies: new Date().toISOString, one, (MATERIALS_CHECKLIST_LABELS as readonly string[]).includes, scalar, writeChecklistItemState

```typescript
export function setChecklistItemNotApplicable(
  db: Database,
  itemId: number,
  actorId: number,
  notApplicable: boolean,
  timestamp = new Date().toISOString(),
) {
  const item = one<ChecklistItem>(
    db,
    "select * from checklist_items where id=?",
    [itemId],
  );
  if (item.label === "Remind Customer for Sharing Google Review/Feedback")
    throw new Error(
      "The Google review/feedback reminder is required and cannot be marked N/A.",
    );
  if (notApplicable) {
    if (
      (MATERIALS_CHECKLIST_LABELS as readonly string[]).includes(item.label) &&
      scalar<number>(
        db,
        "select count(*) from material_requests where job_card_id=? and archived_at is null",
        [item.job_card_id],
      ) > 0
    ) {
      throw new Error(
        "N/A is only available while the job card has no material rows.",
      );
    }
    if (item.checked_at && !item.na_at)
      throw new Error("Untick the item before marking it N/A.");
  } else if (!item.na_at) {
    throw new Error("This item is not marked N/A.");
  }
  if (
    !notApplicable &&
    scalar<number>(
      db,
      "select count(*) from checklist_items where checklist_cycle_id=? and sort_order>? and required=1 and checked_at is not null",
      [item.checklist_cycle_id, item.sort_order],
    ) > 0
  ) {
    throw new Error("Later checklist items must be reopened first.");
  }
  writeChecklistItemState(
    db,
    item,
    actorId,
    notApplicable,
    notApplicable,
    timestamp,
  );
}
```

## OP-db-setChecklistItemCheckedForActor

Source: src/db.ts:7903-7928

Dependencies: new Date().toISOString, one, setPaymentReceivedForActor, assertJobLifecycleMutationAccess, assertChecklistItemEditable, setChecklistItemChecked

```typescript
export function setChecklistItemCheckedForActor(
  db: Database,
  itemId: number,
  actorId: number,
  checked: boolean,
  timestamp = new Date().toISOString(),
  payment?: PaymentInput,
) {
  const item = one<ChecklistItem>(
    db,
    "select * from checklist_items where id=?",
    [itemId],
  );
  if (item.label === "Payment Received")
    return setPaymentReceivedForActor(
      db,
      item,
      actorId,
      checked,
      timestamp,
      payment,
    );
  assertJobLifecycleMutationAccess(db, item.job_card_id, actorId);
  assertChecklistItemEditable(db, item, checked);
  setChecklistItemChecked(db, itemId, actorId, checked, timestamp);
}
```

## OP-db-setChecklistItemNotApplicableForActor

Source: src/db.ts:7930-7949

Dependencies: new Date().toISOString, one, assertJobLifecycleMutationAccess, assertChecklistItemEditable, setChecklistItemNotApplicable

```typescript
export function setChecklistItemNotApplicableForActor(
  db: Database,
  itemId: number,
  actorId: number,
  notApplicable: boolean,
  timestamp = new Date().toISOString(),
) {
  const item = one<ChecklistItem>(
    db,
    "select * from checklist_items where id=?",
    [itemId],
  );
  if (item.label === "Remind Customer for Sharing Google Review/Feedback")
    throw new Error(
      "The Google review/feedback reminder is required and cannot be marked N/A.",
    );
  assertJobLifecycleMutationAccess(db, item.job_card_id, actorId);
  assertChecklistItemEditable(db, item, notApplicable);
  setChecklistItemNotApplicable(db, itemId, actorId, notApplicable, timestamp);
}
```

## OP-db-transitionJobStatus

Source: src/db.ts:8201-8209

Dependencies: new Date().toISOString, transitionJobStatusInternal

```typescript
export function transitionJobStatus(
  db: Database,
  jobId: number,
  to: MainStatus,
  note: string,
  timestamp = new Date().toISOString(),
) {
  return transitionJobStatusInternal(db, jobId, to, note, timestamp);
}
```

## OP-db-reconcileArtifactChecklist

Source: src/db.ts:8280-8305

Dependencies: new Date().toISOString, maybe, all, artifactExistsForChecklistItem, setChecklistItemChecked

```typescript
export function reconcileArtifactChecklist(
  db: Database,
  jobId: number,
  actorId = 0,
  timestamp = new Date().toISOString(),
) {
  const cycle = maybe<ChecklistCycle>(
    db,
    "select * from checklist_cycles where job_card_id=? order by id desc limit 1",
    [jobId],
  );
  if (!cycle) return;
  const items = all<ChecklistItem>(
    db,
    "select * from checklist_items where checklist_cycle_id=? order by sort_order",
    [cycle.id],
  );
  for (const item of items) {
    if (item.checked_at) continue;
    if (!artifactExistsForChecklistItem(db, jobId, item.label)) {
      if (item.required === 0) continue;
      break;
    }
    setChecklistItemChecked(db, item.id, actorId, true, timestamp);
  }
}
```

## OP-db-createSalesLead

Source: src/db.ts:8560-8565

Dependencies: input.display_name.trim, input.phone.trim, insert, input.company?.trim, input.email?.trim, input.address?.trim, input.service_interest?.trim, input.notes?.trim

```typescript
export function createSalesLead(db: Database, input: LocalLeadInput) {
  const name = input.display_name.trim();
  const phone = input.phone.trim();
  if (!name || !phone) throw new Error("Lead name and phone are required.");
  return insert(db, "insert into sales_leads(display_name,phone,company,company_not_entered,email,email_not_entered,address,service_interest,notes,stage,temperature,follow_up_due,site_visit_completed,site_visit_date,created_at,updated_at) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now'),datetime('now'))", [name, phone, input.company?.trim() ?? "", input.company_not_entered ?? 0, input.email?.trim() ?? "", input.email_not_entered ?? 0, input.address?.trim() ?? "", input.service_interest?.trim() ?? "", input.notes?.trim() ?? "", input.stage ?? "NEW", input.temperature ?? "WARM", input.follow_up_due ?? null, input.site_visit_completed ?? 0, input.site_visit_date ?? null]);
}
```

## OP-db-updateSalesLead

Source: src/db.ts:8567-8572

Dependencies: input.display_name.trim, input.phone.trim, db.run, input.company?.trim, input.email?.trim, input.address?.trim, input.service_interest?.trim, input.notes?.trim

```typescript
export function updateSalesLead(db: Database, leadId: number, input: LocalLeadInput) {
  const name = input.display_name.trim();
  const phone = input.phone.trim();
  if (!name || !phone) throw new Error("Lead name and phone are required.");
  db.run("update sales_leads set display_name=?,phone=?,company=?,company_not_entered=?,email=?,email_not_entered=?,address=?,service_interest=?,notes=?,stage=?,temperature=?,follow_up_due=?,site_visit_completed=?,site_visit_date=?,updated_at=datetime('now') where id=?", [name, phone, input.company?.trim() ?? "", input.company_not_entered ?? 0, input.email?.trim() ?? "", input.email_not_entered ?? 0, input.address?.trim() ?? "", input.service_interest?.trim() ?? "", input.notes?.trim() ?? "", input.stage ?? "NEW", input.temperature ?? "WARM", input.follow_up_due ?? null, input.site_visit_completed ?? 0, input.site_visit_date ?? null, leadId]);
}
```

## OP-db-createSalesQuotation

Source: src/db.ts:8574-8590

Dependencies: maybe, input.lines.map, Number, lines.some, line.description.trim, lines.reduce, Math.max, String((scalar<number>(db, "select coalesce(max(id),0)+1 from sales_quotations") ?? 1)).padStart, String, scalar, insert, input.customer_notes?.trim, lines.forEach, db.run

```typescript
export function createSalesQuotation(db: Database, input: LocalQuotationInput) {
  const lead = maybe<SalesLead>(db, "select * from sales_leads where id=?", [input.lead_id]);
  if (!lead) throw new Error("Select an existing lead.");
  if (!input.template_id || !input.template_html) throw new Error("Select a quotation template.");
  if (!input.lines.length) throw new Error("Add at least one quotation line.");
  const lines = input.lines.map((line) => ({ ...line, quantity: Number(line.quantity), rate: Number(line.rate), gst_rate: Number(line.gst_rate) }));
  if (lines.some((line) => !line.description.trim() || line.quantity <= 0 || line.rate < 0 || line.gst_rate < 0 || line.gst_rate > 100)) throw new Error("Quotation lines need a description, positive quantity, and valid rates.");
  const subtotal = lines.reduce((sum, line) => sum + line.quantity * line.rate, 0);
  const discount = Math.max(0, Number(input.discount) || 0);
  const taxable = Math.max(0, subtotal - discount);
  const gst_amount = lines.reduce((sum, line) => sum + (line.quantity * line.rate * line.gst_rate) / 100, 0);
  const quotation_no = `QT-${String((scalar<number>(db, "select coalesce(max(id),0)+1 from sales_quotations") ?? 1)).padStart(6, "0")}`;
  const quotationId = insert(db, "insert into sales_quotations(lead_id,quotation_no,status,valid_until,customer_notes,discount,subtotal,gst_amount,total,template_id,template_html,created_at,updated_at) values(?,?, 'DRAFT',?,?,?,?,?,?,?,?,datetime('now'),datetime('now'))", [input.lead_id, quotation_no, input.valid_until ?? null, input.customer_notes?.trim() ?? "", discount, subtotal, gst_amount, taxable + gst_amount, input.template_id, input.template_html]);
  lines.forEach((line, index) => insert(db, "insert into sales_quotation_lines(quotation_id,line_no,kind,description,quantity,rate,gst_rate) values(?,?,?,?,?,?,?)", [quotationId, index + 1, line.kind || "Service", line.description.trim(), line.quantity, line.rate, line.gst_rate]));
  db.run("update sales_leads set stage='QUOTATION_SENT', updated_at=datetime('now') where id=?", [input.lead_id]);
  return quotationId;
}
```

## OP-db-updateSalesQuotation

Source: src/db.ts:8593-8610

Dependencies: one, maybe, input.lines.map, Number, lines.some, line.description.trim, lines.reduce, Math.max, db.run, input.customer_notes?.trim, lines.forEach, insert

```typescript
export function updateSalesQuotation(db: Database, quotationId: number, input: LocalQuotationInput) {
  const quotation = one<SalesQuotation>(db, "select * from sales_quotations where id=?", [quotationId]);
  if (quotation.status !== "DRAFT") throw new Error("Only draft quotations can be edited.");
  const lead = maybe<SalesLead>(db, "select * from sales_leads where id=?", [input.lead_id]);
  if (!lead) throw new Error("Select an existing lead.");
  if (!input.template_id || !input.template_html) throw new Error("Select a quotation template.");
  if (!input.lines.length) throw new Error("Add at least one quotation line.");
  const lines = input.lines.map((line) => ({ ...line, quantity: Number(line.quantity), rate: Number(line.rate), gst_rate: Number(line.gst_rate) }));
  if (lines.some((line) => !line.description.trim() || line.quantity <= 0 || line.rate < 0 || line.gst_rate < 0 || line.gst_rate > 100)) throw new Error("Quotation lines need a description, positive quantity, and valid rates.");
  const subtotal = lines.reduce((sum, line) => sum + line.quantity * line.rate, 0);
  const discount = Math.max(0, Number(input.discount) || 0);
  const taxable = Math.max(0, subtotal - discount);
  const gst_amount = lines.reduce((sum, line) => sum + Math.max(0, line.quantity * line.rate - (subtotal ? discount * (line.quantity * line.rate / subtotal) : 0)) * line.gst_rate / 100, 0);
  db.run("update sales_quotations set lead_id=?,valid_until=?,customer_notes=?,discount=?,subtotal=?,gst_amount=?,total=?,template_id=?,template_html=?,updated_at=datetime('now') where id=?", [input.lead_id, input.valid_until ?? null, input.customer_notes?.trim() ?? "", discount, subtotal, gst_amount, taxable + gst_amount, input.template_id, input.template_html, quotationId]);
  db.run("delete from sales_quotation_lines where quotation_id=?", [quotationId]);
  lines.forEach((line, index) => insert(db, "insert into sales_quotation_lines(quotation_id,line_no,kind,description,quantity,rate,gst_rate) values(?,?,?,?,?,?,?)", [quotationId, index + 1, line.kind || "Service", line.description.trim(), line.quantity, line.rate, line.gst_rate]));
  db.run("update sales_leads set stage='QUOTATION_SENT', updated_at=datetime('now') where id=?", [input.lead_id]);
}
```

## OP-db-setSalesQuotationStatus

Source: src/db.ts:8612-8618

Dependencies: one, ["ACCEPTED", "REJECTED", "EXPIRED"].includes, db.run

```typescript
export function setSalesQuotationStatus(db: Database, quotationId: number, status: QuotationStatus) {
  const quotation = one<SalesQuotation>(db, "select * from sales_quotations where id=?", [quotationId]);
  if (["ACCEPTED", "REJECTED", "EXPIRED"].includes(quotation.status)) throw new Error("Terminal quotations cannot be changed.");
  db.run("update sales_quotations set status=?, updated_at=datetime('now') where id=?", [status, quotationId]);
  if (status === "ACCEPTED") db.run("update sales_leads set stage='WON',updated_at=datetime('now') where id=?", [quotation.lead_id]);
  if (status === "REJECTED") db.run("update sales_leads set stage='LOST',updated_at=datetime('now') where id=?", [quotation.lead_id]);
}
```

## OP-db-createServiceDepartment

Source: src/db.ts:8620-8625

Dependencies: name.trim, scalar, insert

```typescript
export function createServiceDepartment(db: Database, name: string) {
  const cleaned = name.trim();
  if (!cleaned) throw new Error("Department name is required.");
  if (scalar<number>(db, "select count(*) from service_departments where lower(name)=lower(?)", [cleaned])) throw new Error("A department with this name already exists.");
  return insert(db, "insert into service_departments(name,status,created_at,updated_at) values(?,'ACTIVE',datetime('now'),datetime('now'))", [cleaned]);
}
```

## OP-db-updateServiceDepartment

Source: src/db.ts:8627-8631

Dependencies: name.trim, db.run

```typescript
export function updateServiceDepartment(db: Database, departmentId: number, name: string, status: "ACTIVE" | "ARCHIVED") {
  const cleaned = name.trim();
  if (!cleaned) throw new Error("Department name is required.");
  db.run("update service_departments set name=?, status=?, updated_at=datetime('now') where id=?", [cleaned, status, departmentId]);
}
```

## OP-db-createServiceCatalogMaster

Source: src/db.ts:8633-8639

Dependencies: name.trim, scalar, label.toLowerCase, insert

```typescript
export function createServiceCatalogMaster(db: Database, table: "service_brands" | "car_segments", name: string) {
  const cleaned = name.trim();
  const label = table === "service_brands" ? "Brand name" : "Car segment";
  if (!cleaned) throw new Error(`${label} is required.`);
  if (scalar<number>(db, `select count(*) from ${table} where lower(name)=lower(?)`, [cleaned])) throw new Error(`A ${label.toLowerCase()} with this name already exists.`);
  return insert(db, `insert into ${table}(name,status,created_at,updated_at) values(?,'ACTIVE',datetime('now'),datetime('now'))`, [cleaned]);
}
```

## OP-db-updateServiceCatalogMaster

Source: src/db.ts:8641-8647

Dependencies: name.trim, scalar, label.toLowerCase, db.run

```typescript
export function updateServiceCatalogMaster(db: Database, table: "service_brands" | "car_segments", id: number, name: string, status: "ACTIVE" | "ARCHIVED") {
  const cleaned = name.trim();
  const label = table === "service_brands" ? "Brand name" : "Car segment";
  if (!cleaned) throw new Error(`${label} is required.`);
  if (scalar<number>(db, `select count(*) from ${table} where lower(name)=lower(?) and id<>?`, [cleaned, id])) throw new Error(`A ${label.toLowerCase()} with this name already exists.`);
  db.run(`update ${table} set name=?,status=?,updated_at=datetime('now') where id=?`, [cleaned, status, id]);
}
```

## OP-db-appointServiceDepartmentManager

Source: src/db.ts:8649-8655

Dependencies: one, db.run

```typescript
export function appointServiceDepartmentManager(db: Database, departmentId: number, managerId: number) {
  const manager = one<User>(db, "select * from users where id=? and archived_at is null", [managerId]);
  if (manager.role !== "service_manager") throw new Error("Managers must have the Service Department Manager role.");
  const department = one<{ status: string }>(db, "select status from service_departments where id=?", [departmentId]);
  if (department.status !== "ACTIVE") throw new Error("Archived departments cannot receive managers.");
  db.run("insert or ignore into service_department_managers(department_id,manager_id) values(?,?)", [departmentId, managerId]);
}
```

## OP-db-removeServiceDepartmentManager

Source: src/db.ts:8657-8660

Dependencies: db.run

```typescript
export function removeServiceDepartmentManager(db: Database, departmentId: number, managerId: number) {
  db.run("delete from service_advisor_teams where department_id=? and manager_id=?", [departmentId, managerId]);
  db.run("delete from service_department_managers where department_id=? and manager_id=?", [departmentId, managerId]);
}
```

## OP-db-assignServiceAdvisorTeam

Source: src/db.ts:8662-8667

Dependencies: one, scalar, db.run

```typescript
export function assignServiceAdvisorTeam(db: Database, departmentId: number, managerId: number, advisorId: number) {
  const advisor = one<User>(db, "select * from users where id=? and archived_at is null", [advisorId]);
  if (advisor.role !== "service") throw new Error("Advisors must have the Service Advisor role.");
  if (!scalar<number>(db, "select count(*) from service_department_managers where department_id=? and manager_id=?", [departmentId, managerId])) throw new Error("Appoint the department manager before assigning advisors.");
  db.run("insert into service_advisor_teams(department_id,manager_id,advisor_id) values(?,?,?) on conflict(advisor_id) do update set department_id=excluded.department_id, manager_id=excluded.manager_id", [departmentId, managerId, advisorId]);
}
```

## OP-db-removeServiceAdvisorTeam

Source: src/db.ts:8669-8672

Dependencies: db.run

```typescript
export function removeServiceAdvisorTeam(db: Database, departmentId: number, managerId: number, advisorId: number) {
  void managerId;
  db.run("delete from service_advisor_teams where department_id=? and advisor_id=?", [departmentId, advisorId]);
}
```

## OP-developer-control-plane-createDefaultDeveloperControlPlane

Source: src/developer-control-plane.ts:73-80

Dependencies: iso

```typescript
export function createDefaultDeveloperControlPlane(now: Date | string = new Date()): DeveloperControlPlaneState {
  const createdAt = iso(now);
  const tenant: DemoTenant = {
    id: "tenant-demo-1", lifecycle: "active", createdAt,
    profile: { name: "Apex Auto Studio", brandName: "Apex", address: "14 Workshop Lane, Bengaluru", contactName: "Demo Owner", email: "owner@apex.demo", phone: "+91 90000 00000", gstin: "29ABCDE1234F1Z5", timezone: "Asia/Kolkata", currency: "INR", invoicePrefix: "APEX" },
  };
  return { version: DEVELOPER_CONTROL_PLANE_VERSION, tenants: [tenant], selectedTenantId: tenant.id, communications: { email: { active: true, sender: "WorkshopOS Demo <demo@workshopos.local>" }, whatsapp: { active: true, sender: "WorkshopOS Demo" } }, communicationLogs: [], charges: [] };
}
```

## OP-developer-control-plane-loadDeveloperControlPlane

Source: src/developer-control-plane.ts:85-87

Dependencies: browserStorage, storage?.getItem, JSON.parse, valid, createDefaultDeveloperControlPlane

```typescript
export function loadDeveloperControlPlane(storage: SessionStorageLike | undefined = browserStorage(), now: Date | string = new Date()): DeveloperControlPlaneState {
  try { const raw = storage?.getItem(DEVELOPER_CONTROL_PLANE_STORAGE_KEY); const parsed = raw ? JSON.parse(raw) : undefined; return valid(parsed) ? parsed : createDefaultDeveloperControlPlane(now); } catch { return createDefaultDeveloperControlPlane(now); }
}
```

## OP-developer-control-plane-saveDeveloperControlPlane

Source: src/developer-control-plane.ts:88-90

Dependencies: browserStorage, storage?.setItem, JSON.stringify

```typescript
export function saveDeveloperControlPlane(state: DeveloperControlPlaneState, storage: SessionStorageLike | undefined = browserStorage()): DeveloperControlPlaneState {
  storage?.setItem(DEVELOPER_CONTROL_PLANE_STORAGE_KEY, JSON.stringify(state)); return state;
}
```

## OP-developer-control-plane-resetDeveloperControlPlane

Source: src/developer-control-plane.ts:91-93

Dependencies: browserStorage, createDefaultDeveloperControlPlane, saveDeveloperControlPlane

```typescript
export function resetDeveloperControlPlane(storage: SessionStorageLike | undefined = browserStorage(), now: Date | string = new Date()): DeveloperControlPlaneState {
  const state = createDefaultDeveloperControlPlane(now); return saveDeveloperControlPlane(state, storage);
}
```

## OP-developer-control-plane-selectedTenant

Source: src/developer-control-plane.ts:94-96

Dependencies: state.tenants.find

```typescript
export function selectedTenant(state: DeveloperControlPlaneState): DemoTenant {
  return state.tenants.find((tenant) => tenant.id === state.selectedTenantId) ?? state.tenants[0];
}
```

## OP-developer-control-plane-createTenant

Source: src/developer-control-plane.ts:97-101

Dependencies: profile.name.trim, iso

```typescript
export function createTenant(state: DeveloperControlPlaneState, profile: TenantProfile, now: Date | string = new Date()): DeveloperControlPlaneState {
  if (!profile.name.trim()) throw new Error("Tenant name is required.");
  const tenant = { id: `tenant-${state.tenants.length + 1}`, lifecycle: "active" as const, profile: { ...profile, name: profile.name.trim() }, createdAt: iso(now) };
  return { ...state, tenants: [...state.tenants, tenant], selectedTenantId: tenant.id };
}
```

## OP-developer-control-plane-selectTenant

Source: src/developer-control-plane.ts:102-105

Dependencies: state.tenants.some

```typescript
export function selectTenant(state: DeveloperControlPlaneState, tenantId: string): DeveloperControlPlaneState {
  if (!state.tenants.some((tenant) => tenant.id === tenantId)) throw new Error("Tenant not found.");
  return { ...state, selectedTenantId: tenantId };
}
```

## OP-developer-control-plane-setTenantLifecycle

Source: src/developer-control-plane.ts:106-108

Dependencies: state.tenants.map

```typescript
export function setTenantLifecycle(state: DeveloperControlPlaneState, tenantId: string, lifecycle: TenantLifecycle): DeveloperControlPlaneState {
  return { ...state, tenants: state.tenants.map((tenant) => tenant.id === tenantId ? { ...tenant, lifecycle } : tenant) };
}
```

## OP-developer-control-plane-updateTenantProfile

Source: src/developer-control-plane.ts:109-111

Dependencies: state.tenants.map

```typescript
export function updateTenantProfile(state: DeveloperControlPlaneState, tenantId: string, profile: Partial<TenantProfile>): DeveloperControlPlaneState {
  return { ...state, tenants: state.tenants.map((tenant) => tenant.id === tenantId ? { ...tenant, profile: { ...tenant.profile, ...profile } } : tenant) };
}
```

## OP-developer-control-plane-updateCommunication

Source: src/developer-control-plane.ts:112-114

Dependencies: 

```typescript
export function updateCommunication(state: DeveloperControlPlaneState, channel: "email" | "whatsapp", updates: Partial<CommunicationChannel>): DeveloperControlPlaneState {
  return { ...state, communications: { ...state.communications, [channel]: { ...state.communications[channel], ...updates } } };
}
```

## OP-developer-control-plane-simulateCommunicationTest

Source: src/developer-control-plane.ts:115-121

Dependencies: state.tenants.find, recipient.trim, iso

```typescript
export function simulateCommunicationTest(state: DeveloperControlPlaneState, channel: "email" | "whatsapp", tenantId: string, recipient: string, now: Date | string = new Date()): DeveloperControlPlaneState {
  const tenant = state.tenants.find((item) => item.id === tenantId);
  if (!tenant) throw new Error("Tenant not found.");
  const result = state.communications[channel].active && tenant.lifecycle === "active" ? "simulated" : "blocked";
  const entry: CommunicationLog = { id: `message-${state.communicationLogs.length + 1}`, channel, tenantId, recipient: recipient.trim() || tenant.profile.email, result, createdAt: iso(now) };
  return { ...state, communicationLogs: [entry, ...state.communicationLogs] };
}
```

## OP-developer-control-plane-createPlatformCharge

Source: src/developer-control-plane.ts:122-126

Dependencies: input.description.trim, iso

```typescript
export function createPlatformCharge(state: DeveloperControlPlaneState, input: { tenantId: string; description: string; amount: number; dueDate: string }, now: Date | string = new Date()): DeveloperControlPlaneState {
  if (!input.description.trim() || !(input.amount > 0) || !input.dueDate) throw new Error("Description, a positive amount, and due date are required.");
  const charge: PlatformCharge = { id: `charge-${state.charges.length + 1}`, tenantId: input.tenantId, description: input.description.trim(), amount: input.amount, dueDate: input.dueDate, payments: [], createdAt: iso(now) };
  return { ...state, charges: [charge, ...state.charges] };
}
```

## OP-developer-control-plane-recordPlatformPayment

Source: src/developer-control-plane.ts:127-130

Dependencies: state.charges.map, iso

```typescript
export function recordPlatformPayment(state: DeveloperControlPlaneState, chargeId: string, amount: number, note = "", now: Date | string = new Date()): DeveloperControlPlaneState {
  if (!(amount > 0)) throw new Error("Payment amount must be positive.");
  return { ...state, charges: state.charges.map((charge) => charge.id === chargeId ? { ...charge, payments: [...charge.payments, { id: `${charge.id}-payment-${charge.payments.length + 1}`, amount, note, paidAt: iso(now) }] } : charge) };
}
```

## OP-developer-control-plane-chargeStatus

Source: src/developer-control-plane.ts:131-131

Dependencies: charge.payments.reduce

```typescript
export function chargeStatus(charge: PlatformCharge): "Unpaid" | "Partial" | "Paid" { const paid = charge.payments.reduce((sum, payment) => sum + payment.amount, 0); return paid >= charge.amount ? "Paid" : paid > 0 ? "Partial" : "Unpaid"; }
```

## OP-developer-control-plane-roleForEmulation

Source: src/developer-control-plane.ts:132-132

Dependencies: 

```typescript
export function roleForEmulation(role: EmulationRole): Role { return role; }
```

## OP-document-snapshots-loadDocumentSnapshots

Source: src/document-snapshots.ts:33-39

Dependencies: browserStorage, storage?.getItem, JSON.parse, Array.isArray

```typescript
export function loadDocumentSnapshots(storage: SnapshotStorage | undefined = browserStorage()): DocumentSnapshot[] {
  if (cache && storage === browserStorage()) return cache;
  let parsed: DocumentSnapshot[] = [];
  try { const raw = storage?.getItem(DOCUMENT_SNAPSHOT_KEY); const value = raw ? JSON.parse(raw) : []; parsed = Array.isArray(value) ? value : []; } catch { parsed = []; }
  if (storage === browserStorage()) cache = parsed;
  return parsed;
}
```

## OP-document-snapshots-saveDocumentSnapshots

Source: src/document-snapshots.ts:41-44

Dependencies: browserStorage, storage?.setItem, JSON.stringify

```typescript
export function saveDocumentSnapshots(snapshots: DocumentSnapshot[], storage: SnapshotStorage | undefined = browserStorage()) {
  if (storage === browserStorage()) cache = snapshots;
  try { storage?.setItem(DOCUMENT_SNAPSHOT_KEY, JSON.stringify(snapshots)); } catch { /* quota or blocked storage: keep the in-memory copy */ }
}
```

## OP-document-snapshots-clearDocumentSnapshots

Source: src/document-snapshots.ts:46-46

Dependencies: browserStorage, saveDocumentSnapshots

```typescript
export function clearDocumentSnapshots(storage: SnapshotStorage | undefined = browserStorage()) { saveDocumentSnapshots([], storage); }
```

## OP-document-snapshots-planSnapshots

Source: src/document-snapshots.ts:63-89

Dependencies: new Date().toISOString, (prev ?? []).map, snapshots.findIndex, prevById.get, documentInfo, live, snapshots.push, freeze, snapshots.filter

```typescript
export function planSnapshots(existing: readonly DocumentSnapshot[], prev: readonly JobView[] | undefined, next: readonly JobView[], admin: Templates, now: string = new Date().toISOString()): DocumentSnapshot[] {
  let snapshots = [...existing];
  const prevById = new Map((prev ?? []).map((view) => [view.job.id, view]));
  const live = (jobId: number, jobNo: string, kind: DocumentKind, number: string) => snapshots.findIndex((item) => item.jobId === jobId && item.jobNo === jobNo && item.kind === kind && item.number === number && item.state === "frozen");
  for (const view of next) {
    const candidate = prevById.get(view.job.id);
    const before = candidate && candidate.job.job_no === view.job.job_no ? candidate : undefined;
    for (const kind of SLOT_KINDS) {
      const was = before && documentInfo(kind, before);
      const now_ = documentInfo(kind, view);
      try {
        if (was && (!now_ || now_.number !== was.number)) {
          const index = live(view.job.id, view.job.job_no, kind, was.number);
          if (index >= 0) snapshots[index] = { ...snapshots[index], state: "void", voidedAt: now };
          else snapshots.push({ ...freeze(kind, before!, was.number, admin, now), state: "void", voidedAt: now });
        }
        if (now_) {
          const index = live(view.job.id, view.job.job_no, kind, now_.number);
          if (now_.frozen && index < 0) snapshots.push(freeze(kind, view, now_.number, admin, now));
          // An Invoice reopened by a voided payment is live again; it re-freezes when Cleared once more.
          if (!now_.frozen && index >= 0) snapshots = snapshots.filter((_item, position) => position !== index);
        }
      } catch { /* a missing template must never break a job update */ }
    }
  }
  return snapshots;
}
```

## OP-document-snapshots-syncDocumentSnapshots

Source: src/document-snapshots.ts:92-98

Dependencies: loadDocumentSnapshots, planSnapshots, JSON.stringify, saveDocumentSnapshots

```typescript
export function syncDocumentSnapshots(prev: readonly JobView[] | undefined, next: readonly JobView[], admin: Templates, storage?: SnapshotStorage): boolean {
  const existing = loadDocumentSnapshots(storage);
  const updated = planSnapshots(existing, prev, next, admin);
  if (JSON.stringify(updated) === JSON.stringify(existing)) return false;
  saveDocumentSnapshots(updated, storage);
  return true;
}
```

## OP-export-utils-buildExportMatrix

Source: src/export-utils.ts:17-26

Dependencies: generatedAt.toLocaleString, filters.join, columns.map, rows.map, column.value

```typescript
export function buildExportMatrix<T>({ title, filters, columns, rows, generatedAt = new Date() }: ExportReport<T>) {
  return [
    [title],
    ["Generated", generatedAt.toLocaleString("en-IN")],
    ["Active filters", filters.length ? filters.join("; ") : "None"],
    [],
    columns.map((column) => column.header),
    ...rows.map((row) => columns.map((column) => column.value(row))),
  ];
}
```

## OP-export-utils-downloadExcel

Source: src/export-utils.ts:32-41

Dependencies: buildExportMatrix, XLSX.utils.aoa_to_sheet, report.columns.map, Math.min, Math.max, matrix.slice(5).map, matrix.slice, String, XLSX.utils.book_new, XLSX.utils.book_append_sheet, XLSX.writeFile, fileStem

```typescript
export function downloadExcel<T>(report: ExportReport<T>) {
  const matrix = buildExportMatrix(report);
  const sheet = XLSX.utils.aoa_to_sheet(matrix);
  sheet["!cols"] = report.columns.map((column, index) => ({
    wch: Math.min(42, Math.max(column.header.length, ...matrix.slice(5).map((row) => String(row[index] ?? "").length)) + 2),
  }));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Report");
  XLSX.writeFile(workbook, `${fileStem(report.title)}.xlsx`, { compression: true });
}
```

## OP-export-utils-downloadPdf

Source: src/export-utils.ts:43-84

Dependencies: document.internal.pageSize.getWidth, Math.max, document.setFont, document.setFontSize, document.text, generatedAt.toLocaleString, report.filters.join, report.columns.forEach, document.line, header, document.internal.pageSize.getHeight, document.addPage, String(column.value(row) ?? "").replace, String, column.value, document.save, fileStem

```typescript
export function downloadPdf<T>(report: ExportReport<T>) {
  const generatedAt = report.generatedAt ?? new Date();
  const document = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const margin = 32;
  const width = document.internal.pageSize.getWidth() - margin * 2;
  const columnWidth = width / Math.max(1, report.columns.length);
  const lineHeight = 15;
  let y = margin;

  const header = () => {
    document.setFont("helvetica", "bold");
    document.setFontSize(15);
    document.text(report.title, margin, y);
    y += 18;
    document.setFont("helvetica", "normal");
    document.setFontSize(8);
    document.text(`Generated: ${generatedAt.toLocaleString("en-IN")}`, margin, y);
    y += 12;
    document.text(`Active filters: ${report.filters.length ? report.filters.join("; ") : "None"}`, margin, y, { maxWidth: width });
    y += 20;
    document.setFont("helvetica", "bold");
    report.columns.forEach((column, index) => document.text(column.header, margin + index * columnWidth, y, { maxWidth: columnWidth - 5 }));
    document.line(margin, y + 4, margin + width, y + 4);
    y += lineHeight;
    document.setFont("helvetica", "normal");
  };

  header();
  for (const row of report.rows) {
    if (y > document.internal.pageSize.getHeight() - margin) {
      document.addPage();
      y = margin;
      header();
    }
    report.columns.forEach((column, index) => {
      const value = String(column.value(row) ?? "").replace(/[^\x20-\x7E]/g, " ");
      document.text(value, margin + index * columnWidth, y, { maxWidth: columnWidth - 5 });
    });
    y += lineHeight;
  }
  document.save(`${fileStem(report.title)}.pdf`);
}
```

## OP-finance-ui-canVoidRemoteInvoice

Source: src/finance-ui.ts:4-6

Dependencies: 

```typescript
export function canVoidRemoteInvoice(invoice: Pick<RemoteInvoice, "status" | "voided" | "paidPaise">): boolean {
  return !invoice.voided && invoice.status === "UNPAID" && invoice.paidPaise === 0;
}
```

## OP-finance-ui-isActiveRemoteInvoice

Source: src/finance-ui.ts:9-11

Dependencies: 

```typescript
export function isActiveRemoteInvoice(invoice: Pick<RemoteInvoice, "status" | "voided">): boolean {
  return !invoice.voided && invoice.status !== "CREDITED";
}
```

## OP-finance-ui-requiresInvoiceReplacement

Source: src/finance-ui.ts:13-15

Dependencies: invoices.some

```typescript
export function requiresInvoiceReplacement(invoices: readonly Pick<RemoteInvoice, "status" | "voided">[]): boolean {
  return invoices.length > 0 && !invoices.some(isActiveRemoteInvoice);
}
```

## OP-finance-ui-canReplaceRemoteInvoice

Source: src/finance-ui.ts:18-20

Dependencies: 

```typescript
export function canReplaceRemoteInvoice(invoice: Pick<RemoteInvoice, "status" | "voided">, hasActiveInvoice: boolean): boolean {
  return (invoice.voided && invoice.status === "VOID" || invoice.status === "CREDITED") && !hasActiveInvoice;
}
```

## OP-finance-ui-remoteDocumentFilename

Source: src/finance-ui.ts:22-24

Dependencies: 

```typescript
export function remoteDocumentFilename(number: string): string {
  return `${number}.html`;
}
```

## OP-inventory-import-parseInventoryWorkbook

Source: src/inventory-import.ts:145-166

Dependencies: XLSX.read, sheetMatrix, isBlankRow, matrix[0].map, headerKey, String, firstKeys.some, FIELD_ALIASES.sku.includes, parseCategorySheets, uniqueHeaders, matrix.slice(1).filter((row) => !isBlankRow(row)).map, matrix.slice(1).filter, matrix.slice, Object.fromEntries, headers.map

```typescript
export function parseInventoryWorkbook(data: ArrayBuffer | Uint8Array): ParsedInventoryWorkbook {
  const workbook = XLSX.read(data, { type: "array", raw: true });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) throw new Error("The inventory file does not contain a worksheet.");

  const matrix = sheetMatrix(workbook.Sheets[sheetName]);
  if (matrix.length === 0 || isBlankRow(matrix[0])) {
    throw new Error("The inventory file does not contain a header row.");
  }

  const firstKeys = matrix[0].map((value) => headerKey(String(value ?? "")));
  if (!firstKeys.some((key) => FIELD_ALIASES.sku.includes(key))) {
    const categorized = parseCategorySheets(workbook);
    if (categorized) return categorized;
  }

  const headers = uniqueHeaders(matrix[0]);
  const rows = matrix.slice(1).filter((row) => !isBlankRow(row)).map((row) =>
    Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""])),
  );
  return { sheetName, headers, rows };
}
```

## OP-inventory-import-suggestInventoryColumnMapping

Source: src/inventory-import.ts:169-182

Dependencies: headers.map, headerKey, normalizedHeaders.find, claimed.has, FIELD_ALIASES[field].includes, claimed.add

```typescript
export function suggestInventoryColumnMapping(headers: string[]): InventoryColumnMapping {
  const normalizedHeaders = headers.map((header) => ({ header, key: headerKey(header) }));
  const claimed = new Set<string>();
  const mapping: InventoryColumnMapping = {};

  for (const field of INVENTORY_IMPORT_FIELDS) {
    const match = normalizedHeaders.find(({ header, key }) => !claimed.has(header) && FIELD_ALIASES[field].includes(key));
    if (match) {
      mapping[field] = match.header;
      claimed.add(match.header);
    }
  }
  return mapping;
}
```

## OP-inventory-import-buildInventoryImportPreview

Source: src/inventory-import.ts:228-291

Dependencies: mappingIssues, rows.map, normalizedSku, fileSkuCounts.set, fileSkuCounts.get, existingInventory.map, rows.forEach, normalizedText, normalizedText(source[sourceColumn.unit]).toLocaleLowerCase, parseQuantity, issues.push, Number.isFinite, existingSkus.has, rejectedRows.push, deterministicId, usedIds.has, usedIds.add, validRows.push

```typescript
export function buildInventoryImportPreview({
  headers,
  rows,
  mapping,
  existingInventory = [],
}: BuildInventoryImportPreviewOptions): InventoryImportPreview {
  const mapIssues = mappingIssues(headers, mapping);
  if (mapIssues.length > 0) {
    return { totalRows: rows.length, validRows: [], rejectedRows: [], mappingIssues: mapIssues };
  }

  const sourceColumn = mapping as Record<InventoryImportField, string>;
  const skus = rows.map((row) => normalizedSku(row[sourceColumn.sku]));
  const fileSkuCounts = new Map<string, number>();
  for (const sku of skus) if (sku) fileSkuCounts.set(sku, (fileSkuCounts.get(sku) ?? 0) + 1);
  const existingSkus = new Set(existingInventory.map((item) => normalizedSku(item.sku)));
  const usedIds = new Set(existingInventory.map((item) => item.id));
  const validRows: ValidInventoryImportRow[] = [];
  const rejectedRows: RejectedInventoryImportRow[] = [];

  rows.forEach((source, index) => {
    const sourceRowNumber = index + 2;
    const normalized: Omit<InventoryItem, "id"> = {
      sku: skus[index],
      name: normalizedText(source[sourceColumn.name]),
      category: normalizedText(source[sourceColumn.category]),
      unit: normalizedText(source[sourceColumn.unit]).toLocaleLowerCase(),
      stock_qty: parseQuantity(source[sourceColumn.stock_qty]),
      low_stock_qty: parseQuantity(source[sourceColumn.low_stock_qty]),
      selling_price: 0,
    };
    const issues: InventoryImportIssue[] = [];

    for (const field of ["sku", "name", "category", "unit"] as const) {
      if (!normalized[field]) issues.push({ code: "MISSING_VALUE", field, message: `${field} is required.` });
    }
    for (const field of ["stock_qty", "low_stock_qty"] as const) {
      const quantity = normalized[field];
      if (!Number.isFinite(quantity)) {
        issues.push({ code: "INVALID_QUANTITY", field, message: `${field} must be a finite number.` });
      } else if (quantity < 0) {
        issues.push({ code: "NEGATIVE_QUANTITY", field, message: `${field} cannot be negative.` });
      }
    }
    if (normalized.sku && (fileSkuCounts.get(normalized.sku) ?? 0) > 1) {
      issues.push({ code: "DUPLICATE_SKU_FILE", field: "sku", message: `SKU ${normalized.sku} occurs more than once in this file.` });
    }
    if (normalized.sku && existingSkus.has(normalized.sku)) {
      issues.push({ code: "DUPLICATE_SKU_EXISTING", field: "sku", message: `SKU ${normalized.sku} already exists in inventory.` });
    }

    if (issues.length > 0) {
      rejectedRows.push({ sourceRowNumber, source, normalized, issues });
      return;
    }

    let id = deterministicId(`${sourceRowNumber}|${normalized.sku}|${normalized.name}|${normalized.category}|${normalized.unit}`);
    while (usedIds.has(id)) id -= 1;
    usedIds.add(id);
    validRows.push({ sourceRowNumber, source, item: { id, ...normalized } });
  });

  return { totalRows: rows.length, validRows, rejectedRows, mappingIssues: [] };
}
```

## OP-inventory-import-buildInventoryTemplateBuffer

Source: src/inventory-import.ts:303-313

Dependencies: INVENTORY_IMPORT_FIELDS.map, XLSX.utils.aoa_to_sheet, headers.map, Math.max, XLSX.utils.book_new, XLSX.utils.book_append_sheet, XLSX.write

```typescript
export function buildInventoryTemplateBuffer(): ArrayBuffer {
  const headers = INVENTORY_IMPORT_FIELDS.map((field) => INVENTORY_TEMPLATE_HEADERS[field]);
  const worksheet = XLSX.utils.aoa_to_sheet([
    headers,
    ["PPF-001", "Paint Protection Film", "Film", "roll", 10, 2],
  ]);
  worksheet["!cols"] = headers.map((header) => ({ wch: Math.max(14, header.length + 2) }));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory Import");
  return XLSX.write(workbook, { type: "array", bookType: "xlsx", compression: true }) as ArrayBuffer;
}
```

## OP-invoice-math-normalizeGstLine

Source: src/invoice-math.ts:12-15

Dependencies: 

```typescript
export function normalizeGstLine(gstType: GstType | null | undefined, gstRate: number | null | undefined, fallbackRate = 18): { gst_type: GstType; gst_rate: number } {
  const gst_type = gstType ?? (gstRate === 0 ? "No GST" : "CGST+SGST");
  return { gst_type, gst_rate: gst_type === "No GST" ? 0 : gstRate ?? fallbackRate };
}
```

## OP-invoice-math-invoiceTotals

Source: src/invoice-math.ts:29-45

Dependencies: lines.map, round2, amounts.reduce, Math.min, Math.max, rows.reduce

```typescript
export function invoiceTotals(lines: readonly PricedLine[], flatDiscount: number): InvoiceTotals {
  const amounts = lines.map((line) => round2(line.qty * line.rate));
  const subtotal = round2(amounts.reduce((sum, amount) => sum + amount, 0));
  const discount = round2(Math.min(Math.max(flatDiscount || 0, 0), subtotal));
  let spread = 0;
  const rows = lines.map((line, index): PricedLineTotals => {
    const isLast = index === lines.length - 1;
    const share = isLast ? round2(discount - spread) : subtotal > 0 ? round2(discount * amounts[index] / subtotal) : 0;
    spread = round2(spread + share);
    const taxable = round2(amounts[index] - share);
    const gst = round2(taxable * (line.gst_rate || 0) / 100);
    return { amount: amounts[index], discount: share, taxable, gst, total: round2(taxable + gst) };
  });
  const taxable = round2(rows.reduce((sum, row) => sum + row.taxable, 0));
  const gst = round2(rows.reduce((sum, row) => sum + row.gst, 0));
  return { lines: rows, subtotal, discount, taxable, gst, total: round2(taxable + gst) };
}
```

## OP-invoice-math-buildInvoiceDraft

Source: src/invoice-math.ts:52-64

Dependencies: view.estimate_items.filter((item) => item.kind === "Service").map, view.estimate_items.filter, normalizeGstLine, view.inventory.find, lines.push

```typescript
export function buildInvoiceDraft(view: Pick<JobView, "estimate" | "estimate_items" | "material_requests" | "inventory">): InvoiceDraft {
  const lines: InvoiceDraftLine[] = view.estimate_items.filter((item) => item.kind === "Service").map((item) => ({ kind: "Service", description: item.description, qty: item.qty, rate: item.rate, ...normalizeGstLine(item.gst_type, item.gst_rate, view.estimate?.gst_rate ?? DEFAULT_GST_BY_KIND.Service) }));
  let unissuedRows = 0;
  for (const row of view.material_requests) {
    if (row.archived_at || row.status === "Cancelled") continue;
    if (row.status === "Issued") {
      if (row.invoiced_in) continue;
      const item = view.inventory.find((candidate) => candidate.id === row.item_id);
      lines.push({ kind: "Material", description: item?.name ?? `Item ${row.item_id}`, qty: row.issued_qty || row.requested_qty, rate: item?.selling_price ?? 0, gst_type: "CGST+SGST", gst_rate: DEFAULT_GST_BY_KIND.Material, material_row_id: row.id });
    } else unissuedRows += 1;
  }
  return { lines, unissuedRows, discount: view.estimate?.discount ?? 0 };
}
```

## OP-invoice-math-pickableMaterialLines

Source: src/invoice-math.ts:67-69

Dependencies: buildInvoiceDraft

```typescript
export function pickableMaterialLines(view: Pick<JobView, "material_requests" | "inventory">): InvoiceDraftLine[] {
  return buildInvoiceDraft({ estimate: undefined, estimate_items: [], material_requests: view.material_requests, inventory: view.inventory }).lines;
}
```

## OP-invoice-math-unissuedWarning

Source: src/invoice-math.ts:71-73

Dependencies: 

```typescript
export function unissuedWarning(count: number) {
  return count > 0 ? `${count} material row${count === 1 ? " is" : "s are"} not issued yet and will not be billed.` : undefined;
}
```

## OP-invoice-math-canCreateInvoice

Source: src/invoice-math.ts:79-86

Dependencies: 

```typescript
export function canCreateInvoice(actor: Actor, job: JobRef) {
  const eligibleStatus = job.main_status === "IN_PROGRESS" || job.main_status === "COMPLETED";
  return eligibleStatus && (
    actor.role === "admin"
    || (actor.role === "service" && actor.id === job.advisor_id)
    || (actor.role === "accounts" && job.main_status === "COMPLETED")
  );
}
```

## OP-invoice-math-canEditInvoice

Source: src/invoice-math.ts:89-92

Dependencies: 

```typescript
export function canEditInvoice(actor: Actor, job: JobRef) {
  const who = actor.role === "admin" || (actor.role === "service" && actor.id === job.advisor_id);
  return who && job.main_status !== "CLOSED" && job.main_status !== "CANCELLED" && job.main_status !== "NEW";
}
```

## OP-invoice-math-canCompleteWithInvoice

Source: src/invoice-math.ts:95-97

Dependencies: Boolean

```typescript
export function canCompleteWithInvoice(view: Pick<JobView, "invoice">) {
  return Boolean(view.invoice && !view.invoice.voided_at);
}
```

## OP-invoice-math-billingReconciliation

Source: src/invoice-math.ts:100-114

Dependencies: view.payments.find, Boolean, view.job.delivery_by?.trim, view.job.acknowledgement?.trim, [
    !invoice && "Invoice",
    !payment && "Payment",
    !receipt && "Receipt",
    !gatePass && "Gate pass",
    !deliveryAcknowledged && "Delivery acknowledgement",
  ].filter

```typescript
export function billingReconciliation(view: JobView) {
  const invoice = view.invoice && !view.invoice.voided_at ? view.invoice : undefined;
  const payment = invoice && view.payments.find((item) => item.invoice_id === invoice.id && !item.voided_at);
  const receipt = invoice && view.receipt && !view.receipt.voided_at && view.receipt.invoice_id === invoice.id ? view.receipt : undefined;
  const gatePass = invoice && view.gate_pass && !view.gate_pass.voided_at && view.gate_pass.invoice_id === invoice.id ? view.gate_pass : undefined;
  const deliveryAcknowledged = Boolean(view.job.delivery_by?.trim() && view.job.acknowledgement?.trim());
  const missing = [
    !invoice && "Invoice",
    !payment && "Payment",
    !receipt && "Receipt",
    !gatePass && "Gate pass",
    !deliveryAcknowledged && "Delivery acknowledgement",
  ].filter((item): item is string => Boolean(item));
  return { invoice, payment, receipt, gatePass, deliveryAcknowledged, missing, complete: missing.length === 0 };
}
```

## OP-invoice-math-mixedPaymentRows

Source: src/invoice-math.ts:123-133

Dependencies: view.payments.some, unpaid.push, (payment.voided_at ? voided : received).push

```typescript
export function mixedPaymentRows<V extends Pick<JobView, "invoice" | "payments"> & Partial<Pick<JobView, "payment_history">>>(views: readonly V[], opts: { includeUnpaid: boolean } = { includeUnpaid: true }): PaymentListRow<V>[] {
  const unpaid: PaymentListRow<V>[] = [];
  const received: PaymentListRow<V>[] = [];
  const voided: PaymentListRow<V>[] = [];
  for (const view of views) {
    const invoice = view.invoice && !view.invoice.voided_at ? view.invoice : undefined;
    if (opts.includeUnpaid && invoice && !view.payments.some((payment) => payment.invoice_id === invoice.id && !payment.voided_at)) unpaid.push({ key: `unpaid-${invoice.id}`, kind: "unpaid", view });
    for (const payment of view.payment_history ?? view.payments) (payment.voided_at ? voided : received).push({ key: `payment-${payment.id}`, kind: payment.voided_at ? "void" : "received", view, payment });
  }
  return [...unpaid, ...received, ...voided];
}
```

## OP-invoice-math-canRecordOrVoidPayment

Source: src/invoice-math.ts:136-138

Dependencies: 

```typescript
export function canRecordOrVoidPayment(actor: Pick<User, "role">, job: Pick<JobRef, "main_status">) {
  return (actor.role === "admin" || actor.role === "accounts") && job.main_status === "COMPLETED";
}
```

## OP-invoice-math-canVoidCurrentInvoice

Source: src/invoice-math.ts:141-144

Dependencies: Boolean, canRecordOrVoidPayment, view.payments.some

```typescript
export function canVoidCurrentInvoice(actor: Pick<User, "role">, view: Pick<JobView, "invoice" | "payments"> & { job: Pick<JobRef, "main_status"> }) {
  const invoice = view.invoice;
  return Boolean(invoice && !invoice.voided_at) && canRecordOrVoidPayment(actor, view.job) && !view.payments.some((payment) => payment.invoice_id === invoice!.id && !payment.voided_at);
}
```

## OP-job-card-layout-isStubTab

Source: src/job-card-layout.ts:25-27

Dependencies: JOB_CARD_STUB_TABS.includes

```typescript
export function isStubTab(key: JobCardTabKey) {
  return JOB_CARD_STUB_TABS.includes(key);
}
```

## OP-job-card-layout-resolveJobCardFooter

Source: src/job-card-layout.ts:52-73

Dependencies: resolveJobDocumentActions, actions.add, resolveJobDocuments(view)
    .filter((doc) => doc.state !== "void")
    .map, resolveJobDocuments(view)
    .filter, resolveJobDocuments, ACTION_ORDER.filter, actions.has

```typescript
export function resolveJobCardFooter(
  view: JobView,
  actor: Pick<User, "id" | "role">,
): JobCardFooter {
  const actions = new Set<FooterAction>();
  for (const kind of ["estimate", "invoice"] as const) {
    for (const action of resolveJobDocumentActions(kind, view, actor))
      if (action !== "download") actions.add(action);
  }
  const downloads = resolveJobDocuments(view)
    .filter((doc) => doc.state !== "void")
    .map((doc) => ({
      kind: doc.kind,
      label: doc.label,
      enabled: doc.available,
      reason: doc.available ? undefined : doc.message,
    }));
  return {
    actions: ACTION_ORDER.filter((action) => actions.has(action)),
    downloads,
  };
}
```

## OP-job-card-notifications-renderJobCardNotificationTemplate

Source: src/job-card-notifications.ts:20-28

Dependencies: template.replace

```typescript
export function renderJobCardNotificationTemplate(
  template: string,
  values: TemplateValues,
) {
  return template.replace(
    /{{(jobCardNo|vehicleRegistrationNo|serviceAdvisorName|workshopName)}}/g,
    (_, key: keyof TemplateValues) => values[key],
  );
}
```

## OP-job-card-notifications-renderJobCardNotification

Source: src/job-card-notifications.ts:30-57

Dependencies: renderJobCardNotificationTemplate

```typescript
export function renderJobCardNotification(
  event: JobCardNotificationEvent,
  view: JobView,
  settings: WorkshopBusinessSettings,
): JobCardNotificationPayload {
  const values: TemplateValues = {
    jobCardNo: view.job.job_no,
    vehicleRegistrationNo: view.vehicle.number,
    serviceAdvisorName: view.advisor.name,
    workshopName: settings.profile.businessName,
  };
  const templates = settings.notifications;
  return {
    event,
    whatsapp: renderJobCardNotificationTemplate(
      event === "created"
        ? templates.jobCardCreatedWhatsAppTemplate
        : templates.jobCardClosedWhatsAppTemplate,
      values,
    ),
    email: renderJobCardNotificationTemplate(
      event === "created"
        ? templates.jobCardCreatedEmailTemplate
        : templates.jobCardClosedEmailTemplate,
      values,
    ),
  };
}
```

## OP-job-card-notifications-deliverJobCardNotificationStub

Source: src/job-card-notifications.ts:60-65

Dependencies: notify

```typescript
export function deliverJobCardNotificationStub(
  _payload: JobCardNotificationPayload,
  notify: (message: string) => void,
) {
  notify("whatsapp and email note sent");
}
```

## OP-job-delivery-highlight-localDeliveryDate

Source: src/job-delivery-highlight.ts:15-20

Dependencies: String(now.getFullYear()).padStart, String, now.getFullYear, String(now.getMonth() + 1).padStart, now.getMonth, String(now.getDate()).padStart, now.getDate

```typescript
export function localDeliveryDate(now = new Date()): string {
  const year = String(now.getFullYear()).padStart(4, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
```

## OP-job-delivery-highlight-jobDeliveryTone

Source: src/job-delivery-highlight.ts:22-34

Dependencies: calendarDay

```typescript
export function jobDeliveryTone(
  job: Pick<JobCard, "estimated_delivery" | "main_status" | "archived_at">,
  today: string,
): "approaching" | "overdue" | undefined {
  if (job.archived_at || job.main_status === "CLOSED" || job.main_status === "CANCELLED") return undefined;
  const deliveryDay = calendarDay(job.estimated_delivery ?? "");
  const todayDay = calendarDay(today);
  if (deliveryDay === undefined || todayDay === undefined) return undefined;
  const daysAway = deliveryDay - todayDay;
  if (daysAway < 0) return "overdue";
  if (daysAway <= 7) return "approaching";
  return undefined;
}
```

## OP-job-delivery-highlight-jobDeliveryClass

Source: src/job-delivery-highlight.ts:36-39

Dependencies: jobDeliveryTone

```typescript
export function jobDeliveryClass(job: Pick<JobCard, "estimated_delivery" | "main_status" | "archived_at">, today: string) {
  const tone = jobDeliveryTone(job, today);
  return tone ? `job-delivery-${tone}` : "";
}
```

## OP-job-delivery-highlight-useLocalDeliveryDate

Source: src/job-delivery-highlight.ts:41-65

Dependencies: useState, localDeliveryDate, useEffect, setToday, now.getFullYear, now.getMonth, now.getDate, setTimeout, Math.max, nextMidnight.getTime, now.getTime, clearTimeout, refresh, document.addEventListener, document.removeEventListener

```typescript
export function useLocalDeliveryDate(): string {
  const [today, setToday] = useState(() => localDeliveryDate());
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const refresh = () => {
      setToday(localDeliveryDate());
      const now = new Date();
      const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      timer = setTimeout(refresh, Math.max(1, nextMidnight.getTime() - now.getTime() + 50));
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        clearTimeout(timer);
        refresh();
      }
    };
    refresh();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);
  return today;
}
```

## OP-job-documents-resolveJobDocumentActions

Source: src/job-documents.ts:12-25

Dependencies: recordExists, mayEditInvoice, canCreateInvoice

```typescript
export function resolveJobDocumentActions(kind: DocumentKind, view: JobView, actor: Pick<User, "id" | "role">): JobDocumentAction[] {
  // CLOSED and CANCELLED jobs are terminal and read-only: documents can only be downloaded.
  const readOnly = view.job.main_status === "CANCELLED" || view.job.main_status === "CLOSED";
  const canEditEstimate = !readOnly && (actor.role === "admin" || (actor.role === "service" && actor.id === view.job.advisor_id));
  if (kind === "estimate") {
    if (recordExists(kind, view)) return [...(canEditEstimate ? ["edit-estimate" as const, ...(view.estimate?.status === "Approved" ? [] : ["approve-estimate" as const])] : []), "download"];
    return canEditEstimate ? ["create-estimate"] : [];
  }
  if (kind === "invoice") {
    if (view.invoice && !view.invoice.voided_at) return [...(!readOnly && mayEditInvoice(actor, view.job) && view.invoice.status !== "Cleared" ? ["edit-invoice" as const] : []), ...(recordExists(kind, view) ? ["download" as const] : [])];
    return !readOnly && canCreateInvoice(actor, view.job) && view.estimate?.status === "Approved" && !view.estimate.archived_at ? ["create-invoice"] : [];
  }
  return recordExists(kind, view) ? ["download"] : [];
}
```

## OP-job-documents-documentInfo

Source: src/job-documents.ts:39-46

Dependencies: recordExists

```typescript
export function documentInfo(kind: DocumentKind, view: JobView): { number: string; frozen: boolean } | undefined {
  if (!recordExists(kind, view)) return undefined;
  if (kind === "estimate") return { number: `EST-${view.job.job_no}`, frozen: view.estimate?.status === "Approved" };
  if (kind === "invoice") return { number: view.invoice!.invoice_no, frozen: view.invoice!.status === "Cleared" };
  if (kind === "payment-receipt") return { number: view.receipt!.receipt_no, frozen: true };
  if (kind === "gate-pass") return { number: view.gate_pass!.gate_pass_no, frozen: true };
  return { number: view.job.job_no, frozen: false };
}
```

## OP-job-documents-resolveJobDocuments

Source: src/job-documents.ts:71-83

Dependencies: documentInfo, rows.push, missingReason, snapshots.filter

```typescript
export function resolveJobDocuments(view: JobView, snapshots: readonly DocumentSnapshot[] = []): JobDocumentDescriptor[] {
  const rows: JobDocumentDescriptor[] = [{ kind: "job-card", label: labels["job-card"], available: true, expected: true, state: "ready", number: view.job.job_no }];
  for (const kind of SLOT_KINDS) {
    const info = documentInfo(kind, view);
    rows.push(info
      ? { kind, label: labels[kind], available: true, expected: true, state: info.frozen ? "frozen" : "ready", number: info.number }
      : { kind, label: labels[kind], available: false, expected: true, state: "missing", message: missingReason(kind, view) });
  }
  for (const snap of snapshots.filter((item) => item.jobId === view.job.id && item.jobNo === view.job.job_no && item.state === "void")) {
    rows.push({ kind: snap.kind, label: labels[snap.kind], available: true, expected: false, state: "void", number: snap.number, snapshotId: snap.id, message: `${labels[snap.kind]} ${snap.number} - void` });
  }
  return rows;
}
```

## OP-job-documents-documentFilename

Source: src/job-documents.ts:85-88

Dependencies: view.job.job_no.trim().replace(/[^a-z0-9-]+/gi, "-").replace, view.job.job_no.trim().replace, view.job.job_no.trim

```typescript
export function documentFilename(view: JobView, kind: DocumentKind) {
  const stem = view.job.job_no.trim().replace(/[^a-z0-9-]+/gi, "-").replace(/^-|-$/g, "") || "job";
  return `${stem}-${kind}.pdf`;
}
```

## OP-job-documents-withDamageDiagram

Source: src/job-documents.ts:95-102

Dependencies: DAMAGE_PLACEHOLDER.test, template.html.replace, template.html.lastIndexOf, template.html.slice

```typescript
export function withDamageDiagram<T extends { html: string }>(template: T): T {
  if (DAMAGE_PLACEHOLDER.test(template.html)) return template;
  const block = "<h3>Vehicle damage</h3>{{blocks.damage_diagram}}";
  const html = template.html.replace(/{{\s*blocks\.tasks\s*}}/, (m) => `${block}${m}`);
  if (html !== template.html) return { ...template, html };
  const close = template.html.lastIndexOf("</main>");
  return { ...template, html: close >= 0 ? template.html.slice(0, close) + block + template.html.slice(close) : template.html + block };
}
```

## OP-job-documents-renderLive

Source: src/job-documents.ts:104-113

Dependencies: adminState.reportTemplates.find, buildReportValues, withDamageDiagram, renderReportTemplate, buildReportLines, html.replace, staticDamageDiagramHtml, parseDamageMarks

```typescript
export function renderLive(kind: DocumentKind, view: JobView, adminState: Pick<AdminDemoState, "reportTemplates" | "businessSettings" | "companyAssets">): string {
  const category = kind as ReportCategory;
  const template = adminState.reportTemplates.find((candidate) => candidate.category === category && candidate.active);
  if (!template) throw new Error(`No active ${labels[kind]} template is configured.`);
  const values = buildReportValues(category, view, adminState.businessSettings, adminState.companyAssets);
  // Templates saved before {{blocks.damage_diagram}} existed lack it; the Job Card sheet always embeds the diagram.
  const source = kind === "job-card" ? withDamageDiagram(template) : template;
  const html = renderReportTemplate(source, values, buildReportLines(category, view));
  return kind === "job-card" ? html.replace(DAMAGE_SLOT, staticDamageDiagramHtml(parseDamageMarks(view.job.damage_marks))) : html;
}
```

## OP-job-documents-renderJobDocument

Source: src/job-documents.ts:116-123

Dependencies: documentInfo, snapshots.find, documentFilename, renderLive

```typescript
export function renderJobDocument(kind: DocumentKind, view: JobView, adminState: Pick<AdminDemoState, "reportTemplates" | "businessSettings" | "companyAssets">, snapshots: readonly DocumentSnapshot[] = []): RenderedDocument {
  const info = documentInfo(kind, view);
  if (!info) throw new Error(`${labels[kind]} is not available for this job.`);
  const snap = !info.frozen ? undefined : snapshots.find((item) => item.jobId === view.job.id && item.jobNo === view.job.job_no && item.kind === kind && item.number === info.number && item.state === "frozen");
  const filename = documentFilename(view, kind);
  if (snap) return { html: snap.html, title: `${labels[kind]} ${snap.number}`, number: snap.number, filename, frozen: true };
  return { html: renderLive(kind, view, adminState), title: `${labels[kind]} ${info.number}`, number: info.number, filename, frozen: false };
}
```

## OP-job-documents-renderSnapshotDocument

Source: src/job-documents.ts:125-128

Dependencies: snap.jobNo.trim().replace(/[^a-z0-9-]+/gi, "-").replace, snap.jobNo.trim().replace, snap.jobNo.trim

```typescript
export function renderSnapshotDocument(snap: DocumentSnapshot): RenderedDocument {
  const stem = snap.jobNo.trim().replace(/[^a-z0-9-]+/gi, "-").replace(/^-|-$/g, "") || "job";
  return { html: snap.html, title: `${labels[snap.kind]} ${snap.number} (void)`, number: snap.number, filename: `${stem}-${snap.kind}-${snap.number}-void.pdf`, frozen: true };
}
```

## OP-job-documents-printRenderedDocument

Source: src/job-documents.ts:133-148

Dependencies: window.open, printWindow.document.open, printWindow.document.write, buildPrintDocument, printWindow.document.close, printWindow.focus, printWindow.setTimeout, printWindow.print, printWindow.close

```typescript
export function printRenderedDocument(doc: Pick<RenderedDocument, "html" | "title">): PrintJobDocumentResult {
  const printWindow = window.open("", "_blank", "width=900,height=720");
  if (!printWindow) return { ok: false, error: "Pop-up blocked. Allow pop-ups for WorkshopOS, then try Print again." };
  try {
    printWindow.opener = null;
    printWindow.document.open();
    printWindow.document.write(buildPrintDocument(doc.title, doc.html));
    printWindow.document.close();
    printWindow.focus();
    printWindow.setTimeout(() => printWindow.print(), 100);
    return { ok: true };
  } catch (error) {
    printWindow.close();
    return { ok: false, error: error instanceof Error ? error.message : "The report could not be rendered." };
  }
}
```

## OP-job-media-validateMediaDataUrl

Source: src/job-media.ts:20-29

Dependencies: /^data:([^;,]+);base64,([A-Za-z0-9+/=]+)$/.exec, match[1].toLowerCase, ACCEPTED_MEDIA_MIME_TYPES.includes, decodedBytes, signatures[mimeType as keyof typeof signatures]

```typescript
export function validateMediaDataUrl(src: string) {
  const match = /^data:([^;,]+);base64,([A-Za-z0-9+/=]+)$/.exec(src);
  if (!match) throw new Error("Media must be a compressed image data URL.");
  const mimeType = match[1].toLowerCase();
  if (!ACCEPTED_MEDIA_MIME_TYPES.includes(mimeType as (typeof ACCEPTED_MEDIA_MIME_TYPES)[number])) throw new Error("Only JPEG, PNG, or WebP images are accepted.");
  const bytes = decodedBytes(match[2]);
  if (bytes.byteLength > MAX_MEDIA_DATA_URL_BYTES) throw new Error("The compressed image is too large.");
  if (!signatures[mimeType as keyof typeof signatures](bytes)) throw new Error("The image content does not match its MIME type.");
  return { mimeType, byteSize: bytes.byteLength };
}
```

## OP-job-media-validateMediaFile

Source: src/job-media.ts:31-37

Dependencies: ACCEPTED_MEDIA_MIME_TYPES.includes, file.slice(0, 16).arrayBuffer, file.slice, signatures[file.type as keyof typeof signatures]

```typescript
export async function validateMediaFile(file: File) {
  if (!ACCEPTED_MEDIA_MIME_TYPES.includes(file.type as (typeof ACCEPTED_MEDIA_MIME_TYPES)[number])) throw new Error("Choose a JPEG, PNG, or WebP image.");
  if (file.size <= 0) throw new Error("The selected image is empty.");
  if (file.size > MAX_MEDIA_FILE_BYTES) throw new Error("Images must be 10 MB or smaller.");
  const header = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  if (!signatures[file.type as keyof typeof signatures](header)) throw new Error("The image content does not match its MIME type.");
}
```

## OP-job-media-compressMediaFile

Source: src/job-media.ts:48-80

Dependencies: validateMediaFile, createImageBitmap, Math.min, Math.max, Math.round, document.createElement, canvas.getContext, context.drawImage, canvas.toDataURL, validateMediaDataUrl, error.message.includes, bitmap.close

```typescript
export async function compressMediaFile(file: File): Promise<PreparedJobMedia> {
  await validateMediaFile(file);
  const bitmap = await createImageBitmap(file);
  let scale = Math.min(1, MAX_MEDIA_DIMENSION / Math.max(bitmap.width, bitmap.height));
  let quality = 0.86;
  let src = "";
  let width = 0;
  let height = 0;
  try {
    for (let attempt = 0; attempt < 8; attempt += 1) {
      width = Math.max(1, Math.round(bitmap.width * scale));
      height = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Image compression is unavailable in this browser.");
      context.drawImage(bitmap, 0, 0, width, height);
      src = canvas.toDataURL("image/jpeg", quality);
      try {
        const validated = validateMediaDataUrl(src);
        return { src, ...validated, originalName: file.name, width, height };
      } catch (error) {
        if (!(error instanceof Error) || !error.message.includes("too large")) throw error;
      }
      quality = Math.max(0.5, quality - 0.08);
      scale *= 0.78;
    }
  } finally {
    bitmap.close();
  }
  throw new Error("This image could not be compressed below 1 MB. Choose a smaller image.");
}
```

## OP-job-sheet-parseDamageMarks

Source: src/job-sheet.ts:27-38

Dependencies: JSON.parse, Array.isArray, parsed
      .filter((item): item is DamageMark => !!item && typeof item.id === "number" && Number.isFinite(item.x) && Number.isFinite(item.y))
      .map, parsed
      .filter, Number.isFinite, legacyMarkToUnified, clamp, isBodyView

```typescript
export function parseDamageMarks(raw: string | null | undefined): DamageMark[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is DamageMark => !!item && typeof item.id === "number" && Number.isFinite(item.x) && Number.isFinite(item.y))
      .map((item) => legacyMarkToUnified({ id: item.id, x: clamp(item.x), y: clamp(item.y), ...(isBodyView(item.view) ? { view: item.view } : {}) }));
  } catch {
    return [];
  }
}
```

## OP-job-sheet-serializeDamageMarks

Source: src/job-sheet.ts:40-44

Dependencies: JSON.stringify, marks.map, clamp

```typescript
export function serializeDamageMarks(marks: DamageMark[]): string {
  // New saves are always positions on the combined vehicle sheet. `parseDamageMarks`
  // maps historical four-panel marks before they reach this point.
  return JSON.stringify(marks.map((mark) => ({ id: mark.id, x: clamp(mark.x), y: clamp(mark.y) })));
}
```

## OP-job-sheet-legacyMarkToUnified

Source: src/job-sheet.ts:47-52

Dependencies: clamp

```typescript
export function legacyMarkToUnified(mark: DamageMark): DamageMark {
  if (!mark.view) return { id: mark.id, x: clamp(mark.x), y: clamp(mark.y) };
  const origins: Record<BodyView, [number, number]> = { LF: [8, 8], RF: [54, 8], LR: [8, 54], RR: [54, 54] };
  const [left, top] = origins[mark.view];
  return { id: mark.id, x: clamp(left + mark.x * .38), y: clamp(top + mark.y * .38) };
}
```

## OP-job-sheet-addDamageMark

Source: src/job-sheet.ts:54-57

Dependencies: marks.reduce, Math.max, clamp

```typescript
export function addDamageMark(marks: DamageMark[], x: number, y: number, view?: BodyView): DamageMark[] {
  const id = marks.reduce((max, mark) => Math.max(max, mark.id), 0) + 1;
  return [...marks, { id, x: clamp(x), y: clamp(y), ...(view ? { view } : {}) }];
}
```

## OP-job-sheet-removeDamageMark

Source: src/job-sheet.ts:59-61

Dependencies: marks.filter

```typescript
export function removeDamageMark(marks: DamageMark[], id: number): DamageMark[] {
  return marks.filter((mark) => mark.id !== id);
}
```

## OP-job-sheet-bodyPanelShapes

Source: src/job-sheet.ts:69-86

Dependencies: 

```typescript
export function bodyPanelShapes(view: BodyView): string {
  const front = view === "LF" || view === "RR";
  // "front" = the panel shows the front half of the car; the fender sits toward the car's nose.
  const facingLeft = view === "LF" || view === "LR";
  const noseLeft = facingLeft; // left side viewed from the left: nose points left
  const fenderOnLeft = front ? noseLeft : !noseLeft;
  const doorX = fenderOnLeft ? 44 : 12;
  const fenderX = fenderOnLeft ? 8 : 92;
  const fenderW = fenderOnLeft ? 34 : 20;
  const wheelX = fenderOnLeft ? 26 : 102;
  const lamp = front ? `<rect x="${fenderOnLeft ? 8 : 108}" y="34" width="4" height="10" rx="2" fill="#f5d76e" stroke="#9aa5b1"/>` : `<rect x="${fenderOnLeft ? 8 : 108}" y="34" width="4" height="10" rx="2" fill="#e07a7a" stroke="#9aa5b1"/>`;
  return `<rect x="8" y="12" width="104" height="52" rx="8" fill="#f3f5f8" stroke="#7b8794" stroke-width="1.5"/>`
    + `<rect x="${fenderX}" y="14" width="${fenderW}" height="48" rx="4" fill="none" stroke="#c3cad3"/>`
    + `<rect x="${doorX}" y="14" width="64" height="48" rx="5" fill="none" stroke="#9aa5b1"/>`
    + `<rect x="${doorX + 6}" y="18" width="52" height="16" rx="3" fill="#dfe6ee" stroke="#9aa5b1"/>`
    + `<rect x="${doorX + (fenderOnLeft ? 44 : 6)}" y="40" width="14" height="4" rx="2" fill="#c3cad3"/>`
    + `<circle cx="${wheelX}" cy="66" r="10" fill="#4b5563" stroke="#1f2937"/><circle cx="${wheelX}" cy="66" r="4" fill="#d1d5db"/>${lamp}`;
}
```

## OP-job-sheet-staticBodyMarksSvg

Source: src/job-sheet.ts:89-95

Dependencies: BODY_VIEWS.map, marks.filter((mark) => mark.view === item.key).map((mark) => `<g transform="translate(${mark.x * 1.2} ${mark.y * 0.8})"><circle r="5" fill="#d64545" stroke="#fff" stroke-width="1"/><text text-anchor="middle" dy="2.5" font-size="6" font-weight="700" font-family="Arial,sans-serif" fill="#fff">${mark.id}</text></g>`).join, marks.filter((mark) => mark.view === item.key).map, marks.filter, bodyPanelShapes, panels.join

```typescript
export function staticBodyMarksSvg(marks: DamageMark[]): string {
  const panels = BODY_VIEWS.map((item) => {
    const dots = marks.filter((mark) => mark.view === item.key).map((mark) => `<g transform="translate(${mark.x * 1.2} ${mark.y * 0.8})"><circle r="5" fill="#d64545" stroke="#fff" stroke-width="1"/><text text-anchor="middle" dy="2.5" font-size="6" font-weight="700" font-family="Arial,sans-serif" fill="#fff">${mark.id}</text></g>`).join("");
    return `<div style="width:170px"><div style="font:600 11px Arial,sans-serif;margin-bottom:2px">${item.label}</div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="170" height="113" role="img" aria-label="${item.label} body panel">${bodyPanelShapes(item.key)}${dots}</svg></div>`;
  });
  return `<div style="display:grid;grid-template-columns:repeat(2,170px);gap:8px">${panels.join("")}</div>`;
}
```

## OP-job-sheet-staticDamageDiagramHtml

Source: src/job-sheet.ts:98-102

Dependencies: allMarks.map, marks.map((mark) => `<span aria-label="Damage mark ${mark.id}" style="position:absolute;left:${mark.x}%;top:${mark.y}%;transform:translate(-50%,-50%);display:flex;width:20px;height:20px;align-items:center;justify-content:center;border:1px solid #fff;border-radius:50%;background:#dc3545;color:#fff;font:700 10px Arial,sans-serif;line-height:1;box-shadow:0 1px 3px rgba(0,0,0,.3)">${mark.id}</span>`).join, marks.map

```typescript
export function staticDamageDiagramHtml(allMarks: DamageMark[]): string {
  const marks = allMarks.map(legacyMarkToUnified);
  const dots = marks.map((mark) => `<span aria-label="Damage mark ${mark.id}" style="position:absolute;left:${mark.x}%;top:${mark.y}%;transform:translate(-50%,-50%);display:flex;width:20px;height:20px;align-items:center;justify-content:center;border:1px solid #fff;border-radius:50%;background:#dc3545;color:#fff;font:700 10px Arial,sans-serif;line-height:1;box-shadow:0 1px 3px rgba(0,0,0,.3)">${mark.id}</span>`).join("");
  return `<div style="width:220px;max-width:100%"><div style="position:relative;width:100%;line-height:0"><img src="${DAMAGE_DIAGRAM_ASSET}" alt="Vehicle damage diagram" style="display:block;width:100%;height:auto"/>${dots}</div><p style="margin:4px 0 0;font:11px Arial,sans-serif">${marks.length} damage mark${marks.length === 1 ? "" : "s"} recorded</p></div>`;
}
```

## OP-list-utils-normalizeSearch

Source: src/list-utils.ts:6-8

Dependencies: value.trim().toLocaleLowerCase, value.trim

```typescript
export function normalizeSearch(value: string) {
  return value.trim().toLocaleLowerCase();
}
```

## OP-list-utils-clampPage

Source: src/list-utils.ts:10-13

Dependencies: Math.max, Math.ceil, Math.min

```typescript
export function clampPage(page: number, totalCount: number, pageSize: number) {
  const pageCount = Math.max(1, Math.ceil(totalCount / Math.max(1, pageSize)));
  return Math.min(Math.max(1, page), pageCount);
}
```

## OP-list-utils-paginate

Source: src/list-utils.ts:15-28

Dependencies: Math.max, clampPage, items.slice, Math.ceil

```typescript
export function paginate<T>(items: T[], requestedPage: number, pageSize: number): PagedResult<T> {
  const safeSize = Math.max(1, pageSize);
  const page = clampPage(requestedPage, items.length, safeSize);
  const start = (page - 1) * safeSize;
  const visible = items.slice(start, start + safeSize);
  return {
    items: visible,
    totalCount: items.length,
    pageCount: Math.max(1, Math.ceil(items.length / safeSize)),
    page,
    from: items.length === 0 ? 0 : start + 1,
    to: items.length === 0 ? 0 : start + visible.length,
  };
}
```

## OP-list-utils-pageNumbers

Source: src/list-utils.ts:30-47

Dependencies: Math.max, Math.min, Array.from

```typescript
export function pageNumbers(page: number, pageCount: number) {
  const safePageCount = Math.max(1, pageCount);
  const currentPage = Math.min(Math.max(1, page), safePageCount);

  if (safePageCount <= 7) {
    return Array.from({ length: safePageCount }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", safePageCount] as const;
  }

  if (currentPage >= safePageCount - 3) {
    return [1, "ellipsis", ...Array.from({ length: 5 }, (_, index) => safePageCount - 4 + index)] as const;
  }

  return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", safePageCount] as const;
}
```

## OP-list-utils-activeFilterSummary

Source: src/list-utils.ts:49-53

Dependencies: Object.entries(filters)
    .filter(([, value]) => !ignoredValues.includes(value))
    .map, Object.entries(filters)
    .filter, Object.entries, ignoredValues.includes

```typescript
export function activeFilterSummary(filters: Record<string, string>, ignoredValues = ["", "ALL"]) {
  return Object.entries(filters)
    .filter(([, value]) => !ignoredValues.includes(value))
    .map(([label, value]) => `${label}: ${value}`);
}
```

## OP-list-utils-applyFilterDraft

Source: src/list-utils.ts:61-63

Dependencies: 

```typescript
export function applyFilterDraft<T>({ draft }: FilterDraftState<T>): FilterDraftState<T> {
  return { draft, applied: draft, page: 1 };
}
```

## OP-list-utils-clearFilterDraft

Source: src/list-utils.ts:65-67

Dependencies: 

```typescript
export function clearFilterDraft<T>(_state: FilterDraftState<T>, empty: T): FilterDraftState<T> {
  return { draft: empty, applied: empty, page: 1 };
}
```

## OP-materials-canManageMaterialRows

Source: src/materials.ts:10-13

Dependencies: 

```typescript
export function canManageMaterialRows(actor: Pick<User, "id" | "role">, job: { advisor_id: number; main_status: MainStatus; materialApprovalStatus?: "Pending" | "Approved" | "Rejected" }) {
  const linkedAdvisor = actor.role === "service" && actor.id === job.advisor_id;
  return (actor.role === "admin" || linkedAdvisor) && (job.main_status === "IN_PROGRESS" || (linkedAdvisor && job.main_status === "HOLD" && job.materialApprovalStatus === "Rejected"));
}
```

## OP-materials-materialRowStatus

Source: src/materials.ts:15-17

Dependencies: 

```typescript
export function materialRowStatus(row: Pick<MaterialRequest, "status">): MaterialRowStatus {
  return (row.status ?? "Requested") as MaterialRowStatus;
}
```

## OP-materials-materialRowActions

Source: src/materials.ts:20-28

Dependencies: materialRowStatus

```typescript
export function materialRowActions(row: Pick<MaterialRequest, "status" | "invoiced_in">): MaterialRowAction[] {
  if (row.invoiced_in) return [];
  switch (materialRowStatus(row)) {
    case "Draft": return ["edit", "request", "delete"];
    case "Requested":
    case "Re-requested": return ["re-request", "cancel"];
    default: return [];
  }
}
```

## OP-materials-stockOnHand

Source: src/materials.ts:30-32

Dependencies: 

```typescript
export function stockOnHand(item: Pick<InventoryItem, "stock_qty"> | undefined) {
  return item ? item.stock_qty : 0;
}
```

## OP-materials-overStockWarning

Source: src/materials.ts:35-37

Dependencies: 

```typescript
export function overStockWarning(qty: number, onHand: number): string | undefined {
  return qty > onHand ? `Requested ${qty} is more than the ${onHand} in stock.` : undefined;
}
```

## OP-materials-triageMaterialDemand

Source: src/materials.ts:57-66

Dependencies: Math.max, stockOnHand

```typescript
export function triageMaterialDemand(
  row: Pick<MaterialRequest, "requested_qty" | "issued_qty">,
  item: Pick<InventoryItem, "stock_qty"> | undefined,
  alreadyAllocated = 0,
): MaterialDemandTriage {
  const outstanding = Math.max(0, row.requested_qty - row.issued_qty);
  return Math.max(0, stockOnHand(item) - alreadyAllocated) >= outstanding
    ? "issuable"
    : "procurement";
}
```

## OP-materials-triageMaterialDemands

Source: src/materials.ts:73-78

Dependencies: allocateMaterialDemands(demands, inventory).map, allocateMaterialDemands

```typescript
export function triageMaterialDemands(
  demands: readonly MaterialDemand[],
  inventory: readonly Pick<InventoryItem, "id" | "stock_qty">[],
) {
  return allocateMaterialDemands(demands, inventory).map(({ outcome }) => outcome);
}
```

## OP-materials-allocateMaterialDemands

Source: src/materials.ts:84-101

Dependencies: inventory.map, demands.map, allocatedByItem.get, Math.max, stockOnHand, inventoryById.get, allocatedByItem.set, Math.min

```typescript
export function allocateMaterialDemands(
  demands: readonly MaterialDemand[],
  inventory: readonly Pick<InventoryItem, "id" | "stock_qty">[],
): MaterialDemandAllocation[] {
  const allocatedByItem = new Map<number, number>();
  const inventoryById = new Map(inventory.map((item) => [item.id, item]));
  return demands.map((demand) => {
    const allocated = allocatedByItem.get(demand.item_id) ?? 0;
    const outstanding = Math.max(0, demand.requested_qty - demand.issued_qty);
    const available = Math.max(
      0,
      stockOnHand(inventoryById.get(demand.item_id)) - allocated,
    );
    const procurementQty = Math.max(0, outstanding - available);
    allocatedByItem.set(demand.item_id, allocated + Math.min(outstanding, available));
    return { outcome: procurementQty ? "procurement" : "issuable", procurementQty };
  });
}
```

## OP-materials-filterInventory

Source: src/materials.ts:103-106

Dependencies: query.trim().toLowerCase, query.trim, items.filter, `${item.name} ${item.sku} ${item.category}`.toLowerCase().includes, `${item.name} ${item.sku} ${item.category}`.toLowerCase

```typescript
export function filterInventory(items: readonly InventoryItem[], query: string) {
  const needle = query.trim().toLowerCase();
  return items.filter((item) => !needle || `${item.name} ${item.sku} ${item.category}`.toLowerCase().includes(needle));
}
```

## OP-materials-pickerLabel

Source: src/materials.ts:108-110

Dependencies: 

```typescript
export function pickerLabel(item: Pick<InventoryItem, "name" | "stock_qty" | "unit">) {
  return `${item.name} · in stock: ${item.stock_qty}`;
}
```

## OP-materials-canReleaseMaterialRows

Source: src/materials.ts:116-118

Dependencies: 

```typescript
export function canReleaseMaterialRows(actor: Actor, job: JobRef) {
  return (actor.role === "admin" || actor.role === "store") && (job.main_status === "IN_PROGRESS" || job.main_status === "HOLD");
}
```

## OP-materials-canEditIssuedMaterialRows

Source: src/materials.ts:121-124

Dependencies: 

```typescript
export function canEditIssuedMaterialRows(actor: Actor, job: JobRef) {
  const who = actor.role === "admin" || actor.role === "store" || (actor.role === "service" && actor.id === job.advisor_id);
  return who && (job.main_status === "IN_PROGRESS" || job.main_status === "HOLD" || job.main_status === "COMPLETED");
}
```

## OP-materials-materialRowActionsFor

Source: src/materials.ts:127-134

Dependencies: materialRowStatus, canManageMaterialRows, materialRowActions, canReleaseMaterialRows, actions.push, canEditIssuedMaterialRows

```typescript
export function materialRowActionsFor(actor: Actor, job: JobRef, row: Pick<MaterialRequest, "status" | "invoiced_in">): MaterialRowAction[] {
  if (row.invoiced_in) return [];
  const status = materialRowStatus(row);
  const actions: MaterialRowAction[] = canManageMaterialRows(actor, job) ? materialRowActions(row) : [];
  if ((status === "Requested" || status === "Re-requested") && canReleaseMaterialRows(actor, job)) actions.push("release");
  if (status === "Issued" && canEditIssuedMaterialRows(actor, job)) actions.push("edit-issued");
  return actions;
}
```

## OP-pdf-render-renderHtmlToPdf

Source: src/pdf-render.ts:11-42

Dependencies: document.createElement, host.setAttribute, document.body.appendChild, Promise.all, import, html2canvas, pdf.internal.pageSize.getWidth, pdf.internal.pageSize.getHeight, Math.floor, Math.max, Math.ceil, Math.min, part.getContext, context.fillRect, context.drawImage, pdf.addPage, pdf.addImage, part.toDataURL, pdf.save, host.remove

```typescript
export async function renderHtmlToPdf(html: string, filename: string): Promise<void> {
  const host = document.createElement("div");
  host.setAttribute("aria-hidden", "true");
  host.style.cssText = `position:fixed;left:0;top:0;z-index:-1;pointer-events:none;box-sizing:border-box;width:${PAGE_WIDTH_PX}px;background:#fff;color:#111`;
  host.innerHTML = html;
  document.body.appendChild(host);
  try {
    const [{ jsPDF }, { default: html2canvas }] = await Promise.all([import("jspdf"), import("html2canvas")]);
    const canvas = await html2canvas(host, { scale: SCALE, useCORS: false, backgroundColor: "#ffffff", width: PAGE_WIDTH_PX, windowWidth: PAGE_WIDTH_PX, scrollX: 0, scrollY: 0 });
    const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const slice = Math.floor(canvas.width * A4_RATIO);
    const pages = Math.max(1, Math.ceil((canvas.height - 2) / slice));
    for (let index = 0; index < pages; index += 1) {
      const height = Math.min(slice, canvas.height - index * slice);
      const part = document.createElement("canvas");
      part.width = canvas.width;
      part.height = slice;
      const context = part.getContext("2d");
      if (!context) throw new Error("Canvas is not available.");
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, part.width, part.height);
      context.drawImage(canvas, 0, index * slice, canvas.width, height, 0, 0, canvas.width, height);
      if (index > 0) pdf.addPage();
      pdf.addImage(part.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, pageWidth, pageHeight);
    }
    pdf.save(filename);
  } finally {
    host.remove();
  }
}
```

## OP-purchase-order-supplier-display-supplierNameForPurchaseOrder

Source: src/purchase-order-supplier-display.ts:8-15

Dependencies: suppliers.find, String, Number

```typescript
export function supplierNameForPurchaseOrder(
  suppliers: readonly Pick<Supplier, "id" | "name">[],
  supplierId: number | string | null | undefined,
) {
  const supplier = suppliers.find((candidate) => String(candidate.id) === String(supplierId));
  if (supplier) return supplier.name;
  return Number(supplierId) > 0 ? "Unknown supplier" : "Supplier pending";
}
```

## OP-report-templates-seedReportTemplates

Source: src/report-templates.ts:106-130

Dependencies: new Date(now).toISOString, (Object.keys(REPORT_CATEGORY_LABELS) as ReportCategory[]).map, Object.keys, defaults.find, quotation.html.replaceAll

```typescript
export function seedReportTemplates(now: Date | string = new Date()): ReportTemplate[] {
  const timestamp = new Date(now).toISOString();
  const defaults = (Object.keys(REPORT_CATEGORY_LABELS) as ReportCategory[]).map((category) => ({
    id: `template-${category}-default`, category, name: `Standard ${REPORT_CATEGORY_LABELS[category]}`,
    html: DEFAULT_TEMPLATE_HTML[category], active: true, createdAt: timestamp, updatedAt: timestamp, seedVersion: DEFAULT_TEMPLATE_VERSION,
  }));
  const quotation = defaults.find((template) => template.category === "quotation")!;
  return [
    ...defaults,
    {
      ...quotation,
      id: "template-quotation-marron",
      name: "Marron Template",
      html: quotation.html.replaceAll(ACCENT, "#8b2f3c"),
      active: false,
    },
    {
      ...quotation,
      id: "template-quotation-yellow",
      name: "Yellow Template",
      html: quotation.html.replaceAll(ACCENT, "#d97706"),
      active: false,
    },
  ];
}
```

## OP-report-templates-findUnsupportedPlaceholders

Source: src/report-templates.ts:136-143

Dependencies: [...html.matchAll(LOOP_PATTERN)].map, html.matchAll, html.replace, namesIn(outside).filter, namesIn, allowed.has, loops.flatMap, namesIn(body).filter, inLoop.has, [...new Set(found)].sort

```typescript
export function findUnsupportedPlaceholders(html: string, category: ReportCategory): string[] {
  const allowed = new Set<string>(REPORT_PLACEHOLDERS[category]);
  const inLoop = new Set<string>([...allowed, ...LINE_PLACEHOLDERS]);
  const loops = [...html.matchAll(LOOP_PATTERN)].map((match) => match[1]);
  const outside = html.replace(LOOP_PATTERN, "");
  const found = [...namesIn(outside).filter((name) => !allowed.has(name)), ...loops.flatMap((body) => namesIn(body).filter((name) => !inLoop.has(name)))];
  return [...new Set(found)].sort();
}
```

## OP-report-templates-rupeesInWords

Source: src/report-templates.ts:147-162

Dependencies: Math.floor, below100, Math.round, Math.max, parts.push, below1000, parts.join

```typescript
export function rupeesInWords(amount: number): string {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const below100 = (n: number) => n < 20 ? ones[n] : `${tens[Math.floor(n / 10)]}${n % 10 ? ` ${ones[n % 10]}` : ""}`;
  const below1000 = (n: number) => `${n >= 100 ? `${ones[Math.floor(n / 100)]} Hundred${n % 100 ? " " : ""}` : ""}${below100(n % 100)}`;
  const total = Math.round(Math.max(0, amount) * 100);
  let rupees = Math.floor(total / 100);
  const paise = total % 100;
  const parts: string[] = [];
  for (const [size, name] of [[10000000, "Crore"], [100000, "Lakh"], [1000, "Thousand"]] as const) {
    if (rupees >= size) { parts.push(`${below1000(Math.floor(rupees / size))} ${name}`); rupees %= size; }
  }
  if (rupees) parts.push(below1000(rupees));
  const text = parts.join(" ") || "Zero";
  return `Rupees ${text}${paise ? ` and ${below100(paise)} Paise` : ""} Only`;
}
```

## OP-report-templates-reportAvailable

Source: src/report-templates.ts:191-197

Dependencies: Boolean, view.payments.some

```typescript
export function reportAvailable(category: ReportCategory, view: JobView) {
  if (category === "estimate") return Boolean(view.estimate);
  if (category === "invoice") return Boolean(view.invoice && !view.invoice.voided_at);
  if (category === "gate-pass") return Boolean(view.invoice && view.gate_pass && !view.gate_pass.voided_at && view.gate_pass.invoice_id === view.invoice.id);
  if (category === "payment-receipt") return Boolean(view.invoice && view.receipt && !view.receipt.voided_at && view.receipt.invoice_id === view.invoice.id && view.payments.some((payment) => payment.invoice_id === view.invoice!.id));
  return Boolean(view.job);
}
```

## OP-report-templates-buildReportValues

Source: src/report-templates.ts:199-232

Dependencies: reportItems.reduce, invoiceTotals, reportItems.map, normalizeGstLine, view.payments.reduce, value, date, `${view.vehicle.make} ${view.vehicle.model}`.trim, money, Math.max, imageBlock, rupeesInWords, table, paymentDetailsBlock, view.payments.map, view.tasks.map, view.qc_checks.map

```typescript
export function buildReportValues(category: ReportCategory, view: JobView, settings: WorkshopBusinessSettings, assets: CompanyAssets): Record<string, string> {
  const reportItems = category === "invoice" || category === "payment-receipt" ? view.invoice_items ?? view.estimate_items : view.estimate_items;
  const subtotal = reportItems.reduce((sum, item) => sum + item.qty * item.rate, 0);
  const discount = category === "invoice" || category === "payment-receipt" ? view.invoice?.discount ?? 0 : view.estimate?.discount ?? 0;
  const fallbackGst = category === "invoice" || category === "payment-receipt" ? view.invoice?.gst_rate ?? settings.billing.defaultGstPercent : view.estimate?.gst_rate ?? settings.billing.defaultGstPercent;
  const totals = invoiceTotals(reportItems.map((item) => ({ qty: item.qty, rate: item.rate, ...normalizeGstLine(item.gst_type, item.gst_rate, fallbackGst) })), discount);
  const gst = totals.gst;
  const invoiceTotal = view.invoice?.total ?? totals.total;
  const paid = view.payments.reduce((sum, payment) => sum + payment.amount, 0);
  const reportNumber = category === "invoice" ? view.invoice?.invoice_no : category === "estimate" ? `EST-${view.job.job_no}` : category === "gate-pass" ? view.gate_pass?.gate_pass_no : category === "payment-receipt" ? view.receipt?.receipt_no : view.job.job_no;
  return {
    "company.name": value(settings.profile.businessName), "company.legal_name": value(settings.profile.legalName), "company.address": value(settings.profile.address),
    "company.phone": value(settings.profile.phone), "company.email": value(settings.profile.email), "company.gstin": value(settings.billing.gstin), "company.footer": value(settings.profile.footer),
    "company.bank_account_holder": value(settings.billing.bankAccountHolder), "company.bank_name": value(settings.billing.bankName), "company.bank_account_number": value(settings.billing.bankAccountNumber),
    "company.bank_ifsc": value(settings.billing.bankIfsc), "company.bank_branch": value(settings.billing.bankBranch), "company.upi_id": value(settings.billing.upiId),
    "report.title": REPORT_CATEGORY_LABELS[category], "report.number": value(reportNumber), "report.date": date(view.invoice?.created_at ?? view.visit.received_at),
    "job.number": value(view.job.job_no), "job.status": value(view.job.main_status), "job.sub_status": value(view.job.sub_status), "job.work_list": value(view.job.work_list || view.visit.requested_work),
    "customer.name": value(view.customer.name), "customer.mobile": value(view.customer.mobile), "customer.type": value(view.customer.type),
    "vehicle.registration": value(view.vehicle.number), "vehicle.description": value(`${view.vehicle.make} ${view.vehicle.model}`.trim()), "vehicle.make": value(view.vehicle.make), "vehicle.model": value(view.vehicle.model), "vehicle.color": value(view.vehicle.color), "vehicle.km": value(view.job.final_km ?? view.vehicle.km),
    "dates.received": date(view.visit.received_at), "dates.promised": date(view.job.promised_at), "dates.delivered": date(view.job.closed_at || view.job.delivery_by),
    "staff.advisor": value(view.advisor.name), "staff.technician": value(view.technician.name),
    "invoice.status": value(view.invoice?.status), "blocks.damage_diagram": DAMAGE_SLOT, "invoice.total": money(invoiceTotal), "invoice.paid": money(paid), "invoice.balance": money(Math.max(0, invoiceTotal - paid)), "receipt.number": value(view.receipt?.receipt_no),
    "blocks.company_logo": imageBlock(assets.logo, "Company logo"), "blocks.company_stamp": imageBlock(assets.stamp, "Company stamp"), "blocks.authorized_signature": imageBlock(assets.authorizedSignature, "Authorized signature"),
    "company.logo": imageBlock(assets.logo, "Company logo"), "company.stamp": imageBlock(assets.stamp, "Company stamp"), "company.signature": imageBlock(assets.authorizedSignature, "Authorized signature"),
    "estimate.total": money(totals.total), "quotation.total": money(totals.total), "quotation.valid_until": value(view.job.promised_at), "quotation.notes": "",
    "report.subtotal": money(subtotal), "report.discount": discount ? `- ${money(discount)}` : money(0), "report.gst": money(gst),
    "report.amount_words": rupeesInWords(category === "payment-receipt" ? paid : category === "estimate" ? totals.total : invoiceTotal),
    "blocks.line_items": table(["Type", "Description", "Qty", "Rate", "GST treatment", "GST %", "Amount"], reportItems.map((item) => [item.kind, item.description, item.qty, money(item.rate), item.gst_type ?? (item.gst_rate === 0 ? "No GST" : "CGST+SGST"), `${item.gst_rate ?? fallbackGst}%`, money(item.qty * item.rate)])),
    "blocks.payment_details": category === "invoice" ? paymentDetailsBlock(settings) : "",
    "blocks.payments": table(["Date", "Mode", "Reference", "Amount"], view.payments.map((payment) => [date(payment.created_at), payment.mode, value(payment.reference), money(payment.amount)])),
    "blocks.tasks": table(["Task", "Status", "Notes"], view.tasks.map((task) => [task.title, task.status, value(task.notes)])),
    "blocks.qc_rows": table(["Check", "Result"], view.qc_checks.map((check) => [check.label, check.passed ? "Pass" : value(check.fail_reason || "Pending")])),
  };
}
```

## OP-report-templates-buildReportLines

Source: src/report-templates.ts:235-238

Dependencies: items.map, value, String, money

```typescript
export function buildReportLines(category: ReportCategory, view: JobView): ReportLine[] {
  const items = category === "invoice" || category === "payment-receipt" ? view.invoice_items ?? view.estimate_items : view.estimate_items;
  return items.map((item) => ({ kind: value(item.kind), description: value(item.description), qty: String(item.qty), rate: money(item.rate), amount: money(item.qty * item.rate) }));
}
```

## OP-report-templates-sampleReportLines

Source: src/report-templates.ts:240-245

Dependencies: 

```typescript
export function sampleReportLines(): ReportLine[] {
  return [
    { kind: "Service", description: "Ceramic coating", qty: "1", rate: "₹8,000.00", amount: "₹8,000.00" },
    { kind: "Service", description: "Interior detailing", qty: "1", rate: "₹2,000.00", amount: "₹2,000.00" },
  ];
}
```

## OP-report-templates-sampleReportValues

Source: src/report-templates.ts:247-266

Dependencies: Object.fromEntries, REPORT_PLACEHOLDERS[category].map, name.split(".").at(-1)?.replaceAll, name.split(".").at, name.split, table

```typescript
export function sampleReportValues(category: ReportCategory): Record<string, string> {
  const scalar: Record<string, string> = Object.fromEntries(REPORT_PLACEHOLDERS[category].map((name) => [name, `Sample ${name.split(".").at(-1)?.replaceAll("_", " ")}`]));
  return {
    ...scalar,
    "company.name": "WorkshopOS Demo Studio", "company.legal_name": "WorkshopOS Automotive Services", "company.address": "Bhubaneswar, Odisha", "company.phone": "+91 98765 43210", "company.email": "hello@workshopos.demo", "company.gstin": "21ABCDE1234F1Z5", "company.footer": "Thank you for your business.", "estimate.total": "₹11,800.00", "report.subtotal": "₹10,000.00", "report.discount": "- ₹0.00", "report.gst": "₹1,800.00", "report.amount_words": "Rupees Eleven Thousand Eight Hundred Only",
    "company.logo": `<div style="font-weight:bold;font-size:20px;color:#fff">WorkshopOS</div>`, "company.stamp": `<div style="border:2px solid #15803d;border-radius:50%;padding:15px;color:#15803d">STAMP</div>`, "company.signature": `<div style="min-width:140px;text-align:center"><em>Authorized signature</em><hr></div>`,
    "company.bank_account_holder": "WorkshopOS Automotive Services", "company.bank_name": "State Bank of India", "company.bank_account_number": "001234567890", "company.bank_ifsc": "SBIN0001234", "company.bank_branch": "Bhubaneswar Main Branch", "company.upi_id": "workshopos@sbi",
    "report.title": REPORT_CATEGORY_LABELS[category], "report.number": category === "invoice" ? "INV-2026-0042" : category === "gate-pass" ? "GP-2026-0042" : category === "payment-receipt" ? "REC-2026-0042" : "JC-2026-0042", "report.date": "24/09/2026",
    "job.number": "JC-2026-0042", "job.status": "COMPLETED", "job.sub_status": "Invoice Ready", "job.work_list": "Ceramic coating and interior detailing",
    "customer.name": "Aarav Sharma", "customer.mobile": "98765 00042", "customer.type": "Individual", "vehicle.registration": "OD02AB0042", "vehicle.description": "Honda City", "vehicle.make": "Honda", "vehicle.model": "City", "vehicle.color": "White", "vehicle.km": "42,125",
    "dates.received": "22/09/2026", "dates.promised": "24/09/2026", "dates.delivered": "24/09/2026", "staff.advisor": "Meera Das", "staff.technician": "Rohan Singh",
    "invoice.status": "Cleared", "blocks.damage_diagram": DAMAGE_SLOT, "invoice.total": "₹11,800.00", "invoice.paid": "₹8,000.00", "invoice.balance": "₹3,800.00", "receipt.number": "REC-2026-0042",
    "blocks.company_logo": `<div style="font-weight:bold;font-size:20px;color:#fff">WorkshopOS</div>`, "blocks.company_stamp": `<div style="border:2px solid #15803d;border-radius:50%;padding:15px;color:#15803d">STAMP</div>`, "blocks.authorized_signature": `<div style="min-width:140px;text-align:center"><em>Authorized signature</em><hr></div>`,
    "blocks.line_items": table(["Type", "Description", "Qty", "Rate", "Amount"], [["Service", "Ceramic coating", 1, "₹8,000.00", "₹8,000.00"], ["Service", "Interior detailing", 1, "₹2,000.00", "₹2,000.00"]]),
    "blocks.payments": table(["Date", "Mode", "Reference", "Amount"], [["24/09/2026", "UPI", "UPI-0042", "₹8,000.00"]]),
    "blocks.payment_details": `<section><h3 style="margin:0 0 4px;font-size:12px">Tax &amp; Payment Details</h3>${table(["Detail", "Value"], [["GSTIN", "21ABCDE1234F1Z5"], ["Bank", "State Bank of India"], ["UPI ID", "workshopos@sbi"]])}</section>`,
    "blocks.tasks": table(["Task", "Status", "Notes"], [["Ceramic coating", "Completed", "Final coat cured"], ["Interior detailing", "Completed", "Quality checked"]]),
    "blocks.qc_rows": table(["Check", "Result"], [["Surface finish", "Pass"], ["Customer items", "Pass"]]),
  };
}
```

## OP-report-templates-sanitizeReportHtml

Source: src/report-templates.ts:271-293

Dependencies: DOMPurify.sanitize, [...SAFE_ELEMENTS].map, tag.toLowerCase, new DOMParser().parseFromString, document.body.querySelectorAll, DROP_WITH_CONTENT.has, element.remove, SAFE_ELEMENTS.has, element.replaceWith, attribute.name.toLowerCase, attribute.value.trim, ["class", "title", "alt", "colspan", "rowspan", "width", "height", "style"].includes, name.startsWith, element.removeAttribute, /url\s*\(|expression\s*\(|@import|javascript:/i.test, /^(#|mailto:|tel:)/i.test, /^data:image\/(png|jpeg);base64,/i.test, element.setAttribute

```typescript
export function sanitizeReportHtml(input: string): string {
  const html = DOMPurify.isSupported
    ? DOMPurify.sanitize(input, { ALLOWED_TAGS: [...SAFE_ELEMENTS].map((tag) => tag.toLowerCase()), ALLOWED_ATTR: ["class", "title", "alt", "colspan", "rowspan", "width", "height", "style", "href", "src"], ALLOW_DATA_ATTR: false })
    : input;
  if (typeof DOMParser === "undefined") return html;
  const document = new DOMParser().parseFromString(html, "text/html");
  for (const element of [...document.body.querySelectorAll("*")]) {
    if (DROP_WITH_CONTENT.has(element.tagName)) { element.remove(); continue; }
    if (!SAFE_ELEMENTS.has(element.tagName)) { element.replaceWith(...element.childNodes); continue; }
    for (const attribute of [...element.attributes]) {
      const name = attribute.name.toLowerCase();
      const raw = attribute.value.trim();
      const allowed = ["class", "title", "alt", "colspan", "rowspan", "width", "height", "style"].includes(name)
        || (element.tagName === "A" && name === "href") || (element.tagName === "IMG" && name === "src");
      if (!allowed || name.startsWith("on")) { element.removeAttribute(attribute.name); continue; }
      if (name === "style" && /url\s*\(|expression\s*\(|@import|javascript:/i.test(raw)) element.removeAttribute(attribute.name);
      if (name === "href" && !/^(#|mailto:|tel:)/i.test(raw)) element.removeAttribute(attribute.name);
      if (name === "src" && !/^data:image\/(png|jpeg);base64,/i.test(raw)) element.removeAttribute(attribute.name);
    }
    if (element.tagName === "A") element.setAttribute("rel", "noopener noreferrer");
  }
  return document.body.innerHTML;
}
```

## OP-report-templates-renderReportTemplate

Source: src/report-templates.ts:296-309

Dependencies: findUnsupportedPlaceholders, unsupported.join, Object.keys(values).filter, Object.keys, name.startsWith, text.replace, rawName.trim, blockNames.has, escapeHtml, template.html.replace, lines
    .map((line) => scalar(body.replace(/{{\s*line\.(kind|description|qty|rate|amount)\s*}}/g, (_m, key: keyof ReportLine) => escapeHtml(line[key]))))
    .join, lines
    .map, scalar, body.replace, sanitizeReportHtml

```typescript
export function renderReportTemplate(template: Pick<ReportTemplate, "html" | "category">, values: Record<string, string>, lines: readonly ReportLine[] = []): string {
  const unsupported = findUnsupportedPlaceholders(template.html, template.category);
  if (unsupported.length) throw new Error(`Unsupported placeholders: ${unsupported.join(", ")}`);
  const blockNames = new Set(Object.keys(values).filter((name) => name.startsWith("blocks.") || name === "company.logo" || name === "company.stamp" || name === "company.signature"));
  const scalar = (text: string) => text.replace(/{{\s*([^{}]+?)\s*}}/g, (_match, rawName: string) => {
    const name = rawName.trim();
    const replacement = values[name] ?? "—";
    return blockNames.has(name) ? replacement : escapeHtml(replacement);
  });
  const expanded = template.html.replace(LOOP_PATTERN, (_match, body: string) => lines
    .map((line) => scalar(body.replace(/{{\s*line\.(kind|description|qty|rate|amount)\s*}}/g, (_m, key: keyof ReportLine) => escapeHtml(line[key]))))
    .join(""));
  return sanitizeReportHtml(scalar(expanded));
}
```

## OP-report-templates-buildPrintDocument

Source: src/report-templates.ts:313-315

Dependencies: escapeHtml

```typescript
export function buildPrintDocument(title: string, bodyHtml: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${PRINT_CSP}"><title>${escapeHtml(title)}</title><style>@page{size:A4;margin:0}html,body{margin:0;background:white;print-color-adjust:exact;-webkit-print-color-adjust:exact}main{max-width:100%}body{font-family:Arial,sans-serif}img{max-width:100%;height:auto}table{page-break-inside:auto}tr{page-break-inside:avoid}@media print{button{display:none}}</style></head><body>${bodyHtml}</body></html>`;
}
```

## OP-service-advisor-isServiceActiveJob

Source: src/service-advisor.ts:6-8

Dependencies: SERVICE_ACTIVE_JOB_STATUSES.includes

```typescript
export function isServiceActiveJob(view: Pick<JobView, "job">) {
  return SERVICE_ACTIVE_JOB_STATUSES.includes(view.job.main_status);
}
```

## OP-service-advisor-canAddServiceFollowup

Source: src/service-advisor.ts:10-12

Dependencies: FOLLOWUP_EDITABLE_JOB_STATUSES.includes

```typescript
export function canAddServiceFollowup(view: Pick<JobView, "job">) {
  return FOLLOWUP_EDITABLE_JOB_STATUSES.includes(view.job.main_status);
}
```

## OP-service-advisor-serviceFollowupStatus

Source: src/service-advisor.ts:14-19

Dependencies: view.followups.filter, Boolean

```typescript
export function serviceFollowupStatus(view: Pick<JobView, "followups">) {
  const completed = view.followups.filter((followup) => Boolean(followup.done)).length;
  return view.followups.length > 0 && completed === view.followups.length
    ? `Done(${completed})`
    : `Pending (${completed}/${view.followups.length})`;
}
```