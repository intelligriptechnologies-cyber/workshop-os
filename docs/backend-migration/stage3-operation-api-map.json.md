[
  {
    "id": "OP-admin-demo-state-resolveRoleMenuPageKeys",
    "name": "resolveRoleMenuPageKeys",
    "file": "src/admin-demo-state.ts",
    "span": "src/admin-demo-state.ts:158-161",
    "calls": [
      "ROLE_MENU_PAGE_KEYS[role].filter",
      "permitted.has"
    ],
    "sql": [],
    "body": "export function resolveRoleMenuPageKeys(role: Role, permittedPages: readonly AdminPageKey[]): AdminPageKey[] {\n  const permitted = new Set(permittedPages);\n  return ROLE_MENU_PAGE_KEYS[role].filter((key) => permitted.has(key));\n}",
    "parameters": [
      {
        "name": "role",
        "type": "Role",
        "optional": false
      },
      {
        "name": "permittedPages",
        "type": "readonly AdminPageKey[]",
        "optional": false
      }
    ],
    "returnType": "AdminPageKey[]",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "AdminPageKey[]"
  },
  {
    "id": "OP-admin-demo-state-createDefaultAdminDemoState",
    "name": "createDefaultAdminDemoState",
    "file": "src/admin-demo-state.ts",
    "span": "src/admin-demo-state.ts:469-483",
    "calls": [
      "new Date(now).toISOString",
      "builtInRoles",
      "clone",
      "defaultLogs",
      "seedReportTemplates"
    ],
    "sql": [],
    "body": "export function createDefaultAdminDemoState(now: Date | string = DEFAULT_TIMESTAMP): AdminDemoState {\n  const timestamp = new Date(now).toISOString();\n  return {\n    version: ADMIN_DEMO_STATE_VERSION,\n    roles: builtInRoles(timestamp),\n    rolePageAccess: clone(DEFAULT_ROLE_PAGE_ACCESS),\n    businessSettings: clone(DEFAULT_SETTINGS),\n    appTheme: { ...DEFAULT_APP_THEME },\n    logs: defaultLogs(timestamp),\n    importBatches: [],\n    sessionInventory: [],\n    reportTemplates: seedReportTemplates(timestamp),\n    companyAssets: { logo: null, stamp: null, authorizedSignature: null },\n  };\n}",
    "parameters": [
      {
        "name": "now",
        "type": "Date | string",
        "optional": true,
        "default": "DEFAULT_TIMESTAMP"
      }
    ],
    "returnType": "AdminDemoState",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "AdminDemoState"
  },
  {
    "id": "OP-admin-demo-state-normalizeAppTheme",
    "name": "normalizeAppTheme",
    "file": "src/admin-demo-state.ts",
    "span": "src/admin-demo-state.ts:485-489",
    "calls": [
      "APP_THEME_FONTS.some",
      "APP_THEME_PALETTES.some"
    ],
    "sql": [],
    "body": "export function normalizeAppTheme(theme?: Partial<AppTheme>): AppTheme {\n  const fontId = APP_THEME_FONTS.some((font) => font.id === theme?.fontId) ? theme!.fontId! : DEFAULT_APP_THEME.fontId;\n  const paletteId = APP_THEME_PALETTES.some((palette) => palette.id === theme?.paletteId) ? theme!.paletteId! : DEFAULT_APP_THEME.paletteId;\n  return { fontId, paletteId };\n}",
    "parameters": [
      {
        "name": "theme",
        "type": "Partial<AppTheme>",
        "optional": true
      }
    ],
    "returnType": "AppTheme",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "AppTheme"
  },
  {
    "id": "OP-admin-demo-state-loadAdminDemoState",
    "name": "loadAdminDemoState",
    "file": "src/admin-demo-state.ts",
    "span": "src/admin-demo-state.ts:564-574",
    "calls": [
      "browserSessionStorage",
      "createDefaultAdminDemoState",
      "storage.getItem",
      "hydrateState",
      "JSON.parse",
      "enforceLogRetention"
    ],
    "sql": [],
    "body": "export function loadAdminDemoState(storage: SessionStorageLike | undefined = browserSessionStorage(), now: Date | string = new Date()): AdminDemoState {\n  if (!storage) return createDefaultAdminDemoState(now);\n  try {\n    const raw = storage.getItem(ADMIN_DEMO_STORAGE_KEY) ?? storage.getItem(LEGACY_ADMIN_DEMO_STORAGE_KEY);\n    if (!raw) return createDefaultAdminDemoState(now);\n    const hydrated = hydrateState(JSON.parse(raw));\n    return hydrated ? enforceLogRetention(hydrated, now) : createDefaultAdminDemoState(now);\n  } catch {\n    return createDefaultAdminDemoState(now);\n  }\n}",
    "parameters": [
      {
        "name": "storage",
        "type": "SessionStorageLike | undefined",
        "optional": true,
        "default": "browserSessionStorage()"
      },
      {
        "name": "now",
        "type": "Date | string",
        "optional": true,
        "default": "new Date()"
      }
    ],
    "returnType": "AdminDemoState",
    "classification": "READ",
    "endpoint": "GET /api/v1/ui/admin-state",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "AdminDemoState"
  },
  {
    "id": "OP-admin-demo-state-saveAdminDemoState",
    "name": "saveAdminDemoState",
    "file": "src/admin-demo-state.ts",
    "span": "src/admin-demo-state.ts:576-580",
    "calls": [
      "browserSessionStorage",
      "enforceLogRetention",
      "storage?.setItem",
      "JSON.stringify"
    ],
    "sql": [],
    "body": "export function saveAdminDemoState(state: AdminDemoState, storage: SessionStorageLike | undefined = browserSessionStorage(), now: Date | string = new Date()): AdminDemoState {\n  const retained = enforceLogRetention({ ...state, version: ADMIN_DEMO_STATE_VERSION }, now);\n  storage?.setItem(ADMIN_DEMO_STORAGE_KEY, JSON.stringify(retained));\n  return retained;\n}",
    "parameters": [
      {
        "name": "state",
        "type": "AdminDemoState",
        "optional": false
      },
      {
        "name": "storage",
        "type": "SessionStorageLike | undefined",
        "optional": true,
        "default": "browserSessionStorage()"
      },
      {
        "name": "now",
        "type": "Date | string",
        "optional": true,
        "default": "new Date()"
      }
    ],
    "returnType": "AdminDemoState",
    "classification": "INTERNAL",
    "endpoint": "Explicit commands or server audit hook; no whole-state replacement/reset API",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "AdminDemoState"
  },
  {
    "id": "OP-admin-demo-state-resetAdminDemoState",
    "name": "resetAdminDemoState",
    "file": "src/admin-demo-state.ts",
    "span": "src/admin-demo-state.ts:582-585",
    "calls": [
      "browserSessionStorage",
      "storage?.removeItem",
      "createDefaultAdminDemoState"
    ],
    "sql": [],
    "body": "export function resetAdminDemoState(storage: SessionStorageLike | undefined = browserSessionStorage(), now: Date | string = new Date()): AdminDemoState {\n  storage?.removeItem(ADMIN_DEMO_STORAGE_KEY);\n  return createDefaultAdminDemoState(now);\n}",
    "parameters": [
      {
        "name": "storage",
        "type": "SessionStorageLike | undefined",
        "optional": true,
        "default": "browserSessionStorage()"
      },
      {
        "name": "now",
        "type": "Date | string",
        "optional": true,
        "default": "new Date()"
      }
    ],
    "returnType": "AdminDemoState",
    "classification": "INTERNAL",
    "endpoint": "Explicit commands or server audit hook; no whole-state replacement/reset API",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "AdminDemoState"
  },
  {
    "id": "OP-admin-demo-state-addDemoRole",
    "name": "addDemoRole",
    "file": "src/admin-demo-state.ts",
    "span": "src/admin-demo-state.ts:599-625",
    "calls": [
      "normalizedRoleLabel",
      "assertUniqueRoleLabel",
      "new Date(now).toISOString",
      "state.roles.reduce",
      "/^custom-(\\d+)$/.exec",
      "Math.max",
      "Number",
      "input.description?.trim",
      "sanitizePages"
    ],
    "sql": [],
    "body": "export function addDemoRole(\n  state: AdminDemoState,\n  input: { label: string; description?: string; pageAccess?: readonly AdminPageKey[] },\n  now: Date | string = new Date(),\n): AdminDemoState {\n  const label = normalizedRoleLabel(input.label);\n  assertUniqueRoleLabel(state, label);\n  const timestamp = new Date(now).toISOString();\n  const nextNumber = state.roles.reduce((max, role) => {\n    const match = /^custom-(\\d+)$/.exec(role.id);\n    return match ? Math.max(max, Number(match[1])) : max;\n  }, 0) + 1;\n  const role: DemoRole = {\n    id: `custom-${nextNumber}`,\n    label,\n    description: input.description?.trim() ?? \"\",\n    isBuiltIn: false,\n    status: \"active\",\n    createdAt: timestamp,\n    updatedAt: timestamp,\n  };\n  return {\n    ...state,\n    roles: [...state.roles, role],\n    rolePageAccess: { ...state.rolePageAccess, [role.id]: sanitizePages(input.pageAccess ?? []) },\n  };\n}",
    "parameters": [
      {
        "name": "state",
        "type": "AdminDemoState",
        "optional": false
      },
      {
        "name": "input",
        "type": "{ label: string; description?: string; pageAccess?: readonly AdminPageKey[] }",
        "optional": false
      },
      {
        "name": "now",
        "type": "Date | string",
        "optional": true,
        "default": "new Date()"
      }
    ],
    "returnType": "AdminDemoState",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/addDemoRole",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "AdminDemoState"
  },
  {
    "id": "OP-admin-demo-state-updateDemoRole",
    "name": "updateDemoRole",
    "file": "src/admin-demo-state.ts",
    "span": "src/admin-demo-state.ts:627-646",
    "calls": [
      "state.roles.find",
      "normalizedRoleLabel",
      "assertUniqueRoleLabel",
      "state.roles.map",
      "updates.description.trim",
      "new Date(now).toISOString"
    ],
    "sql": [],
    "body": "export function updateDemoRole(\n  state: AdminDemoState,\n  roleId: string,\n  updates: { label?: string; description?: string },\n  now: Date | string = new Date(),\n): AdminDemoState {\n  const current = state.roles.find((role) => role.id === roleId);\n  if (!current) throw new Error(\"Role not found.\");\n  const label = updates.label === undefined ? current.label : normalizedRoleLabel(updates.label);\n  assertUniqueRoleLabel(state, label, roleId);\n  return {\n    ...state,\n    roles: state.roles.map((role) => role.id === roleId ? {\n      ...role,\n      label,\n      description: updates.description === undefined ? role.description : updates.description.trim(),\n      updatedAt: new Date(now).toISOString(),\n    } : role),\n  };\n}",
    "parameters": [
      {
        "name": "state",
        "type": "AdminDemoState",
        "optional": false
      },
      {
        "name": "roleId",
        "type": "string",
        "optional": false
      },
      {
        "name": "updates",
        "type": "{ label?: string; description?: string }",
        "optional": false
      },
      {
        "name": "now",
        "type": "Date | string",
        "optional": true,
        "default": "new Date()"
      }
    ],
    "returnType": "AdminDemoState",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/updateDemoRole",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "AdminDemoState"
  },
  {
    "id": "OP-admin-demo-state-archiveDemoRole",
    "name": "archiveDemoRole",
    "file": "src/admin-demo-state.ts",
    "span": "src/admin-demo-state.ts:648-656",
    "calls": [
      "state.roles.some",
      "new Date(now).toISOString",
      "state.roles.map"
    ],
    "sql": [],
    "body": "export function archiveDemoRole(state: AdminDemoState, roleId: string, now: Date | string = new Date()): AdminDemoState {\n  if (roleId === OWNER_ROLE_ID) throw new Error(\"Owner/Admin cannot be archived.\");\n  if (!state.roles.some((role) => role.id === roleId)) throw new Error(\"Role not found.\");\n  const timestamp = new Date(now).toISOString();\n  return {\n    ...state,\n    roles: state.roles.map((role) => role.id === roleId ? { ...role, status: \"archived\", archivedAt: timestamp, updatedAt: timestamp } : role),\n  };\n}",
    "parameters": [
      {
        "name": "state",
        "type": "AdminDemoState",
        "optional": false
      },
      {
        "name": "roleId",
        "type": "string",
        "optional": false
      },
      {
        "name": "now",
        "type": "Date | string",
        "optional": true,
        "default": "new Date()"
      }
    ],
    "returnType": "AdminDemoState",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/archiveDemoRole",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "AdminDemoState"
  },
  {
    "id": "OP-admin-demo-state-updateRolePageAccess",
    "name": "updateRolePageAccess",
    "file": "src/admin-demo-state.ts",
    "span": "src/admin-demo-state.ts:667-671",
    "calls": [
      "state.roles.some",
      "protectOwnerAccess",
      "sanitizePages"
    ],
    "sql": [],
    "body": "export function updateRolePageAccess(state: AdminDemoState, roleId: string, pages: readonly AdminPageKey[]): AdminDemoState {\n  if (!state.roles.some((role) => role.id === roleId)) throw new Error(\"Role not found.\");\n  const nextPages = roleId === OWNER_ROLE_ID ? protectOwnerAccess(pages) : sanitizePages(pages);\n  return { ...state, rolePageAccess: { ...state.rolePageAccess, [roleId]: nextPages } };\n}",
    "parameters": [
      {
        "name": "state",
        "type": "AdminDemoState",
        "optional": false
      },
      {
        "name": "roleId",
        "type": "string",
        "optional": false
      },
      {
        "name": "pages",
        "type": "readonly AdminPageKey[]",
        "optional": false
      }
    ],
    "returnType": "AdminDemoState",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/updateRolePageAccess",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "AdminDemoState"
  },
  {
    "id": "OP-admin-demo-state-resolvePermittedPages",
    "name": "resolvePermittedPages",
    "file": "src/admin-demo-state.ts",
    "span": "src/admin-demo-state.ts:673-678",
    "calls": [
      "state.roles.find",
      "sanitizePages",
      "protectOwnerAccess"
    ],
    "sql": [],
    "body": "export function resolvePermittedPages(state: AdminDemoState, roleId: string): AdminPageKey[] {\n  const role = state.roles.find((candidate) => candidate.id === roleId);\n  if (!role || role.status === \"archived\") return [];\n  const pages = sanitizePages(state.rolePageAccess[roleId] ?? []);\n  return roleId === OWNER_ROLE_ID ? protectOwnerAccess(pages) : pages;\n}",
    "parameters": [
      {
        "name": "state",
        "type": "AdminDemoState",
        "optional": false
      },
      {
        "name": "roleId",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "AdminPageKey[]",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "AdminPageKey[]"
  },
  {
    "id": "OP-admin-demo-state-updateBusinessSettings",
    "name": "updateBusinessSettings",
    "file": "src/admin-demo-state.ts",
    "span": "src/admin-demo-state.ts:680-682",
    "calls": [
      "normalizeBusinessSettings",
      "mergeSettings"
    ],
    "sql": [],
    "body": "export function updateBusinessSettings(state: AdminDemoState, updates: DeepPartial<WorkshopBusinessSettings>): AdminDemoState {\n  return { ...state, businessSettings: normalizeBusinessSettings(mergeSettings(updates, state.businessSettings)) };\n}",
    "parameters": [
      {
        "name": "state",
        "type": "AdminDemoState",
        "optional": false
      },
      {
        "name": "updates",
        "type": "DeepPartial<WorkshopBusinessSettings>",
        "optional": false
      }
    ],
    "returnType": "AdminDemoState",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/updateBusinessSettings",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "AdminDemoState"
  },
  {
    "id": "OP-admin-demo-state-updateAppTheme",
    "name": "updateAppTheme",
    "file": "src/admin-demo-state.ts",
    "span": "src/admin-demo-state.ts:684-686",
    "calls": [
      "normalizeAppTheme"
    ],
    "sql": [],
    "body": "export function updateAppTheme(state: AdminDemoState, appTheme: Partial<AppTheme>): AdminDemoState {\n  return { ...state, appTheme: normalizeAppTheme(appTheme) };\n}",
    "parameters": [
      {
        "name": "state",
        "type": "AdminDemoState",
        "optional": false
      },
      {
        "name": "appTheme",
        "type": "Partial<AppTheme>",
        "optional": false
      }
    ],
    "returnType": "AdminDemoState",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/updateAppTheme",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "AdminDemoState"
  },
  {
    "id": "OP-admin-demo-state-normalizeBusinessSettings",
    "name": "normalizeBusinessSettings",
    "file": "src/admin-demo-state.ts",
    "span": "src/admin-demo-state.ts:688-740",
    "calls": [
      "value.trim",
      "trim",
      "settings.branch.workingDays.map",
      "trim(settings.billing.gstin).toUpperCase",
      "trim(settings.billing.bankIfsc).toUpperCase",
      "settings.billing.paymentModes.map"
    ],
    "sql": [],
    "body": "export function normalizeBusinessSettings(settings: WorkshopBusinessSettings): WorkshopBusinessSettings {\n  const trim = (value: string) => value.trim();\n  return {\n    profile: {\n      businessName: trim(settings.profile.businessName),\n      legalName: trim(settings.profile.legalName),\n      phone: trim(settings.profile.phone),\n      email: trim(settings.profile.email),\n      address: trim(settings.profile.address),\n      footer: trim(settings.profile.footer ?? \"\"),\n      timezone: trim(settings.profile.timezone),\n      currency: trim(settings.profile.currency),\n    },\n    branch: { ...settings.branch, name: trim(settings.branch.name), openingTime: trim(settings.branch.openingTime), closingTime: trim(settings.branch.closingTime), workingDays: settings.branch.workingDays.map(trim) },\n    jobs: { ...settings.jobs, jobNumberPrefix: trim(settings.jobs.jobNumberPrefix) },\n    pricing: { ...settings.pricing },\n    billing: {\n      ...settings.billing,\n      gstin: trim(settings.billing.gstin).toUpperCase(),\n      bankAccountHolder: trim(settings.billing.bankAccountHolder),\n      bankName: trim(settings.billing.bankName),\n      bankAccountNumber: trim(settings.billing.bankAccountNumber),\n      bankIfsc: trim(settings.billing.bankIfsc).toUpperCase(),\n      bankBranch: trim(settings.billing.bankBranch),\n      upiId: trim(settings.billing.upiId),\n      invoicePrefix: trim(settings.billing.invoicePrefix),\n      receiptPrefix: trim(settings.billing.receiptPrefix),\n      gatePassPrefix: trim(settings.billing.gatePassPrefix),\n      paymentModes: settings.billing.paymentModes.map(trim),\n    },\n    inventory: { ...settings.inventory, defaultUnit: trim(settings.inventory.defaultUnit) },\n    notifications: {\n      ...settings.notifications,\n      customerChannels: [...settings.notifications.customerChannels],\n      documentHeader: trim(settings.notifications.documentHeader),\n      estimateTemplate: trim(settings.notifications.estimateTemplate),\n      invoiceTemplate: trim(settings.notifications.invoiceTemplate),\n      jobCardCreatedWhatsAppTemplate: trim(\n        settings.notifications.jobCardCreatedWhatsAppTemplate,\n      ),\n      jobCardCreatedEmailTemplate: trim(\n        settings.notifications.jobCardCreatedEmailTemplate,\n      ),\n      jobCardClosedWhatsAppTemplate: trim(\n        settings.notifications.jobCardClosedWhatsAppTemplate,\n      ),\n      jobCardClosedEmailTemplate: trim(\n        settings.notifications.jobCardClosedEmailTemplate,\n      ),\n    },\n    logRetention: { ...settings.logRetention },\n  };\n}",
    "parameters": [
      {
        "name": "settings",
        "type": "WorkshopBusinessSettings",
        "optional": false
      }
    ],
    "returnType": "WorkshopBusinessSettings",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "WorkshopBusinessSettings"
  },
  {
    "id": "OP-admin-demo-state-validateBusinessSettings",
    "name": "validateBusinessSettings",
    "file": "src/admin-demo-state.ts",
    "span": "src/admin-demo-state.ts:742-763",
    "calls": [
      "settings.profile.businessName.trim",
      "errors.push",
      "/^\\S+@\\S+\\.\\S+$/.test",
      "settings.profile.email.trim",
      "settings.branch.name.trim",
      "/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test",
      "/^[A-Z]{4}0[A-Z0-9]{6}$/.test",
      "/^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+$/.test"
    ],
    "sql": [],
    "body": "export function validateBusinessSettings(settings: WorkshopBusinessSettings): string[] {\n  const errors: string[] = [];\n  if (!settings.profile.businessName.trim()) errors.push(\"Business name is required.\");\n  if (!/^\\S+@\\S+\\.\\S+$/.test(settings.profile.email.trim())) errors.push(\"Enter a valid business email.\");\n  if (!settings.branch.name.trim()) errors.push(\"Branch name is required.\");\n  if (settings.jobs.defaultPromisedHours <= 0) errors.push(\"Default promised hours must be greater than zero.\");\n  if (settings.pricing.estimateValidityDays <= 0) errors.push(\"Estimate validity must be at least 1 day.\");\n  if (settings.pricing.defaultLabourRate < 0) errors.push(\"Default labour rate cannot be negative.\");\n  if (settings.billing.defaultGstPercent < 0 || settings.billing.defaultGstPercent > 100) errors.push(\"GST percent must be between 0 and 100.\");\n  if (settings.billing.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(settings.billing.gstin)) errors.push(\"GSTIN must be a valid 15-character Indian GSTIN.\");\n  if (settings.billing.bankIfsc && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(settings.billing.bankIfsc)) errors.push(\"IFSC must contain four letters, 0, then six letters or digits.\");\n  if (settings.billing.upiId && !/^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+$/.test(settings.billing.upiId)) errors.push(\"UPI ID must use a valid handle@provider format.\");\n  if (!settings.notifications.jobCardCreatedWhatsAppTemplate)\n    errors.push(\"Job-card creation WhatsApp template is required.\");\n  if (!settings.notifications.jobCardCreatedEmailTemplate)\n    errors.push(\"Job-card creation email template is required.\");\n  if (!settings.notifications.jobCardClosedWhatsAppTemplate)\n    errors.push(\"Job-card closure WhatsApp template is required.\");\n  if (!settings.notifications.jobCardClosedEmailTemplate)\n    errors.push(\"Job-card closure email template is required.\");\n  return errors;\n}",
    "parameters": [
      {
        "name": "settings",
        "type": "WorkshopBusinessSettings",
        "optional": false
      }
    ],
    "returnType": "string[]",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "string[]"
  },
  {
    "id": "OP-admin-demo-state-createReportTemplate",
    "name": "createReportTemplate",
    "file": "src/admin-demo-state.ts",
    "span": "src/admin-demo-state.ts:786-796",
    "calls": [
      "assertTemplateInput",
      "new Date(now).toISOString",
      "nextTemplateId",
      "input.name.trim",
      "input.html.trim",
      "Boolean",
      "state.reportTemplates.map"
    ],
    "sql": [],
    "body": "export function createReportTemplate(\n  state: AdminDemoState,\n  input: { category: ReportCategory; name: string; html: string; active?: boolean },\n  now: Date | string = new Date(),\n): AdminDemoState {\n  assertTemplateInput(state, input.category, input.name, input.html);\n  const timestamp = new Date(now).toISOString();\n  const template: ReportTemplate = { id: nextTemplateId(state, input.category), category: input.category, name: input.name.trim(), html: input.html.trim(), active: Boolean(input.active), createdAt: timestamp, updatedAt: timestamp };\n  const existing = input.active ? state.reportTemplates.map((item) => item.category === input.category ? { ...item, active: false, updatedAt: timestamp } : item) : state.reportTemplates;\n  return { ...state, reportTemplates: [...existing, template] };\n}",
    "parameters": [
      {
        "name": "state",
        "type": "AdminDemoState",
        "optional": false
      },
      {
        "name": "input",
        "type": "{ category: ReportCategory; name: string; html: string; active?: boolean }",
        "optional": false
      },
      {
        "name": "now",
        "type": "Date | string",
        "optional": true,
        "default": "new Date()"
      }
    ],
    "returnType": "AdminDemoState",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/createReportTemplate",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "AdminDemoState"
  },
  {
    "id": "OP-admin-demo-state-updateReportTemplate",
    "name": "updateReportTemplate",
    "file": "src/admin-demo-state.ts",
    "span": "src/admin-demo-state.ts:798-818",
    "calls": [
      "state.reportTemplates.find",
      "assertTemplateInput",
      "new Date(now).toISOString",
      "state.reportTemplates.map",
      "name.trim",
      "html.trim"
    ],
    "sql": [],
    "body": "export function updateReportTemplate(\n  state: AdminDemoState,\n  templateId: string,\n  updates: { name?: string; html?: string; active?: boolean },\n  now: Date | string = new Date(),\n): AdminDemoState {\n  const current = state.reportTemplates.find((template) => template.id === templateId);\n  if (!current) throw new Error(\"Template not found.\");\n  const name = updates.name ?? current.name;\n  const html = updates.html ?? current.html;\n  assertTemplateInput(state, current.category, name, html, templateId);\n  if (current.active && updates.active === false) throw new Error(\"Activate another template before deactivating the current template.\");\n  const timestamp = new Date(now).toISOString();\n  return {\n    ...state,\n    reportTemplates: state.reportTemplates.map((template) => {\n      if (updates.active && template.category === current.category && template.id !== templateId) return { ...template, active: false, updatedAt: timestamp };\n      return template.id === templateId ? { ...template, name: name.trim(), html: html.trim(), active: updates.active ?? template.active, updatedAt: timestamp } : template;\n    }),\n  };\n}",
    "parameters": [
      {
        "name": "state",
        "type": "AdminDemoState",
        "optional": false
      },
      {
        "name": "templateId",
        "type": "string",
        "optional": false
      },
      {
        "name": "updates",
        "type": "{ name?: string; html?: string; active?: boolean }",
        "optional": false
      },
      {
        "name": "now",
        "type": "Date | string",
        "optional": true,
        "default": "new Date()"
      }
    ],
    "returnType": "AdminDemoState",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/updateReportTemplate",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "AdminDemoState"
  },
  {
    "id": "OP-admin-demo-state-activateReportTemplate",
    "name": "activateReportTemplate",
    "file": "src/admin-demo-state.ts",
    "span": "src/admin-demo-state.ts:820-822",
    "calls": [
      "updateReportTemplate"
    ],
    "sql": [],
    "body": "export function activateReportTemplate(state: AdminDemoState, templateId: string, now: Date | string = new Date()): AdminDemoState {\n  return updateReportTemplate(state, templateId, { active: true }, now);\n}",
    "parameters": [
      {
        "name": "state",
        "type": "AdminDemoState",
        "optional": false
      },
      {
        "name": "templateId",
        "type": "string",
        "optional": false
      },
      {
        "name": "now",
        "type": "Date | string",
        "optional": true,
        "default": "new Date()"
      }
    ],
    "returnType": "AdminDemoState",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/activateReportTemplate",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "AdminDemoState"
  },
  {
    "id": "OP-admin-demo-state-deleteReportTemplate",
    "name": "deleteReportTemplate",
    "file": "src/admin-demo-state.ts",
    "span": "src/admin-demo-state.ts:824-829",
    "calls": [
      "state.reportTemplates.find",
      "state.reportTemplates.filter"
    ],
    "sql": [],
    "body": "export function deleteReportTemplate(state: AdminDemoState, templateId: string): AdminDemoState {\n  const current = state.reportTemplates.find((template) => template.id === templateId);\n  if (!current) throw new Error(\"Template not found.\");\n  if (current.active) throw new Error(\"Activate another template before deleting the active template.\");\n  return { ...state, reportTemplates: state.reportTemplates.filter((template) => template.id !== templateId) };\n}",
    "parameters": [
      {
        "name": "state",
        "type": "AdminDemoState",
        "optional": false
      },
      {
        "name": "templateId",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "AdminDemoState",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/deleteReportTemplate",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "AdminDemoState"
  },
  {
    "id": "OP-admin-demo-state-saveCompanyIdentity",
    "name": "saveCompanyIdentity",
    "file": "src/admin-demo-state.ts",
    "span": "src/admin-demo-state.ts:834-843",
    "calls": [
      "companyName.trim",
      "normalizeBusinessSettings",
      "mergeSettings"
    ],
    "sql": [],
    "body": "export function saveCompanyIdentity(state: AdminDemoState, companyName: string, assets: CompanyAssets, details?: CompanyDetails): AdminDemoState {\n  if (!companyName.trim()) throw new Error(\"Company name is required.\");\n  return {\n    ...state,\n    businessSettings: normalizeBusinessSettings(mergeSettings(details\n      ? { profile: { businessName: companyName.trim(), address: details.address, phone: details.phone, email: details.email, footer: details.footer }, billing: { gstin: details.gstin } }\n      : { profile: { businessName: companyName.trim() } }, state.businessSettings)),\n    companyAssets: { ...assets },\n  };\n}",
    "parameters": [
      {
        "name": "state",
        "type": "AdminDemoState",
        "optional": false
      },
      {
        "name": "companyName",
        "type": "string",
        "optional": false
      },
      {
        "name": "assets",
        "type": "CompanyAssets",
        "optional": false
      },
      {
        "name": "details",
        "type": "CompanyDetails",
        "optional": true
      }
    ],
    "returnType": "AdminDemoState",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/saveCompanyIdentity",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "AdminDemoState"
  },
  {
    "id": "OP-admin-demo-state-appendDemoLog",
    "name": "appendDemoLog",
    "file": "src/admin-demo-state.ts",
    "span": "src/admin-demo-state.ts:853-864",
    "calls": [
      "nextLogId",
      "new Date(entry.timestamp ?? now).toISOString",
      "enforceLogRetention"
    ],
    "sql": [],
    "body": "export function appendDemoLog(\n  state: AdminDemoState,\n  entry: Omit<DemoLogEntry, \"id\" | \"timestamp\"> & Partial<Pick<DemoLogEntry, \"id\" | \"timestamp\">>,\n  now: Date | string = new Date(),\n): AdminDemoState {\n  const log: DemoLogEntry = {\n    ...entry,\n    id: entry.id ?? nextLogId(state.logs),\n    timestamp: new Date(entry.timestamp ?? now).toISOString(),\n  };\n  return enforceLogRetention({ ...state, logs: [log, ...state.logs] }, now);\n}",
    "parameters": [
      {
        "name": "state",
        "type": "AdminDemoState",
        "optional": false
      },
      {
        "name": "entry",
        "type": "Omit<DemoLogEntry, \"id\" | \"timestamp\"> & Partial<Pick<DemoLogEntry, \"id\" | \"timestamp\">>",
        "optional": false
      },
      {
        "name": "now",
        "type": "Date | string",
        "optional": true,
        "default": "new Date()"
      }
    ],
    "returnType": "AdminDemoState",
    "classification": "INTERNAL",
    "endpoint": "Explicit commands or server audit hook; no whole-state replacement/reset API",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "AdminDemoState"
  },
  {
    "id": "OP-admin-demo-state-filterDemoLogs",
    "name": "filterDemoLogs",
    "file": "src/admin-demo-state.ts",
    "span": "src/admin-demo-state.ts:866-885",
    "calls": [
      "filter.search?.trim().toLowerCase",
      "filter.search?.trim",
      "new Date(`${filter.dateFrom}T00:00:00.000`).getTime",
      "new Date(`${filter.dateTo}T23:59:59.999`).getTime",
      "logs.filter((log) => {\n    const timestamp = new Date(log.timestamp).getTime();\n    if (filter.stream && filter.stream !== \"all\" && log.stream !== filter.stream) return false;\n    if (from !== undefined && timestamp < from) return false;\n    if (to !== undefined && timestamp > to) return false;\n    if (filter.levels?.length && !filter.levels.includes(log.level)) return false;\n    if (filter.area && log.area !== filter.area) return false;\n    if (filter.feature && log.feature !== filter.feature) return false;\n    if (filter.userId && log.userId !== filter.userId) return false;\n    if (search) {\n      const haystack = [log.message, log.area, log.feature, log.userName, log.referenceId].filter(Boolean).join(\" \").toLowerCase();\n      if (!haystack.includes(search)) return false;\n    }\n    return true;\n  }).sort",
      "logs.filter",
      "new Date(log.timestamp).getTime",
      "filter.levels.includes",
      "[log.message, log.area, log.feature, log.userName, log.referenceId].filter(Boolean).join(\" \").toLowerCase",
      "[log.message, log.area, log.feature, log.userName, log.referenceId].filter(Boolean).join",
      "[log.message, log.area, log.feature, log.userName, log.referenceId].filter",
      "haystack.includes",
      "new Date(right.timestamp).getTime",
      "new Date(left.timestamp).getTime"
    ],
    "sql": [],
    "body": "export function filterDemoLogs(logs: readonly DemoLogEntry[], filter: DemoLogFilter = {}): DemoLogEntry[] {\n  const search = filter.search?.trim().toLowerCase();\n  const from = filter.dateFrom ? new Date(`${filter.dateFrom}T00:00:00.000`).getTime() : undefined;\n  const to = filter.dateTo ? new Date(`${filter.dateTo}T23:59:59.999`).getTime() : undefined;\n  return logs.filter((log) => {\n    const timestamp = new Date(log.timestamp).getTime();\n    if (filter.stream && filter.stream !== \"all\" && log.stream !== filter.stream) return false;\n    if (from !== undefined && timestamp < from) return false;\n    if (to !== undefined && timestamp > to) return false;\n    if (filter.levels?.length && !filter.levels.includes(log.level)) return false;\n    if (filter.area && log.area !== filter.area) return false;\n    if (filter.feature && log.feature !== filter.feature) return false;\n    if (filter.userId && log.userId !== filter.userId) return false;\n    if (search) {\n      const haystack = [log.message, log.area, log.feature, log.userName, log.referenceId].filter(Boolean).join(\" \").toLowerCase();\n      if (!haystack.includes(search)) return false;\n    }\n    return true;\n  }).sort((left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime());\n}",
    "parameters": [
      {
        "name": "logs",
        "type": "readonly DemoLogEntry[]",
        "optional": false
      },
      {
        "name": "filter",
        "type": "DemoLogFilter",
        "optional": true,
        "default": "{}"
      }
    ],
    "returnType": "DemoLogEntry[]",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "DemoLogEntry[]"
  },
  {
    "id": "OP-admin-demo-state-clearDemoLogs",
    "name": "clearDemoLogs",
    "file": "src/admin-demo-state.ts",
    "span": "src/admin-demo-state.ts:887-889",
    "calls": [
      "state.logs.filter"
    ],
    "sql": [],
    "body": "export function clearDemoLogs(state: AdminDemoState, stream: DemoLogStream | \"all\" = \"all\"): AdminDemoState {\n  return { ...state, logs: stream === \"all\" ? [] : state.logs.filter((log) => log.stream !== stream) };\n}",
    "parameters": [
      {
        "name": "state",
        "type": "AdminDemoState",
        "optional": false
      },
      {
        "name": "stream",
        "type": "DemoLogStream | \"all\"",
        "optional": true,
        "default": "\"all\""
      }
    ],
    "returnType": "AdminDemoState",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/clearDemoLogs",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "AdminDemoState"
  },
  {
    "id": "OP-admin-demo-state-confirmInventoryImport",
    "name": "confirmInventoryImport",
    "file": "src/admin-demo-state.ts",
    "span": "src/admin-demo-state.ts:921-967",
    "calls": [
      "new Date(now).toISOString",
      "nextImportBatchId",
      "nextSessionInventoryId",
      "created.push"
    ],
    "sql": [],
    "body": "export function confirmInventoryImport(\n  state: AdminDemoState,\n  input: {\n    fileName: string;\n    columnMapping: Record<string, string>;\n    totalRows: number;\n    validRows: readonly InventoryImportRowInput[];\n    rejectedRows: number;\n  },\n  now: Date | string = new Date(),\n): AdminDemoState {\n  const timestamp = new Date(now).toISOString();\n  const batchId = nextImportBatchId(state.importBatches);\n  const created: SessionInventoryItem[] = [];\n  for (const row of input.validRows) {\n    const id = nextSessionInventoryId([...state.sessionInventory, ...created]);\n    created.push({\n      id,\n      importBatchId: batchId,\n      sku: row.sku,\n      name: row.name,\n      category: row.category,\n      unit: row.unit,\n      stockQty: row.stockQty,\n      lowStockQty: row.lowStockQty,\n      sellingPrice: row.sellingPrice ?? 0,\n      importedAt: timestamp,\n    });\n  }\n  const batch: DemoImportBatch = {\n    id: batchId,\n    fileName: input.fileName,\n    status: \"imported\",\n    createdAt: timestamp,\n    importedAt: timestamp,\n    totalRows: input.totalRows,\n    acceptedRows: created.length,\n    rejectedRows: input.rejectedRows,\n    columnMapping: input.columnMapping,\n    errors: [],\n  };\n  return {\n    ...state,\n    importBatches: [...state.importBatches, batch],\n    sessionInventory: [...state.sessionInventory, ...created],\n  };\n}",
    "parameters": [
      {
        "name": "state",
        "type": "AdminDemoState",
        "optional": false
      },
      {
        "name": "input",
        "type": "{\n    fileName: string;\n    columnMapping: Record<string, string>;\n    totalRows: number;\n    validRows: readonly InventoryImportRowInput[];\n    rejectedRows: number;\n  }",
        "optional": false
      },
      {
        "name": "now",
        "type": "Date | string",
        "optional": true,
        "default": "new Date()"
      }
    ],
    "returnType": "AdminDemoState",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/confirmInventoryImport",
    "service": "materials/inventory; TX-06/07/10",
    "resolvedReturnType": "AdminDemoState"
  },
  {
    "id": "OP-admin-demo-state-enforceLogRetention",
    "name": "enforceLogRetention",
    "file": "src/admin-demo-state.ts",
    "span": "src/admin-demo-state.ts:969-980",
    "calls": [
      "new Date(now).getTime",
      "Math.max",
      "state.logs.filter",
      "new Date(log.timestamp).getTime",
      "Number.isFinite",
      "retentionMs"
    ],
    "sql": [],
    "body": "export function enforceLogRetention(state: AdminDemoState, now: Date | string = new Date()): AdminDemoState {\n  const nowMs = new Date(now).getTime();\n  const { operationalDays, featureDays } = state.businessSettings.logRetention;\n  const retentionMs = (stream: DemoLogStream) => Math.max(0, stream === \"operational\" ? operationalDays : featureDays) * 86_400_000;\n  return {\n    ...state,\n    logs: state.logs.filter((log) => {\n      const timestamp = new Date(log.timestamp).getTime();\n      return Number.isFinite(timestamp) && timestamp >= nowMs - retentionMs(log.stream) && timestamp <= nowMs;\n    }),\n  };\n}",
    "parameters": [
      {
        "name": "state",
        "type": "AdminDemoState",
        "optional": false
      },
      {
        "name": "now",
        "type": "Date | string",
        "optional": true,
        "default": "new Date()"
      }
    ],
    "returnType": "AdminDemoState",
    "classification": "INTERNAL",
    "endpoint": "Explicit commands or server audit hook; no whole-state replacement/reset API",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "AdminDemoState"
  },
  {
    "id": "OP-advance-booking-range-shiftCalendarMonth",
    "name": "shiftCalendarMonth",
    "file": "src/advance-booking-range.ts",
    "span": "src/advance-booking-range.ts:11-15",
    "calls": [
      "parseMonth",
      "Math.floor",
      "pad"
    ],
    "sql": [],
    "body": "export function shiftCalendarMonth(month: string, amount: number) {\n  const parsed = parseMonth(month);\n  const absoluteMonth = parsed.year * 12 + parsed.month - 1 + amount;\n  return `${Math.floor(absoluteMonth / 12)}-${pad((absoluteMonth % 12) + 1)}`;\n}",
    "parameters": [
      {
        "name": "month",
        "type": "string",
        "optional": false
      },
      {
        "name": "amount",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "string"
  },
  {
    "id": "OP-advance-booking-range-localDateOnly",
    "name": "localDateOnly",
    "file": "src/advance-booking-range.ts",
    "span": "src/advance-booking-range.ts:23-25",
    "calls": [
      "now.getFullYear",
      "pad",
      "now.getMonth",
      "now.getDate"
    ],
    "sql": [],
    "body": "export function localDateOnly(now = new Date()) {\n  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;\n}",
    "parameters": [
      {
        "name": "now",
        "type": "INFERRED",
        "optional": true,
        "default": "new Date()"
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "string"
  },
  {
    "id": "OP-advance-booking-range-advanceBookingRange",
    "name": "advanceBookingRange",
    "file": "src/advance-booking-range.ts",
    "span": "src/advance-booking-range.ts:31-38",
    "calls": [
      "localDateOnly",
      "today.slice",
      "shiftCalendarMonth",
      "now.getFullYear",
      "now.getMonth",
      "now.getDate",
      "daysInMonth"
    ],
    "sql": [],
    "body": "export function advanceBookingRange(now = new Date()): AdvanceBookingRange {\n  const today = localDateOnly(now);\n  const currentMonth = today.slice(0, 7);\n  const firstMonth = currentMonth;\n  const lastMonth = shiftCalendarMonth(currentMonth, 3);\n  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);\n  return { min: localDateOnly(tomorrow), max: `${lastMonth}-${daysInMonth(lastMonth)}`, firstMonth, lastMonth };\n}",
    "parameters": [
      {
        "name": "now",
        "type": "INFERRED",
        "optional": true,
        "default": "new Date()"
      }
    ],
    "returnType": "AdvanceBookingRange",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "intake/bookings; TX-01/02",
    "resolvedReturnType": "AdvanceBookingRange"
  },
  {
    "id": "OP-advance-booking-range-isAdvanceBookingDate",
    "name": "isAdvanceBookingDate",
    "file": "src/advance-booking-range.ts",
    "span": "src/advance-booking-range.ts:40-42",
    "calls": [],
    "sql": [],
    "body": "export function isAdvanceBookingDate(date: string, range: AdvanceBookingRange) {\n  return date >= range.min && date <= range.max;\n}",
    "parameters": [
      {
        "name": "date",
        "type": "string",
        "optional": false
      },
      {
        "name": "range",
        "type": "AdvanceBookingRange",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "intake/bookings; TX-01/02",
    "resolvedReturnType": "boolean"
  },
  {
    "id": "OP-advance-booking-range-clampAdvanceBookingDate",
    "name": "clampAdvanceBookingDate",
    "file": "src/advance-booking-range.ts",
    "span": "src/advance-booking-range.ts:44-48",
    "calls": [],
    "sql": [],
    "body": "export function clampAdvanceBookingDate(date: string, range: AdvanceBookingRange) {\n  if (date < range.min) return range.min;\n  if (date > range.max) return range.max;\n  return date;\n}",
    "parameters": [
      {
        "name": "date",
        "type": "string",
        "optional": false
      },
      {
        "name": "range",
        "type": "AdvanceBookingRange",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "intake/bookings; TX-01/02",
    "resolvedReturnType": "string"
  },
  {
    "id": "OP-advance-booking-range-datesForCalendarMonth",
    "name": "datesForCalendarMonth",
    "file": "src/advance-booking-range.ts",
    "span": "src/advance-booking-range.ts:50-59",
    "calls": [
      "parseMonth",
      "new Date(Date.UTC(year, monthNumber - 1, 1)).getUTCDay",
      "Date.UTC",
      "Array.from",
      "date.setUTCDate",
      "firstDate.getUTCDate",
      "date.getUTCFullYear",
      "pad",
      "date.getUTCMonth",
      "date.getUTCDate"
    ],
    "sql": [],
    "body": "export function datesForCalendarMonth(month: string) {\n  const { year, month: monthNumber } = parseMonth(month);\n  const firstWeekday = new Date(Date.UTC(year, monthNumber - 1, 1)).getUTCDay();\n  const firstDate = new Date(Date.UTC(year, monthNumber - 1, 1 - firstWeekday));\n  return Array.from({ length: 42 }, (_, index) => {\n    const date = new Date(firstDate);\n    date.setUTCDate(firstDate.getUTCDate() + index);\n    return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;\n  });\n}",
    "parameters": [
      {
        "name": "month",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "string[]"
  },
  {
    "id": "OP-auth-loadAuthConfig",
    "name": "loadAuthConfig",
    "file": "src/auth.ts",
    "span": "src/auth.ts:46-55",
    "calls": [
      "fetch",
      "response.headers.get(\"content-type\")?.includes",
      "response.headers.get",
      "response.json"
    ],
    "sql": [],
    "body": "export async function loadAuthConfig(): Promise<AuthConfig> {\n  const localDemo = import.meta.env.DEV || location.hostname === \"localhost\" || location.hostname === \"127.0.0.1\";\n  try {\n    const response = await fetch(\"/api/v1/auth/config\", { headers: { accept: \"application/json\" } });\n    if (!response.ok || !response.headers.get(\"content-type\")?.includes(\"application/json\")) return { mode: \"local\", allowDemo: localDemo };\n    return await response.json() as AuthConfig;\n  } catch {\n    return { mode: \"local\", allowDemo: localDemo };\n  }\n}",
    "parameters": [],
    "returnType": "Promise<AuthConfig>",
    "classification": "AUTH",
    "endpoint": "GET /api/v1/auth/config",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "Promise<AuthConfig>"
  },
  {
    "id": "OP-auth-beginCognitoLogin",
    "name": "beginCognitoLogin",
    "file": "src/auth.ts",
    "span": "src/auth.ts:57-72",
    "calls": [
      "randomValue",
      "sessionStorage.setItem",
      "JSON.stringify",
      "new URLSearchParams({\n    client_id: config.clientId,\n    response_type: \"code\",\n    redirect_uri: config.callbackUri,\n    scope: config.scopes.join(\" \"),\n    state,\n    code_challenge_method: \"S256\",\n    code_challenge: base64Url(await sha256(verifier)),\n  }).toString",
      "config.scopes.join",
      "base64Url",
      "sha256",
      "location.assign"
    ],
    "sql": [],
    "body": "export async function beginCognitoLogin(config: CognitoConfig) {\n  const verifier = randomValue();\n  const state = randomValue();\n  sessionStorage.setItem(OAUTH_KEY, JSON.stringify({ verifier, state }));\n  const url = new URL(config.authorizationEndpoint);\n  url.search = new URLSearchParams({\n    client_id: config.clientId,\n    response_type: \"code\",\n    redirect_uri: config.callbackUri,\n    scope: config.scopes.join(\" \"),\n    state,\n    code_challenge_method: \"S256\",\n    code_challenge: base64Url(await sha256(verifier)),\n  }).toString();\n  location.assign(url);\n}",
    "parameters": [
      {
        "name": "config",
        "type": "CognitoConfig",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "AUTH",
    "endpoint": "Provider alternative; proposed database mode uses POST /api/v1/auth/login",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "Promise<void>"
  },
  {
    "id": "OP-auth-completeCognitoCallback",
    "name": "completeCognitoCallback",
    "file": "src/auth.ts",
    "span": "src/auth.ts:99-113",
    "calls": [
      "params.get",
      "sessionStorage.getItem",
      "JSON.parse",
      "exchange",
      "sessionStorage.setItem",
      "JSON.stringify",
      "sessionStorage.removeItem",
      "history.replaceState"
    ],
    "sql": [],
    "body": "export async function completeCognitoCallback(config: CognitoConfig) {\n  const params = new URLSearchParams(location.search);\n  const code = params.get(\"code\");\n  if (!code) return;\n  const saved = sessionStorage.getItem(OAUTH_KEY);\n  const oauth = saved ? JSON.parse(saved) as { verifier: string; state: string } : undefined;\n  if (!oauth || params.get(\"state\") !== oauth.state) throw new Error(\"Cognito sign-in state was invalid.\");\n  const result = await exchange(config, new URLSearchParams({\n    grant_type: \"authorization_code\", client_id: config.clientId, code,\n    redirect_uri: config.callbackUri, code_verifier: oauth.verifier,\n  }));\n  sessionStorage.setItem(TOKEN_KEY, JSON.stringify(result));\n  sessionStorage.removeItem(OAUTH_KEY);\n  history.replaceState({}, document.title, `${location.pathname}${location.hash}`);\n}",
    "parameters": [
      {
        "name": "config",
        "type": "CognitoConfig",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "AUTH",
    "endpoint": "Provider alternative; not used by proposed database mode",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "Promise<void>"
  },
  {
    "id": "OP-auth-authenticatedFetch",
    "name": "authenticatedFetch",
    "file": "src/auth.ts",
    "span": "src/auth.ts:115-119",
    "calls": [
      "tokens",
      "fetch"
    ],
    "sql": [],
    "body": "export async function authenticatedFetch(config: CognitoConfig, path: string, init: RequestInit = {}) {\n  const current = await tokens(config);\n  if (!current) throw new Error(\"AUTHENTICATION_REQUIRED\");\n  return fetch(path, { ...init, headers: { ...init.headers, authorization: `Bearer ${current.accessToken}`, accept: \"application/json\" } });\n}",
    "parameters": [
      {
        "name": "config",
        "type": "CognitoConfig",
        "optional": false
      },
      {
        "name": "path",
        "type": "string",
        "optional": false
      },
      {
        "name": "init",
        "type": "RequestInit",
        "optional": true,
        "default": "{}"
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "AUTH",
    "endpoint": "Transport wrapper; cookie/CSRF",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "Promise<Response>"
  },
  {
    "id": "OP-auth-loadWorkshopSession",
    "name": "loadWorkshopSession",
    "file": "src/auth.ts",
    "span": "src/auth.ts:121-129",
    "calls": [
      "completeCognitoCallback",
      "tokens",
      "authenticatedFetch",
      "sessionStorage.removeItem",
      "response.json"
    ],
    "sql": [],
    "body": "export async function loadWorkshopSession(config: CognitoConfig): Promise<WorkshopSession | undefined> {\n  await completeCognitoCallback(config);\n  const current = await tokens(config);\n  if (!current) return undefined;\n  const response = await authenticatedFetch(config, \"/api/v1/session\");\n  if (response.status === 401) { sessionStorage.removeItem(TOKEN_KEY); return undefined; }\n  if (!response.ok) throw new Error((await response.json() as { code?: string }).code ?? \"SESSION_FAILED\");\n  return response.json() as Promise<WorkshopSession>;\n}",
    "parameters": [
      {
        "name": "config",
        "type": "CognitoConfig",
        "optional": false
      }
    ],
    "returnType": "Promise<WorkshopSession | undefined>",
    "classification": "AUTH",
    "endpoint": "GET /api/v1/session",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "Promise<WorkshopSession | undefined>"
  },
  {
    "id": "OP-auth-endCognitoSession",
    "name": "endCognitoSession",
    "file": "src/auth.ts",
    "span": "src/auth.ts:131-136",
    "calls": [
      "sessionStorage.removeItem",
      "new URLSearchParams({ client_id: config.clientId, logout_uri: config.logoutUri }).toString",
      "location.assign"
    ],
    "sql": [],
    "body": "export function endCognitoSession(config: CognitoConfig) {\n  sessionStorage.removeItem(TOKEN_KEY);\n  const url = new URL(config.logoutEndpoint);\n  url.search = new URLSearchParams({ client_id: config.clientId, logout_uri: config.logoutUri }).toString();\n  location.assign(url);\n}",
    "parameters": [
      {
        "name": "config",
        "type": "CognitoConfig",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "AUTH",
    "endpoint": "POST /api/v1/auth/logout",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-booking-followup-expectedBookingsForDate",
    "name": "expectedBookingsForDate",
    "file": "src/booking-followup.ts",
    "span": "src/booking-followup.ts:12-56",
    "calls": [
      "callsByBooking.get",
      "calls.push",
      "callsByBooking.set",
      "bookings\n    .filter(\n      (booking) =>\n        booking.booking_date === bookingDate &&\n        expectedStatuses.includes(booking.status),\n    )\n    .map((booking) => {\n      const calls = [...(callsByBooking.get(booking.id) ?? [])].sort((left, right) =>\n        right.called_at.localeCompare(left.called_at),\n      );\n      return { booking, calls, lastCall: calls[0] };\n    })\n    .filter((row) =>\n      filter === \"ALL\"\n        ? true\n        : filter === \"CALLED\"\n          ? row.calls.length > 0\n          : row.calls.length === 0,\n    )\n    .sort",
      "bookings\n    .filter(\n      (booking) =>\n        booking.booking_date === bookingDate &&\n        expectedStatuses.includes(booking.status),\n    )\n    .map((booking) => {\n      const calls = [...(callsByBooking.get(booking.id) ?? [])].sort((left, right) =>\n        right.called_at.localeCompare(left.called_at),\n      );\n      return { booking, calls, lastCall: calls[0] };\n    })\n    .filter",
      "bookings\n    .filter(\n      (booking) =>\n        booking.booking_date === bookingDate &&\n        expectedStatuses.includes(booking.status),\n    )\n    .map",
      "bookings\n    .filter",
      "expectedStatuses.includes",
      "[...(callsByBooking.get(booking.id) ?? [])].sort",
      "right.called_at.localeCompare",
      "windowOrder.indexOf",
      "left.booking.customer_name.localeCompare"
    ],
    "sql": [],
    "body": "export function expectedBookingsForDate(\n  bookings: readonly Booking[],\n  callLogs: readonly BookingCallLog[],\n  bookingDate: string,\n  filter: ExpectedTodayFilter = \"ALL\",\n): ExpectedBookingRow[] {\n  const callsByBooking = new Map<number, BookingCallLog[]>();\n  for (const call of callLogs) {\n    const calls = callsByBooking.get(call.booking_id) ?? [];\n    calls.push(call);\n    callsByBooking.set(call.booking_id, calls);\n  }\n\n  const expectedStatuses: BookingStatus[] = [\n    \"Booked\",\n    \"Confirmed\",\n    \"Rescheduled\",\n  ];\n  return bookings\n    .filter(\n      (booking) =>\n        booking.booking_date === bookingDate &&\n        expectedStatuses.includes(booking.status),\n    )\n    .map((booking) => {\n      const calls = [...(callsByBooking.get(booking.id) ?? [])].sort((left, right) =>\n        right.called_at.localeCompare(left.called_at),\n      );\n      return { booking, calls, lastCall: calls[0] };\n    })\n    .filter((row) =>\n      filter === \"ALL\"\n        ? true\n        : filter === \"CALLED\"\n          ? row.calls.length > 0\n          : row.calls.length === 0,\n    )\n    .sort((left, right) => {\n      const windowOrder = [\"Morning\", \"Afternoon\", \"Evening\", \"\"];\n      const windowDifference =\n        windowOrder.indexOf(left.booking.arrival_window) -\n        windowOrder.indexOf(right.booking.arrival_window);\n      return windowDifference || left.booking.customer_name.localeCompare(right.booking.customer_name);\n    });\n}",
    "parameters": [
      {
        "name": "bookings",
        "type": "readonly Booking[]",
        "optional": false
      },
      {
        "name": "callLogs",
        "type": "readonly BookingCallLog[]",
        "optional": false
      },
      {
        "name": "bookingDate",
        "type": "string",
        "optional": false
      },
      {
        "name": "filter",
        "type": "ExpectedTodayFilter",
        "optional": true,
        "default": "\"ALL\""
      }
    ],
    "returnType": "ExpectedBookingRow[]",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "intake/bookings; TX-01/02",
    "resolvedReturnType": "ExpectedBookingRow[]"
  },
  {
    "id": "OP-dashboard-metrics-cashflowFacts",
    "name": "cashflowFacts",
    "file": "src/dashboard-metrics.ts",
    "span": "src/dashboard-metrics.ts:43-73",
    "calls": [
      "today.slice",
      "month.split(\"-\").map",
      "month.split",
      "Number.isFinite",
      "new Date(year, monthNumber, 0).getDate",
      "Number",
      "Math.min",
      "Math.max",
      "inMonth",
      "clearedInvoiceById.set",
      "[...clearedInvoiceById.values()].reduce",
      "clearedInvoiceById.values",
      "new Date(`${month}-01T00:00:00`).toLocaleDateString",
      "jobs.filter"
    ],
    "sql": [],
    "body": "export function cashflowFacts(jobs: JobView[], today: string, month = today.slice(0, 7)): CashflowFacts {\n  const currentMonth = today.slice(0, 7);\n  const [year, monthNumber] = month.split(\"-\").map(Number);\n  const daysInMonth = Number.isFinite(year) && Number.isFinite(monthNumber) ? new Date(year, monthNumber, 0).getDate() : 0;\n  const parsedDay = Number(today.slice(8, 10));\n  const daysElapsed = month === currentMonth ? Math.min(Math.max(Number.isFinite(parsedDay) ? parsedDay : 0, 0), daysInMonth) : daysInMonth;\n  const clearedInvoiceById = new Map<number, NonNullable<JobView[\"invoice\"]>>();\n  let paymentsReceived = 0;\n  for (const view of jobs) {\n    const invoice = view.invoice;\n    if (!invoice || invoice.voided_at || invoice.status !== \"Cleared\") continue;\n    for (const payment of view.payments) {\n      if (!payment.voided_at && payment.invoice_id === invoice.id && inMonth(payment.created_at, month)) {\n        paymentsReceived += 1;\n        clearedInvoiceById.set(invoice.id, invoice);\n      }\n    }\n  }\n  const totalCollections = [...clearedInvoiceById.values()].reduce((total, invoice) => total + invoice.total, 0);\n  return {\n    month,\n    monthLabel: new Date(`${month}-01T00:00:00`).toLocaleDateString(\"en-IN\", { month: \"long\", year: \"numeric\" }),\n    monthComplete: month !== currentMonth,\n    daysElapsed,\n    daysInMonth,\n    invoicesGenerated: jobs.filter((view) => !view.invoice?.voided_at && inMonth(view.invoice?.created_at, month)).length,\n    paymentsReceived,\n    totalCollections,\n    projectedMonthlyCollection: daysElapsed > 0 ? totalCollections / daysElapsed * daysInMonth : 0,\n  };\n}",
    "parameters": [
      {
        "name": "jobs",
        "type": "JobView[]",
        "optional": false
      },
      {
        "name": "today",
        "type": "string",
        "optional": false
      },
      {
        "name": "month",
        "type": "INFERRED",
        "optional": true,
        "default": "today.slice(0, 7)"
      }
    ],
    "returnType": "CashflowFacts",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "CashflowFacts"
  },
  {
    "id": "OP-dashboard-metrics-dashboardFacts",
    "name": "dashboardFacts",
    "file": "src/dashboard-metrics.ts",
    "span": "src/dashboard-metrics.ts:79-111",
    "calls": [
      "today.slice",
      "new Date(`${currentMonth}-01T00:00:00`).toLocaleDateString",
      "jobs.filter",
      "[\"CLOSED\", \"CANCELLED\"].includes",
      "jobs.flatMap((view) => view.material_requests).filter",
      "jobs.flatMap",
      "inMonth",
      "cashflowFacts",
      "jobs.map",
      "inventory.filter",
      "monthlyRequests.filter"
    ],
    "sql": [],
    "body": "export function dashboardFacts(jobs: JobView[], inventory: { stock_qty: number; low_stock_qty: number }[], today: string, cashflowMonth = today.slice(0, 7)): DashboardFacts {\n  const currentMonth = today.slice(0, 7);\n  const monthLabel = new Date(`${currentMonth}-01T00:00:00`).toLocaleDateString(\"en-IN\", { month: \"long\", year: \"numeric\" });\n\n  const activeJobs = jobs.filter((view) => ![\"CLOSED\", \"CANCELLED\"].includes(view.job.main_status));\n  const monthlyRequests = jobs.flatMap((view) => view.material_requests).filter((request) => inMonth(request.created_at, currentMonth));\n  const cashflow = cashflowFacts(jobs, today, cashflowMonth);\n\n  return {\n    currentMonth,\n    monthLabel,\n    cashflowMonth: cashflow.month,\n    cashflowMonthLabel: cashflow.monthLabel,\n    cashflowMonthComplete: cashflow.monthComplete,\n    daysElapsed: cashflow.daysElapsed,\n    daysInMonth: cashflow.daysInMonth,\n    activeToday: activeJobs.length,\n    totalVisits: jobs.length,\n    inProgress: jobs.filter((view) => view.job.main_status === \"IN_PROGRESS\").length,\n    closed: jobs.filter((view) => view.job.main_status === \"CLOSED\").length,\n    onHold: jobs.filter((view) => view.job.main_status === \"HOLD\").length,\n    customersServed: new Set(jobs.map((view) => view.customer.id)).size,\n    vehiclesServed: new Set(jobs.map((view) => view.vehicle.id)).size,\n    invoicesGenerated: cashflow.invoicesGenerated,\n    paymentsReceived: cashflow.paymentsReceived,\n    totalCollections: cashflow.totalCollections,\n    projectedMonthlyCollection: cashflow.projectedMonthlyCollection,\n    lowStock: inventory.filter((item) => item.stock_qty < item.low_stock_qty).length,\n    pendingApprovals: jobs.filter((view) => view.material_approval?.status === \"Pending\" && inMonth(view.material_approval.submitted_at, currentMonth)).length,\n    materialRequests: monthlyRequests.length,\n    materialsIssued: monthlyRequests.filter((request) => request.issued_qty > 0 || request.status === \"Issued\").length,\n  };\n}",
    "parameters": [
      {
        "name": "jobs",
        "type": "JobView[]",
        "optional": false
      },
      {
        "name": "inventory",
        "type": "{ stock_qty: number; low_stock_qty: number }[]",
        "optional": false
      },
      {
        "name": "today",
        "type": "string",
        "optional": false
      },
      {
        "name": "cashflowMonth",
        "type": "INFERRED",
        "optional": true,
        "default": "today.slice(0, 7)"
      }
    ],
    "returnType": "DashboardFacts",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "DashboardFacts"
  },
  {
    "id": "OP-data-flow-dataFlowMonths",
    "name": "dataFlowMonths",
    "file": "src/data-flow.ts",
    "span": "src/data-flow.ts:15-17",
    "calls": [
      "Array.from(new Set(jobs.map(visitMonth).filter(Boolean))).sort().reverse",
      "Array.from(new Set(jobs.map(visitMonth).filter(Boolean))).sort",
      "Array.from",
      "jobs.map(visitMonth).filter",
      "jobs.map"
    ],
    "sql": [],
    "body": "export function dataFlowMonths(jobs: JobView[]) {\n  return Array.from(new Set(jobs.map(visitMonth).filter(Boolean))).sort().reverse();\n}",
    "parameters": [
      {
        "name": "jobs",
        "type": "JobView[]",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "string[]"
  },
  {
    "id": "OP-data-flow-dataFlowDates",
    "name": "dataFlowDates",
    "file": "src/data-flow.ts",
    "span": "src/data-flow.ts:19-21",
    "calls": [
      "Array.from(new Set(jobs.filter((view) => !month || visitMonth(view) === month).map(visitDate).filter(Boolean))).sort().reverse",
      "Array.from(new Set(jobs.filter((view) => !month || visitMonth(view) === month).map(visitDate).filter(Boolean))).sort",
      "Array.from",
      "jobs.filter((view) => !month || visitMonth(view) === month).map(visitDate).filter",
      "jobs.filter((view) => !month || visitMonth(view) === month).map",
      "jobs.filter",
      "visitMonth"
    ],
    "sql": [],
    "body": "export function dataFlowDates(jobs: JobView[], month: string) {\n  return Array.from(new Set(jobs.filter((view) => !month || visitMonth(view) === month).map(visitDate).filter(Boolean))).sort().reverse();\n}",
    "parameters": [
      {
        "name": "jobs",
        "type": "JobView[]",
        "optional": false
      },
      {
        "name": "month",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "string[]"
  },
  {
    "id": "OP-data-flow-dataFlowSearchText",
    "name": "dataFlowSearchText",
    "file": "src/data-flow.ts",
    "span": "src/data-flow.ts:23-25",
    "calls": [],
    "sql": [],
    "body": "export function dataFlowSearchText(view: JobView) {\n  return `${view.job.job_no} ${view.vehicle.number} ${view.vehicle.make} ${view.vehicle.model} ${view.customer.name} ${view.customer.mobile}`;\n}",
    "parameters": [
      {
        "name": "view",
        "type": "JobView",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "string"
  },
  {
    "id": "OP-data-flow-filterDataFlowJobs",
    "name": "filterDataFlowJobs",
    "file": "src/data-flow.ts",
    "span": "src/data-flow.ts:27-34",
    "calls": [
      "normalizeSearch",
      "jobs.filter",
      "visitMonth",
      "visitDate",
      "normalizeSearch(dataFlowSearchText(view)).includes",
      "dataFlowSearchText"
    ],
    "sql": [],
    "body": "export function filterDataFlowJobs(jobs: JobView[], filters: DataFlowFilters) {\n  const needle = normalizeSearch(filters.query);\n  return jobs.filter((view) =>\n    (!filters.month || visitMonth(view) === filters.month)\n    && (!filters.date || visitDate(view) === filters.date)\n    && (!needle || normalizeSearch(dataFlowSearchText(view)).includes(needle))\n  );\n}",
    "parameters": [
      {
        "name": "jobs",
        "type": "JobView[]",
        "optional": false
      },
      {
        "name": "filters",
        "type": "DataFlowFilters",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "jobs/estimates; TX-02/11/12",
    "resolvedReturnType": "JobView[]"
  },
  {
    "id": "OP-data-flow-summarizeJobLifecycle",
    "name": "summarizeJobLifecycle",
    "file": "src/data-flow.ts",
    "span": "src/data-flow.ts:62-75",
    "calls": [
      "[...view.checklist_cycles].sort",
      "view.checklist_items.filter((item) => item.checklist_cycle_id === cycle.id).sort",
      "view.checklist_items.filter",
      "items.filter((item) => !item.checked_at).map",
      "items.filter",
      "Boolean"
    ],
    "sql": [],
    "body": "export function summarizeJobLifecycle(view: JobView): LifecycleSummary {\n  if (view.job.main_status === \"CANCELLED\") return { stage: \"CANCELLED\", cycle: null, activeStep: \"Cancelled\", remainingSteps: [], completed: true };\n  const cycle = [...view.checklist_cycles].sort((left, right) => right.id - left.id)[0];\n  if (!cycle) return { stage: view.job.main_status, cycle: null, activeStep: view.job.sub_status, remainingSteps: [], completed: false };\n  const items = view.checklist_items.filter((item) => item.checklist_cycle_id === cycle.id).sort((left, right) => left.sort_order - right.sort_order);\n  const remainingSteps = items.filter((item) => !item.checked_at).map((item) => item.label);\n  return {\n    stage: cycle.stage,\n    cycle: cycle.cycle_number,\n    activeStep: remainingSteps[0] ?? (cycle.completed_at ? \"Stage complete\" : view.job.sub_status),\n    remainingSteps,\n    completed: Boolean(cycle.completed_at) || (items.length > 0 && remainingSteps.length === 0),\n  };\n}",
    "parameters": [
      {
        "name": "view",
        "type": "JobView",
        "optional": false
      }
    ],
    "returnType": "LifecycleSummary",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "jobs/estimates; TX-02/11/12",
    "resolvedReturnType": "LifecycleSummary"
  },
  {
    "id": "OP-data-flow-buildDataFlowTimeline",
    "name": "buildDataFlowTimeline",
    "file": "src/data-flow.ts",
    "span": "src/data-flow.ts:88-160",
    "calls": [
      "actorName",
      "hasTime",
      "events.push",
      "view.checklist_items.forEach",
      "checklistEvents",
      "[...view.status_history].sort",
      "a.created_at.localeCompare",
      "view.status_history.forEach",
      "documentNumber",
      "sameTime",
      "payment.amount.toFixed",
      "view.inventory.find",
      "item",
      "event.old_total.toFixed",
      "event.new_total.toFixed",
      "events.filter((event) => hasTime(event.timestamp)).sort",
      "events.filter",
      "new Date(left.timestamp).getTime",
      "new Date(right.timestamp).getTime",
      "Number.isNaN",
      "left.timestamp.localeCompare",
      "left.id.localeCompare"
    ],
    "sql": [],
    "body": "export function buildDataFlowTimeline(view: JobView, users: User[] = []): DataFlowEvent[] {\n  const events: DataFlowEvent[] = [{ id: `visit-${view.visit.id}`, kind: \"visit\", timestamp: view.visit.received_at, title: \"Vehicle visit received\", detail: `${view.vehicle.number} · ${view.visit.requested_work}`, actor: actorName(view.visit.received_by, users) }];\n  for (const cycle of view.checklist_cycles) {\n    if (hasTime(cycle.started_at)) events.push({ id: `cycle-start-${cycle.id}`, kind: \"checklist\", timestamp: cycle.started_at, title: `${cycle.stage} checklist started`, detail: `Cycle ${cycle.cycle_number}`, actor: \"System\" });\n    if (hasTime(cycle.completed_at)) events.push({ id: `cycle-complete-${cycle.id}`, kind: \"checklist\", timestamp: cycle.completed_at, title: `${cycle.stage} checklist completed`, detail: `Cycle ${cycle.cycle_number}`, actor: \"System\" });\n  }\n  view.checklist_items.forEach((item) => events.push(...checklistEvents(item, users)));\n  const firstStatusId = [...view.status_history].sort((a, b) => a.created_at.localeCompare(b.created_at) || a.id - b.id)[0]?.id;\n  view.status_history.forEach((item) => events.push({ id: `status-${item.id}`, kind: \"status\", timestamp: item.created_at, title: `Status changed to ${item.main_status}`, detail: `${item.sub_status} · ${item.note}`, document: item.id === firstStatusId ? { kind: \"job-card\", number: view.job.job_no } : undefined }));\n\n  for (const estimate of view.estimate_history ?? (view.estimate ? [view.estimate] : [])) {\n    if (hasTime(estimate.created_at)) events.push({ id: `estimate-create-${estimate.id}`, kind: \"estimate\", timestamp: estimate.created_at, title: \"Estimate created\", detail: `${estimate.status} · GST ${estimate.gst_rate}%`, state: estimate.archived_at ? \"historical\" : \"current\", document: estimate.archived_at ? undefined : { kind: \"estimate\", number: view.estimate?.id === estimate.id ? documentNumber(\"estimate\", view) : \"\" } });\n    if (hasTime(estimate.updated_at) && !sameTime(estimate.updated_at, estimate.created_at) && !sameTime(estimate.updated_at, estimate.archived_at)) events.push({ id: `estimate-update-${estimate.id}`, kind: \"estimate\", timestamp: estimate.updated_at, title: \"Estimate updated\", detail: estimate.approval_note || estimate.status, state: estimate.archived_at ? \"historical\" : \"current\" });\n    if (hasTime(estimate.archived_at)) events.push({ id: `estimate-archive-${estimate.id}`, kind: \"document\", timestamp: estimate.archived_at, title: \"Estimate document archived\", detail: estimate.archived_reason || \"Superseded\", state: \"archived\" });\n  }\n\n  for (const invoice of view.invoice_history ?? (view.invoice ? [view.invoice] : [])) {\n    const current = invoice.id === view.invoice?.id && !invoice.voided_at;\n    if (hasTime(invoice.created_at)) {\n      events.push({ id: `invoice-create-${invoice.id}`, kind: \"invoice\", timestamp: invoice.created_at, title: \"Invoice created\", detail: `${invoice.invoice_no} · ${invoice.status}`, state: current ? \"current\" : \"historical\" });\n    }\n    if (hasTime(invoice.document_generated_at)) events.push({ id: `invoice-document-${invoice.id}`, kind: \"document\", timestamp: invoice.document_generated_at, title: \"Invoice PDF generated\", detail: invoice.invoice_no, state: current ? \"current\" : \"historical\", document: current ? { kind: \"invoice\", number: invoice.invoice_no } : undefined });\n    if (hasTime(invoice.updated_at) && !sameTime(invoice.updated_at, invoice.created_at) && !sameTime(invoice.updated_at, invoice.voided_at)) events.push({ id: `invoice-update-${invoice.id}`, kind: \"invoice\", timestamp: invoice.updated_at, title: \"Invoice updated\", detail: `${invoice.invoice_no} · ${invoice.status}`, state: current ? \"current\" : \"historical\" });\n    if (hasTime(invoice.voided_at)) {\n      events.push({ id: `invoice-void-${invoice.id}`, kind: \"invoice\", timestamp: invoice.voided_at, title: \"Invoice voided\", detail: `${invoice.invoice_no} · ${invoice.void_reason || \"No reason recorded\"}`, state: \"voided\" });\n      if (invoice.document_generated_at) events.push({ id: `invoice-document-void-${invoice.id}`, kind: \"document\", timestamp: invoice.voided_at, title: \"Invoice PDF voided\", detail: invoice.void_reason || invoice.invoice_no, state: \"voided\", document: { kind: \"invoice\", number: invoice.invoice_no, void: true } });\n    }\n  }\n\n  for (const payment of view.payment_history ?? view.payments) {\n    const current = !payment.voided_at && payment.invoice_id === view.invoice?.id;\n    if (hasTime(payment.created_at)) events.push({ id: `payment-create-${payment.id}`, kind: \"payment\", timestamp: payment.created_at, title: \"Payment recorded\", detail: `${payment.mode}${payment.reference ? ` · ${payment.reference}` : \"\"} · ₹${payment.amount.toFixed(2)}`, state: current ? \"current\" : \"historical\" });\n    if (hasTime(payment.updated_at) && !sameTime(payment.updated_at, payment.created_at) && !sameTime(payment.updated_at, payment.voided_at)) events.push({ id: `payment-update-${payment.id}`, kind: \"payment\", timestamp: payment.updated_at, title: \"Payment updated\", detail: `${payment.mode} · ₹${payment.amount.toFixed(2)}`, state: current ? \"current\" : \"historical\" });\n    if (hasTime(payment.voided_at)) events.push({ id: `payment-void-${payment.id}`, kind: \"payment\", timestamp: payment.voided_at, title: \"Payment voided\", detail: payment.void_reason || `₹${payment.amount.toFixed(2)}`, state: \"voided\" });\n  }\n\n  for (const receipt of view.receipt_history ?? (view.receipt ? [view.receipt] : [])) {\n    const current = receipt.id === view.receipt?.id && receipt.invoice_id === view.invoice?.id && !receipt.voided_at;\n    if (hasTime(receipt.created_at)) events.push({ id: `receipt-create-${receipt.id}`, kind: \"document\", timestamp: receipt.created_at, title: \"Payment Receipt PDF generated\", detail: receipt.receipt_no, state: current ? \"current\" : \"historical\", document: current ? { kind: \"payment-receipt\", number: receipt.receipt_no } : undefined });\n    if (hasTime(receipt.voided_at)) events.push({ id: `receipt-void-${receipt.id}`, kind: \"document\", timestamp: receipt.voided_at, title: \"Payment Receipt PDF voided\", detail: receipt.void_reason || receipt.receipt_no, state: \"voided\", document: { kind: \"payment-receipt\", number: receipt.receipt_no, void: true } });\n  }\n  for (const pass of view.gate_pass_history ?? (view.gate_pass ? [view.gate_pass] : [])) {\n    const current = pass.id === view.gate_pass?.id && pass.invoice_id === view.invoice?.id && !pass.voided_at;\n    if (hasTime(pass.created_at)) events.push({ id: `gate-pass-create-${pass.id}`, kind: \"document\", timestamp: pass.created_at, title: \"Gate Pass PDF generated\", detail: pass.gate_pass_no, state: current ? \"current\" : \"historical\", document: current ? { kind: \"gate-pass\", number: pass.gate_pass_no } : undefined });\n    if (hasTime(pass.voided_at)) events.push({ id: `gate-pass-void-${pass.id}`, kind: \"document\", timestamp: pass.voided_at, title: \"Gate Pass PDF voided\", detail: pass.void_reason || pass.gate_pass_no, state: \"voided\", document: { kind: \"gate-pass\", number: pass.gate_pass_no, void: true } });\n  }\n\n  for (const event of view.material_events ?? []) {\n    const item = (id: number | null) => view.inventory.find((candidate) => candidate.id === id)?.name ?? `Item ${id}`;\n    const detail = event.kind === \"release\"\n      ? `${item(event.new_item_id)} x ${event.new_qty} released to job`\n      : `${item(event.old_item_id)} x ${event.old_qty} -> ${item(event.new_item_id)} x ${event.new_qty} · ${event.note}`;\n    if (hasTime(event.at)) events.push({ id: `material-${event.kind}-${event.id}`, kind: \"material\", timestamp: event.at, title: event.kind === \"release\" ? \"Material released\" : \"Issued material edited\", detail, actor: actorName(event.by_user, users), state: \"current\" });\n  }\n\n  for (const event of view.invoice_events ?? []) {\n    if (!hasTime(event.at) || event.kind === \"create\") continue;\n    const totals = event.old_total !== null && event.new_total !== null ? ` (total ${event.old_total.toFixed(2)} -> ${event.new_total.toFixed(2)})` : \"\";\n    events.push({ id: `invoice-audit-${event.id}`, kind: \"invoice\", timestamp: event.at, title: event.kind === \"edit\" ? \"Invoice edited\" : \"Invoice void audited\", detail: `${event.detail}${totals}${event.note ? ` - ${event.note}` : \"\"}`, actor: actorName(event.by_user, users), state: \"current\" });\n  }\n\n  for (const photo of view.photo_history ?? view.photos) {\n    const category = photo.category || \"Job\";\n    if (hasTime(photo.created_at)) events.push({ id: `media-upload-${photo.id}`, kind: \"media\", timestamp: photo.created_at, title: \"Media uploaded\", detail: `${category} · ${photo.label}`, state: photo.archived_at ? \"historical\" : \"current\" });\n    if (hasTime(photo.updated_at) && !sameTime(photo.updated_at, photo.created_at) && !sameTime(photo.updated_at, photo.archived_at)) events.push({ id: `media-edit-${photo.id}`, kind: \"media\", timestamp: photo.updated_at, title: \"Media details edited\", detail: `${category} · ${photo.label}`, state: photo.archived_at ? \"historical\" : \"current\" });\n    if (hasTime(photo.archived_at)) events.push({ id: `media-archive-${photo.id}`, kind: \"media\", timestamp: photo.archived_at, title: \"Media archived\", detail: `${photo.label} · ${photo.archived_reason || \"No reason recorded\"}`, state: \"archived\" });\n  }\n\n  return events.filter((event) => hasTime(event.timestamp)).sort((left, right) => {\n    const byTime = new Date(left.timestamp).getTime() - new Date(right.timestamp).getTime();\n    return (Number.isNaN(byTime) ? left.timestamp.localeCompare(right.timestamp) : byTime) || left.id.localeCompare(right.id);\n  });\n}",
    "parameters": [
      {
        "name": "view",
        "type": "JobView",
        "optional": false
      },
      {
        "name": "users",
        "type": "User[]",
        "optional": true,
        "default": "[]"
      }
    ],
    "returnType": "DataFlowEvent[]",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "DataFlowEvent[]"
  },
  {
    "id": "OP-data-flow-buildGhostSteps",
    "name": "buildGhostSteps",
    "file": "src/data-flow.ts",
    "span": "src/data-flow.ts:170-186",
    "calls": [
      "[...view.checklist_cycles].sort",
      "view.checklist_items\n        .filter((item) => item.checklist_cycle_id === cycle.id && !item.checked_at && !item.na_at)\n        .sort((left, right) => left.sort_order - right.sort_order)\n        .forEach",
      "view.checklist_items\n        .filter((item) => item.checklist_cycle_id === cycle.id && !item.checked_at && !item.na_at)\n        .sort",
      "view.checklist_items\n        .filter",
      "ghosts.push",
      "resolveJobDocuments"
    ],
    "sql": [],
    "body": "export function buildGhostSteps(view: JobView, snapshots: readonly DocumentSnapshot[] = []): GhostStep[] {\n  const ghosts: GhostStep[] = [];\n  if (view.job.main_status !== \"CANCELLED\") {\n    const cycle = [...view.checklist_cycles].sort((left, right) => right.id - left.id)[0];\n    if (cycle) {\n      view.checklist_items\n        .filter((item) => item.checklist_cycle_id === cycle.id && !item.checked_at && !item.na_at)\n        .sort((left, right) => left.sort_order - right.sort_order)\n        .forEach((item) => ghosts.push({ id: `ghost-checklist-${item.id}`, kind: \"checklist\", title: item.label, reason: `${cycle.stage} checklist${item.required ? \"\" : \" (optional)\"}` }));\n    }\n  }\n  if (view.job.main_status === \"CANCELLED\") return ghosts;\n  for (const doc of resolveJobDocuments(view, snapshots)) {\n    if (!doc.available) ghosts.push({ id: `ghost-document-${doc.kind}`, kind: \"document\", title: doc.label, reason: doc.message ?? `${doc.label} not created` });\n  }\n  return ghosts;\n}",
    "parameters": [
      {
        "name": "view",
        "type": "JobView",
        "optional": false
      },
      {
        "name": "snapshots",
        "type": "readonly DocumentSnapshot[]",
        "optional": true,
        "default": "[]"
      }
    ],
    "returnType": "GhostStep[]",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "GhostStep[]"
  },
  {
    "id": "OP-data-flow-buildStageRows",
    "name": "buildStageRows",
    "file": "src/data-flow.ts",
    "span": "src/data-flow.ts:197-213",
    "calls": [
      "view.tasks.filter",
      "view.qc_checks.every",
      "Boolean",
      "view.payments.reduce((sum, payment) => sum + payment.amount, 0).toLocaleString",
      "view.payments.reduce"
    ],
    "sql": [],
    "body": "export function buildStageRows(view: JobView): StageRow[] {\n  const material = view.material_requests.length;\n  const tasksDone = view.tasks.filter((task) => task.status === \"Completed\").length;\n  const qc = view.qc_checks.length ? (view.qc_checks.every((check) => check.passed) ? \"Pass\" : \"Fail\") : view.job.qc_status;\n  return [\n    { id: \"visit\", label: \"Visit\", value: view.visit.received_at, done: true },\n    { id: \"estimate\", label: \"Estimate\", value: view.estimate ? view.estimate.status : \"Not created\", done: Boolean(view.estimate), document: view.estimate ? \"estimate\" : undefined },\n    { id: \"job-card\", label: \"Job Card\", value: view.job.main_status === \"CLOSED\" ? \"Delivered\" : view.job.sub_status, done: view.job.main_status !== \"NEW\", document: \"job-card\" },\n    { id: \"material\", label: \"Material\", value: material ? `${material} request(s)` : \"None requested\", done: material > 0 },\n    { id: \"work\", label: \"Work\", value: `${tasksDone}/${view.tasks.length} complete`, done: view.tasks.length > 0 && tasksDone === view.tasks.length },\n    { id: \"qc\", label: \"QC\", value: qc || \"Pending\", done: qc === \"Pass\" },\n    { id: \"invoice\", label: \"Invoice\", value: view.invoice ? view.invoice.invoice_no : \"Not created\", done: Boolean(view.invoice), document: view.invoice ? \"invoice\" : undefined },\n    { id: \"payment\", label: \"Payment\", value: view.payments.length ? `Rs ${view.payments.reduce((sum, payment) => sum + payment.amount, 0).toLocaleString(\"en-IN\")}` : \"Not received\", done: view.payments.length > 0 },\n    { id: \"receipt\", label: \"Payment Receipt\", value: view.receipt ? view.receipt.receipt_no : \"Not generated\", done: Boolean(view.receipt), document: view.receipt ? \"payment-receipt\" : undefined },\n    { id: \"gate-pass\", label: \"Gate Pass\", value: view.gate_pass ? view.gate_pass.gate_pass_no : \"Not generated\", done: Boolean(view.gate_pass), document: view.gate_pass ? \"gate-pass\" : undefined },\n  ];\n}",
    "parameters": [
      {
        "name": "view",
        "type": "JobView",
        "optional": false
      }
    ],
    "returnType": "StageRow[]",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "StageRow[]"
  },
  {
    "id": "OP-db-deriveChecklistSubStatus",
    "name": "deriveChecklistSubStatus",
    "file": "src/db.ts",
    "span": "src/db.ts:133-141",
    "calls": [
      "[...items].sort",
      "ordered.find",
      "ordered.at"
    ],
    "sql": [],
    "body": "export function deriveChecklistSubStatus(\n  items: readonly Pick<ChecklistItem, \"label\" | \"sort_order\" | \"checked_at\">[],\n): SubStatus {\n  const ordered = [...items].sort(\n    (left, right) => left.sort_order - right.sort_order,\n  );\n  if (ordered.length === 0) return \"Gather Requirements\";\n  return (ordered.find((item) => !item.checked_at) ?? ordered.at(-1)!).label;\n}",
    "parameters": [
      {
        "name": "items",
        "type": "readonly Pick<ChecklistItem, \"label\" | \"sort_order\" | \"checked_at\">[]",
        "optional": false
      }
    ],
    "returnType": "SubStatus",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "execution/checklists; TX-11",
    "resolvedReturnType": "SubStatus"
  },
  {
    "id": "OP-db-openWorkshopDb",
    "name": "openWorkshopDb",
    "file": "src/db.ts",
    "span": "src/db.ts:156-186",
    "calls": [
      "initSqlJs",
      "localStorage.getItem",
      "Uint8Array.from",
      "atob",
      "char.charCodeAt",
      "fetch",
      "response.arrayBuffer",
      "createSchema",
      "migrateSchema",
      "scalar",
      "seed",
      "ensureDemoAdvisors",
      "ensureDemoTeamStructure",
      "Object.entries",
      "db.run",
      "persist",
      "localStorage.setItem"
    ],
    "sql": [
      "scalar<number>(db, \"select count(*) from users\")",
      "db.run( \"update job_cards set estimated_delivery=? where job_no=? and main_status in ('NEW','IN_PROGRESS','HOLD')\", [date, jobNo], )"
    ],
    "body": "export async function openWorkshopDb() {\n  SQL ??= await initSqlJs({ locateFile: () => wasmUrl });\n  const saved =\n    localStorage.getItem(STORAGE_KEY) ??\n    localStorage.getItem(\"workshopos.sqlite.v1\");\n  let bytes: Uint8Array;\n  if (saved) {\n    bytes = Uint8Array.from(atob(saved), (char) => char.charCodeAt(0));\n  } else {\n    const response = await fetch(`${import.meta.env.BASE_URL}workshopos-demo.sqlite`);\n    if (!response.ok) throw new Error(\"Could not load the WorkshopOS demo database.\");\n    bytes = new Uint8Array(await response.arrayBuffer());\n  }\n  const db = new SQL.Database(bytes);\n  createSchema(db);\n  migrateSchema(db);\n  if (scalar<number>(db, \"select count(*) from users\") === 0) seed(db);\n  ensureDemoAdvisors(db);\n  ensureDemoTeamStructure(db);\n  if (saved && !localStorage.getItem(DELIVERY_DATES_MIGRATION_KEY)) {\n    for (const [jobNo, date] of Object.entries(demoDeliveryDates)) {\n      db.run(\n        \"update job_cards set estimated_delivery=? where job_no=? and main_status in ('NEW','IN_PROGRESS','HOLD')\",\n        [date, jobNo],\n      );\n    }\n  }\n  persist(db);\n  localStorage.setItem(DELIVERY_DATES_MIGRATION_KEY, \"1\");\n  return db;\n}",
    "parameters": [],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "RETIRED/IMPORT-ONLY",
    "endpoint": "No browser endpoint; deployment/import service only",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "Promise<Database>"
  },
  {
    "id": "OP-db-persist",
    "name": "persist",
    "file": "src/db.ts",
    "span": "src/db.ts:188-199",
    "calls": [
      "exportPersistableDatabase",
      "binary.forEach",
      "String.fromCharCode",
      "localStorage.setItem",
      "btoa"
    ],
    "sql": [],
    "body": "export function persist(db: Database) {\n  if (!SQL) throw new Error(\"SQL.js is not initialized.\");\n  const binary = exportPersistableDatabase(\n    db,\n    (bytes) => new SQL!.Database(bytes),\n  );\n  let encoded = \"\";\n  binary.forEach((byte: number) => {\n    encoded += String.fromCharCode(byte);\n  });\n  localStorage.setItem(STORAGE_KEY, btoa(encoded));\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "RETIRED/IMPORT-ONLY",
    "endpoint": "No browser endpoint; deployment/import service only",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-exportPersistableDatabase",
    "name": "exportPersistableDatabase",
    "file": "src/db.ts",
    "span": "src/db.ts:201-217",
    "calls": [
      "cloneDatabase",
      "db.export",
      "clone.run",
      "resetMissingPhotoEvidence",
      "clone.export",
      "clone.close"
    ],
    "sql": [
      "db.export()"
    ],
    "body": "export function exportPersistableDatabase(\n  db: Database,\n  cloneDatabase: (bytes: Uint8Array) => Database,\n) {\n  const clone = cloneDatabase(db.export());\n  try {\n    // Image payloads deliberately live only in the active SQL.js session database.\n    clone.run(\n      \"delete from photos where trim(coalesce(mime_type,''))<>'' or src like 'data:image/%'\",\n    );\n    resetMissingPhotoEvidence(clone);\n    clone.run(\"vacuum\");\n    return clone.export();\n  } finally {\n    clone.close();\n  }\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "cloneDatabase",
        "type": "(bytes: Uint8Array) => Database",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "RETIRED/IMPORT-ONLY",
    "endpoint": "No browser endpoint; deployment/import service only",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "Uint8Array<ArrayBufferLike>"
  },
  {
    "id": "OP-db-readState",
    "name": "readState",
    "file": "src/db.ts",
    "span": "src/db.ts:219-603",
    "calls": [
      "all",
      "rows.map",
      "rows.forEach",
      "grouped.set",
      "key",
      "grouped.get",
      "byId",
      "allEstimates.filter",
      "groupBy",
      "allInvoices.filter",
      "allPayments.filter",
      "allReceipts.filter",
      "allPasses.filter",
      "allPhotos.filter",
      "movementsByJob.get",
      "allVisits.get",
      "allCustomers.get",
      "allVehicles.get",
      "allUsers.get",
      "estimatesByJob.get",
      "jobEstimates.at",
      "estimateItemsByEstimate.get",
      "materialByJob.get",
      "materialEventsByJob.get",
      "material_requests.map",
      "jobMaterialEvents.flatMap",
      "[...materialItemIds]\n        .map((id) => allInventory.get(id as number))\n        .filter",
      "[...materialItemIds]\n        .map",
      "allInventory.get",
      "(invoicesByJob.get(job.id) ?? []).at",
      "invoicesByJob.get",
      "taskListByJob.get",
      "localPurchasesByJob.get",
      "purchaseRequestsByJob.get",
      "[...approvalsByJob.values()].find",
      "approvalsByJob.values",
      "approvalEventsByJob.get",
      "invoiceEventsByJob.get",
      "tasksByJob.get",
      "invoiceItemsByInvoice.get",
      "paymentsByJob.get",
      "(receiptsByJob.get(job.id) ?? []).at",
      "receiptsByJob.get",
      "(passesByJob.get(job.id) ?? []).at",
      "passesByJob.get",
      "photosByJob.get",
      "followupsByJob.get",
      "qcByJob.get",
      "historyByJob.get",
      "cyclesByJob.get",
      "checklistByJob.get",
      "estimateHistoryByJob.get",
      "invoiceHistoryByJob.get",
      "paymentHistoryByJob.get",
      "receiptHistoryByJob.get",
      "passHistoryByJob.get",
      "photoHistoryByJob.get",
      "jobViews",
      "all<Omit<SalesQuotation, \"lines\">>(db, \"select * from sales_quotations order by created_at desc, id desc\").map",
      "salesLines.filter",
      "all<Omit<ServiceDepartment, \"manager_ids\" | \"advisor_team_ids\" | \"advisor_teams\">>(db, \"select * from service_departments order by status, name\").map",
      "all<{ manager_id: number }>(db, \"select manager_id from service_department_managers where department_id=? order by manager_id\", [department.id]).map",
      "advisor_teams.map"
    ],
    "sql": [
      "all<User>( db, \"select * from users where archived_at is null order by id\", )",
      "all<Customer>( db, \"select * from customers where archived_at is null order by id\", )",
      "all<Vehicle>( db, \"select * from vehicles where archived_at is null order by id\", )",
      "all<Visit>( db, \"select * from visits where archived_at is null order by id desc\", )",
      "all<Booking>( db, \"select * from bookings order by booking_date, id desc\", )",
      "all<BookingCallLog>( db, \"select * from booking_call_logs order by called_at desc, id desc\", )",
      "all<BookingEvent>( db, \"select * from booking_events order by at desc, id desc\", )",
      "all<BookingCapacityLimit>( db, \"select * from booking_capacity_limits order by booking_date\", )",
      "all<BookingCapacityOverride>( db, \"select * from booking_capacity_overrides order by approved_at desc, id desc\", )",
      "all<InventoryItem>( db, \"select i.*, i.stock_qty - coalesce((select sum(l.qty) from stock_ledger l where l.item_id=i.id),0) as stock_qty from inventory i where i.archived_at is null order by i.category, i.name\", )",
      "all<ServiceCatalogItem>( db, `select catalog.*, department.name as department_name, brand.name as brand_name, segment.name as car_segment_name from service_catalog_items catalog left join service_departments department on department.id=catalog.service_department_id left join service_brands brand on brand.id=catalog.brand_id left join car_segments segment on segment.id=catalog.car_segment_id where catalog.archived_at is null order by catalog.name, catalog.id`, )",
      "all<Supplier>(db, \"select * from suppliers order by name\")",
      "all<InwardPurchase>( db, \"select * from inward_purchases order by coalesce(submitted_at, created_at) desc, id desc\", )",
      "all<InwardPurchaseLine>( db, \"select * from inward_purchase_lines order by id\", )",
      "all<InwardPurchaseAttachment>( db, \"select * from inward_purchase_attachments order by id\", )",
      "all<InwardPurchaseRevision>( db, \"select * from inward_purchase_revisions order by purchase_id, revision_no\", )",
      "all<PurchaseOrder>( db, \"select * from purchase_orders order by order_date desc, id desc\", )",
      "all<PurchaseOrderLine>( db, \"select * from purchase_order_lines order by id\", )",
      "all<PurchaseOrderQuotation>( db, \"select * from purchase_order_quotations order by purchase_order_line_id, quote_date desc, id desc\", )",
      "all<PurchaseOrderReceipt>( db, \"select * from purchase_order_receipts order by received_at, id\", )",
      "all<PurchaseOrderReceiptLine>( db, \"select * from purchase_order_receipt_lines order by id\", )",
      "all<PurchaseOrderConfirmation>( db, \"select * from purchase_order_confirmations order by purchase_order_line_id\", )",
      "all<StockInward>( db, \"select * from stock_inwards order by received_at desc, id desc\", )",
      "all<JobCard>( db, \"select * from job_cards where archived_at is null order by id desc\", )",
      "all<JobCard>( db, \"select * from job_cards where archived_at is not null order by id desc\", )",
      "all<Customer>( db, \"select * from customers where archived_at is not null order by id\", )",
      "all<Vehicle>( db, \"select * from vehicles where archived_at is not null order by id\", )",
      "all<User>(db, \"select * from users\")",
      "all<Customer>(db, \"select * from customers\")",
      "all<Vehicle>(db, \"select * from vehicles\")",
      "all<Visit>(db, \"select * from visits\")",
      "all<InventoryItem>(db, \"select * from inventory\")",
      "all<Estimate>(db, \"select * from estimates order by id\")",
      "all<EstimateItem>( db, \"select * from estimate_items where archived_at is null\", )",
      "all<JobTaskListItem>( db, \"select * from job_task_list_items where archived_at is null order by id\", )",
      "all<MaterialRequest>( db, \"select * from material_requests where archived_at is null\", )",
      "all<MaterialApproval>(db, \"select * from material_approvals order by id\")",
      "all<MaterialApprovalEvent>( db, \"select * from material_approval_events order by id\", )",
      "all<LocalPurchase>( db, \"select * from local_purchases where archived_at is null order by id desc\", )",
      "all<MaterialPurchaseRequest>( db, \"select * from material_purchase_requests order by id desc\", )",
      "all<Task>(db, \"select * from tasks where archived_at is null\")",
      "all<Invoice>(db, \"select * from invoices order by id\")",
      "all<InvoiceItem>( db, \"select * from invoice_items where archived_at is null order by id\", )",
      "all<Payment>(db, \"select * from payments order by id\")",
      "all<Receipt>(db, \"select * from receipts order by id\")",
      "all<GatePass>(db, \"select * from gate_passes order by id\")",
      "all<Photo>(db, \"select * from photos order by id\")",
      "all<Followup>(db, \"select * from followups where archived_at is null\")",
      "all<QcCheck>(db, \"select * from qc_checks where archived_at is null\")",
      "all<StatusHistory>(db, \"select * from status_history order by id desc\")",
      "all<ChecklistCycle>( db, \"select * from checklist_cycles order by cycle_number, id\", )",
      "all<ChecklistItem>( db, \"select * from checklist_items order by cycle_number, sort_order, id\", )",
      "all<InvoiceEvent>(db, \"select * from invoice_events order by id\")",
      "all<MaterialEvent>(db, \"select * from material_events order by id\")",
      "all<MaterialMovement>( db, \"select * from material_movements order by id desc\", )",
      "all<AdvisorAttendance>( db, \"select user_id, date, present from advisor_attendance order by date, user_id\", )",
      "all<SalesLead>(db, \"select * from sales_leads order by created_at desc, id desc\")",
      "all<SalesQuotationLine>(db, \"select * from sales_quotation_lines order by quotation_id, line_no\")",
      "all<Omit<SalesQuotation, \"lines\">>(db, \"select * from sales_quotations order by created_at desc, id desc\")",
      "all<Omit<ServiceDepartment, \"manager_ids\" \\| \"advisor_team_ids\" \\| \"advisor_teams\">>(db, \"select * from service_departments order by status, name\")",
      "all<{ manager_id: number; advisor_id: number }>(db, \"select manager_id, advisor_id from service_advisor_teams where department_id=? order by manager_id, advisor_id\", [department.id])",
      "all<{ manager_id: number }>(db, \"select manager_id from service_department_managers where department_id=? order by manager_id\", [department.id])",
      "all<ServiceCatalogMaster>(db, \"select * from service_brands order by status, name\")",
      "all<ServiceCatalogMaster>(db, \"select * from car_segments order by status, name\")"
    ],
    "body": "export function readState(db: Database): WorkshopState {\n  const users = all<User>(\n    db,\n    \"select * from users where archived_at is null order by id\",\n  );\n  const customers = all<Customer>(\n    db,\n    \"select * from customers where archived_at is null order by id\",\n  );\n  const vehicles = all<Vehicle>(\n    db,\n    \"select * from vehicles where archived_at is null order by id\",\n  );\n  const visits = all<Visit>(\n    db,\n    \"select * from visits where archived_at is null order by id desc\",\n  );\n  const bookings = all<Booking>(\n    db,\n    \"select * from bookings order by booking_date, id desc\",\n  );\n  const booking_call_logs = all<BookingCallLog>(\n    db,\n    \"select * from booking_call_logs order by called_at desc, id desc\",\n  );\n  const booking_events = all<BookingEvent>(\n    db,\n    \"select * from booking_events order by at desc, id desc\",\n  );\n  const booking_capacity_limits = all<BookingCapacityLimit>(\n    db,\n    \"select * from booking_capacity_limits order by booking_date\",\n  );\n  const booking_capacity_overrides = all<BookingCapacityOverride>(\n    db,\n    \"select * from booking_capacity_overrides order by approved_at desc, id desc\",\n  );\n  const inventory = all<InventoryItem>(\n    db,\n    \"select i.*, i.stock_qty - coalesce((select sum(l.qty) from stock_ledger l where l.item_id=i.id),0) as stock_qty from inventory i where i.archived_at is null order by i.category, i.name\",\n  );\n  const service_catalog = all<ServiceCatalogItem>(\n    db,\n    `select catalog.*, department.name as department_name, brand.name as brand_name, segment.name as car_segment_name\n     from service_catalog_items catalog\n     left join service_departments department on department.id=catalog.service_department_id\n     left join service_brands brand on brand.id=catalog.brand_id\n     left join car_segments segment on segment.id=catalog.car_segment_id\n     where catalog.archived_at is null order by catalog.name, catalog.id`,\n  );\n  // Keep archived suppliers in the read model so historical receipts never lose their supplier identity.\n  const suppliers = all<Supplier>(db, \"select * from suppliers order by name\");\n  const inward_purchases = all<InwardPurchase>(\n    db,\n    \"select * from inward_purchases order by coalesce(submitted_at, created_at) desc, id desc\",\n  );\n  const inward_purchase_lines = all<InwardPurchaseLine>(\n    db,\n    \"select * from inward_purchase_lines order by id\",\n  );\n  const inward_purchase_attachments = all<InwardPurchaseAttachment>(\n    db,\n    \"select * from inward_purchase_attachments order by id\",\n  );\n  const inward_purchase_revisions = all<InwardPurchaseRevision>(\n    db,\n    \"select * from inward_purchase_revisions order by purchase_id, revision_no\",\n  );\n  const purchase_orders = all<PurchaseOrder>(\n    db,\n    \"select * from purchase_orders order by order_date desc, id desc\",\n  );\n  const purchase_order_lines = all<PurchaseOrderLine>(\n    db,\n    \"select * from purchase_order_lines order by id\",\n  );\n  const purchase_order_quotations = all<PurchaseOrderQuotation>(\n    db,\n    \"select * from purchase_order_quotations order by purchase_order_line_id, quote_date desc, id desc\",\n  );\n  const purchase_order_receipts = all<PurchaseOrderReceipt>(\n    db,\n    \"select * from purchase_order_receipts order by received_at, id\",\n  );\n  const purchase_order_receipt_lines = all<PurchaseOrderReceiptLine>(\n    db,\n    \"select * from purchase_order_receipt_lines order by id\",\n  );\n  const purchase_order_confirmations = all<PurchaseOrderConfirmation>(\n    db,\n    \"select * from purchase_order_confirmations order by purchase_order_line_id\",\n  );\n  const stock_inwards = all<StockInward>(\n    db,\n    \"select * from stock_inwards order by received_at desc, id desc\",\n  );\n  const jobRows = all<JobCard>(\n    db,\n    \"select * from job_cards where archived_at is null order by id desc\",\n  );\n  const archivedJobRows = all<JobCard>(\n    db,\n    \"select * from job_cards where archived_at is not null order by id desc\",\n  );\n  const archived_customers = all<Customer>(\n    db,\n    \"select * from customers where archived_at is not null order by id\",\n  );\n  const archived_vehicles = all<Vehicle>(\n    db,\n    \"select * from vehicles where archived_at is not null order by id\",\n  );\n  const byId = <T extends { id: number }>(rows: T[]) =>\n    new Map(rows.map((row) => [row.id, row]));\n  const groupBy = <T>(rows: T[], key: (row: T) => number) => {\n    const grouped = new Map<number, T[]>();\n    rows.forEach((row) =>\n      grouped.set(key(row), [...(grouped.get(key(row)) ?? []), row]),\n    );\n    return grouped;\n  };\n  const allUsers = byId(all<User>(db, \"select * from users\"));\n  const allCustomers = byId(all<Customer>(db, \"select * from customers\"));\n  const allVehicles = byId(all<Vehicle>(db, \"select * from vehicles\"));\n  const allVisits = byId(all<Visit>(db, \"select * from visits\"));\n  const allInventory = byId(all<InventoryItem>(db, \"select * from inventory\"));\n  const allEstimates = all<Estimate>(db, \"select * from estimates order by id\");\n  const estimates = allEstimates.filter((row) => !row.archived_at);\n  const estimatesByJob = groupBy(estimates, (row) => row.job_card_id);\n  const estimateItemsByEstimate = groupBy(\n    all<EstimateItem>(\n      db,\n      \"select * from estimate_items where archived_at is null\",\n    ),\n    (row) => row.estimate_id,\n  );\n  const taskListByJob = groupBy(\n    all<JobTaskListItem>(\n      db,\n      \"select * from job_task_list_items where archived_at is null order by id\",\n    ),\n    (row) => row.job_card_id,\n  );\n  const materialByJob = groupBy(\n    all<MaterialRequest>(\n      db,\n      \"select * from material_requests where archived_at is null\",\n    ),\n    (row) => row.job_card_id,\n  );\n  const approvalsByJob = byId(\n    all<MaterialApproval>(db, \"select * from material_approvals order by id\"),\n  );\n  const approvalEventsByJob = groupBy(\n    all<MaterialApprovalEvent>(\n      db,\n      \"select * from material_approval_events order by id\",\n    ),\n    (row) => row.job_card_id,\n  );\n  const localPurchasesByJob = groupBy(\n    all<LocalPurchase>(\n      db,\n      \"select * from local_purchases where archived_at is null order by id desc\",\n    ),\n    (row) => row.job_card_id,\n  );\n  const purchaseRequestsByJob = groupBy(\n    all<MaterialPurchaseRequest>(\n      db,\n      \"select * from material_purchase_requests order by id desc\",\n    ),\n    (row) => row.job_card_id,\n  );\n  const tasksByJob = groupBy(\n    all<Task>(db, \"select * from tasks where archived_at is null\"),\n    (row) => row.job_card_id,\n  );\n  const allInvoices = all<Invoice>(db, \"select * from invoices order by id\");\n  const invoicesByJob = groupBy(\n    allInvoices.filter((row) => !row.voided_at),\n    (row) => row.job_card_id,\n  );\n  const invoiceItemsByInvoice = groupBy(\n    all<InvoiceItem>(\n      db,\n      \"select * from invoice_items where archived_at is null order by id\",\n    ),\n    (row) => row.invoice_id,\n  );\n  const allPayments = all<Payment>(db, \"select * from payments order by id\");\n  const allReceipts = all<Receipt>(db, \"select * from receipts order by id\");\n  const allPasses = all<GatePass>(db, \"select * from gate_passes order by id\");\n  const allPhotos = all<Photo>(db, \"select * from photos order by id\");\n  const paymentsByJob = groupBy(\n    allPayments.filter((row) => !row.voided_at),\n    (row) => row.job_card_id,\n  );\n  const receiptsByJob = groupBy(\n    allReceipts.filter((row) => !row.voided_at),\n    (row) => row.job_card_id,\n  );\n  const passesByJob = groupBy(\n    allPasses.filter((row) => !row.voided_at),\n    (row) => row.job_card_id,\n  );\n  const photosByJob = groupBy(\n    allPhotos.filter((row) => !row.archived_at),\n    (row) => row.job_card_id,\n  );\n  const estimateHistoryByJob = groupBy(allEstimates, (row) => row.job_card_id);\n  const invoiceHistoryByJob = groupBy(allInvoices, (row) => row.job_card_id);\n  const paymentHistoryByJob = groupBy(allPayments, (row) => row.job_card_id);\n  const receiptHistoryByJob = groupBy(allReceipts, (row) => row.job_card_id);\n  const passHistoryByJob = groupBy(allPasses, (row) => row.job_card_id);\n  const photoHistoryByJob = groupBy(allPhotos, (row) => row.job_card_id);\n  const followupsByJob = groupBy(\n    all<Followup>(db, \"select * from followups where archived_at is null\"),\n    (row) => row.job_card_id,\n  );\n  const qcByJob = groupBy(\n    all<QcCheck>(db, \"select * from qc_checks where archived_at is null\"),\n    (row) => row.job_card_id,\n  );\n  const historyByJob = groupBy(\n    all<StatusHistory>(db, \"select * from status_history order by id desc\"),\n    (row) => row.job_card_id,\n  );\n  const cyclesByJob = groupBy(\n    all<ChecklistCycle>(\n      db,\n      \"select * from checklist_cycles order by cycle_number, id\",\n    ),\n    (row) => row.job_card_id,\n  );\n  const checklistByJob = groupBy(\n    all<ChecklistItem>(\n      db,\n      \"select * from checklist_items order by cycle_number, sort_order, id\",\n    ),\n    (row) => row.job_card_id,\n  );\n  const invoiceEventsByJob = groupBy(\n    all<InvoiceEvent>(db, \"select * from invoice_events order by id\"),\n    (row) => row.job_card_id,\n  );\n  const materialEventsByJob = groupBy(\n    all<MaterialEvent>(db, \"select * from material_events order by id\"),\n    (row) => row.job_card_id,\n  );\n  const movements = all<MaterialMovement>(\n    db,\n    \"select * from material_movements order by id desc\",\n  );\n  const movementsByJob = groupBy(movements, (row) => row.job_card_id);\n  const globalMovements = movementsByJob.get(0) ?? [];\n  const jobViews = (rows: JobCard[]): JobView[] =>\n    rows.map((job) => {\n      const visit = allVisits.get(job.visit_id)!;\n      const customer = allCustomers.get(visit.customer_id)!;\n      const vehicle = allVehicles.get(visit.vehicle_id)!;\n      const advisor = allUsers.get(job.advisor_id) ?? UNASSIGNED_ADVISOR;\n      const technician = allUsers.get(job.technician_id)!;\n      const jobEstimates = estimatesByJob.get(job.id) ?? [];\n      const estimate = jobEstimates.at(-1);\n      const estimate_items = estimate\n        ? (estimateItemsByEstimate.get(estimate.id) ?? [])\n        : [];\n      const material_requests = materialByJob.get(job.id) ?? [];\n      const jobMaterialEvents = materialEventsByJob.get(job.id) ?? [];\n      const materialItemIds = new Set([\n        ...material_requests.map((request) => request.item_id),\n        ...jobMaterialEvents.flatMap((event) => [\n          event.old_item_id,\n          event.new_item_id,\n        ]),\n      ]);\n      const materialInventory = [...materialItemIds]\n        .map((id) => allInventory.get(id as number))\n        .filter(Boolean) as InventoryItem[];\n      const invoice = (invoicesByJob.get(job.id) ?? []).at(-1);\n      return {\n        job,\n        visit,\n        customer,\n        vehicle,\n        advisor,\n        technician,\n        estimate,\n        estimate_items,\n        task_list_items: taskListByJob.get(job.id) ?? [],\n        material_requests,\n        local_purchases: localPurchasesByJob.get(job.id) ?? [],\n        material_purchase_requests: purchaseRequestsByJob.get(job.id) ?? [],\n        material_approval: [...approvalsByJob.values()].find(\n          (approval) => approval.job_card_id === job.id,\n        ),\n        material_approval_history: approvalEventsByJob.get(job.id) ?? [],\n        material_events: jobMaterialEvents,\n        invoice_events: invoiceEventsByJob.get(job.id) ?? [],\n        inventory: materialInventory,\n        tasks: tasksByJob.get(job.id) ?? [],\n        invoice,\n        invoice_items: invoice\n          ? (invoiceItemsByInvoice.get(invoice.id) ?? [])\n          : [],\n        payments: paymentsByJob.get(job.id) ?? [],\n        receipt: (receiptsByJob.get(job.id) ?? []).at(-1),\n        gate_pass: (passesByJob.get(job.id) ?? []).at(-1),\n        photos: photosByJob.get(job.id) ?? [],\n        followups: followupsByJob.get(job.id) ?? [],\n        qc_checks: qcByJob.get(job.id) ?? [],\n        status_history: historyByJob.get(job.id) ?? [],\n        checklist_cycles: cyclesByJob.get(job.id) ?? [],\n        checklist_items: checklistByJob.get(job.id) ?? [],\n        material_movements: [\n          ...(movementsByJob.get(job.id) ?? []),\n          ...globalMovements,\n        ],\n        estimate_history: estimateHistoryByJob.get(job.id) ?? [],\n        invoice_history: invoiceHistoryByJob.get(job.id) ?? [],\n        payment_history: paymentHistoryByJob.get(job.id) ?? [],\n        receipt_history: receiptHistoryByJob.get(job.id) ?? [],\n        gate_pass_history: passHistoryByJob.get(job.id) ?? [],\n        photo_history: photoHistoryByJob.get(job.id) ?? [],\n      };\n    });\n  const jobs = jobViews(jobRows);\n  // Historical jobs intentionally resolve through the all-record maps above: their visit,\n  // customer and vehicle may themselves have been archived.\n  const archived_jobs = jobViews(archivedJobRows);\n  const attendance = all<AdvisorAttendance>(\n    db,\n    \"select user_id, date, present from advisor_attendance order by date, user_id\",\n  );\n  const sales_leads = all<SalesLead>(db, \"select * from sales_leads order by created_at desc, id desc\");\n  const salesLines = all<SalesQuotationLine>(db, \"select * from sales_quotation_lines order by quotation_id, line_no\");\n  const sales_quotations = all<Omit<SalesQuotation, \"lines\">>(db, \"select * from sales_quotations order by created_at desc, id desc\").map((quotation) => ({ ...quotation, lines: salesLines.filter((line) => line.quotation_id === quotation.id) }));\n  const service_departments = all<Omit<ServiceDepartment, \"manager_ids\" | \"advisor_team_ids\" | \"advisor_teams\">>(db, \"select * from service_departments order by status, name\").map((department) => {\n    const advisor_teams = all<{ manager_id: number; advisor_id: number }>(db, \"select manager_id, advisor_id from service_advisor_teams where department_id=? order by manager_id, advisor_id\", [department.id]);\n    return {\n      ...department,\n      manager_ids: all<{ manager_id: number }>(db, \"select manager_id from service_department_managers where department_id=? order by manager_id\", [department.id]).map((row) => row.manager_id),\n      advisor_team_ids: advisor_teams.map((row) => row.advisor_id),\n      advisor_teams,\n    };\n  });\n  const service_brands = all<ServiceCatalogMaster>(db, \"select * from service_brands order by status, name\");\n  const car_segments = all<ServiceCatalogMaster>(db, \"select * from car_segments order by status, name\");\n  return {\n    users,\n    customers,\n    vehicles,\n    visits,\n    bookings,\n    booking_call_logs,\n    booking_events,\n    booking_capacity_limits,\n    booking_capacity_overrides,\n    jobs,\n    archived_customers,\n    archived_vehicles,\n    archived_jobs,\n    inventory,\n    service_catalog,\n    attendance,\n    suppliers,\n    inward_purchases,\n    inward_purchase_lines,\n    inward_purchase_attachments,\n    inward_purchase_revisions,\n    purchase_orders,\n    purchase_order_lines,\n    purchase_order_quotations,\n    purchase_order_receipts,\n    purchase_order_receipt_lines,\n    purchase_order_confirmations,\n    stock_inwards,\n    sales_leads,\n    sales_quotations,\n    service_departments,\n    service_brands,\n    car_segments,\n  };\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      }
    ],
    "returnType": "WorkshopState",
    "classification": "READ",
    "endpoint": "GET /api/v1/ui/state",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "WorkshopState"
  },
  {
    "id": "OP-db-presentAdvisors",
    "name": "presentAdvisors",
    "file": "src/db.ts",
    "span": "src/db.ts:617-628",
    "calls": [
      "todayKey",
      "users.filter",
      "attendance.find"
    ],
    "sql": [],
    "body": "export function presentAdvisors(\n  users: User[],\n  attendance: AdvisorAttendance[],\n  date = todayKey(),\n) {\n  return users.filter(\n    (user) =>\n      user.role === \"service\" &&\n      attendance.find((row) => row.user_id === user.id && row.date === date)\n        ?.present !== 0,\n  );\n}",
    "parameters": [
      {
        "name": "users",
        "type": "User[]",
        "optional": false
      },
      {
        "name": "attendance",
        "type": "AdvisorAttendance[]",
        "optional": false
      },
      {
        "name": "date",
        "type": "INFERRED",
        "optional": true,
        "default": "todayKey()"
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "READ",
    "endpoint": "GET /api/v1/ui/state",
    "service": "tenant_admin/service_catalog; TX-14",
    "resolvedReturnType": "User[]"
  },
  {
    "id": "OP-db-setAdvisorPresent",
    "name": "setAdvisorPresent",
    "file": "src/db.ts",
    "span": "src/db.ts:630-640",
    "calls": [
      "todayKey",
      "db.run"
    ],
    "sql": [
      "db.run( \"insert into advisor_attendance(user_id, date, present) values (?, ?, ?) on conflict(user_id, date) do update set present=excluded.present\", [userId, date, present ? 1 : 0], )"
    ],
    "body": "export function setAdvisorPresent(\n  db: Database,\n  userId: number,\n  present: boolean,\n  date = todayKey(),\n) {\n  db.run(\n    \"insert into advisor_attendance(user_id, date, present) values (?, ?, ?) on conflict(user_id, date) do update set present=excluded.present\",\n    [userId, date, present ? 1 : 0],\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "userId",
        "type": "number",
        "optional": false
      },
      {
        "name": "present",
        "type": "boolean",
        "optional": false
      },
      {
        "name": "date",
        "type": "INFERRED",
        "optional": true,
        "default": "todayKey()"
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/setAdvisorPresent",
    "service": "tenant_admin/service_catalog; TX-14",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-assignAdvisor",
    "name": "assignAdvisor",
    "file": "src/db.ts",
    "span": "src/db.ts:643-666",
    "calls": [
      "maybe",
      "one",
      "db.run",
      "history"
    ],
    "sql": [
      "maybe<User>( db, \"select * from users where id=? and role='service' and archived_at is null\", [advisorId], )",
      "one<JobCard>(db, \"select * from job_cards where id=?\", [jobId])",
      "db.run( \"update job_cards set advisor_id=?, updated_at=datetime('now') where id=?\", [advisorId, jobId], )",
      "db.run( \"update visits set advisor_id=?, updated_at=datetime('now') where id=?\", [advisorId, job.visit_id], )"
    ],
    "body": "export function assignAdvisor(db: Database, jobId: number, advisorId: number) {\n  const advisor = maybe<User>(\n    db,\n    \"select * from users where id=? and role='service' and archived_at is null\",\n    [advisorId],\n  );\n  if (!advisor) throw new Error(\"Pick a Service Advisor.\");\n  const job = one<JobCard>(db, \"select * from job_cards where id=?\", [jobId]);\n  db.run(\n    \"update job_cards set advisor_id=?, updated_at=datetime('now') where id=?\",\n    [advisorId, jobId],\n  );\n  db.run(\n    \"update visits set advisor_id=?, updated_at=datetime('now') where id=?\",\n    [advisorId, job.visit_id],\n  );\n  history(\n    db,\n    jobId,\n    job.main_status,\n    job.sub_status,\n    `Assigned to ${advisor.name}`,\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "jobId",
        "type": "number",
        "optional": false
      },
      {
        "name": "advisorId",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/assignAdvisor",
    "service": "tenant_admin/service_catalog; TX-14",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-ensureDemoAdvisors",
    "name": "ensureDemoAdvisors",
    "file": "src/db.ts",
    "span": "src/db.ts:669-723",
    "calls": [
      "db.run",
      "[\n    [\"advisor.aa@example.com\", \"Service advisor AA\"],\n    [\"advisor.bb1@example.com\", \"Service advisor BB1\"],\n  ].forEach",
      "scalar",
      "all",
      "advisors.find",
      "jobs.forEach"
    ],
    "sql": [
      "db.run( \"update users set name='Service advisor 1' where email='service@example.com' and name='Service Advisor'\", )",
      "scalar<number>(db, \"select count(*) from users where email=?\", [ email, ])",
      "db.run( \"insert into users(email, name, role, password, created_at, updated_at) values (?, ?, 'service', 'admin123', datetime('now'), datetime('now'))\", [email, name], )",
      "all<{ id: number }>( db, \"select id from users where email in ('service@example.com','advisor.aa@example.com','advisor.bb1@example.com') order by email\", )",
      "scalar<number>(db, \"select count(*) from job_cards\")",
      "scalar<string>(db, \"select email from users where id=?\", [advisor.id])",
      "scalar<number>(db, \"select count(*) from job_cards where advisor_id=?\", [ primaryId, ])",
      "all<{ id: number; visit_id: number }>( db, \"select id, visit_id from job_cards order by id\", )",
      "db.run(\"update job_cards set advisor_id=? where id=?\", [ advisorId, job.id, ])",
      "db.run(\"update visits set advisor_id=? where id=?\", [ advisorId, job.visit_id, ])"
    ],
    "body": "export function ensureDemoAdvisors(db: Database) {\n  db.run(\n    \"update users set name='Service advisor 1' where email='service@example.com' and name='Service Advisor'\",\n  );\n  [\n    [\"advisor.aa@example.com\", \"Service advisor AA\"],\n    [\"advisor.bb1@example.com\", \"Service advisor BB1\"],\n  ].forEach(([email, name]) => {\n    if (\n      scalar<number>(db, \"select count(*) from users where email=?\", [\n        email,\n      ]) === 0\n    )\n      db.run(\n        \"insert into users(email, name, role, password, created_at, updated_at) values (?, ?, 'service', 'admin123', datetime('now'), datetime('now'))\",\n        [email, name],\n      );\n  });\n  // A fresh (or older persisted) demo used one advisor for every seeded job.\n  // Rebalance only that unmistakable demo shape, so real assignments stay intact.\n  const advisors = all<{ id: number }>(\n    db,\n    \"select id from users where email in ('service@example.com','advisor.aa@example.com','advisor.bb1@example.com') order by email\",\n  );\n  const jobCount = scalar<number>(db, \"select count(*) from job_cards\");\n  const primaryId = advisors.find(\n    (advisor) =>\n      scalar<string>(db, \"select email from users where id=?\", [advisor.id]) ===\n      \"service@example.com\",\n  )?.id;\n  if (\n    primaryId &&\n    advisors.length === 3 &&\n    jobCount > 0 &&\n    scalar<number>(db, \"select count(*) from job_cards where advisor_id=?\", [\n      primaryId,\n    ]) === jobCount\n  ) {\n    const jobs = all<{ id: number; visit_id: number }>(\n      db,\n      \"select id, visit_id from job_cards order by id\",\n    );\n    jobs.forEach((job, index) => {\n      const advisorId = advisors[index % advisors.length].id;\n      db.run(\"update job_cards set advisor_id=? where id=?\", [\n        advisorId,\n        job.id,\n      ]);\n      db.run(\"update visits set advisor_id=? where id=?\", [\n        advisorId,\n        job.visit_id,\n      ]);\n    });\n  }\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "RETIRED/IMPORT-ONLY",
    "endpoint": "No browser endpoint; deployment/import service only",
    "service": "tenant_admin/service_catalog; TX-14",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-ensureDemoTeamStructure",
    "name": "ensureDemoTeamStructure",
    "file": "src/db.ts",
    "span": "src/db.ts:731-763",
    "calls": [
      "seededManagers.forEach",
      "maybe",
      "insert",
      "one",
      "createServiceDepartment",
      "db.run",
      "appointServiceDepartmentManager"
    ],
    "sql": [
      "maybe<User>(db, \"select * from users where email=?\", [email])",
      "insert( db, \"insert into users(email, name, role, password, created_at, updated_at) values (?, ?, 'service_manager', 'admin123', datetime('now'), datetime('now'))\", [email, name], )",
      "one<User>(db, \"select * from users where id=?\", [id])",
      "maybe<{ id: number }>( db, \"select id from service_departments where lower(name)=lower(?)\", [departmentName], )",
      "db.run(\"update users set archived_at=null, archived_reason=null, updated_at=datetime('now') where id=?\", [manager.id])"
    ],
    "body": "export function ensureDemoTeamStructure(db: Database) {\n  const seededManagers = [\n    [\"general.service.manager@example.com\", \"General Service Manager\", \"General Service Work\"],\n    [\"ppf.paint.manager@example.com\", \"PPF/Paint Manager\", \"PPF/Paint Work\"],\n  ] as const;\n\n  seededManagers.forEach(([email, name, departmentName]) => {\n    let manager = maybe<User>(db, \"select * from users where email=?\", [email]);\n    if (!manager) {\n      const id = insert(\n        db,\n        \"insert into users(email, name, role, password, created_at, updated_at) values (?, ?, 'service_manager', 'admin123', datetime('now'), datetime('now'))\",\n        [email, name],\n      );\n      manager = one<User>(db, \"select * from users where id=?\", [id]);\n    }\n\n    let department = maybe<{ id: number }>(\n      db,\n      \"select id from service_departments where lower(name)=lower(?)\",\n      [departmentName],\n    );\n    if (!department) {\n      const id = createServiceDepartment(db, departmentName);\n      department = { id };\n    }\n\n    if (manager.archived_at) {\n      db.run(\"update users set archived_at=null, archived_reason=null, updated_at=datetime('now') where id=?\", [manager.id]);\n    }\n    appointServiceDepartmentManager(db, department.id, manager.id);\n  });\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "RETIRED/IMPORT-ONLY",
    "endpoint": "No browser endpoint; deployment/import service only",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-loadLargeDemoDataset",
    "name": "loadLargeDemoDataset",
    "file": "src/db.ts",
    "span": "src/db.ts:769-1083",
    "calls": [
      "db.run",
      "tables.forEach",
      "[\n      [\"PPF-ROLL\", \"PPF\", \"Gloss PPF roll\", \"metre\", 500, 40],\n      [\"CERAMIC-1L\", \"Detailing\", \"Ceramic coating\", \"litre\", 80, 10],\n      [\"PAINT-CLEAR\", \"Paint\", \"Clear coat\", \"litre\", 60, 8],\n    ].forEach",
      "String(((i - 1) % 8) + 1).padStart",
      "String",
      "String(((i * 3) % 27) + 1).padStart",
      "String(i).padStart",
      "String(100000000 + i).padStart",
      "String((i % 30) + 1).padStart",
      "String(((i * 5) % 27) + 1).padStart",
      "String(8 + (i % 9)).padStart",
      "insert",
      "String(2000 + i).padStart",
      "ensureLifecycleChecklist",
      "[\"Edges checked\", \"Surface cleaned\", \"Customer items verified\"].forEach",
      "date.slice",
      "Math.max",
      "Math.round",
      "one",
      "validateLargeDemoDataset",
      "ensureDemoAdvisors"
    ],
    "sql": [
      "db.run(\"begin transaction\")",
      "db.run(`delete from ${table}`)",
      "db.run( \"insert into inventory(sku,category,name,unit,stock_qty,low_stock_qty,created_at,updated_at) values(?,?,?,?,?,?,?,?)\", [...row, \"2026-01-01T08:00:00.000Z\", \"2026-01-01T08:00:00.000Z\"], )",
      "db.run( \"insert into customers(name,mobile,type,created_at,updated_at) values(?,?,?,?,?)\", [ `Demo Customer ${String(i).padStart(3, \"0\")}`, `8${String(100000000 + i).padStart(9, \"0\")}`, i % 5 === 0 ? \"Dealer\" : \"Individual\", stamp, stamp, ], )",
      "db.run( \"insert into vehicles(customer_id,number,make,model,color,km,created_at,updated_at) values(?,?,?,?,?,?,?,?)\", [ customerId, `OD${String((i % 30) + 1).padStart(2, \"0\")}DM${String(1000 + i)}`, make, model, colors[(i - 1) % colors.length], 5000 + i * 317, stamp, stamp, ], )",
      "insert( db, \"insert into visits(customer_id,vehicle_id,advisor_id,received_by,received_at,fuel,keys,accessories,requested_work,photos_note,created_at,updated_at) values(?,?,?,?,?,'Half','2 keys','Mats',?,'Offline demo media',?,?)\", [customerId, vehicleId, 2, 3, date, work, date, date], )",
      "insert( db, \"insert into job_cards(job_no,visit_id,advisor_id,technician_id,main_status,sub_status,work_list,promised_at,qc_status,washing_needed,closed_at,advisor_notes,delivery_by,final_km,acknowledgement,created_at,updated_at) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)\", [ `JC-2026-${String(2000 + i).padStart(6, \"0\")}`, visitId, 2, 6, main, sub, work, \"Next business day\", main === \"NEW\" \\|\\| main === \"IN_PROGRESS\" ? \"Pending\" : \"Pass\", i % 3 === 0 ? 1 : 0, main === \"CLOSED\" ? date : \"\", \"Deterministic large demo\", main === \"CLOSED\" ? \"Demo Accounts\" : \"\", main === \"CLOSED\" ? 5000 + vehicleId * 317 : 0, main === \"CLOSED\" ? \"Vehicle received in good condition\" : \"\", date, date, ], )",
      "insert( db, \"insert into estimates(job_card_id,status,discount,gst_rate,approval_note,created_at,updated_at) values(?,?,?,?,?,?,?)\", [ jobId, subIndex < 2 ? \"Draft\" : \"Approved\", i % 4 === 0 ? 500 : 0, 18, subIndex < 2 ? \"Awaiting approval\" : \"Approved for demo\", date, date, ], )",
      "insert( db, \"insert into estimate_items(estimate_id,kind,description,qty,rate,created_at,updated_at) values(?,'Service',?,1,?,?,?)\", [estimateId, work, rate, date, date], )",
      "insert( db, \"insert into material_requests(job_card_id,item_id,requested_qty,issued_qty,used_qty,returned_qty,wasted_qty,created_at,updated_at) values(?,?,2,?,?,?,?,?,?)\", [ jobId, (i % 3) + 1, subIndex >= 4 ? 2 : 0, subIndex >= 6 ? 1.8 : 0, main === \"CLOSED\" ? 0.1 : 0, main === \"CLOSED\" ? 0.1 : 0, date, date, ], )",
      "insert( db, \"insert into tasks(job_card_id,technician_id,title,status,notes,created_at,updated_at,started_at,completed_at) values(?,?,?,?,?,?,?,?,?)\", [ jobId, 6, work, main === \"NEW\" ? \"Pending\" : main === \"IN_PROGRESS\" ? \"Started\" : \"Completed\", \"Generated demo task\", date, date, main === \"NEW\" ? null : date, main === \"COMPLETED\" \\|\\| main === \"CLOSED\" ? date : null, ], )",
      "insert( db, \"insert into qc_checks(job_card_id,label,passed) values(?,?,?)\", [jobId, label, main === \"COMPLETED\" \\|\\| main === \"CLOSED\" ? 1 : 0], )",
      "insert( db, \"insert into followups(job_card_id,note,due_at,done,outcome,created_at,updated_at) values(?,?,?,?,?,?,?)\", [ jobId, \"Customer progress update\", date.slice(0, 10), main === \"CLOSED\" ? 1 : 0, main === \"CLOSED\" ? \"Delivered\" : \"\", date, date, ], )",
      "insert( db, \"insert into invoices(job_card_id,invoice_no,tally_invoice_no,discount,gst_rate,subtotal,gst_amount,total,status,notes,document_available,created_at,updated_at) values(?,?,?,?,?,?,?,?,?,?,?,?,?)\", [ jobId, `INV-2026-${String(i).padStart(5, \"0\")}`, `TLY-${String(5000 + i)}`, invoiceDiscount, 18, rate, gstAmount, demoTotal, main === \"CLOSED\" ? \"Cleared\" : \"Pending\", \"Generated demo invoice\", 1, date, date, ], )",
      "insert( db, \"insert into invoice_items(invoice_id,kind,description,qty,rate,created_at,updated_at) values(?,'Service',?,1,?,?,?)\", [invoiceId, work, rate, date, date], )",
      "one<Invoice>( db, \"select * from invoices where id=?\", [invoiceId], )",
      "insert( db, \"insert into payments(job_card_id,invoice_id,amount,mode,other_detail,reference,notes,created_at,updated_at) values(?,?,?,?,?,?,?,?,?)\", [ jobId, invoiceId, demoTotal, \"UPI\", \"\", `PAY-${String(i).padStart(5, \"0\")}`, \"Generated demo payment\", date, date, ], )",
      "insert( db, \"insert into receipts(job_card_id,invoice_id,receipt_no,created_at) values(?,?,?,?)\", [jobId, invoiceId, `REC-2026-${String(i).padStart(5, \"0\")}`, date], )",
      "insert( db, \"insert into gate_passes(job_card_id,invoice_id,gate_pass_no,created_at) values(?,?,?,?)\", [jobId, invoiceId, `GP-2026-${String(i).padStart(5, \"0\")}`, date], )",
      "insert( db, \"insert into photos(job_card_id,label,src,category,created_at,updated_at) values(?,?,?,?,?,?)\", [ jobId, `${categories[(i + p) % categories.length]} documentation`, \"/media-placeholder.svg\", categories[(i + p) % categories.length], date, date, ], )",
      "insert( db, \"insert into status_history(job_card_id,main_status,sub_status,note,created_at) values(?,?,?,?,?)\", [jobId, main, sub, \"Generated coherent demo lifecycle\", date], )",
      "db.run(\"commit\")",
      "db.run(\"rollback\")"
    ],
    "body": "export function loadLargeDemoDataset(db: Database) {\n  const subStatuses: SubStatus[] = [\n    \"Gather Requirements\",\n    \"Create Estimate\",\n    \"Get Confirmation\",\n    \"Material Requested\",\n    \"Material Issued\",\n    \"Washing Needed\",\n    \"Work Started\",\n    \"Follow-up Needed\",\n    \"Photos Shared\",\n    \"QC Pending\",\n    \"Customer Verification\",\n    \"Invoice Ready\",\n    \"Payment Received\",\n    \"Receipt Generated\",\n    \"Gate Pass Generated\",\n    \"Delivered\",\n  ];\n  const makes = [\n    [\"Hyundai\", \"Creta\"],\n    [\"Mahindra\", \"Thar\"],\n    [\"Tata\", \"Nexon\"],\n    [\"Maruti\", \"Brezza\"],\n    [\"Honda\", \"City\"],\n    [\"Toyota\", \"Fortuner\"],\n    [\"Kia\", \"Seltos\"],\n    [\"BMW\", \"X1\"],\n  ];\n  const colors = [\"White\", \"Black\", \"Silver\", \"Blue\", \"Red\", \"Grey\"];\n  const categories = [\"Before\", \"After\", \"Inspection\", \"Progress\", \"Job Sheet\"];\n  const tables = [\n    \"approvals\",\n    \"material_movements\",\n    \"material_requests\",\n    \"inventory\",\n    \"gate_passes\",\n    \"receipts\",\n    \"payments\",\n    \"invoices\",\n    \"qc_checks\",\n    \"tasks\",\n    \"estimate_items\",\n    \"estimates\",\n    \"status_history\",\n    \"checklist_items\",\n    \"checklist_cycles\",\n    \"photos\",\n    \"followups\",\n    \"job_cards\",\n    \"visits\",\n    \"vehicles\",\n    \"customers\",\n  ];\n  db.run(\"begin transaction\");\n  try {\n    tables.forEach((table) => db.run(`delete from ${table}`));\n    [\n      [\"PPF-ROLL\", \"PPF\", \"Gloss PPF roll\", \"metre\", 500, 40],\n      [\"CERAMIC-1L\", \"Detailing\", \"Ceramic coating\", \"litre\", 80, 10],\n      [\"PAINT-CLEAR\", \"Paint\", \"Clear coat\", \"litre\", 60, 8],\n    ].forEach((row) =>\n      db.run(\n        \"insert into inventory(sku,category,name,unit,stock_qty,low_stock_qty,created_at,updated_at) values(?,?,?,?,?,?,?,?)\",\n        [...row, \"2026-01-01T08:00:00.000Z\", \"2026-01-01T08:00:00.000Z\"],\n      ),\n    );\n    for (let i = 1; i <= 120; i += 1) {\n      const stamp = `2026-${String(((i - 1) % 8) + 1).padStart(2, \"0\")}-${String(((i * 3) % 27) + 1).padStart(2, \"0\")}T09:00:00.000Z`;\n      db.run(\n        \"insert into customers(name,mobile,type,created_at,updated_at) values(?,?,?,?,?)\",\n        [\n          `Demo Customer ${String(i).padStart(3, \"0\")}`,\n          `8${String(100000000 + i).padStart(9, \"0\")}`,\n          i % 5 === 0 ? \"Dealer\" : \"Individual\",\n          stamp,\n          stamp,\n        ],\n      );\n    }\n    for (let i = 1; i <= 132; i += 1) {\n      const [make, model] = makes[(i - 1) % makes.length];\n      const customerId = ((i - 1) % 120) + 1;\n      const stamp = `2026-${String(((i - 1) % 8) + 1).padStart(2, \"0\")}-15T10:00:00.000Z`;\n      db.run(\n        \"insert into vehicles(customer_id,number,make,model,color,km,created_at,updated_at) values(?,?,?,?,?,?,?,?)\",\n        [\n          customerId,\n          `OD${String((i % 30) + 1).padStart(2, \"0\")}DM${String(1000 + i)}`,\n          make,\n          model,\n          colors[(i - 1) % colors.length],\n          5000 + i * 317,\n          stamp,\n          stamp,\n        ],\n      );\n    }\n    for (let i = 1; i <= 144; i += 1) {\n      const vehicleId = ((i - 1) % 132) + 1;\n      const customerId = ((vehicleId - 1) % 120) + 1;\n      const subIndex = (i - 1) % subStatuses.length;\n      const sub = subStatuses[subIndex];\n      let main: MainStatus =\n        subIndex <= 2\n          ? \"NEW\"\n          : subIndex <= 9\n            ? \"IN_PROGRESS\"\n            : subIndex <= 12\n              ? \"COMPLETED\"\n              : \"CLOSED\";\n      // Fixed overrides keep cancellation coverage deterministic without adding a sixth lifecycle status.\n      if (i % 48 === 12) main = \"CANCELLED\";\n      const date = `2026-${String(((i - 1) % 8) + 1).padStart(2, \"0\")}-${String(((i * 5) % 27) + 1).padStart(2, \"0\")}T${String(8 + (i % 9)).padStart(2, \"0\")}:00:00.000Z`;\n      const work = [\n        \"Full body PPF\",\n        \"Ceramic coating\",\n        \"Paint correction\",\n        \"Interior detailing\",\n      ][i % 4];\n      const visitId = insert(\n        db,\n        \"insert into visits(customer_id,vehicle_id,advisor_id,received_by,received_at,fuel,keys,accessories,requested_work,photos_note,created_at,updated_at) values(?,?,?,?,?,'Half','2 keys','Mats',?,'Offline demo media',?,?)\",\n        [customerId, vehicleId, 2, 3, date, work, date, date],\n      );\n      const jobId = insert(\n        db,\n        \"insert into job_cards(job_no,visit_id,advisor_id,technician_id,main_status,sub_status,work_list,promised_at,qc_status,washing_needed,closed_at,advisor_notes,delivery_by,final_km,acknowledgement,created_at,updated_at) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)\",\n        [\n          `JC-2026-${String(2000 + i).padStart(6, \"0\")}`,\n          visitId,\n          2,\n          6,\n          main,\n          sub,\n          work,\n          \"Next business day\",\n          main === \"NEW\" || main === \"IN_PROGRESS\" ? \"Pending\" : \"Pass\",\n          i % 3 === 0 ? 1 : 0,\n          main === \"CLOSED\" ? date : \"\",\n          \"Deterministic large demo\",\n          main === \"CLOSED\" ? \"Demo Accounts\" : \"\",\n          main === \"CLOSED\" ? 5000 + vehicleId * 317 : 0,\n          main === \"CLOSED\" ? \"Vehicle received in good condition\" : \"\",\n          date,\n          date,\n        ],\n      );\n      ensureLifecycleChecklist(db, jobId, main, sub, date);\n      const estimateId = insert(\n        db,\n        \"insert into estimates(job_card_id,status,discount,gst_rate,approval_note,created_at,updated_at) values(?,?,?,?,?,?,?)\",\n        [\n          jobId,\n          subIndex < 2 ? \"Draft\" : \"Approved\",\n          i % 4 === 0 ? 500 : 0,\n          18,\n          subIndex < 2 ? \"Awaiting approval\" : \"Approved for demo\",\n          date,\n          date,\n        ],\n      );\n      const rate = 3500 + (i % 12) * 750;\n      insert(\n        db,\n        \"insert into estimate_items(estimate_id,kind,description,qty,rate,created_at,updated_at) values(?,'Service',?,1,?,?,?)\",\n        [estimateId, work, rate, date, date],\n      );\n      if (subIndex >= 3)\n        insert(\n          db,\n          \"insert into material_requests(job_card_id,item_id,requested_qty,issued_qty,used_qty,returned_qty,wasted_qty,created_at,updated_at) values(?,?,2,?,?,?,?,?,?)\",\n          [\n            jobId,\n            (i % 3) + 1,\n            subIndex >= 4 ? 2 : 0,\n            subIndex >= 6 ? 1.8 : 0,\n            main === \"CLOSED\" ? 0.1 : 0,\n            main === \"CLOSED\" ? 0.1 : 0,\n            date,\n            date,\n          ],\n        );\n      insert(\n        db,\n        \"insert into tasks(job_card_id,technician_id,title,status,notes,created_at,updated_at,started_at,completed_at) values(?,?,?,?,?,?,?,?,?)\",\n        [\n          jobId,\n          6,\n          work,\n          main === \"NEW\"\n            ? \"Pending\"\n            : main === \"IN_PROGRESS\"\n              ? \"Started\"\n              : \"Completed\",\n          \"Generated demo task\",\n          date,\n          date,\n          main === \"NEW\" ? null : date,\n          main === \"COMPLETED\" || main === \"CLOSED\" ? date : null,\n        ],\n      );\n      [\"Edges checked\", \"Surface cleaned\", \"Customer items verified\"].forEach(\n        (label) =>\n          insert(\n            db,\n            \"insert into qc_checks(job_card_id,label,passed) values(?,?,?)\",\n            [jobId, label, main === \"COMPLETED\" || main === \"CLOSED\" ? 1 : 0],\n          ),\n      );\n      if (main !== \"NEW\")\n        insert(\n          db,\n          \"insert into followups(job_card_id,note,due_at,done,outcome,created_at,updated_at) values(?,?,?,?,?,?,?)\",\n          [\n            jobId,\n            \"Customer progress update\",\n            date.slice(0, 10),\n            main === \"CLOSED\" ? 1 : 0,\n            main === \"CLOSED\" ? \"Delivered\" : \"\",\n            date,\n            date,\n          ],\n        );\n      let invoiceId = 0;\n      if (main === \"COMPLETED\" || main === \"CLOSED\") {\n        const invoiceDiscount = i % 4 === 0 ? 500 : 0;\n        const taxable = Math.max(0, rate - invoiceDiscount);\n        const gstAmount = Math.round(taxable * 18) / 100;\n        const demoTotal = Math.round((taxable + gstAmount) * 100) / 100;\n        invoiceId = insert(\n          db,\n          \"insert into invoices(job_card_id,invoice_no,tally_invoice_no,discount,gst_rate,subtotal,gst_amount,total,status,notes,document_available,created_at,updated_at) values(?,?,?,?,?,?,?,?,?,?,?,?,?)\",\n          [\n            jobId,\n            `INV-2026-${String(i).padStart(5, \"0\")}`,\n            `TLY-${String(5000 + i)}`,\n            invoiceDiscount,\n            18,\n            rate,\n            gstAmount,\n            demoTotal,\n            main === \"CLOSED\" ? \"Cleared\" : \"Pending\",\n            \"Generated demo invoice\",\n            1,\n            date,\n            date,\n          ],\n        );\n        insert(\n          db,\n          \"insert into invoice_items(invoice_id,kind,description,qty,rate,created_at,updated_at) values(?,'Service',?,1,?,?,?)\",\n          [invoiceId, work, rate, date, date],\n        );\n      }\n      if (main === \"CLOSED\") {\n        const demoTotal = one<Invoice>(\n          db,\n          \"select * from invoices where id=?\",\n          [invoiceId],\n        ).total;\n        insert(\n          db,\n          \"insert into payments(job_card_id,invoice_id,amount,mode,other_detail,reference,notes,created_at,updated_at) values(?,?,?,?,?,?,?,?,?)\",\n          [\n            jobId,\n            invoiceId,\n            demoTotal,\n            \"UPI\",\n            \"\",\n            `PAY-${String(i).padStart(5, \"0\")}`,\n            \"Generated demo payment\",\n            date,\n            date,\n          ],\n        );\n        insert(\n          db,\n          \"insert into receipts(job_card_id,invoice_id,receipt_no,created_at) values(?,?,?,?)\",\n          [jobId, invoiceId, `REC-2026-${String(i).padStart(5, \"0\")}`, date],\n        );\n        insert(\n          db,\n          \"insert into gate_passes(job_card_id,invoice_id,gate_pass_no,created_at) values(?,?,?,?)\",\n          [jobId, invoiceId, `GP-2026-${String(i).padStart(5, \"0\")}`, date],\n        );\n      }\n      const photoCount = 2;\n      for (let p = 0; p < photoCount; p += 1)\n        insert(\n          db,\n          \"insert into photos(job_card_id,label,src,category,created_at,updated_at) values(?,?,?,?,?,?)\",\n          [\n            jobId,\n            `${categories[(i + p) % categories.length]} documentation`,\n            \"/media-placeholder.svg\",\n            categories[(i + p) % categories.length],\n            date,\n            date,\n          ],\n        );\n      insert(\n        db,\n        \"insert into status_history(job_card_id,main_status,sub_status,note,created_at) values(?,?,?,?,?)\",\n        [jobId, main, sub, \"Generated coherent demo lifecycle\", date],\n      );\n    }\n    validateLargeDemoDataset(db);\n    ensureDemoAdvisors(db);\n    db.run(\"commit\");\n  } catch (error) {\n    db.run(\"rollback\");\n    throw error;\n  }\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "RETIRED/IMPORT-ONLY",
    "endpoint": "No browser endpoint; deployment/import service only",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-login",
    "name": "login",
    "file": "src/db.ts",
    "span": "src/db.ts:1134-1140",
    "calls": [
      "state.users.find",
      "user.email.toLowerCase",
      "email.trim().toLowerCase",
      "email.trim"
    ],
    "sql": [],
    "body": "export function login(state: WorkshopState, email: string, password: string) {\n  return state.users.find(\n    (user) =>\n      user.email.toLowerCase() === email.trim().toLowerCase() &&\n      user.password === password,\n  );\n}",
    "parameters": [
      {
        "name": "state",
        "type": "WorkshopState",
        "optional": false
      },
      {
        "name": "email",
        "type": "string",
        "optional": false
      },
      {
        "name": "password",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "AUTH",
    "endpoint": "POST /api/v1/auth/login",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "User | undefined"
  },
  {
    "id": "OP-db-createUser",
    "name": "createUser",
    "file": "src/db.ts",
    "span": "src/db.ts:1152-1167",
    "calls": [
      "validateUser",
      "insert",
      "payload.email.trim().toLowerCase",
      "payload.email.trim",
      "payload.name.trim"
    ],
    "sql": [
      "insert( db, \"insert into users(email, name, role, password, created_at, updated_at) values (?, ?, ?, ?, datetime('now'), datetime('now'))\", [ payload.email.trim().toLowerCase(), payload.name.trim(), payload.role, payload.password, ], )"
    ],
    "body": "export function createUser(\n  db: Database,\n  payload: Pick<User, \"email\" | \"name\" | \"role\" | \"password\">,\n) {\n  validateUser(db, payload);\n  return insert(\n    db,\n    \"insert into users(email, name, role, password, created_at, updated_at) values (?, ?, ?, ?, datetime('now'), datetime('now'))\",\n    [\n      payload.email.trim().toLowerCase(),\n      payload.name.trim(),\n      payload.role,\n      payload.password,\n    ],\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "payload",
        "type": "Pick<User, \"email\" | \"name\" | \"role\" | \"password\">",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/createUser",
    "service": "tenant_admin/service_catalog; TX-14",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-updateUser",
    "name": "updateUser",
    "file": "src/db.ts",
    "span": "src/db.ts:1169-1187",
    "calls": [
      "one",
      "isPreloadedServiceManager",
      "validateUser",
      "db.run",
      "payload.email.trim().toLowerCase",
      "payload.email.trim",
      "payload.name.trim"
    ],
    "sql": [
      "one<User>(db, \"select * from users where id=? and archived_at is null\", [id])",
      "db.run( \"update users set email=?, name=?, role=?, password=?, updated_at=datetime('now') where id=?\", [ payload.email.trim().toLowerCase(), payload.name.trim(), payload.role, payload.password, id, ], )"
    ],
    "body": "export function updateUser(\n  db: Database,\n  id: number,\n  payload: Pick<User, \"email\" | \"name\" | \"role\" | \"password\">,\n) {\n  const existing = one<User>(db, \"select * from users where id=? and archived_at is null\", [id]);\n  if (isPreloadedServiceManager(existing)) throw new Error(\"Preloaded Service Department Manager accounts are locked.\");\n  validateUser(db, payload, id);\n  db.run(\n    \"update users set email=?, name=?, role=?, password=?, updated_at=datetime('now') where id=?\",\n    [\n      payload.email.trim().toLowerCase(),\n      payload.name.trim(),\n      payload.role,\n      payload.password,\n      id,\n    ],\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "id",
        "type": "number",
        "optional": false
      },
      {
        "name": "payload",
        "type": "Pick<User, \"email\" | \"name\" | \"role\" | \"password\">",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/updateUser",
    "service": "tenant_admin/service_catalog; TX-14",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-archiveUser",
    "name": "archiveUser",
    "file": "src/db.ts",
    "span": "src/db.ts:1189-1215",
    "calls": [
      "one",
      "isPreloadedServiceManager",
      "reason.trim",
      "scalar",
      "archive"
    ],
    "sql": [
      "one<User>( db, \"select * from users where id=? and archived_at is null\", [id], )",
      "scalar<number>( db, \"select count(*) from users where role='admin' and archived_at is null\", )"
    ],
    "body": "export function archiveUser(\n  db: Database,\n  id: number,\n  reason: string,\n  actingUserId: number,\n) {\n  const target = one<User>(\n    db,\n    \"select * from users where id=? and archived_at is null\",\n    [id],\n  );\n  if (isPreloadedServiceManager(target))\n    throw new Error(\"Preloaded Service Department Manager accounts are locked.\");\n  if (id === actingUserId)\n    throw new Error(\"You cannot archive your own signed-in account.\");\n  if (!reason.trim()) throw new Error(\"An archive reason is required.\");\n  if (\n    target.role === \"admin\" &&\n    scalar<number>(\n      db,\n      \"select count(*) from users where role='admin' and archived_at is null\",\n    ) <= 1\n  ) {\n    throw new Error(\"The final active Admin cannot be archived.\");\n  }\n  archive(db, \"users\", id, reason.trim());\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "id",
        "type": "number",
        "optional": false
      },
      {
        "name": "reason",
        "type": "string",
        "optional": false
      },
      {
        "name": "actingUserId",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/archiveUser",
    "service": "tenant_admin/service_catalog; TX-14",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-createCustomer",
    "name": "createCustomer",
    "file": "src/db.ts",
    "span": "src/db.ts:1237-1252",
    "calls": [
      "validateCustomer",
      "insert",
      "payload.name.trim",
      "payload.mobile.trim",
      "payload.type.trim",
      "(payload.address ?? \"\").trim"
    ],
    "sql": [
      "insert( db, \"insert into customers(name, mobile, type, address, created_at, updated_at) values (?, ?, ?, ?, datetime('now'), datetime('now'))\", [ payload.name.trim(), payload.mobile.trim(), payload.type.trim(), (payload.address ?? \"\").trim(), ], )"
    ],
    "body": "export function createCustomer(\n  db: Database,\n  payload: Pick<Customer, \"name\" | \"mobile\" | \"type\"> & { address?: string },\n) {\n  validateCustomer(db, payload);\n  return insert(\n    db,\n    \"insert into customers(name, mobile, type, address, created_at, updated_at) values (?, ?, ?, ?, datetime('now'), datetime('now'))\",\n    [\n      payload.name.trim(),\n      payload.mobile.trim(),\n      payload.type.trim(),\n      (payload.address ?? \"\").trim(),\n    ],\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "payload",
        "type": "Pick<Customer, \"name\" | \"mobile\" | \"type\"> & { address?: string }",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/createCustomer",
    "service": "intake; TX-01",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-updateCustomer",
    "name": "updateCustomer",
    "file": "src/db.ts",
    "span": "src/db.ts:1254-1270",
    "calls": [
      "validateCustomer",
      "db.run",
      "payload.name.trim",
      "payload.mobile.trim",
      "payload.type.trim",
      "payload.address.trim"
    ],
    "sql": [
      "db.run( \"update customers set name=?, mobile=?, type=?, address=coalesce(?, address), updated_at=datetime('now') where id=?\", [ payload.name.trim(), payload.mobile.trim(), payload.type.trim(), payload.address == null ? null : payload.address.trim(), id, ], )"
    ],
    "body": "export function updateCustomer(\n  db: Database,\n  id: number,\n  payload: Pick<Customer, \"name\" | \"mobile\" | \"type\"> & { address?: string },\n) {\n  validateCustomer(db, payload, id);\n  db.run(\n    \"update customers set name=?, mobile=?, type=?, address=coalesce(?, address), updated_at=datetime('now') where id=?\",\n    [\n      payload.name.trim(),\n      payload.mobile.trim(),\n      payload.type.trim(),\n      payload.address == null ? null : payload.address.trim(),\n      id,\n    ],\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "id",
        "type": "number",
        "optional": false
      },
      {
        "name": "payload",
        "type": "Pick<Customer, \"name\" | \"mobile\" | \"type\"> & { address?: string }",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/updateCustomer",
    "service": "intake; TX-01",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-archiveCustomer",
    "name": "archiveCustomer",
    "file": "src/db.ts",
    "span": "src/db.ts:1272-1274",
    "calls": [
      "archive"
    ],
    "sql": [],
    "body": "export function archiveCustomer(db: Database, id: number, reason: string) {\n  archive(db, \"customers\", id, reason);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "id",
        "type": "number",
        "optional": false
      },
      {
        "name": "reason",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/archiveCustomer",
    "service": "intake; TX-01",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-createVehicle",
    "name": "createVehicle",
    "file": "src/db.ts",
    "span": "src/db.ts:1276-1291",
    "calls": [
      "validateVehicle",
      "insert",
      "payload.number.trim().toUpperCase",
      "payload.number.trim",
      "payload.make.trim",
      "payload.model.trim",
      "payload.color.trim",
      "(payload.engine_no ?? \"\").trim"
    ],
    "sql": [
      "insert( db, \"insert into vehicles(customer_id, number, make, model, color, km, engine_no, created_at, updated_at) values (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))\", [ payload.customer_id, payload.number.trim().toUpperCase(), payload.make.trim(), payload.model.trim(), payload.color.trim(), payload.km, (payload.engine_no ?? \"\").trim(), ], )"
    ],
    "body": "export function createVehicle(db: Database, payload: Omit<Vehicle, \"id\">) {\n  validateVehicle(db, payload);\n  return insert(\n    db,\n    \"insert into vehicles(customer_id, number, make, model, color, km, engine_no, created_at, updated_at) values (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))\",\n    [\n      payload.customer_id,\n      payload.number.trim().toUpperCase(),\n      payload.make.trim(),\n      payload.model.trim(),\n      payload.color.trim(),\n      payload.km,\n      (payload.engine_no ?? \"\").trim(),\n    ],\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "payload",
        "type": "Omit<Vehicle, \"id\">",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/createVehicle",
    "service": "intake; TX-01",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-updateVehicle",
    "name": "updateVehicle",
    "file": "src/db.ts",
    "span": "src/db.ts:1293-1312",
    "calls": [
      "validateVehicle",
      "db.run",
      "payload.number.trim().toUpperCase",
      "payload.number.trim",
      "payload.make.trim",
      "payload.model.trim",
      "payload.color.trim",
      "payload.engine_no.trim"
    ],
    "sql": [
      "db.run( \"update vehicles set customer_id=?, number=?, make=?, model=?, color=?, km=?, engine_no=coalesce(?, engine_no), updated_at=datetime('now') where id=?\", [ payload.customer_id, payload.number.trim().toUpperCase(), payload.make.trim(), payload.model.trim(), payload.color.trim(), payload.km, payload.engine_no == null ? null : payload.engine_no.trim(), id, ], )"
    ],
    "body": "export function updateVehicle(\n  db: Database,\n  id: number,\n  payload: Omit<Vehicle, \"id\">,\n) {\n  validateVehicle(db, payload, id);\n  db.run(\n    \"update vehicles set customer_id=?, number=?, make=?, model=?, color=?, km=?, engine_no=coalesce(?, engine_no), updated_at=datetime('now') where id=?\",\n    [\n      payload.customer_id,\n      payload.number.trim().toUpperCase(),\n      payload.make.trim(),\n      payload.model.trim(),\n      payload.color.trim(),\n      payload.km,\n      payload.engine_no == null ? null : payload.engine_no.trim(),\n      id,\n    ],\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "id",
        "type": "number",
        "optional": false
      },
      {
        "name": "payload",
        "type": "Omit<Vehicle, \"id\">",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/updateVehicle",
    "service": "intake; TX-01",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-archiveVehicle",
    "name": "archiveVehicle",
    "file": "src/db.ts",
    "span": "src/db.ts:1314-1316",
    "calls": [
      "archive"
    ],
    "sql": [],
    "body": "export function archiveVehicle(db: Database, id: number, reason: string) {\n  archive(db, \"vehicles\", id, reason);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "id",
        "type": "number",
        "optional": false
      },
      {
        "name": "reason",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/archiveVehicle",
    "service": "intake; TX-01",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-updateVisit",
    "name": "updateVisit",
    "file": "src/db.ts",
    "span": "src/db.ts:1318-1346",
    "calls": [
      "one",
      "db.run"
    ],
    "sql": [
      "one<Visit>(db, \"select * from visits where id=?\", [id])",
      "db.run( \"update visits set advisor_id=?, fuel=?, keys=?, accessories=?, requested_work=?, photos_note=?, updated_at=datetime('now') where id=?\", [ payload.advisor_id ?? visit.advisor_id, payload.fuel ?? visit.fuel, payload.keys ?? visit.keys, payload.accessories ?? visit.accessories, payload.requested_work ?? visit.requested_work, payload.photos_note ?? visit.photos_note, id, ], )"
    ],
    "body": "export function updateVisit(\n  db: Database,\n  id: number,\n  payload: Partial<\n    Pick<\n      Visit,\n      | \"advisor_id\"\n      | \"fuel\"\n      | \"keys\"\n      | \"accessories\"\n      | \"requested_work\"\n      | \"photos_note\"\n    >\n  >,\n) {\n  const visit = one<Visit>(db, \"select * from visits where id=?\", [id]);\n  db.run(\n    \"update visits set advisor_id=?, fuel=?, keys=?, accessories=?, requested_work=?, photos_note=?, updated_at=datetime('now') where id=?\",\n    [\n      payload.advisor_id ?? visit.advisor_id,\n      payload.fuel ?? visit.fuel,\n      payload.keys ?? visit.keys,\n      payload.accessories ?? visit.accessories,\n      payload.requested_work ?? visit.requested_work,\n      payload.photos_note ?? visit.photos_note,\n      id,\n    ],\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "id",
        "type": "number",
        "optional": false
      },
      {
        "name": "payload",
        "type": "Partial<\n    Pick<\n      Visit,\n      | \"advisor_id\"\n      | \"fuel\"\n      | \"keys\"\n      | \"accessories\"\n      | \"requested_work\"\n      | \"photos_note\"\n    >\n  >",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/updateVisit",
    "service": "intake; TX-01",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-bookingCapacityForDate",
    "name": "bookingCapacityForDate",
    "file": "src/db.ts",
    "span": "src/db.ts:1394-1417",
    "calls": [
      "all",
      "scalar",
      "Math.max",
      "quota",
      "Boolean"
    ],
    "sql": [
      "all<BookingCapacityLimit>( db, \"select * from booking_capacity_limits where booking_date=?\", [bookingDate], )",
      "scalar<number>( db, \"select count(*) from bookings where booking_date=? and service_type=? and status in ('Booked','Confirmed','Rescheduled')\", [bookingDate, serviceType], )"
    ],
    "body": "export function bookingCapacityForDate(db: Database, bookingDate: string) {\n  const configured = all<BookingCapacityLimit>(\n    db,\n    \"select * from booking_capacity_limits where booking_date=?\",\n    [bookingDate],\n  )[0];\n  const quota = (serviceType: BookingServiceType) => {\n    const limit = serviceType === \"Service Work\"\n      ? configured?.service_work_capacity ?? DEFAULT_SERVICE_WORK_BOOKING_CAPACITY\n      : configured?.general_checkup_followup_capacity ?? DEFAULT_GENERAL_CHECKUP_FOLLOWUP_BOOKING_CAPACITY;\n    const count = scalar<number>(\n      db,\n      \"select count(*) from bookings where booking_date=? and service_type=? and status in ('Booked','Confirmed','Rescheduled')\",\n      [bookingDate, serviceType],\n    );\n    return { limit, count, remaining: Math.max(0, limit - count) };\n  };\n  return {\n    bookingDate,\n    serviceWork: quota(\"Service Work\"),\n    generalCheckupFollowup: quota(\"General Checkup / Follow-up\"),\n    configured: Boolean(configured),\n  };\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "bookingDate",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "READ",
    "endpoint": "GET /api/v1/ui/state",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "{ bookingDate: string; serviceWork: { limit: number; count: number; remaining: number; }; generalCheckupFollowup: { limit: number; count: number; remaining: number; }; configured: boolean; }"
  },
  {
    "id": "OP-db-setBookingCapacityForDate",
    "name": "setBookingCapacityForDate",
    "file": "src/db.ts",
    "span": "src/db.ts:1420-1438",
    "calls": [
      "new Date().toISOString",
      "assertBookingInput",
      "one",
      "Number.isInteger",
      "db.run"
    ],
    "sql": [
      "one<User>(db, \"select * from users where id=?\", [actorId])",
      "db.run( \"insert into booking_capacity_limits(booking_date,service_work_capacity,general_checkup_followup_capacity,set_by,updated_at) values(?,?,?,?,?) on conflict(booking_date) do update set service_work_capacity=excluded.service_work_capacity,general_checkup_followup_capacity=excluded.general_checkup_followup_capacity,set_by=excluded.set_by,updated_at=excluded.updated_at\", [bookingDate, capacities.serviceWork, capacities.generalCheckupFollowup, actorId, timestamp], )"
    ],
    "body": "export function setBookingCapacityForDate(\n  db: Database,\n  actorId: number,\n  bookingDate: string,\n  capacities: { serviceWork: number; generalCheckupFollowup: number },\n  timestamp = new Date().toISOString(),\n) {\n  assertBookingInput({\n    customerName: \"capacity\", mobile: \"capacity\", vehicleNo: \"capacity\", make: \"capacity\", model: \"capacity\", requestedWork: \"capacity\", serviceType: \"Service Work\", bookingDate,\n  });\n  const actor = one<User>(db, \"select * from users where id=?\", [actorId]);\n  if (actor.role !== \"admin\") throw new Error(\"Only Admin can change daily booking capacity.\");\n  if (!Number.isInteger(capacities.serviceWork) || capacities.serviceWork < 0 || !Number.isInteger(capacities.generalCheckupFollowup) || capacities.generalCheckupFollowup < 0)\n    throw new Error(\"Booking capacities must be whole numbers of zero or more.\");\n  db.run(\n    \"insert into booking_capacity_limits(booking_date,service_work_capacity,general_checkup_followup_capacity,set_by,updated_at) values(?,?,?,?,?) on conflict(booking_date) do update set service_work_capacity=excluded.service_work_capacity,general_checkup_followup_capacity=excluded.general_checkup_followup_capacity,set_by=excluded.set_by,updated_at=excluded.updated_at\",\n    [bookingDate, capacities.serviceWork, capacities.generalCheckupFollowup, actorId, timestamp],\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "bookingDate",
        "type": "string",
        "optional": false
      },
      {
        "name": "capacities",
        "type": "{ serviceWork: number; generalCheckupFollowup: number }",
        "optional": false
      },
      {
        "name": "timestamp",
        "type": "INFERRED",
        "optional": true,
        "default": "new Date().toISOString()"
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/setBookingCapacityForDate",
    "service": "intake/bookings; TX-01/02",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-createBooking",
    "name": "createBooking",
    "file": "src/db.ts",
    "span": "src/db.ts:1546-1601",
    "calls": [
      "new Date().toISOString",
      "assertBookingInput",
      "timestamp.slice",
      "assertBookingCapacity",
      "insert",
      "input.customerName.trim",
      "input.mobile.trim",
      "input.customerType?.trim",
      "input.vehicleNo.trim().toUpperCase",
      "input.vehicleNo.trim",
      "input.make.trim",
      "input.model.trim",
      "input.color?.trim",
      "input.requestedWork.trim",
      "bookingEvent",
      "one",
      "recordBookingCapacityOverride"
    ],
    "sql": [
      "insert( db, \"insert into bookings(customer_id,vehicle_id,customer_name,mobile,customer_type,vehicle_no,make,model,color,requested_work,service_type,booking_date,arrival_window,status,created_by,created_at,updated_at) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)\", [ input.customerId ?? null, input.vehicleId ?? null, input.customerName.trim(), input.mobile.trim(), input.customerType?.trim() \\|\\| \"Individual\", input.vehicleNo.trim().toUpperCase(), input.make.trim(), input.model.trim(), input.color?.trim() ?? \"\", input.requestedWork.trim(), input.serviceType, input.bookingDate, input.arrivalWindow ?? \"\", \"Booked\", actorId, timestamp, timestamp, ], )",
      "one<Booking>(db, \"select * from bookings where id=?\", [id])"
    ],
    "body": "export function createBooking(\n  db: Database,\n  actorId: number,\n  input: BookingInput,\n  timestamp = new Date().toISOString(),\n) {\n  assertBookingInput(input, timestamp.slice(0, 10));\n  if (!actorId) throw new Error(\"Creating user is required.\");\n  const isOverride = assertBookingCapacity(\n    db,\n    actorId,\n    input.bookingDate,\n    input.serviceType,\n    input.capacityOverrideReason,\n  );\n  const id = insert(\n    db,\n    \"insert into bookings(customer_id,vehicle_id,customer_name,mobile,customer_type,vehicle_no,make,model,color,requested_work,service_type,booking_date,arrival_window,status,created_by,created_at,updated_at) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)\",\n    [\n      input.customerId ?? null,\n      input.vehicleId ?? null,\n      input.customerName.trim(),\n      input.mobile.trim(),\n      input.customerType?.trim() || \"Individual\",\n      input.vehicleNo.trim().toUpperCase(),\n      input.make.trim(),\n      input.model.trim(),\n      input.color?.trim() ?? \"\",\n      input.requestedWork.trim(),\n      input.serviceType,\n      input.bookingDate,\n      input.arrivalWindow ?? \"\",\n      \"Booked\",\n      actorId,\n      timestamp,\n      timestamp,\n    ],\n  );\n  bookingEvent(\n    db,\n    one<Booking>(db, \"select * from bookings where id=?\", [id]),\n    \"Booked\",\n    actorId,\n    timestamp,\n  );\n  if (isOverride)\n    recordBookingCapacityOverride(\n      db,\n      id,\n      input.bookingDate,\n      actorId,\n      input.capacityOverrideReason!,\n      timestamp,\n    );\n  return id;\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "input",
        "type": "BookingInput",
        "optional": false
      },
      {
        "name": "timestamp",
        "type": "INFERRED",
        "optional": true,
        "default": "new Date().toISOString()"
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/createBooking",
    "service": "intake/bookings; TX-01/02",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-updateBooking",
    "name": "updateBooking",
    "file": "src/db.ts",
    "span": "src/db.ts:1604-1651",
    "calls": [
      "new Date().toISOString",
      "assertBookingInput",
      "timestamp.slice",
      "operationalBooking",
      "assertBookingCapacity",
      "db.run",
      "input.customerName.trim",
      "input.mobile.trim",
      "input.customerType?.trim",
      "input.vehicleNo.trim().toUpperCase",
      "input.vehicleNo.trim",
      "input.make.trim",
      "input.model.trim",
      "input.color?.trim",
      "input.requestedWork.trim",
      "recordBookingCapacityOverride"
    ],
    "sql": [
      "db.run( \"update bookings set customer_id=?,vehicle_id=?,customer_name=?,mobile=?,customer_type=?,vehicle_no=?,make=?,model=?,color=?,requested_work=?,service_type=?,booking_date=?,arrival_window=?,updated_at=? where id=?\", [ input.customerId ?? booking.customer_id ?? null, input.vehicleId ?? booking.vehicle_id ?? null, input.customerName.trim(), input.mobile.trim(), input.customerType?.trim() \\|\\| \"Individual\", input.vehicleNo.trim().toUpperCase(), input.make.trim(), input.model.trim(), input.color?.trim() ?? \"\", input.requestedWork.trim(), input.serviceType, input.bookingDate, input.arrivalWindow ?? \"\", timestamp, bookingId, ], )"
    ],
    "body": "export function updateBooking(\n  db: Database,\n  bookingId: number,\n  actorId: number,\n  input: BookingInput,\n  timestamp = new Date().toISOString(),\n) {\n  assertBookingInput(input, timestamp.slice(0, 10));\n  const booking = operationalBooking(db, bookingId);\n  if (!actorId) throw new Error(\"Updating user is required.\");\n  const isOverride = assertBookingCapacity(\n    db,\n    actorId,\n    input.bookingDate,\n    input.serviceType,\n    input.capacityOverrideReason,\n    bookingId,\n  );\n  db.run(\n    \"update bookings set customer_id=?,vehicle_id=?,customer_name=?,mobile=?,customer_type=?,vehicle_no=?,make=?,model=?,color=?,requested_work=?,service_type=?,booking_date=?,arrival_window=?,updated_at=? where id=?\",\n    [\n      input.customerId ?? booking.customer_id ?? null,\n      input.vehicleId ?? booking.vehicle_id ?? null,\n      input.customerName.trim(),\n      input.mobile.trim(),\n      input.customerType?.trim() || \"Individual\",\n      input.vehicleNo.trim().toUpperCase(),\n      input.make.trim(),\n      input.model.trim(),\n      input.color?.trim() ?? \"\",\n      input.requestedWork.trim(),\n      input.serviceType,\n      input.bookingDate,\n      input.arrivalWindow ?? \"\",\n      timestamp,\n      bookingId,\n    ],\n  );\n  if (isOverride)\n    recordBookingCapacityOverride(\n      db,\n      bookingId,\n      input.bookingDate,\n      actorId,\n      input.capacityOverrideReason!,\n      timestamp,\n    );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "bookingId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "input",
        "type": "BookingInput",
        "optional": false
      },
      {
        "name": "timestamp",
        "type": "INFERRED",
        "optional": true,
        "default": "new Date().toISOString()"
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/updateBooking",
    "service": "intake/bookings; TX-01/02",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-confirmBooking",
    "name": "confirmBooking",
    "file": "src/db.ts",
    "span": "src/db.ts:1653-1667",
    "calls": [
      "new Date().toISOString",
      "operationalBooking",
      "([\"Booked\", \"Rescheduled\"] as BookingStatus[]).includes",
      "db.run",
      "bookingEvent"
    ],
    "sql": [
      "db.run( \"update bookings set status='Confirmed',confirmed_at=?,updated_at=? where id=?\", [timestamp, timestamp, bookingId], )"
    ],
    "body": "export function confirmBooking(\n  db: Database,\n  bookingId: number,\n  actorId: number,\n  timestamp = new Date().toISOString(),\n) {\n  const booking = operationalBooking(db, bookingId);\n  if (!([\"Booked\", \"Rescheduled\"] as BookingStatus[]).includes(booking.status))\n    throw new Error(`A ${booking.status} booking cannot be confirmed.`);\n  db.run(\n    \"update bookings set status='Confirmed',confirmed_at=?,updated_at=? where id=?\",\n    [timestamp, timestamp, bookingId],\n  );\n  bookingEvent(db, booking, \"Confirmed\", actorId, timestamp);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "bookingId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "timestamp",
        "type": "INFERRED",
        "optional": true,
        "default": "new Date().toISOString()"
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/confirmBooking",
    "service": "intake/bookings; TX-01/02",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-rescheduleBooking",
    "name": "rescheduleBooking",
    "file": "src/db.ts",
    "span": "src/db.ts:1669-1739",
    "calls": [
      "new Date().toISOString",
      "operationalBooking",
      "assertBookingInput",
      "timestamp.slice",
      "reason.trim",
      "assertBookingCapacity",
      "db.run",
      "bookingEvent",
      "recordBookingCapacityOverride"
    ],
    "sql": [
      "db.run( \"update bookings set booking_date=?,arrival_window=?,status='Rescheduled',rescheduled_at=?,reschedule_reason=?,updated_at=? where id=?\", [ bookingDate, arrivalWindow, timestamp, reason.trim(), timestamp, bookingId, ], )"
    ],
    "body": "export function rescheduleBooking(\n  db: Database,\n  bookingId: number,\n  actorId: number,\n  bookingDate: string,\n  reason: string,\n  arrivalWindow: BookingArrivalWindow = \"\",\n  timestamp = new Date().toISOString(),\n  capacityOverrideReason?: string,\n) {\n  const booking = operationalBooking(db, bookingId);\n  assertBookingInput(\n    {\n      customerName: booking.customer_name,\n      mobile: booking.mobile,\n      vehicleNo: booking.vehicle_no,\n      make: booking.make,\n      model: booking.model,\n      requestedWork: booking.requested_work,\n      serviceType: booking.service_type,\n      bookingDate,\n      arrivalWindow,\n    },\n    timestamp.slice(0, 10),\n  );\n  if (!reason.trim()) throw new Error(\"A reschedule reason is required.\");\n  if (\n    booking.booking_date === bookingDate &&\n    booking.arrival_window === arrivalWindow\n  )\n    throw new Error(\n      \"Choose a different date or arrival window when rescheduling.\",\n    );\n  const isOverride = assertBookingCapacity(\n    db,\n    actorId,\n    bookingDate,\n    booking.service_type,\n    capacityOverrideReason,\n    bookingId,\n  );\n  db.run(\n    \"update bookings set booking_date=?,arrival_window=?,status='Rescheduled',rescheduled_at=?,reschedule_reason=?,updated_at=? where id=?\",\n    [\n      bookingDate,\n      arrivalWindow,\n      timestamp,\n      reason.trim(),\n      timestamp,\n      bookingId,\n    ],\n  );\n  bookingEvent(\n    db,\n    { ...booking, booking_date: bookingDate },\n    \"Rescheduled\",\n    actorId,\n    timestamp,\n    reason.trim(),\n    booking.booking_date,\n  );\n  if (isOverride)\n    recordBookingCapacityOverride(\n      db,\n      bookingId,\n      bookingDate,\n      actorId,\n      capacityOverrideReason!,\n      timestamp,\n    );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "bookingId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "bookingDate",
        "type": "string",
        "optional": false
      },
      {
        "name": "reason",
        "type": "string",
        "optional": false
      },
      {
        "name": "arrivalWindow",
        "type": "BookingArrivalWindow",
        "optional": true,
        "default": "\"\""
      },
      {
        "name": "timestamp",
        "type": "INFERRED",
        "optional": true,
        "default": "new Date().toISOString()"
      },
      {
        "name": "capacityOverrideReason",
        "type": "string",
        "optional": true
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/rescheduleBooking",
    "service": "intake/bookings; TX-01/02",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-cancelBooking",
    "name": "cancelBooking",
    "file": "src/db.ts",
    "span": "src/db.ts:1741-1755",
    "calls": [
      "new Date().toISOString",
      "operationalBooking",
      "reason.trim",
      "db.run",
      "bookingEvent"
    ],
    "sql": [
      "db.run( \"update bookings set status='Cancelled',cancelled_at=?,cancellation_reason=?,updated_at=? where id=?\", [timestamp, reason.trim(), timestamp, bookingId], )"
    ],
    "body": "export function cancelBooking(\n  db: Database,\n  bookingId: number,\n  actorId: number,\n  reason: string,\n  timestamp = new Date().toISOString(),\n) {\n  const booking = operationalBooking(db, bookingId);\n  if (!reason.trim()) throw new Error(\"A cancellation reason is required.\");\n  db.run(\n    \"update bookings set status='Cancelled',cancelled_at=?,cancellation_reason=?,updated_at=? where id=?\",\n    [timestamp, reason.trim(), timestamp, bookingId],\n  );\n  bookingEvent(db, booking, \"Cancelled\", actorId, timestamp, reason.trim());\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "bookingId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "reason",
        "type": "string",
        "optional": false
      },
      {
        "name": "timestamp",
        "type": "INFERRED",
        "optional": true,
        "default": "new Date().toISOString()"
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/cancelBooking",
    "service": "intake/bookings; TX-01/02",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-markBookingNoShow",
    "name": "markBookingNoShow",
    "file": "src/db.ts",
    "span": "src/db.ts:1757-1771",
    "calls": [
      "new Date().toISOString",
      "operationalBooking",
      "reason.trim",
      "db.run",
      "bookingEvent"
    ],
    "sql": [
      "db.run( \"update bookings set status='No-show',no_show_at=?,no_show_reason=?,updated_at=? where id=?\", [timestamp, reason.trim(), timestamp, bookingId], )"
    ],
    "body": "export function markBookingNoShow(\n  db: Database,\n  bookingId: number,\n  actorId: number,\n  reason: string,\n  timestamp = new Date().toISOString(),\n) {\n  const booking = operationalBooking(db, bookingId);\n  if (!reason.trim()) throw new Error(\"A no-show reason is required.\");\n  db.run(\n    \"update bookings set status='No-show',no_show_at=?,no_show_reason=?,updated_at=? where id=?\",\n    [timestamp, reason.trim(), timestamp, bookingId],\n  );\n  bookingEvent(db, booking, \"No-show\", actorId, timestamp, reason.trim());\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "bookingId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "reason",
        "type": "string",
        "optional": false
      },
      {
        "name": "timestamp",
        "type": "INFERRED",
        "optional": true,
        "default": "new Date().toISOString()"
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/markBookingNoShow",
    "service": "intake/bookings; TX-01/02",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-recordBookingCall",
    "name": "recordBookingCall",
    "file": "src/db.ts",
    "span": "src/db.ts:1773-1787",
    "calls": [
      "new Date().toISOString",
      "operationalBooking",
      "note.trim",
      "insert"
    ],
    "sql": [
      "insert( db, \"insert into booking_call_logs(booking_id,note,called_by,called_at) values(?,?,?,?)\", [bookingId, note.trim(), actorId, timestamp], )"
    ],
    "body": "export function recordBookingCall(\n  db: Database,\n  bookingId: number,\n  actorId: number,\n  note: string,\n  timestamp = new Date().toISOString(),\n) {\n  operationalBooking(db, bookingId);\n  if (!note.trim()) throw new Error(\"A call note is required.\");\n  return insert(\n    db,\n    \"insert into booking_call_logs(booking_id,note,called_by,called_at) values(?,?,?,?)\",\n    [bookingId, note.trim(), actorId, timestamp],\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "bookingId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "note",
        "type": "string",
        "optional": false
      },
      {
        "name": "timestamp",
        "type": "INFERRED",
        "optional": true,
        "default": "new Date().toISOString()"
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/recordBookingCall",
    "service": "intake/bookings; TX-01/02",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-checkInBooking",
    "name": "checkInBooking",
    "file": "src/db.ts",
    "span": "src/db.ts:1795-1852",
    "calls": [
      "new Date().toISOString",
      "operationalBooking",
      "CAPACITY_BOOKING_STATUSES.includes",
      "input.requestedWork.trim",
      "Number.isFinite",
      "input.fuelLevelValue.trim",
      "db.run",
      "receiveVehicle",
      "input.keys.trim",
      "input.accessories.trim",
      "one",
      "bookingEvent"
    ],
    "sql": [
      "db.run(\"savepoint booking_check_in\")",
      "one<JobCard>(db, \"select * from job_cards where id=?\", [jobId])",
      "db.run( \"update bookings set status='Arrived',arrived_at=?,visit_id=?,job_card_id=?,updated_at=? where id=?\", [timestamp, visitId, jobId, timestamp, bookingId], )",
      "db.run(\"release savepoint booking_check_in\")",
      "db.run(\"rollback to savepoint booking_check_in\")",
      "db.run(\"release savepoint booking_check_in\")"
    ],
    "body": "export function checkInBooking(\n  db: Database,\n  bookingId: number,\n  receptionId: number,\n  input: BookingCheckInInput,\n  timestamp = new Date().toISOString(),\n) {\n  const booking = operationalBooking(db, bookingId);\n  if (!CAPACITY_BOOKING_STATUSES.includes(booking.status))\n    throw new Error(`A ${booking.status} booking cannot be checked in.`);\n  if (!receptionId) throw new Error(\"Receiving user is required.\");\n  if (!input.requestedWork.trim()) throw new Error(\"Requested work is required.\");\n  if (!Number.isFinite(input.odoReading) || input.odoReading < 0)\n    throw new Error(\"Enter the ODO meter reading in km.\");\n  if (!input.fuelLevelValue.trim())\n    throw new Error(\"Enter the fuel level or battery percentage.\");\n\n  const fuel = input.fuelLevelUnit === \"Other\"\n    ? input.fuelLevelValue.trim()\n    : `${input.fuelLevelValue.trim()} ${input.fuelLevelUnit}`;\n  db.run(\"savepoint booking_check_in\");\n  try {\n    const jobId = receiveVehicle(db, {\n      customerId: booking.customer_id ?? undefined,\n      vehicleId: booking.vehicle_id ?? undefined,\n      customerName: booking.customer_name,\n      mobile: booking.mobile,\n      customerType: booking.customer_type,\n      vehicleNo: booking.vehicle_no,\n      make: booking.make,\n      model: booking.model,\n      color: booking.color,\n      km: input.odoReading,\n      odoReading: input.odoReading,\n      fuel,\n      fuelLevelValue: input.fuelLevelValue.trim(),\n      fuelLevelUnit: input.fuelLevelUnit,\n      keys: input.keys.trim(),\n      accessories: input.accessories.trim(),\n      requestedWork: input.requestedWork.trim(),\n      serviceType: booking.service_type,\n      receptionId,\n      damageMarks: input.damageMarks,\n    });\n    const visitId = one<JobCard>(db, \"select * from job_cards where id=?\", [jobId]).visit_id;\n    db.run(\n      \"update bookings set status='Arrived',arrived_at=?,visit_id=?,job_card_id=?,updated_at=? where id=?\",\n      [timestamp, visitId, jobId, timestamp, bookingId],\n    );\n    bookingEvent(db, booking, \"Arrived\", receptionId, timestamp, \"Checked in at reception\");\n    db.run(\"release savepoint booking_check_in\");\n    return { jobId, visitId };\n  } catch (error) {\n    db.run(\"rollback to savepoint booking_check_in\");\n    db.run(\"release savepoint booking_check_in\");\n    throw error;\n  }\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "bookingId",
        "type": "number",
        "optional": false
      },
      {
        "name": "receptionId",
        "type": "number",
        "optional": false
      },
      {
        "name": "input",
        "type": "BookingCheckInInput",
        "optional": false
      },
      {
        "name": "timestamp",
        "type": "INFERRED",
        "optional": true,
        "default": "new Date().toISOString()"
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/checkInBooking",
    "service": "intake/bookings; TX-01/02",
    "resolvedReturnType": "{ jobId: number; visitId: number; }"
  },
  {
    "id": "OP-db-receiveVehicle",
    "name": "receiveVehicle",
    "file": "src/db.ts",
    "span": "src/db.ts:1854-2035",
    "calls": [
      "payload.customerName.trim",
      "payload.mobile.trim",
      "payload.vehicleNo.trim",
      "payload.make.trim",
      "payload.model.trim",
      "payload.requestedWork.trim",
      "Number.isFinite",
      "payload.fuel.trim",
      "payload.fuelLevelValue?.trim",
      "db.run",
      "maybe",
      "createCustomer",
      "payload.vehicleNo.toUpperCase",
      "createVehicle",
      "updateCustomer",
      "updateVehicle",
      "insert",
      "new Date().getFullYear",
      "String(1247 + visitId).padStart",
      "String",
      "ensureLifecycleChecklist",
      "payload.requestedWork.split",
      "[\"Edges checked\", \"Surface cleaned\", \"Customer items verified\"].forEach",
      "createPhoto",
      "history"
    ],
    "sql": [
      "db.run(\"savepoint reception_intake\")",
      "maybe<{ id: number }>( db, \"select id from customers where mobile=? and archived_at is null\", [payload.mobile], )",
      "maybe<{ id: number }>( db, \"select id from vehicles where number=? and archived_at is null\", [payload.vehicleNo.toUpperCase()], )",
      "insert( db, \"insert into visits(customer_id, vehicle_id, advisor_id, received_by, received_at, fuel, odo_reading, fuel_level_value, fuel_level_unit, keys, accessories, requested_work, photos_note, created_at, updated_at) values (?, ?, ?, ?, datetime('now'), ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))\", [ customerId, vehicleId, advisorId, payload.receptionId, payload.fuel, odoReading, payload.fuelLevelValue ?? \"\", payload.fuelLevelUnit ?? \"\", payload.keys, payload.accessories, payload.requestedWork, \"Reception intake\", ], )",
      "insert( db, \"insert into job_cards(job_no, visit_id, advisor_id, technician_id, main_status, sub_status, work_list, promised_at, qc_status, washing_needed, closed_at, advisor_notes, customer_instructions, internal_instructions, created_at, updated_at) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))\", [ `JC-${new Date().getFullYear()}-${String(1247 + visitId).padStart(6, \"0\")}`, visitId, advisorId, 6, \"NEW\", \"Gather Requirements\", payload.requestedWork, \"Tomorrow 6:00 PM\", \"Pending\", 0, \"\", \"\", payload.requestedWork, \"\", ], )",
      "db.run( \"update job_cards set service_type=?, pickup_drop=?, estimated_delivery=?, damage_marks=? where id=?\", [ payload.serviceType ?? \"\", payload.pickupDrop ?? \"\", payload.estimatedDelivery ?? \"\", payload.damageMarks \\|\\| \"[]\", jobId, ], )",
      "insert( db, \"insert into tasks(job_card_id, technician_id, title, status, notes, created_at, updated_at) values (?, ?, ?, ?, ?, datetime('now'), datetime('now'))\", [ jobId, 6, payload.requestedWork.split(\",\")[0] \\|\\| \"Workshop inspection\", \"Pending\", \"Created at reception check-in.\", ], )",
      "insert( db, \"insert into qc_checks(job_card_id, label, passed) values (?, ?, 0)\", [jobId, label], )",
      "db.run(\"release savepoint reception_intake\")",
      "db.run(\"rollback to savepoint reception_intake\")",
      "db.run(\"release savepoint reception_intake\")"
    ],
    "body": "export function receiveVehicle(\n  db: Database,\n  payload: {\n    customerId?: number;\n    vehicleId?: number;\n    customerName: string;\n    mobile: string;\n    customerType: string;\n    vehicleNo: string;\n    make: string;\n    model: string;\n    color: string;\n    km: number;\n    fuel: string;\n    odoReading?: number;\n    fuelLevelValue?: string;\n    fuelLevelUnit?: \"bars\" | \"%\" | \"litres\" | \"Other\";\n    keys: string;\n    accessories: string;\n    requestedWork: string;\n    advisorId?: number;\n    receptionId: number;\n    damageMarks?: string;\n    address?: string;\n    engineNo?: string;\n    serviceType?: string;\n    pickupDrop?: string;\n    estimatedDelivery?: string;\n  },\n) {\n  if (!payload.customerName.trim())\n    throw new Error(\"Customer name is required.\");\n  if (!payload.mobile.trim()) throw new Error(\"Customer mobile is required.\");\n  if (!payload.vehicleNo.trim()) throw new Error(\"Vehicle number is required.\");\n  if (!payload.make.trim() || !payload.model.trim())\n    throw new Error(\"Vehicle make and model are required.\");\n  if (!payload.requestedWork.trim())\n    throw new Error(\"Requested work is required.\");\n  if (!payload.receptionId) throw new Error(\"Receiving user is required.\");\n  const odoReading = payload.odoReading ?? payload.km;\n  if (!Number.isFinite(odoReading) || odoReading < 0)\n    throw new Error(\"Enter the ODO meter reading in km.\");\n  if (!payload.fuel.trim())\n    throw new Error(\"Enter the fuel level or battery percentage.\");\n  if (payload.fuelLevelUnit && !payload.fuelLevelValue?.trim())\n    throw new Error(\"Enter the fuel or battery level.\");\n  const advisorId = payload.advisorId || 0;\n  db.run(\"savepoint reception_intake\");\n  try {\n    const customerId =\n      payload.customerId ||\n      maybe<{ id: number }>(\n        db,\n        \"select id from customers where mobile=? and archived_at is null\",\n        [payload.mobile],\n      )?.id ||\n      createCustomer(db, {\n        name: payload.customerName,\n        mobile: payload.mobile,\n        type: payload.customerType || \"Individual\",\n        address: payload.address,\n      });\n    const vehicleId =\n      payload.vehicleId ||\n      maybe<{ id: number }>(\n        db,\n        \"select id from vehicles where number=? and archived_at is null\",\n        [payload.vehicleNo.toUpperCase()],\n      )?.id ||\n      createVehicle(db, {\n        customer_id: customerId,\n        number: payload.vehicleNo,\n        make: payload.make,\n        model: payload.model,\n        color: payload.color,\n        km: odoReading,\n        engine_no: payload.engineNo,\n      });\n    updateCustomer(db, customerId, {\n      name: payload.customerName,\n      mobile: payload.mobile,\n      type: payload.customerType || \"Individual\",\n      address: payload.address,\n    });\n    updateVehicle(db, vehicleId, {\n      customer_id: customerId,\n      number: payload.vehicleNo,\n      make: payload.make,\n      model: payload.model,\n      color: payload.color,\n      km: odoReading,\n      engine_no: payload.engineNo,\n    });\n    const visitId = insert(\n      db,\n      \"insert into visits(customer_id, vehicle_id, advisor_id, received_by, received_at, fuel, odo_reading, fuel_level_value, fuel_level_unit, keys, accessories, requested_work, photos_note, created_at, updated_at) values (?, ?, ?, ?, datetime('now'), ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))\",\n      [\n        customerId,\n        vehicleId,\n        advisorId,\n        payload.receptionId,\n        payload.fuel,\n        odoReading,\n        payload.fuelLevelValue ?? \"\",\n        payload.fuelLevelUnit ?? \"\",\n        payload.keys,\n        payload.accessories,\n        payload.requestedWork,\n        \"Reception intake\",\n      ],\n    );\n    const jobId = insert(\n      db,\n      \"insert into job_cards(job_no, visit_id, advisor_id, technician_id, main_status, sub_status, work_list, promised_at, qc_status, washing_needed, closed_at, advisor_notes, customer_instructions, internal_instructions, created_at, updated_at) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))\",\n      [\n        `JC-${new Date().getFullYear()}-${String(1247 + visitId).padStart(6, \"0\")}`,\n        visitId,\n        advisorId,\n        6,\n        \"NEW\",\n        \"Gather Requirements\",\n        payload.requestedWork,\n        \"Tomorrow 6:00 PM\",\n        \"Pending\",\n        0,\n        \"\",\n        \"\",\n        payload.requestedWork,\n        \"\",\n      ],\n    );\n    db.run(\n      \"update job_cards set service_type=?, pickup_drop=?, estimated_delivery=?, damage_marks=? where id=?\",\n      [\n        payload.serviceType ?? \"\",\n        payload.pickupDrop ?? \"\",\n        payload.estimatedDelivery ?? \"\",\n        payload.damageMarks || \"[]\",\n        jobId,\n      ],\n    );\n    ensureLifecycleChecklist(db, jobId, \"NEW\", \"Gather Requirements\");\n    insert(\n      db,\n      \"insert into tasks(job_card_id, technician_id, title, status, notes, created_at, updated_at) values (?, ?, ?, ?, ?, datetime('now'), datetime('now'))\",\n      [\n        jobId,\n        6,\n        payload.requestedWork.split(\",\")[0] || \"Workshop inspection\",\n        \"Pending\",\n        \"Created at reception check-in.\",\n      ],\n    );\n    [\"Edges checked\", \"Surface cleaned\", \"Customer items verified\"].forEach(\n      (label) =>\n        insert(\n          db,\n          \"insert into qc_checks(job_card_id, label, passed) values (?, ?, 0)\",\n          [jobId, label],\n        ),\n    );\n    createPhoto(db, {\n      job_card_id: jobId,\n      label: \"Reception intake\",\n      category: \"Reception\",\n      src: \"\",\n    });\n    history(\n      db,\n      jobId,\n      \"NEW\",\n      \"Gather Requirements\",\n      \"Visit received and job card opened\",\n    );\n    db.run(\"release savepoint reception_intake\");\n    return jobId;\n  } catch (error) {\n    db.run(\"rollback to savepoint reception_intake\");\n    db.run(\"release savepoint reception_intake\");\n    throw error;\n  }\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "payload",
        "type": "{\n    customerId?: number;\n    vehicleId?: number;\n    customerName: string;\n    mobile: string;\n    customerType: string;\n    vehicleNo: string;\n    make: string;\n    model: string;\n    color: string;\n    km: number;\n    fuel: string;\n    odoReading?: number;\n    fuelLevelValue?: string;\n    fuelLevelUnit?: \"bars\" | \"%\" | \"litres\" | \"Other\";\n    keys: string;\n    accessories: string;\n    requestedWork: string;\n    advisorId?: number;\n    receptionId: number;\n    damageMarks?: string;\n    address?: string;\n    engineNo?: string;\n    serviceType?: string;\n    pickupDrop?: string;\n    estimatedDelivery?: string;\n  }",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/receiveVehicle",
    "service": "intake; TX-01",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-isTerminalMainStatus",
    "name": "isTerminalMainStatus",
    "file": "src/db.ts",
    "span": "src/db.ts:2052-2054",
    "calls": [],
    "sql": [],
    "body": "export function isTerminalMainStatus(status: MainStatus) {\n  return MAIN_STATUS_TRANSITIONS[status].length === 0;\n}",
    "parameters": [
      {
        "name": "status",
        "type": "MainStatus",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "boolean"
  },
  {
    "id": "OP-db-canMutateJobLifecycle",
    "name": "canMutateJobLifecycle",
    "file": "src/db.ts",
    "span": "src/db.ts:2056-2064",
    "calls": [],
    "sql": [],
    "body": "export function canMutateJobLifecycle(\n  actor: Pick<User, \"id\" | \"role\">,\n  job: Pick<JobCard, \"advisor_id\">,\n) {\n  return (\n    actor.role === \"admin\" ||\n    (actor.role === \"service\" && actor.id === job.advisor_id)\n  );\n}",
    "parameters": [
      {
        "name": "actor",
        "type": "Pick<User, \"id\" | \"role\">",
        "optional": false
      },
      {
        "name": "job",
        "type": "Pick<JobCard, \"advisor_id\">",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "jobs/estimates; TX-02/11/12",
    "resolvedReturnType": "boolean"
  },
  {
    "id": "OP-db-canTransitionJobStatus",
    "name": "canTransitionJobStatus",
    "file": "src/db.ts",
    "span": "src/db.ts:2068-2076",
    "calls": [
      "MAIN_STATUS_TRANSITIONS[job.main_status].includes"
    ],
    "sql": [],
    "body": "export function canTransitionJobStatus(\n  actor: Pick<User, \"id\" | \"role\">,\n  job: Pick<JobCard, \"advisor_id\" | \"main_status\">,\n  to: MainStatus,\n) {\n  if (!MAIN_STATUS_TRANSITIONS[job.main_status].includes(to)) return false;\n  if (actor.role === \"admin\") return true;\n  return actor.role === \"service\" && actor.id === job.advisor_id;\n}",
    "parameters": [
      {
        "name": "actor",
        "type": "Pick<User, \"id\" | \"role\">",
        "optional": false
      },
      {
        "name": "job",
        "type": "Pick<JobCard, \"advisor_id\" | \"main_status\">",
        "optional": false
      },
      {
        "name": "to",
        "type": "MainStatus",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "jobs/estimates; TX-02/11/12",
    "resolvedReturnType": "boolean"
  },
  {
    "id": "OP-db-assertJobLifecycleMutationAccess",
    "name": "assertJobLifecycleMutationAccess",
    "file": "src/db.ts",
    "span": "src/db.ts:2078-2100",
    "calls": [
      "one",
      "isTerminalMainStatus",
      "canMutateJobLifecycle"
    ],
    "sql": [
      "one<User>( db, \"select * from users where id=? and archived_at is null\", [actorId], )",
      "one<JobCard>( db, \"select * from job_cards where id=? and archived_at is null\", [jobId], )"
    ],
    "body": "export function assertJobLifecycleMutationAccess(\n  db: Database,\n  jobId: number,\n  actorId: number,\n) {\n  const actor = one<User>(\n    db,\n    \"select * from users where id=? and archived_at is null\",\n    [actorId],\n  );\n  const job = one<JobCard>(\n    db,\n    \"select * from job_cards where id=? and archived_at is null\",\n    [jobId],\n  );\n  if (isTerminalMainStatus(job.main_status))\n    throw new Error(`A ${job.main_status} job card is read-only.`);\n  if (!canMutateJobLifecycle(actor, job)) {\n    throw new Error(\n      \"Only the Owner or the linked Service Advisor can change this job lifecycle or estimate.\",\n    );\n  }\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "jobId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "jobs/estimates; TX-02/11/12",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-createServiceCatalogItemForActor",
    "name": "createServiceCatalogItemForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:2125-2156",
    "calls": [
      "assertAdminAccess",
      "input.name.trim",
      "assertCatalogAssignments",
      "Number.isFinite",
      "GST_RATES.includes",
      "insert"
    ],
    "sql": [
      "insert( db, \"insert into service_catalog_items(name,base_rate,gst_rate,service_department_id,brand_id,car_segment_id,created_at,updated_at) values(?,?,?,?,?,?,datetime('now'),datetime('now'))\", [ name, input.base_rate, gstRate, input.service_department_id!, input.brand_id ?? null, input.car_segment_id ?? null, ], )"
    ],
    "body": "export function createServiceCatalogItemForActor(\n  db: Database,\n  actorId: number,\n  input: Pick<ServiceCatalogItem, \"name\" | \"base_rate\" | \"service_department_id\" | \"brand_id\" | \"car_segment_id\"> & {\n    gst_rate?: number;\n  },\n) {\n  assertAdminAccess(db, actorId);\n  const name = input.name.trim();\n  if (!name) throw new Error(\"Service name is required.\");\n  assertCatalogAssignments(db, input);\n  if (!Number.isFinite(input.base_rate) || input.base_rate < 0)\n    throw new Error(\"Base rate must be zero or greater.\");\n  const gstRate = input.gst_rate ?? 18;\n  if (\n    !Number.isFinite(gstRate) ||\n    (gstRate !== 0 && !GST_RATES.includes(gstRate as (typeof GST_RATES)[number]))\n  )\n    throw new Error(\"GST rate must be No GST (0%) or 5%, 9%, 12%, 18%, or 28%.\");\n  return insert(\n    db,\n    \"insert into service_catalog_items(name,base_rate,gst_rate,service_department_id,brand_id,car_segment_id,created_at,updated_at) values(?,?,?,?,?,?,datetime('now'),datetime('now'))\",\n    [\n      name,\n      input.base_rate,\n      gstRate,\n      input.service_department_id!,\n      input.brand_id ?? null,\n      input.car_segment_id ?? null,\n    ],\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "input",
        "type": "Pick<ServiceCatalogItem, \"name\" | \"base_rate\" | \"service_department_id\" | \"brand_id\" | \"car_segment_id\"> & {\n    gst_rate?: number;\n  }",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/createServiceCatalogItemForActor",
    "service": "tenant_admin/service_catalog; TX-14",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-updateServiceCatalogItemForActor",
    "name": "updateServiceCatalogItemForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:2158-2190",
    "calls": [
      "assertAdminAccess",
      "input.name.trim",
      "assertCatalogAssignments",
      "Number.isFinite",
      "GST_RATES.includes",
      "db.run"
    ],
    "sql": [
      "db.run( \"update service_catalog_items set name=?,base_rate=?,gst_rate=?,service_department_id=?,brand_id=?,car_segment_id=?,updated_at=datetime('now') where id=?\", [ name, input.base_rate, gstRate, input.service_department_id!, input.brand_id ?? null, input.car_segment_id ?? null, id, ], )"
    ],
    "body": "export function updateServiceCatalogItemForActor(\n  db: Database,\n  actorId: number,\n  id: number,\n  input: Pick<ServiceCatalogItem, \"name\" | \"base_rate\" | \"service_department_id\" | \"brand_id\" | \"car_segment_id\"> & {\n    gst_rate?: number;\n  },\n) {\n  assertAdminAccess(db, actorId);\n  const name = input.name.trim();\n  if (!name) throw new Error(\"Service name is required.\");\n  assertCatalogAssignments(db, input);\n  if (!Number.isFinite(input.base_rate) || input.base_rate < 0)\n    throw new Error(\"Base rate must be zero or greater.\");\n  const gstRate = input.gst_rate ?? 18;\n  if (\n    !Number.isFinite(gstRate) ||\n    (gstRate !== 0 && !GST_RATES.includes(gstRate as (typeof GST_RATES)[number]))\n  )\n    throw new Error(\"GST rate must be No GST (0%) or 5%, 9%, 12%, 18%, or 28%.\");\n  db.run(\n    \"update service_catalog_items set name=?,base_rate=?,gst_rate=?,service_department_id=?,brand_id=?,car_segment_id=?,updated_at=datetime('now') where id=?\",\n    [\n      name,\n      input.base_rate,\n      gstRate,\n      input.service_department_id!,\n      input.brand_id ?? null,\n      input.car_segment_id ?? null,\n      id,\n    ],\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "id",
        "type": "number",
        "optional": false
      },
      {
        "name": "input",
        "type": "Pick<ServiceCatalogItem, \"name\" | \"base_rate\" | \"service_department_id\" | \"brand_id\" | \"car_segment_id\"> & {\n    gst_rate?: number;\n  }",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/updateServiceCatalogItemForActor",
    "service": "tenant_admin/service_catalog; TX-14",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-archiveServiceCatalogItemForActor",
    "name": "archiveServiceCatalogItemForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:2199-2209",
    "calls": [
      "assertAdminAccess",
      "db.run"
    ],
    "sql": [
      "db.run( \"update service_catalog_items set archived_at=datetime('now'),archived_reason='Archived from Service Task Catalog',updated_at=datetime('now') where id=?\", [id], )"
    ],
    "body": "export function archiveServiceCatalogItemForActor(\n  db: Database,\n  actorId: number,\n  id: number,\n) {\n  assertAdminAccess(db, actorId);\n  db.run(\n    \"update service_catalog_items set archived_at=datetime('now'),archived_reason='Archived from Service Task Catalog',updated_at=datetime('now') where id=?\",\n    [id],\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "id",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/archiveServiceCatalogItemForActor",
    "service": "tenant_admin/service_catalog; TX-14",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-addJobTaskListItemForActor",
    "name": "addJobTaskListItemForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:2211-2247",
    "calls": [
      "assertTaskListMutationAccess",
      "one",
      "(catalog?.name ?? input.name ?? \"\").trim",
      "Number.isFinite",
      "GST_RATES.includes",
      "insert"
    ],
    "sql": [
      "one<ServiceCatalogItem>( db, \"select * from service_catalog_items where id=? and archived_at is null\", [input.service_catalog_item_id], )",
      "insert( db, \"insert into job_task_list_items(job_card_id,service_catalog_item_id,name,base_rate,gst_rate,done,created_at,updated_at) values(?,?,?,?,?,0,datetime('now'),datetime('now'))\", [jobId, catalog?.id ?? null, name, baseRate!, gstRate], )"
    ],
    "body": "export function addJobTaskListItemForActor(\n  db: Database,\n  jobId: number,\n  actorId: number,\n  input: {\n    service_catalog_item_id?: number;\n    name?: string;\n    base_rate?: number;\n    gst_rate?: number;\n  },\n) {\n  assertTaskListMutationAccess(db, jobId, actorId);\n  const catalog =\n    input.service_catalog_item_id == null\n      ? undefined\n      : one<ServiceCatalogItem>(\n          db,\n          \"select * from service_catalog_items where id=? and archived_at is null\",\n          [input.service_catalog_item_id],\n        );\n  const name = (catalog?.name ?? input.name ?? \"\").trim();\n  const baseRate = catalog?.base_rate ?? input.base_rate;\n  const gstRate = catalog?.gst_rate ?? input.gst_rate ?? 18;\n  if (!name) throw new Error(\"Task name is required.\");\n  if (!Number.isFinite(baseRate) || baseRate! < 0)\n    throw new Error(\"Task rate must be zero or greater.\");\n  if (\n    !Number.isFinite(gstRate) ||\n    (gstRate !== 0 && !GST_RATES.includes(gstRate as (typeof GST_RATES)[number]))\n  )\n    throw new Error(\"Task GST rate must be No GST (0%) or 5%, 9%, 12%, 18%, or 28%.\");\n  return insert(\n    db,\n    \"insert into job_task_list_items(job_card_id,service_catalog_item_id,name,base_rate,gst_rate,done,created_at,updated_at) values(?,?,?,?,?,0,datetime('now'),datetime('now'))\",\n    [jobId, catalog?.id ?? null, name, baseRate!, gstRate],\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "jobId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "input",
        "type": "{\n    service_catalog_item_id?: number;\n    name?: string;\n    base_rate?: number;\n    gst_rate?: number;\n  }",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/addJobTaskListItemForActor",
    "service": "execution/checklists; TX-11",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-updateJobTaskListItemForActor",
    "name": "updateJobTaskListItemForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:2249-2269",
    "calls": [
      "one",
      "assertTaskListMutationAccess",
      "input.name.trim",
      "Number.isFinite",
      "db.run"
    ],
    "sql": [
      "one<JobTaskListItem>( db, \"select * from job_task_list_items where id=? and archived_at is null\", [id], )",
      "db.run( \"update job_task_list_items set name=?,base_rate=?,done=?,updated_at=datetime('now') where id=?\", [name, input.base_rate, input.done ? 1 : 0, id], )"
    ],
    "body": "export function updateJobTaskListItemForActor(\n  db: Database,\n  id: number,\n  actorId: number,\n  input: Pick<JobTaskListItem, \"name\" | \"base_rate\" | \"done\">,\n) {\n  const row = one<JobTaskListItem>(\n    db,\n    \"select * from job_task_list_items where id=? and archived_at is null\",\n    [id],\n  );\n  assertTaskListMutationAccess(db, row.job_card_id, actorId);\n  const name = input.name.trim();\n  if (!name) throw new Error(\"Task name is required.\");\n  if (!Number.isFinite(input.base_rate) || input.base_rate < 0)\n    throw new Error(\"Task rate must be zero or greater.\");\n  db.run(\n    \"update job_task_list_items set name=?,base_rate=?,done=?,updated_at=datetime('now') where id=?\",\n    [name, input.base_rate, input.done ? 1 : 0, id],\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "id",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "input",
        "type": "Pick<JobTaskListItem, \"name\" | \"base_rate\" | \"done\">",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/updateJobTaskListItemForActor",
    "service": "execution/checklists; TX-11",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-archiveJobTaskListItemForActor",
    "name": "archiveJobTaskListItemForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:2271-2286",
    "calls": [
      "one",
      "assertTaskListMutationAccess",
      "db.run"
    ],
    "sql": [
      "one<JobTaskListItem>( db, \"select * from job_task_list_items where id=? and archived_at is null\", [id], )",
      "db.run( \"update job_task_list_items set archived_at=datetime('now'),archived_reason='Removed from Task List',updated_at=datetime('now') where id=?\", [id], )"
    ],
    "body": "export function archiveJobTaskListItemForActor(\n  db: Database,\n  id: number,\n  actorId: number,\n) {\n  const row = one<JobTaskListItem>(\n    db,\n    \"select * from job_task_list_items where id=? and archived_at is null\",\n    [id],\n  );\n  assertTaskListMutationAccess(db, row.job_card_id, actorId);\n  db.run(\n    \"update job_task_list_items set archived_at=datetime('now'),archived_reason='Removed from Task List',updated_at=datetime('now') where id=?\",\n    [id],\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "id",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/archiveJobTaskListItemForActor",
    "service": "execution/checklists; TX-11",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-prefillEstimateFromTaskListForActor",
    "name": "prefillEstimateFromTaskListForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:2289-2346",
    "calls": [
      "assertTaskListMutationAccess",
      "maybe",
      "db.run",
      "insert",
      "all",
      "scalar",
      "reconcileArtifactChecklist"
    ],
    "sql": [
      "maybe<Estimate>( db, \"select * from estimates where job_card_id=? and archived_at is null order by id desc limit 1\", [jobId], )",
      "db.run(\"savepoint prefill_task_list\")",
      "insert( db, \"insert into estimates(job_card_id,status,discount,gst_rate,approval_note,created_at,updated_at) values(?,'Draft',0,18,'Awaiting customer confirmation',datetime('now'),datetime('now'))\", [jobId], )",
      "all<JobTaskListItem>( db, \"select * from job_task_list_items where job_card_id=? and archived_at is null order by id\", [jobId], )",
      "scalar<number>( db, \"select count(*) from estimate_items where estimate_id=? and task_list_item_id=? and archived_at is null\", [estimateId, row.id], )",
      "insert( db, \"insert into estimate_items(estimate_id,kind,description,qty,rate,gst_type,gst_rate,task_list_item_id,created_at,updated_at) values(?,'Service',?,1,?,?,?,?,datetime('now'),datetime('now'))\", [ estimateId, row.name, row.base_rate, row.gst_rate === 0 ? \"No GST\" : \"CGST+SGST\", row.gst_rate, row.id, ], )",
      "db.run(\"release savepoint prefill_task_list\")",
      "db.run(\"rollback to savepoint prefill_task_list\")",
      "db.run(\"release savepoint prefill_task_list\")"
    ],
    "body": "export function prefillEstimateFromTaskListForActor(\n  db: Database,\n  jobId: number,\n  actorId: number,\n) {\n  assertTaskListMutationAccess(db, jobId, actorId);\n  const existing = maybe<Estimate>(\n    db,\n    \"select * from estimates where job_card_id=? and archived_at is null order by id desc limit 1\",\n    [jobId],\n  );\n  if (existing?.status === \"Approved\")\n    throw new Error(\"An approved estimate cannot be prefilled.\");\n  db.run(\"savepoint prefill_task_list\");\n  try {\n    const estimateId =\n      existing?.id ??\n      insert(\n        db,\n        \"insert into estimates(job_card_id,status,discount,gst_rate,approval_note,created_at,updated_at) values(?,'Draft',0,18,'Awaiting customer confirmation',datetime('now'),datetime('now'))\",\n        [jobId],\n      );\n    const rows = all<JobTaskListItem>(\n      db,\n      \"select * from job_task_list_items where job_card_id=? and archived_at is null order by id\",\n      [jobId],\n    );\n    for (const row of rows) {\n      if (\n        scalar<number>(\n          db,\n          \"select count(*) from estimate_items where estimate_id=? and task_list_item_id=? and archived_at is null\",\n          [estimateId, row.id],\n        )\n      )\n        continue;\n      insert(\n        db,\n        \"insert into estimate_items(estimate_id,kind,description,qty,rate,gst_type,gst_rate,task_list_item_id,created_at,updated_at) values(?,'Service',?,1,?,?,?,?,datetime('now'),datetime('now'))\",\n        [\n          estimateId,\n          row.name,\n          row.base_rate,\n          row.gst_rate === 0 ? \"No GST\" : \"CGST+SGST\",\n          row.gst_rate,\n          row.id,\n        ],\n      );\n    }\n    reconcileArtifactChecklist(db, jobId, actorId);\n    db.run(\"release savepoint prefill_task_list\");\n    return estimateId;\n  } catch (error) {\n    db.run(\"rollback to savepoint prefill_task_list\");\n    db.run(\"release savepoint prefill_task_list\");\n    throw error;\n  }\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "jobId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/prefillEstimateFromTaskListForActor",
    "service": "execution/checklists; TX-11",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-transitionJobStatusForActor",
    "name": "transitionJobStatusForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:2348-2389",
    "calls": [
      "new Date().toISOString",
      "one",
      "MAIN_STATUS_TRANSITIONS[job.main_status].includes",
      "canTransitionJobStatus",
      "maybe",
      "canCompleteWithInvoice",
      "transitionJobStatus"
    ],
    "sql": [
      "one<User>( db, \"select * from users where id=? and archived_at is null\", [actorId], )",
      "one<JobCard>( db, \"select * from job_cards where id=? and archived_at is null\", [jobId], )",
      "maybe<Invoice>( db, \"select * from invoices where job_card_id=? and voided_at is null order by id desc limit 1\", [jobId], )"
    ],
    "body": "export function transitionJobStatusForActor(\n  db: Database,\n  jobId: number,\n  actorId: number,\n  to: MainStatus,\n  note: string,\n  timestamp = new Date().toISOString(),\n) {\n  const actor = one<User>(\n    db,\n    \"select * from users where id=? and archived_at is null\",\n    [actorId],\n  );\n  const job = one<JobCard>(\n    db,\n    \"select * from job_cards where id=? and archived_at is null\",\n    [jobId],\n  );\n  if (to === \"CLOSED\")\n    throw new Error(\n      \"A completed job can only close when a valid payment is recorded.\",\n    );\n  if (!MAIN_STATUS_TRANSITIONS[job.main_status].includes(to))\n    throw new Error(`Cannot move a job card from ${job.main_status} to ${to}.`);\n  if (!canTransitionJobStatus(actor, job, to)) {\n    throw new Error(\n      to === \"CANCELLED\"\n        ? \"Only the Owner or the linked Service Advisor can cancel a job card.\"\n        : \"Only the Owner or the linked Service Advisor can change this job lifecycle.\",\n    );\n  }\n  if (to === \"COMPLETED\") {\n    const invoice = maybe<Invoice>(\n      db,\n      \"select * from invoices where job_card_id=? and voided_at is null order by id desc limit 1\",\n      [jobId],\n    );\n    if (!canCompleteWithInvoice({ invoice }))\n      throw new Error(\"Create an Invoice before completing the job.\");\n  }\n  transitionJobStatus(db, jobId, to, note, timestamp);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "jobId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "to",
        "type": "MainStatus",
        "optional": false
      },
      {
        "name": "note",
        "type": "string",
        "optional": false
      },
      {
        "name": "timestamp",
        "type": "INFERRED",
        "optional": true,
        "default": "new Date().toISOString()"
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/transitionJobStatusForActor",
    "service": "jobs/estimates; TX-02/11/12",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-saveEstimateForActor",
    "name": "saveEstimateForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:2423-2492",
    "calls": [
      "assertJobLifecycleMutationAccess",
      "Number.isFinite",
      "draft.items.forEach",
      "item.description.trim",
      "normalizeAndValidateGst",
      "db.run",
      "maybe",
      "insert",
      "draft.notes.trim",
      "createEstimateItem",
      "reconcileArtifactChecklist"
    ],
    "sql": [
      "db.run(\"savepoint save_estimate\")",
      "maybe<Estimate>( db, \"select * from estimates where job_card_id=? and archived_at is null order by id desc limit 1\", [jobId], )",
      "insert( db, \"insert into estimates(job_card_id,status,discount,gst_rate,approval_note,created_at,updated_at) values (?,'Draft',?,?,?,datetime('now'),datetime('now'))\", [jobId, draft.discount, draft.gst_rate, draft.notes.trim()], )",
      "db.run( \"update estimates set discount=?,gst_rate=?,approval_note=?,updated_at=datetime('now') where id=?\", [draft.discount, draft.gst_rate, draft.notes.trim(), estimateId], )",
      "db.run( \"update estimate_items set archived_at=datetime('now'),archived_reason='Replaced by estimate edit',updated_at=datetime('now') where estimate_id=? and archived_at is null\", [estimateId], )",
      "db.run(\"release savepoint save_estimate\")",
      "db.run(\"rollback to savepoint save_estimate\")",
      "db.run(\"release savepoint save_estimate\")"
    ],
    "body": "export function saveEstimateForActor(\n  db: Database,\n  jobId: number,\n  actorId: number,\n  draft: EstimateDraftInput,\n) {\n  assertJobLifecycleMutationAccess(db, jobId, actorId);\n  if (!Number.isFinite(draft.discount) || draft.discount < 0)\n    throw new Error(\"Discount must be zero or greater.\");\n  if (!Number.isFinite(draft.gst_rate) || draft.gst_rate < 0)\n    throw new Error(\"GST must be zero or greater.\");\n  if (draft.items.length === 0)\n    throw new Error(\"Add at least one estimate item.\");\n  draft.items.forEach((item) => {\n    if (!item.description.trim())\n      throw new Error(\"Every estimate item needs a description.\");\n    if (!Number.isFinite(item.qty) || item.qty <= 0)\n      throw new Error(\"Item quantity must be greater than zero.\");\n    if (!Number.isFinite(item.rate) || item.rate < 0)\n      throw new Error(\"Item rate must be zero or greater.\");\n    normalizeAndValidateGst(item.gst_type, item.gst_rate, draft.gst_rate);\n  });\n  db.run(\"savepoint save_estimate\");\n  try {\n    const existing = maybe<Estimate>(\n      db,\n      \"select * from estimates where job_card_id=? and archived_at is null order by id desc limit 1\",\n      [jobId],\n    );\n    const estimateId =\n      existing?.id ??\n      insert(\n        db,\n        \"insert into estimates(job_card_id,status,discount,gst_rate,approval_note,created_at,updated_at) values (?,'Draft',?,?,?,datetime('now'),datetime('now'))\",\n        [jobId, draft.discount, draft.gst_rate, draft.notes.trim()],\n      );\n    if (existing) {\n      db.run(\n        \"update estimates set discount=?,gst_rate=?,approval_note=?,updated_at=datetime('now') where id=?\",\n        [draft.discount, draft.gst_rate, draft.notes.trim(), estimateId],\n      );\n      db.run(\n        \"update estimate_items set archived_at=datetime('now'),archived_reason='Replaced by estimate edit',updated_at=datetime('now') where estimate_id=? and archived_at is null\",\n        [estimateId],\n      );\n    }\n    draft.items.forEach((item) => {\n      const tax = normalizeAndValidateGst(\n        item.gst_type,\n        item.gst_rate,\n        draft.gst_rate,\n      );\n      createEstimateItem(db, {\n        estimate_id: estimateId,\n        kind: item.kind,\n        description: item.description.trim(),\n        qty: item.qty,\n        rate: item.rate,\n        ...tax,\n      });\n    });\n    reconcileArtifactChecklist(db, jobId, actorId);\n    db.run(\"release savepoint save_estimate\");\n    return estimateId;\n  } catch (error) {\n    db.run(\"rollback to savepoint save_estimate\");\n    db.run(\"release savepoint save_estimate\");\n    throw error;\n  }\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "jobId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "draft",
        "type": "EstimateDraftInput",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/saveEstimateForActor",
    "service": "jobs/estimates; TX-02/11/12",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-updateJobCard",
    "name": "updateJobCard",
    "file": "src/db.ts",
    "span": "src/db.ts:2501-2548",
    "calls": [
      "one",
      "transitionJobStatus",
      "checklistSubStatus",
      "db.run",
      "history",
      "note?.trim"
    ],
    "sql": [
      "one<JobCard>(db, \"select * from job_cards where id=?\", [jobId])",
      "one<JobCard>(db, \"select * from job_cards where id=?\", [jobId])",
      "db.run( \"update job_cards set advisor_id=?, technician_id=?, sub_status=?, work_list=?, promised_at=?, advisor_notes=?, customer_instructions=?, internal_instructions=?, updated_at=datetime('now') where id=?\", [ payload.advisor_id ?? job.advisor_id, payload.technician_id ?? job.technician_id, sub, payload.work_list ?? job.work_list, payload.promised_at ?? job.promised_at, payload.advisor_notes ?? job.advisor_notes ?? \"\", payload.customer_instructions ?? job.customer_instructions ?? \"\", payload.internal_instructions ?? job.internal_instructions ?? \"\", jobId, ], )"
    ],
    "body": "export function updateJobCard(\n  db: Database,\n  jobId: number,\n  payload: Partial<\n    Pick<\n      JobCard,\n      | \"advisor_id\"\n      | \"technician_id\"\n      | \"main_status\"\n      | \"sub_status\"\n      | \"work_list\"\n      | \"promised_at\"\n      | \"advisor_notes\"\n      | \"customer_instructions\"\n      | \"internal_instructions\"\n    >\n  >,\n  note?: string,\n) {\n  let job = one<JobCard>(db, \"select * from job_cards where id=?\", [jobId]);\n  if (payload.main_status && payload.main_status !== job.main_status) {\n    transitionJobStatus(db, jobId, payload.main_status, note ?? \"\");\n    job = one<JobCard>(db, \"select * from job_cards where id=?\", [jobId]);\n  }\n  const sub = checklistSubStatus(db, jobId, job.sub_status);\n  db.run(\n    \"update job_cards set advisor_id=?, technician_id=?, sub_status=?, work_list=?, promised_at=?, advisor_notes=?, customer_instructions=?, internal_instructions=?, updated_at=datetime('now') where id=?\",\n    [\n      payload.advisor_id ?? job.advisor_id,\n      payload.technician_id ?? job.technician_id,\n      sub,\n      payload.work_list ?? job.work_list,\n      payload.promised_at ?? job.promised_at,\n      payload.advisor_notes ?? job.advisor_notes ?? \"\",\n      payload.customer_instructions ?? job.customer_instructions ?? \"\",\n      payload.internal_instructions ?? job.internal_instructions ?? \"\",\n      jobId,\n    ],\n  );\n  if (sub !== job.sub_status)\n    history(\n      db,\n      jobId,\n      job.main_status,\n      sub,\n      note?.trim() || \"Job card updated\",\n    );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "jobId",
        "type": "number",
        "optional": false
      },
      {
        "name": "payload",
        "type": "Partial<\n    Pick<\n      JobCard,\n      | \"advisor_id\"\n      | \"technician_id\"\n      | \"main_status\"\n      | \"sub_status\"\n      | \"work_list\"\n      | \"promised_at\"\n      | \"advisor_notes\"\n      | \"customer_instructions\"\n      | \"internal_instructions\"\n    >\n  >",
        "optional": false
      },
      {
        "name": "note",
        "type": "string",
        "optional": true
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/updateJobCardForActor",
    "service": "jobs/estimates; TX-02/11/12",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-updateJobCardForActor",
    "name": "updateJobCardForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:2550-2569",
    "calls": [
      "assertJobLifecycleMutationAccess",
      "updateJobCard"
    ],
    "sql": [],
    "body": "export function updateJobCardForActor(\n  db: Database,\n  jobId: number,\n  actorId: number,\n  payload: Partial<\n    Pick<\n      JobCard,\n      | \"advisor_id\"\n      | \"technician_id\"\n      | \"work_list\"\n      | \"promised_at\"\n      | \"advisor_notes\"\n      | \"customer_instructions\"\n      | \"internal_instructions\"\n    >\n  >,\n) {\n  assertJobLifecycleMutationAccess(db, jobId, actorId);\n  updateJobCard(db, jobId, payload);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "jobId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "payload",
        "type": "Partial<\n    Pick<\n      JobCard,\n      | \"advisor_id\"\n      | \"technician_id\"\n      | \"work_list\"\n      | \"promised_at\"\n      | \"advisor_notes\"\n      | \"customer_instructions\"\n      | \"internal_instructions\"\n    >\n  >",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/updateJobCardForActor",
    "service": "jobs/estimates; TX-02/11/12",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-saveJobDetailsForActor",
    "name": "saveJobDetailsForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:2592-2641",
    "calls": [
      "assertJobLifecycleMutationAccess",
      "db.run",
      "updateJobCard",
      "one",
      "input.engine_no.trim",
      "input.address.trim"
    ],
    "sql": [
      "db.run(\"savepoint save_job_details\")",
      "one<JobCard>(db, \"select * from job_cards where id=?\", [jobId])",
      "one<Visit>(db, \"select * from visits where id=?\", [ job.visit_id, ])",
      "db.run( \"update job_cards set service_type=?, pickup_drop=?, estimated_delivery=?, updated_at=datetime('now') where id=?\", [ input.service_type ?? job.service_type ?? \"\", input.pickup_drop ?? job.pickup_drop ?? \"\", input.estimated_delivery ?? job.estimated_delivery ?? \"\", jobId, ], )",
      "db.run( \"update visits set fuel=?, accessories=?, updated_at=datetime('now') where id=?\", [ input.fuel ?? visit.fuel, input.accessories ?? visit.accessories, visit.id, ], )",
      "db.run( \"update vehicles set engine_no=?, updated_at=datetime('now') where id=?\", [input.engine_no.trim(), visit.vehicle_id], )",
      "db.run( \"update customers set address=?, updated_at=datetime('now') where id=?\", [input.address.trim(), visit.customer_id], )",
      "db.run(\"release savepoint save_job_details\")",
      "db.run(\"rollback to savepoint save_job_details\")",
      "db.run(\"release savepoint save_job_details\")"
    ],
    "body": "export function saveJobDetailsForActor(\n  db: Database,\n  jobId: number,\n  actorId: number,\n  input: JobDetailsInput,\n) {\n  assertJobLifecycleMutationAccess(db, jobId, actorId);\n  db.run(\"savepoint save_job_details\");\n  try {\n    // Advisor assignment is established when the job is created and is not editable from job details.\n    const { advisor_id: _advisorId, ...editableInput } = input;\n    updateJobCard(db, jobId, editableInput);\n    const job = one<JobCard>(db, \"select * from job_cards where id=?\", [jobId]);\n    const visit = one<Visit>(db, \"select * from visits where id=?\", [\n      job.visit_id,\n    ]);\n    db.run(\n      \"update job_cards set service_type=?, pickup_drop=?, estimated_delivery=?, updated_at=datetime('now') where id=?\",\n      [\n        input.service_type ?? job.service_type ?? \"\",\n        input.pickup_drop ?? job.pickup_drop ?? \"\",\n        input.estimated_delivery ?? job.estimated_delivery ?? \"\",\n        jobId,\n      ],\n    );\n    db.run(\n      \"update visits set fuel=?, accessories=?, updated_at=datetime('now') where id=?\",\n      [\n        input.fuel ?? visit.fuel,\n        input.accessories ?? visit.accessories,\n        visit.id,\n      ],\n    );\n    if (input.engine_no !== undefined)\n      db.run(\n        \"update vehicles set engine_no=?, updated_at=datetime('now') where id=?\",\n        [input.engine_no.trim(), visit.vehicle_id],\n      );\n    if (input.address !== undefined)\n      db.run(\n        \"update customers set address=?, updated_at=datetime('now') where id=?\",\n        [input.address.trim(), visit.customer_id],\n      );\n    db.run(\"release savepoint save_job_details\");\n  } catch (error) {\n    db.run(\"rollback to savepoint save_job_details\");\n    db.run(\"release savepoint save_job_details\");\n    throw error;\n  }\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "jobId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "input",
        "type": "JobDetailsInput",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/saveJobDetailsForActor",
    "service": "jobs/estimates; TX-02/11/12",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-updateJobSheetForActor",
    "name": "updateJobSheetForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:2644-2651",
    "calls": [
      "saveJobDetailsForActor"
    ],
    "sql": [],
    "body": "export function updateJobSheetForActor(\n  db: Database,\n  jobId: number,\n  actorId: number,\n  input: JobSheetInput,\n) {\n  saveJobDetailsForActor(db, jobId, actorId, input);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "jobId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "input",
        "type": "JobSheetInput",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/updateJobSheetForActor",
    "service": "jobs/estimates; TX-02/11/12",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-updateEstimatedDeliveryForActor",
    "name": "updateEstimatedDeliveryForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:2654-2665",
    "calls": [
      "assertJobLifecycleMutationAccess",
      "db.run"
    ],
    "sql": [
      "db.run( \"update job_cards set estimated_delivery=?, updated_at=datetime('now') where id=?\", [estimatedDelivery, jobId], )"
    ],
    "body": "export function updateEstimatedDeliveryForActor(\n  db: Database,\n  jobId: number,\n  actorId: number,\n  estimatedDelivery: string,\n) {\n  assertJobLifecycleMutationAccess(db, jobId, actorId);\n  db.run(\n    \"update job_cards set estimated_delivery=?, updated_at=datetime('now') where id=?\",\n    [estimatedDelivery, jobId],\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "jobId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "estimatedDelivery",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/updateEstimatedDeliveryForActor",
    "service": "finance; TX-03/04/05/12; FIN-01..04",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-setDamageMarksForActor",
    "name": "setDamageMarksForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:2668-2679",
    "calls": [
      "assertJobLifecycleMutationAccess",
      "db.run",
      "serializeDamageMarks"
    ],
    "sql": [
      "db.run( \"update job_cards set damage_marks=?, damage_marks_recorded_at=datetime('now'), updated_at=datetime('now') where id=?\", [serializeDamageMarks(marks), jobId], )"
    ],
    "body": "export function setDamageMarksForActor(\n  db: Database,\n  jobId: number,\n  actorId: number,\n  marks: DamageMark[],\n) {\n  assertJobLifecycleMutationAccess(db, jobId, actorId);\n  db.run(\n    \"update job_cards set damage_marks=?, damage_marks_recorded_at=datetime('now'), updated_at=datetime('now') where id=?\",\n    [serializeDamageMarks(marks), jobId],\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "jobId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "marks",
        "type": "DamageMark[]",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/setDamageMarksForActor",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-cancelJobCard",
    "name": "cancelJobCard",
    "file": "src/db.ts",
    "span": "src/db.ts:2684-2695",
    "calls": [
      "one",
      "archive",
      "history"
    ],
    "sql": [
      "one<JobCard>(db, \"select * from job_cards where id=?\", [jobId])"
    ],
    "body": "export function cancelJobCard(db: Database, jobId: number, reason: string) {\n  const job = one<JobCard>(db, \"select * from job_cards where id=?\", [jobId]);\n  archive(db, \"job_cards\", jobId, reason || \"Cancelled\");\n  archive(db, \"visits\", job.visit_id, reason || \"Cancelled\");\n  history(\n    db,\n    jobId,\n    job.main_status,\n    job.sub_status,\n    `Cancelled: ${reason || \"No reason\"}`,\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "jobId",
        "type": "number",
        "optional": false
      },
      {
        "name": "reason",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/cancelJobCard",
    "service": "jobs/estimates; TX-02/11/12",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-archiveJobCardForActor",
    "name": "archiveJobCardForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:2697-2706",
    "calls": [
      "assertJobLifecycleMutationAccess",
      "reason.trim",
      "cancelJobCard"
    ],
    "sql": [],
    "body": "export function archiveJobCardForActor(\n  db: Database,\n  jobId: number,\n  actorId: number,\n  reason: string,\n) {\n  assertJobLifecycleMutationAccess(db, jobId, actorId);\n  if (!reason.trim()) throw new Error(\"An archive reason is required.\");\n  cancelJobCard(db, jobId, reason.trim());\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "jobId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "reason",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/archiveJobCardForActor",
    "service": "jobs/estimates; TX-02/11/12",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-cancelJobCardStatus",
    "name": "cancelJobCardStatus",
    "file": "src/db.ts",
    "span": "src/db.ts:2712-2714",
    "calls": [
      "transitionJobStatus"
    ],
    "sql": [],
    "body": "export function cancelJobCardStatus(db: Database, jobId: number, note: string) {\n  transitionJobStatus(db, jobId, \"CANCELLED\", note);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "jobId",
        "type": "number",
        "optional": false
      },
      {
        "name": "note",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/cancelJobCardStatus",
    "service": "jobs/estimates; TX-02/11/12",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-createEstimate",
    "name": "createEstimate",
    "file": "src/db.ts",
    "span": "src/db.ts:2716-2746",
    "calls": [
      "maybe",
      "insert",
      "scalar",
      "createEstimateItem",
      "reconcileArtifactChecklist"
    ],
    "sql": [
      "maybe<Estimate>( db, \"select * from estimates where job_card_id=? and archived_at is null order by id desc limit 1\", [jobId], )",
      "insert( db, \"insert into estimates(job_card_id, status, discount, gst_rate, approval_note, created_at, updated_at) values (?, ?, ?, ?, ?, datetime('now'), datetime('now'))\", [jobId, \"Draft\", 0, 18, \"Awaiting customer confirmation\"], )",
      "scalar<number>( db, \"select count(*) from estimate_items where estimate_id=? and archived_at is null\", [estimateId], )"
    ],
    "body": "export function createEstimate(db: Database, jobId: number) {\n  const existing = maybe<Estimate>(\n    db,\n    \"select * from estimates where job_card_id=? and archived_at is null order by id desc limit 1\",\n    [jobId],\n  );\n  const estimateId =\n    existing?.id ??\n    insert(\n      db,\n      \"insert into estimates(job_card_id, status, discount, gst_rate, approval_note, created_at, updated_at) values (?, ?, ?, ?, ?, datetime('now'), datetime('now'))\",\n      [jobId, \"Draft\", 0, 18, \"Awaiting customer confirmation\"],\n    );\n  if (\n    scalar<number>(\n      db,\n      \"select count(*) from estimate_items where estimate_id=? and archived_at is null\",\n      [estimateId],\n    ) === 0\n  ) {\n    createEstimateItem(db, {\n      estimate_id: estimateId,\n      kind: \"Service\",\n      description: \"Workshop labour\",\n      qty: 1,\n      rate: 5000,\n    });\n  }\n  reconcileArtifactChecklist(db, jobId);\n  return estimateId;\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "jobId",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/createEstimate",
    "service": "jobs/estimates; TX-02/11/12",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-updateEstimate",
    "name": "updateEstimate",
    "file": "src/db.ts",
    "span": "src/db.ts:2748-2769",
    "calls": [
      "one",
      "db.run",
      "reconcileArtifactChecklist"
    ],
    "sql": [
      "one<Estimate>(db, \"select * from estimates where id=?\", [ id, ])",
      "db.run( \"update estimates set status=?, discount=?, gst_rate=?, approval_note=?, updated_at=datetime('now') where id=?\", [ payload.status ?? estimate.status, payload.discount ?? estimate.discount, payload.gst_rate ?? estimate.gst_rate, payload.approval_note ?? estimate.approval_note, id, ], )"
    ],
    "body": "export function updateEstimate(\n  db: Database,\n  id: number,\n  payload: Partial<\n    Pick<Estimate, \"status\" | \"discount\" | \"gst_rate\" | \"approval_note\">\n  >,\n) {\n  const estimate = one<Estimate>(db, \"select * from estimates where id=?\", [\n    id,\n  ]);\n  db.run(\n    \"update estimates set status=?, discount=?, gst_rate=?, approval_note=?, updated_at=datetime('now') where id=?\",\n    [\n      payload.status ?? estimate.status,\n      payload.discount ?? estimate.discount,\n      payload.gst_rate ?? estimate.gst_rate,\n      payload.approval_note ?? estimate.approval_note,\n      id,\n    ],\n  );\n  reconcileArtifactChecklist(db, estimate.job_card_id);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "id",
        "type": "number",
        "optional": false
      },
      {
        "name": "payload",
        "type": "Partial<\n    Pick<Estimate, \"status\" | \"discount\" | \"gst_rate\" | \"approval_note\">\n  >",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/updateEstimate",
    "service": "jobs/estimates; TX-02/11/12",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-createEstimateItem",
    "name": "createEstimateItem",
    "file": "src/db.ts",
    "span": "src/db.ts:2771-2793",
    "calls": [
      "normalizeAndValidateGst",
      "insert"
    ],
    "sql": [
      "insert( db, \"insert into estimate_items(estimate_id, kind, description, qty, rate, gst_type, gst_rate, created_at, updated_at) values (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))\", [ payload.estimate_id, payload.kind, payload.description, payload.qty, payload.rate, tax.gst_type, tax.gst_rate, ], )"
    ],
    "body": "export function createEstimateItem(\n  db: Database,\n  payload: Omit<EstimateItem, \"id\">,\n) {\n  const tax = normalizeAndValidateGst(\n    payload.gst_type,\n    payload.gst_rate,\n    DEFAULT_GST_BY_KIND[payload.kind],\n  );\n  return insert(\n    db,\n    \"insert into estimate_items(estimate_id, kind, description, qty, rate, gst_type, gst_rate, created_at, updated_at) values (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))\",\n    [\n      payload.estimate_id,\n      payload.kind,\n      payload.description,\n      payload.qty,\n      payload.rate,\n      tax.gst_type,\n      tax.gst_rate,\n    ],\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "payload",
        "type": "Omit<EstimateItem, \"id\">",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/createEstimateItem",
    "service": "jobs/estimates; TX-02/11/12",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-updateEstimateItem",
    "name": "updateEstimateItem",
    "file": "src/db.ts",
    "span": "src/db.ts:2795-2817",
    "calls": [
      "normalizeAndValidateGst",
      "db.run"
    ],
    "sql": [
      "db.run( \"update estimate_items set kind=?, description=?, qty=?, rate=?, gst_type=?, gst_rate=?, updated_at=datetime('now') where id=?\", [ payload.kind, payload.description, payload.qty, payload.rate, tax.gst_type, tax.gst_rate, id, ], )"
    ],
    "body": "export function updateEstimateItem(\n  db: Database,\n  id: number,\n  payload: Omit<EstimateItem, \"id\">,\n) {\n  const tax = normalizeAndValidateGst(\n    payload.gst_type,\n    payload.gst_rate,\n    DEFAULT_GST_BY_KIND[payload.kind],\n  );\n  db.run(\n    \"update estimate_items set kind=?, description=?, qty=?, rate=?, gst_type=?, gst_rate=?, updated_at=datetime('now') where id=?\",\n    [\n      payload.kind,\n      payload.description,\n      payload.qty,\n      payload.rate,\n      tax.gst_type,\n      tax.gst_rate,\n      id,\n    ],\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "id",
        "type": "number",
        "optional": false
      },
      {
        "name": "payload",
        "type": "Omit<EstimateItem, \"id\">",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/updateEstimateItem",
    "service": "jobs/estimates; TX-02/11/12",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-archiveEstimateItem",
    "name": "archiveEstimateItem",
    "file": "src/db.ts",
    "span": "src/db.ts:2819-2821",
    "calls": [
      "archive"
    ],
    "sql": [],
    "body": "export function archiveEstimateItem(db: Database, id: number, reason: string) {\n  archive(db, \"estimate_items\", id, reason);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "id",
        "type": "number",
        "optional": false
      },
      {
        "name": "reason",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/archiveEstimateItem",
    "service": "jobs/estimates; TX-02/11/12",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-approveEstimateForActor",
    "name": "approveEstimateForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:2824-2845",
    "calls": [
      "assertJobLifecycleMutationAccess",
      "maybe",
      "note.trim",
      "updateEstimate",
      "auditEvidence"
    ],
    "sql": [
      "maybe<Estimate>( db, \"select * from estimates where job_card_id=? and archived_at is null order by id desc limit 1\", [jobId], )"
    ],
    "body": "export function approveEstimateForActor(\n  db: Database,\n  jobId: number,\n  actorId: number,\n  note: string,\n) {\n  assertJobLifecycleMutationAccess(db, jobId, actorId);\n  const estimate = maybe<Estimate>(\n    db,\n    \"select * from estimates where job_card_id=? and archived_at is null order by id desc limit 1\",\n    [jobId],\n  );\n  if (!estimate) throw new Error(\"Generate the Estimate before approving it.\");\n  if (estimate.status === \"Approved\")\n    throw new Error(\"The Estimate is already approved.\");\n  if (!note.trim()) throw new Error(\"An approval note is required.\");\n  updateEstimate(db, estimate.id, {\n    status: \"Approved\",\n    approval_note: note.trim(),\n  });\n  auditEvidence(db, jobId, `Estimate approved: ${note.trim()}`);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "jobId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "note",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/approveEstimateForActor",
    "service": "jobs/estimates; TX-02/11/12",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-approveEstimate",
    "name": "approveEstimate",
    "file": "src/db.ts",
    "span": "src/db.ts:2847-2872",
    "calls": [
      "createEstimate",
      "updateEstimate",
      "scalar",
      "createMaterialRequest",
      "reconcileArtifactChecklist"
    ],
    "sql": [
      "scalar<number>( db, \"select count(*) from material_requests where job_card_id=? and archived_at is null\", [jobId], )"
    ],
    "body": "export function approveEstimate(\n  db: Database,\n  jobId: number,\n  note = \"Customer approved\",\n) {\n  const estimateId = createEstimate(db, jobId);\n  updateEstimate(db, estimateId, { status: \"Approved\", approval_note: note });\n  if (\n    scalar<number>(\n      db,\n      \"select count(*) from material_requests where job_card_id=? and archived_at is null\",\n      [jobId],\n    ) === 0\n  ) {\n    createMaterialRequest(db, {\n      job_card_id: jobId,\n      item_id: 1,\n      requested_qty: 6,\n      issued_qty: 0,\n      used_qty: 0,\n      returned_qty: 0,\n      wasted_qty: 0,\n    });\n  }\n  reconcileArtifactChecklist(db, jobId);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "jobId",
        "type": "number",
        "optional": false
      },
      {
        "name": "note",
        "type": "INFERRED",
        "optional": true,
        "default": "\"Customer approved\""
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/approveEstimateForActor",
    "service": "jobs/estimates; TX-02/11/12",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-createMaterialRequest",
    "name": "createMaterialRequest",
    "file": "src/db.ts",
    "span": "src/db.ts:2874-2901",
    "calls": [
      "approvalBlocksMaterialOperations",
      "materialApprovalForJob",
      "insert",
      "reconcileArtifactChecklist"
    ],
    "sql": [
      "insert( db, \"insert into material_requests(job_card_id, item_id, requested_qty, issued_qty, used_qty, returned_qty, wasted_qty, created_at, updated_at) values (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))\", [ payload.job_card_id, payload.item_id, payload.requested_qty, payload.issued_qty, payload.used_qty, payload.returned_qty, payload.wasted_qty, ], )"
    ],
    "body": "export function createMaterialRequest(\n  db: Database,\n  payload: Omit<MaterialRequest, \"id\">,\n) {\n  if (\n    approvalBlocksMaterialOperations(\n      materialApprovalForJob(db, payload.job_card_id),\n    )\n  )\n    throw new Error(\n      \"Material activity is frozen while job approval is pending or rejected.\",\n    );\n  const id = insert(\n    db,\n    \"insert into material_requests(job_card_id, item_id, requested_qty, issued_qty, used_qty, returned_qty, wasted_qty, created_at, updated_at) values (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))\",\n    [\n      payload.job_card_id,\n      payload.item_id,\n      payload.requested_qty,\n      payload.issued_qty,\n      payload.used_qty,\n      payload.returned_qty,\n      payload.wasted_qty,\n    ],\n  );\n  reconcileArtifactChecklist(db, payload.job_card_id);\n  return id;\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "payload",
        "type": "Omit<MaterialRequest, \"id\">",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/createMaterialRequest",
    "service": "materials/inventory; TX-06/07/10",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-updateMaterialRequest",
    "name": "updateMaterialRequest",
    "file": "src/db.ts",
    "span": "src/db.ts:2903-2933",
    "calls": [
      "one",
      "approvalBlocksMaterialOperations",
      "materialApprovalForJob",
      "db.run"
    ],
    "sql": [
      "one<MaterialRequest>( db, \"select * from material_requests where id=?\", [id], )",
      "db.run( \"update material_requests set item_id=?, requested_qty=?, issued_qty=?, used_qty=?, returned_qty=?, wasted_qty=?, updated_at=datetime('now') where id=?\", [ payload.item_id, payload.requested_qty, payload.issued_qty, payload.used_qty, payload.returned_qty, payload.wasted_qty, id, ], )"
    ],
    "body": "export function updateMaterialRequest(\n  db: Database,\n  id: number,\n  payload: Omit<MaterialRequest, \"id\">,\n) {\n  const current = one<MaterialRequest>(\n    db,\n    \"select * from material_requests where id=?\",\n    [id],\n  );\n  if (\n    approvalBlocksMaterialOperations(\n      materialApprovalForJob(db, current.job_card_id),\n    )\n  )\n    throw new Error(\n      \"Material activity is frozen while job approval is pending or rejected.\",\n    );\n  db.run(\n    \"update material_requests set item_id=?, requested_qty=?, issued_qty=?, used_qty=?, returned_qty=?, wasted_qty=?, updated_at=datetime('now') where id=?\",\n    [\n      payload.item_id,\n      payload.requested_qty,\n      payload.issued_qty,\n      payload.used_qty,\n      payload.returned_qty,\n      payload.wasted_qty,\n      id,\n    ],\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "id",
        "type": "number",
        "optional": false
      },
      {
        "name": "payload",
        "type": "Omit<MaterialRequest, \"id\">",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/updateMaterialRequest",
    "service": "materials/inventory; TX-06/07/10",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-archiveMaterialRequest",
    "name": "archiveMaterialRequest",
    "file": "src/db.ts",
    "span": "src/db.ts:2935-2954",
    "calls": [
      "one",
      "approvalBlocksMaterialOperations",
      "materialApprovalForJob",
      "archive"
    ],
    "sql": [
      "one<MaterialRequest>( db, \"select * from material_requests where id=?\", [id], )"
    ],
    "body": "export function archiveMaterialRequest(\n  db: Database,\n  id: number,\n  reason: string,\n) {\n  const current = one<MaterialRequest>(\n    db,\n    \"select * from material_requests where id=?\",\n    [id],\n  );\n  if (\n    approvalBlocksMaterialOperations(\n      materialApprovalForJob(db, current.job_card_id),\n    )\n  )\n    throw new Error(\n      \"Material activity is frozen while job approval is pending or rejected.\",\n    );\n  archive(db, \"material_requests\", id, reason);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "id",
        "type": "number",
        "optional": false
      },
      {
        "name": "reason",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/archiveMaterialRequest",
    "service": "materials/inventory; TX-06/07/10",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-createLocalPurchase",
    "name": "createLocalPurchase",
    "file": "src/db.ts",
    "span": "src/db.ts:2983-2999",
    "calls": [
      "assertLocalPurchaseInput",
      "insert",
      "payload.item_description.trim",
      "payload.unit.trim",
      "payload.vendor.trim",
      "payload.bill_reference.trim",
      "payload.note?.trim"
    ],
    "sql": [
      "insert( db, \"insert into local_purchases(job_card_id,item_description,quantity,unit,unit_cost,vendor,bill_reference,note,created_at,updated_at) values(?,?,?,?,?,?,?,?,datetime('now'),datetime('now'))\", [ payload.job_card_id, payload.item_description.trim(), payload.quantity, payload.unit.trim(), payload.unit_cost, payload.vendor.trim(), payload.bill_reference.trim(), payload.note?.trim() ?? \"\", ], )"
    ],
    "body": "export function createLocalPurchase(db: Database, payload: LocalPurchaseInput) {\n  assertLocalPurchaseInput(db, payload);\n  return insert(\n    db,\n    \"insert into local_purchases(job_card_id,item_description,quantity,unit,unit_cost,vendor,bill_reference,note,created_at,updated_at) values(?,?,?,?,?,?,?,?,datetime('now'),datetime('now'))\",\n    [\n      payload.job_card_id,\n      payload.item_description.trim(),\n      payload.quantity,\n      payload.unit.trim(),\n      payload.unit_cost,\n      payload.vendor.trim(),\n      payload.bill_reference.trim(),\n      payload.note?.trim() ?? \"\",\n    ],\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "payload",
        "type": "LocalPurchaseInput",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/createLocalPurchase",
    "service": "procurement/inventory; TX-08/09/10",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-updateLocalPurchase",
    "name": "updateLocalPurchase",
    "file": "src/db.ts",
    "span": "src/db.ts:3002-3022",
    "calls": [
      "assertLocalPurchaseInput",
      "db.run",
      "payload.item_description.trim",
      "payload.unit.trim",
      "payload.vendor.trim",
      "payload.bill_reference.trim",
      "payload.note?.trim"
    ],
    "sql": [
      "db.run( \"update local_purchases set job_card_id=?,item_description=?,quantity=?,unit=?,unit_cost=?,vendor=?,bill_reference=?,note=?,updated_at=datetime('now') where id=? and archived_at is null\", [ payload.job_card_id, payload.item_description.trim(), payload.quantity, payload.unit.trim(), payload.unit_cost, payload.vendor.trim(), payload.bill_reference.trim(), payload.note?.trim() ?? \"\", id, ], )"
    ],
    "body": "export function updateLocalPurchase(\n  db: Database,\n  id: number,\n  payload: LocalPurchaseInput,\n) {\n  assertLocalPurchaseInput(db, payload);\n  db.run(\n    \"update local_purchases set job_card_id=?,item_description=?,quantity=?,unit=?,unit_cost=?,vendor=?,bill_reference=?,note=?,updated_at=datetime('now') where id=? and archived_at is null\",\n    [\n      payload.job_card_id,\n      payload.item_description.trim(),\n      payload.quantity,\n      payload.unit.trim(),\n      payload.unit_cost,\n      payload.vendor.trim(),\n      payload.bill_reference.trim(),\n      payload.note?.trim() ?? \"\",\n      id,\n    ],\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "id",
        "type": "number",
        "optional": false
      },
      {
        "name": "payload",
        "type": "LocalPurchaseInput",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/updateLocalPurchase",
    "service": "procurement/inventory; TX-08/09/10",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-archiveLocalPurchase",
    "name": "archiveLocalPurchase",
    "file": "src/db.ts",
    "span": "src/db.ts:3024-3026",
    "calls": [
      "archive"
    ],
    "sql": [],
    "body": "export function archiveLocalPurchase(db: Database, id: number, reason: string) {\n  archive(db, \"local_purchases\", id, reason);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "id",
        "type": "number",
        "optional": false
      },
      {
        "name": "reason",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/archiveLocalPurchase",
    "service": "procurement/inventory; TX-08/09/10",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-createMaterialPurchaseRequestForActor",
    "name": "createMaterialPurchaseRequestForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:3045-3061",
    "calls": [
      "assertMaterialManager",
      "input.item_name.trim",
      "input.unit.trim",
      "Number.isFinite",
      "insert"
    ],
    "sql": [
      "insert( db, \"insert into material_purchase_requests(job_card_id,item_name,quantity,unit,status,created_at,updated_at) values(?,?,?,?, 'Pending',datetime('now'),datetime('now'))\", [jobId, input.item_name.trim(), input.quantity, input.unit.trim()], )"
    ],
    "body": "export function createMaterialPurchaseRequestForActor(\n  db: Database,\n  jobId: number,\n  actorId: number,\n  input: MaterialPurchaseRequestInput,\n) {\n  assertMaterialManager(db, jobId, actorId);\n  if (!input.item_name.trim()) throw new Error(\"Item name is required.\");\n  if (!input.unit.trim()) throw new Error(\"Unit is required.\");\n  if (!Number.isFinite(input.quantity) || input.quantity <= 0)\n    throw new Error(\"Requested quantity must be greater than zero.\");\n  return insert(\n    db,\n    \"insert into material_purchase_requests(job_card_id,item_name,quantity,unit,status,created_at,updated_at) values(?,?,?,?, 'Pending',datetime('now'),datetime('now'))\",\n    [jobId, input.item_name.trim(), input.quantity, input.unit.trim()],\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "jobId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "input",
        "type": "MaterialPurchaseRequestInput",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/createMaterialPurchaseRequestForActor",
    "service": "procurement/inventory; TX-08/09/10",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-purchaseStockAndIssueForActor",
    "name": "purchaseStockAndIssueForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:3068-3081",
    "calls": [],
    "sql": [],
    "body": "export function purchaseStockAndIssueForActor(\n  db: Database,\n  requestId: number,\n  actorId: number,\n  input: PurchaseStockAndIssueInput,\n) {\n  void db;\n  void requestId;\n  void actorId;\n  void input;\n  throw new Error(\n    \"Direct purchase, stock and issue is unavailable. Create a Purchase Request and wait for PO closure.\",\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "requestId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "input",
        "type": "PurchaseStockAndIssueInput",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/purchaseStockAndIssueForActor",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-createSupplierForActor",
    "name": "createSupplierForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:3145-3165",
    "calls": [
      "assertPurchaseActor",
      "assertSupplierInput",
      "insert",
      "input.name.trim",
      "input.contact_name?.trim",
      "input.phone?.trim",
      "input.email?.trim",
      "input.gstin?.trim"
    ],
    "sql": [
      "insert( db, \"insert into suppliers(name,contact_name,phone,email,gstin,status,created_by,created_at,updated_at) values(?,?,?,?,?,?,?,datetime('now'),datetime('now'))\", [ input.name.trim(), input.contact_name?.trim() ?? \"\", input.phone?.trim() ?? \"\", input.email?.trim() ?? \"\", input.gstin?.trim() ?? \"\", input.status ?? \"Active\", actorId, ], )"
    ],
    "body": "export function createSupplierForActor(\n  db: Database,\n  actorId: number,\n  input: SupplierInput,\n) {\n  assertPurchaseActor(db, actorId, true);\n  assertSupplierInput(input);\n  return insert(\n    db,\n    \"insert into suppliers(name,contact_name,phone,email,gstin,status,created_by,created_at,updated_at) values(?,?,?,?,?,?,?,datetime('now'),datetime('now'))\",\n    [\n      input.name.trim(),\n      input.contact_name?.trim() ?? \"\",\n      input.phone?.trim() ?? \"\",\n      input.email?.trim() ?? \"\",\n      input.gstin?.trim() ?? \"\",\n      input.status ?? \"Active\",\n      actorId,\n    ],\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "input",
        "type": "SupplierInput",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/createSupplierForActor",
    "service": "procurement/inventory; TX-08/09/10",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-updateSupplierForActor",
    "name": "updateSupplierForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:3167-3188",
    "calls": [
      "assertPurchaseActor",
      "assertSupplierInput",
      "one",
      "db.run",
      "input.name.trim",
      "input.contact_name?.trim",
      "input.phone?.trim",
      "input.email?.trim",
      "input.gstin?.trim"
    ],
    "sql": [
      "one<Supplier>(db, \"select * from suppliers where id=?\", [id])",
      "db.run( \"update suppliers set name=?,contact_name=?,phone=?,email=?,gstin=?,status=?,updated_at=datetime('now') where id=?\", [ input.name.trim(), input.contact_name?.trim() ?? \"\", input.phone?.trim() ?? \"\", input.email?.trim() ?? \"\", input.gstin?.trim() ?? \"\", input.status ?? \"Active\", id, ], )"
    ],
    "body": "export function updateSupplierForActor(\n  db: Database,\n  id: number,\n  actorId: number,\n  input: SupplierInput,\n) {\n  assertPurchaseActor(db, actorId, true);\n  assertSupplierInput(input);\n  one<Supplier>(db, \"select * from suppliers where id=?\", [id]);\n  db.run(\n    \"update suppliers set name=?,contact_name=?,phone=?,email=?,gstin=?,status=?,updated_at=datetime('now') where id=?\",\n    [\n      input.name.trim(),\n      input.contact_name?.trim() ?? \"\",\n      input.phone?.trim() ?? \"\",\n      input.email?.trim() ?? \"\",\n      input.gstin?.trim() ?? \"\",\n      input.status ?? \"Active\",\n      id,\n    ],\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "id",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "input",
        "type": "SupplierInput",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/updateSupplierForActor",
    "service": "procurement/inventory; TX-08/09/10",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-archiveSupplierForActor",
    "name": "archiveSupplierForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:3190-3200",
    "calls": [
      "assertPurchaseActor",
      "db.run"
    ],
    "sql": [
      "db.run( \"update suppliers set status='Archived',updated_at=datetime('now') where id=?\", [id], )"
    ],
    "body": "export function archiveSupplierForActor(\n  db: Database,\n  id: number,\n  actorId: number,\n) {\n  assertPurchaseActor(db, actorId, true);\n  db.run(\n    \"update suppliers set status='Archived',updated_at=datetime('now') where id=?\",\n    [id],\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "id",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/archiveSupplierForActor",
    "service": "procurement/inventory; TX-08/09/10",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-createInwardPurchaseDraft",
    "name": "createInwardPurchaseDraft",
    "file": "src/db.ts",
    "span": "src/db.ts:3321-3342",
    "calls": [
      "assertPurchaseActor",
      "insert",
      "input.supplier_invoice_no?.trim",
      "input.po_number?.trim",
      "replacePurchaseLines",
      "addPurchaseAttachments"
    ],
    "sql": [
      "insert( db, \"insert into inward_purchases(supplier_id,supplier_invoice_no,invoice_date,po_number,status,subtotal,discount_total,gst_total,total,created_by,created_at,updated_at) values(?,?,?,?, 'Draft',0,0,0,0,?,datetime('now'),datetime('now'))\", [ input.supplier_id ?? null, input.supplier_invoice_no?.trim() ?? \"\", input.invoice_date ?? \"\", input.po_number?.trim() ?? \"\", actorId, ], )"
    ],
    "body": "export function createInwardPurchaseDraft(\n  db: Database,\n  actorId: number,\n  input: InwardPurchaseDraftInput = {},\n) {\n  assertPurchaseActor(db, actorId);\n  const id = insert(\n    db,\n    \"insert into inward_purchases(supplier_id,supplier_invoice_no,invoice_date,po_number,status,subtotal,discount_total,gst_total,total,created_by,created_at,updated_at) values(?,?,?,?, 'Draft',0,0,0,0,?,datetime('now'),datetime('now'))\",\n    [\n      input.supplier_id ?? null,\n      input.supplier_invoice_no?.trim() ?? \"\",\n      input.invoice_date ?? \"\",\n      input.po_number?.trim() ?? \"\",\n      actorId,\n    ],\n  );\n  if (input.lines?.length) replacePurchaseLines(db, id, input.lines);\n  if (input.attachments?.length)\n    addPurchaseAttachments(db, id, actorId, input.attachments);\n  return id;\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "input",
        "type": "InwardPurchaseDraftInput",
        "optional": true,
        "default": "{}"
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/createInwardPurchaseDraft",
    "service": "procurement/inventory; TX-08/09/10",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-updateInwardPurchaseDraftForActor",
    "name": "updateInwardPurchaseDraftForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:3344-3378",
    "calls": [
      "assertPurchaseActor",
      "one",
      "db.run",
      "input.supplier_invoice_no?.trim",
      "input.po_number?.trim",
      "replacePurchaseLines",
      "addPurchaseAttachments"
    ],
    "sql": [
      "one<InwardPurchase>( db, \"select * from inward_purchases where id=?\", [purchaseId], )",
      "one<User>(db, \"select * from users where id=?\", [actorId])",
      "db.run( \"update inward_purchases set supplier_id=?,supplier_invoice_no=?,invoice_date=?,po_number=?,updated_at=datetime('now') where id=?\", [ input.supplier_id ?? null, input.supplier_invoice_no?.trim() ?? \"\", input.invoice_date ?? \"\", input.po_number?.trim() ?? \"\", purchaseId, ], )"
    ],
    "body": "export function updateInwardPurchaseDraftForActor(\n  db: Database,\n  purchaseId: number,\n  actorId: number,\n  input: InwardPurchaseDraftInput,\n) {\n  assertPurchaseActor(db, actorId);\n  const purchase = one<InwardPurchase>(\n    db,\n    \"select * from inward_purchases where id=?\",\n    [purchaseId],\n  );\n  if (purchase.status !== \"Draft\")\n    throw new Error(\n      \"Submitted purchases cannot be edited. Create an Admin revision instead.\",\n    );\n  if (\n    purchase.created_by !== actorId &&\n    one<User>(db, \"select * from users where id=?\", [actorId]).role !== \"admin\"\n  )\n    throw new Error(\"Only the draft creator or Admin can edit this draft.\");\n  db.run(\n    \"update inward_purchases set supplier_id=?,supplier_invoice_no=?,invoice_date=?,po_number=?,updated_at=datetime('now') where id=?\",\n    [\n      input.supplier_id ?? null,\n      input.supplier_invoice_no?.trim() ?? \"\",\n      input.invoice_date ?? \"\",\n      input.po_number?.trim() ?? \"\",\n      purchaseId,\n    ],\n  );\n  if (input.lines) replacePurchaseLines(db, purchaseId, input.lines);\n  if (input.attachments?.length)\n    addPurchaseAttachments(db, purchaseId, actorId, input.attachments);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "purchaseId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "input",
        "type": "InwardPurchaseDraftInput",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/updateInwardPurchaseDraftForActor",
    "service": "procurement/inventory; TX-08/09/10",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-sendInwardPurchaseForPoApprovalForActor",
    "name": "sendInwardPurchaseForPoApprovalForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:3447-3531",
    "calls": [
      "assertPurchaseActor",
      "db.run",
      "one",
      "poSubmissionValidation",
      "purchase.po_number?.trim",
      "insert",
      "new Date().toISOString().slice",
      "new Date().toISOString",
      "totalsForPurchaseLine"
    ],
    "sql": [
      "db.run(\"begin immediate transaction\")",
      "one<InwardPurchase>( db, \"select * from inward_purchases where id=?\", [purchaseId], )",
      "one<User>(db, \"select * from users where id=?\", [actorId])",
      "insert( db, \"insert into purchase_orders(supplier_id,po_number,order_date,notes,status,created_by,created_at,updated_at) values(?,?,?,?, 'Draft',?,datetime('now'),datetime('now'))\", [ purchase.supplier_id, poNumber, new Date().toISOString().slice(0, 10), `Linked inward purchase #${purchaseId}`, actorId, ], )",
      "insert( db, \"insert into purchase_order_lines(purchase_order_id,item_id,ordered_qty,unit_cost,discount,gst_rate,subtotal,gst_amount,total) values(?,?,?,?,?,?,?,?,?)\", [ orderId, line.item_id, values.qty, values.unitCost, values.discount, values.gstRate, values.subtotal, values.gstAmount, values.total, ], )",
      "db.run( \"update inward_purchase_lines set purchase_order_line_id=? where id=?\", [poLineId, line.id], )",
      "db.run( \"update purchase_orders set subtotal=?,discount_total=?,gst_total=?,total=? where id=?\", [ purchase.subtotal, purchase.discount_total, purchase.gst_total, purchase.total, orderId, ], )",
      "db.run( \"update inward_purchases set po_number=?,purchase_order_id=?,status='Awaiting PO Approval',updated_at=datetime('now') where id=?\", [poNumber, orderId, purchaseId], )",
      "insert( db, \"insert into inward_purchase_events(purchase_id,kind,actor_id,at,note) values(?,?,?,datetime('now'),?)\", [purchaseId, \"sent-for-po\", actorId, `Created PO ${poNumber}`], )",
      "db.run(\"commit\")",
      "db.run(\"rollback\")"
    ],
    "body": "export function sendInwardPurchaseForPoApprovalForActor(\n  db: Database,\n  purchaseId: number,\n  actorId: number,\n) {\n  assertPurchaseActor(db, actorId);\n  db.run(\"begin immediate transaction\");\n  try {\n    const purchase = one<InwardPurchase>(\n      db,\n      \"select * from inward_purchases where id=?\",\n      [purchaseId],\n    );\n    if (purchase.status === \"Awaiting PO Approval\") return purchaseId;\n    if (purchase.status !== \"Draft\")\n      throw new Error(\"Only draft purchases can be sent for PO approval.\");\n    if (\n      purchase.created_by !== actorId &&\n      one<User>(db, \"select * from users where id=?\", [actorId]).role !==\n        \"admin\"\n    )\n      throw new Error(\n        \"Only the draft creator or Admin can send this purchase.\",\n      );\n    const lines = poSubmissionValidation(db, purchase);\n    const poNumber = purchase.po_number?.trim() || `PO-INW-${purchaseId}`;\n    const orderId = insert(\n      db,\n      \"insert into purchase_orders(supplier_id,po_number,order_date,notes,status,created_by,created_at,updated_at) values(?,?,?,?, 'Draft',?,datetime('now'),datetime('now'))\",\n      [\n        purchase.supplier_id,\n        poNumber,\n        new Date().toISOString().slice(0, 10),\n        `Linked inward purchase #${purchaseId}`,\n        actorId,\n      ],\n    );\n    for (const line of lines) {\n      const values = totalsForPurchaseLine(line);\n      const poLineId = insert(\n        db,\n        \"insert into purchase_order_lines(purchase_order_id,item_id,ordered_qty,unit_cost,discount,gst_rate,subtotal,gst_amount,total) values(?,?,?,?,?,?,?,?,?)\",\n        [\n          orderId,\n          line.item_id,\n          values.qty,\n          values.unitCost,\n          values.discount,\n          values.gstRate,\n          values.subtotal,\n          values.gstAmount,\n          values.total,\n        ],\n      );\n      db.run(\n        \"update inward_purchase_lines set purchase_order_line_id=? where id=?\",\n        [poLineId, line.id],\n      );\n    }\n    db.run(\n      \"update purchase_orders set subtotal=?,discount_total=?,gst_total=?,total=? where id=?\",\n      [\n        purchase.subtotal,\n        purchase.discount_total,\n        purchase.gst_total,\n        purchase.total,\n        orderId,\n      ],\n    );\n    db.run(\n      \"update inward_purchases set po_number=?,purchase_order_id=?,status='Awaiting PO Approval',updated_at=datetime('now') where id=?\",\n      [poNumber, orderId, purchaseId],\n    );\n    insert(\n      db,\n      \"insert into inward_purchase_events(purchase_id,kind,actor_id,at,note) values(?,?,?,datetime('now'),?)\",\n      [purchaseId, \"sent-for-po\", actorId, `Created PO ${poNumber}`],\n    );\n    db.run(\"commit\");\n    return purchaseId;\n  } catch (error) {\n    db.run(\"rollback\");\n    throw error;\n  }\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "purchaseId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/sendInwardPurchaseForPoApprovalForActor",
    "service": "procurement/inventory; TX-08/09/10",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-approveInwardPurchaseForActor",
    "name": "approveInwardPurchaseForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:3533-3571",
    "calls": [
      "assertPurchaseActor",
      "db.run",
      "one",
      "insert"
    ],
    "sql": [
      "db.run(\"begin immediate transaction\")",
      "one<InwardPurchase>( db, \"select * from inward_purchases where id=?\", [purchaseId], )",
      "db.run( \"update purchase_orders set status='Sent',updated_at=datetime('now') where id=? and status='Draft'\", [purchase.purchase_order_id], )",
      "db.run( \"update inward_purchases set status='Approved',approved_by=?,approved_at=datetime('now'),updated_at=datetime('now') where id=?\", [actorId, purchaseId], )",
      "insert( db, \"insert into inward_purchase_events(purchase_id,kind,actor_id,at,note) values(?,?,?,datetime('now'),?)\", [purchaseId, \"approved\", actorId, \"PO authorized and sent\"], )",
      "db.run(\"commit\")",
      "db.run(\"rollback\")"
    ],
    "body": "export function approveInwardPurchaseForActor(\n  db: Database,\n  purchaseId: number,\n  actorId: number,\n) {\n  assertPurchaseActor(db, actorId, true);\n  db.run(\"begin immediate transaction\");\n  try {\n    const purchase = one<InwardPurchase>(\n      db,\n      \"select * from inward_purchases where id=?\",\n      [purchaseId],\n    );\n    if (purchase.status === \"Approved\") return purchaseId;\n    if (\n      purchase.status !== \"Awaiting PO Approval\" ||\n      !purchase.purchase_order_id\n    )\n      throw new Error(\"Only purchases awaiting PO approval can be approved.\");\n    db.run(\n      \"update purchase_orders set status='Sent',updated_at=datetime('now') where id=? and status='Draft'\",\n      [purchase.purchase_order_id],\n    );\n    db.run(\n      \"update inward_purchases set status='Approved',approved_by=?,approved_at=datetime('now'),updated_at=datetime('now') where id=?\",\n      [actorId, purchaseId],\n    );\n    insert(\n      db,\n      \"insert into inward_purchase_events(purchase_id,kind,actor_id,at,note) values(?,?,?,datetime('now'),?)\",\n      [purchaseId, \"approved\", actorId, \"PO authorized and sent\"],\n    );\n    db.run(\"commit\");\n    return purchaseId;\n  } catch (error) {\n    db.run(\"rollback\");\n    throw error;\n  }\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "purchaseId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/approveInwardPurchaseForActor",
    "service": "procurement/inventory; TX-08/09/10",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-receiveAndPostInwardPurchaseForActor",
    "name": "receiveAndPostInwardPurchaseForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:3573-3725",
    "calls": [
      "assertPurchaseActor",
      "db.run",
      "one",
      "input.supplier_invoice_no?.trim",
      "all",
      "current.map",
      "byPoLine.get",
      "current.find",
      "matchedPoLines.has",
      "matchedPoLines.add",
      "assertPurchaseLine",
      "addPurchaseAttachments",
      "submitPurchaseValidation",
      "insert",
      "movement",
      "reconcilePurchaseOrder"
    ],
    "sql": [
      "db.run(\"begin immediate transaction\")",
      "one<InwardPurchase>( db, \"select * from inward_purchases where id=?\", [purchaseId], )",
      "db.run( \"update inward_purchases set supplier_invoice_no=?,invoice_date=?,updated_at=datetime('now') where id=?\", [ input.supplier_invoice_no?.trim() ?? purchase.supplier_invoice_no, input.invoice_date ?? purchase.invoice_date, purchaseId, ], )",
      "all<InwardPurchaseLine>( db, \"select * from inward_purchase_lines where purchase_id=?\", [purchaseId], )",
      "db.run( \"update inward_purchase_lines set received_qty=?,unit_cost=?,discount=?,gst_rate=?,subtotal=?,gst_amount=?,total=? where id=?\", [ values.qty, values.unitCost, values.discount, values.gstRate, values.subtotal, values.gstAmount, values.total, target.id, ], )",
      "one<InwardPurchase>( db, \"select * from inward_purchases where id=?\", [purchaseId], )",
      "one<PurchaseOrderLine>( db, \"select * from purchase_order_lines where id=?\", [line.purchase_order_line_id], )",
      "insert( db, \"insert into stock_ledger(job_card_id,material_row_id,item_id,qty,type,by_user,at,note,inward_purchase_line_id) values(0,0,?,-?,'inward',?,datetime('now'),?,?)\", [ line.item_id, line.received_qty, actorId, `Inward receipt #${purchaseId} / ${fresh.supplier_invoice_no}`, line.id, ], )",
      "insert( db, \"insert into stock_inwards(item_id,qty,note,purchase_order_id,purchase_order_line_id,ledger_id,received_by,received_at) values(?,?,?,?,?,?,?,datetime('now'))\", [ line.item_id, line.received_qty, `Inward receipt #${purchaseId}`, fresh.purchase_order_id, line.purchase_order_line_id, ledgerId, actorId, ], )",
      "db.run( \"update inward_purchases set status='Received',submitted_by=?,submitted_at=datetime('now'),updated_at=datetime('now') where id=?\", [actorId, purchaseId], )",
      "insert( db, \"insert into inward_purchase_events(purchase_id,kind,actor_id,at,note) values(?,?,?,datetime('now'),?)\", [purchaseId, \"received\", actorId, \"Posted linked PO receipt\"], )",
      "db.run(\"commit\")",
      "db.run(\"rollback\")"
    ],
    "body": "export function receiveAndPostInwardPurchaseForActor(\n  db: Database,\n  purchaseId: number,\n  actorId: number,\n  input: InwardPurchaseDraftInput = {},\n) {\n  assertPurchaseActor(db, actorId);\n  db.run(\"begin immediate transaction\");\n  try {\n    const purchase = one<InwardPurchase>(\n      db,\n      \"select * from inward_purchases where id=?\",\n      [purchaseId],\n    );\n    if (purchase.status === \"Received\") return purchaseId;\n    if (purchase.status !== \"Approved\" || !purchase.purchase_order_id)\n      throw new Error(\"Only approved purchases can be received and posted.\");\n    if (\n      input.supplier_invoice_no !== undefined ||\n      input.invoice_date !== undefined\n    )\n      db.run(\n        \"update inward_purchases set supplier_invoice_no=?,invoice_date=?,updated_at=datetime('now') where id=?\",\n        [\n          input.supplier_invoice_no?.trim() ?? purchase.supplier_invoice_no,\n          input.invoice_date ?? purchase.invoice_date,\n          purchaseId,\n        ],\n      );\n    if (input.lines) {\n      const current = all<InwardPurchaseLine>(\n        db,\n        \"select * from inward_purchase_lines where purchase_id=?\",\n        [purchaseId],\n      );\n      if (current.length !== input.lines.length)\n        throw new Error(\n          \"Receipt lines must exactly match the linked PO lines.\",\n        );\n      const byPoLine = new Map(\n        current.map((line) => [line.purchase_order_line_id, line]),\n      );\n      const matchedPoLines = new Set<number>();\n      for (const line of input.lines) {\n        const target = line.purchase_order_line_id\n          ? byPoLine.get(line.purchase_order_line_id)\n          : current.find((row) => row.item_id === line.item_id);\n        if (\n          !target ||\n          !target.purchase_order_line_id ||\n          matchedPoLines.has(target.purchase_order_line_id) ||\n          target.item_id !== line.item_id ||\n          byPoLine.get(target.purchase_order_line_id) !== target\n        )\n          throw new Error(\n            \"Receipt lines must exactly match the linked PO lines.\",\n          );\n        matchedPoLines.add(target.purchase_order_line_id);\n        const values = assertPurchaseLine(db, line);\n        db.run(\n          \"update inward_purchase_lines set received_qty=?,unit_cost=?,discount=?,gst_rate=?,subtotal=?,gst_amount=?,total=? where id=?\",\n          [\n            values.qty,\n            values.unitCost,\n            values.discount,\n            values.gstRate,\n            values.subtotal,\n            values.gstAmount,\n            values.total,\n            target.id,\n          ],\n        );\n      }\n      if (matchedPoLines.size !== current.length)\n        throw new Error(\n          \"Receipt lines must exactly match the linked PO lines.\",\n        );\n    }\n    if (input.attachments?.length)\n      addPurchaseAttachments(db, purchaseId, actorId, input.attachments);\n    const fresh = one<InwardPurchase>(\n      db,\n      \"select * from inward_purchases where id=?\",\n      [purchaseId],\n    );\n    if (!fresh.purchase_order_id)\n      throw new Error(\n        \"The approved purchase is missing its purchase order link.\",\n      );\n    const lines = submitPurchaseValidation(db, fresh);\n    for (const line of lines) {\n      if (!line.purchase_order_line_id)\n        throw new Error(\"Each receipt line must be linked to a PO line.\");\n      const poLine = one<PurchaseOrderLine>(\n        db,\n        \"select * from purchase_order_lines where id=?\",\n        [line.purchase_order_line_id],\n      );\n      if (\n        poLine.purchase_order_id !== fresh.purchase_order_id ||\n        poLine.item_id !== line.item_id\n      )\n        throw new Error(\"Receipt line does not match its linked PO line.\");\n      const ledgerId = insert(\n        db,\n        \"insert into stock_ledger(job_card_id,material_row_id,item_id,qty,type,by_user,at,note,inward_purchase_line_id) values(0,0,?,-?,'inward',?,datetime('now'),?,?)\",\n        [\n          line.item_id,\n          line.received_qty,\n          actorId,\n          `Inward receipt #${purchaseId} / ${fresh.supplier_invoice_no}`,\n          line.id,\n        ],\n      );\n      insert(\n        db,\n        \"insert into stock_inwards(item_id,qty,note,purchase_order_id,purchase_order_line_id,ledger_id,received_by,received_at) values(?,?,?,?,?,?,?,datetime('now'))\",\n        [\n          line.item_id,\n          line.received_qty,\n          `Inward receipt #${purchaseId}`,\n          fresh.purchase_order_id,\n          line.purchase_order_line_id,\n          ledgerId,\n          actorId,\n        ],\n      );\n      movement(\n        db,\n        0,\n        line.item_id,\n        \"INWARD_PURCHASE\",\n        line.received_qty,\n        `Inward receipt #${purchaseId}`,\n      );\n    }\n    reconcilePurchaseOrder(db, fresh.purchase_order_id);\n    db.run(\n      \"update inward_purchases set status='Received',submitted_by=?,submitted_at=datetime('now'),updated_at=datetime('now') where id=?\",\n      [actorId, purchaseId],\n    );\n    insert(\n      db,\n      \"insert into inward_purchase_events(purchase_id,kind,actor_id,at,note) values(?,?,?,datetime('now'),?)\",\n      [purchaseId, \"received\", actorId, \"Posted linked PO receipt\"],\n    );\n    db.run(\"commit\");\n    return purchaseId;\n  } catch (error) {\n    db.run(\"rollback\");\n    throw error;\n  }\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "purchaseId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "input",
        "type": "InwardPurchaseDraftInput",
        "optional": true,
        "default": "{}"
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/receiveAndPostInwardPurchaseForActor",
    "service": "procurement/inventory; TX-08/09/10",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-submitInwardPurchaseForActor",
    "name": "submitInwardPurchaseForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:3728-3783",
    "calls": [
      "assertPurchaseActor",
      "one",
      "db.run",
      "submitPurchaseValidation",
      "movement",
      "insert"
    ],
    "sql": [
      "one<InwardPurchase>( db, \"select * from inward_purchases where id=?\", [purchaseId], )",
      "db.run(\"begin immediate transaction\")",
      "one<InwardPurchase>( db, \"select * from inward_purchases where id=?\", [purchaseId], )",
      "db.run( \"update inward_purchases set status='Submitted',submitted_by=?,submitted_at=datetime('now'),updated_at=datetime('now') where id=?\", [actorId, purchaseId], )",
      "db.run( \"insert into stock_ledger(job_card_id,material_row_id,item_id,qty,type,by_user,at,note,inward_purchase_line_id) values(0,0,?,-?,'inward',?,datetime('now'),?,?)\", [ line.item_id, line.received_qty, actorId, `Inward receipt #${purchaseId} / ${purchase.supplier_invoice_no}`, line.id, ], )",
      "insert( db, \"insert into inward_purchase_events(purchase_id,kind,actor_id,at,note) values(?,?,?,datetime('now'),?)\", [purchaseId, \"submitted\", actorId, \"Posted inbound ledger movements\"], )",
      "db.run(\"commit\")",
      "db.run(\"rollback\")"
    ],
    "body": "export function submitInwardPurchaseForActor(\n  db: Database,\n  purchaseId: number,\n  actorId: number,\n) {\n  assertPurchaseActor(db, actorId);\n  const existing = one<InwardPurchase>(\n    db,\n    \"select * from inward_purchases where id=?\",\n    [purchaseId],\n  );\n  if (existing.status === \"Submitted\") return purchaseId;\n  db.run(\"begin immediate transaction\");\n  try {\n    const purchase = one<InwardPurchase>(\n      db,\n      \"select * from inward_purchases where id=?\",\n      [purchaseId],\n    );\n    const lines = submitPurchaseValidation(db, purchase);\n    db.run(\n      \"update inward_purchases set status='Submitted',submitted_by=?,submitted_at=datetime('now'),updated_at=datetime('now') where id=?\",\n      [actorId, purchaseId],\n    );\n    for (const line of lines) {\n      db.run(\n        \"insert into stock_ledger(job_card_id,material_row_id,item_id,qty,type,by_user,at,note,inward_purchase_line_id) values(0,0,?,-?,'inward',?,datetime('now'),?,?)\",\n        [\n          line.item_id,\n          line.received_qty,\n          actorId,\n          `Inward receipt #${purchaseId} / ${purchase.supplier_invoice_no}`,\n          line.id,\n        ],\n      );\n      movement(\n        db,\n        0,\n        line.item_id,\n        \"INWARD_PURCHASE\",\n        line.received_qty,\n        `Inward receipt #${purchaseId}`,\n      );\n    }\n    insert(\n      db,\n      \"insert into inward_purchase_events(purchase_id,kind,actor_id,at,note) values(?,?,?,datetime('now'),?)\",\n      [purchaseId, \"submitted\", actorId, \"Posted inbound ledger movements\"],\n    );\n    db.run(\"commit\");\n    return purchaseId;\n  } catch (error) {\n    db.run(\"rollback\");\n    throw error;\n  }\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "purchaseId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/submitInwardPurchaseForActor",
    "service": "procurement/inventory; TX-08/09/10",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-previousPurchaseHistoryForItem",
    "name": "previousPurchaseHistoryForItem",
    "file": "src/db.ts",
    "span": "src/db.ts:3854-3872",
    "calls": [
      "Number.isInteger",
      "Math.max",
      "Math.min",
      "Math.floor",
      "all<PreviousPurchaseRecord>(\n    db,\n    `select supplier.name as supplier_name, purchase_order.order_date as purchase_date,\n      line.unit_cost, line.ordered_qty as quantity\n      from purchase_order_lines line\n      join purchase_orders purchase_order on purchase_order.id=line.purchase_order_id\n      left join suppliers supplier on supplier.id=purchase_order.supplier_id\n      where line.item_id=? and purchase_order.status='Closed'\n      order by purchase_order.order_date desc, purchase_order.id desc, line.id desc limit ${safeLimit}`,\n    [itemId],\n  ).map",
      "all"
    ],
    "sql": [
      "all<PreviousPurchaseRecord>( db, `select supplier.name as supplier_name, purchase_order.order_date as purchase_date, line.unit_cost, line.ordered_qty as quantity from purchase_order_lines line join purchase_orders purchase_order on purchase_order.id=line.purchase_order_id left join suppliers supplier on supplier.id=purchase_order.supplier_id where line.item_id=? and purchase_order.status='Closed' order by purchase_order.order_date desc, purchase_order.id desc, line.id desc limit ${safeLimit}`, [itemId], )"
    ],
    "body": "export function previousPurchaseHistoryForItem(\n  db: Database,\n  itemId: number,\n  limit = 3,\n): PreviousPurchaseRecord[] {\n  if (!Number.isInteger(itemId) || itemId <= 0) return [];\n  const safeLimit = Math.max(1, Math.min(10, Math.floor(limit)));\n  return all<PreviousPurchaseRecord>(\n    db,\n    `select supplier.name as supplier_name, purchase_order.order_date as purchase_date,\n      line.unit_cost, line.ordered_qty as quantity\n      from purchase_order_lines line\n      join purchase_orders purchase_order on purchase_order.id=line.purchase_order_id\n      left join suppliers supplier on supplier.id=purchase_order.supplier_id\n      where line.item_id=? and purchase_order.status='Closed'\n      order by purchase_order.order_date desc, purchase_order.id desc, line.id desc limit ${safeLimit}`,\n    [itemId],\n  ).map((row) => ({ ...row, supplier_name: row.supplier_name || \"Supplier unavailable\" }));\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "itemId",
        "type": "number",
        "optional": false
      },
      {
        "name": "limit",
        "type": "INFERRED",
        "optional": true,
        "default": "3"
      }
    ],
    "returnType": "PreviousPurchaseRecord[]",
    "classification": "READ",
    "endpoint": "GET /api/v1/ui/purchase-history/{itemId}",
    "service": "procurement/inventory; TX-08/09/10",
    "resolvedReturnType": "PreviousPurchaseRecord[]"
  },
  {
    "id": "OP-db-savePurchaseOrderQuotationForActor",
    "name": "savePurchaseOrderQuotationForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:3874-3903",
    "calls": [
      "assertPurchaseActor",
      "one",
      "all",
      "input.supplier_name?.trim",
      "Number.isFinite",
      "input.quote_date?.trim",
      "new Date().toISOString().slice",
      "new Date().toISOString",
      "/^\\d{4}-\\d{2}-\\d{2}$/.test",
      "insert",
      "input.notes?.trim"
    ],
    "sql": [
      "one<PurchaseOrder>(db, \"select * from purchase_orders where id=?\", [purchaseOrderId])",
      "all<PurchaseOrderLine>( db, \"select * from purchase_order_lines where id=? and purchase_order_id=?\", [input.purchase_order_line_id, purchaseOrderId], )",
      "insert( db, \"insert into purchase_order_quotations(purchase_order_id,purchase_order_line_id,supplier_name,quote_date,quoted_qty,unit_cost,notes,created_by,created_at,updated_at) values(?,?,?,?,?,?,?,?,datetime('now'),datetime('now'))\", [purchaseOrderId, input.purchase_order_line_id, supplierName, quoteDate, input.quoted_qty, input.unit_cost, input.notes?.trim() ?? \"\", actorId], )"
    ],
    "body": "export function savePurchaseOrderQuotationForActor(\n  db: Database,\n  purchaseOrderId: number,\n  actorId: number,\n  input: PurchaseOrderQuotationInput,\n) {\n  assertPurchaseActor(db, actorId, true);\n  const order = one<PurchaseOrder>(db, \"select * from purchase_orders where id=?\", [purchaseOrderId]);\n  if (order.status !== \"PO Request\")\n    throw new Error(\"Quotations can only be recorded while a Purchase Request is under review.\");\n  const line = all<PurchaseOrderLine>(\n    db,\n    \"select * from purchase_order_lines where id=? and purchase_order_id=?\",\n    [input.purchase_order_line_id, purchaseOrderId],\n  )[0];\n  if (!line) throw new Error(\"Select a line from this Purchase Request.\");\n  const supplierName = input.supplier_name?.trim();\n  if (!supplierName) throw new Error(\"Supplier name is required for a quotation.\");\n  if (!Number.isFinite(input.quoted_qty) || input.quoted_qty <= 0)\n    throw new Error(\"Quoted quantity must be greater than zero.\");\n  if (!Number.isFinite(input.unit_cost) || input.unit_cost < 0)\n    throw new Error(\"Pre-GST unit price cannot be negative.\");\n  const quoteDate = input.quote_date?.trim() || new Date().toISOString().slice(0, 10);\n  if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(quoteDate)) throw new Error(\"A valid quotation date is required.\");\n  return insert(\n    db,\n    \"insert into purchase_order_quotations(purchase_order_id,purchase_order_line_id,supplier_name,quote_date,quoted_qty,unit_cost,notes,created_by,created_at,updated_at) values(?,?,?,?,?,?,?,?,datetime('now'),datetime('now'))\",\n    [purchaseOrderId, input.purchase_order_line_id, supplierName, quoteDate, input.quoted_qty, input.unit_cost, input.notes?.trim() ?? \"\", actorId],\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "purchaseOrderId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "input",
        "type": "PurchaseOrderQuotationInput",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/savePurchaseOrderQuotationForActor",
    "service": "procurement/inventory; TX-08/09/10",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-purchaseRequestNumberForOrdinal",
    "name": "purchaseRequestNumberForOrdinal",
    "file": "src/db.ts",
    "span": "src/db.ts:3905-3914",
    "calls": [
      "Math.floor",
      "String.fromCharCode",
      "String((ordinal % 99_999) + 1).padStart",
      "String"
    ],
    "sql": [],
    "body": "export function purchaseRequestNumberForOrdinal(ordinal: number) {\n  let value = Math.floor(ordinal / 99_999) + 1;\n  let letters = \"\";\n  while (value > 0) {\n    value -= 1;\n    letters = String.fromCharCode(65 + (value % 26)) + letters;\n    value = Math.floor(value / 26);\n  }\n  return `PO-WOS-${letters}-${String((ordinal % 99_999) + 1).padStart(5, \"0\")}`;\n}",
    "parameters": [
      {
        "name": "ordinal",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "string"
  },
  {
    "id": "OP-db-purchaseRequestOrdinal",
    "name": "purchaseRequestOrdinal",
    "file": "src/db.ts",
    "span": "src/db.ts:3916-3925",
    "calls": [
      "/^PO-WOS-([A-Z]+)-(\\d{5})$/.exec",
      "[...match[1]].reduce",
      "letter.charCodeAt",
      "Number"
    ],
    "sql": [],
    "body": "export function purchaseRequestOrdinal(poNumber: string) {\n  const match = /^PO-WOS-([A-Z]+)-(\\d{5})$/.exec(poNumber);\n  if (!match) return -1;\n  const letters = [...match[1]].reduce(\n    (value, letter) => value * 26 + letter.charCodeAt(0) - 64,\n    0,\n  );\n  const serial = Number(match[2]);\n  return (letters - 1) * 99_999 + serial - 1;\n}",
    "parameters": [
      {
        "name": "poNumber",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-nextPurchaseRequestNumberForOrders",
    "name": "nextPurchaseRequestNumberForOrders",
    "file": "src/db.ts",
    "span": "src/db.ts:3927-3935",
    "calls": [
      "orders.reduce",
      "Math.max",
      "purchaseRequestOrdinal",
      "purchaseRequestNumberForOrdinal"
    ],
    "sql": [],
    "body": "export function nextPurchaseRequestNumberForOrders(\n  orders: readonly Pick<PurchaseOrder, \"po_number\">[],\n) {\n  const latest = orders.reduce(\n    (max, order) => Math.max(max, purchaseRequestOrdinal(order.po_number)),\n    -1,\n  );\n  return purchaseRequestNumberForOrdinal(latest + 1);\n}",
    "parameters": [
      {
        "name": "orders",
        "type": "readonly Pick<PurchaseOrder, \"po_number\">[]",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "procurement/inventory; TX-08/09/10",
    "resolvedReturnType": "string"
  },
  {
    "id": "OP-db-createPurchaseRequestForActor",
    "name": "createPurchaseRequestForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:4009-4030",
    "calls": [
      "assertPurchaseActor",
      "assertPurchaseRequestInput",
      "db.run",
      "insert",
      "nextPurchaseRequestNumber",
      "input.notes?.trim",
      "replacePurchaseRequestLines"
    ],
    "sql": [
      "db.run(\"begin immediate transaction\")",
      "insert( db, \"insert into purchase_orders(supplier_id,po_number,order_date,notes,status,created_by,created_at,updated_at) values(?,?,?,?, 'PO Request',?,datetime('now'),datetime('now'))\", [0, nextPurchaseRequestNumber(db), input.order_date, input.notes?.trim() ?? \"\", actor.id], )",
      "db.run(\"commit\")",
      "db.run(\"rollback\")"
    ],
    "body": "export function createPurchaseRequestForActor(\n  db: Database,\n  actorId: number,\n  input: PurchaseRequestInput,\n) {\n  const actor = assertPurchaseActor(db, actorId);\n  assertPurchaseRequestInput(db, input);\n  db.run(\"begin immediate transaction\");\n  try {\n    const id = insert(\n      db,\n      \"insert into purchase_orders(supplier_id,po_number,order_date,notes,status,created_by,created_at,updated_at) values(?,?,?,?, 'PO Request',?,datetime('now'),datetime('now'))\",\n      [0, nextPurchaseRequestNumber(db), input.order_date, input.notes?.trim() ?? \"\", actor.id],\n    );\n    replacePurchaseRequestLines(db, id, input.lines);\n    db.run(\"commit\");\n    return id;\n  } catch (error) {\n    db.run(\"rollback\");\n    throw error;\n  }\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "input",
        "type": "PurchaseRequestInput",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/createPurchaseRequestForActor",
    "service": "procurement/inventory; TX-08/09/10",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-updatePurchaseRequestForActor",
    "name": "updatePurchaseRequestForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:4033-4053",
    "calls": [
      "assertMutablePurchaseRequestAccess",
      "assertPurchaseRequestInput",
      "db.run",
      "input.notes?.trim",
      "replacePurchaseRequestLines"
    ],
    "sql": [
      "db.run(\"begin immediate transaction\")",
      "db.run( \"update purchase_orders set order_date=?,notes=?,updated_at=datetime('now') where id=?\", [input.order_date, input.notes?.trim() ?? \"\", id], )",
      "db.run(\"commit\")",
      "db.run(\"rollback\")"
    ],
    "body": "export function updatePurchaseRequestForActor(\n  db: Database,\n  id: number,\n  actorId: number,\n  input: PurchaseRequestInput,\n) {\n  assertMutablePurchaseRequestAccess(db, id, actorId);\n  assertPurchaseRequestInput(db, input);\n  db.run(\"begin immediate transaction\");\n  try {\n    db.run(\n      \"update purchase_orders set order_date=?,notes=?,updated_at=datetime('now') where id=?\",\n      [input.order_date, input.notes?.trim() ?? \"\", id],\n    );\n    replacePurchaseRequestLines(db, id, input.lines);\n    db.run(\"commit\");\n  } catch (error) {\n    db.run(\"rollback\");\n    throw error;\n  }\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "id",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "input",
        "type": "PurchaseRequestInput",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/updatePurchaseRequestForActor",
    "service": "procurement/inventory; TX-08/09/10",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-cancelPurchaseRequestForActor",
    "name": "cancelPurchaseRequestForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:4055-4065",
    "calls": [
      "assertMutablePurchaseRequestAccess",
      "db.run"
    ],
    "sql": [
      "db.run( \"update purchase_orders set status='Cancelled',updated_at=datetime('now') where id=?\", [id], )"
    ],
    "body": "export function cancelPurchaseRequestForActor(\n  db: Database,\n  id: number,\n  actorId: number,\n) {\n  assertMutablePurchaseRequestAccess(db, id, actorId);\n  db.run(\n    \"update purchase_orders set status='Cancelled',updated_at=datetime('now') where id=?\",\n    [id],\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "id",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/cancelPurchaseRequestForActor",
    "service": "procurement/inventory; TX-08/09/10",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-approvePurchaseRequestForActor",
    "name": "approvePurchaseRequestForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:4073-4165",
    "calls": [
      "assertPurchaseActor",
      "one",
      "all",
      "input.lines.map",
      "requestLines.some",
      "byId.has",
      "byId.get",
      "maybe",
      "Number.isFinite",
      "item.sku.trim",
      "item.category.trim",
      "item.name.trim",
      "item.unit.trim",
      "item.sku.trim().toUpperCase",
      "suppliedSkus.has",
      "suppliedSkus.add",
      "db.run",
      "requestLines.map",
      "createInventoryItem",
      "groups.get",
      "group.push",
      "groups.set",
      "[...groups.values()].sort",
      "groups.values",
      "totalsForPurchaseLine",
      "insert",
      "firstGroup.map",
      "[...retained].map(() => \"?\").join",
      "[...retained].map",
      "firstGroup.reduce",
      "writeLine",
      "supplierGroups.slice",
      "nextPurchaseRequestNumber",
      "group.reduce",
      "approvedIds.push"
    ],
    "sql": [
      "one<PurchaseOrder>( db, \"select * from purchase_orders where id=?\", [purchaseOrderId], )",
      "all<PurchaseOrderLine>( db, \"select * from purchase_order_lines where purchase_order_id=? order by id\", [purchaseOrderId], )",
      "maybe<Supplier>(db, \"select * from suppliers where id=?\", [line.supplier_id])",
      "maybe<InventoryItem>(db, \"select * from inventory where upper(sku)=?\", [sku])",
      "db.run(\"begin immediate transaction\")",
      "db.run(\"update purchase_order_lines set item_id=?,unit_cost=?,discount=0,gst_rate=0,subtotal=?,gst_amount=?,total=? where id=?\", [entry.itemId, values.unitCost, values.subtotal, values.gstAmount, values.total, entry.requestLine.id])",
      "insert(db, \"insert into purchase_order_lines(purchase_order_id,item_id,item_name,unit,ordered_qty,unit_cost,discount,gst_rate,subtotal,gst_amount,total,source_purchase_order_line_id) values(?,?,?,?,?,?,?,?,?,?,?,?)\", [targetOrderId, entry.itemId, entry.requestLine.item_name, entry.requestLine.unit, entry.requestLine.ordered_qty, values.unitCost, 0, 0, values.subtotal, values.gstAmount, values.total, sourceLineId])",
      "db.run(`delete from purchase_order_lines where purchase_order_id=? and id not in (${[...retained].map(() => \"?\").join(\",\")})`, [purchaseOrderId, ...retained])",
      "db.run(\"update purchase_orders set supplier_id=?,status='PO Request Approved',subtotal=?,discount_total=0,gst_total=0,total=?,updated_at=datetime('now') where id=?\", [firstGroup[0].approval.supplier_id, firstTotal, firstTotal, purchaseOrderId])",
      "insert(db, \"insert into purchase_orders(supplier_id,po_number,order_date,notes,status,subtotal,discount_total,gst_total,total,created_by,created_at,updated_at,source_purchase_order_id) values(?,?,?,?,'PO Request Approved',0,0,0,0,?,datetime('now'),datetime('now'),?)\", [group[0].approval.supplier_id, nextPurchaseRequestNumber(db), order.order_date, `Split from ${order.po_number}${order.notes ? ` · ${order.notes}` : \"\"}`, order.created_by, purchaseOrderId])",
      "db.run(\"update purchase_orders set subtotal=?,total=? where id=?\", [childTotal, childTotal, childId])",
      "db.run(\"commit\")",
      "db.run(\"rollback\")"
    ],
    "body": "export function approvePurchaseRequestForActor(\n  db: Database,\n  purchaseOrderId: number,\n  actorId: number,\n  input: PurchaseRequestApprovalInput,\n) {\n  assertPurchaseActor(db, actorId, true);\n  const order = one<PurchaseOrder>(\n    db,\n    \"select * from purchase_orders where id=?\",\n    [purchaseOrderId],\n  );\n  if (order.status !== \"PO Request\")\n    throw new Error(\"Only Purchase Requests under review can be approved.\");\n  const requestLines = all<PurchaseOrderLine>(\n    db,\n    \"select * from purchase_order_lines where purchase_order_id=? order by id\",\n    [purchaseOrderId],\n  );\n  if (!input.lines?.length || input.lines.length !== requestLines.length)\n    throw new Error(\"Approval needs a supplier and pre-GST price for every requested line.\");\n  const byId = new Map(input.lines.map((line) => [line.purchase_order_line_id, line]));\n  if (byId.size !== requestLines.length || requestLines.some((line) => !byId.has(line.id)))\n    throw new Error(\"Approval must cover every requested line exactly once.\");\n  const suppliedSkus = new Set<string>();\n  for (const requestLine of requestLines) {\n    const line = byId.get(requestLine.id)!;\n    const supplier = maybe<Supplier>(db, \"select * from suppliers where id=?\", [line.supplier_id]);\n    if (!supplier || supplier.status !== \"Active\")\n      throw new Error(\"Select an active supplier for every requested line.\");\n    if (!Number.isFinite(line.unit_cost) || line.unit_cost <= 0)\n      throw new Error(\"Enter a pre-GST unit price greater than zero for every requested line.\");\n    if (requestLine.item_id !== 0) continue;\n    const item = line.inventory_item;\n    if (!item || !item.sku.trim() || !item.category.trim() || !item.name.trim() || !item.unit.trim())\n      throw new Error(`Complete SKU, category, name, and unit for New Item Request \\\"${requestLine.item_name}\\\".`);\n    if (!Number.isFinite(item.low_stock_qty) || item.low_stock_qty < 0 || !Number.isFinite(item.selling_price) || item.selling_price < 0)\n      throw new Error(\"New Item SKU stock threshold and selling price cannot be negative.\");\n    const sku = item.sku.trim().toUpperCase();\n    if (suppliedSkus.has(sku) || maybe<InventoryItem>(db, \"select * from inventory where upper(sku)=?\", [sku]))\n      throw new Error(`SKU ${sku} already exists in inventory.`);\n    suppliedSkus.add(sku);\n  }\n\n  db.run(\"begin immediate transaction\");\n  try {\n    const resolved = requestLines.map((requestLine) => {\n      const approval = byId.get(requestLine.id)!;\n      let itemId = requestLine.item_id;\n      if (itemId === 0) {\n        const item = approval.inventory_item!;\n        itemId = createInventoryItem(db, {\n          sku: item.sku.trim().toUpperCase(), category: item.category.trim(), name: item.name.trim(),\n          unit: item.unit.trim(), stock_qty: 0, low_stock_qty: item.low_stock_qty, selling_price: item.selling_price,\n        });\n      }\n      return { requestLine, approval, itemId };\n    });\n    const groups = new Map<number, typeof resolved>();\n    for (const entry of resolved) {\n      const group = groups.get(entry.approval.supplier_id) ?? [];\n      group.push(entry);\n      groups.set(entry.approval.supplier_id, group);\n    }\n    const supplierGroups = [...groups.values()].sort((left, right) => left[0].requestLine.id - right[0].requestLine.id);\n    const writeLine = (targetOrderId: number, entry: typeof resolved[number], sourceLineId: number | null) => {\n      const values = totalsForPurchaseLine({ item_id: entry.itemId, received_qty: entry.requestLine.ordered_qty, unit_cost: entry.approval.unit_cost, discount: 0, gst_rate: 0 });\n      if (sourceLineId === null) {\n        db.run(\"update purchase_order_lines set item_id=?,unit_cost=?,discount=0,gst_rate=0,subtotal=?,gst_amount=?,total=? where id=?\", [entry.itemId, values.unitCost, values.subtotal, values.gstAmount, values.total, entry.requestLine.id]);\n      } else {\n        insert(db, \"insert into purchase_order_lines(purchase_order_id,item_id,item_name,unit,ordered_qty,unit_cost,discount,gst_rate,subtotal,gst_amount,total,source_purchase_order_line_id) values(?,?,?,?,?,?,?,?,?,?,?,?)\", [targetOrderId, entry.itemId, entry.requestLine.item_name, entry.requestLine.unit, entry.requestLine.ordered_qty, values.unitCost, 0, 0, values.subtotal, values.gstAmount, values.total, sourceLineId]);\n      }\n      return values.total;\n    };\n    const firstGroup = supplierGroups[0];\n    const retained = new Set(firstGroup.map((entry) => entry.requestLine.id));\n    db.run(`delete from purchase_order_lines where purchase_order_id=? and id not in (${[...retained].map(() => \"?\").join(\",\")})`, [purchaseOrderId, ...retained]);\n    const firstTotal = firstGroup.reduce((total, entry) => total + writeLine(purchaseOrderId, entry, null), 0);\n    db.run(\"update purchase_orders set supplier_id=?,status='PO Request Approved',subtotal=?,discount_total=0,gst_total=0,total=?,updated_at=datetime('now') where id=?\", [firstGroup[0].approval.supplier_id, firstTotal, firstTotal, purchaseOrderId]);\n    const approvedIds = [purchaseOrderId];\n    for (const group of supplierGroups.slice(1)) {\n      const childId = insert(db, \"insert into purchase_orders(supplier_id,po_number,order_date,notes,status,subtotal,discount_total,gst_total,total,created_by,created_at,updated_at,source_purchase_order_id) values(?,?,?,?,'PO Request Approved',0,0,0,0,?,datetime('now'),datetime('now'),?)\", [group[0].approval.supplier_id, nextPurchaseRequestNumber(db), order.order_date, `Split from ${order.po_number}${order.notes ? ` · ${order.notes}` : \"\"}`, order.created_by, purchaseOrderId]);\n      const childTotal = group.reduce((total, entry) => total + writeLine(childId, entry, entry.requestLine.id), 0);\n      db.run(\"update purchase_orders set subtotal=?,total=? where id=?\", [childTotal, childTotal, childId]);\n      approvedIds.push(childId);\n    }\n    db.run(\"commit\");\n    return approvedIds;\n  } catch (error) {\n    db.run(\"rollback\");\n    throw error;\n  }\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "purchaseOrderId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "input",
        "type": "PurchaseRequestApprovalInput",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/approvePurchaseRequestForActor",
    "service": "procurement/inventory; TX-08/09/10",
    "resolvedReturnType": "number[]"
  },
  {
    "id": "OP-db-issuePurchaseOrderForActor",
    "name": "issuePurchaseOrderForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:4171-4206",
    "calls": [
      "assertPurchaseActor",
      "one",
      "maybe",
      "all",
      "lines.some",
      "db.run"
    ],
    "sql": [
      "one<PurchaseOrder>( db, \"select * from purchase_orders where id=?\", [purchaseOrderId], )",
      "maybe<Supplier>( db, \"select * from suppliers where id=?\", [order.supplier_id], )",
      "all<PurchaseOrderLine>( db, \"select * from purchase_order_lines where purchase_order_id=?\", [purchaseOrderId], )",
      "db.run( \"update purchase_orders set status='PO Issued',updated_at=datetime('now') where id=?\", [purchaseOrderId], )"
    ],
    "body": "export function issuePurchaseOrderForActor(\n  db: Database,\n  purchaseOrderId: number,\n  actorId: number,\n) {\n  assertPurchaseActor(db, actorId, true);\n  const order = one<PurchaseOrder>(\n    db,\n    \"select * from purchase_orders where id=?\",\n    [purchaseOrderId],\n  );\n  if (order.status !== \"PO Request Approved\")\n    throw new Error(\n      \"A Purchase Order can only be issued after it is fully approved.\",\n    );\n  const supplier = maybe<Supplier>(\n    db,\n    \"select * from suppliers where id=?\",\n    [order.supplier_id],\n  );\n  if (!supplier || supplier.status !== \"Active\")\n    throw new Error(\"Assign an active supplier before issuing this Purchase Order.\");\n  const lines = all<PurchaseOrderLine>(\n    db,\n    \"select * from purchase_order_lines where purchase_order_id=?\",\n    [purchaseOrderId],\n  );\n  if (!lines.length || lines.some((line) => line.item_id <= 0 || line.ordered_qty <= 0 || line.unit_cost <= 0))\n    throw new Error(\n      \"Complete every item, quantity, and pre-GST price before issuing this Purchase Order.\",\n    );\n  db.run(\n    \"update purchase_orders set status='PO Issued',updated_at=datetime('now') where id=?\",\n    [purchaseOrderId],\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "purchaseOrderId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/issuePurchaseOrderForActor",
    "service": "procurement/inventory; TX-08/09/10",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-recordPurchaseOrderReceiptForActor",
    "name": "recordPurchaseOrderReceiptForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:4214-4250",
    "calls": [
      "assertPurchaseActor",
      "one",
      "[\"PO Issued\", \"PO Received\"].includes",
      "all",
      "input.lines.map",
      "input.lines.some",
      "Number.isFinite",
      "orderLines.some",
      "requested.get",
      "scalar",
      "db.run",
      "insert",
      "input.note?.trim"
    ],
    "sql": [
      "one<PurchaseOrder>(db, \"select * from purchase_orders where id=?\", [purchaseOrderId])",
      "all<PurchaseOrderLine>(db, \"select * from purchase_order_lines where purchase_order_id=?\", [purchaseOrderId])",
      "scalar<number>(db, `select coalesce(sum(receipt_line.delivered_qty),0) from purchase_order_receipt_lines receipt_line join purchase_order_receipts receipt on receipt.id=receipt_line.purchase_order_receipt_id where receipt.purchase_order_id=? and receipt_line.purchase_order_line_id=?`, [purchaseOrderId, line.id])",
      "db.run(\"begin immediate transaction\")",
      "insert(db, \"insert into purchase_order_receipts(purchase_order_id,received_by,received_at,note) values(?,?,datetime('now'),?)\", [purchaseOrderId, actorId, input.note?.trim() ?? \"\"])",
      "insert(db, \"insert into purchase_order_receipt_lines(purchase_order_receipt_id,purchase_order_line_id,delivered_qty) values(?,?,?)\", [receiptId, line.purchase_order_line_id, line.delivered_qty])",
      "db.run(\"update purchase_orders set status='PO Received',updated_at=datetime('now') where id=?\", [purchaseOrderId])",
      "db.run(\"commit\")",
      "db.run(\"rollback\")"
    ],
    "body": "export function recordPurchaseOrderReceiptForActor(\n  db: Database,\n  purchaseOrderId: number,\n  actorId: number,\n  input: PurchaseOrderReceiptInput,\n) {\n  assertPurchaseActor(db, actorId, true);\n  const order = one<PurchaseOrder>(db, \"select * from purchase_orders where id=?\", [purchaseOrderId]);\n  if (![\"PO Issued\", \"PO Received\"].includes(order.status))\n    throw new Error(\"Deliveries can only be recorded for an issued or received Purchase Order.\");\n  if (!input.lines?.length) throw new Error(\"Record at least one delivered quantity.\");\n  const orderLines = all<PurchaseOrderLine>(db, \"select * from purchase_order_lines where purchase_order_id=?\", [purchaseOrderId]);\n  const requested = new Map(input.lines.map((line) => [line.purchase_order_line_id, line]));\n  if (requested.size !== input.lines.length || input.lines.some((line) => !Number.isFinite(line.delivered_qty) || line.delivered_qty <= 0))\n    throw new Error(\"Each delivered quantity must be greater than zero.\");\n  if (input.lines.some((line) => !orderLines.some((orderLine) => orderLine.id === line.purchase_order_line_id)))\n    throw new Error(\"Every delivery line must belong to this Purchase Order.\");\n  for (const line of orderLines) {\n    const deliveredNow = requested.get(line.id)?.delivered_qty ?? 0;\n    if (!deliveredNow) continue;\n    const deliveredBefore = scalar<number>(db, `select coalesce(sum(receipt_line.delivered_qty),0) from purchase_order_receipt_lines receipt_line join purchase_order_receipts receipt on receipt.id=receipt_line.purchase_order_receipt_id where receipt.purchase_order_id=? and receipt_line.purchase_order_line_id=?`, [purchaseOrderId, line.id]);\n    if (deliveredBefore + deliveredNow > line.ordered_qty)\n      throw new Error(\"Delivered quantity cannot exceed the ordered quantity.\");\n  }\n  db.run(\"begin immediate transaction\");\n  try {\n    const receiptId = insert(db, \"insert into purchase_order_receipts(purchase_order_id,received_by,received_at,note) values(?,?,datetime('now'),?)\", [purchaseOrderId, actorId, input.note?.trim() ?? \"\"]);\n    for (const line of input.lines)\n      insert(db, \"insert into purchase_order_receipt_lines(purchase_order_receipt_id,purchase_order_line_id,delivered_qty) values(?,?,?)\", [receiptId, line.purchase_order_line_id, line.delivered_qty]);\n    db.run(\"update purchase_orders set status='PO Received',updated_at=datetime('now') where id=?\", [purchaseOrderId]);\n    db.run(\"commit\");\n    return receiptId;\n  } catch (error) {\n    db.run(\"rollback\");\n    throw error;\n  }\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "purchaseOrderId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "input",
        "type": "PurchaseOrderReceiptInput",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/recordPurchaseOrderReceiptForActor",
    "service": "procurement/inventory; TX-08/09/10",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-confirmPurchaseOrderForActor",
    "name": "confirmPurchaseOrderForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:4257-4290",
    "calls": [
      "assertPurchaseActor",
      "one",
      "all",
      "input.lines?.map",
      "orderLines.some",
      "confirmations.has",
      "scalar",
      "confirmations.get",
      "quantities.some",
      "Number.isFinite",
      "quantities.reduce",
      "db.run",
      "insert"
    ],
    "sql": [
      "one<PurchaseOrder>(db, \"select * from purchase_orders where id=?\", [purchaseOrderId])",
      "all<PurchaseOrderLine>(db, \"select * from purchase_order_lines where purchase_order_id=? order by id\", [purchaseOrderId])",
      "scalar<number>(db, `select coalesce(sum(receipt_line.delivered_qty),0) from purchase_order_receipt_lines receipt_line join purchase_order_receipts receipt on receipt.id=receipt_line.purchase_order_receipt_id where receipt.purchase_order_id=? and receipt_line.purchase_order_line_id=?`, [purchaseOrderId, line.id])",
      "db.run(\"begin immediate transaction\")",
      "insert(db, \"insert into purchase_order_confirmations(purchase_order_id,purchase_order_line_id,accepted_qty,returned_qty,damaged_qty,wasted_qty,confirmed_by,confirmed_at) values(?,?,?,?,?,?,?,datetime('now'))\", [purchaseOrderId, line.id, confirmation.accepted_qty, confirmation.returned_qty, confirmation.damaged_qty, confirmation.wasted_qty, actorId])",
      "db.run(\"update purchase_orders set status='PO Confirmation',updated_at=datetime('now') where id=?\", [purchaseOrderId])",
      "db.run(\"commit\")",
      "db.run(\"rollback\")"
    ],
    "body": "export function confirmPurchaseOrderForActor(\n  db: Database,\n  purchaseOrderId: number,\n  actorId: number,\n  input: PurchaseOrderConfirmationInput,\n) {\n  assertPurchaseActor(db, actorId, true);\n  const order = one<PurchaseOrder>(db, \"select * from purchase_orders where id=?\", [purchaseOrderId]);\n  if (order.status !== \"PO Received\") throw new Error(\"Only a received Purchase Order can be confirmed.\");\n  const orderLines = all<PurchaseOrderLine>(db, \"select * from purchase_order_lines where purchase_order_id=? order by id\", [purchaseOrderId]);\n  const confirmations = new Map(input.lines?.map((line) => [line.purchase_order_line_id, line]) ?? []);\n  if (confirmations.size !== input.lines.length || confirmations.size !== orderLines.length || orderLines.some((line) => !confirmations.has(line.id)))\n    throw new Error(\"Confirmation must account for every Purchase Order line.\");\n  for (const line of orderLines) {\n    const delivery = scalar<number>(db, `select coalesce(sum(receipt_line.delivered_qty),0) from purchase_order_receipt_lines receipt_line join purchase_order_receipts receipt on receipt.id=receipt_line.purchase_order_receipt_id where receipt.purchase_order_id=? and receipt_line.purchase_order_line_id=?`, [purchaseOrderId, line.id]);\n    const confirmation = confirmations.get(line.id)!;\n    const quantities = [confirmation.accepted_qty, confirmation.returned_qty, confirmation.damaged_qty, confirmation.wasted_qty];\n    if (quantities.some((quantity) => !Number.isFinite(quantity) || quantity < 0)) throw new Error(\"Confirmation quantities cannot be negative.\");\n    if (quantities.reduce((sum, quantity) => sum + quantity, 0) !== delivery)\n      throw new Error(\"Accepted, returned, damaged, and wasted quantities must equal the delivered quantity.\");\n  }\n  db.run(\"begin immediate transaction\");\n  try {\n    for (const line of orderLines) {\n      const confirmation = confirmations.get(line.id)!;\n      insert(db, \"insert into purchase_order_confirmations(purchase_order_id,purchase_order_line_id,accepted_qty,returned_qty,damaged_qty,wasted_qty,confirmed_by,confirmed_at) values(?,?,?,?,?,?,?,datetime('now'))\", [purchaseOrderId, line.id, confirmation.accepted_qty, confirmation.returned_qty, confirmation.damaged_qty, confirmation.wasted_qty, actorId]);\n    }\n    db.run(\"update purchase_orders set status='PO Confirmation',updated_at=datetime('now') where id=?\", [purchaseOrderId]);\n    db.run(\"commit\");\n  } catch (error) {\n    db.run(\"rollback\");\n    throw error;\n  }\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "purchaseOrderId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "input",
        "type": "PurchaseOrderConfirmationInput",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/confirmPurchaseOrderForActor",
    "service": "procurement/inventory; TX-08/09/10",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-closePurchaseOrderForActor",
    "name": "closePurchaseOrderForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:4297-4370",
    "calls": [
      "assertPurchaseActor",
      "db.run",
      "one",
      "all<{ id: number }>(\n        db,\n        \"select id from stock_inwards where purchase_order_id=? order by id\",\n        [purchaseOrderId],\n      ).map",
      "all",
      "confirmations.map",
      "lines.some",
      "confirmationForLine.has",
      "confirmationForLine.get",
      "insert",
      "movement",
      "inwardIds.push"
    ],
    "sql": [
      "db.run(\"begin immediate transaction\")",
      "one<PurchaseOrder>( db, \"select * from purchase_orders where id=?\", [purchaseOrderId], )",
      "all<{ id: number }>( db, \"select id from stock_inwards where purchase_order_id=? order by id\", [purchaseOrderId], )",
      "db.run(\"commit\")",
      "all<PurchaseOrderLine>( db, \"select * from purchase_order_lines where purchase_order_id=? order by id\", [purchaseOrderId], )",
      "all<PurchaseOrderConfirmation>( db, \"select * from purchase_order_confirmations where purchase_order_id=? order by purchase_order_line_id\", [purchaseOrderId], )",
      "insert( db, \"insert into stock_ledger(job_card_id,material_row_id,item_id,qty,type,by_user,at,note) values(0,0,?,-?,'po-closure-inward',?,datetime('now'),?)\", [line.item_id, acceptedQty, actorId, note], )",
      "insert( db, \"insert into stock_inwards(item_id,qty,note,purchase_order_id,purchase_order_line_id,ledger_id,received_by,received_at) values(?,?,?,?,?,?,?,datetime('now'))\", [line.item_id, acceptedQty, note, purchaseOrderId, line.id, ledgerId, actorId], )",
      "db.run( \"update purchase_orders set status='Closed',updated_at=datetime('now') where id=?\", [purchaseOrderId], )",
      "db.run(\"commit\")",
      "db.run(\"rollback\")"
    ],
    "body": "export function closePurchaseOrderForActor(\n  db: Database,\n  purchaseOrderId: number,\n  actorId: number,\n) {\n  assertPurchaseActor(db, actorId, true);\n  db.run(\"begin immediate transaction\");\n  try {\n    const order = one<PurchaseOrder>(\n      db,\n      \"select * from purchase_orders where id=?\",\n      [purchaseOrderId],\n    );\n    if (order.status === \"Closed\") {\n      const inwardIds = all<{ id: number }>(\n        db,\n        \"select id from stock_inwards where purchase_order_id=? order by id\",\n        [purchaseOrderId],\n      ).map((inward) => inward.id);\n      db.run(\"commit\");\n      return inwardIds;\n    }\n    if (order.status !== \"PO Confirmation\")\n      throw new Error(\"Only a fully confirmed Purchase Order can be closed.\");\n\n    const lines = all<PurchaseOrderLine>(\n      db,\n      \"select * from purchase_order_lines where purchase_order_id=? order by id\",\n      [purchaseOrderId],\n    );\n    const confirmations = all<PurchaseOrderConfirmation>(\n      db,\n      \"select * from purchase_order_confirmations where purchase_order_id=? order by purchase_order_line_id\",\n      [purchaseOrderId],\n    );\n    const confirmationForLine = new Map(\n      confirmations.map((confirmation) => [confirmation.purchase_order_line_id, confirmation]),\n    );\n    if (\n      !lines.length ||\n      confirmations.length !== lines.length ||\n      lines.some((line) => !confirmationForLine.has(line.id))\n    )\n      throw new Error(\"Every Purchase Order line must be confirmed before closure.\");\n\n    const inwardIds: number[] = [];\n    for (const line of lines) {\n      const acceptedQty = confirmationForLine.get(line.id)!.accepted_qty;\n      if (acceptedQty <= 0) continue;\n      const note = `Accepted on PO closure: ${order.po_number}`;\n      const ledgerId = insert(\n        db,\n        \"insert into stock_ledger(job_card_id,material_row_id,item_id,qty,type,by_user,at,note) values(0,0,?,-?,'po-closure-inward',?,datetime('now'),?)\",\n        [line.item_id, acceptedQty, actorId, note],\n      );\n      const inwardId = insert(\n        db,\n        \"insert into stock_inwards(item_id,qty,note,purchase_order_id,purchase_order_line_id,ledger_id,received_by,received_at) values(?,?,?,?,?,?,?,datetime('now'))\",\n        [line.item_id, acceptedQty, note, purchaseOrderId, line.id, ledgerId, actorId],\n      );\n      movement(db, 0, line.item_id, \"STOCK_IN\", acceptedQty, note);\n      inwardIds.push(inwardId);\n    }\n    db.run(\n      \"update purchase_orders set status='Closed',updated_at=datetime('now') where id=?\",\n      [purchaseOrderId],\n    );\n    db.run(\"commit\");\n    return inwardIds;\n  } catch (error) {\n    db.run(\"rollback\");\n    throw error;\n  }\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "purchaseOrderId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/closePurchaseOrderForActor",
    "service": "procurement/inventory; TX-08/09/10",
    "resolvedReturnType": "number[]"
  },
  {
    "id": "OP-db-createPurchaseOrderForActor",
    "name": "createPurchaseOrderForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:4428-4448",
    "calls": [
      "assertPurchaseActor",
      "assertPurchaseOrderInput",
      "insert",
      "input.po_number.trim",
      "input.notes?.trim",
      "replacePurchaseOrderLines"
    ],
    "sql": [
      "insert( db, \"insert into purchase_orders(supplier_id,po_number,order_date,notes,status,created_by,created_at,updated_at) values(?,?,?,?, 'Draft',?,datetime('now'),datetime('now'))\", [ input.supplier_id, input.po_number.trim(), input.order_date, input.notes?.trim() ?? \"\", actorId, ], )"
    ],
    "body": "export function createPurchaseOrderForActor(\n  db: Database,\n  actorId: number,\n  input: PurchaseOrderInput,\n) {\n  assertPurchaseActor(db, actorId, true);\n  assertPurchaseOrderInput(db, input);\n  const id = insert(\n    db,\n    \"insert into purchase_orders(supplier_id,po_number,order_date,notes,status,created_by,created_at,updated_at) values(?,?,?,?, 'Draft',?,datetime('now'),datetime('now'))\",\n    [\n      input.supplier_id,\n      input.po_number.trim(),\n      input.order_date,\n      input.notes?.trim() ?? \"\",\n      actorId,\n    ],\n  );\n  replacePurchaseOrderLines(db, id, input.lines);\n  return id;\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "input",
        "type": "PurchaseOrderInput",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/createPurchaseOrderForActor",
    "service": "procurement/inventory; TX-08/09/10",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-updatePurchaseOrderForActor",
    "name": "updatePurchaseOrderForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:4449-4475",
    "calls": [
      "assertPurchaseActor",
      "assertPurchaseOrderInput",
      "one",
      "db.run",
      "input.po_number.trim",
      "input.notes?.trim",
      "replacePurchaseOrderLines"
    ],
    "sql": [
      "one<PurchaseOrder>( db, \"select * from purchase_orders where id=?\", [id], )",
      "db.run( \"update purchase_orders set supplier_id=?,po_number=?,order_date=?,notes=?,updated_at=datetime('now') where id=?\", [ input.supplier_id, input.po_number.trim(), input.order_date, input.notes?.trim() ?? \"\", id, ], )"
    ],
    "body": "export function updatePurchaseOrderForActor(\n  db: Database,\n  id: number,\n  actorId: number,\n  input: PurchaseOrderInput,\n) {\n  assertPurchaseActor(db, actorId, true);\n  assertPurchaseOrderInput(db, input);\n  const order = one<PurchaseOrder>(\n    db,\n    \"select * from purchase_orders where id=?\",\n    [id],\n  );\n  if (order.status !== \"Draft\")\n    throw new Error(\"Only draft purchase orders can be edited.\");\n  db.run(\n    \"update purchase_orders set supplier_id=?,po_number=?,order_date=?,notes=?,updated_at=datetime('now') where id=?\",\n    [\n      input.supplier_id,\n      input.po_number.trim(),\n      input.order_date,\n      input.notes?.trim() ?? \"\",\n      id,\n    ],\n  );\n  replacePurchaseOrderLines(db, id, input.lines);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "id",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "input",
        "type": "PurchaseOrderInput",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/updatePurchaseOrderForActor",
    "service": "procurement/inventory; TX-08/09/10",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-setPurchaseOrderStatusForActor",
    "name": "setPurchaseOrderStatusForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:4476-4512",
    "calls": [
      "assertPurchaseActor",
      "one",
      "db.run",
      "[\"Draft\", \"Sent\", \"Partially Received\", \"Ready to Close\"].includes",
      "[\"Partially Received\", \"Ready to Close\", \"Sent\"].includes"
    ],
    "sql": [
      "one<PurchaseOrder>( db, \"select * from purchase_orders where id=?\", [id], )",
      "db.run( \"update purchase_orders set status='Sent',updated_at=datetime('now') where id=?\", [id], )",
      "db.run( \"update purchase_orders set status='Cancelled',updated_at=datetime('now') where id=?\", [id], )",
      "db.run( \"update purchase_orders set status='Closed',updated_at=datetime('now') where id=?\", [id], )"
    ],
    "body": "export function setPurchaseOrderStatusForActor(\n  db: Database,\n  id: number,\n  actorId: number,\n  action: \"send\" | \"cancel\" | \"close\",\n) {\n  assertPurchaseActor(db, actorId, true);\n  const order = one<PurchaseOrder>(\n    db,\n    \"select * from purchase_orders where id=?\",\n    [id],\n  );\n  if (action === \"send\" && order.status === \"Draft\")\n    db.run(\n      \"update purchase_orders set status='Sent',updated_at=datetime('now') where id=?\",\n      [id],\n    );\n  else if (\n    action === \"cancel\" &&\n    [\"Draft\", \"Sent\", \"Partially Received\", \"Ready to Close\"].includes(\n      order.status,\n    )\n  )\n    db.run(\n      \"update purchase_orders set status='Cancelled',updated_at=datetime('now') where id=?\",\n      [id],\n    );\n  else if (\n    action === \"close\" &&\n    [\"Partially Received\", \"Ready to Close\", \"Sent\"].includes(order.status)\n  )\n    db.run(\n      \"update purchase_orders set status='Closed',updated_at=datetime('now') where id=?\",\n      [id],\n    );\n  else throw new Error(`Cannot ${action} a ${order.status} purchase order.`);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "id",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "action",
        "type": "\"send\" | \"cancel\" | \"close\"",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/setPurchaseOrderStatusForActor",
    "service": "procurement/inventory; TX-08/09/10",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-recordStockInwardForActor",
    "name": "recordStockInwardForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:4553-4624",
    "calls": [
      "assertPurchaseActor",
      "Number.isFinite",
      "one",
      "db.run",
      "[\"Draft\", \"Cancelled\", \"Closed\"].includes",
      "order.status.startsWith",
      "input.note?.trim",
      "insert",
      "movement",
      "reconcilePurchaseOrder"
    ],
    "sql": [
      "one<InventoryItem>( db, \"select * from inventory where id=? and archived_at is null\", [input.item_id], )",
      "db.run(\"begin immediate transaction\")",
      "one<PurchaseOrderLine>( db, \"select * from purchase_order_lines where id=?\", [input.purchase_order_line_id], )",
      "one<PurchaseOrder>( db, \"select * from purchase_orders where id=?\", [line.purchase_order_id], )",
      "insert( db, \"insert into stock_ledger(job_card_id,material_row_id,item_id,qty,type,by_user,at,note) values(0,0,?,-?,'manual-inward',?,datetime('now'),?)\", [input.item_id, input.qty, actorId, note], )",
      "insert( db, \"insert into stock_inwards(item_id,qty,note,purchase_order_id,purchase_order_line_id,ledger_id,received_by,received_at) values(?,?,?,?,?,?,?,datetime('now'))\", [ input.item_id, input.qty, note, orderId, input.purchase_order_line_id ?? null, ledgerId, actorId, ], )",
      "db.run(\"commit\")",
      "db.run(\"rollback\")"
    ],
    "body": "export function recordStockInwardForActor(\n  db: Database,\n  actorId: number,\n  input: {\n    item_id: number;\n    qty: number;\n    note?: string;\n    purchase_order_line_id?: number;\n  },\n) {\n  assertPurchaseActor(db, actorId);\n  if (!Number.isFinite(input.qty) || input.qty <= 0)\n    throw new Error(\"Inward quantity must be greater than zero.\");\n  one<InventoryItem>(\n    db,\n    \"select * from inventory where id=? and archived_at is null\",\n    [input.item_id],\n  );\n  db.run(\"begin immediate transaction\");\n  try {\n    let orderId: number | null = null;\n    if (input.purchase_order_line_id) {\n      const line = one<PurchaseOrderLine>(\n        db,\n        \"select * from purchase_order_lines where id=?\",\n        [input.purchase_order_line_id],\n      );\n      if (line.item_id !== input.item_id)\n        throw new Error(\n          \"The selected PO line is for a different inventory item.\",\n        );\n      const order = one<PurchaseOrder>(\n        db,\n        \"select * from purchase_orders where id=?\",\n        [line.purchase_order_id],\n      );\n      if ([\"Draft\", \"Cancelled\", \"Closed\"].includes(order.status))\n        throw new Error(\"Select an open purchase order line.\");\n      if (order.status.startsWith(\"PO \"))\n        throw new Error(\n          \"Purchase Order Stock Inward is posted automatically when the confirmed PO closes.\",\n        );\n      orderId = order.id;\n    }\n    const note = input.note?.trim() || \"Stock inward\";\n    const ledgerId = insert(\n      db,\n      \"insert into stock_ledger(job_card_id,material_row_id,item_id,qty,type,by_user,at,note) values(0,0,?,-?,'manual-inward',?,datetime('now'),?)\",\n      [input.item_id, input.qty, actorId, note],\n    );\n    const inwardId = insert(\n      db,\n      \"insert into stock_inwards(item_id,qty,note,purchase_order_id,purchase_order_line_id,ledger_id,received_by,received_at) values(?,?,?,?,?,?,?,datetime('now'))\",\n      [\n        input.item_id,\n        input.qty,\n        note,\n        orderId,\n        input.purchase_order_line_id ?? null,\n        ledgerId,\n        actorId,\n      ],\n    );\n    movement(db, 0, input.item_id, \"STOCK_IN\", input.qty, note);\n    if (orderId) reconcilePurchaseOrder(db, orderId);\n    db.run(\"commit\");\n    return inwardId;\n  } catch (error) {\n    db.run(\"rollback\");\n    throw error;\n  }\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "input",
        "type": "{\n    item_id: number;\n    qty: number;\n    note?: string;\n    purchase_order_line_id?: number;\n  }",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/recordStockInwardForActor",
    "service": "procurement/inventory; TX-08/09/10",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-reviseInwardPurchaseForActor",
    "name": "reviseInwardPurchaseForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:4627-4737",
    "calls": [
      "assertPurchaseActor",
      "input.reason?.trim",
      "one",
      "[\"Submitted\", \"Received\"].includes",
      "db.run",
      "input.lines.forEach",
      "assertPurchaseLine",
      "scalar",
      "insert",
      "input.reason.trim",
      "maybe",
      "all",
      "priorLines.map",
      "nextByItem.set",
      "nextByItem.get",
      "Number",
      "totalsForPurchaseLine",
      "previousByItem.keys",
      "nextByItem.keys",
      "previousByItem.get",
      "movement"
    ],
    "sql": [
      "one<InwardPurchase>( db, \"select * from inward_purchases where id=?\", [purchaseId], )",
      "db.run(\"begin immediate transaction\")",
      "scalar<number>( db, \"select coalesce(max(revision_no),0)+1 from inward_purchase_revisions where purchase_id=?\", [purchaseId], )",
      "insert( db, \"insert into inward_purchase_revisions(purchase_id,revision_no,reason,revised_by,revised_at) values(?,?,?,?,datetime('now'))\", [purchaseId, revisionNo, input.reason.trim(), actorId], )",
      "maybe<{ id: number }>( db, \"select id from inward_purchase_revisions where purchase_id=? and id<>? order by revision_no desc limit 1\", [purchaseId, revisionId], )",
      "all<InwardPurchaseLine>( db, \"select item_id,received_qty,unit_cost,discount,gst_rate,subtotal,gst_amount,total,0 as id,0 as purchase_id from inward_purchase_revision_lines where revision_id=?\", [priorRevision.id], )",
      "all<InwardPurchaseLine>( db, \"select * from inward_purchase_lines where purchase_id=?\", [purchaseId], )",
      "insert( db, \"insert into inward_purchase_revision_lines(revision_id,item_id,received_qty,unit_cost,discount,gst_rate,subtotal,gst_amount,total) values(?,?,?,?,?,?,?,?,?)\", [ revisionId, line.item_id, values.qty, values.unitCost, values.discount, values.gstRate, values.subtotal, values.gstAmount, values.total, ], )",
      "db.run( \"insert into stock_ledger(job_card_id,material_row_id,item_id,qty,type,by_user,at,note,inward_purchase_line_id) values(0,0,?,-?,'inward-revision',?,datetime('now'),?,null)\", [ itemId, delta, actorId, `Inward receipt #${purchaseId} revision ${revisionNo}: ${input.reason.trim()}`, ], )",
      "insert( db, \"insert into inward_purchase_events(purchase_id,kind,actor_id,at,note) values(?,?,?,datetime('now'),?)\", [purchaseId, \"revised\", actorId, input.reason.trim()], )",
      "db.run(\"commit\")",
      "db.run(\"rollback\")"
    ],
    "body": "export function reviseInwardPurchaseForActor(\n  db: Database,\n  purchaseId: number,\n  actorId: number,\n  input: InwardPurchaseRevisionInput,\n) {\n  assertPurchaseActor(db, actorId, true);\n  if (!input.reason?.trim())\n    throw new Error(\"A correction reason is required.\");\n  const purchase = one<InwardPurchase>(\n    db,\n    \"select * from inward_purchases where id=?\",\n    [purchaseId],\n  );\n  if (![\"Submitted\", \"Received\"].includes(purchase.status))\n    throw new Error(\"Only received purchases can be revised.\");\n  if (!input.lines.length)\n    throw new Error(\"A revision requires one or more inventory lines.\");\n  db.run(\"begin immediate transaction\");\n  try {\n    input.lines.forEach((line) => assertPurchaseLine(db, line));\n    const revisionNo = scalar<number>(\n      db,\n      \"select coalesce(max(revision_no),0)+1 from inward_purchase_revisions where purchase_id=?\",\n      [purchaseId],\n    );\n    const revisionId = insert(\n      db,\n      \"insert into inward_purchase_revisions(purchase_id,revision_no,reason,revised_by,revised_at) values(?,?,?,?,datetime('now'))\",\n      [purchaseId, revisionNo, input.reason.trim(), actorId],\n    );\n    const priorRevision = maybe<{ id: number }>(\n      db,\n      \"select id from inward_purchase_revisions where purchase_id=? and id<>? order by revision_no desc limit 1\",\n      [purchaseId, revisionId],\n    );\n    const priorLines = priorRevision\n      ? all<InwardPurchaseLine>(\n          db,\n          \"select item_id,received_qty,unit_cost,discount,gst_rate,subtotal,gst_amount,total,0 as id,0 as purchase_id from inward_purchase_revision_lines where revision_id=?\",\n          [priorRevision.id],\n        )\n      : all<InwardPurchaseLine>(\n          db,\n          \"select * from inward_purchase_lines where purchase_id=?\",\n          [purchaseId],\n        );\n    const previousByItem = new Map(\n      priorLines.map((line) => [line.item_id, line.received_qty]),\n    );\n    const nextByItem = new Map<number, number>();\n    for (const line of input.lines)\n      nextByItem.set(\n        line.item_id,\n        (nextByItem.get(line.item_id) ?? 0) + Number(line.received_qty),\n      );\n    for (const line of input.lines) {\n      const values = totalsForPurchaseLine(line);\n      insert(\n        db,\n        \"insert into inward_purchase_revision_lines(revision_id,item_id,received_qty,unit_cost,discount,gst_rate,subtotal,gst_amount,total) values(?,?,?,?,?,?,?,?,?)\",\n        [\n          revisionId,\n          line.item_id,\n          values.qty,\n          values.unitCost,\n          values.discount,\n          values.gstRate,\n          values.subtotal,\n          values.gstAmount,\n          values.total,\n        ],\n      );\n    }\n    for (const itemId of new Set([\n      ...previousByItem.keys(),\n      ...nextByItem.keys(),\n    ])) {\n      const delta =\n        (nextByItem.get(itemId) ?? 0) - (previousByItem.get(itemId) ?? 0);\n      if (!delta) continue;\n      db.run(\n        \"insert into stock_ledger(job_card_id,material_row_id,item_id,qty,type,by_user,at,note,inward_purchase_line_id) values(0,0,?,-?,'inward-revision',?,datetime('now'),?,null)\",\n        [\n          itemId,\n          delta,\n          actorId,\n          `Inward receipt #${purchaseId} revision ${revisionNo}: ${input.reason.trim()}`,\n        ],\n      );\n      movement(\n        db,\n        0,\n        itemId,\n        \"INWARD_REVISION\",\n        delta,\n        `Inward receipt #${purchaseId} revision ${revisionNo}`,\n      );\n    }\n    insert(\n      db,\n      \"insert into inward_purchase_events(purchase_id,kind,actor_id,at,note) values(?,?,?,datetime('now'),?)\",\n      [purchaseId, \"revised\", actorId, input.reason.trim()],\n    );\n    db.run(\"commit\");\n    return revisionId;\n  } catch (error) {\n    db.run(\"rollback\");\n    throw error;\n  }\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "purchaseId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "input",
        "type": "InwardPurchaseRevisionInput",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/reviseInwardPurchaseForActor",
    "service": "procurement/inventory; TX-08/09/10",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-issueMaterialQty",
    "name": "issueMaterialQty",
    "file": "src/db.ts",
    "span": "src/db.ts:4739-4781",
    "calls": [
      "one",
      "approvalBlocksMaterialOperations",
      "materialApprovalForJob",
      "materialStockOnHand",
      "db.run",
      "ledger",
      "movement",
      "reconcileArtifactChecklist"
    ],
    "sql": [
      "one<MaterialRequest>( db, \"select * from material_requests where id=?\", [requestId], )",
      "one<JobCard>(db, \"select * from job_cards where id=?\", [ request.job_card_id, ])",
      "db.run( \"update material_requests set issued_qty=issued_qty + ?, status=case when issued_qty + ? >= requested_qty then 'Issued' else status end, updated_at=datetime('now') where id=?\", [qty, qty, requestId], )"
    ],
    "body": "export function issueMaterialQty(db: Database, requestId: number, qty: number) {\n  const request = one<MaterialRequest>(\n    db,\n    \"select * from material_requests where id=?\",\n    [requestId],\n  );\n  const job = one<JobCard>(db, \"select * from job_cards where id=?\", [\n    request.job_card_id,\n  ]);\n  if (\n    job.main_status !== \"IN_PROGRESS\" ||\n    approvalBlocksMaterialOperations(materialApprovalForJob(db, job.id))\n  )\n    throw new Error(\n      \"Material issue requires an IN_PROGRESS job with no pending or rejected approval.\",\n    );\n  const onHand = materialStockOnHand(db, request.item_id);\n  if (qty <= 0 || qty > onHand)\n    throw new Error(`Cannot issue ${qty}; stock available is ${onHand}`);\n  db.run(\n    \"update material_requests set issued_qty=issued_qty + ?, status=case when issued_qty + ? >= requested_qty then 'Issued' else status end, updated_at=datetime('now') where id=?\",\n    [qty, qty, requestId],\n  );\n  ledger(\n    db,\n    request.job_card_id,\n    requestId,\n    request.item_id,\n    qty,\n    \"issue\",\n    0,\n    \"Issued to job\",\n  );\n  movement(\n    db,\n    request.job_card_id,\n    request.item_id,\n    \"ISSUE\",\n    qty,\n    \"Issued to job\",\n  );\n  reconcileArtifactChecklist(db, request.job_card_id);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "requestId",
        "type": "number",
        "optional": false
      },
      {
        "name": "qty",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/issueMaterialQty",
    "service": "materials/inventory; TX-06/07/10",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-issueMaterial",
    "name": "issueMaterial",
    "file": "src/db.ts",
    "span": "src/db.ts:4783-4794",
    "calls": [
      "one",
      "issueMaterialQty",
      "Math.max"
    ],
    "sql": [
      "one<MaterialRequest>( db, \"select * from material_requests where id=?\", [requestId], )"
    ],
    "body": "export function issueMaterial(db: Database, requestId: number) {\n  const request = one<MaterialRequest>(\n    db,\n    \"select * from material_requests where id=?\",\n    [requestId],\n  );\n  issueMaterialQty(\n    db,\n    requestId,\n    Math.max(0, request.requested_qty - request.issued_qty),\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "requestId",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/issueMaterialQty",
    "service": "materials/inventory; TX-06/07/10",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-reconcileMaterialQty",
    "name": "reconcileMaterialQty",
    "file": "src/db.ts",
    "span": "src/db.ts:4796-4853",
    "calls": [
      "one",
      "quantities.some",
      "Number.isFinite",
      "db.run",
      "movement",
      "auditEvidence"
    ],
    "sql": [
      "one<MaterialRequest>( db, \"select * from material_requests where id=?\", [requestId], )",
      "db.run( \"update material_requests set used_qty=?, returned_qty=?, wasted_qty=?, updated_at=datetime('now') where id=?\", [used, returned, wasted, requestId], )",
      "db.run( \"insert into stock_ledger(job_card_id,material_row_id,item_id,qty,type,by_user,at,note) values(?,?,?,?,'return-adjustment',0,datetime('now'),?)\", [request.job_card_id, requestId, request.item_id, -returnDelta, note], )"
    ],
    "body": "export function reconcileMaterialQty(\n  db: Database,\n  requestId: number,\n  used: number,\n  returned: number,\n  wasted: number,\n) {\n  const request = one<MaterialRequest>(\n    db,\n    \"select * from material_requests where id=?\",\n    [requestId],\n  );\n  const quantities = [used, returned, wasted];\n  if (quantities.some((quantity) => !Number.isFinite(quantity) || quantity < 0))\n    throw new Error(\n      \"Reconciliation quantities must be finite, non-negative numbers.\",\n    );\n  if (used + returned + wasted > request.issued_qty)\n    throw new Error(\n      `Reconciliation total cannot exceed the ${request.issued_qty} issued.`,\n    );\n  db.run(\n    \"update material_requests set used_qty=?, returned_qty=?, wasted_qty=?, updated_at=datetime('now') where id=?\",\n    [used, returned, wasted, requestId],\n  );\n  const returnDelta = returned - request.returned_qty;\n  if (returnDelta !== 0) {\n    const note =\n      returnDelta > 0\n        ? \"Returned after job reconciliation\"\n        : \"Return reduced after job reconciliation\";\n    db.run(\n      \"insert into stock_ledger(job_card_id,material_row_id,item_id,qty,type,by_user,at,note) values(?,?,?,?,'return-adjustment',0,datetime('now'),?)\",\n      [request.job_card_id, requestId, request.item_id, -returnDelta, note],\n    );\n    movement(\n      db,\n      request.job_card_id,\n      request.item_id,\n      \"RETURN\",\n      returnDelta,\n      note,\n    );\n  }\n  const wasteDelta = wasted - request.wasted_qty;\n  if (wasteDelta !== 0)\n    movement(\n      db,\n      request.job_card_id,\n      request.item_id,\n      \"WASTAGE\",\n      wasteDelta,\n      wasteDelta > 0\n        ? \"Recorded wastage\"\n        : \"Wastage reduced after job reconciliation\",\n    );\n  auditEvidence(db, request.job_card_id, \"Material reconciled\");\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "requestId",
        "type": "number",
        "optional": false
      },
      {
        "name": "used",
        "type": "number",
        "optional": false
      },
      {
        "name": "returned",
        "type": "number",
        "optional": false
      },
      {
        "name": "wasted",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/reconcileMaterialQty",
    "service": "materials/inventory; TX-06/07/10",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-reconcileMaterial",
    "name": "reconcileMaterial",
    "file": "src/db.ts",
    "span": "src/db.ts:4855-4863",
    "calls": [
      "reconcileMaterialQty"
    ],
    "sql": [],
    "body": "export function reconcileMaterial(\n  db: Database,\n  requestId: number,\n  used: number,\n  returned: number,\n  wasted: number,\n) {\n  reconcileMaterialQty(db, requestId, used, returned, wasted);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "requestId",
        "type": "number",
        "optional": false
      },
      {
        "name": "used",
        "type": "number",
        "optional": false
      },
      {
        "name": "returned",
        "type": "number",
        "optional": false
      },
      {
        "name": "wasted",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/reconcileMaterialQty",
    "service": "materials/inventory; TX-06/07/10",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-approvalBlocksMaterialOperations",
    "name": "approvalBlocksMaterialOperations",
    "file": "src/db.ts",
    "span": "src/db.ts:4884-4888",
    "calls": [],
    "sql": [],
    "body": "export function approvalBlocksMaterialOperations(\n  approval?: Pick<MaterialApproval, \"status\"> | null,\n) {\n  return approval?.status === \"Pending\" || approval?.status === \"Rejected\";\n}",
    "parameters": [
      {
        "name": "approval",
        "type": "Pick<MaterialApproval, \"status\"> | null",
        "optional": true
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "materials/inventory; TX-06/07/10",
    "resolvedReturnType": "boolean"
  },
  {
    "id": "OP-db-submitMaterialApprovalForActor",
    "name": "submitMaterialApprovalForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:4921-4970",
    "calls": [
      "actorAndJob",
      "[\"Requested\", \"Re-requested\"].includes",
      "materialRowStatus",
      "materialApprovalForJob",
      "insert",
      "one",
      "approvalEvent",
      "transitionJobStatusInternal"
    ],
    "sql": [
      "insert( db, \"insert into material_approvals(job_card_id,status,submitted_by,submitted_at,revision) values(?,'Pending',?,datetime('now'),1)\", [job.id, actorId], )",
      "one<MaterialApproval>( db, \"select * from material_approvals where id=?\", [approvalId], )"
    ],
    "body": "export function submitMaterialApprovalForActor(\n  db: Database,\n  rowId: number,\n  actorId: number,\n) {\n  const { row, actor, job } = actorAndJob(db, rowId, actorId);\n  if (actor.role !== \"store\")\n    throw new Error(\"Only Store can submit a material approval.\");\n  if (\n    row.invoiced_in ||\n    ![\"Requested\", \"Re-requested\"].includes(materialRowStatus(row))\n  )\n    throw new Error(\n      \"Only non-invoiced Requested or Re-requested material can be submitted for approval.\",\n    );\n  const existing = materialApprovalForJob(db, job.id);\n  if (existing?.status === \"Pending\") return existing.id;\n  if (job.main_status !== \"IN_PROGRESS\")\n    throw new Error(\n      \"Material approval can only be submitted for an IN_PROGRESS job.\",\n    );\n  if (existing)\n    throw new Error(\n      \"The rejected approval must be corrected and resubmitted by the linked Service Advisor.\",\n    );\n  const approvalId = insert(\n    db,\n    \"insert into material_approvals(job_card_id,status,submitted_by,submitted_at,revision) values(?,'Pending',?,datetime('now'),1)\",\n    [job.id, actorId],\n  );\n  const approval = one<MaterialApproval>(\n    db,\n    \"select * from material_approvals where id=?\",\n    [approvalId],\n  );\n  approvalEvent(\n    db,\n    approval,\n    \"Submitted\",\n    actorId,\n    \"Store requested material approval\",\n  );\n  transitionJobStatusInternal(\n    db,\n    job.id,\n    \"HOLD\",\n    \"Material approval pending: Store submitted consolidated request\",\n  );\n  return approvalId;\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "rowId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/submitMaterialApprovalForActor",
    "service": "materials/inventory; TX-06/07/10",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-decideMaterialApprovalForActor",
    "name": "decideMaterialApprovalForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:4972-5039",
    "calls": [
      "one",
      "materialApprovalForJob",
      "rejectionReason.trim",
      "new Date().toISOString",
      "db.run",
      "approvalEvent",
      "transitionJobStatusInternal",
      "history"
    ],
    "sql": [
      "one<User>( db, \"select * from users where id=? and archived_at is null\", [actorId], )",
      "one<JobCard>( db, \"select * from job_cards where id=? and archived_at is null\", [jobId], )",
      "db.run( \"update material_approvals set status=?,reviewed_by=?,reviewed_at=?,rejection_reason=? where id=?\", [ decision, actorId, now, decision === \"Rejected\" ? reason : null, approval.id, ], )",
      "one<MaterialApproval>( db, \"select * from material_approvals where id=?\", [approval.id], )"
    ],
    "body": "export function decideMaterialApprovalForActor(\n  db: Database,\n  jobId: number,\n  actorId: number,\n  decision: \"Approved\" | \"Rejected\",\n  rejectionReason = \"\",\n) {\n  const actor = one<User>(\n    db,\n    \"select * from users where id=? and archived_at is null\",\n    [actorId],\n  );\n  if (actor.role !== \"admin\")\n    throw new Error(\"Only Admin can decide material approvals.\");\n  const approval = materialApprovalForJob(db, jobId);\n  const job = one<JobCard>(\n    db,\n    \"select * from job_cards where id=? and archived_at is null\",\n    [jobId],\n  );\n  if (!approval || approval.status !== \"Pending\")\n    throw new Error(\"There is no pending material approval for this job.\");\n  if (job.main_status !== \"HOLD\")\n    throw new Error(\"A pending material approval must keep the job on HOLD.\");\n  const reason = rejectionReason.trim();\n  if (decision === \"Rejected\" && !reason)\n    throw new Error(\"A rejection reason is required.\");\n  const now = new Date().toISOString();\n  db.run(\n    \"update material_approvals set status=?,reviewed_by=?,reviewed_at=?,rejection_reason=? where id=?\",\n    [\n      decision,\n      actorId,\n      now,\n      decision === \"Rejected\" ? reason : null,\n      approval.id,\n    ],\n  );\n  const reviewed = one<MaterialApproval>(\n    db,\n    \"select * from material_approvals where id=?\",\n    [approval.id],\n  );\n  approvalEvent(\n    db,\n    reviewed,\n    decision,\n    actorId,\n    decision === \"Approved\" ? \"Admin approved material issue\" : reason,\n  );\n  if (decision === \"Approved\")\n    transitionJobStatusInternal(\n      db,\n      jobId,\n      \"IN_PROGRESS\",\n      \"Material approval approved: Store may issue retained requests\",\n      now,\n    );\n  else\n    history(\n      db,\n      jobId,\n      \"HOLD\",\n      job.sub_status,\n      `Material approval rejected: ${reason}`,\n      now,\n    );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "jobId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "decision",
        "type": "\"Approved\" | \"Rejected\"",
        "optional": false
      },
      {
        "name": "rejectionReason",
        "type": "INFERRED",
        "optional": true,
        "default": "\"\""
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/decideMaterialApprovalForActor",
    "service": "materials/inventory; TX-06/07/10",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-resubmitMaterialApprovalForActor",
    "name": "resubmitMaterialApprovalForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:5041-5094",
    "calls": [
      "one",
      "materialApprovalForJob",
      "outstandingMaterialRows",
      "new Date().toISOString",
      "db.run",
      "approvalEvent",
      "history"
    ],
    "sql": [
      "one<User>( db, \"select * from users where id=? and archived_at is null\", [actorId], )",
      "one<JobCard>( db, \"select * from job_cards where id=? and archived_at is null\", [jobId], )",
      "db.run( \"update material_approvals set status='Pending',submitted_by=?,submitted_at=?,reviewed_by=null,reviewed_at=null,rejection_reason=null,revision=revision+1 where id=?\", [actorId, now, approval.id], )",
      "one<MaterialApproval>( db, \"select * from material_approvals where id=?\", [approval.id], )"
    ],
    "body": "export function resubmitMaterialApprovalForActor(\n  db: Database,\n  jobId: number,\n  actorId: number,\n) {\n  const actor = one<User>(\n    db,\n    \"select * from users where id=? and archived_at is null\",\n    [actorId],\n  );\n  const job = one<JobCard>(\n    db,\n    \"select * from job_cards where id=? and archived_at is null\",\n    [jobId],\n  );\n  const approval = materialApprovalForJob(db, jobId);\n  if (actor.role !== \"service\" || actor.id !== job.advisor_id)\n    throw new Error(\n      \"Only the linked Service Advisor can resubmit a rejected material approval.\",\n    );\n  if (!approval || approval.status !== \"Rejected\" || job.main_status !== \"HOLD\")\n    throw new Error(\n      \"Only a rejected held job can be resubmitted for approval.\",\n    );\n  if (!outstandingMaterialRows(db, jobId).length)\n    throw new Error(\n      \"Add or correct a Requested material row before resubmitting.\",\n    );\n  const now = new Date().toISOString();\n  db.run(\n    \"update material_approvals set status='Pending',submitted_by=?,submitted_at=?,reviewed_by=null,reviewed_at=null,rejection_reason=null,revision=revision+1 where id=?\",\n    [actorId, now, approval.id],\n  );\n  const resubmitted = one<MaterialApproval>(\n    db,\n    \"select * from material_approvals where id=?\",\n    [approval.id],\n  );\n  approvalEvent(\n    db,\n    resubmitted,\n    \"Resubmitted\",\n    actorId,\n    \"Service Advisor corrected and resubmitted material approval\",\n  );\n  history(\n    db,\n    jobId,\n    \"HOLD\",\n    job.sub_status,\n    \"Material approval resubmitted and pending\",\n    now,\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "jobId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/resubmitMaterialApprovalForActor",
    "service": "materials/inventory; TX-06/07/10",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-materialStockOnHand",
    "name": "materialStockOnHand",
    "file": "src/db.ts",
    "span": "src/db.ts:5154-5160",
    "calls": [
      "scalar"
    ],
    "sql": [
      "scalar<number>( db, \"select stock_qty - coalesce((select sum(qty) from stock_ledger where item_id=inventory.id),0) from inventory where id=?\", [itemId], )"
    ],
    "body": "export function materialStockOnHand(db: Database, itemId: number) {\n  return scalar<number>(\n    db,\n    \"select stock_qty - coalesce((select sum(qty) from stock_ledger where item_id=inventory.id),0) from inventory where id=?\",\n    [itemId],\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "itemId",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "READ",
    "endpoint": "GET /api/v1/ui/state",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-addMaterialRowForActor",
    "name": "addMaterialRowForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:5162-5176",
    "calls": [
      "assertMaterialManager",
      "assertMaterialInput",
      "insert"
    ],
    "sql": [
      "insert( db, \"insert into material_requests(job_card_id,item_id,requested_qty,issued_qty,used_qty,returned_qty,wasted_qty,status,created_at,updated_at) values(?,?,?,0,0,0,0,'Draft',datetime('now'),datetime('now'))\", [jobId, itemId, qty], )"
    ],
    "body": "export function addMaterialRowForActor(\n  db: Database,\n  jobId: number,\n  actorId: number,\n  itemId: number,\n  qty: number,\n) {\n  assertMaterialManager(db, jobId, actorId);\n  assertMaterialInput(db, itemId, qty);\n  return insert(\n    db,\n    \"insert into material_requests(job_card_id,item_id,requested_qty,issued_qty,used_qty,returned_qty,wasted_qty,status,created_at,updated_at) values(?,?,?,0,0,0,0,'Draft',datetime('now'),datetime('now'))\",\n    [jobId, itemId, qty],\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "jobId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "itemId",
        "type": "number",
        "optional": false
      },
      {
        "name": "qty",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/addMaterialRowForActor",
    "service": "materials/inventory; TX-06/07/10",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-updateMaterialRowForActor",
    "name": "updateMaterialRowForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:5178-5191",
    "calls": [
      "materialRowFor",
      "assertMaterialInput",
      "db.run"
    ],
    "sql": [
      "db.run( \"update material_requests set item_id=?, requested_qty=?, updated_at=datetime('now') where id=?\", [itemId, qty, rowId], )"
    ],
    "body": "export function updateMaterialRowForActor(\n  db: Database,\n  rowId: number,\n  actorId: number,\n  itemId: number,\n  qty: number,\n) {\n  materialRowFor(db, rowId, actorId, \"edit\");\n  assertMaterialInput(db, itemId, qty);\n  db.run(\n    \"update material_requests set item_id=?, requested_qty=?, updated_at=datetime('now') where id=?\",\n    [itemId, qty, rowId],\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "rowId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "itemId",
        "type": "number",
        "optional": false
      },
      {
        "name": "qty",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/updateMaterialRowForActor",
    "service": "materials/inventory; TX-06/07/10",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-deleteMaterialRowForActor",
    "name": "deleteMaterialRowForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:5193-5200",
    "calls": [
      "materialRowFor",
      "db.run"
    ],
    "sql": [
      "db.run(\"delete from material_requests where id=?\", [rowId])"
    ],
    "body": "export function deleteMaterialRowForActor(\n  db: Database,\n  rowId: number,\n  actorId: number,\n) {\n  materialRowFor(db, rowId, actorId, \"delete\");\n  db.run(\"delete from material_requests where id=?\", [rowId]);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "rowId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/deleteMaterialRowForActor",
    "service": "materials/inventory; TX-06/07/10",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-requestMaterialRowForActor",
    "name": "requestMaterialRowForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:5231-5242",
    "calls": [
      "materialRowFor",
      "db.run",
      "afterMaterialRequest"
    ],
    "sql": [
      "db.run( \"update material_requests set status='Requested', updated_at=datetime('now') where id=?\", [rowId], )"
    ],
    "body": "export function requestMaterialRowForActor(\n  db: Database,\n  rowId: number,\n  actorId: number,\n) {\n  const row = materialRowFor(db, rowId, actorId, \"request\");\n  db.run(\n    \"update material_requests set status='Requested', updated_at=datetime('now') where id=?\",\n    [rowId],\n  );\n  return afterMaterialRequest(db, row, actorId);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "rowId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/requestMaterialRowForActor",
    "service": "materials/inventory; TX-06/07/10",
    "resolvedReturnType": "{ onHand: number; warning: string | undefined; }"
  },
  {
    "id": "OP-db-reRequestMaterialRowForActor",
    "name": "reRequestMaterialRowForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:5245-5265",
    "calls": [
      "materialRowFor",
      "assertMaterialInput",
      "db.run",
      "afterMaterialRequest",
      "one"
    ],
    "sql": [
      "db.run( \"update material_requests set item_id=?, requested_qty=?, status='Re-requested', updated_at=datetime('now') where id=?\", [itemId, qty, rowId], )",
      "one<MaterialRequest>(db, \"select * from material_requests where id=?\", [ rowId, ])"
    ],
    "body": "export function reRequestMaterialRowForActor(\n  db: Database,\n  rowId: number,\n  actorId: number,\n  itemId: number,\n  qty: number,\n) {\n  materialRowFor(db, rowId, actorId, \"re-request\");\n  assertMaterialInput(db, itemId, qty);\n  db.run(\n    \"update material_requests set item_id=?, requested_qty=?, status='Re-requested', updated_at=datetime('now') where id=?\",\n    [itemId, qty, rowId],\n  );\n  return afterMaterialRequest(\n    db,\n    one<MaterialRequest>(db, \"select * from material_requests where id=?\", [\n      rowId,\n    ]),\n    actorId,\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "rowId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "itemId",
        "type": "number",
        "optional": false
      },
      {
        "name": "qty",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/reRequestMaterialRowForActor",
    "service": "materials/inventory; TX-06/07/10",
    "resolvedReturnType": "{ onHand: number; warning: string | undefined; }"
  },
  {
    "id": "OP-db-releaseMaterialRowForActor",
    "name": "releaseMaterialRowForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:5303-5357",
    "calls": [
      "actorAndJob",
      "materialApprovalForJob",
      "approvalBlocksMaterialOperations",
      "approval!.status.toLowerCase",
      "canReleaseMaterialRows",
      "materialRowActionsFor(actor, job, row).includes",
      "materialRowActionsFor",
      "materialRowStatus",
      "materialStockOnHand",
      "db.run",
      "ledger",
      "new Date().toISOString",
      "reconcileArtifactChecklist"
    ],
    "sql": [
      "db.run( \"update material_requests set status='Issued', issued_qty=requested_qty, updated_at=datetime('now') where id=?\", [rowId], )",
      "db.run( \"insert into material_events(job_card_id,material_row_id,kind,by_user,at,note,old_item_id,old_qty,new_item_id,new_qty) values(?,?,?,?,?,?,?,?,?,?)\", [ job.id, rowId, \"release\", actorId, new Date().toISOString(), \"Released to job\", null, null, row.item_id, row.requested_qty, ], )"
    ],
    "body": "export function releaseMaterialRowForActor(\n  db: Database,\n  rowId: number,\n  actorId: number,\n) {\n  const { row, actor, job } = actorAndJob(db, rowId, actorId);\n  const approval = materialApprovalForJob(db, job.id);\n  if (approvalBlocksMaterialOperations(approval))\n    throw new Error(\n      `Material issue is blocked while approval is ${approval!.status.toLowerCase()}.`,\n    );\n  if (!canReleaseMaterialRows(actor, job) || job.main_status !== \"IN_PROGRESS\")\n    throw new Error(\n      \"Only Store or the Owner can release material while the job card is IN_PROGRESS.\",\n    );\n  if (!materialRowActionsFor(actor, job, row).includes(\"release\"))\n    throw new Error(\n      `A ${materialRowStatus(row)} material row cannot be released.`,\n    );\n  const onHand = materialStockOnHand(db, row.item_id);\n  if (row.requested_qty > onHand)\n    throw new Error(\n      `Cannot release ${row.requested_qty}; only ${onHand} in stock.`,\n    );\n  db.run(\n    \"update material_requests set status='Issued', issued_qty=requested_qty, updated_at=datetime('now') where id=?\",\n    [rowId],\n  );\n  ledger(\n    db,\n    job.id,\n    rowId,\n    row.item_id,\n    row.requested_qty,\n    \"issue\",\n    actorId,\n    \"Released to job\",\n  );\n  db.run(\n    \"insert into material_events(job_card_id,material_row_id,kind,by_user,at,note,old_item_id,old_qty,new_item_id,new_qty) values(?,?,?,?,?,?,?,?,?,?)\",\n    [\n      job.id,\n      rowId,\n      \"release\",\n      actorId,\n      new Date().toISOString(),\n      \"Released to job\",\n      null,\n      null,\n      row.item_id,\n      row.requested_qty,\n    ],\n  );\n  reconcileArtifactChecklist(db, job.id, actorId);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "rowId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/releaseMaterialRowForActor",
    "service": "materials/inventory; TX-06/07/10",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-editIssuedMaterialRowForActor",
    "name": "editIssuedMaterialRowForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:5360-5423",
    "calls": [
      "actorAndJob",
      "canEditIssuedMaterialRows",
      "materialRowActionsFor(actor, job, row).includes",
      "materialRowActionsFor",
      "materialRowStatus",
      "note.trim",
      "assertMaterialInput",
      "materialStockOnHand",
      "ledger",
      "db.run",
      "new Date().toISOString"
    ],
    "sql": [
      "db.run( \"update material_requests set item_id=?, requested_qty=?, issued_qty=?, updated_at=datetime('now') where id=?\", [itemId, qty, qty, rowId], )",
      "db.run( \"insert into material_events(job_card_id,material_row_id,kind,by_user,at,note,old_item_id,old_qty,new_item_id,new_qty) values(?,?,?,?,?,?,?,?,?,?)\", [ job.id, rowId, \"issued-edit\", actorId, new Date().toISOString(), reason, oldItem, oldQty, itemId, qty, ], )"
    ],
    "body": "export function editIssuedMaterialRowForActor(\n  db: Database,\n  rowId: number,\n  actorId: number,\n  itemId: number,\n  qty: number,\n  note: string,\n) {\n  const { row, actor, job } = actorAndJob(db, rowId, actorId);\n  if (!canEditIssuedMaterialRows(actor, job))\n    throw new Error(\n      \"Only Store, the Owner or the linked Service Advisor can edit an Issued row.\",\n    );\n  if (!materialRowActionsFor(actor, job, row).includes(\"edit-issued\"))\n    throw new Error(\n      `A ${materialRowStatus(row)} material row cannot be edited this way.`,\n    );\n  if (!note.trim())\n    throw new Error(\"A note is required to edit an Issued row.\");\n  assertMaterialInput(db, itemId, qty);\n  const oldItem = row.item_id,\n    oldQty = row.issued_qty || row.requested_qty;\n  if (itemId === oldItem && qty === oldQty) throw new Error(\"Nothing changed.\");\n  const needed = itemId === oldItem ? qty - oldQty : qty;\n  if (needed > 0 && needed > materialStockOnHand(db, itemId))\n    throw new Error(\n      `Cannot issue ${needed} more; only ${materialStockOnHand(db, itemId)} in stock.`,\n    );\n  const reason = note.trim();\n  if (itemId === oldItem)\n    ledger(\n      db,\n      job.id,\n      rowId,\n      itemId,\n      qty - oldQty,\n      \"adjustment\",\n      actorId,\n      reason,\n    );\n  else {\n    ledger(db, job.id, rowId, oldItem, -oldQty, \"adjustment\", actorId, reason);\n    ledger(db, job.id, rowId, itemId, qty, \"adjustment\", actorId, reason);\n  }\n  db.run(\n    \"update material_requests set item_id=?, requested_qty=?, issued_qty=?, updated_at=datetime('now') where id=?\",\n    [itemId, qty, qty, rowId],\n  );\n  db.run(\n    \"insert into material_events(job_card_id,material_row_id,kind,by_user,at,note,old_item_id,old_qty,new_item_id,new_qty) values(?,?,?,?,?,?,?,?,?,?)\",\n    [\n      job.id,\n      rowId,\n      \"issued-edit\",\n      actorId,\n      new Date().toISOString(),\n      reason,\n      oldItem,\n      oldQty,\n      itemId,\n      qty,\n    ],\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "rowId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "itemId",
        "type": "number",
        "optional": false
      },
      {
        "name": "qty",
        "type": "number",
        "optional": false
      },
      {
        "name": "note",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/editIssuedMaterialRowForActor",
    "service": "materials/inventory; TX-06/07/10",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-cancelMaterialRowForActor",
    "name": "cancelMaterialRowForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:5426-5437",
    "calls": [
      "materialRowFor",
      "db.run",
      "reconcileArtifactChecklist"
    ],
    "sql": [
      "db.run( \"update material_requests set status='Cancelled', updated_at=datetime('now') where id=?\", [rowId], )"
    ],
    "body": "export function cancelMaterialRowForActor(\n  db: Database,\n  rowId: number,\n  actorId: number,\n) {\n  const row = materialRowFor(db, rowId, actorId, \"cancel\");\n  db.run(\n    \"update material_requests set status='Cancelled', updated_at=datetime('now') where id=?\",\n    [rowId],\n  );\n  reconcileArtifactChecklist(db, row.job_card_id, actorId);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "rowId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/cancelMaterialRowForActor",
    "service": "materials/inventory; TX-06/07/10",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-createInventoryItem",
    "name": "createInventoryItem",
    "file": "src/db.ts",
    "span": "src/db.ts:5439-5456",
    "calls": [
      "insert"
    ],
    "sql": [
      "insert( db, \"insert into inventory(sku, category, name, unit, stock_qty, low_stock_qty, selling_price, created_at, updated_at) values (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))\", [ payload.sku, payload.category, payload.name, payload.unit, payload.stock_qty, payload.low_stock_qty, payload.selling_price, ], )"
    ],
    "body": "export function createInventoryItem(\n  db: Database,\n  payload: Omit<InventoryItem, \"id\">,\n) {\n  return insert(\n    db,\n    \"insert into inventory(sku, category, name, unit, stock_qty, low_stock_qty, selling_price, created_at, updated_at) values (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))\",\n    [\n      payload.sku,\n      payload.category,\n      payload.name,\n      payload.unit,\n      payload.stock_qty,\n      payload.low_stock_qty,\n      payload.selling_price,\n    ],\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "payload",
        "type": "Omit<InventoryItem, \"id\">",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/createInventoryItem",
    "service": "materials/inventory; TX-06/07/10",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-updateInventoryItem",
    "name": "updateInventoryItem",
    "file": "src/db.ts",
    "span": "src/db.ts:5458-5475",
    "calls": [
      "db.run"
    ],
    "sql": [
      "db.run( \"update inventory set sku=?, category=?, name=?, unit=?, low_stock_qty=?, selling_price=?, updated_at=datetime('now') where id=?\", [ payload.sku, payload.category, payload.name, payload.unit, payload.low_stock_qty, payload.selling_price, id, ], )"
    ],
    "body": "export function updateInventoryItem(\n  db: Database,\n  id: number,\n  payload: Omit<InventoryItem, \"id\">,\n) {\n  db.run(\n    \"update inventory set sku=?, category=?, name=?, unit=?, low_stock_qty=?, selling_price=?, updated_at=datetime('now') where id=?\",\n    [\n      payload.sku,\n      payload.category,\n      payload.name,\n      payload.unit,\n      payload.low_stock_qty,\n      payload.selling_price,\n      id,\n    ],\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "id",
        "type": "number",
        "optional": false
      },
      {
        "name": "payload",
        "type": "Omit<InventoryItem, \"id\">",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/updateInventoryItem",
    "service": "materials/inventory; TX-06/07/10",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-archiveInventoryItem",
    "name": "archiveInventoryItem",
    "file": "src/db.ts",
    "span": "src/db.ts:5477-5479",
    "calls": [
      "archive"
    ],
    "sql": [],
    "body": "export function archiveInventoryItem(db: Database, id: number, reason: string) {\n  archive(db, \"inventory\", id, reason);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "id",
        "type": "number",
        "optional": false
      },
      {
        "name": "reason",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/archiveInventoryItem",
    "service": "materials/inventory; TX-06/07/10",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-stockIn",
    "name": "stockIn",
    "file": "src/db.ts",
    "span": "src/db.ts:5482-5500",
    "calls": [
      "Number.isFinite",
      "one",
      "db.run",
      "movement"
    ],
    "sql": [
      "one<InventoryItem>( db, \"select * from inventory where id=? and archived_at is null\", [itemId], )",
      "db.run( \"insert into stock_ledger(job_card_id,material_row_id,item_id,qty,type,by_user,at,note) values(0,0,?,-?,'manual-inward',0,datetime('now'),?)\", [itemId, qty, note \\|\\| \"Manual stock-in\"], )"
    ],
    "body": "export function stockIn(\n  db: Database,\n  itemId: number,\n  qty: number,\n  note: string,\n) {\n  if (!Number.isFinite(qty) || qty <= 0)\n    throw new Error(\"Inward quantity must be greater than zero.\");\n  one<InventoryItem>(\n    db,\n    \"select * from inventory where id=? and archived_at is null\",\n    [itemId],\n  );\n  db.run(\n    \"insert into stock_ledger(job_card_id,material_row_id,item_id,qty,type,by_user,at,note) values(0,0,?,-?,'manual-inward',0,datetime('now'),?)\",\n    [itemId, qty, note || \"Manual stock-in\"],\n  );\n  movement(db, 0, itemId, \"STOCK_IN\", qty, note || \"Stock-in\");\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "itemId",
        "type": "number",
        "optional": false
      },
      {
        "name": "qty",
        "type": "number",
        "optional": false
      },
      {
        "name": "note",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/stockIn",
    "service": "materials/inventory; TX-06/07/10",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-adjustStock",
    "name": "adjustStock",
    "file": "src/db.ts",
    "span": "src/db.ts:5502-5525",
    "calls": [
      "Number.isFinite",
      "materialStockOnHand",
      "db.run",
      "movement"
    ],
    "sql": [
      "db.run( \"insert into stock_ledger(job_card_id,material_row_id,item_id,qty,type,by_user,at,note) values(0,0,?,?, 'manual-adjustment',0,datetime('now'),?)\", [itemId, delta, note \\|\\| \"Stock adjustment\"], )"
    ],
    "body": "export function adjustStock(\n  db: Database,\n  itemId: number,\n  qty: number,\n  note: string,\n) {\n  if (!Number.isFinite(qty) || qty < 0)\n    throw new Error(\"Adjusted stock must be zero or greater.\");\n  const onHand = materialStockOnHand(db, itemId);\n  const delta = onHand - qty;\n  if (delta)\n    db.run(\n      \"insert into stock_ledger(job_card_id,material_row_id,item_id,qty,type,by_user,at,note) values(0,0,?,?, 'manual-adjustment',0,datetime('now'),?)\",\n      [itemId, delta, note || \"Stock adjustment\"],\n    );\n  movement(\n    db,\n    0,\n    itemId,\n    \"ADJUSTMENT\",\n    qty - onHand,\n    note || \"Stock adjustment\",\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "itemId",
        "type": "number",
        "optional": false
      },
      {
        "name": "qty",
        "type": "number",
        "optional": false
      },
      {
        "name": "note",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/adjustStock",
    "service": "materials/inventory; TX-06/07/10",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-createTask",
    "name": "createTask",
    "file": "src/db.ts",
    "span": "src/db.ts:5527-5539",
    "calls": [
      "insert"
    ],
    "sql": [
      "insert( db, \"insert into tasks(job_card_id, technician_id, title, status, notes, created_at, updated_at) values (?, ?, ?, ?, ?, datetime('now'), datetime('now'))\", [ payload.job_card_id, payload.technician_id, payload.title, payload.status, payload.notes, ], )"
    ],
    "body": "export function createTask(db: Database, payload: Omit<Task, \"id\">) {\n  return insert(\n    db,\n    \"insert into tasks(job_card_id, technician_id, title, status, notes, created_at, updated_at) values (?, ?, ?, ?, ?, datetime('now'), datetime('now'))\",\n    [\n      payload.job_card_id,\n      payload.technician_id,\n      payload.title,\n      payload.status,\n      payload.notes,\n    ],\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "payload",
        "type": "Omit<Task, \"id\">",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/createTask",
    "service": "execution/checklists; TX-11",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-updateTask",
    "name": "updateTask",
    "file": "src/db.ts",
    "span": "src/db.ts:5541-5562",
    "calls": [
      "one",
      "db.run",
      "auditEvidence",
      "reconcileArtifactChecklist"
    ],
    "sql": [
      "one<Task>(db, \"select * from tasks where id=?\", [taskId])",
      "db.run( `update tasks set status=?, notes=?, updated_at=datetime('now')${timeColumn ? `, ${timeColumn}=coalesce(${timeColumn}, datetime('now'))` : \"\"} where id=?`, [status, notes, taskId], )"
    ],
    "body": "export function updateTask(\n  db: Database,\n  taskId: number,\n  status: TaskStatus,\n  notes: string,\n) {\n  const task = one<Task>(db, \"select * from tasks where id=?\", [taskId]);\n  const timeColumn =\n    status === \"Started\"\n      ? \"started_at\"\n      : status === \"Paused\"\n        ? \"paused_at\"\n        : status === \"Completed\"\n          ? \"completed_at\"\n          : \"\";\n  db.run(\n    `update tasks set status=?, notes=?, updated_at=datetime('now')${timeColumn ? `, ${timeColumn}=coalesce(${timeColumn}, datetime('now'))` : \"\"} where id=?`,\n    [status, notes, taskId],\n  );\n  if (status === \"Paused\") auditEvidence(db, task.job_card_id, \"Task paused\");\n  reconcileArtifactChecklist(db, task.job_card_id);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "taskId",
        "type": "number",
        "optional": false
      },
      {
        "name": "status",
        "type": "TaskStatus",
        "optional": false
      },
      {
        "name": "notes",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/updateTask",
    "service": "execution/checklists; TX-11",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-archiveTask",
    "name": "archiveTask",
    "file": "src/db.ts",
    "span": "src/db.ts:5564-5566",
    "calls": [
      "archive"
    ],
    "sql": [],
    "body": "export function archiveTask(db: Database, id: number, reason: string) {\n  archive(db, \"tasks\", id, reason);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "id",
        "type": "number",
        "optional": false
      },
      {
        "name": "reason",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/archiveTask",
    "service": "execution/checklists; TX-11",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-markWashingNeeded",
    "name": "markWashingNeeded",
    "file": "src/db.ts",
    "span": "src/db.ts:5568-5574",
    "calls": [
      "db.run",
      "reconcileArtifactChecklist"
    ],
    "sql": [
      "db.run( \"update job_cards set washing_needed=1, updated_at=datetime('now') where id=?\", [jobId], )"
    ],
    "body": "export function markWashingNeeded(db: Database, jobId: number) {\n  db.run(\n    \"update job_cards set washing_needed=1, updated_at=datetime('now') where id=?\",\n    [jobId],\n  );\n  reconcileArtifactChecklist(db, jobId);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "jobId",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/markWashingNeeded",
    "service": "execution/checklists; TX-11",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-updateQcCheck",
    "name": "updateQcCheck",
    "file": "src/db.ts",
    "span": "src/db.ts:5576-5600",
    "calls": [
      "one",
      "db.run",
      "auditEvidence",
      "reconcileArtifactChecklist"
    ],
    "sql": [
      "one<QcCheck>(db, \"select * from qc_checks where id=?\", [id])",
      "db.run(\"update qc_checks set passed=?, fail_reason=? where id=?\", [ passed ? 1 : 0, failReason, id, ])",
      "db.run(\"update job_cards set qc_status=? where id=?\", [ passed ? \"Pass\" : \"Fail\", check.job_card_id, ])"
    ],
    "body": "export function updateQcCheck(\n  db: Database,\n  id: number,\n  passed: boolean,\n  failReason = \"\",\n) {\n  const check = one<QcCheck>(db, \"select * from qc_checks where id=?\", [id]);\n  db.run(\"update qc_checks set passed=?, fail_reason=? where id=?\", [\n    passed ? 1 : 0,\n    failReason,\n    id,\n  ]);\n  db.run(\"update job_cards set qc_status=? where id=?\", [\n    passed ? \"Pass\" : \"Fail\",\n    check.job_card_id,\n  ]);\n  auditEvidence(\n    db,\n    check.job_card_id,\n    passed\n      ? `QC passed: ${check.label}`\n      : `QC failed: ${failReason || check.label}`,\n  );\n  reconcileArtifactChecklist(db, check.job_card_id);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "id",
        "type": "number",
        "optional": false
      },
      {
        "name": "passed",
        "type": "boolean",
        "optional": false
      },
      {
        "name": "failReason",
        "type": "INFERRED",
        "optional": true,
        "default": "\"\""
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/updateQcCheck",
    "service": "execution/checklists; TX-11",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-failQcWithRework",
    "name": "failQcWithRework",
    "file": "src/db.ts",
    "span": "src/db.ts:5602-5619",
    "calls": [
      "one",
      "updateQcCheck",
      "createTask"
    ],
    "sql": [
      "one<QcCheck>(db, \"select * from qc_checks where id=?\", [ checkId, ])"
    ],
    "body": "export function failQcWithRework(\n  db: Database,\n  checkId: number,\n  technicianId: number,\n  reason: string,\n) {\n  const check = one<QcCheck>(db, \"select * from qc_checks where id=?\", [\n    checkId,\n  ]);\n  updateQcCheck(db, checkId, false, reason);\n  createTask(db, {\n    job_card_id: check.job_card_id,\n    technician_id: technicianId,\n    title: `Rework: ${check.label}`,\n    status: \"Pending\",\n    notes: reason,\n  });\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "checkId",
        "type": "number",
        "optional": false
      },
      {
        "name": "technicianId",
        "type": "number",
        "optional": false
      },
      {
        "name": "reason",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/failQcWithRework",
    "service": "execution/checklists; TX-11",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-passQc",
    "name": "passQc",
    "file": "src/db.ts",
    "span": "src/db.ts:5621-5631",
    "calls": [
      "db.run",
      "reconcileArtifactChecklist"
    ],
    "sql": [
      "db.run( \"update qc_checks set passed=1 where job_card_id=? and archived_at is null\", [jobId], )",
      "db.run( \"update job_cards set qc_status='Pass', updated_at=datetime('now') where id=?\", [jobId], )"
    ],
    "body": "export function passQc(db: Database, jobId: number) {\n  db.run(\n    \"update qc_checks set passed=1 where job_card_id=? and archived_at is null\",\n    [jobId],\n  );\n  db.run(\n    \"update job_cards set qc_status='Pass', updated_at=datetime('now') where id=?\",\n    [jobId],\n  );\n  reconcileArtifactChecklist(db, jobId);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "jobId",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/passQc",
    "service": "execution/checklists; TX-11",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-generateInvoice",
    "name": "generateInvoice",
    "file": "src/db.ts",
    "span": "src/db.ts:5633-5652",
    "calls": [
      "one",
      "all",
      "createInvoiceFromEstimate",
      "reconcileArtifactChecklist"
    ],
    "sql": [
      "one<Estimate>( db, \"select * from estimates where job_card_id=? and archived_at is null order by id desc limit 1\", [jobId], )",
      "all<EstimateItem>( db, \"select * from estimate_items where estimate_id=? and archived_at is null order by id\", [estimate.id], )"
    ],
    "body": "export function generateInvoice(db: Database, jobId: number, tally: string) {\n  const estimate = one<Estimate>(\n    db,\n    \"select * from estimates where job_card_id=? and archived_at is null order by id desc limit 1\",\n    [jobId],\n  );\n  const items = all<EstimateItem>(\n    db,\n    \"select * from estimate_items where estimate_id=? and archived_at is null order by id\",\n    [estimate.id],\n  );\n  createInvoiceFromEstimate(db, jobId, {\n    tallyInvoiceNo: tally,\n    discount: estimate.discount,\n    gstRate: estimate.gst_rate,\n    items,\n    notes: \"\",\n  });\n  reconcileArtifactChecklist(db, jobId);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "jobId",
        "type": "number",
        "optional": false
      },
      {
        "name": "tally",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/createInvoiceForActor",
    "service": "finance; TX-03/04/05/12; FIN-01..04",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-canMutateBilling",
    "name": "canMutateBilling",
    "file": "src/db.ts",
    "span": "src/db.ts:5677-5679",
    "calls": [],
    "sql": [],
    "body": "export function canMutateBilling(actor: Pick<User, \"role\">) {\n  return actor.role === \"admin\" || actor.role === \"accounts\";\n}",
    "parameters": [
      {
        "name": "actor",
        "type": "Pick<User, \"role\">",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "boolean"
  },
  {
    "id": "OP-db-updateInvoiceFields",
    "name": "updateInvoiceFields",
    "file": "src/db.ts",
    "span": "src/db.ts:5817-5850",
    "calls": [
      "one",
      "assertInvoiceFinancialsEditable",
      "Number.isFinite",
      "db.run",
      "input.tallyInvoiceNo.trim",
      "input.notes.trim",
      "recalculateInvoice",
      "reconcileArtifactChecklist"
    ],
    "sql": [
      "one<Invoice>( db, \"select * from invoices where id=? and voided_at is null\", [invoiceId], )",
      "db.run(\"savepoint update_invoice_fields\")",
      "db.run( \"update invoices set tally_invoice_no=?,discount=?,notes=?,document_available=1,document_generated_at=coalesce(document_generated_at,datetime('now')),updated_at=datetime('now') where id=? and voided_at is null\", [ input.tallyInvoiceNo.trim(), input.discount, input.notes.trim(), invoiceId, ], )",
      "db.run(\"release savepoint update_invoice_fields\")",
      "db.run(\"rollback to savepoint update_invoice_fields\")",
      "db.run(\"release savepoint update_invoice_fields\")"
    ],
    "body": "export function updateInvoiceFields(\n  db: Database,\n  invoiceId: number,\n  input: InvoiceFieldsInput,\n) {\n  const current = one<Invoice>(\n    db,\n    \"select * from invoices where id=? and voided_at is null\",\n    [invoiceId],\n  );\n  if (input.discount !== current.discount)\n    assertInvoiceFinancialsEditable(db, invoiceId);\n  if (!Number.isFinite(input.discount) || input.discount < 0)\n    throw new Error(\"Invoice discount cannot be negative.\");\n  db.run(\"savepoint update_invoice_fields\");\n  try {\n    db.run(\n      \"update invoices set tally_invoice_no=?,discount=?,notes=?,document_available=1,document_generated_at=coalesce(document_generated_at,datetime('now')),updated_at=datetime('now') where id=? and voided_at is null\",\n      [\n        input.tallyInvoiceNo.trim(),\n        input.discount,\n        input.notes.trim(),\n        invoiceId,\n      ],\n    );\n    recalculateInvoice(db, invoiceId);\n    reconcileArtifactChecklist(db, current.job_card_id);\n    db.run(\"release savepoint update_invoice_fields\");\n  } catch (error) {\n    db.run(\"rollback to savepoint update_invoice_fields\");\n    db.run(\"release savepoint update_invoice_fields\");\n    throw error;\n  }\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "invoiceId",
        "type": "number",
        "optional": false
      },
      {
        "name": "input",
        "type": "InvoiceFieldsInput",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/updateInvoiceForActor",
    "service": "finance; TX-03/04/05/12; FIN-01..04",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-createInvoiceItem",
    "name": "createInvoiceItem",
    "file": "src/db.ts",
    "span": "src/db.ts:5852-5890",
    "calls": [
      "assertInvoiceFinancialsEditable",
      "validateInvoiceItem",
      "one",
      "pickUpMaterialRow",
      "normalizeAndValidateGst",
      "insert",
      "input.description.trim",
      "recalculateInvoice"
    ],
    "sql": [
      "one<Invoice>(db, \"select * from invoices where id=?\", [ invoiceId, ])",
      "insert( db, \"insert into invoice_items(invoice_id,kind,description,qty,rate,gst_type,gst_rate,material_row_id,created_at,updated_at) values(?,?,?,?,?,?,?,?,datetime('now'),datetime('now'))\", [ invoiceId, input.kind, input.description.trim(), input.qty, input.rate, tax.gst_type, tax.gst_rate, input.material_row_id ?? null, ], )"
    ],
    "body": "export function createInvoiceItem(\n  db: Database,\n  invoiceId: number,\n  input: InvoiceItemInput,\n) {\n  assertInvoiceFinancialsEditable(db, invoiceId);\n  validateInvoiceItem(input);\n  const invoice = one<Invoice>(db, \"select * from invoices where id=?\", [\n    invoiceId,\n  ]);\n  if (input.material_row_id)\n    pickUpMaterialRow(\n      db,\n      invoice.job_card_id,\n      input.material_row_id,\n      invoiceId,\n    );\n  const tax = normalizeAndValidateGst(\n    input.gst_type,\n    input.gst_rate,\n    DEFAULT_GST_BY_KIND[input.kind],\n  );\n  const id = insert(\n    db,\n    \"insert into invoice_items(invoice_id,kind,description,qty,rate,gst_type,gst_rate,material_row_id,created_at,updated_at) values(?,?,?,?,?,?,?,?,datetime('now'),datetime('now'))\",\n    [\n      invoiceId,\n      input.kind,\n      input.description.trim(),\n      input.qty,\n      input.rate,\n      tax.gst_type,\n      tax.gst_rate,\n      input.material_row_id ?? null,\n    ],\n  );\n  recalculateInvoice(db, invoiceId);\n  return id;\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "invoiceId",
        "type": "number",
        "optional": false
      },
      {
        "name": "input",
        "type": "InvoiceItemInput",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/createInvoiceItem",
    "service": "finance; TX-03/04/05/12; FIN-01..04",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-updateInvoiceItem",
    "name": "updateInvoiceItem",
    "file": "src/db.ts",
    "span": "src/db.ts:5892-5922",
    "calls": [
      "one",
      "assertInvoiceFinancialsEditable",
      "validateInvoiceItem",
      "normalizeAndValidateGst",
      "db.run",
      "input.description.trim",
      "recalculateInvoice"
    ],
    "sql": [
      "one<InvoiceItem>( db, \"select * from invoice_items where id=? and archived_at is null\", [itemId], )",
      "db.run( \"update invoice_items set kind=?,description=?,qty=?,rate=?,gst_type=?,gst_rate=?,updated_at=datetime('now') where id=?\", [ input.kind, input.description.trim(), input.qty, input.rate, tax.gst_type, tax.gst_rate, itemId, ], )"
    ],
    "body": "export function updateInvoiceItem(\n  db: Database,\n  itemId: number,\n  input: InvoiceItemInput,\n) {\n  const item = one<InvoiceItem>(\n    db,\n    \"select * from invoice_items where id=? and archived_at is null\",\n    [itemId],\n  );\n  assertInvoiceFinancialsEditable(db, item.invoice_id);\n  validateInvoiceItem(input);\n  const tax = normalizeAndValidateGst(\n    input.gst_type ?? item.gst_type,\n    input.gst_rate ?? item.gst_rate,\n    DEFAULT_GST_BY_KIND[input.kind],\n  );\n  db.run(\n    \"update invoice_items set kind=?,description=?,qty=?,rate=?,gst_type=?,gst_rate=?,updated_at=datetime('now') where id=?\",\n    [\n      input.kind,\n      input.description.trim(),\n      input.qty,\n      input.rate,\n      tax.gst_type,\n      tax.gst_rate,\n      itemId,\n    ],\n  );\n  recalculateInvoice(db, item.invoice_id);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "itemId",
        "type": "number",
        "optional": false
      },
      {
        "name": "input",
        "type": "InvoiceItemInput",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/updateInvoiceItem",
    "service": "finance; TX-03/04/05/12; FIN-01..04",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-archiveInvoiceItem",
    "name": "archiveInvoiceItem",
    "file": "src/db.ts",
    "span": "src/db.ts:5925-5953",
    "calls": [
      "one",
      "assertInvoiceFinancialsEditable",
      "reason.trim",
      "db.run",
      "archive",
      "recalculateInvoice"
    ],
    "sql": [
      "one<InvoiceItem>( db, \"select * from invoice_items where id=? and archived_at is null\", [itemId], )",
      "db.run(\"savepoint archive_invoice_item\")",
      "db.run( \"update material_requests set invoiced_in=null,updated_at=datetime('now') where id=? and invoiced_in=?\", [item.material_row_id, item.invoice_id], )",
      "db.run(\"release savepoint archive_invoice_item\")",
      "db.run(\"rollback to savepoint archive_invoice_item\")",
      "db.run(\"release savepoint archive_invoice_item\")"
    ],
    "body": "export function archiveInvoiceItem(\n  db: Database,\n  itemId: number,\n  reason: string,\n) {\n  const item = one<InvoiceItem>(\n    db,\n    \"select * from invoice_items where id=? and archived_at is null\",\n    [itemId],\n  );\n  assertInvoiceFinancialsEditable(db, item.invoice_id);\n  if (!reason.trim())\n    throw new Error(\"An invoice item archive reason is required.\");\n  db.run(\"savepoint archive_invoice_item\");\n  try {\n    archive(db, \"invoice_items\", itemId, reason.trim());\n    if (item.material_row_id)\n      db.run(\n        \"update material_requests set invoiced_in=null,updated_at=datetime('now') where id=? and invoiced_in=?\",\n        [item.material_row_id, item.invoice_id],\n      );\n    recalculateInvoice(db, item.invoice_id);\n    db.run(\"release savepoint archive_invoice_item\");\n  } catch (error) {\n    db.run(\"rollback to savepoint archive_invoice_item\");\n    db.run(\"release savepoint archive_invoice_item\");\n    throw error;\n  }\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "itemId",
        "type": "number",
        "optional": false
      },
      {
        "name": "reason",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/archiveInvoiceItem",
    "service": "finance; TX-03/04/05/12; FIN-01..04",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-createInvoiceFromEstimate",
    "name": "createInvoiceFromEstimate",
    "file": "src/db.ts",
    "span": "src/db.ts:5955-6064",
    "calls": [
      "maybe",
      "one",
      "all",
      "estimateItems.map",
      "Number.isFinite",
      "items.forEach",
      "db.run",
      "items.map",
      "normalizeAndValidateGst",
      "invoiceTotals",
      "insert",
      "nextDocumentNumber",
      "input.tallyInvoiceNo.trim",
      "input.notes.trim",
      "pickUpMaterialRow",
      "item.description.trim",
      "invoiceEvent",
      "priced.filter",
      "reconcileArtifactChecklist"
    ],
    "sql": [
      "maybe<Invoice>( db, \"select * from invoices where job_card_id=? and voided_at is null order by id desc limit 1\", [jobId], )",
      "one<Estimate>( db, \"select * from estimates where job_card_id=? and archived_at is null order by id desc limit 1\", [jobId], )",
      "all<EstimateItem>( db, \"select * from estimate_items where estimate_id=? and archived_at is null order by id\", [estimate.id], )",
      "db.run(\"savepoint create_invoice\")",
      "insert( db, \"insert into invoices(job_card_id,invoice_no,tally_invoice_no,discount,gst_rate,subtotal,gst_amount,total,status,notes,document_available,document_generated_at,created_at,updated_at) values(?,?,?,?,?,?,?,?,?,?,1,datetime('now'),datetime('now'),datetime('now'))\", [ jobId, nextDocumentNumber( db, \"invoices\", \"invoice_no\", \"INV-\", 8900 + jobId, 5, ), input.tallyInvoiceNo.trim(), totals.discount, 0, totals.subtotal, totals.gst, totals.total, \"Pending\", input.notes.trim(), ], )",
      "insert( db, \"insert into invoice_items(invoice_id,kind,description,qty,rate,gst_type,gst_rate,material_row_id,created_at,updated_at) values(?,?,?,?,?,?,?,?,datetime('now'),datetime('now'))\", [ id, item.kind, item.description.trim(), item.qty, item.rate, item.gst_type, item.gst_rate, item.material_row_id ?? null, ], )",
      "db.run(\"release savepoint create_invoice\")",
      "db.run(\"rollback to savepoint create_invoice\")",
      "db.run(\"release savepoint create_invoice\")"
    ],
    "body": "export function createInvoiceFromEstimate(\n  db: Database,\n  jobId: number,\n  input: CreateInvoiceInput,\n  actorId = 0,\n) {\n  const existing = maybe<Invoice>(\n    db,\n    \"select * from invoices where job_card_id=? and voided_at is null order by id desc limit 1\",\n    [jobId],\n  );\n  if (existing) return existing.id;\n  const estimate = one<Estimate>(\n    db,\n    \"select * from estimates where job_card_id=? and archived_at is null order by id desc limit 1\",\n    [jobId],\n  );\n  const estimateItems = all<EstimateItem>(\n    db,\n    \"select * from estimate_items where estimate_id=? and archived_at is null order by id\",\n    [estimate.id],\n  );\n  const items: InvoiceItemInput[] =\n    input.items ??\n    estimateItems.map((item) => ({\n      kind: item.kind,\n      description: item.description,\n      qty: item.qty,\n      rate: item.rate,\n      gst_type: item.gst_type ?? undefined,\n      gst_rate: item.gst_rate ?? undefined,\n    }));\n  const discount = input.discount ?? estimate.discount;\n  const fallbackGst = input.gstRate ?? estimate.gst_rate;\n  if (items.length === 0)\n    throw new Error(\"An invoice requires at least one item.\");\n  if (!Number.isFinite(discount) || discount < 0)\n    throw new Error(\"Invoice discount cannot be negative.\");\n  items.forEach(validateInvoiceItem);\n  db.run(\"savepoint create_invoice\");\n  try {\n    const priced = items.map((item) => ({\n      ...item,\n      ...normalizeAndValidateGst(\n        item.gst_type,\n        item.gst_rate,\n        fallbackGst ?? DEFAULT_GST_BY_KIND[item.kind],\n      ),\n    }));\n    const totals = invoiceTotals(priced, discount);\n    const id = insert(\n      db,\n      \"insert into invoices(job_card_id,invoice_no,tally_invoice_no,discount,gst_rate,subtotal,gst_amount,total,status,notes,document_available,document_generated_at,created_at,updated_at) values(?,?,?,?,?,?,?,?,?,?,1,datetime('now'),datetime('now'),datetime('now'))\",\n      [\n        jobId,\n        nextDocumentNumber(\n          db,\n          \"invoices\",\n          \"invoice_no\",\n          \"INV-\",\n          8900 + jobId,\n          5,\n        ),\n        input.tallyInvoiceNo.trim(),\n        totals.discount,\n        0,\n        totals.subtotal,\n        totals.gst,\n        totals.total,\n        \"Pending\",\n        input.notes.trim(),\n      ],\n    );\n    for (const item of priced) {\n      if (item.material_row_id)\n        pickUpMaterialRow(db, jobId, item.material_row_id, id);\n      insert(\n        db,\n        \"insert into invoice_items(invoice_id,kind,description,qty,rate,gst_type,gst_rate,material_row_id,created_at,updated_at) values(?,?,?,?,?,?,?,?,datetime('now'),datetime('now'))\",\n        [\n          id,\n          item.kind,\n          item.description.trim(),\n          item.qty,\n          item.rate,\n          item.gst_type,\n          item.gst_rate,\n          item.material_row_id ?? null,\n        ],\n      );\n    }\n    invoiceEvent(\n      db,\n      { id, job_card_id: jobId },\n      \"create\",\n      actorId,\n      \"\",\n      null,\n      totals.total,\n      `${priced.length} line${priced.length === 1 ? \"\" : \"s\"}, ${priced.filter((item) => item.material_row_id).length} material row(s) picked up`,\n    );\n    reconcileArtifactChecklist(db, jobId);\n    db.run(\"release savepoint create_invoice\");\n    return id;\n  } catch (error) {\n    db.run(\"rollback to savepoint create_invoice\");\n    db.run(\"release savepoint create_invoice\");\n    throw error;\n  }\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "jobId",
        "type": "number",
        "optional": false
      },
      {
        "name": "input",
        "type": "CreateInvoiceInput",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "INFERRED",
        "optional": true,
        "default": "0"
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/createInvoiceForActor",
    "service": "finance; TX-03/04/05/12; FIN-01..04",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-createInvoiceForActor",
    "name": "createInvoiceForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:6066-6094",
    "calls": [
      "one",
      "canCreateInvoice",
      "maybe",
      "createInvoiceFromEstimate"
    ],
    "sql": [
      "one<User>( db, \"select * from users where id=? and archived_at is null\", [actorId], )",
      "one<JobCard>( db, \"select * from job_cards where id=? and archived_at is null\", [jobId], )",
      "maybe<Estimate>( db, \"select * from estimates where job_card_id=? and archived_at is null order by id desc limit 1\", [jobId], )"
    ],
    "body": "export function createInvoiceForActor(\n  db: Database,\n  jobId: number,\n  actorId: number,\n  input: CreateInvoiceInput,\n) {\n  const actor = one<User>(\n    db,\n    \"select * from users where id=? and archived_at is null\",\n    [actorId],\n  );\n  const job = one<JobCard>(\n    db,\n    \"select * from job_cards where id=? and archived_at is null\",\n    [jobId],\n  );\n  if (!canCreateInvoice(actor, job))\n    throw new Error(\n      \"This user cannot create an invoice for this job card right now.\",\n    );\n  const estimate = maybe<Estimate>(\n    db,\n    \"select * from estimates where job_card_id=? and archived_at is null order by id desc limit 1\",\n    [jobId],\n  );\n  if (estimate?.status !== \"Approved\")\n    throw new Error(\"Approve the Estimate before creating an invoice.\");\n  return createInvoiceFromEstimate(db, jobId, input, actorId);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "jobId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "input",
        "type": "CreateInvoiceInput",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/createInvoiceForActor",
    "service": "finance; TX-03/04/05/12; FIN-01..04",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-updateInvoiceForActor",
    "name": "updateInvoiceForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:6096-6120",
    "calls": [
      "one",
      "canEditInvoice",
      "updateInvoiceFields"
    ],
    "sql": [
      "one<User>( db, \"select * from users where id=? and archived_at is null\", [actorId], )",
      "one<Invoice>( db, \"select * from invoices where id=? and voided_at is null\", [invoiceId], )",
      "one<JobCard>( db, \"select * from job_cards where id=? and archived_at is null\", [invoice.job_card_id], )"
    ],
    "body": "export function updateInvoiceForActor(\n  db: Database,\n  invoiceId: number,\n  actorId: number,\n  input: InvoiceFieldsInput,\n) {\n  const actor = one<User>(\n    db,\n    \"select * from users where id=? and archived_at is null\",\n    [actorId],\n  );\n  const invoice = one<Invoice>(\n    db,\n    \"select * from invoices where id=? and voided_at is null\",\n    [invoiceId],\n  );\n  const job = one<JobCard>(\n    db,\n    \"select * from job_cards where id=? and archived_at is null\",\n    [invoice.job_card_id],\n  );\n  if (!canEditInvoice(actor, job) || invoice.status !== \"Pending\")\n    throw new Error(\"This user cannot edit this invoice.\");\n  updateInvoiceFields(db, invoiceId, input);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "invoiceId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "input",
        "type": "InvoiceFieldsInput",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/updateInvoiceForActor",
    "service": "finance; TX-03/04/05/12; FIN-01..04",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-saveInvoiceForActor",
    "name": "saveInvoiceForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:6164-6251",
    "calls": [
      "one",
      "canEditInvoice",
      "activeInvoiceItems",
      "existing.map",
      "input.items.some",
      "existingIds.has",
      "input.items.forEach",
      "scalar",
      "changeSummary",
      "input.note?.trim",
      "db.run",
      "updateInvoiceFields",
      "updateInvoiceItem",
      "createInvoiceItem",
      "input.items.flatMap",
      "retained.has",
      "archiveInvoiceItem",
      "invoiceEvent",
      "input.note!.trim"
    ],
    "sql": [
      "one<User>( db, \"select * from users where id=? and archived_at is null\", [actorId], )",
      "one<Invoice>( db, \"select * from invoices where id=? and voided_at is null\", [invoiceId], )",
      "one<JobCard>(db, \"select * from job_cards where id=?\", [ invoice.job_card_id, ])",
      "scalar<number>( db, \"select count(*) from payments where invoice_id=? and voided_at is null\", [invoiceId], )",
      "db.run(\"savepoint save_invoice_editor\")",
      "one<Invoice>(db, \"select * from invoices where id=?\", [ invoiceId, ])",
      "db.run(\"release savepoint save_invoice_editor\")",
      "db.run(\"rollback to savepoint save_invoice_editor\")",
      "db.run(\"release savepoint save_invoice_editor\")"
    ],
    "body": "export function saveInvoiceForActor(\n  db: Database,\n  invoiceId: number,\n  actorId: number,\n  input: InvoiceEditorInput,\n) {\n  const actor = one<User>(\n    db,\n    \"select * from users where id=? and archived_at is null\",\n    [actorId],\n  );\n  const invoice = one<Invoice>(\n    db,\n    \"select * from invoices where id=? and voided_at is null\",\n    [invoiceId],\n  );\n  const job = one<JobCard>(db, \"select * from job_cards where id=?\", [\n    invoice.job_card_id,\n  ]);\n  if (invoice.status !== \"Pending\")\n    throw new Error(\n      \"Only a Pending invoice can be edited; cleared invoices are locked.\",\n    );\n  if (!canEditInvoice(actor, job))\n    throw new Error(\"This user cannot edit the invoice for this job card.\");\n  if (input.items.length === 0)\n    throw new Error(\"An invoice requires at least one item.\");\n  const existing = activeInvoiceItems(db, invoiceId);\n  const existingIds = new Set(existing.map((item) => item.id));\n  if (input.items.some((item) => item.id && !existingIds.has(item.id)))\n    throw new Error(\"Invoice item does not belong to this invoice.\");\n  input.items.forEach(validateInvoiceItem);\n  const financialsLocked =\n    scalar<number>(\n      db,\n      \"select count(*) from payments where invoice_id=? and voided_at is null\",\n      [invoiceId],\n    ) > 0;\n  const summary = changeSummary(\n    existing,\n    input.items,\n    invoice.discount,\n    input.discount,\n    invoice.gst_rate,\n  );\n  if (financialsLocked && summary)\n    throw new Error(\n      \"Invoice financial fields are locked after the first active payment.\",\n    );\n  if (summary && !input.note?.trim())\n    throw new Error(\"A note is required to edit invoice lines or discount.\");\n  db.run(\"savepoint save_invoice_editor\");\n  try {\n    updateInvoiceFields(db, invoiceId, input);\n    if (!financialsLocked) {\n      for (const item of input.items) {\n        if (item.id) updateInvoiceItem(db, item.id, item);\n        else createInvoiceItem(db, invoiceId, item);\n      }\n      const retained = new Set(\n        input.items.flatMap((item) => (item.id ? [item.id] : [])),\n      );\n      for (const item of existing)\n        if (!retained.has(item.id))\n          archiveInvoiceItem(db, item.id, \"Removed in invoice editor\");\n    }\n    if (summary) {\n      const after = one<Invoice>(db, \"select * from invoices where id=?\", [\n        invoiceId,\n      ]);\n      invoiceEvent(\n        db,\n        invoice,\n        \"edit\",\n        actorId,\n        input.note!.trim(),\n        invoice.total,\n        after.total,\n        summary,\n      );\n    }\n    db.run(\"release savepoint save_invoice_editor\");\n  } catch (error) {\n    db.run(\"rollback to savepoint save_invoice_editor\");\n    db.run(\"release savepoint save_invoice_editor\");\n    throw error;\n  }\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "invoiceId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "input",
        "type": "InvoiceEditorInput",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/saveInvoiceForActor",
    "service": "finance; TX-03/04/05/12; FIN-01..04",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-voidInvoice",
    "name": "voidInvoice",
    "file": "src/db.ts",
    "span": "src/db.ts:6254-6291",
    "calls": [
      "reason.trim",
      "scalar",
      "one",
      "db.run",
      "invoiceEvent",
      "reconcileArtifactChecklist"
    ],
    "sql": [
      "scalar<number>( db, \"select count(*) from payments where invoice_id=? and voided_at is null\", [invoiceId], )",
      "one<Invoice>(db, \"select * from invoices where id=?\", [ invoiceId, ])",
      "db.run( \"update invoices set voided_at=datetime('now'), void_reason=?, updated_at=datetime('now') where id=?\", [reason, invoiceId], )",
      "db.run( \"update material_requests set invoiced_in=null,updated_at=datetime('now') where invoiced_in=?\", [invoiceId], )"
    ],
    "body": "export function voidInvoice(\n  db: Database,\n  invoiceId: number,\n  reason: string,\n  actorId = 0,\n) {\n  if (!reason.trim()) throw new Error(\"An invoice void reason is required.\");\n  if (\n    scalar<number>(\n      db,\n      \"select count(*) from payments where invoice_id=? and voided_at is null\",\n      [invoiceId],\n    ) > 0\n  )\n    throw new Error(\"An invoice with active payments cannot be voided.\");\n  const invoice = one<Invoice>(db, \"select * from invoices where id=?\", [\n    invoiceId,\n  ]);\n  db.run(\n    \"update invoices set voided_at=datetime('now'), void_reason=?, updated_at=datetime('now') where id=?\",\n    [reason, invoiceId],\n  );\n  db.run(\n    \"update material_requests set invoiced_in=null,updated_at=datetime('now') where invoiced_in=?\",\n    [invoiceId],\n  );\n  invoiceEvent(\n    db,\n    invoice,\n    \"void\",\n    actorId,\n    reason.trim(),\n    invoice.total,\n    null,\n    \"Material rows unlocked\",\n  );\n  reconcileArtifactChecklist(db, invoice.job_card_id);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "invoiceId",
        "type": "number",
        "optional": false
      },
      {
        "name": "reason",
        "type": "string",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "INFERRED",
        "optional": true,
        "default": "0"
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/voidInvoiceForActor",
    "service": "finance; TX-03/04/05/12; FIN-01..04",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-voidInvoiceForActor",
    "name": "voidInvoiceForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:6293-6301",
    "calls": [
      "assertBillingMutationAccess",
      "voidInvoice"
    ],
    "sql": [],
    "body": "export function voidInvoiceForActor(\n  db: Database,\n  invoiceId: number,\n  actorId: number,\n  reason: string,\n) {\n  assertBillingMutationAccess(db, actorId);\n  voidInvoice(db, invoiceId, reason, actorId);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "invoiceId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "reason",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/voidInvoiceForActor",
    "service": "finance; TX-03/04/05/12; FIN-01..04",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-recordPayment",
    "name": "recordPayment",
    "file": "src/db.ts",
    "span": "src/db.ts:6388-6515",
    "calls": [
      "validatePaymentInput",
      "maybe",
      "one",
      "scalar",
      "activePaidAmount",
      "db.run",
      "new Date().toISOString",
      "insert",
      "input.otherDetail.trim",
      "input.reference.trim",
      "(input.notes ?? \"\").trim",
      "nextDocumentNumber",
      "reconcileArtifactChecklist",
      "transitionJobStatusInternal",
      "ensureGatePassOnClose",
      "updateDeliveryDetails",
      "setChecklistItemChecked"
    ],
    "sql": [
      "maybe<Invoice>( db, \"select * from invoices where id=? and voided_at is null\", [invoiceId], )",
      "one<JobCard>(db, \"select * from job_cards where id=?\", [ invoice.job_card_id, ])",
      "scalar<number>( db, \"select count(*) from checklist_items where job_card_id=? and stage='COMPLETED' and label='Remind Customer for Sharing Google Review/Feedback' and checked_at is not null and checklist_cycle_id=(select max(id) from checklist_cycles where job_card_id=?)\", [invoice.job_card_id, invoice.job_card_id], )",
      "db.run(\"savepoint record_payment\")",
      "insert( db, \"insert into payments(job_card_id,invoice_id,amount,mode,other_detail,reference,notes,created_at,updated_at) values(?,?,?,?,?,?,?,datetime('now'),datetime('now'))\", [ invoice.job_card_id, invoiceId, invoice.total, input.mode, input.mode === \"Other\" ? input.otherDetail.trim() : \"\", input.reference.trim(), (input.notes ?? \"\").trim(), ], )",
      "maybe<Receipt>( db, \"select * from receipts where invoice_id=? and voided_at is null\", [invoiceId], )",
      "insert( db, \"insert into receipts(job_card_id,invoice_id,receipt_no,created_at) values (?,?,?,datetime('now'))\", [ invoice.job_card_id, invoiceId, nextDocumentNumber( db, \"receipts\", \"receipt_no\", \"RCT-\", 4500 + invoiceId, 5, ), ], )",
      "db.run( \"update invoices set status='Cleared',updated_at=datetime('now') where id=?\", [invoiceId], )",
      "one<User>( db, \"select * from users where id=? and archived_at is null\", [actorId], )",
      "maybe<Vehicle>( db, \"select v.* from vehicles v join visits visit on visit.vehicle_id=v.id join job_cards jc on jc.visit_id=visit.id where jc.id=?\", [invoice.job_card_id], )",
      "maybe<ChecklistItem>( db, \"select * from checklist_items where job_card_id=? and stage='CLOSED' and label='Delivered' order by cycle_number desc,id desc limit 1\", [invoice.job_card_id], )",
      "db.run(\"release savepoint record_payment\")",
      "db.run(\"rollback to savepoint record_payment\")",
      "db.run(\"release savepoint record_payment\")"
    ],
    "body": "export function recordPayment(\n  db: Database,\n  invoiceId: number,\n  input: PaymentInput,\n  actorId = 0,\n) {\n  validatePaymentInput(input);\n  const invoice = maybe<Invoice>(\n    db,\n    \"select * from invoices where id=? and voided_at is null\",\n    [invoiceId],\n  );\n  if (!invoice) throw new Error(\"Record Payment requires a current Invoice.\");\n  const job = one<JobCard>(db, \"select * from job_cards where id=?\", [\n    invoice.job_card_id,\n  ]);\n  if (job.main_status === \"CANCELLED\")\n    throw new Error(\"A CANCELLED job card is read-only.\");\n  if (job.main_status !== \"COMPLETED\")\n    throw new Error(\"Only a completed job card can be paid and handed over.\");\n  if (\n    scalar<number>(\n      db,\n      \"select count(*) from checklist_items where job_card_id=? and stage='COMPLETED' and label='Remind Customer for Sharing Google Review/Feedback' and checked_at is not null and checklist_cycle_id=(select max(id) from checklist_cycles where job_card_id=?)\",\n      [invoice.job_card_id, invoice.job_card_id],\n    ) === 0\n  ) {\n    throw new Error(\n      \"Confirm the Google review/feedback reminder before recording payment.\",\n    );\n  }\n  if (activePaidAmount(db, invoiceId) > 0)\n    throw new Error(\n      \"This invoice already has a payment. Void it before recording another.\",\n    );\n  if (invoice.status !== \"Pending\")\n    throw new Error(\"Only a Pending invoice can be paid.\");\n  if (!(invoice.total > 0))\n    throw new Error(\"An invoice with no amount due cannot be paid.\");\n  db.run(\"savepoint record_payment\");\n  try {\n    const timestamp = new Date().toISOString();\n    const id = insert(\n      db,\n      \"insert into payments(job_card_id,invoice_id,amount,mode,other_detail,reference,notes,created_at,updated_at) values(?,?,?,?,?,?,?,datetime('now'),datetime('now'))\",\n      [\n        invoice.job_card_id,\n        invoiceId,\n        invoice.total,\n        input.mode,\n        input.mode === \"Other\" ? input.otherDetail.trim() : \"\",\n        input.reference.trim(),\n        (input.notes ?? \"\").trim(),\n      ],\n    );\n    if (\n      !maybe<Receipt>(\n        db,\n        \"select * from receipts where invoice_id=? and voided_at is null\",\n        [invoiceId],\n      )\n    ) {\n      insert(\n        db,\n        \"insert into receipts(job_card_id,invoice_id,receipt_no,created_at) values (?,?,?,datetime('now'))\",\n        [\n          invoice.job_card_id,\n          invoiceId,\n          nextDocumentNumber(\n            db,\n            \"receipts\",\n            \"receipt_no\",\n            \"RCT-\",\n            4500 + invoiceId,\n            5,\n          ),\n        ],\n      );\n    }\n    db.run(\n      \"update invoices set status='Cleared',updated_at=datetime('now') where id=?\",\n      [invoiceId],\n    );\n    reconcileArtifactChecklist(db, invoice.job_card_id, actorId, timestamp);\n    transitionJobStatusInternal(\n      db,\n      invoice.job_card_id,\n      \"CLOSED\",\n      \"Payment received and vehicle handed over\",\n      timestamp,\n      true,\n    );\n    ensureGatePassOnClose(db, invoice.job_card_id);\n    const actor = actorId\n      ? one<User>(\n          db,\n          \"select * from users where id=? and archived_at is null\",\n          [actorId],\n        )\n      : undefined;\n    const vehicle = maybe<Vehicle>(\n      db,\n      \"select v.* from vehicles v join visits visit on visit.vehicle_id=v.id join job_cards jc on jc.visit_id=visit.id where jc.id=?\",\n      [invoice.job_card_id],\n    );\n    updateDeliveryDetails(\n      db,\n      invoice.job_card_id,\n      actor?.name ?? job.delivery_by ?? \"Accounts\",\n      job.final_km ?? vehicle?.km ?? 0,\n      job.acknowledgement || \"Payment confirmed and vehicle handed over\",\n    );\n    reconcileArtifactChecklist(db, invoice.job_card_id, actorId, timestamp);\n    const deliveredItem = maybe<ChecklistItem>(\n      db,\n      \"select * from checklist_items where job_card_id=? and stage='CLOSED' and label='Delivered' order by cycle_number desc,id desc limit 1\",\n      [invoice.job_card_id],\n    );\n    if (deliveredItem && !deliveredItem.checked_at)\n      setChecklistItemChecked(db, deliveredItem.id, actorId, true, timestamp);\n    db.run(\"release savepoint record_payment\");\n    return id;\n  } catch (error) {\n    db.run(\"rollback to savepoint record_payment\");\n    db.run(\"release savepoint record_payment\");\n    throw error;\n  }\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "invoiceId",
        "type": "number",
        "optional": false
      },
      {
        "name": "input",
        "type": "PaymentInput",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "INFERRED",
        "optional": true,
        "default": "0"
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/recordPaymentForActor",
    "service": "finance; TX-03/04/05/12; FIN-01..04",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-recordPaymentForActor",
    "name": "recordPaymentForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:6517-6525",
    "calls": [
      "assertBillingMutationAccess",
      "recordPayment"
    ],
    "sql": [],
    "body": "export function recordPaymentForActor(\n  db: Database,\n  invoiceId: number,\n  actorId: number,\n  input: PaymentInput,\n) {\n  assertBillingMutationAccess(db, actorId);\n  return recordPayment(db, invoiceId, input, actorId);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "invoiceId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "input",
        "type": "PaymentInput",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/recordPaymentForActor",
    "service": "finance; TX-03/04/05/12; FIN-01..04",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-voidPayment",
    "name": "voidPayment",
    "file": "src/db.ts",
    "span": "src/db.ts:6528-6574",
    "calls": [
      "reason.trim",
      "one",
      "db.run",
      "maybe",
      "writeChecklistItemState",
      "new Date().toISOString"
    ],
    "sql": [
      "one<Payment>( db, \"select * from payments where id=? and voided_at is null\", [id], )",
      "one<JobCard>(db, \"select * from job_cards where id=?\", [ payment.job_card_id, ])",
      "db.run(\"savepoint void_payment\")",
      "db.run( \"update payments set voided_at=datetime('now'),void_reason=?,updated_at=datetime('now') where id=?\", [reason.trim(), id], )",
      "db.run( \"update receipts set voided_at=datetime('now'),void_reason=? where invoice_id=? and voided_at is null\", [reason.trim(), payment.invoice_id], )",
      "db.run( \"update invoices set status='Pending',updated_at=datetime('now') where id=? and voided_at is null\", [payment.invoice_id], )",
      "maybe<ChecklistItem>( db, \"select * from checklist_items where job_card_id=? and label='Payment Received' and checked_at is not null and checklist_cycle_id=(select max(id) from checklist_cycles where job_card_id=?)\", [payment.job_card_id, payment.job_card_id], )",
      "db.run(\"release savepoint void_payment\")",
      "db.run(\"rollback to savepoint void_payment\")",
      "db.run(\"release savepoint void_payment\")"
    ],
    "body": "export function voidPayment(db: Database, id: number, reason: string) {\n  if (!reason.trim()) throw new Error(\"A payment void reason is required.\");\n  const payment = one<Payment>(\n    db,\n    \"select * from payments where id=? and voided_at is null\",\n    [id],\n  );\n  const job = one<JobCard>(db, \"select * from job_cards where id=?\", [\n    payment.job_card_id,\n  ]);\n  if (job.main_status === \"CLOSED\" || job.main_status === \"CANCELLED\")\n    throw new Error(`A ${job.main_status} job card is read-only.`);\n  db.run(\"savepoint void_payment\");\n  try {\n    db.run(\n      \"update payments set voided_at=datetime('now'),void_reason=?,updated_at=datetime('now') where id=?\",\n      [reason.trim(), id],\n    );\n    db.run(\n      \"update receipts set voided_at=datetime('now'),void_reason=? where invoice_id=? and voided_at is null\",\n      [reason.trim(), payment.invoice_id],\n    );\n    db.run(\n      \"update invoices set status='Pending',updated_at=datetime('now') where id=? and voided_at is null\",\n      [payment.invoice_id],\n    );\n    const item = maybe<ChecklistItem>(\n      db,\n      \"select * from checklist_items where job_card_id=? and label='Payment Received' and checked_at is not null and checklist_cycle_id=(select max(id) from checklist_cycles where job_card_id=?)\",\n      [payment.job_card_id, payment.job_card_id],\n    );\n    if (item)\n      writeChecklistItemState(\n        db,\n        item,\n        0,\n        false,\n        false,\n        new Date().toISOString(),\n      );\n    db.run(\"release savepoint void_payment\");\n  } catch (error) {\n    db.run(\"rollback to savepoint void_payment\");\n    db.run(\"release savepoint void_payment\");\n    throw error;\n  }\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "id",
        "type": "number",
        "optional": false
      },
      {
        "name": "reason",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/voidPaymentForActor",
    "service": "finance; TX-03/04/05/12; FIN-01..04",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-voidPaymentForActor",
    "name": "voidPaymentForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:6576-6584",
    "calls": [
      "assertAdminBillingAccess",
      "voidPayment"
    ],
    "sql": [],
    "body": "export function voidPaymentForActor(\n  db: Database,\n  id: number,\n  actorId: number,\n  reason: string,\n) {\n  assertAdminBillingAccess(db, actorId);\n  voidPayment(db, id, reason);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "id",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "reason",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/voidPaymentForActor",
    "service": "finance; TX-03/04/05/12; FIN-01..04",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-updateDeliveryDetails",
    "name": "updateDeliveryDetails",
    "file": "src/db.ts",
    "span": "src/db.ts:6620-6631",
    "calls": [
      "db.run"
    ],
    "sql": [
      "db.run( \"update job_cards set delivery_by=?, final_km=?, acknowledgement=?, updated_at=datetime('now') where id=?\", [deliveredBy, finalKm, acknowledgement, jobId], )"
    ],
    "body": "export function updateDeliveryDetails(\n  db: Database,\n  jobId: number,\n  deliveredBy: string,\n  finalKm: number,\n  acknowledgement: string,\n) {\n  db.run(\n    \"update job_cards set delivery_by=?, final_km=?, acknowledgement=?, updated_at=datetime('now') where id=?\",\n    [deliveredBy, finalKm, acknowledgement, jobId],\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "jobId",
        "type": "number",
        "optional": false
      },
      {
        "name": "deliveredBy",
        "type": "string",
        "optional": false
      },
      {
        "name": "finalKm",
        "type": "number",
        "optional": false
      },
      {
        "name": "acknowledgement",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/updateDeliveryForActor",
    "service": "finance; TX-03/04/05/12; FIN-01..04",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-updateDeliveryForActor",
    "name": "updateDeliveryForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:6633-6652",
    "calls": [
      "assertAdminBillingAccess",
      "deliveredBy.trim",
      "Number.isFinite",
      "updateDeliveryDetails",
      "acknowledgement.trim"
    ],
    "sql": [],
    "body": "export function updateDeliveryForActor(\n  db: Database,\n  jobId: number,\n  actorId: number,\n  deliveredBy: string,\n  finalKm: number,\n  acknowledgement: string,\n) {\n  assertAdminBillingAccess(db, actorId);\n  if (!deliveredBy.trim()) throw new Error(\"Delivered by is required.\");\n  if (!Number.isFinite(finalKm) || finalKm < 0)\n    throw new Error(\"Final KM cannot be negative.\");\n  updateDeliveryDetails(\n    db,\n    jobId,\n    deliveredBy.trim(),\n    finalKm,\n    acknowledgement.trim(),\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "jobId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "deliveredBy",
        "type": "string",
        "optional": false
      },
      {
        "name": "finalKm",
        "type": "number",
        "optional": false
      },
      {
        "name": "acknowledgement",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/updateDeliveryForActor",
    "service": "finance; TX-03/04/05/12; FIN-01..04",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-markJobDeliveredForActor",
    "name": "markJobDeliveredForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:6654-6702",
    "calls": [
      "new Date().toISOString",
      "assertAdminBillingAccess",
      "one",
      "maybe",
      "db.run",
      "updateDeliveryForActor",
      "setChecklistItemChecked"
    ],
    "sql": [
      "one<JobCard>(db, \"select * from job_cards where id=?\", [jobId])",
      "maybe<GatePass>( db, \"select * from gate_passes where job_card_id=? and voided_at is null\", [jobId], )",
      "one<ChecklistItem>( db, \"select * from checklist_items where job_card_id=? and stage='CLOSED' and label='Delivered' order by cycle_number desc,id desc limit 1\", [jobId], )",
      "db.run(\"savepoint mark_delivered\")",
      "db.run( \"update job_cards set closed_at=coalesce(nullif(closed_at,''),?),updated_at=? where id=?\", [timestamp, timestamp, jobId], )",
      "db.run(\"release savepoint mark_delivered\")",
      "db.run(\"rollback to savepoint mark_delivered\")",
      "db.run(\"release savepoint mark_delivered\")"
    ],
    "body": "export function markJobDeliveredForActor(\n  db: Database,\n  jobId: number,\n  actorId: number,\n  deliveredBy: string,\n  finalKm: number,\n  acknowledgement: string,\n  timestamp = new Date().toISOString(),\n) {\n  assertAdminBillingAccess(db, actorId);\n  const job = one<JobCard>(db, \"select * from job_cards where id=?\", [jobId]);\n  if (job.main_status !== \"CLOSED\")\n    throw new Error(\"Only a closed job can be marked Delivered.\");\n  if (\n    !maybe<GatePass>(\n      db,\n      \"select * from gate_passes where job_card_id=? and voided_at is null\",\n      [jobId],\n    )\n  )\n    throw new Error(\"A current gate pass is required before delivery.\");\n  const item = one<ChecklistItem>(\n    db,\n    \"select * from checklist_items where job_card_id=? and stage='CLOSED' and label='Delivered' order by cycle_number desc,id desc limit 1\",\n    [jobId],\n  );\n  if (item.checked_at) throw new Error(\"This job is already marked Delivered.\");\n  db.run(\"savepoint mark_delivered\");\n  try {\n    updateDeliveryForActor(\n      db,\n      jobId,\n      actorId,\n      deliveredBy,\n      finalKm,\n      acknowledgement,\n    );\n    setChecklistItemChecked(db, item.id, actorId, true, timestamp);\n    db.run(\n      \"update job_cards set closed_at=coalesce(nullif(closed_at,''),?),updated_at=? where id=?\",\n      [timestamp, timestamp, jobId],\n    );\n    db.run(\"release savepoint mark_delivered\");\n  } catch (error) {\n    db.run(\"rollback to savepoint mark_delivered\");\n    db.run(\"release savepoint mark_delivered\");\n    throw error;\n  }\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "jobId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "deliveredBy",
        "type": "string",
        "optional": false
      },
      {
        "name": "finalKm",
        "type": "number",
        "optional": false
      },
      {
        "name": "acknowledgement",
        "type": "string",
        "optional": false
      },
      {
        "name": "timestamp",
        "type": "INFERRED",
        "optional": true,
        "default": "new Date().toISOString()"
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/markJobDeliveredForActor",
    "service": "finance; TX-03/04/05/12; FIN-01..04",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-closeJob",
    "name": "closeJob",
    "file": "src/db.ts",
    "span": "src/db.ts:6704-6708",
    "calls": [],
    "sql": [],
    "body": "export function closeJob(db: Database, jobId: number) {\n  throw new Error(\n    \"A completed job can only close when a valid payment is recorded.\",\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "jobId",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/markJobDeliveredForActor",
    "service": "finance; TX-03/04/05/12; FIN-01..04",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-createFollowup",
    "name": "createFollowup",
    "file": "src/db.ts",
    "span": "src/db.ts:6710-6724",
    "calls": [
      "insert",
      "reconcileArtifactChecklist"
    ],
    "sql": [
      "insert( db, \"insert into followups(job_card_id, note, due_at, done, outcome, created_at, updated_at) values (?, ?, ?, ?, ?, datetime('now'), datetime('now'))\", [ payload.job_card_id, payload.note, payload.due_at, payload.done, payload.outcome ?? \"\", ], )"
    ],
    "body": "export function createFollowup(db: Database, payload: Omit<Followup, \"id\">) {\n  const id = insert(\n    db,\n    \"insert into followups(job_card_id, note, due_at, done, outcome, created_at, updated_at) values (?, ?, ?, ?, ?, datetime('now'), datetime('now'))\",\n    [\n      payload.job_card_id,\n      payload.note,\n      payload.due_at,\n      payload.done,\n      payload.outcome ?? \"\",\n    ],\n  );\n  reconcileArtifactChecklist(db, payload.job_card_id);\n  return id;\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "payload",
        "type": "Omit<Followup, \"id\">",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/createFollowup",
    "service": "followups; scoped aggregate",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-createResolvedFollowup",
    "name": "createResolvedFollowup",
    "file": "src/db.ts",
    "span": "src/db.ts:6730-6761",
    "calls": [
      "new Date().toISOString",
      "db.run",
      "insert",
      "reconcileArtifactChecklist"
    ],
    "sql": [
      "db.run(\"savepoint create_resolved_followup\")",
      "insert( db, \"insert into followups(job_card_id, note, due_at, done, outcome, created_at, updated_at) values (?, ?, ?, 1, ?, ?, ?)\", [ payload.job_card_id, payload.note, payload.due_at, payload.outcome ?? \"\", timestamp, timestamp, ], )",
      "db.run( \"update followups set done=1, updated_at=? where job_card_id=? and archived_at is null and done=0 and id<>?\", [timestamp, payload.job_card_id, id], )",
      "db.run(\"release savepoint create_resolved_followup\")",
      "db.run(\"rollback to savepoint create_resolved_followup\")",
      "db.run(\"release savepoint create_resolved_followup\")"
    ],
    "body": "export function createResolvedFollowup(\n  db: Database,\n  payload: Omit<Followup, \"id\">,\n  timestamp = new Date().toISOString(),\n) {\n  db.run(\"savepoint create_resolved_followup\");\n  try {\n    const id = insert(\n      db,\n      \"insert into followups(job_card_id, note, due_at, done, outcome, created_at, updated_at) values (?, ?, ?, 1, ?, ?, ?)\",\n      [\n        payload.job_card_id,\n        payload.note,\n        payload.due_at,\n        payload.outcome ?? \"\",\n        timestamp,\n        timestamp,\n      ],\n    );\n    db.run(\n      \"update followups set done=1, updated_at=? where job_card_id=? and archived_at is null and done=0 and id<>?\",\n      [timestamp, payload.job_card_id, id],\n    );\n    reconcileArtifactChecklist(db, payload.job_card_id, 0, timestamp);\n    db.run(\"release savepoint create_resolved_followup\");\n    return id;\n  } catch (error) {\n    db.run(\"rollback to savepoint create_resolved_followup\");\n    db.run(\"release savepoint create_resolved_followup\");\n    throw error;\n  }\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "payload",
        "type": "Omit<Followup, \"id\">",
        "optional": false
      },
      {
        "name": "timestamp",
        "type": "INFERRED",
        "optional": true,
        "default": "new Date().toISOString()"
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/createResolvedFollowup",
    "service": "followups; scoped aggregate",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-updateFollowup",
    "name": "updateFollowup",
    "file": "src/db.ts",
    "span": "src/db.ts:6763-6772",
    "calls": [
      "db.run"
    ],
    "sql": [
      "db.run( \"update followups set note=?, due_at=?, done=?, outcome=?, updated_at=datetime('now') where id=?\", [payload.note, payload.due_at, payload.done, payload.outcome ?? \"\", id], )"
    ],
    "body": "export function updateFollowup(\n  db: Database,\n  id: number,\n  payload: Omit<Followup, \"id\">,\n) {\n  db.run(\n    \"update followups set note=?, due_at=?, done=?, outcome=?, updated_at=datetime('now') where id=?\",\n    [payload.note, payload.due_at, payload.done, payload.outcome ?? \"\", id],\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "id",
        "type": "number",
        "optional": false
      },
      {
        "name": "payload",
        "type": "Omit<Followup, \"id\">",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/updateFollowup",
    "service": "followups; scoped aggregate",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-archiveFollowup",
    "name": "archiveFollowup",
    "file": "src/db.ts",
    "span": "src/db.ts:6774-6776",
    "calls": [
      "archive"
    ],
    "sql": [],
    "body": "export function archiveFollowup(db: Database, id: number, reason: string) {\n  archive(db, \"followups\", id, reason);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "id",
        "type": "number",
        "optional": false
      },
      {
        "name": "reason",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/archiveFollowup",
    "service": "followups; scoped aggregate",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-markFollowupDone",
    "name": "markFollowupDone",
    "file": "src/db.ts",
    "span": "src/db.ts:6778-6783",
    "calls": [
      "db.run"
    ],
    "sql": [
      "db.run( \"update followups set done=1, outcome=?, updated_at=datetime('now') where id=?\", [outcome, id], )"
    ],
    "body": "export function markFollowupDone(db: Database, id: number, outcome: string) {\n  db.run(\n    \"update followups set done=1, outcome=?, updated_at=datetime('now') where id=?\",\n    [outcome, id],\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "id",
        "type": "number",
        "optional": false
      },
      {
        "name": "outcome",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/markFollowupDone",
    "service": "followups; scoped aggregate",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-addFollowup",
    "name": "addFollowup",
    "file": "src/db.ts",
    "span": "src/db.ts:6785-6793",
    "calls": [
      "createFollowup",
      "new Date(Date.now() + 86400000).toISOString().slice",
      "new Date(Date.now() + 86400000).toISOString",
      "Date.now"
    ],
    "sql": [],
    "body": "export function addFollowup(db: Database, jobId: number, note: string) {\n  createFollowup(db, {\n    job_card_id: jobId,\n    note,\n    due_at: new Date(Date.now() + 86400000).toISOString().slice(0, 10),\n    done: 0,\n    outcome: \"\",\n  });\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "jobId",
        "type": "number",
        "optional": false
      },
      {
        "name": "note",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/createFollowup",
    "service": "followups; scoped aggregate",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-createPhoto",
    "name": "createPhoto",
    "file": "src/db.ts",
    "span": "src/db.ts:6795-6808",
    "calls": [
      "insert",
      "reconcileArtifactChecklist"
    ],
    "sql": [
      "insert( db, \"insert into photos(job_card_id, label, src, category, created_at, updated_at) values (?, ?, ?, ?, datetime('now'), datetime('now'))\", [ payload.job_card_id, payload.label, payload.src, payload.category ?? \"General\", ], )"
    ],
    "body": "export function createPhoto(db: Database, payload: Omit<Photo, \"id\">) {\n  const id = insert(\n    db,\n    \"insert into photos(job_card_id, label, src, category, created_at, updated_at) values (?, ?, ?, ?, datetime('now'), datetime('now'))\",\n    [\n      payload.job_card_id,\n      payload.label,\n      payload.src,\n      payload.category ?? \"General\",\n    ],\n  );\n  reconcileArtifactChecklist(db, payload.job_card_id);\n  return id;\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "payload",
        "type": "Omit<Photo, \"id\">",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/saveJobPhotoForActor",
    "service": "media; TX-11 + asset finalization",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-updatePhoto",
    "name": "updatePhoto",
    "file": "src/db.ts",
    "span": "src/db.ts:6810-6819",
    "calls": [
      "db.run"
    ],
    "sql": [
      "db.run( \"update photos set label=?, src=?, category=?, updated_at=datetime('now') where id=?\", [payload.label, payload.src, payload.category ?? \"General\", id], )"
    ],
    "body": "export function updatePhoto(\n  db: Database,\n  id: number,\n  payload: Omit<Photo, \"id\">,\n) {\n  db.run(\n    \"update photos set label=?, src=?, category=?, updated_at=datetime('now') where id=?\",\n    [payload.label, payload.src, payload.category ?? \"General\", id],\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "id",
        "type": "number",
        "optional": false
      },
      {
        "name": "payload",
        "type": "Omit<Photo, \"id\">",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/updateJobPhotoForActor",
    "service": "media; TX-11 + asset finalization",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-archivePhoto",
    "name": "archivePhoto",
    "file": "src/db.ts",
    "span": "src/db.ts:6821-6825",
    "calls": [
      "one",
      "archive",
      "resetMissingPhotoEvidence"
    ],
    "sql": [
      "one<Photo>(db, \"select * from photos where id=?\", [id])"
    ],
    "body": "export function archivePhoto(db: Database, id: number, reason: string) {\n  const photo = one<Photo>(db, \"select * from photos where id=?\", [id]);\n  archive(db, \"photos\", id, reason);\n  resetMissingPhotoEvidence(db, photo.job_card_id);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "id",
        "type": "number",
        "optional": false
      },
      {
        "name": "reason",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/archiveJobPhotoForActor",
    "service": "media; TX-11 + asset finalization",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-saveJobPhotoForActor",
    "name": "saveJobPhotoForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:6877-6910",
    "calls": [
      "assertJobMediaMutationAccess",
      "validatePhotoMetadata",
      "validateMediaDataUrl",
      "Number.isFinite",
      "insert",
      "input.originalName.trim",
      "Math.round",
      "reconcileArtifactChecklist"
    ],
    "sql": [
      "insert( db, \"insert into photos(job_card_id,label,src,category,mime_type,byte_size,original_name,width,height,created_at,updated_at) values(?,?,?,?,?,?,?,?,?,datetime('now'),datetime('now'))\", [ jobId, metadata.label, input.src, metadata.category, image.mimeType, image.byteSize, input.originalName.trim(), Math.round(input.width), Math.round(input.height), ], )"
    ],
    "body": "export function saveJobPhotoForActor(\n  db: Database,\n  jobId: number,\n  actorId: number,\n  input: JobPhotoInput,\n) {\n  assertJobMediaMutationAccess(db, jobId, actorId, input.category);\n  const metadata = validatePhotoMetadata(input.label, input.category);\n  const image = validateMediaDataUrl(input.src);\n  if (\n    !Number.isFinite(input.width) ||\n    input.width < 1 ||\n    !Number.isFinite(input.height) ||\n    input.height < 1\n  )\n    throw new Error(\"Image dimensions are invalid.\");\n  const id = insert(\n    db,\n    \"insert into photos(job_card_id,label,src,category,mime_type,byte_size,original_name,width,height,created_at,updated_at) values(?,?,?,?,?,?,?,?,?,datetime('now'),datetime('now'))\",\n    [\n      jobId,\n      metadata.label,\n      input.src,\n      metadata.category,\n      image.mimeType,\n      image.byteSize,\n      input.originalName.trim(),\n      Math.round(input.width),\n      Math.round(input.height),\n    ],\n  );\n  reconcileArtifactChecklist(db, jobId, actorId);\n  return id;\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "jobId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "input",
        "type": "JobPhotoInput",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/saveJobPhotoForActor",
    "service": "media; TX-11 + asset finalization",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-updateJobPhotoForActor",
    "name": "updateJobPhotoForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:6912-6935",
    "calls": [
      "one",
      "assertJobMediaMutationAccess",
      "validatePhotoMetadata",
      "db.run"
    ],
    "sql": [
      "one<Photo>( db, \"select * from photos where id=? and archived_at is null\", [id], )",
      "db.run( \"update photos set label=?,category=?,updated_at=datetime('now') where id=?\", [metadata.label, metadata.category, id], )"
    ],
    "body": "export function updateJobPhotoForActor(\n  db: Database,\n  id: number,\n  actorId: number,\n  input: Pick<JobPhotoInput, \"label\" | \"category\">,\n) {\n  const photo = one<Photo>(\n    db,\n    \"select * from photos where id=? and archived_at is null\",\n    [id],\n  );\n  assertJobMediaMutationAccess(\n    db,\n    photo.job_card_id,\n    actorId,\n    photo.category === \"After Work\" ? \"After Work\" : \"Before Work\",\n  );\n  assertJobMediaMutationAccess(db, photo.job_card_id, actorId, input.category);\n  const metadata = validatePhotoMetadata(input.label, input.category);\n  db.run(\n    \"update photos set label=?,category=?,updated_at=datetime('now') where id=?\",\n    [metadata.label, metadata.category, id],\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "id",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "input",
        "type": "Pick<JobPhotoInput, \"label\" | \"category\">",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/updateJobPhotoForActor",
    "service": "media; TX-11 + asset finalization",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-archiveJobPhotoForActor",
    "name": "archiveJobPhotoForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:6937-6956",
    "calls": [
      "one",
      "assertJobMediaMutationAccess",
      "reason.trim",
      "archivePhoto"
    ],
    "sql": [
      "one<Photo>( db, \"select * from photos where id=? and archived_at is null\", [id], )"
    ],
    "body": "export function archiveJobPhotoForActor(\n  db: Database,\n  id: number,\n  actorId: number,\n  reason: string,\n) {\n  const photo = one<Photo>(\n    db,\n    \"select * from photos where id=? and archived_at is null\",\n    [id],\n  );\n  assertJobMediaMutationAccess(\n    db,\n    photo.job_card_id,\n    actorId,\n    photo.category === \"After Work\" ? \"After Work\" : \"Before Work\",\n  );\n  if (!reason.trim()) throw new Error(\"An archive reason is required.\");\n  archivePhoto(db, id, reason.trim());\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "id",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "reason",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/archiveJobPhotoForActor",
    "service": "media; TX-11 + asset finalization",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-addPhoto",
    "name": "addPhoto",
    "file": "src/db.ts",
    "span": "src/db.ts:6958-6960",
    "calls": [
      "createPhoto"
    ],
    "sql": [],
    "body": "export function addPhoto(db: Database, jobId: number, label: string) {\n  createPhoto(db, { job_card_id: jobId, label, src: \"\", category: \"General\" });\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "jobId",
        "type": "number",
        "optional": false
      },
      {
        "name": "label",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/saveJobPhotoForActor",
    "service": "media; TX-11 + asset finalization",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-searchJobs",
    "name": "searchJobs",
    "file": "src/db.ts",
    "span": "src/db.ts:6962-7030",
    "calls": [
      "criteria.query.trim().toLowerCase",
      "criteria.query.trim",
      "state.jobs.flatMap",
      "view.estimate_items.map",
      "view.photos.map",
      "view.material_movements.map",
      "view.payments.map",
      "view.payments.flatMap",
      "(\n      Object.keys(searchable) as Exclude<SearchCriteria[\"category\"], \"all\">[]\n    ).filter",
      "Object.keys",
      "searchable[category].join(\" \").toLowerCase().includes",
      "searchable[category].join(\" \").toLowerCase",
      "searchable[category].join",
      "categories.filter"
    ],
    "sql": [],
    "body": "export function searchJobs(\n  state: WorkshopState,\n  criteria: SearchCriteria,\n): SearchResult[] {\n  const normalizedQuery = criteria.query.trim().toLowerCase();\n  return state.jobs.flatMap((view) => {\n    if (criteria.status !== \"ALL\" && view.job.main_status !== criteria.status)\n      return [];\n    const searchable: Record<\n      Exclude<SearchCriteria[\"category\"], \"all\">,\n      string[]\n    > = {\n      job: [\n        view.job.job_no,\n        view.advisor.name,\n        view.job.work_list,\n        ...view.estimate_items.map((item) => item.description),\n        ...view.photos.map((photo) => `${photo.label} ${photo.category}`),\n        ...view.material_movements.map(\n          (movement) => `${movement.direction} ${movement.note}`,\n        ),\n      ],\n      customer: [view.customer.name, view.customer.mobile],\n      vehicle: [\n        view.vehicle.number,\n        view.vehicle.make,\n        view.vehicle.model,\n        view.vehicle.color,\n      ],\n      invoice: [\n        view.invoice?.invoice_no ?? \"\",\n        view.invoice?.tally_invoice_no ?? \"\",\n        ...view.payments.map(\n          (payment) => `${payment.mode} ${payment.reference}`,\n        ),\n      ],\n      payment: view.payments.flatMap((payment) => [\n        view.job.job_no,\n        view.invoice?.invoice_no ?? \"\",\n        view.invoice?.tally_invoice_no ?? \"\",\n        view.customer.name,\n        view.customer.mobile,\n        view.vehicle.number,\n        payment.mode,\n        payment.reference,\n        payment.other_detail,\n      ]),\n    };\n    const categories = (\n      Object.keys(searchable) as Exclude<SearchCriteria[\"category\"], \"all\">[]\n    ).filter((category) =>\n      searchable[category].join(\" \").toLowerCase().includes(normalizedQuery),\n    );\n    const permitted =\n      criteria.category === \"all\"\n        ? categories\n        : categories.filter((category) => category === criteria.category);\n    if (normalizedQuery && permitted.length === 0) return [];\n    return [\n      {\n        view,\n        match: {\n          categories: normalizedQuery ? permitted : [],\n          normalizedQuery,\n        },\n      },\n    ];\n  });\n}",
    "parameters": [
      {
        "name": "state",
        "type": "WorkshopState",
        "optional": false
      },
      {
        "name": "criteria",
        "type": "SearchCriteria",
        "optional": false
      }
    ],
    "returnType": "SearchResult[]",
    "classification": "READ",
    "endpoint": "GET /api/v1/ui/state",
    "service": "jobs/estimates; TX-02/11/12",
    "resolvedReturnType": "SearchResult[]"
  },
  {
    "id": "OP-db-closureBlockers",
    "name": "closureBlockers",
    "file": "src/db.ts",
    "span": "src/db.ts:7071-7095",
    "calls": [
      "blockers.push",
      "view.material_requests.some",
      "Math.abs",
      "view.payments.reduce"
    ],
    "sql": [],
    "body": "export function closureBlockers(view?: JobView) {\n  if (!view) return [\"Select a job\"];\n  const blockers: string[] = [];\n  if (view.job.qc_status !== \"Pass\") blockers.push(\"QC pass required\");\n  if (\n    view.material_requests.some(\n      (request) =>\n        Math.abs(\n          request.issued_qty -\n            request.used_qty -\n            request.returned_qty -\n            request.wasted_qty,\n        ) > 0.001,\n    )\n  )\n    blockers.push(\"Material reconciliation required\");\n  if (!view.invoice || view.invoice.voided_at || !view.invoice.tally_invoice_no)\n    blockers.push(\"Available Tally invoice required\");\n  const paid = view.payments.reduce((sum, payment) => sum + payment.amount, 0);\n  if (!view.invoice || paid < view.invoice.total)\n    blockers.push(\"Full payment required\");\n  if (!view.receipt) blockers.push(\"Receipt required\");\n  if (!view.gate_pass) blockers.push(\"Gate pass required\");\n  return blockers;\n}",
    "parameters": [
      {
        "name": "view",
        "type": "JobView",
        "optional": true
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "string[]"
  },
  {
    "id": "OP-db-paymentStatus",
    "name": "paymentStatus",
    "file": "src/db.ts",
    "span": "src/db.ts:7097-7105",
    "calls": [
      "invoiceItemsTotal",
      "view.payments.reduce"
    ],
    "sql": [],
    "body": "export function paymentStatus(view: JobView): PaymentStatus {\n  const total =\n    view.invoice?.total ??\n    invoiceItemsTotal(view.estimate_items, view.estimate);\n  const paid = view.payments.reduce((sum, payment) => sum + payment.amount, 0);\n  if (paid <= 0) return \"Pending\";\n  if (paid < total) return \"Partial\";\n  return \"Paid\";\n}",
    "parameters": [
      {
        "name": "view",
        "type": "JobView",
        "optional": false
      }
    ],
    "returnType": "PaymentStatus",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "PaymentStatus"
  },
  {
    "id": "OP-db-invoiceItemsTotal",
    "name": "invoiceItemsTotal",
    "file": "src/db.ts",
    "span": "src/db.ts:7107-7120",
    "calls": [
      "invoiceTotals",
      "items.map",
      "normalizeGstLine"
    ],
    "sql": [],
    "body": "export function invoiceItemsTotal(items: EstimateItem[], estimate?: Estimate) {\n  return invoiceTotals(\n    items.map((item) => ({\n      qty: item.qty,\n      rate: item.rate,\n      ...normalizeGstLine(\n        item.gst_type,\n        item.gst_rate,\n        estimate?.gst_rate ?? 18,\n      ),\n    })),\n    estimate?.discount ?? 0,\n  ).total;\n}",
    "parameters": [
      {
        "name": "items",
        "type": "EstimateItem[]",
        "optional": false
      },
      {
        "name": "estimate",
        "type": "Estimate",
        "optional": true
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-createSchema",
    "name": "createSchema",
    "file": "src/db.ts",
    "span": "src/db.ts:7122-7176",
    "calls": [
      "db.run"
    ],
    "sql": [
      "db.run(` create table if not exists users(id integer primary key, email text unique, name text, role text, password text); create table if not exists customers(id integer primary key, name text, mobile text unique, type text, address text); create table if not exists vehicles(id integer primary key, customer_id integer, number text unique, make text, model text, color text, km integer, engine_no text); create table if not exists visits(id integer primary key, customer_id integer, vehicle_id integer, advisor_id integer, received_by integer, received_at text, fuel text, odo_reading real, fuel_level_value text, fuel_level_unit text, keys text, accessories text, requested_work text, photos_note text); create table if not exists job_cards(id integer primary key, job_no text unique, visit_id integer, advisor_id integer, technician_id integer, main_status text, sub_status text, work_list text, promised_at text, qc_status text, washing_needed integer, closed_at text, service_type text, pickup_drop text, estimated_delivery text, damage_marks text, damage_marks_recorded_at text); create table if not exists status_history(id integer primary key, job_card_id integer, main_status text, sub_status text, note text, created_at text); create table if not exists checklist_cycles(id integer primary key, job_card_id integer not null, stage text not null, cycle_number integer not null, started_at text not null, completed_at text, unique(job_card_id, stage, cycle_number)); create table if not exists checklist_items(id integer primary key, checklist_cycle_id integer not null, job_card_id integer not null, stage text not null, cycle_number integer not null, item_key text not null, label text not null, sort_order integer not null, checked_by integer, checked_at text, started_at text, completed_at text, unique(checklist_cycle_id, item_key)); create table if not exists estimates(id integer primary key, job_card_id integer, status text, discount real, gst_rate real, approval_note text); create table if not exists estimate_items(id integer primary key, estimate_id integer, kind text, description text, qty real, rate real, gst_type text, gst_rate real); create table if not exists approvals(id integer primary key, job_card_id integer, approved_by text, note text, created_at text); create table if not exists tasks(id integer primary key, job_card_id integer, technician_id integer, title text, status text, notes text); create table if not exists qc_checks(id integer primary key, job_card_id integer, label text, passed integer); create table if not exists invoices(id integer primary key, job_card_id integer, invoice_no text, tally_invoice_no text, discount real default 0, gst_rate real default 18, subtotal real default 0, gst_amount real default 0, total real, status text, notes text default '', document_available integer default 1, document_generated_at text); create table if not exists invoice_items(id integer primary key, invoice_id integer, kind text, description text, qty real, rate real, gst_type text, gst_rate real); create table if not exists payments(id integer primary key, job_card_id integer, invoice_id integer, amount real, mode text, other_detail text default '', reference text, notes text default ''); create table if not exists receipts(id integer primary key, job_card_id integer, invoice_id integer, receipt_no text, voided_at text, void_reason text, created_at text); create table if not exists gate_passes(id integer primary key, job_card_id integer, invoice_id integer, gate_pass_no text, voided_at text, void_reason text, created_at text); create table if not exists inventory(id integer primary key, sku text, category text, name text, unit text, stock_qty real, low_stock_qty real, selling_price real default 0); create table if not exists material_requests(id integer primary key, job_card_id integer, item_id integer, requested_qty real, issued_qty real, used_qty real, returned_qty real, wasted_qty real); create table if not exists material_approvals(id integer primary key, job_card_id integer not null unique, status text not null, submitted_by integer not null, submitted_at text not null, reviewed_by integer, reviewed_at text, rejection_reason text, revision integer not null default 1); create table if not exists material_approval_events(id integer primary key, approval_id integer not null, job_card_id integer not null, action text not null, actor_id integer not null, at text not null, note text not null, revision integer not null); create table if not exists local_purchases(id integer primary key, job_card_id integer, item_description text, quantity real, unit text, unit_cost real, vendor text, bill_reference text, note text, archived_at text, archived_reason text, created_at text, updated_at text); create table if not exists material_purchase_requests(id integer primary key, job_card_id integer not null, item_name text not null, quantity real not null, unit text not null, status text not null default 'Pending', mapped_inventory_item_id integer, material_request_id integer, local_purchase_id integer, completed_by integer, completed_at text, created_at text, updated_at text); create table if not exists material_movements(id integer primary key, job_card_id integer, item_id integer, direction text, qty real, note text, created_at text); create table if not exists suppliers(id integer primary key, name text not null, contact_name text default '', phone text default '', email text default '', gstin text default '', status text not null default 'Active', created_by integer not null, created_at text not null, updated_at text not null); create table if not exists inward_purchases(id integer primary key, supplier_id integer, supplier_invoice_no text default '', invoice_date text default '', po_number text default '', status text not null default 'Draft', subtotal real not null default 0, discount_total real not null default 0, gst_total real not null default 0, total real not null default 0, created_by integer not null, submitted_by integer, submitted_at text, purchase_order_id integer, approved_by integer, approved_at text, created_at text not null, updated_at text not null); create table if not exists inward_purchase_lines(id integer primary key, purchase_id integer not null, item_id integer not null, received_qty real not null, unit_cost real not null, discount real not null default 0, gst_rate real not null default 0, subtotal real not null, gst_amount real not null, total real not null, purchase_order_line_id integer); create table if not exists inward_purchase_attachments(id integer primary key, purchase_id integer not null, original_name text not null, mime_type text not null, byte_size integer not null, storage_key text not null, document_url text not null, uploaded_by integer not null, uploaded_at text not null); create table if not exists inward_purchase_revisions(id integer primary key, purchase_id integer not null, revision_no integer not null, reason text not null, revised_by integer not null, revised_at text not null, unique(purchase_id, revision_no)); create table if not exists inward_purchase_revision_lines(id integer primary key, revision_id integer not null, item_id integer not null, received_qty real not null, unit_cost real not null, discount real not null default 0, gst_rate real not null default 0, subtotal real not null, gst_amount real not null, total real not null); create table if not exists inward_purchase_events(id integer primary key, purchase_id integer not null, kind text not null, actor_id integer not null, at text not null, note text not null); create table if not exists purchase_orders(id integer primary key, supplier_id integer not null, po_number text not null, order_date text not null, notes text not null default '', status text not null default 'Draft', subtotal real not null default 0, discount_total real not null default 0, gst_total real not null default 0, total real not null default 0, created_by integer not null, created_at text not null, updated_at text not null, source_purchase_order_id integer); create unique index if not exists purchase_orders_number_unique on purchase_orders(po_number); create table if not exists purchase_order_lines(id integer primary key, purchase_order_id integer not null, item_id integer not null, item_name text not null default '', unit text not null default '', ordered_qty real not null, unit_cost real not null, discount real not null default 0, gst_rate real not null, subtotal real not null, gst_amount real not null, total real not null, source_purchase_order_line_id integer); create table if not exists purchase_order_quotations(id integer primary key, purchase_order_id integer not null, purchase_order_line_id integer not null, supplier_name text not null, quote_date text not null, quoted_qty real not null, unit_cost real not null, notes text not null default '', created_by integer not null, created_at text not null, updated_at text not null); create table if not exists purchase_order_receipts(id integer primary key, purchase_order_id integer not null, received_by integer not null, received_at text not null, note text not null default ''); create table if not exists purchase_order_receipt_lines(id integer primary key, purchase_order_receipt_id integer not null, purchase_order_line_id integer not null, delivered_qty real not null); create table if not exists purchase_order_confirmations(id integer primary key, purchase_order_id integer not null, purchase_order_line_id integer not null unique, accepted_qty real not null, returned_qty real not null, damaged_qty real not null, wasted_qty real not null, confirmed_by integer not null, confirmed_at text not null); create table if not exists stock_inwards(id integer primary key, item_id integer not null, qty real not null, note text not null default '', purchase_order_id integer, purchase_order_line_id integer, ledger_id integer, received_by integer not null default 0, received_at text not null); create table if not exists photos(id integer primary key, job_card_id integer, label text, src text); create table if not exists followups(id integer primary key, job_card_id integer, note text, due_at text, done integer); create table if not exists service_catalog_items(id integer primary key, name text not null, base_rate real not null, gst_rate real not null default 18, service_department_id integer, brand_id integer, car_segment_id integer, archived_at text, archived_reason text, created_at text, updated_at text); create table if not exists service_brands(id integer primary key, name text not null unique, status text not null default 'ACTIVE', created_at text not null, updated_at text not null); create table if not exists car_segments(id integer primary key, name text not null unique, status text not null default 'ACTIVE', created_at text not null, updated_at text not null); create table if not exists job_task_list_items(id integer primary key, job_card_id integer not null, service_catalog_item_id integer, name text not null, base_rate real not null, gst_rate real not null default 18, done integer not null default 0, archived_at text, archived_reason text, created_at text, updated_at text); create table if not exists bookings(id integer primary key, customer_id integer, vehicle_id integer, customer_name text not null, mobile text not null, customer_type text not null default 'Individual', vehicle_no text not null, make text not null, model text not null, color text not null default '', requested_work text not null, service_type text not null default 'Service Work', booking_date text not null, arrival_window text not null default '', status text not null default 'Booked', created_by integer not null, confirmed_at text, arrived_at text, rescheduled_at text, cancelled_at text, no_show_at text, reschedule_reason text, cancellation_reason text, no_show_reason text, visit_id integer, job_card_id integer, created_at text not null, updated_at text not null); create table if not exists booking_call_logs(id integer primary key, booking_id integer not null, note text not null, called_by integer not null, called_at text not null); create table if not exists booking_events(id integer primary key, booking_id integer not null, kind text not null, actor_id integer not null, at text not null, note text not null default '', previous_booking_date text, booking_date text not null); create table if not exists booking_capacity_limits(booking_date text primary key, service_work_capacity integer not null default 8, general_checkup_followup_capacity integer not null default 4, set_by integer not null, updated_at text not null); create table if not exists booking_capacity_overrides(id integer primary key, booking_id integer not null, booking_date text not null, reason text not null, approved_by integer not null, approved_at text not null); `)"
    ],
    "body": "export function createSchema(db: Database) {\n  db.run(`\n    create table if not exists users(id integer primary key, email text unique, name text, role text, password text);\n    create table if not exists customers(id integer primary key, name text, mobile text unique, type text, address text);\n    create table if not exists vehicles(id integer primary key, customer_id integer, number text unique, make text, model text, color text, km integer, engine_no text);\n    create table if not exists visits(id integer primary key, customer_id integer, vehicle_id integer, advisor_id integer, received_by integer, received_at text, fuel text, odo_reading real, fuel_level_value text, fuel_level_unit text, keys text, accessories text, requested_work text, photos_note text);\n    create table if not exists job_cards(id integer primary key, job_no text unique, visit_id integer, advisor_id integer, technician_id integer, main_status text, sub_status text, work_list text, promised_at text, qc_status text, washing_needed integer, closed_at text, service_type text, pickup_drop text, estimated_delivery text, damage_marks text, damage_marks_recorded_at text);\n    create table if not exists status_history(id integer primary key, job_card_id integer, main_status text, sub_status text, note text, created_at text);\n    create table if not exists checklist_cycles(id integer primary key, job_card_id integer not null, stage text not null, cycle_number integer not null, started_at text not null, completed_at text, unique(job_card_id, stage, cycle_number));\n    create table if not exists checklist_items(id integer primary key, checklist_cycle_id integer not null, job_card_id integer not null, stage text not null, cycle_number integer not null, item_key text not null, label text not null, sort_order integer not null, checked_by integer, checked_at text, started_at text, completed_at text, unique(checklist_cycle_id, item_key));\n    create table if not exists estimates(id integer primary key, job_card_id integer, status text, discount real, gst_rate real, approval_note text);\n    create table if not exists estimate_items(id integer primary key, estimate_id integer, kind text, description text, qty real, rate real, gst_type text, gst_rate real);\n    create table if not exists approvals(id integer primary key, job_card_id integer, approved_by text, note text, created_at text);\n    create table if not exists tasks(id integer primary key, job_card_id integer, technician_id integer, title text, status text, notes text);\n    create table if not exists qc_checks(id integer primary key, job_card_id integer, label text, passed integer);\n    create table if not exists invoices(id integer primary key, job_card_id integer, invoice_no text, tally_invoice_no text, discount real default 0, gst_rate real default 18, subtotal real default 0, gst_amount real default 0, total real, status text, notes text default '', document_available integer default 1, document_generated_at text);\n    create table if not exists invoice_items(id integer primary key, invoice_id integer, kind text, description text, qty real, rate real, gst_type text, gst_rate real);\n    create table if not exists payments(id integer primary key, job_card_id integer, invoice_id integer, amount real, mode text, other_detail text default '', reference text, notes text default '');\n    create table if not exists receipts(id integer primary key, job_card_id integer, invoice_id integer, receipt_no text, voided_at text, void_reason text, created_at text);\n    create table if not exists gate_passes(id integer primary key, job_card_id integer, invoice_id integer, gate_pass_no text, voided_at text, void_reason text, created_at text);\n    create table if not exists inventory(id integer primary key, sku text, category text, name text, unit text, stock_qty real, low_stock_qty real, selling_price real default 0);\n    create table if not exists material_requests(id integer primary key, job_card_id integer, item_id integer, requested_qty real, issued_qty real, used_qty real, returned_qty real, wasted_qty real);\n    create table if not exists material_approvals(id integer primary key, job_card_id integer not null unique, status text not null, submitted_by integer not null, submitted_at text not null, reviewed_by integer, reviewed_at text, rejection_reason text, revision integer not null default 1);\n    create table if not exists material_approval_events(id integer primary key, approval_id integer not null, job_card_id integer not null, action text not null, actor_id integer not null, at text not null, note text not null, revision integer not null);\n    create table if not exists local_purchases(id integer primary key, job_card_id integer, item_description text, quantity real, unit text, unit_cost real, vendor text, bill_reference text, note text, archived_at text, archived_reason text, created_at text, updated_at text);\n    create table if not exists material_purchase_requests(id integer primary key, job_card_id integer not null, item_name text not null, quantity real not null, unit text not null, status text not null default 'Pending', mapped_inventory_item_id integer, material_request_id integer, local_purchase_id integer, completed_by integer, completed_at text, created_at text, updated_at text);\n    create table if not exists material_movements(id integer primary key, job_card_id integer, item_id integer, direction text, qty real, note text, created_at text);\n    create table if not exists suppliers(id integer primary key, name text not null, contact_name text default '', phone text default '', email text default '', gstin text default '', status text not null default 'Active', created_by integer not null, created_at text not null, updated_at text not null);\n    create table if not exists inward_purchases(id integer primary key, supplier_id integer, supplier_invoice_no text default '', invoice_date text default '', po_number text default '', status text not null default 'Draft', subtotal real not null default 0, discount_total real not null default 0, gst_total real not null default 0, total real not null default 0, created_by integer not null, submitted_by integer, submitted_at text, purchase_order_id integer, approved_by integer, approved_at text, created_at text not null, updated_at text not null);\n    create table if not exists inward_purchase_lines(id integer primary key, purchase_id integer not null, item_id integer not null, received_qty real not null, unit_cost real not null, discount real not null default 0, gst_rate real not null default 0, subtotal real not null, gst_amount real not null, total real not null, purchase_order_line_id integer);\n    create table if not exists inward_purchase_attachments(id integer primary key, purchase_id integer not null, original_name text not null, mime_type text not null, byte_size integer not null, storage_key text not null, document_url text not null, uploaded_by integer not null, uploaded_at text not null);\n    create table if not exists inward_purchase_revisions(id integer primary key, purchase_id integer not null, revision_no integer not null, reason text not null, revised_by integer not null, revised_at text not null, unique(purchase_id, revision_no));\n    create table if not exists inward_purchase_revision_lines(id integer primary key, revision_id integer not null, item_id integer not null, received_qty real not null, unit_cost real not null, discount real not null default 0, gst_rate real not null default 0, subtotal real not null, gst_amount real not null, total real not null);\n    create table if not exists inward_purchase_events(id integer primary key, purchase_id integer not null, kind text not null, actor_id integer not null, at text not null, note text not null);\n    create table if not exists purchase_orders(id integer primary key, supplier_id integer not null, po_number text not null, order_date text not null, notes text not null default '', status text not null default 'Draft', subtotal real not null default 0, discount_total real not null default 0, gst_total real not null default 0, total real not null default 0, created_by integer not null, created_at text not null, updated_at text not null, source_purchase_order_id integer);\n    create unique index if not exists purchase_orders_number_unique on purchase_orders(po_number);\n    create table if not exists purchase_order_lines(id integer primary key, purchase_order_id integer not null, item_id integer not null, item_name text not null default '', unit text not null default '', ordered_qty real not null, unit_cost real not null, discount real not null default 0, gst_rate real not null, subtotal real not null, gst_amount real not null, total real not null, source_purchase_order_line_id integer);\n    create table if not exists purchase_order_quotations(id integer primary key, purchase_order_id integer not null, purchase_order_line_id integer not null, supplier_name text not null, quote_date text not null, quoted_qty real not null, unit_cost real not null, notes text not null default '', created_by integer not null, created_at text not null, updated_at text not null);\n    create table if not exists purchase_order_receipts(id integer primary key, purchase_order_id integer not null, received_by integer not null, received_at text not null, note text not null default '');\n    create table if not exists purchase_order_receipt_lines(id integer primary key, purchase_order_receipt_id integer not null, purchase_order_line_id integer not null, delivered_qty real not null);\n    create table if not exists purchase_order_confirmations(id integer primary key, purchase_order_id integer not null, purchase_order_line_id integer not null unique, accepted_qty real not null, returned_qty real not null, damaged_qty real not null, wasted_qty real not null, confirmed_by integer not null, confirmed_at text not null);\n    create table if not exists stock_inwards(id integer primary key, item_id integer not null, qty real not null, note text not null default '', purchase_order_id integer, purchase_order_line_id integer, ledger_id integer, received_by integer not null default 0, received_at text not null);\n    create table if not exists photos(id integer primary key, job_card_id integer, label text, src text);\n    create table if not exists followups(id integer primary key, job_card_id integer, note text, due_at text, done integer);\n    create table if not exists service_catalog_items(id integer primary key, name text not null, base_rate real not null, gst_rate real not null default 18, service_department_id integer, brand_id integer, car_segment_id integer, archived_at text, archived_reason text, created_at text, updated_at text);\n    create table if not exists service_brands(id integer primary key, name text not null unique, status text not null default 'ACTIVE', created_at text not null, updated_at text not null);\n    create table if not exists car_segments(id integer primary key, name text not null unique, status text not null default 'ACTIVE', created_at text not null, updated_at text not null);\n    create table if not exists job_task_list_items(id integer primary key, job_card_id integer not null, service_catalog_item_id integer, name text not null, base_rate real not null, gst_rate real not null default 18, done integer not null default 0, archived_at text, archived_reason text, created_at text, updated_at text);\n    create table if not exists bookings(id integer primary key, customer_id integer, vehicle_id integer, customer_name text not null, mobile text not null, customer_type text not null default 'Individual', vehicle_no text not null, make text not null, model text not null, color text not null default '', requested_work text not null, service_type text not null default 'Service Work', booking_date text not null, arrival_window text not null default '', status text not null default 'Booked', created_by integer not null, confirmed_at text, arrived_at text, rescheduled_at text, cancelled_at text, no_show_at text, reschedule_reason text, cancellation_reason text, no_show_reason text, visit_id integer, job_card_id integer, created_at text not null, updated_at text not null);\n    create table if not exists booking_call_logs(id integer primary key, booking_id integer not null, note text not null, called_by integer not null, called_at text not null);\n    create table if not exists booking_events(id integer primary key, booking_id integer not null, kind text not null, actor_id integer not null, at text not null, note text not null default '', previous_booking_date text, booking_date text not null);\n    create table if not exists booking_capacity_limits(booking_date text primary key, service_work_capacity integer not null default 8, general_checkup_followup_capacity integer not null default 4, set_by integer not null, updated_at text not null);\n    create table if not exists booking_capacity_overrides(id integer primary key, booking_id integer not null, booking_date text not null, reason text not null, approved_by integer not null, approved_at text not null);\n  `);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "RETIRED/IMPORT-ONLY",
    "endpoint": "No browser endpoint; deployment/import service only",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-migrateSchema",
    "name": "migrateSchema",
    "file": "src/db.ts",
    "span": "src/db.ts:7178-7489",
    "calls": [
      "db.run",
      "ensureColumn",
      "all<{ name: string }>(db, \"pragma table_info(booking_capacity_limits)\").some",
      "all",
      "[\n    \"users\",\n    \"customers\",\n    \"vehicles\",\n    \"visits\",\n    \"job_cards\",\n    \"estimates\",\n    \"estimate_items\",\n    \"invoice_items\",\n    \"tasks\",\n    \"inventory\",\n    \"material_requests\",\n    \"photos\",\n    \"followups\",\n  ].forEach",
      "[\"archived_at\", \"archived_reason\", \"created_at\", \"updated_at\"].forEach",
      "[\"invoices\", \"payments\"].forEach",
      "scalar",
      "maybe",
      "insert",
      "recalculateInvoice",
      "syncInvoicePaymentStatus",
      "migrateLifecycleStorage"
    ],
    "sql": [
      "db.run(\"create table if not exists service_departments(id integer primary key, name text not null unique, status text not null default 'ACTIVE', created_at text not null, updated_at text not null)\")",
      "db.run(\"create table if not exists service_brands(id integer primary key, name text not null unique, status text not null default 'ACTIVE', created_at text not null, updated_at text not null)\")",
      "db.run(\"create table if not exists car_segments(id integer primary key, name text not null unique, status text not null default 'ACTIVE', created_at text not null, updated_at text not null)\")",
      "db.run(\"create table if not exists service_department_managers(department_id integer not null, manager_id integer not null, primary key(department_id, manager_id))\")",
      "db.run(\"create table if not exists service_advisor_teams(department_id integer not null, manager_id integer not null, advisor_id integer not null unique, primary key(department_id, advisor_id))\")",
      "db.run(\"create table if not exists sales_leads(id integer primary key, display_name text not null, phone text not null, company text not null default '', company_not_entered integer not null default 0, email text not null default '', email_not_entered integer not null default 0, address text not null default '', service_interest text not null default '', notes text not null default '', stage text not null default 'NEW', temperature text not null default 'WARM', follow_up_due text, site_visit_completed integer not null default 0, site_visit_date text, created_at text not null, updated_at text not null)\")",
      "db.run(\"create table if not exists sales_quotations(id integer primary key, lead_id integer not null, quotation_no text not null unique, status text not null default 'DRAFT', valid_until text, customer_notes text not null default '', discount real not null default 0, subtotal real not null default 0, gst_amount real not null default 0, total real not null default 0, template_id text not null, template_html text not null, created_at text not null, updated_at text not null)\")",
      "db.run(\"create table if not exists sales_quotation_lines(id integer primary key, quotation_id integer not null, line_no integer not null, kind text not null, description text not null, quantity real not null, rate real not null, gst_rate real not null)\")",
      "db.run( \"create table if not exists service_catalog_items(id integer primary key, name text not null, base_rate real not null, gst_rate real not null default 18, service_department_id integer, brand_id integer, car_segment_id integer, archived_at text, archived_reason text, created_at text, updated_at text)\", )",
      "db.run( \"create table if not exists job_task_list_items(id integer primary key, job_card_id integer not null, service_catalog_item_id integer, name text not null, base_rate real not null, gst_rate real not null default 18, done integer not null default 0, archived_at text, archived_reason text, created_at text, updated_at text)\", )",
      "db.run(\"update service_catalog_items set gst_rate=18 where gst_rate is null\")",
      "db.run(\"update job_task_list_items set gst_rate=18 where gst_rate is null\")",
      "db.run( \"create table if not exists bookings(id integer primary key, customer_id integer, vehicle_id integer, customer_name text not null default '', mobile text not null default '', customer_type text not null default 'Individual', vehicle_no text not null default '', make text not null default '', model text not null default '', color text not null default '', requested_work text not null default '', booking_date text not null default '', arrival_window text not null default '', status text not null default 'Booked', created_by integer not null default 0, confirmed_at text, arrived_at text, rescheduled_at text, cancelled_at text, no_show_at text, reschedule_reason text, cancellation_reason text, no_show_reason text, visit_id integer, job_card_id integer, created_at text not null default '', updated_at text not null default '')\", )",
      "db.run(\"update bookings set service_type='Service Work' where service_type is null or service_type='' \")",
      "db.run( \"create table if not exists booking_call_logs(id integer primary key, booking_id integer not null, note text not null, called_by integer not null, called_at text not null)\", )",
      "db.run( \"create table if not exists booking_events(id integer primary key, booking_id integer not null, kind text not null, actor_id integer not null, at text not null, note text not null default '', previous_booking_date text, booking_date text not null default '')\", )",
      "db.run( \"create table if not exists booking_capacity_limits(booking_date text primary key, service_work_capacity integer not null default 8, general_checkup_followup_capacity integer not null default 4, set_by integer not null, updated_at text not null)\", )",
      "all<{ name: string }>(db, \"pragma table_info(booking_capacity_limits)\")",
      "db.run(hasLegacyBookingCapacity ? \"update booking_capacity_limits set service_work_capacity=coalesce(service_work_capacity,capacity,8),general_checkup_followup_capacity=coalesce(general_checkup_followup_capacity,4)\" : \"update booking_capacity_limits set service_work_capacity=coalesce(service_work_capacity,8),general_checkup_followup_capacity=coalesce(general_checkup_followup_capacity,4)\")",
      "db.run( \"create table if not exists booking_capacity_overrides(id integer primary key, booking_id integer not null, booking_date text not null, reason text not null, approved_by integer not null, approved_at text not null)\", )",
      "db.run( \"create table if not exists advisor_attendance(user_id integer not null, date text not null, present integer not null default 1, primary key(user_id, date))\", )",
      "db.run( \"create table if not exists material_events(id integer primary key, job_card_id integer, material_row_id integer, kind text, by_user integer, at text, note text, old_item_id integer, old_qty real, new_item_id integer, new_qty real)\", )",
      "db.run( \"create table if not exists stock_ledger(id integer primary key, job_card_id integer, material_row_id integer, item_id integer, qty real, type text, by_user integer, at text, note text)\", )",
      "db.run( \"create table if not exists suppliers(id integer primary key, name text not null, contact_name text default '', phone text default '', email text default '', gstin text default '', status text not null default 'Active', created_by integer not null default 0, created_at text not null default '', updated_at text not null default '')\", )",
      "db.run( \"create table if not exists inward_purchases(id integer primary key, supplier_id integer, supplier_invoice_no text default '', invoice_date text default '', po_number text default '', status text not null default 'Draft', subtotal real not null default 0, discount_total real not null default 0, gst_total real not null default 0, total real not null default 0, created_by integer not null default 0, submitted_by integer, submitted_at text, created_at text not null default '', updated_at text not null default '')\", )",
      "db.run( \"create table if not exists inward_purchase_lines(id integer primary key, purchase_id integer not null, item_id integer not null, received_qty real not null, unit_cost real not null, discount real not null default 0, gst_rate real not null default 0, subtotal real not null, gst_amount real not null, total real not null)\", )",
      "db.run( \"create table if not exists inward_purchase_attachments(id integer primary key, purchase_id integer not null, original_name text not null, mime_type text not null, byte_size integer not null, storage_key text not null, document_url text not null, uploaded_by integer not null default 0, uploaded_at text not null default '')\", )",
      "db.run( \"create table if not exists inward_purchase_revisions(id integer primary key, purchase_id integer not null, revision_no integer not null, reason text not null, revised_by integer not null, revised_at text not null, unique(purchase_id, revision_no))\", )",
      "db.run( \"create table if not exists inward_purchase_revision_lines(id integer primary key, revision_id integer not null, item_id integer not null, received_qty real not null, unit_cost real not null, discount real not null default 0, gst_rate real not null default 0, subtotal real not null, gst_amount real not null, total real not null)\", )",
      "db.run( \"create table if not exists inward_purchase_events(id integer primary key, purchase_id integer not null, kind text not null, actor_id integer not null, at text not null, note text not null)\", )",
      "db.run( \"create table if not exists purchase_orders(id integer primary key, supplier_id integer not null, po_number text not null, order_date text not null, notes text not null default '', status text not null default 'Draft', subtotal real not null default 0, discount_total real not null default 0, gst_total real not null default 0, total real not null default 0, created_by integer not null, created_at text not null, updated_at text not null)\", )",
      "db.run( \"create unique index if not exists purchase_orders_number_unique on purchase_orders(po_number)\", )",
      "db.run( \"create table if not exists purchase_order_lines(id integer primary key, purchase_order_id integer not null, item_id integer not null, ordered_qty real not null, unit_cost real not null, discount real not null default 0, gst_rate real not null default 0, subtotal real not null, gst_amount real not null, total real not null)\", )",
      "db.run( \"create table if not exists purchase_order_quotations(id integer primary key, purchase_order_id integer not null, purchase_order_line_id integer not null, supplier_name text not null, quote_date text not null, quoted_qty real not null, unit_cost real not null, notes text not null default '', created_by integer not null, created_at text not null, updated_at text not null)\", )",
      "db.run( \"create table if not exists purchase_order_receipts(id integer primary key, purchase_order_id integer not null, received_by integer not null, received_at text not null, note text not null default '')\", )",
      "db.run( \"create table if not exists purchase_order_receipt_lines(id integer primary key, purchase_order_receipt_id integer not null, purchase_order_line_id integer not null, delivered_qty real not null)\", )",
      "db.run( \"create table if not exists purchase_order_confirmations(id integer primary key, purchase_order_id integer not null, purchase_order_line_id integer not null unique, accepted_qty real not null, returned_qty real not null, damaged_qty real not null, wasted_qty real not null, confirmed_by integer not null, confirmed_at text not null)\", )",
      "db.run( \"create table if not exists stock_inwards(id integer primary key, item_id integer not null, qty real not null, note text not null default '', purchase_order_id integer, purchase_order_line_id integer, ledger_id integer, received_by integer not null default 0, received_at text not null)\", )",
      "db.run( \"create unique index if not exists inward_supplier_invoice_submitted on inward_purchases(supplier_id, supplier_invoice_no) where status='Submitted'\", )",
      "db.run( \"update inward_purchases set status='Received' where status='Submitted'\", )",
      "db.run(\"drop index if exists inward_supplier_invoice_submitted\")",
      "db.run( \"create unique index if not exists inward_supplier_invoice_received on inward_purchases(supplier_id, supplier_invoice_no) where status in ('Received','Submitted')\", )",
      "db.run( \"create table if not exists local_purchases(id integer primary key, job_card_id integer, item_description text, quantity real, unit text, unit_cost real, vendor text, bill_reference text, note text, archived_at text, archived_reason text, created_at text, updated_at text)\", )",
      "db.run( \"create table if not exists material_purchase_requests(id integer primary key, job_card_id integer not null, item_name text not null, quantity real not null, unit text not null, status text not null default 'Pending', mapped_inventory_item_id integer, material_request_id integer, local_purchase_id integer, completed_by integer, completed_at text, created_at text, updated_at text)\", )",
      "db.run( \"create table if not exists material_approvals(id integer primary key, job_card_id integer not null unique, status text not null, submitted_by integer not null, submitted_at text not null, reviewed_by integer, reviewed_at text, rejection_reason text, revision integer not null default 1)\", )",
      "db.run( \"create table if not exists material_approval_events(id integer primary key, approval_id integer not null, job_card_id integer not null, action text not null, actor_id integer not null, at text not null, note text not null, revision integer not null)\", )",
      "db.run( \"create table if not exists invoice_events(id integer primary key, job_card_id integer, invoice_id integer, kind text, by_user integer, at text, note text, old_total real, new_total real, detail text)\", )",
      "db.run( \"update estimate_items set gst_rate=(select gst_rate from estimates where estimates.id=estimate_items.estimate_id) where gst_rate is null\", )",
      "db.run( \"update invoice_items set gst_rate=(select gst_rate from invoices where invoices.id=invoice_items.invoice_id) where gst_rate is null\", )",
      "db.run( \"update estimate_items set gst_type=case when coalesce(gst_rate, 18)=0 then 'No GST' else 'CGST+SGST' end where gst_type is null\", )",
      "db.run( \"update invoice_items set gst_type=case when coalesce(gst_rate, 18)=0 then 'No GST' else 'CGST+SGST' end where gst_type is null\", )",
      "db.run(\"update inventory set selling_price=0 where selling_price is null\")",
      "db.run( \"update material_requests set status='Issued' where status='Requested' and issued_qty>0 and issued_qty>=requested_qty\", )",
      "db.run( \"update invoices set document_available=1,document_generated_at=coalesce(document_generated_at,created_at,datetime('now')) where voided_at is null\", )",
      "db.run( \"update invoices set status='Pending' where status in ('Open','Draft','Generated')\", )",
      "db.run( \"update payments set invoice_id=(select id from invoices where invoices.job_card_id=payments.job_card_id and invoices.voided_at is null order by id desc limit 1) where invoice_id is null\", )",
      "db.run( \"update receipts set invoice_id=(select id from invoices where invoices.job_card_id=receipts.job_card_id and invoices.voided_at is null order by id desc limit 1) where invoice_id is null\", )",
      "db.run( \"update gate_passes set invoice_id=(select id from invoices where invoices.job_card_id=gate_passes.job_card_id and invoices.voided_at is null order by id desc limit 1) where invoice_id is null\", )",
      "all<Invoice>( db, \"select * from invoices where voided_at is null order by id\", )",
      "scalar<number>( db, \"select count(*) from invoice_items where invoice_id=?\", [invoice.id], )",
      "maybe<Estimate>( db, \"select * from estimates where job_card_id=? and archived_at is null order by id desc limit 1\", [invoice.job_card_id], )",
      "all<EstimateItem>( db, \"select * from estimate_items where estimate_id=? and archived_at is null order by id\", [estimate.id], )",
      "insert( db, \"insert into invoice_items(invoice_id,kind,description,qty,rate,created_at,updated_at) values(?,?,?,?,?,datetime('now'),datetime('now'))\", [invoice.id, item.kind, item.description, item.qty, item.rate], )",
      "db.run(\"update invoices set discount=?,gst_rate=? where id=?\", [ estimate.discount, estimate.gst_rate, invoice.id, ])",
      "scalar<number>( db, \"select count(*) from invoice_items where invoice_id=?\", [invoice.id], )"
    ],
    "body": "export function migrateSchema(db: Database) {\n  db.run(\"create table if not exists service_departments(id integer primary key, name text not null unique, status text not null default 'ACTIVE', created_at text not null, updated_at text not null)\");\n  db.run(\"create table if not exists service_brands(id integer primary key, name text not null unique, status text not null default 'ACTIVE', created_at text not null, updated_at text not null)\");\n  db.run(\"create table if not exists car_segments(id integer primary key, name text not null unique, status text not null default 'ACTIVE', created_at text not null, updated_at text not null)\");\n  db.run(\"create table if not exists service_department_managers(department_id integer not null, manager_id integer not null, primary key(department_id, manager_id))\");\n  db.run(\"create table if not exists service_advisor_teams(department_id integer not null, manager_id integer not null, advisor_id integer not null unique, primary key(department_id, advisor_id))\");\n  db.run(\"create table if not exists sales_leads(id integer primary key, display_name text not null, phone text not null, company text not null default '', company_not_entered integer not null default 0, email text not null default '', email_not_entered integer not null default 0, address text not null default '', service_interest text not null default '', notes text not null default '', stage text not null default 'NEW', temperature text not null default 'WARM', follow_up_due text, site_visit_completed integer not null default 0, site_visit_date text, created_at text not null, updated_at text not null)\");\n  db.run(\"create table if not exists sales_quotations(id integer primary key, lead_id integer not null, quotation_no text not null unique, status text not null default 'DRAFT', valid_until text, customer_notes text not null default '', discount real not null default 0, subtotal real not null default 0, gst_amount real not null default 0, total real not null default 0, template_id text not null, template_html text not null, created_at text not null, updated_at text not null)\");\n  db.run(\"create table if not exists sales_quotation_lines(id integer primary key, quotation_id integer not null, line_no integer not null, kind text not null, description text not null, quantity real not null, rate real not null, gst_rate real not null)\");\n  db.run(\n    \"create table if not exists service_catalog_items(id integer primary key, name text not null, base_rate real not null, gst_rate real not null default 18, service_department_id integer, brand_id integer, car_segment_id integer, archived_at text, archived_reason text, created_at text, updated_at text)\",\n  );\n  db.run(\n    \"create table if not exists job_task_list_items(id integer primary key, job_card_id integer not null, service_catalog_item_id integer, name text not null, base_rate real not null, gst_rate real not null default 18, done integer not null default 0, archived_at text, archived_reason text, created_at text, updated_at text)\",\n  );\n  ensureColumn(db, \"service_catalog_items\", \"gst_rate\", \"real not null default 18\");\n  ensureColumn(db, \"service_catalog_items\", \"service_department_id\", \"integer\");\n  ensureColumn(db, \"service_catalog_items\", \"brand_id\", \"integer\");\n  ensureColumn(db, \"service_catalog_items\", \"car_segment_id\", \"integer\");\n  ensureColumn(db, \"job_task_list_items\", \"gst_rate\", \"real not null default 18\");\n  ensureColumn(db, \"sales_leads\", \"company_not_entered\", \"integer not null default 0\");\n  ensureColumn(db, \"sales_leads\", \"email_not_entered\", \"integer not null default 0\");\n  db.run(\"update service_catalog_items set gst_rate=18 where gst_rate is null\");\n  db.run(\"update job_task_list_items set gst_rate=18 where gst_rate is null\");\n  ensureColumn(db, \"estimate_items\", \"task_list_item_id\", \"integer\");\n  db.run(\n    \"create table if not exists bookings(id integer primary key, customer_id integer, vehicle_id integer, customer_name text not null default '', mobile text not null default '', customer_type text not null default 'Individual', vehicle_no text not null default '', make text not null default '', model text not null default '', color text not null default '', requested_work text not null default '', booking_date text not null default '', arrival_window text not null default '', status text not null default 'Booked', created_by integer not null default 0, confirmed_at text, arrived_at text, rescheduled_at text, cancelled_at text, no_show_at text, reschedule_reason text, cancellation_reason text, no_show_reason text, visit_id integer, job_card_id integer, created_at text not null default '', updated_at text not null default '')\",\n  );\n  ensureColumn(db, \"bookings\", \"visit_id\", \"integer\");\n  ensureColumn(db, \"bookings\", \"job_card_id\", \"integer\");\n  ensureColumn(db, \"bookings\", \"service_type\", \"text not null default 'Service Work'\");\n  db.run(\"update bookings set service_type='Service Work' where service_type is null or service_type='' \");\n  db.run(\n    \"create table if not exists booking_call_logs(id integer primary key, booking_id integer not null, note text not null, called_by integer not null, called_at text not null)\",\n  );\n  db.run(\n    \"create table if not exists booking_events(id integer primary key, booking_id integer not null, kind text not null, actor_id integer not null, at text not null, note text not null default '', previous_booking_date text, booking_date text not null default '')\",\n  );\n  db.run(\n    \"create table if not exists booking_capacity_limits(booking_date text primary key, service_work_capacity integer not null default 8, general_checkup_followup_capacity integer not null default 4, set_by integer not null, updated_at text not null)\",\n  );\n  ensureColumn(db, \"booking_capacity_limits\", \"service_work_capacity\", \"integer\");\n  ensureColumn(db, \"booking_capacity_limits\", \"general_checkup_followup_capacity\", \"integer\");\n  const hasLegacyBookingCapacity = all<{ name: string }>(db, \"pragma table_info(booking_capacity_limits)\").some((column) => column.name === \"capacity\");\n  db.run(hasLegacyBookingCapacity\n    ? \"update booking_capacity_limits set service_work_capacity=coalesce(service_work_capacity,capacity,8),general_checkup_followup_capacity=coalesce(general_checkup_followup_capacity,4)\"\n    : \"update booking_capacity_limits set service_work_capacity=coalesce(service_work_capacity,8),general_checkup_followup_capacity=coalesce(general_checkup_followup_capacity,4)\");\n  db.run(\n    \"create table if not exists booking_capacity_overrides(id integer primary key, booking_id integer not null, booking_date text not null, reason text not null, approved_by integer not null, approved_at text not null)\",\n  );\n  db.run(\n    \"create table if not exists advisor_attendance(user_id integer not null, date text not null, present integer not null default 1, primary key(user_id, date))\",\n  );\n  db.run(\n    \"create table if not exists material_events(id integer primary key, job_card_id integer, material_row_id integer, kind text, by_user integer, at text, note text, old_item_id integer, old_qty real, new_item_id integer, new_qty real)\",\n  );\n  db.run(\n    \"create table if not exists stock_ledger(id integer primary key, job_card_id integer, material_row_id integer, item_id integer, qty real, type text, by_user integer, at text, note text)\",\n  );\n  ensureColumn(db, \"stock_ledger\", \"inward_purchase_line_id\", \"integer\");\n  db.run(\n    \"create table if not exists suppliers(id integer primary key, name text not null, contact_name text default '', phone text default '', email text default '', gstin text default '', status text not null default 'Active', created_by integer not null default 0, created_at text not null default '', updated_at text not null default '')\",\n  );\n  db.run(\n    \"create table if not exists inward_purchases(id integer primary key, supplier_id integer, supplier_invoice_no text default '', invoice_date text default '', po_number text default '', status text not null default 'Draft', subtotal real not null default 0, discount_total real not null default 0, gst_total real not null default 0, total real not null default 0, created_by integer not null default 0, submitted_by integer, submitted_at text, created_at text not null default '', updated_at text not null default '')\",\n  );\n  db.run(\n    \"create table if not exists inward_purchase_lines(id integer primary key, purchase_id integer not null, item_id integer not null, received_qty real not null, unit_cost real not null, discount real not null default 0, gst_rate real not null default 0, subtotal real not null, gst_amount real not null, total real not null)\",\n  );\n  db.run(\n    \"create table if not exists inward_purchase_attachments(id integer primary key, purchase_id integer not null, original_name text not null, mime_type text not null, byte_size integer not null, storage_key text not null, document_url text not null, uploaded_by integer not null default 0, uploaded_at text not null default '')\",\n  );\n  db.run(\n    \"create table if not exists inward_purchase_revisions(id integer primary key, purchase_id integer not null, revision_no integer not null, reason text not null, revised_by integer not null, revised_at text not null, unique(purchase_id, revision_no))\",\n  );\n  db.run(\n    \"create table if not exists inward_purchase_revision_lines(id integer primary key, revision_id integer not null, item_id integer not null, received_qty real not null, unit_cost real not null, discount real not null default 0, gst_rate real not null default 0, subtotal real not null, gst_amount real not null, total real not null)\",\n  );\n  db.run(\n    \"create table if not exists inward_purchase_events(id integer primary key, purchase_id integer not null, kind text not null, actor_id integer not null, at text not null, note text not null)\",\n  );\n  db.run(\n    \"create table if not exists purchase_orders(id integer primary key, supplier_id integer not null, po_number text not null, order_date text not null, notes text not null default '', status text not null default 'Draft', subtotal real not null default 0, discount_total real not null default 0, gst_total real not null default 0, total real not null default 0, created_by integer not null, created_at text not null, updated_at text not null)\",\n  );\n  db.run(\n    \"create unique index if not exists purchase_orders_number_unique on purchase_orders(po_number)\",\n  );\n  db.run(\n    \"create table if not exists purchase_order_lines(id integer primary key, purchase_order_id integer not null, item_id integer not null, ordered_qty real not null, unit_cost real not null, discount real not null default 0, gst_rate real not null default 0, subtotal real not null, gst_amount real not null, total real not null)\",\n  );\n  ensureColumn(db, \"purchase_order_lines\", \"item_name\", \"text not null default ''\");\n  ensureColumn(db, \"purchase_order_lines\", \"unit\", \"text not null default ''\");\n  ensureColumn(db, \"purchase_orders\", \"source_purchase_order_id\", \"integer\");\n  ensureColumn(db, \"purchase_order_lines\", \"source_purchase_order_line_id\", \"integer\");\n  db.run(\n    \"create table if not exists purchase_order_quotations(id integer primary key, purchase_order_id integer not null, purchase_order_line_id integer not null, supplier_name text not null, quote_date text not null, quoted_qty real not null, unit_cost real not null, notes text not null default '', created_by integer not null, created_at text not null, updated_at text not null)\",\n  );\n  db.run(\n    \"create table if not exists purchase_order_receipts(id integer primary key, purchase_order_id integer not null, received_by integer not null, received_at text not null, note text not null default '')\",\n  );\n  db.run(\n    \"create table if not exists purchase_order_receipt_lines(id integer primary key, purchase_order_receipt_id integer not null, purchase_order_line_id integer not null, delivered_qty real not null)\",\n  );\n  db.run(\n    \"create table if not exists purchase_order_confirmations(id integer primary key, purchase_order_id integer not null, purchase_order_line_id integer not null unique, accepted_qty real not null, returned_qty real not null, damaged_qty real not null, wasted_qty real not null, confirmed_by integer not null, confirmed_at text not null)\",\n  );\n  db.run(\n    \"create table if not exists stock_inwards(id integer primary key, item_id integer not null, qty real not null, note text not null default '', purchase_order_id integer, purchase_order_line_id integer, ledger_id integer, received_by integer not null default 0, received_at text not null)\",\n  );\n  db.run(\n    \"create unique index if not exists inward_supplier_invoice_submitted on inward_purchases(supplier_id, supplier_invoice_no) where status='Submitted'\",\n  );\n  ensureColumn(db, \"inward_purchases\", \"purchase_order_id\", \"integer\");\n  ensureColumn(db, \"inward_purchases\", \"approved_by\", \"integer\");\n  ensureColumn(db, \"inward_purchases\", \"approved_at\", \"text\");\n  ensureColumn(\n    db,\n    \"inward_purchase_lines\",\n    \"purchase_order_line_id\",\n    \"integer\",\n  );\n  // Legacy posted receipts already affected stock; retain them as read-only received history.\n  db.run(\n    \"update inward_purchases set status='Received' where status='Submitted'\",\n  );\n  db.run(\"drop index if exists inward_supplier_invoice_submitted\");\n  db.run(\n    \"create unique index if not exists inward_supplier_invoice_received on inward_purchases(supplier_id, supplier_invoice_no) where status in ('Received','Submitted')\",\n  );\n  db.run(\n    \"create table if not exists local_purchases(id integer primary key, job_card_id integer, item_description text, quantity real, unit text, unit_cost real, vendor text, bill_reference text, note text, archived_at text, archived_reason text, created_at text, updated_at text)\",\n  );\n  db.run(\n    \"create table if not exists material_purchase_requests(id integer primary key, job_card_id integer not null, item_name text not null, quantity real not null, unit text not null, status text not null default 'Pending', mapped_inventory_item_id integer, material_request_id integer, local_purchase_id integer, completed_by integer, completed_at text, created_at text, updated_at text)\",\n  );\n  ensureColumn(\n    db,\n    \"material_requests\",\n    \"status\",\n    \"text not null default 'Requested'\",\n  );\n  db.run(\n    \"create table if not exists material_approvals(id integer primary key, job_card_id integer not null unique, status text not null, submitted_by integer not null, submitted_at text not null, reviewed_by integer, reviewed_at text, rejection_reason text, revision integer not null default 1)\",\n  );\n  db.run(\n    \"create table if not exists material_approval_events(id integer primary key, approval_id integer not null, job_card_id integer not null, action text not null, actor_id integer not null, at text not null, note text not null, revision integer not null)\",\n  );\n  ensureColumn(db, \"material_requests\", \"invoiced_in\", \"integer\");\n  ensureColumn(db, \"estimate_items\", \"gst_type\", \"text\");\n  ensureColumn(db, \"estimate_items\", \"gst_rate\", \"real\");\n  ensureColumn(db, \"invoice_items\", \"gst_type\", \"text\");\n  ensureColumn(db, \"invoice_items\", \"gst_rate\", \"real\");\n  ensureColumn(db, \"invoice_items\", \"material_row_id\", \"integer\");\n  db.run(\n    \"create table if not exists invoice_events(id integer primary key, job_card_id integer, invoice_id integer, kind text, by_user integer, at text, note text, old_total real, new_total real, detail text)\",\n  );\n  db.run(\n    \"update estimate_items set gst_rate=(select gst_rate from estimates where estimates.id=estimate_items.estimate_id) where gst_rate is null\",\n  );\n  db.run(\n    \"update invoice_items set gst_rate=(select gst_rate from invoices where invoices.id=invoice_items.invoice_id) where gst_rate is null\",\n  );\n  db.run(\n    \"update estimate_items set gst_type=case when coalesce(gst_rate, 18)=0 then 'No GST' else 'CGST+SGST' end where gst_type is null\",\n  );\n  db.run(\n    \"update invoice_items set gst_type=case when coalesce(gst_rate, 18)=0 then 'No GST' else 'CGST+SGST' end where gst_type is null\",\n  );\n  ensureColumn(db, \"material_requests\", \"note\", \"text\");\n  ensureColumn(db, \"inventory\", \"selling_price\", \"real default 0\");\n  db.run(\"update inventory set selling_price=0 where selling_price is null\");\n  db.run(\n    \"update material_requests set status='Issued' where status='Requested' and issued_qty>0 and issued_qty>=requested_qty\",\n  );\n  [\n    \"users\",\n    \"customers\",\n    \"vehicles\",\n    \"visits\",\n    \"job_cards\",\n    \"estimates\",\n    \"estimate_items\",\n    \"invoice_items\",\n    \"tasks\",\n    \"inventory\",\n    \"material_requests\",\n    \"photos\",\n    \"followups\",\n  ].forEach((table) => {\n    ensureColumn(db, table, \"archived_at\", \"text\");\n    ensureColumn(db, table, \"archived_reason\", \"text\");\n    ensureColumn(db, table, \"created_at\", \"text\");\n    ensureColumn(db, table, \"updated_at\", \"text\");\n  });\n  [\"archived_at\", \"archived_reason\", \"created_at\", \"updated_at\"].forEach(\n    (column) => ensureColumn(db, \"local_purchases\", column, \"text\"),\n  );\n  ensureColumn(db, \"local_purchases\", \"note\", \"text\");\n  [\"invoices\", \"payments\"].forEach((table) => {\n    ensureColumn(db, table, \"voided_at\", \"text\");\n    ensureColumn(db, table, \"void_reason\", \"text\");\n    ensureColumn(db, table, \"created_at\", \"text\");\n    ensureColumn(db, table, \"updated_at\", \"text\");\n  });\n  ensureColumn(db, \"invoices\", \"discount\", \"real default 0\");\n  ensureColumn(db, \"invoices\", \"gst_rate\", \"real default 18\");\n  ensureColumn(db, \"invoices\", \"subtotal\", \"real default 0\");\n  ensureColumn(db, \"invoices\", \"gst_amount\", \"real default 0\");\n  ensureColumn(db, \"invoices\", \"notes\", \"text default ''\");\n  ensureColumn(db, \"invoices\", \"document_available\", \"integer default 1\");\n  ensureColumn(db, \"invoices\", \"document_generated_at\", \"text\");\n  // Retain the legacy column for stored-data compatibility, but active invoices\n  // are documents by definition. Backfill generation metadata at the same time.\n  db.run(\n    \"update invoices set document_available=1,document_generated_at=coalesce(document_generated_at,created_at,datetime('now')) where voided_at is null\",\n  );\n  ensureColumn(db, \"payments\", \"invoice_id\", \"integer\");\n  ensureColumn(db, \"payments\", \"other_detail\", \"text default ''\");\n  ensureColumn(db, \"payments\", \"notes\", \"text default ''\");\n  for (const table of [\"receipts\", \"gate_passes\"]) {\n    ensureColumn(db, table, \"invoice_id\", \"integer\");\n    ensureColumn(db, table, \"voided_at\", \"text\");\n    ensureColumn(db, table, \"void_reason\", \"text\");\n    ensureColumn(db, table, \"created_at\", \"text\");\n  }\n  db.run(\n    \"update invoices set status='Pending' where status in ('Open','Draft','Generated')\",\n  );\n  db.run(\n    \"update payments set invoice_id=(select id from invoices where invoices.job_card_id=payments.job_card_id and invoices.voided_at is null order by id desc limit 1) where invoice_id is null\",\n  );\n  db.run(\n    \"update receipts set invoice_id=(select id from invoices where invoices.job_card_id=receipts.job_card_id and invoices.voided_at is null order by id desc limit 1) where invoice_id is null\",\n  );\n  db.run(\n    \"update gate_passes set invoice_id=(select id from invoices where invoices.job_card_id=gate_passes.job_card_id and invoices.voided_at is null order by id desc limit 1) where invoice_id is null\",\n  );\n  for (const invoice of all<Invoice>(\n    db,\n    \"select * from invoices where voided_at is null order by id\",\n  )) {\n    if (\n      scalar<number>(\n        db,\n        \"select count(*) from invoice_items where invoice_id=?\",\n        [invoice.id],\n      ) === 0\n    ) {\n      const estimate = maybe<Estimate>(\n        db,\n        \"select * from estimates where job_card_id=? and archived_at is null order by id desc limit 1\",\n        [invoice.job_card_id],\n      );\n      if (estimate) {\n        for (const item of all<EstimateItem>(\n          db,\n          \"select * from estimate_items where estimate_id=? and archived_at is null order by id\",\n          [estimate.id],\n        )) {\n          insert(\n            db,\n            \"insert into invoice_items(invoice_id,kind,description,qty,rate,created_at,updated_at) values(?,?,?,?,?,datetime('now'),datetime('now'))\",\n            [invoice.id, item.kind, item.description, item.qty, item.rate],\n          );\n        }\n        db.run(\"update invoices set discount=?,gst_rate=? where id=?\", [\n          estimate.discount,\n          estimate.gst_rate,\n          invoice.id,\n        ]);\n        if (\n          scalar<number>(\n            db,\n            \"select count(*) from invoice_items where invoice_id=?\",\n            [invoice.id],\n          ) > 0\n        )\n          recalculateInvoice(db, invoice.id);\n      }\n    }\n    syncInvoicePaymentStatus(db, invoice.id);\n  }\n  ensureColumn(db, \"job_cards\", \"advisor_notes\", \"text\");\n  ensureColumn(db, \"job_cards\", \"customer_instructions\", \"text\");\n  ensureColumn(db, \"job_cards\", \"internal_instructions\", \"text\");\n  ensureColumn(db, \"job_cards\", \"delivery_by\", \"text\");\n  ensureColumn(db, \"job_cards\", \"final_km\", \"real\");\n  ensureColumn(db, \"job_cards\", \"acknowledgement\", \"text\");\n  ensureColumn(db, \"job_cards\", \"service_type\", \"text\");\n  ensureColumn(db, \"job_cards\", \"pickup_drop\", \"text\");\n  ensureColumn(db, \"job_cards\", \"estimated_delivery\", \"text\");\n  ensureColumn(db, \"job_cards\", \"damage_marks\", \"text\");\n  ensureColumn(db, \"job_cards\", \"damage_marks_recorded_at\", \"text\");\n  ensureColumn(db, \"visits\", \"odo_reading\", \"real\");\n  ensureColumn(db, \"visits\", \"fuel_level_value\", \"text\");\n  ensureColumn(db, \"visits\", \"fuel_level_unit\", \"text\");\n  ensureColumn(db, \"vehicles\", \"engine_no\", \"text\");\n  ensureColumn(db, \"customers\", \"address\", \"text\");\n  ensureColumn(db, \"tasks\", \"started_at\", \"text\");\n  ensureColumn(db, \"tasks\", \"paused_at\", \"text\");\n  ensureColumn(db, \"tasks\", \"completed_at\", \"text\");\n  ensureColumn(db, \"qc_checks\", \"fail_reason\", \"text\");\n  ensureColumn(db, \"qc_checks\", \"archived_at\", \"text\");\n  ensureColumn(db, \"photos\", \"category\", \"text\");\n  ensureColumn(db, \"photos\", \"mime_type\", \"text\");\n  ensureColumn(db, \"photos\", \"byte_size\", \"integer\");\n  ensureColumn(db, \"photos\", \"original_name\", \"text\");\n  ensureColumn(db, \"photos\", \"width\", \"integer\");\n  ensureColumn(db, \"photos\", \"height\", \"integer\");\n  ensureColumn(db, \"followups\", \"outcome\", \"text\");\n  migrateLifecycleStorage(db);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "RETIRED/IMPORT-ONLY",
    "endpoint": "No browser endpoint; deployment/import service only",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-migrateLifecycleStorage",
    "name": "migrateLifecycleStorage",
    "file": "src/db.ts",
    "span": "src/db.ts:7491-7521",
    "calls": [
      "db.run",
      "ensureColumn",
      "OPTIONAL_CHECKLIST_ITEMS.map((label) => `'${label}'`).join",
      "OPTIONAL_CHECKLIST_ITEMS.map",
      "backfillGoogleReviewReminder",
      "all<{\n    id: number;\n    main_status: MainStatus;\n    sub_status: SubStatus;\n    created_at: string | null;\n  }>(\n    db,\n    \"select id, main_status, sub_status, created_at from job_cards\",\n  ).forEach",
      "all",
      "ensureLifecycleChecklist",
      "syncSubStatusFromChecklist"
    ],
    "sql": [
      "db.run(` create table if not exists checklist_cycles(id integer primary key, job_card_id integer not null, stage text not null, cycle_number integer not null, started_at text not null, completed_at text, unique(job_card_id, stage, cycle_number)); create table if not exists checklist_items(id integer primary key, checklist_cycle_id integer not null, job_card_id integer not null, stage text not null, cycle_number integer not null, item_key text not null, label text not null, sort_order integer not null, checked_by integer, checked_at text, started_at text, completed_at text, unique(checklist_cycle_id, item_key)); `)",
      "db.run( `update checklist_items set required=case when label in (${OPTIONAL_CHECKLIST_ITEMS.map((label) => `'${label}'`).join(\",\")}) then 0 else 1 end`, )",
      "all<{ id: number; main_status: MainStatus; sub_status: SubStatus; created_at: string \\| null; }>( db, \"select id, main_status, sub_status, created_at from job_cards\", )"
    ],
    "body": "export function migrateLifecycleStorage(db: Database) {\n  db.run(`\n    create table if not exists checklist_cycles(id integer primary key, job_card_id integer not null, stage text not null, cycle_number integer not null, started_at text not null, completed_at text, unique(job_card_id, stage, cycle_number));\n    create table if not exists checklist_items(id integer primary key, checklist_cycle_id integer not null, job_card_id integer not null, stage text not null, cycle_number integer not null, item_key text not null, label text not null, sort_order integer not null, checked_by integer, checked_at text, started_at text, completed_at text, unique(checklist_cycle_id, item_key));\n  `);\n  ensureColumn(db, \"checklist_items\", \"required\", \"integer not null default 1\");\n  ensureColumn(db, \"checklist_items\", \"na_at\", \"text\");\n  ensureColumn(db, \"checklist_items\", \"na_by\", \"integer\");\n  db.run(\n    `update checklist_items set required=case when label in (${OPTIONAL_CHECKLIST_ITEMS.map((label) => `'${label}'`).join(\",\")}) then 0 else 1 end`,\n  );\n  backfillGoogleReviewReminder(db);\n  all<{\n    id: number;\n    main_status: MainStatus;\n    sub_status: SubStatus;\n    created_at: string | null;\n  }>(\n    db,\n    \"select id, main_status, sub_status, created_at from job_cards\",\n  ).forEach((job) => {\n    ensureLifecycleChecklist(\n      db,\n      job.id,\n      job.main_status,\n      job.sub_status,\n      job.created_at ?? undefined,\n    );\n    syncSubStatusFromChecklist(db, job.id);\n  });\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "RETIRED/IMPORT-ONLY",
    "endpoint": "No browser endpoint; deployment/import service only",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-ensureLifecycleChecklist",
    "name": "ensureLifecycleChecklist",
    "file": "src/db.ts",
    "span": "src/db.ts:7571-7598",
    "calls": [
      "maybe",
      "checklistStageForSubStatus",
      "new Date().toISOString",
      "createLifecycleCycle"
    ],
    "sql": [
      "maybe<{ id: number }>( db, \"select id from checklist_cycles where job_card_id=? limit 1\", [jobId], )"
    ],
    "body": "export function ensureLifecycleChecklist(\n  db: Database,\n  jobId: number,\n  mainStatus: MainStatus,\n  currentSubStatus: SubStatus,\n  timestamp?: string,\n) {\n  const existing = maybe<{ id: number }>(\n    db,\n    \"select id from checklist_cycles where job_card_id=? limit 1\",\n    [jobId],\n  );\n  if (existing) return existing.id;\n  const stage = checklistStageForSubStatus(currentSubStatus);\n  const stamp = timestamp || new Date().toISOString();\n  const cycleComplete =\n    mainStatus === \"CLOSED\" &&\n    stage === \"CLOSED\" &&\n    currentSubStatus === \"Delivered\";\n  return createLifecycleCycle(\n    db,\n    jobId,\n    stage,\n    stamp,\n    currentSubStatus,\n    cycleComplete,\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "jobId",
        "type": "number",
        "optional": false
      },
      {
        "name": "mainStatus",
        "type": "MainStatus",
        "optional": false
      },
      {
        "name": "currentSubStatus",
        "type": "SubStatus",
        "optional": false
      },
      {
        "name": "timestamp",
        "type": "string",
        "optional": true
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "RETIRED/IMPORT-ONLY",
    "endpoint": "No browser endpoint; deployment/import service only",
    "service": "execution/checklists; TX-11",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-syncSubStatusFromChecklist",
    "name": "syncSubStatusFromChecklist",
    "file": "src/db.ts",
    "span": "src/db.ts:7648-7665",
    "calls": [
      "maybe",
      "all",
      "db.run",
      "deriveChecklistSubStatus"
    ],
    "sql": [
      "maybe<ChecklistCycle>( db, \"select * from checklist_cycles where job_card_id=? order by id desc limit 1\", [jobId], )",
      "all<ChecklistItem>( db, \"select * from checklist_items where checklist_cycle_id=? order by sort_order\", [cycle.id], )",
      "db.run(\"update job_cards set sub_status=? where id=?\", [ deriveChecklistSubStatus(items), jobId, ])"
    ],
    "body": "export function syncSubStatusFromChecklist(db: Database, jobId: number) {\n  const cycle = maybe<ChecklistCycle>(\n    db,\n    \"select * from checklist_cycles where job_card_id=? order by id desc limit 1\",\n    [jobId],\n  );\n  if (!cycle) return;\n  const items = all<ChecklistItem>(\n    db,\n    \"select * from checklist_items where checklist_cycle_id=? order by sort_order\",\n    [cycle.id],\n  );\n  if (items.length === 0) return;\n  db.run(\"update job_cards set sub_status=? where id=?\", [\n    deriveChecklistSubStatus(items),\n    jobId,\n  ]);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "jobId",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "RETIRED/IMPORT-ONLY",
    "endpoint": "No browser endpoint; deployment/import service only",
    "service": "execution/checklists; TX-11",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-setChecklistItemChecked",
    "name": "setChecklistItemChecked",
    "file": "src/db.ts",
    "span": "src/db.ts:7687-7720",
    "calls": [
      "new Date().toISOString",
      "one",
      "scalar",
      "writeChecklistItemState"
    ],
    "sql": [
      "one<ChecklistItem>( db, \"select * from checklist_items where id=?\", [itemId], )",
      "scalar<number>( db, \"select count(*) from checklist_items where checklist_cycle_id=? and sort_order<? and required=1 and checked_at is null\", [item.checklist_cycle_id, item.sort_order], )",
      "scalar<number>( db, \"select count(*) from checklist_items where checklist_cycle_id=? and sort_order>? and required=1 and checked_at is not null\", [item.checklist_cycle_id, item.sort_order], )"
    ],
    "body": "export function setChecklistItemChecked(\n  db: Database,\n  itemId: number,\n  actorId: number,\n  checked: boolean,\n  timestamp = new Date().toISOString(),\n) {\n  const item = one<ChecklistItem>(\n    db,\n    \"select * from checklist_items where id=?\",\n    [itemId],\n  );\n  if (\n    checked &&\n    scalar<number>(\n      db,\n      \"select count(*) from checklist_items where checklist_cycle_id=? and sort_order<? and required=1 and checked_at is null\",\n      [item.checklist_cycle_id, item.sort_order],\n    ) > 0\n  ) {\n    throw new Error(\"Checklist items must be completed in order.\");\n  }\n  if (\n    !checked &&\n    scalar<number>(\n      db,\n      \"select count(*) from checklist_items where checklist_cycle_id=? and sort_order>? and required=1 and checked_at is not null\",\n      [item.checklist_cycle_id, item.sort_order],\n    ) > 0\n  ) {\n    throw new Error(\"Later checklist items must be reopened first.\");\n  }\n  writeChecklistItemState(db, item, actorId, checked, false, timestamp);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "itemId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "checked",
        "type": "boolean",
        "optional": false
      },
      {
        "name": "timestamp",
        "type": "INFERRED",
        "optional": true,
        "default": "new Date().toISOString()"
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/setChecklistItemCheckedForActor",
    "service": "execution/checklists; TX-11",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-setChecklistItemNotApplicable",
    "name": "setChecklistItemNotApplicable",
    "file": "src/db.ts",
    "span": "src/db.ts:7723-7775",
    "calls": [
      "new Date().toISOString",
      "one",
      "(MATERIALS_CHECKLIST_LABELS as readonly string[]).includes",
      "scalar",
      "writeChecklistItemState"
    ],
    "sql": [
      "one<ChecklistItem>( db, \"select * from checklist_items where id=?\", [itemId], )",
      "scalar<number>( db, \"select count(*) from material_requests where job_card_id=? and archived_at is null\", [item.job_card_id], )",
      "scalar<number>( db, \"select count(*) from checklist_items where checklist_cycle_id=? and sort_order>? and required=1 and checked_at is not null\", [item.checklist_cycle_id, item.sort_order], )"
    ],
    "body": "export function setChecklistItemNotApplicable(\n  db: Database,\n  itemId: number,\n  actorId: number,\n  notApplicable: boolean,\n  timestamp = new Date().toISOString(),\n) {\n  const item = one<ChecklistItem>(\n    db,\n    \"select * from checklist_items where id=?\",\n    [itemId],\n  );\n  if (item.label === \"Remind Customer for Sharing Google Review/Feedback\")\n    throw new Error(\n      \"The Google review/feedback reminder is required and cannot be marked N/A.\",\n    );\n  if (notApplicable) {\n    if (\n      (MATERIALS_CHECKLIST_LABELS as readonly string[]).includes(item.label) &&\n      scalar<number>(\n        db,\n        \"select count(*) from material_requests where job_card_id=? and archived_at is null\",\n        [item.job_card_id],\n      ) > 0\n    ) {\n      throw new Error(\n        \"N/A is only available while the job card has no material rows.\",\n      );\n    }\n    if (item.checked_at && !item.na_at)\n      throw new Error(\"Untick the item before marking it N/A.\");\n  } else if (!item.na_at) {\n    throw new Error(\"This item is not marked N/A.\");\n  }\n  if (\n    !notApplicable &&\n    scalar<number>(\n      db,\n      \"select count(*) from checklist_items where checklist_cycle_id=? and sort_order>? and required=1 and checked_at is not null\",\n      [item.checklist_cycle_id, item.sort_order],\n    ) > 0\n  ) {\n    throw new Error(\"Later checklist items must be reopened first.\");\n  }\n  writeChecklistItemState(\n    db,\n    item,\n    actorId,\n    notApplicable,\n    notApplicable,\n    timestamp,\n  );\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "itemId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "notApplicable",
        "type": "boolean",
        "optional": false
      },
      {
        "name": "timestamp",
        "type": "INFERRED",
        "optional": true,
        "default": "new Date().toISOString()"
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/setChecklistItemNotApplicableForActor",
    "service": "execution/checklists; TX-11",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-setChecklistItemCheckedForActor",
    "name": "setChecklistItemCheckedForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:7903-7928",
    "calls": [
      "new Date().toISOString",
      "one",
      "setPaymentReceivedForActor",
      "assertJobLifecycleMutationAccess",
      "assertChecklistItemEditable",
      "setChecklistItemChecked"
    ],
    "sql": [
      "one<ChecklistItem>( db, \"select * from checklist_items where id=?\", [itemId], )"
    ],
    "body": "export function setChecklistItemCheckedForActor(\n  db: Database,\n  itemId: number,\n  actorId: number,\n  checked: boolean,\n  timestamp = new Date().toISOString(),\n  payment?: PaymentInput,\n) {\n  const item = one<ChecklistItem>(\n    db,\n    \"select * from checklist_items where id=?\",\n    [itemId],\n  );\n  if (item.label === \"Payment Received\")\n    return setPaymentReceivedForActor(\n      db,\n      item,\n      actorId,\n      checked,\n      timestamp,\n      payment,\n    );\n  assertJobLifecycleMutationAccess(db, item.job_card_id, actorId);\n  assertChecklistItemEditable(db, item, checked);\n  setChecklistItemChecked(db, itemId, actorId, checked, timestamp);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "itemId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "checked",
        "type": "boolean",
        "optional": false
      },
      {
        "name": "timestamp",
        "type": "INFERRED",
        "optional": true,
        "default": "new Date().toISOString()"
      },
      {
        "name": "payment",
        "type": "PaymentInput",
        "optional": true
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/setChecklistItemCheckedForActor",
    "service": "execution/checklists; TX-11",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-setChecklistItemNotApplicableForActor",
    "name": "setChecklistItemNotApplicableForActor",
    "file": "src/db.ts",
    "span": "src/db.ts:7930-7949",
    "calls": [
      "new Date().toISOString",
      "one",
      "assertJobLifecycleMutationAccess",
      "assertChecklistItemEditable",
      "setChecklistItemNotApplicable"
    ],
    "sql": [
      "one<ChecklistItem>( db, \"select * from checklist_items where id=?\", [itemId], )"
    ],
    "body": "export function setChecklistItemNotApplicableForActor(\n  db: Database,\n  itemId: number,\n  actorId: number,\n  notApplicable: boolean,\n  timestamp = new Date().toISOString(),\n) {\n  const item = one<ChecklistItem>(\n    db,\n    \"select * from checklist_items where id=?\",\n    [itemId],\n  );\n  if (item.label === \"Remind Customer for Sharing Google Review/Feedback\")\n    throw new Error(\n      \"The Google review/feedback reminder is required and cannot be marked N/A.\",\n    );\n  assertJobLifecycleMutationAccess(db, item.job_card_id, actorId);\n  assertChecklistItemEditable(db, item, notApplicable);\n  setChecklistItemNotApplicable(db, itemId, actorId, notApplicable, timestamp);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "itemId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "number",
        "optional": false
      },
      {
        "name": "notApplicable",
        "type": "boolean",
        "optional": false
      },
      {
        "name": "timestamp",
        "type": "INFERRED",
        "optional": true,
        "default": "new Date().toISOString()"
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/setChecklistItemNotApplicableForActor",
    "service": "execution/checklists; TX-11",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-transitionJobStatus",
    "name": "transitionJobStatus",
    "file": "src/db.ts",
    "span": "src/db.ts:8201-8209",
    "calls": [
      "new Date().toISOString",
      "transitionJobStatusInternal"
    ],
    "sql": [],
    "body": "export function transitionJobStatus(\n  db: Database,\n  jobId: number,\n  to: MainStatus,\n  note: string,\n  timestamp = new Date().toISOString(),\n) {\n  return transitionJobStatusInternal(db, jobId, to, note, timestamp);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "jobId",
        "type": "number",
        "optional": false
      },
      {
        "name": "to",
        "type": "MainStatus",
        "optional": false
      },
      {
        "name": "note",
        "type": "string",
        "optional": false
      },
      {
        "name": "timestamp",
        "type": "INFERRED",
        "optional": true,
        "default": "new Date().toISOString()"
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/transitionJobStatusForActor",
    "service": "jobs/estimates; TX-02/11/12",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-reconcileArtifactChecklist",
    "name": "reconcileArtifactChecklist",
    "file": "src/db.ts",
    "span": "src/db.ts:8280-8305",
    "calls": [
      "new Date().toISOString",
      "maybe",
      "all",
      "artifactExistsForChecklistItem",
      "setChecklistItemChecked"
    ],
    "sql": [
      "maybe<ChecklistCycle>( db, \"select * from checklist_cycles where job_card_id=? order by id desc limit 1\", [jobId], )",
      "all<ChecklistItem>( db, \"select * from checklist_items where checklist_cycle_id=? order by sort_order\", [cycle.id], )"
    ],
    "body": "export function reconcileArtifactChecklist(\n  db: Database,\n  jobId: number,\n  actorId = 0,\n  timestamp = new Date().toISOString(),\n) {\n  const cycle = maybe<ChecklistCycle>(\n    db,\n    \"select * from checklist_cycles where job_card_id=? order by id desc limit 1\",\n    [jobId],\n  );\n  if (!cycle) return;\n  const items = all<ChecklistItem>(\n    db,\n    \"select * from checklist_items where checklist_cycle_id=? order by sort_order\",\n    [cycle.id],\n  );\n  for (const item of items) {\n    if (item.checked_at) continue;\n    if (!artifactExistsForChecklistItem(db, jobId, item.label)) {\n      if (item.required === 0) continue;\n      break;\n    }\n    setChecklistItemChecked(db, item.id, actorId, true, timestamp);\n  }\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "jobId",
        "type": "number",
        "optional": false
      },
      {
        "name": "actorId",
        "type": "INFERRED",
        "optional": true,
        "default": "0"
      },
      {
        "name": "timestamp",
        "type": "INFERRED",
        "optional": true,
        "default": "new Date().toISOString()"
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "RETIRED/IMPORT-ONLY",
    "endpoint": "No browser endpoint; deployment/import service only",
    "service": "execution/checklists; TX-11",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-createSalesLead",
    "name": "createSalesLead",
    "file": "src/db.ts",
    "span": "src/db.ts:8560-8565",
    "calls": [
      "input.display_name.trim",
      "input.phone.trim",
      "insert",
      "input.company?.trim",
      "input.email?.trim",
      "input.address?.trim",
      "input.service_interest?.trim",
      "input.notes?.trim"
    ],
    "sql": [
      "insert(db, \"insert into sales_leads(display_name,phone,company,company_not_entered,email,email_not_entered,address,service_interest,notes,stage,temperature,follow_up_due,site_visit_completed,site_visit_date,created_at,updated_at) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now'),datetime('now'))\", [name, phone, input.company?.trim() ?? \"\", input.company_not_entered ?? 0, input.email?.trim() ?? \"\", input.email_not_entered ?? 0, input.address?.trim() ?? \"\", input.service_interest?.trim() ?? \"\", input.notes?.trim() ?? \"\", input.stage ?? \"NEW\", input.temperature ?? \"WARM\", input.follow_up_due ?? null, input.site_visit_completed ?? 0, input.site_visit_date ?? null])"
    ],
    "body": "export function createSalesLead(db: Database, input: LocalLeadInput) {\n  const name = input.display_name.trim();\n  const phone = input.phone.trim();\n  if (!name || !phone) throw new Error(\"Lead name and phone are required.\");\n  return insert(db, \"insert into sales_leads(display_name,phone,company,company_not_entered,email,email_not_entered,address,service_interest,notes,stage,temperature,follow_up_due,site_visit_completed,site_visit_date,created_at,updated_at) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now'),datetime('now'))\", [name, phone, input.company?.trim() ?? \"\", input.company_not_entered ?? 0, input.email?.trim() ?? \"\", input.email_not_entered ?? 0, input.address?.trim() ?? \"\", input.service_interest?.trim() ?? \"\", input.notes?.trim() ?? \"\", input.stage ?? \"NEW\", input.temperature ?? \"WARM\", input.follow_up_due ?? null, input.site_visit_completed ?? 0, input.site_visit_date ?? null]);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "input",
        "type": "LocalLeadInput",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/createSalesLead",
    "service": "sales_crm; quotation/lead aggregate",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-updateSalesLead",
    "name": "updateSalesLead",
    "file": "src/db.ts",
    "span": "src/db.ts:8567-8572",
    "calls": [
      "input.display_name.trim",
      "input.phone.trim",
      "db.run",
      "input.company?.trim",
      "input.email?.trim",
      "input.address?.trim",
      "input.service_interest?.trim",
      "input.notes?.trim"
    ],
    "sql": [
      "db.run(\"update sales_leads set display_name=?,phone=?,company=?,company_not_entered=?,email=?,email_not_entered=?,address=?,service_interest=?,notes=?,stage=?,temperature=?,follow_up_due=?,site_visit_completed=?,site_visit_date=?,updated_at=datetime('now') where id=?\", [name, phone, input.company?.trim() ?? \"\", input.company_not_entered ?? 0, input.email?.trim() ?? \"\", input.email_not_entered ?? 0, input.address?.trim() ?? \"\", input.service_interest?.trim() ?? \"\", input.notes?.trim() ?? \"\", input.stage ?? \"NEW\", input.temperature ?? \"WARM\", input.follow_up_due ?? null, input.site_visit_completed ?? 0, input.site_visit_date ?? null, leadId])"
    ],
    "body": "export function updateSalesLead(db: Database, leadId: number, input: LocalLeadInput) {\n  const name = input.display_name.trim();\n  const phone = input.phone.trim();\n  if (!name || !phone) throw new Error(\"Lead name and phone are required.\");\n  db.run(\"update sales_leads set display_name=?,phone=?,company=?,company_not_entered=?,email=?,email_not_entered=?,address=?,service_interest=?,notes=?,stage=?,temperature=?,follow_up_due=?,site_visit_completed=?,site_visit_date=?,updated_at=datetime('now') where id=?\", [name, phone, input.company?.trim() ?? \"\", input.company_not_entered ?? 0, input.email?.trim() ?? \"\", input.email_not_entered ?? 0, input.address?.trim() ?? \"\", input.service_interest?.trim() ?? \"\", input.notes?.trim() ?? \"\", input.stage ?? \"NEW\", input.temperature ?? \"WARM\", input.follow_up_due ?? null, input.site_visit_completed ?? 0, input.site_visit_date ?? null, leadId]);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "leadId",
        "type": "number",
        "optional": false
      },
      {
        "name": "input",
        "type": "LocalLeadInput",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/updateSalesLead",
    "service": "sales_crm; quotation/lead aggregate",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-createSalesQuotation",
    "name": "createSalesQuotation",
    "file": "src/db.ts",
    "span": "src/db.ts:8574-8590",
    "calls": [
      "maybe",
      "input.lines.map",
      "Number",
      "lines.some",
      "line.description.trim",
      "lines.reduce",
      "Math.max",
      "String((scalar<number>(db, \"select coalesce(max(id),0)+1 from sales_quotations\") ?? 1)).padStart",
      "String",
      "scalar",
      "insert",
      "input.customer_notes?.trim",
      "lines.forEach",
      "db.run"
    ],
    "sql": [
      "maybe<SalesLead>(db, \"select * from sales_leads where id=?\", [input.lead_id])",
      "scalar<number>(db, \"select coalesce(max(id),0)+1 from sales_quotations\")",
      "insert(db, \"insert into sales_quotations(lead_id,quotation_no,status,valid_until,customer_notes,discount,subtotal,gst_amount,total,template_id,template_html,created_at,updated_at) values(?,?, 'DRAFT',?,?,?,?,?,?,?,?,datetime('now'),datetime('now'))\", [input.lead_id, quotation_no, input.valid_until ?? null, input.customer_notes?.trim() ?? \"\", discount, subtotal, gst_amount, taxable + gst_amount, input.template_id, input.template_html])",
      "insert(db, \"insert into sales_quotation_lines(quotation_id,line_no,kind,description,quantity,rate,gst_rate) values(?,?,?,?,?,?,?)\", [quotationId, index + 1, line.kind \\|\\| \"Service\", line.description.trim(), line.quantity, line.rate, line.gst_rate])",
      "db.run(\"update sales_leads set stage='QUOTATION_SENT', updated_at=datetime('now') where id=?\", [input.lead_id])"
    ],
    "body": "export function createSalesQuotation(db: Database, input: LocalQuotationInput) {\n  const lead = maybe<SalesLead>(db, \"select * from sales_leads where id=?\", [input.lead_id]);\n  if (!lead) throw new Error(\"Select an existing lead.\");\n  if (!input.template_id || !input.template_html) throw new Error(\"Select a quotation template.\");\n  if (!input.lines.length) throw new Error(\"Add at least one quotation line.\");\n  const lines = input.lines.map((line) => ({ ...line, quantity: Number(line.quantity), rate: Number(line.rate), gst_rate: Number(line.gst_rate) }));\n  if (lines.some((line) => !line.description.trim() || line.quantity <= 0 || line.rate < 0 || line.gst_rate < 0 || line.gst_rate > 100)) throw new Error(\"Quotation lines need a description, positive quantity, and valid rates.\");\n  const subtotal = lines.reduce((sum, line) => sum + line.quantity * line.rate, 0);\n  const discount = Math.max(0, Number(input.discount) || 0);\n  const taxable = Math.max(0, subtotal - discount);\n  const gst_amount = lines.reduce((sum, line) => sum + (line.quantity * line.rate * line.gst_rate) / 100, 0);\n  const quotation_no = `QT-${String((scalar<number>(db, \"select coalesce(max(id),0)+1 from sales_quotations\") ?? 1)).padStart(6, \"0\")}`;\n  const quotationId = insert(db, \"insert into sales_quotations(lead_id,quotation_no,status,valid_until,customer_notes,discount,subtotal,gst_amount,total,template_id,template_html,created_at,updated_at) values(?,?, 'DRAFT',?,?,?,?,?,?,?,?,datetime('now'),datetime('now'))\", [input.lead_id, quotation_no, input.valid_until ?? null, input.customer_notes?.trim() ?? \"\", discount, subtotal, gst_amount, taxable + gst_amount, input.template_id, input.template_html]);\n  lines.forEach((line, index) => insert(db, \"insert into sales_quotation_lines(quotation_id,line_no,kind,description,quantity,rate,gst_rate) values(?,?,?,?,?,?,?)\", [quotationId, index + 1, line.kind || \"Service\", line.description.trim(), line.quantity, line.rate, line.gst_rate]));\n  db.run(\"update sales_leads set stage='QUOTATION_SENT', updated_at=datetime('now') where id=?\", [input.lead_id]);\n  return quotationId;\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "input",
        "type": "LocalQuotationInput",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/createSalesQuotation",
    "service": "sales_crm; quotation/lead aggregate",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-updateSalesQuotation",
    "name": "updateSalesQuotation",
    "file": "src/db.ts",
    "span": "src/db.ts:8593-8610",
    "calls": [
      "one",
      "maybe",
      "input.lines.map",
      "Number",
      "lines.some",
      "line.description.trim",
      "lines.reduce",
      "Math.max",
      "db.run",
      "input.customer_notes?.trim",
      "lines.forEach",
      "insert"
    ],
    "sql": [
      "one<SalesQuotation>(db, \"select * from sales_quotations where id=?\", [quotationId])",
      "maybe<SalesLead>(db, \"select * from sales_leads where id=?\", [input.lead_id])",
      "db.run(\"update sales_quotations set lead_id=?,valid_until=?,customer_notes=?,discount=?,subtotal=?,gst_amount=?,total=?,template_id=?,template_html=?,updated_at=datetime('now') where id=?\", [input.lead_id, input.valid_until ?? null, input.customer_notes?.trim() ?? \"\", discount, subtotal, gst_amount, taxable + gst_amount, input.template_id, input.template_html, quotationId])",
      "db.run(\"delete from sales_quotation_lines where quotation_id=?\", [quotationId])",
      "insert(db, \"insert into sales_quotation_lines(quotation_id,line_no,kind,description,quantity,rate,gst_rate) values(?,?,?,?,?,?,?)\", [quotationId, index + 1, line.kind \\|\\| \"Service\", line.description.trim(), line.quantity, line.rate, line.gst_rate])",
      "db.run(\"update sales_leads set stage='QUOTATION_SENT', updated_at=datetime('now') where id=?\", [input.lead_id])"
    ],
    "body": "export function updateSalesQuotation(db: Database, quotationId: number, input: LocalQuotationInput) {\n  const quotation = one<SalesQuotation>(db, \"select * from sales_quotations where id=?\", [quotationId]);\n  if (quotation.status !== \"DRAFT\") throw new Error(\"Only draft quotations can be edited.\");\n  const lead = maybe<SalesLead>(db, \"select * from sales_leads where id=?\", [input.lead_id]);\n  if (!lead) throw new Error(\"Select an existing lead.\");\n  if (!input.template_id || !input.template_html) throw new Error(\"Select a quotation template.\");\n  if (!input.lines.length) throw new Error(\"Add at least one quotation line.\");\n  const lines = input.lines.map((line) => ({ ...line, quantity: Number(line.quantity), rate: Number(line.rate), gst_rate: Number(line.gst_rate) }));\n  if (lines.some((line) => !line.description.trim() || line.quantity <= 0 || line.rate < 0 || line.gst_rate < 0 || line.gst_rate > 100)) throw new Error(\"Quotation lines need a description, positive quantity, and valid rates.\");\n  const subtotal = lines.reduce((sum, line) => sum + line.quantity * line.rate, 0);\n  const discount = Math.max(0, Number(input.discount) || 0);\n  const taxable = Math.max(0, subtotal - discount);\n  const gst_amount = lines.reduce((sum, line) => sum + Math.max(0, line.quantity * line.rate - (subtotal ? discount * (line.quantity * line.rate / subtotal) : 0)) * line.gst_rate / 100, 0);\n  db.run(\"update sales_quotations set lead_id=?,valid_until=?,customer_notes=?,discount=?,subtotal=?,gst_amount=?,total=?,template_id=?,template_html=?,updated_at=datetime('now') where id=?\", [input.lead_id, input.valid_until ?? null, input.customer_notes?.trim() ?? \"\", discount, subtotal, gst_amount, taxable + gst_amount, input.template_id, input.template_html, quotationId]);\n  db.run(\"delete from sales_quotation_lines where quotation_id=?\", [quotationId]);\n  lines.forEach((line, index) => insert(db, \"insert into sales_quotation_lines(quotation_id,line_no,kind,description,quantity,rate,gst_rate) values(?,?,?,?,?,?,?)\", [quotationId, index + 1, line.kind || \"Service\", line.description.trim(), line.quantity, line.rate, line.gst_rate]));\n  db.run(\"update sales_leads set stage='QUOTATION_SENT', updated_at=datetime('now') where id=?\", [input.lead_id]);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "quotationId",
        "type": "number",
        "optional": false
      },
      {
        "name": "input",
        "type": "LocalQuotationInput",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/updateSalesQuotation",
    "service": "sales_crm; quotation/lead aggregate",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-setSalesQuotationStatus",
    "name": "setSalesQuotationStatus",
    "file": "src/db.ts",
    "span": "src/db.ts:8612-8618",
    "calls": [
      "one",
      "[\"ACCEPTED\", \"REJECTED\", \"EXPIRED\"].includes",
      "db.run"
    ],
    "sql": [
      "one<SalesQuotation>(db, \"select * from sales_quotations where id=?\", [quotationId])",
      "db.run(\"update sales_quotations set status=?, updated_at=datetime('now') where id=?\", [status, quotationId])",
      "db.run(\"update sales_leads set stage='WON',updated_at=datetime('now') where id=?\", [quotation.lead_id])",
      "db.run(\"update sales_leads set stage='LOST',updated_at=datetime('now') where id=?\", [quotation.lead_id])"
    ],
    "body": "export function setSalesQuotationStatus(db: Database, quotationId: number, status: QuotationStatus) {\n  const quotation = one<SalesQuotation>(db, \"select * from sales_quotations where id=?\", [quotationId]);\n  if ([\"ACCEPTED\", \"REJECTED\", \"EXPIRED\"].includes(quotation.status)) throw new Error(\"Terminal quotations cannot be changed.\");\n  db.run(\"update sales_quotations set status=?, updated_at=datetime('now') where id=?\", [status, quotationId]);\n  if (status === \"ACCEPTED\") db.run(\"update sales_leads set stage='WON',updated_at=datetime('now') where id=?\", [quotation.lead_id]);\n  if (status === \"REJECTED\") db.run(\"update sales_leads set stage='LOST',updated_at=datetime('now') where id=?\", [quotation.lead_id]);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "quotationId",
        "type": "number",
        "optional": false
      },
      {
        "name": "status",
        "type": "QuotationStatus",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/setSalesQuotationStatus",
    "service": "sales_crm; quotation/lead aggregate",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-createServiceDepartment",
    "name": "createServiceDepartment",
    "file": "src/db.ts",
    "span": "src/db.ts:8620-8625",
    "calls": [
      "name.trim",
      "scalar",
      "insert"
    ],
    "sql": [
      "scalar<number>(db, \"select count(*) from service_departments where lower(name)=lower(?)\", [cleaned])",
      "insert(db, \"insert into service_departments(name,status,created_at,updated_at) values(?,'ACTIVE',datetime('now'),datetime('now'))\", [cleaned])"
    ],
    "body": "export function createServiceDepartment(db: Database, name: string) {\n  const cleaned = name.trim();\n  if (!cleaned) throw new Error(\"Department name is required.\");\n  if (scalar<number>(db, \"select count(*) from service_departments where lower(name)=lower(?)\", [cleaned])) throw new Error(\"A department with this name already exists.\");\n  return insert(db, \"insert into service_departments(name,status,created_at,updated_at) values(?,'ACTIVE',datetime('now'),datetime('now'))\", [cleaned]);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "name",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/createServiceDepartment",
    "service": "tenant_admin/service_catalog; TX-14",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-updateServiceDepartment",
    "name": "updateServiceDepartment",
    "file": "src/db.ts",
    "span": "src/db.ts:8627-8631",
    "calls": [
      "name.trim",
      "db.run"
    ],
    "sql": [
      "db.run(\"update service_departments set name=?, status=?, updated_at=datetime('now') where id=?\", [cleaned, status, departmentId])"
    ],
    "body": "export function updateServiceDepartment(db: Database, departmentId: number, name: string, status: \"ACTIVE\" | \"ARCHIVED\") {\n  const cleaned = name.trim();\n  if (!cleaned) throw new Error(\"Department name is required.\");\n  db.run(\"update service_departments set name=?, status=?, updated_at=datetime('now') where id=?\", [cleaned, status, departmentId]);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "departmentId",
        "type": "number",
        "optional": false
      },
      {
        "name": "name",
        "type": "string",
        "optional": false
      },
      {
        "name": "status",
        "type": "\"ACTIVE\" | \"ARCHIVED\"",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/updateServiceDepartment",
    "service": "tenant_admin/service_catalog; TX-14",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-createServiceCatalogMaster",
    "name": "createServiceCatalogMaster",
    "file": "src/db.ts",
    "span": "src/db.ts:8633-8639",
    "calls": [
      "name.trim",
      "scalar",
      "label.toLowerCase",
      "insert"
    ],
    "sql": [
      "scalar<number>(db, `select count(*) from ${table} where lower(name)=lower(?)`, [cleaned])",
      "insert(db, `insert into ${table}(name,status,created_at,updated_at) values(?,'ACTIVE',datetime('now'),datetime('now'))`, [cleaned])"
    ],
    "body": "export function createServiceCatalogMaster(db: Database, table: \"service_brands\" | \"car_segments\", name: string) {\n  const cleaned = name.trim();\n  const label = table === \"service_brands\" ? \"Brand name\" : \"Car segment\";\n  if (!cleaned) throw new Error(`${label} is required.`);\n  if (scalar<number>(db, `select count(*) from ${table} where lower(name)=lower(?)`, [cleaned])) throw new Error(`A ${label.toLowerCase()} with this name already exists.`);\n  return insert(db, `insert into ${table}(name,status,created_at,updated_at) values(?,'ACTIVE',datetime('now'),datetime('now'))`, [cleaned]);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "table",
        "type": "\"service_brands\" | \"car_segments\"",
        "optional": false
      },
      {
        "name": "name",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/createServiceCatalogMaster",
    "service": "tenant_admin/service_catalog; TX-14",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-db-updateServiceCatalogMaster",
    "name": "updateServiceCatalogMaster",
    "file": "src/db.ts",
    "span": "src/db.ts:8641-8647",
    "calls": [
      "name.trim",
      "scalar",
      "label.toLowerCase",
      "db.run"
    ],
    "sql": [
      "scalar<number>(db, `select count(*) from ${table} where lower(name)=lower(?) and id<>?`, [cleaned, id])",
      "db.run(`update ${table} set name=?,status=?,updated_at=datetime('now') where id=?`, [cleaned, status, id])"
    ],
    "body": "export function updateServiceCatalogMaster(db: Database, table: \"service_brands\" | \"car_segments\", id: number, name: string, status: \"ACTIVE\" | \"ARCHIVED\") {\n  const cleaned = name.trim();\n  const label = table === \"service_brands\" ? \"Brand name\" : \"Car segment\";\n  if (!cleaned) throw new Error(`${label} is required.`);\n  if (scalar<number>(db, `select count(*) from ${table} where lower(name)=lower(?) and id<>?`, [cleaned, id])) throw new Error(`A ${label.toLowerCase()} with this name already exists.`);\n  db.run(`update ${table} set name=?,status=?,updated_at=datetime('now') where id=?`, [cleaned, status, id]);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "table",
        "type": "\"service_brands\" | \"car_segments\"",
        "optional": false
      },
      {
        "name": "id",
        "type": "number",
        "optional": false
      },
      {
        "name": "name",
        "type": "string",
        "optional": false
      },
      {
        "name": "status",
        "type": "\"ACTIVE\" | \"ARCHIVED\"",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/updateServiceCatalogMaster",
    "service": "tenant_admin/service_catalog; TX-14",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-appointServiceDepartmentManager",
    "name": "appointServiceDepartmentManager",
    "file": "src/db.ts",
    "span": "src/db.ts:8649-8655",
    "calls": [
      "one",
      "db.run"
    ],
    "sql": [
      "one<User>(db, \"select * from users where id=? and archived_at is null\", [managerId])",
      "one<{ status: string }>(db, \"select status from service_departments where id=?\", [departmentId])",
      "db.run(\"insert or ignore into service_department_managers(department_id,manager_id) values(?,?)\", [departmentId, managerId])"
    ],
    "body": "export function appointServiceDepartmentManager(db: Database, departmentId: number, managerId: number) {\n  const manager = one<User>(db, \"select * from users where id=? and archived_at is null\", [managerId]);\n  if (manager.role !== \"service_manager\") throw new Error(\"Managers must have the Service Department Manager role.\");\n  const department = one<{ status: string }>(db, \"select status from service_departments where id=?\", [departmentId]);\n  if (department.status !== \"ACTIVE\") throw new Error(\"Archived departments cannot receive managers.\");\n  db.run(\"insert or ignore into service_department_managers(department_id,manager_id) values(?,?)\", [departmentId, managerId]);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "departmentId",
        "type": "number",
        "optional": false
      },
      {
        "name": "managerId",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/appointServiceDepartmentManager",
    "service": "tenant_admin/service_catalog; TX-14",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-removeServiceDepartmentManager",
    "name": "removeServiceDepartmentManager",
    "file": "src/db.ts",
    "span": "src/db.ts:8657-8660",
    "calls": [
      "db.run"
    ],
    "sql": [
      "db.run(\"delete from service_advisor_teams where department_id=? and manager_id=?\", [departmentId, managerId])",
      "db.run(\"delete from service_department_managers where department_id=? and manager_id=?\", [departmentId, managerId])"
    ],
    "body": "export function removeServiceDepartmentManager(db: Database, departmentId: number, managerId: number) {\n  db.run(\"delete from service_advisor_teams where department_id=? and manager_id=?\", [departmentId, managerId]);\n  db.run(\"delete from service_department_managers where department_id=? and manager_id=?\", [departmentId, managerId]);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "departmentId",
        "type": "number",
        "optional": false
      },
      {
        "name": "managerId",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/removeServiceDepartmentManager",
    "service": "tenant_admin/service_catalog; TX-14",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-assignServiceAdvisorTeam",
    "name": "assignServiceAdvisorTeam",
    "file": "src/db.ts",
    "span": "src/db.ts:8662-8667",
    "calls": [
      "one",
      "scalar",
      "db.run"
    ],
    "sql": [
      "one<User>(db, \"select * from users where id=? and archived_at is null\", [advisorId])",
      "scalar<number>(db, \"select count(*) from service_department_managers where department_id=? and manager_id=?\", [departmentId, managerId])",
      "db.run(\"insert into service_advisor_teams(department_id,manager_id,advisor_id) values(?,?,?) on conflict(advisor_id) do update set department_id=excluded.department_id, manager_id=excluded.manager_id\", [departmentId, managerId, advisorId])"
    ],
    "body": "export function assignServiceAdvisorTeam(db: Database, departmentId: number, managerId: number, advisorId: number) {\n  const advisor = one<User>(db, \"select * from users where id=? and archived_at is null\", [advisorId]);\n  if (advisor.role !== \"service\") throw new Error(\"Advisors must have the Service Advisor role.\");\n  if (!scalar<number>(db, \"select count(*) from service_department_managers where department_id=? and manager_id=?\", [departmentId, managerId])) throw new Error(\"Appoint the department manager before assigning advisors.\");\n  db.run(\"insert into service_advisor_teams(department_id,manager_id,advisor_id) values(?,?,?) on conflict(advisor_id) do update set department_id=excluded.department_id, manager_id=excluded.manager_id\", [departmentId, managerId, advisorId]);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "departmentId",
        "type": "number",
        "optional": false
      },
      {
        "name": "managerId",
        "type": "number",
        "optional": false
      },
      {
        "name": "advisorId",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/assignServiceAdvisorTeam",
    "service": "tenant_admin/service_catalog; TX-14",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-db-removeServiceAdvisorTeam",
    "name": "removeServiceAdvisorTeam",
    "file": "src/db.ts",
    "span": "src/db.ts:8669-8672",
    "calls": [
      "db.run"
    ],
    "sql": [
      "db.run(\"delete from service_advisor_teams where department_id=? and advisor_id=?\", [departmentId, advisorId])"
    ],
    "body": "export function removeServiceAdvisorTeam(db: Database, departmentId: number, managerId: number, advisorId: number) {\n  void managerId;\n  db.run(\"delete from service_advisor_teams where department_id=? and advisor_id=?\", [departmentId, advisorId]);\n}",
    "parameters": [
      {
        "name": "db",
        "type": "Database",
        "optional": false
      },
      {
        "name": "departmentId",
        "type": "number",
        "optional": false
      },
      {
        "name": "managerId",
        "type": "number",
        "optional": false
      },
      {
        "name": "advisorId",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "COMMAND",
    "endpoint": "POST /api/v1/ui/commands/removeServiceAdvisorTeam",
    "service": "tenant_admin/service_catalog; TX-14",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-developer-control-plane-createDefaultDeveloperControlPlane",
    "name": "createDefaultDeveloperControlPlane",
    "file": "src/developer-control-plane.ts",
    "span": "src/developer-control-plane.ts:73-80",
    "calls": [
      "iso"
    ],
    "sql": [],
    "body": "export function createDefaultDeveloperControlPlane(now: Date | string = new Date()): DeveloperControlPlaneState {\n  const createdAt = iso(now);\n  const tenant: DemoTenant = {\n    id: \"tenant-demo-1\", lifecycle: \"active\", createdAt,\n    profile: { name: \"Apex Auto Studio\", brandName: \"Apex\", address: \"14 Workshop Lane, Bengaluru\", contactName: \"Demo Owner\", email: \"owner@apex.demo\", phone: \"+91 90000 00000\", gstin: \"29ABCDE1234F1Z5\", timezone: \"Asia/Kolkata\", currency: \"INR\", invoicePrefix: \"APEX\" },\n  };\n  return { version: DEVELOPER_CONTROL_PLANE_VERSION, tenants: [tenant], selectedTenantId: tenant.id, communications: { email: { active: true, sender: \"WorkshopOS Demo <demo@workshopos.local>\" }, whatsapp: { active: true, sender: \"WorkshopOS Demo\" } }, communicationLogs: [], charges: [] };\n}",
    "parameters": [
      {
        "name": "now",
        "type": "Date | string",
        "optional": true,
        "default": "new Date()"
      }
    ],
    "returnType": "DeveloperControlPlaneState",
    "classification": "SIMULATION",
    "endpoint": "Existing isolated simulation; real platform adoption unapproved",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "DeveloperControlPlaneState"
  },
  {
    "id": "OP-developer-control-plane-loadDeveloperControlPlane",
    "name": "loadDeveloperControlPlane",
    "file": "src/developer-control-plane.ts",
    "span": "src/developer-control-plane.ts:85-87",
    "calls": [
      "browserStorage",
      "storage?.getItem",
      "JSON.parse",
      "valid",
      "createDefaultDeveloperControlPlane"
    ],
    "sql": [],
    "body": "export function loadDeveloperControlPlane(storage: SessionStorageLike | undefined = browserStorage(), now: Date | string = new Date()): DeveloperControlPlaneState {\n  try { const raw = storage?.getItem(DEVELOPER_CONTROL_PLANE_STORAGE_KEY); const parsed = raw ? JSON.parse(raw) : undefined; return valid(parsed) ? parsed : createDefaultDeveloperControlPlane(now); } catch { return createDefaultDeveloperControlPlane(now); }\n}",
    "parameters": [
      {
        "name": "storage",
        "type": "SessionStorageLike | undefined",
        "optional": true,
        "default": "browserStorage()"
      },
      {
        "name": "now",
        "type": "Date | string",
        "optional": true,
        "default": "new Date()"
      }
    ],
    "returnType": "DeveloperControlPlaneState",
    "classification": "SIMULATION",
    "endpoint": "Existing isolated simulation; real platform adoption unapproved",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "DeveloperControlPlaneState"
  },
  {
    "id": "OP-developer-control-plane-saveDeveloperControlPlane",
    "name": "saveDeveloperControlPlane",
    "file": "src/developer-control-plane.ts",
    "span": "src/developer-control-plane.ts:88-90",
    "calls": [
      "browserStorage",
      "storage?.setItem",
      "JSON.stringify"
    ],
    "sql": [],
    "body": "export function saveDeveloperControlPlane(state: DeveloperControlPlaneState, storage: SessionStorageLike | undefined = browserStorage()): DeveloperControlPlaneState {\n  storage?.setItem(DEVELOPER_CONTROL_PLANE_STORAGE_KEY, JSON.stringify(state)); return state;\n}",
    "parameters": [
      {
        "name": "state",
        "type": "DeveloperControlPlaneState",
        "optional": false
      },
      {
        "name": "storage",
        "type": "SessionStorageLike | undefined",
        "optional": true,
        "default": "browserStorage()"
      }
    ],
    "returnType": "DeveloperControlPlaneState",
    "classification": "SIMULATION",
    "endpoint": "Existing isolated simulation; real platform adoption unapproved",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "DeveloperControlPlaneState"
  },
  {
    "id": "OP-developer-control-plane-resetDeveloperControlPlane",
    "name": "resetDeveloperControlPlane",
    "file": "src/developer-control-plane.ts",
    "span": "src/developer-control-plane.ts:91-93",
    "calls": [
      "browserStorage",
      "createDefaultDeveloperControlPlane",
      "saveDeveloperControlPlane"
    ],
    "sql": [],
    "body": "export function resetDeveloperControlPlane(storage: SessionStorageLike | undefined = browserStorage(), now: Date | string = new Date()): DeveloperControlPlaneState {\n  const state = createDefaultDeveloperControlPlane(now); return saveDeveloperControlPlane(state, storage);\n}",
    "parameters": [
      {
        "name": "storage",
        "type": "SessionStorageLike | undefined",
        "optional": true,
        "default": "browserStorage()"
      },
      {
        "name": "now",
        "type": "Date | string",
        "optional": true,
        "default": "new Date()"
      }
    ],
    "returnType": "DeveloperControlPlaneState",
    "classification": "SIMULATION",
    "endpoint": "Existing isolated simulation; real platform adoption unapproved",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "DeveloperControlPlaneState"
  },
  {
    "id": "OP-developer-control-plane-selectedTenant",
    "name": "selectedTenant",
    "file": "src/developer-control-plane.ts",
    "span": "src/developer-control-plane.ts:94-96",
    "calls": [
      "state.tenants.find"
    ],
    "sql": [],
    "body": "export function selectedTenant(state: DeveloperControlPlaneState): DemoTenant {\n  return state.tenants.find((tenant) => tenant.id === state.selectedTenantId) ?? state.tenants[0];\n}",
    "parameters": [
      {
        "name": "state",
        "type": "DeveloperControlPlaneState",
        "optional": false
      }
    ],
    "returnType": "DemoTenant",
    "classification": "SIMULATION",
    "endpoint": "Existing isolated simulation; real platform adoption unapproved",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "DemoTenant"
  },
  {
    "id": "OP-developer-control-plane-createTenant",
    "name": "createTenant",
    "file": "src/developer-control-plane.ts",
    "span": "src/developer-control-plane.ts:97-101",
    "calls": [
      "profile.name.trim",
      "iso"
    ],
    "sql": [],
    "body": "export function createTenant(state: DeveloperControlPlaneState, profile: TenantProfile, now: Date | string = new Date()): DeveloperControlPlaneState {\n  if (!profile.name.trim()) throw new Error(\"Tenant name is required.\");\n  const tenant = { id: `tenant-${state.tenants.length + 1}`, lifecycle: \"active\" as const, profile: { ...profile, name: profile.name.trim() }, createdAt: iso(now) };\n  return { ...state, tenants: [...state.tenants, tenant], selectedTenantId: tenant.id };\n}",
    "parameters": [
      {
        "name": "state",
        "type": "DeveloperControlPlaneState",
        "optional": false
      },
      {
        "name": "profile",
        "type": "TenantProfile",
        "optional": false
      },
      {
        "name": "now",
        "type": "Date | string",
        "optional": true,
        "default": "new Date()"
      }
    ],
    "returnType": "DeveloperControlPlaneState",
    "classification": "SIMULATION",
    "endpoint": "Existing isolated simulation; real platform adoption unapproved",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "DeveloperControlPlaneState"
  },
  {
    "id": "OP-developer-control-plane-selectTenant",
    "name": "selectTenant",
    "file": "src/developer-control-plane.ts",
    "span": "src/developer-control-plane.ts:102-105",
    "calls": [
      "state.tenants.some"
    ],
    "sql": [],
    "body": "export function selectTenant(state: DeveloperControlPlaneState, tenantId: string): DeveloperControlPlaneState {\n  if (!state.tenants.some((tenant) => tenant.id === tenantId)) throw new Error(\"Tenant not found.\");\n  return { ...state, selectedTenantId: tenantId };\n}",
    "parameters": [
      {
        "name": "state",
        "type": "DeveloperControlPlaneState",
        "optional": false
      },
      {
        "name": "tenantId",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "DeveloperControlPlaneState",
    "classification": "SIMULATION",
    "endpoint": "Existing isolated simulation; real platform adoption unapproved",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "DeveloperControlPlaneState"
  },
  {
    "id": "OP-developer-control-plane-setTenantLifecycle",
    "name": "setTenantLifecycle",
    "file": "src/developer-control-plane.ts",
    "span": "src/developer-control-plane.ts:106-108",
    "calls": [
      "state.tenants.map"
    ],
    "sql": [],
    "body": "export function setTenantLifecycle(state: DeveloperControlPlaneState, tenantId: string, lifecycle: TenantLifecycle): DeveloperControlPlaneState {\n  return { ...state, tenants: state.tenants.map((tenant) => tenant.id === tenantId ? { ...tenant, lifecycle } : tenant) };\n}",
    "parameters": [
      {
        "name": "state",
        "type": "DeveloperControlPlaneState",
        "optional": false
      },
      {
        "name": "tenantId",
        "type": "string",
        "optional": false
      },
      {
        "name": "lifecycle",
        "type": "TenantLifecycle",
        "optional": false
      }
    ],
    "returnType": "DeveloperControlPlaneState",
    "classification": "SIMULATION",
    "endpoint": "Existing isolated simulation; real platform adoption unapproved",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "DeveloperControlPlaneState"
  },
  {
    "id": "OP-developer-control-plane-updateTenantProfile",
    "name": "updateTenantProfile",
    "file": "src/developer-control-plane.ts",
    "span": "src/developer-control-plane.ts:109-111",
    "calls": [
      "state.tenants.map"
    ],
    "sql": [],
    "body": "export function updateTenantProfile(state: DeveloperControlPlaneState, tenantId: string, profile: Partial<TenantProfile>): DeveloperControlPlaneState {\n  return { ...state, tenants: state.tenants.map((tenant) => tenant.id === tenantId ? { ...tenant, profile: { ...tenant.profile, ...profile } } : tenant) };\n}",
    "parameters": [
      {
        "name": "state",
        "type": "DeveloperControlPlaneState",
        "optional": false
      },
      {
        "name": "tenantId",
        "type": "string",
        "optional": false
      },
      {
        "name": "profile",
        "type": "Partial<TenantProfile>",
        "optional": false
      }
    ],
    "returnType": "DeveloperControlPlaneState",
    "classification": "SIMULATION",
    "endpoint": "Existing isolated simulation; real platform adoption unapproved",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "DeveloperControlPlaneState"
  },
  {
    "id": "OP-developer-control-plane-updateCommunication",
    "name": "updateCommunication",
    "file": "src/developer-control-plane.ts",
    "span": "src/developer-control-plane.ts:112-114",
    "calls": [],
    "sql": [],
    "body": "export function updateCommunication(state: DeveloperControlPlaneState, channel: \"email\" | \"whatsapp\", updates: Partial<CommunicationChannel>): DeveloperControlPlaneState {\n  return { ...state, communications: { ...state.communications, [channel]: { ...state.communications[channel], ...updates } } };\n}",
    "parameters": [
      {
        "name": "state",
        "type": "DeveloperControlPlaneState",
        "optional": false
      },
      {
        "name": "channel",
        "type": "\"email\" | \"whatsapp\"",
        "optional": false
      },
      {
        "name": "updates",
        "type": "Partial<CommunicationChannel>",
        "optional": false
      }
    ],
    "returnType": "DeveloperControlPlaneState",
    "classification": "SIMULATION",
    "endpoint": "Existing isolated simulation; real platform adoption unapproved",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "DeveloperControlPlaneState"
  },
  {
    "id": "OP-developer-control-plane-simulateCommunicationTest",
    "name": "simulateCommunicationTest",
    "file": "src/developer-control-plane.ts",
    "span": "src/developer-control-plane.ts:115-121",
    "calls": [
      "state.tenants.find",
      "recipient.trim",
      "iso"
    ],
    "sql": [],
    "body": "export function simulateCommunicationTest(state: DeveloperControlPlaneState, channel: \"email\" | \"whatsapp\", tenantId: string, recipient: string, now: Date | string = new Date()): DeveloperControlPlaneState {\n  const tenant = state.tenants.find((item) => item.id === tenantId);\n  if (!tenant) throw new Error(\"Tenant not found.\");\n  const result = state.communications[channel].active && tenant.lifecycle === \"active\" ? \"simulated\" : \"blocked\";\n  const entry: CommunicationLog = { id: `message-${state.communicationLogs.length + 1}`, channel, tenantId, recipient: recipient.trim() || tenant.profile.email, result, createdAt: iso(now) };\n  return { ...state, communicationLogs: [entry, ...state.communicationLogs] };\n}",
    "parameters": [
      {
        "name": "state",
        "type": "DeveloperControlPlaneState",
        "optional": false
      },
      {
        "name": "channel",
        "type": "\"email\" | \"whatsapp\"",
        "optional": false
      },
      {
        "name": "tenantId",
        "type": "string",
        "optional": false
      },
      {
        "name": "recipient",
        "type": "string",
        "optional": false
      },
      {
        "name": "now",
        "type": "Date | string",
        "optional": true,
        "default": "new Date()"
      }
    ],
    "returnType": "DeveloperControlPlaneState",
    "classification": "SIMULATION",
    "endpoint": "Existing isolated simulation; real platform adoption unapproved",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "DeveloperControlPlaneState"
  },
  {
    "id": "OP-developer-control-plane-createPlatformCharge",
    "name": "createPlatformCharge",
    "file": "src/developer-control-plane.ts",
    "span": "src/developer-control-plane.ts:122-126",
    "calls": [
      "input.description.trim",
      "iso"
    ],
    "sql": [],
    "body": "export function createPlatformCharge(state: DeveloperControlPlaneState, input: { tenantId: string; description: string; amount: number; dueDate: string }, now: Date | string = new Date()): DeveloperControlPlaneState {\n  if (!input.description.trim() || !(input.amount > 0) || !input.dueDate) throw new Error(\"Description, a positive amount, and due date are required.\");\n  const charge: PlatformCharge = { id: `charge-${state.charges.length + 1}`, tenantId: input.tenantId, description: input.description.trim(), amount: input.amount, dueDate: input.dueDate, payments: [], createdAt: iso(now) };\n  return { ...state, charges: [charge, ...state.charges] };\n}",
    "parameters": [
      {
        "name": "state",
        "type": "DeveloperControlPlaneState",
        "optional": false
      },
      {
        "name": "input",
        "type": "{ tenantId: string; description: string; amount: number; dueDate: string }",
        "optional": false
      },
      {
        "name": "now",
        "type": "Date | string",
        "optional": true,
        "default": "new Date()"
      }
    ],
    "returnType": "DeveloperControlPlaneState",
    "classification": "SIMULATION",
    "endpoint": "Existing isolated simulation; real platform adoption unapproved",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "DeveloperControlPlaneState"
  },
  {
    "id": "OP-developer-control-plane-recordPlatformPayment",
    "name": "recordPlatformPayment",
    "file": "src/developer-control-plane.ts",
    "span": "src/developer-control-plane.ts:127-130",
    "calls": [
      "state.charges.map",
      "iso"
    ],
    "sql": [],
    "body": "export function recordPlatformPayment(state: DeveloperControlPlaneState, chargeId: string, amount: number, note = \"\", now: Date | string = new Date()): DeveloperControlPlaneState {\n  if (!(amount > 0)) throw new Error(\"Payment amount must be positive.\");\n  return { ...state, charges: state.charges.map((charge) => charge.id === chargeId ? { ...charge, payments: [...charge.payments, { id: `${charge.id}-payment-${charge.payments.length + 1}`, amount, note, paidAt: iso(now) }] } : charge) };\n}",
    "parameters": [
      {
        "name": "state",
        "type": "DeveloperControlPlaneState",
        "optional": false
      },
      {
        "name": "chargeId",
        "type": "string",
        "optional": false
      },
      {
        "name": "amount",
        "type": "number",
        "optional": false
      },
      {
        "name": "note",
        "type": "INFERRED",
        "optional": true,
        "default": "\"\""
      },
      {
        "name": "now",
        "type": "Date | string",
        "optional": true,
        "default": "new Date()"
      }
    ],
    "returnType": "DeveloperControlPlaneState",
    "classification": "SIMULATION",
    "endpoint": "Existing isolated simulation; real platform adoption unapproved",
    "service": "finance; TX-03/04/05/12; FIN-01..04",
    "resolvedReturnType": "DeveloperControlPlaneState"
  },
  {
    "id": "OP-developer-control-plane-chargeStatus",
    "name": "chargeStatus",
    "file": "src/developer-control-plane.ts",
    "span": "src/developer-control-plane.ts:131-131",
    "calls": [
      "charge.payments.reduce"
    ],
    "sql": [],
    "body": "export function chargeStatus(charge: PlatformCharge): \"Unpaid\" | \"Partial\" | \"Paid\" { const paid = charge.payments.reduce((sum, payment) => sum + payment.amount, 0); return paid >= charge.amount ? \"Paid\" : paid > 0 ? \"Partial\" : \"Unpaid\"; }",
    "parameters": [
      {
        "name": "charge",
        "type": "PlatformCharge",
        "optional": false
      }
    ],
    "returnType": "\"Unpaid\" | \"Partial\" | \"Paid\"",
    "classification": "SIMULATION",
    "endpoint": "Existing isolated simulation; real platform adoption unapproved",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "\"Partial\" | \"Paid\" | \"Unpaid\""
  },
  {
    "id": "OP-developer-control-plane-roleForEmulation",
    "name": "roleForEmulation",
    "file": "src/developer-control-plane.ts",
    "span": "src/developer-control-plane.ts:132-132",
    "calls": [],
    "sql": [],
    "body": "export function roleForEmulation(role: EmulationRole): Role { return role; }",
    "parameters": [
      {
        "name": "role",
        "type": "EmulationRole",
        "optional": false
      }
    ],
    "returnType": "Role",
    "classification": "SIMULATION",
    "endpoint": "Existing isolated simulation; real platform adoption unapproved",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "Role"
  },
  {
    "id": "OP-document-snapshots-loadDocumentSnapshots",
    "name": "loadDocumentSnapshots",
    "file": "src/document-snapshots.ts",
    "span": "src/document-snapshots.ts:33-39",
    "calls": [
      "browserStorage",
      "storage?.getItem",
      "JSON.parse",
      "Array.isArray"
    ],
    "sql": [],
    "body": "export function loadDocumentSnapshots(storage: SnapshotStorage | undefined = browserStorage()): DocumentSnapshot[] {\n  if (cache && storage === browserStorage()) return cache;\n  let parsed: DocumentSnapshot[] = [];\n  try { const raw = storage?.getItem(DOCUMENT_SNAPSHOT_KEY); const value = raw ? JSON.parse(raw) : []; parsed = Array.isArray(value) ? value : []; } catch { parsed = []; }\n  if (storage === browserStorage()) cache = parsed;\n  return parsed;\n}",
    "parameters": [
      {
        "name": "storage",
        "type": "SnapshotStorage | undefined",
        "optional": true,
        "default": "browserStorage()"
      }
    ],
    "returnType": "DocumentSnapshot[]",
    "classification": "READ",
    "endpoint": "GET /api/v1/ui/document-snapshots",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "DocumentSnapshot[]"
  },
  {
    "id": "OP-document-snapshots-saveDocumentSnapshots",
    "name": "saveDocumentSnapshots",
    "file": "src/document-snapshots.ts",
    "span": "src/document-snapshots.ts:41-44",
    "calls": [
      "browserStorage",
      "storage?.setItem",
      "JSON.stringify"
    ],
    "sql": [],
    "body": "export function saveDocumentSnapshots(snapshots: DocumentSnapshot[], storage: SnapshotStorage | undefined = browserStorage()) {\n  if (storage === browserStorage()) cache = snapshots;\n  try { storage?.setItem(DOCUMENT_SNAPSHOT_KEY, JSON.stringify(snapshots)); } catch { /* quota or blocked storage: keep the in-memory copy */ }\n}",
    "parameters": [
      {
        "name": "snapshots",
        "type": "DocumentSnapshot[]",
        "optional": false
      },
      {
        "name": "storage",
        "type": "SnapshotStorage | undefined",
        "optional": true,
        "default": "browserStorage()"
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "INTERNAL",
    "endpoint": "Transactional snapshot hook; no browser overwrite/clear API",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-document-snapshots-clearDocumentSnapshots",
    "name": "clearDocumentSnapshots",
    "file": "src/document-snapshots.ts",
    "span": "src/document-snapshots.ts:46-46",
    "calls": [
      "browserStorage",
      "saveDocumentSnapshots"
    ],
    "sql": [],
    "body": "export function clearDocumentSnapshots(storage: SnapshotStorage | undefined = browserStorage()) { saveDocumentSnapshots([], storage); }",
    "parameters": [
      {
        "name": "storage",
        "type": "SnapshotStorage | undefined",
        "optional": true,
        "default": "browserStorage()"
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "INTERNAL",
    "endpoint": "Transactional snapshot hook; no browser overwrite/clear API",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-document-snapshots-planSnapshots",
    "name": "planSnapshots",
    "file": "src/document-snapshots.ts",
    "span": "src/document-snapshots.ts:63-89",
    "calls": [
      "new Date().toISOString",
      "(prev ?? []).map",
      "snapshots.findIndex",
      "prevById.get",
      "documentInfo",
      "live",
      "snapshots.push",
      "freeze",
      "snapshots.filter"
    ],
    "sql": [],
    "body": "export function planSnapshots(existing: readonly DocumentSnapshot[], prev: readonly JobView[] | undefined, next: readonly JobView[], admin: Templates, now: string = new Date().toISOString()): DocumentSnapshot[] {\n  let snapshots = [...existing];\n  const prevById = new Map((prev ?? []).map((view) => [view.job.id, view]));\n  const live = (jobId: number, jobNo: string, kind: DocumentKind, number: string) => snapshots.findIndex((item) => item.jobId === jobId && item.jobNo === jobNo && item.kind === kind && item.number === number && item.state === \"frozen\");\n  for (const view of next) {\n    const candidate = prevById.get(view.job.id);\n    const before = candidate && candidate.job.job_no === view.job.job_no ? candidate : undefined;\n    for (const kind of SLOT_KINDS) {\n      const was = before && documentInfo(kind, before);\n      const now_ = documentInfo(kind, view);\n      try {\n        if (was && (!now_ || now_.number !== was.number)) {\n          const index = live(view.job.id, view.job.job_no, kind, was.number);\n          if (index >= 0) snapshots[index] = { ...snapshots[index], state: \"void\", voidedAt: now };\n          else snapshots.push({ ...freeze(kind, before!, was.number, admin, now), state: \"void\", voidedAt: now });\n        }\n        if (now_) {\n          const index = live(view.job.id, view.job.job_no, kind, now_.number);\n          if (now_.frozen && index < 0) snapshots.push(freeze(kind, view, now_.number, admin, now));\n          // An Invoice reopened by a voided payment is live again; it re-freezes when Cleared once more.\n          if (!now_.frozen && index >= 0) snapshots = snapshots.filter((_item, position) => position !== index);\n        }\n      } catch { /* a missing template must never break a job update */ }\n    }\n  }\n  return snapshots;\n}",
    "parameters": [
      {
        "name": "existing",
        "type": "readonly DocumentSnapshot[]",
        "optional": false
      },
      {
        "name": "prev",
        "type": "readonly JobView[] | undefined",
        "optional": false
      },
      {
        "name": "next",
        "type": "readonly JobView[]",
        "optional": false
      },
      {
        "name": "admin",
        "type": "Templates",
        "optional": false
      },
      {
        "name": "now",
        "type": "string",
        "optional": true,
        "default": "new Date().toISOString()"
      }
    ],
    "returnType": "DocumentSnapshot[]",
    "classification": "INTERNAL",
    "endpoint": "Transactional snapshot hook; no browser overwrite/clear API",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "DocumentSnapshot[]"
  },
  {
    "id": "OP-document-snapshots-syncDocumentSnapshots",
    "name": "syncDocumentSnapshots",
    "file": "src/document-snapshots.ts",
    "span": "src/document-snapshots.ts:92-98",
    "calls": [
      "loadDocumentSnapshots",
      "planSnapshots",
      "JSON.stringify",
      "saveDocumentSnapshots"
    ],
    "sql": [],
    "body": "export function syncDocumentSnapshots(prev: readonly JobView[] | undefined, next: readonly JobView[], admin: Templates, storage?: SnapshotStorage): boolean {\n  const existing = loadDocumentSnapshots(storage);\n  const updated = planSnapshots(existing, prev, next, admin);\n  if (JSON.stringify(updated) === JSON.stringify(existing)) return false;\n  saveDocumentSnapshots(updated, storage);\n  return true;\n}",
    "parameters": [
      {
        "name": "prev",
        "type": "readonly JobView[] | undefined",
        "optional": false
      },
      {
        "name": "next",
        "type": "readonly JobView[]",
        "optional": false
      },
      {
        "name": "admin",
        "type": "Templates",
        "optional": false
      },
      {
        "name": "storage",
        "type": "SnapshotStorage",
        "optional": true
      }
    ],
    "returnType": "boolean",
    "classification": "INTERNAL",
    "endpoint": "Transactional snapshot hook; no browser overwrite/clear API",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "boolean"
  },
  {
    "id": "OP-export-utils-buildExportMatrix",
    "name": "buildExportMatrix",
    "file": "src/export-utils.ts",
    "span": "src/export-utils.ts:17-26",
    "calls": [
      "generatedAt.toLocaleString",
      "filters.join",
      "columns.map",
      "rows.map",
      "column.value"
    ],
    "sql": [],
    "body": "export function buildExportMatrix<T>({ title, filters, columns, rows, generatedAt = new Date() }: ExportReport<T>) {\n  return [\n    [title],\n    [\"Generated\", generatedAt.toLocaleString(\"en-IN\")],\n    [\"Active filters\", filters.length ? filters.join(\"; \") : \"None\"],\n    [],\n    columns.map((column) => column.header),\n    ...rows.map((row) => columns.map((column) => column.value(row))),\n  ];\n}",
    "parameters": [
      {
        "name": "{ title, filters, columns, rows, generatedAt = new Date() }",
        "type": "ExportReport<T>",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "(string | number)[][]"
  },
  {
    "id": "OP-export-utils-downloadExcel",
    "name": "downloadExcel",
    "file": "src/export-utils.ts",
    "span": "src/export-utils.ts:32-41",
    "calls": [
      "buildExportMatrix",
      "XLSX.utils.aoa_to_sheet",
      "report.columns.map",
      "Math.min",
      "Math.max",
      "matrix.slice(5).map",
      "matrix.slice",
      "String",
      "XLSX.utils.book_new",
      "XLSX.utils.book_append_sheet",
      "XLSX.writeFile",
      "fileStem"
    ],
    "sql": [],
    "body": "export function downloadExcel<T>(report: ExportReport<T>) {\n  const matrix = buildExportMatrix(report);\n  const sheet = XLSX.utils.aoa_to_sheet(matrix);\n  sheet[\"!cols\"] = report.columns.map((column, index) => ({\n    wch: Math.min(42, Math.max(column.header.length, ...matrix.slice(5).map((row) => String(row[index] ?? \"\").length)) + 2),\n  }));\n  const workbook = XLSX.utils.book_new();\n  XLSX.utils.book_append_sheet(workbook, sheet, \"Report\");\n  XLSX.writeFile(workbook, `${fileStem(report.title)}.xlsx`, { compression: true });\n}",
    "parameters": [
      {
        "name": "report",
        "type": "ExportReport<T>",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-export-utils-downloadPdf",
    "name": "downloadPdf",
    "file": "src/export-utils.ts",
    "span": "src/export-utils.ts:43-84",
    "calls": [
      "document.internal.pageSize.getWidth",
      "Math.max",
      "document.setFont",
      "document.setFontSize",
      "document.text",
      "generatedAt.toLocaleString",
      "report.filters.join",
      "report.columns.forEach",
      "document.line",
      "header",
      "document.internal.pageSize.getHeight",
      "document.addPage",
      "String(column.value(row) ?? \"\").replace",
      "String",
      "column.value",
      "document.save",
      "fileStem"
    ],
    "sql": [],
    "body": "export function downloadPdf<T>(report: ExportReport<T>) {\n  const generatedAt = report.generatedAt ?? new Date();\n  const document = new jsPDF({ orientation: \"landscape\", unit: \"pt\", format: \"a4\" });\n  const margin = 32;\n  const width = document.internal.pageSize.getWidth() - margin * 2;\n  const columnWidth = width / Math.max(1, report.columns.length);\n  const lineHeight = 15;\n  let y = margin;\n\n  const header = () => {\n    document.setFont(\"helvetica\", \"bold\");\n    document.setFontSize(15);\n    document.text(report.title, margin, y);\n    y += 18;\n    document.setFont(\"helvetica\", \"normal\");\n    document.setFontSize(8);\n    document.text(`Generated: ${generatedAt.toLocaleString(\"en-IN\")}`, margin, y);\n    y += 12;\n    document.text(`Active filters: ${report.filters.length ? report.filters.join(\"; \") : \"None\"}`, margin, y, { maxWidth: width });\n    y += 20;\n    document.setFont(\"helvetica\", \"bold\");\n    report.columns.forEach((column, index) => document.text(column.header, margin + index * columnWidth, y, { maxWidth: columnWidth - 5 }));\n    document.line(margin, y + 4, margin + width, y + 4);\n    y += lineHeight;\n    document.setFont(\"helvetica\", \"normal\");\n  };\n\n  header();\n  for (const row of report.rows) {\n    if (y > document.internal.pageSize.getHeight() - margin) {\n      document.addPage();\n      y = margin;\n      header();\n    }\n    report.columns.forEach((column, index) => {\n      const value = String(column.value(row) ?? \"\").replace(/[^\\x20-\\x7E]/g, \" \");\n      document.text(value, margin + index * columnWidth, y, { maxWidth: columnWidth - 5 });\n    });\n    y += lineHeight;\n  }\n  document.save(`${fileStem(report.title)}.pdf`);\n}",
    "parameters": [
      {
        "name": "report",
        "type": "ExportReport<T>",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-finance-ui-canVoidRemoteInvoice",
    "name": "canVoidRemoteInvoice",
    "file": "src/finance-ui.ts",
    "span": "src/finance-ui.ts:4-6",
    "calls": [],
    "sql": [],
    "body": "export function canVoidRemoteInvoice(invoice: Pick<RemoteInvoice, \"status\" | \"voided\" | \"paidPaise\">): boolean {\n  return !invoice.voided && invoice.status === \"UNPAID\" && invoice.paidPaise === 0;\n}",
    "parameters": [
      {
        "name": "invoice",
        "type": "Pick<RemoteInvoice, \"status\" | \"voided\" | \"paidPaise\">",
        "optional": false
      }
    ],
    "returnType": "boolean",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "finance; TX-03/04/05/12; FIN-01..04",
    "resolvedReturnType": "boolean"
  },
  {
    "id": "OP-finance-ui-isActiveRemoteInvoice",
    "name": "isActiveRemoteInvoice",
    "file": "src/finance-ui.ts",
    "span": "src/finance-ui.ts:9-11",
    "calls": [],
    "sql": [],
    "body": "export function isActiveRemoteInvoice(invoice: Pick<RemoteInvoice, \"status\" | \"voided\">): boolean {\n  return !invoice.voided && invoice.status !== \"CREDITED\";\n}",
    "parameters": [
      {
        "name": "invoice",
        "type": "Pick<RemoteInvoice, \"status\" | \"voided\">",
        "optional": false
      }
    ],
    "returnType": "boolean",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "finance; TX-03/04/05/12; FIN-01..04",
    "resolvedReturnType": "boolean"
  },
  {
    "id": "OP-finance-ui-requiresInvoiceReplacement",
    "name": "requiresInvoiceReplacement",
    "file": "src/finance-ui.ts",
    "span": "src/finance-ui.ts:13-15",
    "calls": [
      "invoices.some"
    ],
    "sql": [],
    "body": "export function requiresInvoiceReplacement(invoices: readonly Pick<RemoteInvoice, \"status\" | \"voided\">[]): boolean {\n  return invoices.length > 0 && !invoices.some(isActiveRemoteInvoice);\n}",
    "parameters": [
      {
        "name": "invoices",
        "type": "readonly Pick<RemoteInvoice, \"status\" | \"voided\">[]",
        "optional": false
      }
    ],
    "returnType": "boolean",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "finance; TX-03/04/05/12; FIN-01..04",
    "resolvedReturnType": "boolean"
  },
  {
    "id": "OP-finance-ui-canReplaceRemoteInvoice",
    "name": "canReplaceRemoteInvoice",
    "file": "src/finance-ui.ts",
    "span": "src/finance-ui.ts:18-20",
    "calls": [],
    "sql": [],
    "body": "export function canReplaceRemoteInvoice(invoice: Pick<RemoteInvoice, \"status\" | \"voided\">, hasActiveInvoice: boolean): boolean {\n  return (invoice.voided && invoice.status === \"VOID\" || invoice.status === \"CREDITED\") && !hasActiveInvoice;\n}",
    "parameters": [
      {
        "name": "invoice",
        "type": "Pick<RemoteInvoice, \"status\" | \"voided\">",
        "optional": false
      },
      {
        "name": "hasActiveInvoice",
        "type": "boolean",
        "optional": false
      }
    ],
    "returnType": "boolean",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "finance; TX-03/04/05/12; FIN-01..04",
    "resolvedReturnType": "boolean"
  },
  {
    "id": "OP-finance-ui-remoteDocumentFilename",
    "name": "remoteDocumentFilename",
    "file": "src/finance-ui.ts",
    "span": "src/finance-ui.ts:22-24",
    "calls": [],
    "sql": [],
    "body": "export function remoteDocumentFilename(number: string): string {\n  return `${number}.html`;\n}",
    "parameters": [
      {
        "name": "number",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "string",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "string"
  },
  {
    "id": "OP-inventory-import-parseInventoryWorkbook",
    "name": "parseInventoryWorkbook",
    "file": "src/inventory-import.ts",
    "span": "src/inventory-import.ts:145-166",
    "calls": [
      "XLSX.read",
      "sheetMatrix",
      "isBlankRow",
      "matrix[0].map",
      "headerKey",
      "String",
      "firstKeys.some",
      "FIELD_ALIASES.sku.includes",
      "parseCategorySheets",
      "uniqueHeaders",
      "matrix.slice(1).filter((row) => !isBlankRow(row)).map",
      "matrix.slice(1).filter",
      "matrix.slice",
      "Object.fromEntries",
      "headers.map"
    ],
    "sql": [],
    "body": "export function parseInventoryWorkbook(data: ArrayBuffer | Uint8Array): ParsedInventoryWorkbook {\n  const workbook = XLSX.read(data, { type: \"array\", raw: true });\n  const sheetName = workbook.SheetNames[0];\n  if (!sheetName) throw new Error(\"The inventory file does not contain a worksheet.\");\n\n  const matrix = sheetMatrix(workbook.Sheets[sheetName]);\n  if (matrix.length === 0 || isBlankRow(matrix[0])) {\n    throw new Error(\"The inventory file does not contain a header row.\");\n  }\n\n  const firstKeys = matrix[0].map((value) => headerKey(String(value ?? \"\")));\n  if (!firstKeys.some((key) => FIELD_ALIASES.sku.includes(key))) {\n    const categorized = parseCategorySheets(workbook);\n    if (categorized) return categorized;\n  }\n\n  const headers = uniqueHeaders(matrix[0]);\n  const rows = matrix.slice(1).filter((row) => !isBlankRow(row)).map((row) =>\n    Object.fromEntries(headers.map((header, index) => [header, row[index] ?? \"\"])),\n  );\n  return { sheetName, headers, rows };\n}",
    "parameters": [
      {
        "name": "data",
        "type": "ArrayBuffer | Uint8Array",
        "optional": false
      }
    ],
    "returnType": "ParsedInventoryWorkbook",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "materials/inventory; TX-06/07/10",
    "resolvedReturnType": "ParsedInventoryWorkbook"
  },
  {
    "id": "OP-inventory-import-suggestInventoryColumnMapping",
    "name": "suggestInventoryColumnMapping",
    "file": "src/inventory-import.ts",
    "span": "src/inventory-import.ts:169-182",
    "calls": [
      "headers.map",
      "headerKey",
      "normalizedHeaders.find",
      "claimed.has",
      "FIELD_ALIASES[field].includes",
      "claimed.add"
    ],
    "sql": [],
    "body": "export function suggestInventoryColumnMapping(headers: string[]): InventoryColumnMapping {\n  const normalizedHeaders = headers.map((header) => ({ header, key: headerKey(header) }));\n  const claimed = new Set<string>();\n  const mapping: InventoryColumnMapping = {};\n\n  for (const field of INVENTORY_IMPORT_FIELDS) {\n    const match = normalizedHeaders.find(({ header, key }) => !claimed.has(header) && FIELD_ALIASES[field].includes(key));\n    if (match) {\n      mapping[field] = match.header;\n      claimed.add(match.header);\n    }\n  }\n  return mapping;\n}",
    "parameters": [
      {
        "name": "headers",
        "type": "string[]",
        "optional": false
      }
    ],
    "returnType": "InventoryColumnMapping",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "materials/inventory; TX-06/07/10",
    "resolvedReturnType": "Partial<Record<\"name\" | \"unit\" | \"sku\" | \"category\" | \"stock_qty\" | \"low_stock_qty\", string>>"
  },
  {
    "id": "OP-inventory-import-buildInventoryImportPreview",
    "name": "buildInventoryImportPreview",
    "file": "src/inventory-import.ts",
    "span": "src/inventory-import.ts:228-291",
    "calls": [
      "mappingIssues",
      "rows.map",
      "normalizedSku",
      "fileSkuCounts.set",
      "fileSkuCounts.get",
      "existingInventory.map",
      "rows.forEach",
      "normalizedText",
      "normalizedText(source[sourceColumn.unit]).toLocaleLowerCase",
      "parseQuantity",
      "issues.push",
      "Number.isFinite",
      "existingSkus.has",
      "rejectedRows.push",
      "deterministicId",
      "usedIds.has",
      "usedIds.add",
      "validRows.push"
    ],
    "sql": [],
    "body": "export function buildInventoryImportPreview({\n  headers,\n  rows,\n  mapping,\n  existingInventory = [],\n}: BuildInventoryImportPreviewOptions): InventoryImportPreview {\n  const mapIssues = mappingIssues(headers, mapping);\n  if (mapIssues.length > 0) {\n    return { totalRows: rows.length, validRows: [], rejectedRows: [], mappingIssues: mapIssues };\n  }\n\n  const sourceColumn = mapping as Record<InventoryImportField, string>;\n  const skus = rows.map((row) => normalizedSku(row[sourceColumn.sku]));\n  const fileSkuCounts = new Map<string, number>();\n  for (const sku of skus) if (sku) fileSkuCounts.set(sku, (fileSkuCounts.get(sku) ?? 0) + 1);\n  const existingSkus = new Set(existingInventory.map((item) => normalizedSku(item.sku)));\n  const usedIds = new Set(existingInventory.map((item) => item.id));\n  const validRows: ValidInventoryImportRow[] = [];\n  const rejectedRows: RejectedInventoryImportRow[] = [];\n\n  rows.forEach((source, index) => {\n    const sourceRowNumber = index + 2;\n    const normalized: Omit<InventoryItem, \"id\"> = {\n      sku: skus[index],\n      name: normalizedText(source[sourceColumn.name]),\n      category: normalizedText(source[sourceColumn.category]),\n      unit: normalizedText(source[sourceColumn.unit]).toLocaleLowerCase(),\n      stock_qty: parseQuantity(source[sourceColumn.stock_qty]),\n      low_stock_qty: parseQuantity(source[sourceColumn.low_stock_qty]),\n      selling_price: 0,\n    };\n    const issues: InventoryImportIssue[] = [];\n\n    for (const field of [\"sku\", \"name\", \"category\", \"unit\"] as const) {\n      if (!normalized[field]) issues.push({ code: \"MISSING_VALUE\", field, message: `${field} is required.` });\n    }\n    for (const field of [\"stock_qty\", \"low_stock_qty\"] as const) {\n      const quantity = normalized[field];\n      if (!Number.isFinite(quantity)) {\n        issues.push({ code: \"INVALID_QUANTITY\", field, message: `${field} must be a finite number.` });\n      } else if (quantity < 0) {\n        issues.push({ code: \"NEGATIVE_QUANTITY\", field, message: `${field} cannot be negative.` });\n      }\n    }\n    if (normalized.sku && (fileSkuCounts.get(normalized.sku) ?? 0) > 1) {\n      issues.push({ code: \"DUPLICATE_SKU_FILE\", field: \"sku\", message: `SKU ${normalized.sku} occurs more than once in this file.` });\n    }\n    if (normalized.sku && existingSkus.has(normalized.sku)) {\n      issues.push({ code: \"DUPLICATE_SKU_EXISTING\", field: \"sku\", message: `SKU ${normalized.sku} already exists in inventory.` });\n    }\n\n    if (issues.length > 0) {\n      rejectedRows.push({ sourceRowNumber, source, normalized, issues });\n      return;\n    }\n\n    let id = deterministicId(`${sourceRowNumber}|${normalized.sku}|${normalized.name}|${normalized.category}|${normalized.unit}`);\n    while (usedIds.has(id)) id -= 1;\n    usedIds.add(id);\n    validRows.push({ sourceRowNumber, source, item: { id, ...normalized } });\n  });\n\n  return { totalRows: rows.length, validRows, rejectedRows, mappingIssues: [] };\n}",
    "parameters": [
      {
        "name": "{\n  headers,\n  rows,\n  mapping,\n  existingInventory = [],\n}",
        "type": "BuildInventoryImportPreviewOptions",
        "optional": false
      }
    ],
    "returnType": "InventoryImportPreview",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "materials/inventory; TX-06/07/10",
    "resolvedReturnType": "InventoryImportPreview"
  },
  {
    "id": "OP-inventory-import-buildInventoryTemplateBuffer",
    "name": "buildInventoryTemplateBuffer",
    "file": "src/inventory-import.ts",
    "span": "src/inventory-import.ts:303-313",
    "calls": [
      "INVENTORY_IMPORT_FIELDS.map",
      "XLSX.utils.aoa_to_sheet",
      "headers.map",
      "Math.max",
      "XLSX.utils.book_new",
      "XLSX.utils.book_append_sheet",
      "XLSX.write"
    ],
    "sql": [],
    "body": "export function buildInventoryTemplateBuffer(): ArrayBuffer {\n  const headers = INVENTORY_IMPORT_FIELDS.map((field) => INVENTORY_TEMPLATE_HEADERS[field]);\n  const worksheet = XLSX.utils.aoa_to_sheet([\n    headers,\n    [\"PPF-001\", \"Paint Protection Film\", \"Film\", \"roll\", 10, 2],\n  ]);\n  worksheet[\"!cols\"] = headers.map((header) => ({ wch: Math.max(14, header.length + 2) }));\n  const workbook = XLSX.utils.book_new();\n  XLSX.utils.book_append_sheet(workbook, worksheet, \"Inventory Import\");\n  return XLSX.write(workbook, { type: \"array\", bookType: \"xlsx\", compression: true }) as ArrayBuffer;\n}",
    "parameters": [],
    "returnType": "ArrayBuffer",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "materials/inventory; TX-06/07/10",
    "resolvedReturnType": "ArrayBuffer"
  },
  {
    "id": "OP-invoice-math-normalizeGstLine",
    "name": "normalizeGstLine",
    "file": "src/invoice-math.ts",
    "span": "src/invoice-math.ts:12-15",
    "calls": [],
    "sql": [],
    "body": "export function normalizeGstLine(gstType: GstType | null | undefined, gstRate: number | null | undefined, fallbackRate = 18): { gst_type: GstType; gst_rate: number } {\n  const gst_type = gstType ?? (gstRate === 0 ? \"No GST\" : \"CGST+SGST\");\n  return { gst_type, gst_rate: gst_type === \"No GST\" ? 0 : gstRate ?? fallbackRate };\n}",
    "parameters": [
      {
        "name": "gstType",
        "type": "GstType | null | undefined",
        "optional": false
      },
      {
        "name": "gstRate",
        "type": "number | null | undefined",
        "optional": false
      },
      {
        "name": "fallbackRate",
        "type": "INFERRED",
        "optional": true,
        "default": "18"
      }
    ],
    "returnType": "{ gst_type: GstType; gst_rate: number }",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "{ gst_type: GstType; gst_rate: number; }"
  },
  {
    "id": "OP-invoice-math-invoiceTotals",
    "name": "invoiceTotals",
    "file": "src/invoice-math.ts",
    "span": "src/invoice-math.ts:29-45",
    "calls": [
      "lines.map",
      "round2",
      "amounts.reduce",
      "Math.min",
      "Math.max",
      "rows.reduce"
    ],
    "sql": [],
    "body": "export function invoiceTotals(lines: readonly PricedLine[], flatDiscount: number): InvoiceTotals {\n  const amounts = lines.map((line) => round2(line.qty * line.rate));\n  const subtotal = round2(amounts.reduce((sum, amount) => sum + amount, 0));\n  const discount = round2(Math.min(Math.max(flatDiscount || 0, 0), subtotal));\n  let spread = 0;\n  const rows = lines.map((line, index): PricedLineTotals => {\n    const isLast = index === lines.length - 1;\n    const share = isLast ? round2(discount - spread) : subtotal > 0 ? round2(discount * amounts[index] / subtotal) : 0;\n    spread = round2(spread + share);\n    const taxable = round2(amounts[index] - share);\n    const gst = round2(taxable * (line.gst_rate || 0) / 100);\n    return { amount: amounts[index], discount: share, taxable, gst, total: round2(taxable + gst) };\n  });\n  const taxable = round2(rows.reduce((sum, row) => sum + row.taxable, 0));\n  const gst = round2(rows.reduce((sum, row) => sum + row.gst, 0));\n  return { lines: rows, subtotal, discount, taxable, gst, total: round2(taxable + gst) };\n}",
    "parameters": [
      {
        "name": "lines",
        "type": "readonly PricedLine[]",
        "optional": false
      },
      {
        "name": "flatDiscount",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "InvoiceTotals",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "InvoiceTotals"
  },
  {
    "id": "OP-invoice-math-buildInvoiceDraft",
    "name": "buildInvoiceDraft",
    "file": "src/invoice-math.ts",
    "span": "src/invoice-math.ts:52-64",
    "calls": [
      "view.estimate_items.filter((item) => item.kind === \"Service\").map",
      "view.estimate_items.filter",
      "normalizeGstLine",
      "view.inventory.find",
      "lines.push"
    ],
    "sql": [],
    "body": "export function buildInvoiceDraft(view: Pick<JobView, \"estimate\" | \"estimate_items\" | \"material_requests\" | \"inventory\">): InvoiceDraft {\n  const lines: InvoiceDraftLine[] = view.estimate_items.filter((item) => item.kind === \"Service\").map((item) => ({ kind: \"Service\", description: item.description, qty: item.qty, rate: item.rate, ...normalizeGstLine(item.gst_type, item.gst_rate, view.estimate?.gst_rate ?? DEFAULT_GST_BY_KIND.Service) }));\n  let unissuedRows = 0;\n  for (const row of view.material_requests) {\n    if (row.archived_at || row.status === \"Cancelled\") continue;\n    if (row.status === \"Issued\") {\n      if (row.invoiced_in) continue;\n      const item = view.inventory.find((candidate) => candidate.id === row.item_id);\n      lines.push({ kind: \"Material\", description: item?.name ?? `Item ${row.item_id}`, qty: row.issued_qty || row.requested_qty, rate: item?.selling_price ?? 0, gst_type: \"CGST+SGST\", gst_rate: DEFAULT_GST_BY_KIND.Material, material_row_id: row.id });\n    } else unissuedRows += 1;\n  }\n  return { lines, unissuedRows, discount: view.estimate?.discount ?? 0 };\n}",
    "parameters": [
      {
        "name": "view",
        "type": "Pick<JobView, \"estimate\" | \"estimate_items\" | \"material_requests\" | \"inventory\">",
        "optional": false
      }
    ],
    "returnType": "InvoiceDraft",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "finance; TX-03/04/05/12; FIN-01..04",
    "resolvedReturnType": "InvoiceDraft"
  },
  {
    "id": "OP-invoice-math-pickableMaterialLines",
    "name": "pickableMaterialLines",
    "file": "src/invoice-math.ts",
    "span": "src/invoice-math.ts:67-69",
    "calls": [
      "buildInvoiceDraft"
    ],
    "sql": [],
    "body": "export function pickableMaterialLines(view: Pick<JobView, \"material_requests\" | \"inventory\">): InvoiceDraftLine[] {\n  return buildInvoiceDraft({ estimate: undefined, estimate_items: [], material_requests: view.material_requests, inventory: view.inventory }).lines;\n}",
    "parameters": [
      {
        "name": "view",
        "type": "Pick<JobView, \"material_requests\" | \"inventory\">",
        "optional": false
      }
    ],
    "returnType": "InvoiceDraftLine[]",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "materials/inventory; TX-06/07/10",
    "resolvedReturnType": "InvoiceDraftLine[]"
  },
  {
    "id": "OP-invoice-math-unissuedWarning",
    "name": "unissuedWarning",
    "file": "src/invoice-math.ts",
    "span": "src/invoice-math.ts:71-73",
    "calls": [],
    "sql": [],
    "body": "export function unissuedWarning(count: number) {\n  return count > 0 ? `${count} material row${count === 1 ? \" is\" : \"s are\"} not issued yet and will not be billed.` : undefined;\n}",
    "parameters": [
      {
        "name": "count",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "string | undefined"
  },
  {
    "id": "OP-invoice-math-canCreateInvoice",
    "name": "canCreateInvoice",
    "file": "src/invoice-math.ts",
    "span": "src/invoice-math.ts:79-86",
    "calls": [],
    "sql": [],
    "body": "export function canCreateInvoice(actor: Actor, job: JobRef) {\n  const eligibleStatus = job.main_status === \"IN_PROGRESS\" || job.main_status === \"COMPLETED\";\n  return eligibleStatus && (\n    actor.role === \"admin\"\n    || (actor.role === \"service\" && actor.id === job.advisor_id)\n    || (actor.role === \"accounts\" && job.main_status === \"COMPLETED\")\n  );\n}",
    "parameters": [
      {
        "name": "actor",
        "type": "Actor",
        "optional": false
      },
      {
        "name": "job",
        "type": "JobRef",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "finance; TX-03/04/05/12; FIN-01..04",
    "resolvedReturnType": "boolean"
  },
  {
    "id": "OP-invoice-math-canEditInvoice",
    "name": "canEditInvoice",
    "file": "src/invoice-math.ts",
    "span": "src/invoice-math.ts:89-92",
    "calls": [],
    "sql": [],
    "body": "export function canEditInvoice(actor: Actor, job: JobRef) {\n  const who = actor.role === \"admin\" || (actor.role === \"service\" && actor.id === job.advisor_id);\n  return who && job.main_status !== \"CLOSED\" && job.main_status !== \"CANCELLED\" && job.main_status !== \"NEW\";\n}",
    "parameters": [
      {
        "name": "actor",
        "type": "Actor",
        "optional": false
      },
      {
        "name": "job",
        "type": "JobRef",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "finance; TX-03/04/05/12; FIN-01..04",
    "resolvedReturnType": "boolean"
  },
  {
    "id": "OP-invoice-math-canCompleteWithInvoice",
    "name": "canCompleteWithInvoice",
    "file": "src/invoice-math.ts",
    "span": "src/invoice-math.ts:95-97",
    "calls": [
      "Boolean"
    ],
    "sql": [],
    "body": "export function canCompleteWithInvoice(view: Pick<JobView, \"invoice\">) {\n  return Boolean(view.invoice && !view.invoice.voided_at);\n}",
    "parameters": [
      {
        "name": "view",
        "type": "Pick<JobView, \"invoice\">",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "finance; TX-03/04/05/12; FIN-01..04",
    "resolvedReturnType": "boolean"
  },
  {
    "id": "OP-invoice-math-billingReconciliation",
    "name": "billingReconciliation",
    "file": "src/invoice-math.ts",
    "span": "src/invoice-math.ts:100-114",
    "calls": [
      "view.payments.find",
      "Boolean",
      "view.job.delivery_by?.trim",
      "view.job.acknowledgement?.trim",
      "[\n    !invoice && \"Invoice\",\n    !payment && \"Payment\",\n    !receipt && \"Receipt\",\n    !gatePass && \"Gate pass\",\n    !deliveryAcknowledged && \"Delivery acknowledgement\",\n  ].filter"
    ],
    "sql": [],
    "body": "export function billingReconciliation(view: JobView) {\n  const invoice = view.invoice && !view.invoice.voided_at ? view.invoice : undefined;\n  const payment = invoice && view.payments.find((item) => item.invoice_id === invoice.id && !item.voided_at);\n  const receipt = invoice && view.receipt && !view.receipt.voided_at && view.receipt.invoice_id === invoice.id ? view.receipt : undefined;\n  const gatePass = invoice && view.gate_pass && !view.gate_pass.voided_at && view.gate_pass.invoice_id === invoice.id ? view.gate_pass : undefined;\n  const deliveryAcknowledged = Boolean(view.job.delivery_by?.trim() && view.job.acknowledgement?.trim());\n  const missing = [\n    !invoice && \"Invoice\",\n    !payment && \"Payment\",\n    !receipt && \"Receipt\",\n    !gatePass && \"Gate pass\",\n    !deliveryAcknowledged && \"Delivery acknowledgement\",\n  ].filter((item): item is string => Boolean(item));\n  return { invoice, payment, receipt, gatePass, deliveryAcknowledged, missing, complete: missing.length === 0 };\n}",
    "parameters": [
      {
        "name": "view",
        "type": "JobView",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "{ invoice: import(\"C:/Users/PREMDEEP/Desktop/AI Engg - Coding All Stuff/WorkshopOS/src/types\").Invoice | undefined; payment: import(\"C:/Users/PREMDEEP/Desktop/AI Engg - Coding All Stuff/WorkshopOS/src/types\").Payment | undefined; receipt: import(\"C:/Users/PREMDEEP/Desktop/AI Engg - Coding All Stuff/WorkshopOS/src/types\").Receipt | undefined; gatePass: import(\"C:/Users/PREMDEEP/Desktop/AI Engg - Coding All Stuff/WorkshopOS/src/types\").GatePass | undefined; deliveryAcknowledged: boolean; missing: string[]; complete: boolean; }"
  },
  {
    "id": "OP-invoice-math-mixedPaymentRows",
    "name": "mixedPaymentRows",
    "file": "src/invoice-math.ts",
    "span": "src/invoice-math.ts:123-133",
    "calls": [
      "view.payments.some",
      "unpaid.push",
      "(payment.voided_at ? voided : received).push"
    ],
    "sql": [],
    "body": "export function mixedPaymentRows<V extends Pick<JobView, \"invoice\" | \"payments\"> & Partial<Pick<JobView, \"payment_history\">>>(views: readonly V[], opts: { includeUnpaid: boolean } = { includeUnpaid: true }): PaymentListRow<V>[] {\n  const unpaid: PaymentListRow<V>[] = [];\n  const received: PaymentListRow<V>[] = [];\n  const voided: PaymentListRow<V>[] = [];\n  for (const view of views) {\n    const invoice = view.invoice && !view.invoice.voided_at ? view.invoice : undefined;\n    if (opts.includeUnpaid && invoice && !view.payments.some((payment) => payment.invoice_id === invoice.id && !payment.voided_at)) unpaid.push({ key: `unpaid-${invoice.id}`, kind: \"unpaid\", view });\n    for (const payment of view.payment_history ?? view.payments) (payment.voided_at ? voided : received).push({ key: `payment-${payment.id}`, kind: payment.voided_at ? \"void\" : \"received\", view, payment });\n  }\n  return [...unpaid, ...received, ...voided];\n}",
    "parameters": [
      {
        "name": "views",
        "type": "readonly V[]",
        "optional": false
      },
      {
        "name": "opts",
        "type": "{ includeUnpaid: boolean }",
        "optional": true,
        "default": "{ includeUnpaid: true }"
      }
    ],
    "returnType": "PaymentListRow<V>[]",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "finance; TX-03/04/05/12; FIN-01..04",
    "resolvedReturnType": "PaymentListRow<V, V[\"payments\"][number]>[]"
  },
  {
    "id": "OP-invoice-math-canRecordOrVoidPayment",
    "name": "canRecordOrVoidPayment",
    "file": "src/invoice-math.ts",
    "span": "src/invoice-math.ts:136-138",
    "calls": [],
    "sql": [],
    "body": "export function canRecordOrVoidPayment(actor: Pick<User, \"role\">, job: Pick<JobRef, \"main_status\">) {\n  return (actor.role === \"admin\" || actor.role === \"accounts\") && job.main_status === \"COMPLETED\";\n}",
    "parameters": [
      {
        "name": "actor",
        "type": "Pick<User, \"role\">",
        "optional": false
      },
      {
        "name": "job",
        "type": "Pick<JobRef, \"main_status\">",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "finance; TX-03/04/05/12; FIN-01..04",
    "resolvedReturnType": "boolean"
  },
  {
    "id": "OP-invoice-math-canVoidCurrentInvoice",
    "name": "canVoidCurrentInvoice",
    "file": "src/invoice-math.ts",
    "span": "src/invoice-math.ts:141-144",
    "calls": [
      "Boolean",
      "canRecordOrVoidPayment",
      "view.payments.some"
    ],
    "sql": [],
    "body": "export function canVoidCurrentInvoice(actor: Pick<User, \"role\">, view: Pick<JobView, \"invoice\" | \"payments\"> & { job: Pick<JobRef, \"main_status\"> }) {\n  const invoice = view.invoice;\n  return Boolean(invoice && !invoice.voided_at) && canRecordOrVoidPayment(actor, view.job) && !view.payments.some((payment) => payment.invoice_id === invoice!.id && !payment.voided_at);\n}",
    "parameters": [
      {
        "name": "actor",
        "type": "Pick<User, \"role\">",
        "optional": false
      },
      {
        "name": "view",
        "type": "Pick<JobView, \"invoice\" | \"payments\"> & { job: Pick<JobRef, \"main_status\"> }",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "finance; TX-03/04/05/12; FIN-01..04",
    "resolvedReturnType": "boolean"
  },
  {
    "id": "OP-job-card-layout-isStubTab",
    "name": "isStubTab",
    "file": "src/job-card-layout.ts",
    "span": "src/job-card-layout.ts:25-27",
    "calls": [
      "JOB_CARD_STUB_TABS.includes"
    ],
    "sql": [],
    "body": "export function isStubTab(key: JobCardTabKey) {\n  return JOB_CARD_STUB_TABS.includes(key);\n}",
    "parameters": [
      {
        "name": "key",
        "type": "JobCardTabKey",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "boolean"
  },
  {
    "id": "OP-job-card-layout-resolveJobCardFooter",
    "name": "resolveJobCardFooter",
    "file": "src/job-card-layout.ts",
    "span": "src/job-card-layout.ts:52-73",
    "calls": [
      "resolveJobDocumentActions",
      "actions.add",
      "resolveJobDocuments(view)\n    .filter((doc) => doc.state !== \"void\")\n    .map",
      "resolveJobDocuments(view)\n    .filter",
      "resolveJobDocuments",
      "ACTION_ORDER.filter",
      "actions.has"
    ],
    "sql": [],
    "body": "export function resolveJobCardFooter(\n  view: JobView,\n  actor: Pick<User, \"id\" | \"role\">,\n): JobCardFooter {\n  const actions = new Set<FooterAction>();\n  for (const kind of [\"estimate\", \"invoice\"] as const) {\n    for (const action of resolveJobDocumentActions(kind, view, actor))\n      if (action !== \"download\") actions.add(action);\n  }\n  const downloads = resolveJobDocuments(view)\n    .filter((doc) => doc.state !== \"void\")\n    .map((doc) => ({\n      kind: doc.kind,\n      label: doc.label,\n      enabled: doc.available,\n      reason: doc.available ? undefined : doc.message,\n    }));\n  return {\n    actions: ACTION_ORDER.filter((action) => actions.has(action)),\n    downloads,\n  };\n}",
    "parameters": [
      {
        "name": "view",
        "type": "JobView",
        "optional": false
      },
      {
        "name": "actor",
        "type": "Pick<User, \"id\" | \"role\">",
        "optional": false
      }
    ],
    "returnType": "JobCardFooter",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "jobs/estimates; TX-02/11/12",
    "resolvedReturnType": "JobCardFooter"
  },
  {
    "id": "OP-job-card-notifications-renderJobCardNotificationTemplate",
    "name": "renderJobCardNotificationTemplate",
    "file": "src/job-card-notifications.ts",
    "span": "src/job-card-notifications.ts:20-28",
    "calls": [
      "template.replace"
    ],
    "sql": [],
    "body": "export function renderJobCardNotificationTemplate(\n  template: string,\n  values: TemplateValues,\n) {\n  return template.replace(\n    /{{(jobCardNo|vehicleRegistrationNo|serviceAdvisorName|workshopName)}}/g,\n    (_, key: keyof TemplateValues) => values[key],\n  );\n}",
    "parameters": [
      {
        "name": "template",
        "type": "string",
        "optional": false
      },
      {
        "name": "values",
        "type": "TemplateValues",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "jobs/estimates; TX-02/11/12",
    "resolvedReturnType": "string"
  },
  {
    "id": "OP-job-card-notifications-renderJobCardNotification",
    "name": "renderJobCardNotification",
    "file": "src/job-card-notifications.ts",
    "span": "src/job-card-notifications.ts:30-57",
    "calls": [
      "renderJobCardNotificationTemplate"
    ],
    "sql": [],
    "body": "export function renderJobCardNotification(\n  event: JobCardNotificationEvent,\n  view: JobView,\n  settings: WorkshopBusinessSettings,\n): JobCardNotificationPayload {\n  const values: TemplateValues = {\n    jobCardNo: view.job.job_no,\n    vehicleRegistrationNo: view.vehicle.number,\n    serviceAdvisorName: view.advisor.name,\n    workshopName: settings.profile.businessName,\n  };\n  const templates = settings.notifications;\n  return {\n    event,\n    whatsapp: renderJobCardNotificationTemplate(\n      event === \"created\"\n        ? templates.jobCardCreatedWhatsAppTemplate\n        : templates.jobCardClosedWhatsAppTemplate,\n      values,\n    ),\n    email: renderJobCardNotificationTemplate(\n      event === \"created\"\n        ? templates.jobCardCreatedEmailTemplate\n        : templates.jobCardClosedEmailTemplate,\n      values,\n    ),\n  };\n}",
    "parameters": [
      {
        "name": "event",
        "type": "JobCardNotificationEvent",
        "optional": false
      },
      {
        "name": "view",
        "type": "JobView",
        "optional": false
      },
      {
        "name": "settings",
        "type": "WorkshopBusinessSettings",
        "optional": false
      }
    ],
    "returnType": "JobCardNotificationPayload",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "jobs/estimates; TX-02/11/12",
    "resolvedReturnType": "JobCardNotificationPayload"
  },
  {
    "id": "OP-job-card-notifications-deliverJobCardNotificationStub",
    "name": "deliverJobCardNotificationStub",
    "file": "src/job-card-notifications.ts",
    "span": "src/job-card-notifications.ts:60-65",
    "calls": [
      "notify"
    ],
    "sql": [],
    "body": "export function deliverJobCardNotificationStub(\n  _payload: JobCardNotificationPayload,\n  notify: (message: string) => void,\n) {\n  notify(\"whatsapp and email note sent\");\n}",
    "parameters": [
      {
        "name": "_payload",
        "type": "JobCardNotificationPayload",
        "optional": false
      },
      {
        "name": "notify",
        "type": "(message: string) => void",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "jobs/estimates; TX-02/11/12",
    "resolvedReturnType": "void"
  },
  {
    "id": "OP-job-delivery-highlight-localDeliveryDate",
    "name": "localDeliveryDate",
    "file": "src/job-delivery-highlight.ts",
    "span": "src/job-delivery-highlight.ts:15-20",
    "calls": [
      "String(now.getFullYear()).padStart",
      "String",
      "now.getFullYear",
      "String(now.getMonth() + 1).padStart",
      "now.getMonth",
      "String(now.getDate()).padStart",
      "now.getDate"
    ],
    "sql": [],
    "body": "export function localDeliveryDate(now = new Date()): string {\n  const year = String(now.getFullYear()).padStart(4, \"0\");\n  const month = String(now.getMonth() + 1).padStart(2, \"0\");\n  const day = String(now.getDate()).padStart(2, \"0\");\n  return `${year}-${month}-${day}`;\n}",
    "parameters": [
      {
        "name": "now",
        "type": "INFERRED",
        "optional": true,
        "default": "new Date()"
      }
    ],
    "returnType": "string",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "finance; TX-03/04/05/12; FIN-01..04",
    "resolvedReturnType": "string"
  },
  {
    "id": "OP-job-delivery-highlight-jobDeliveryTone",
    "name": "jobDeliveryTone",
    "file": "src/job-delivery-highlight.ts",
    "span": "src/job-delivery-highlight.ts:22-34",
    "calls": [
      "calendarDay"
    ],
    "sql": [],
    "body": "export function jobDeliveryTone(\n  job: Pick<JobCard, \"estimated_delivery\" | \"main_status\" | \"archived_at\">,\n  today: string,\n): \"approaching\" | \"overdue\" | undefined {\n  if (job.archived_at || job.main_status === \"CLOSED\" || job.main_status === \"CANCELLED\") return undefined;\n  const deliveryDay = calendarDay(job.estimated_delivery ?? \"\");\n  const todayDay = calendarDay(today);\n  if (deliveryDay === undefined || todayDay === undefined) return undefined;\n  const daysAway = deliveryDay - todayDay;\n  if (daysAway < 0) return \"overdue\";\n  if (daysAway <= 7) return \"approaching\";\n  return undefined;\n}",
    "parameters": [
      {
        "name": "job",
        "type": "Pick<JobCard, \"estimated_delivery\" | \"main_status\" | \"archived_at\">",
        "optional": false
      },
      {
        "name": "today",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "\"approaching\" | \"overdue\" | undefined",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "finance; TX-03/04/05/12; FIN-01..04",
    "resolvedReturnType": "\"approaching\" | \"overdue\" | undefined"
  },
  {
    "id": "OP-job-delivery-highlight-jobDeliveryClass",
    "name": "jobDeliveryClass",
    "file": "src/job-delivery-highlight.ts",
    "span": "src/job-delivery-highlight.ts:36-39",
    "calls": [
      "jobDeliveryTone"
    ],
    "sql": [],
    "body": "export function jobDeliveryClass(job: Pick<JobCard, \"estimated_delivery\" | \"main_status\" | \"archived_at\">, today: string) {\n  const tone = jobDeliveryTone(job, today);\n  return tone ? `job-delivery-${tone}` : \"\";\n}",
    "parameters": [
      {
        "name": "job",
        "type": "Pick<JobCard, \"estimated_delivery\" | \"main_status\" | \"archived_at\">",
        "optional": false
      },
      {
        "name": "today",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "finance; TX-03/04/05/12; FIN-01..04",
    "resolvedReturnType": "string"
  },
  {
    "id": "OP-job-delivery-highlight-useLocalDeliveryDate",
    "name": "useLocalDeliveryDate",
    "file": "src/job-delivery-highlight.ts",
    "span": "src/job-delivery-highlight.ts:41-65",
    "calls": [
      "useState",
      "localDeliveryDate",
      "useEffect",
      "setToday",
      "now.getFullYear",
      "now.getMonth",
      "now.getDate",
      "setTimeout",
      "Math.max",
      "nextMidnight.getTime",
      "now.getTime",
      "clearTimeout",
      "refresh",
      "document.addEventListener",
      "document.removeEventListener"
    ],
    "sql": [],
    "body": "export function useLocalDeliveryDate(): string {\n  const [today, setToday] = useState(() => localDeliveryDate());\n  useEffect(() => {\n    let timer: ReturnType<typeof setTimeout>;\n    const refresh = () => {\n      setToday(localDeliveryDate());\n      const now = new Date();\n      const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);\n      timer = setTimeout(refresh, Math.max(1, nextMidnight.getTime() - now.getTime() + 50));\n    };\n    const onVisible = () => {\n      if (document.visibilityState === \"visible\") {\n        clearTimeout(timer);\n        refresh();\n      }\n    };\n    refresh();\n    document.addEventListener(\"visibilitychange\", onVisible);\n    return () => {\n      clearTimeout(timer);\n      document.removeEventListener(\"visibilitychange\", onVisible);\n    };\n  }, []);\n  return today;\n}",
    "parameters": [],
    "returnType": "string",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "finance; TX-03/04/05/12; FIN-01..04",
    "resolvedReturnType": "string"
  },
  {
    "id": "OP-job-documents-resolveJobDocumentActions",
    "name": "resolveJobDocumentActions",
    "file": "src/job-documents.ts",
    "span": "src/job-documents.ts:12-25",
    "calls": [
      "recordExists",
      "mayEditInvoice",
      "canCreateInvoice"
    ],
    "sql": [],
    "body": "export function resolveJobDocumentActions(kind: DocumentKind, view: JobView, actor: Pick<User, \"id\" | \"role\">): JobDocumentAction[] {\n  // CLOSED and CANCELLED jobs are terminal and read-only: documents can only be downloaded.\n  const readOnly = view.job.main_status === \"CANCELLED\" || view.job.main_status === \"CLOSED\";\n  const canEditEstimate = !readOnly && (actor.role === \"admin\" || (actor.role === \"service\" && actor.id === view.job.advisor_id));\n  if (kind === \"estimate\") {\n    if (recordExists(kind, view)) return [...(canEditEstimate ? [\"edit-estimate\" as const, ...(view.estimate?.status === \"Approved\" ? [] : [\"approve-estimate\" as const])] : []), \"download\"];\n    return canEditEstimate ? [\"create-estimate\"] : [];\n  }\n  if (kind === \"invoice\") {\n    if (view.invoice && !view.invoice.voided_at) return [...(!readOnly && mayEditInvoice(actor, view.job) && view.invoice.status !== \"Cleared\" ? [\"edit-invoice\" as const] : []), ...(recordExists(kind, view) ? [\"download\" as const] : [])];\n    return !readOnly && canCreateInvoice(actor, view.job) && view.estimate?.status === \"Approved\" && !view.estimate.archived_at ? [\"create-invoice\"] : [];\n  }\n  return recordExists(kind, view) ? [\"download\"] : [];\n}",
    "parameters": [
      {
        "name": "kind",
        "type": "DocumentKind",
        "optional": false
      },
      {
        "name": "view",
        "type": "JobView",
        "optional": false
      },
      {
        "name": "actor",
        "type": "Pick<User, \"id\" | \"role\">",
        "optional": false
      }
    ],
    "returnType": "JobDocumentAction[]",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "jobs/estimates; TX-02/11/12",
    "resolvedReturnType": "JobDocumentAction[]"
  },
  {
    "id": "OP-job-documents-documentInfo",
    "name": "documentInfo",
    "file": "src/job-documents.ts",
    "span": "src/job-documents.ts:39-46",
    "calls": [
      "recordExists"
    ],
    "sql": [],
    "body": "export function documentInfo(kind: DocumentKind, view: JobView): { number: string; frozen: boolean } | undefined {\n  if (!recordExists(kind, view)) return undefined;\n  if (kind === \"estimate\") return { number: `EST-${view.job.job_no}`, frozen: view.estimate?.status === \"Approved\" };\n  if (kind === \"invoice\") return { number: view.invoice!.invoice_no, frozen: view.invoice!.status === \"Cleared\" };\n  if (kind === \"payment-receipt\") return { number: view.receipt!.receipt_no, frozen: true };\n  if (kind === \"gate-pass\") return { number: view.gate_pass!.gate_pass_no, frozen: true };\n  return { number: view.job.job_no, frozen: false };\n}",
    "parameters": [
      {
        "name": "kind",
        "type": "DocumentKind",
        "optional": false
      },
      {
        "name": "view",
        "type": "JobView",
        "optional": false
      }
    ],
    "returnType": "{ number: string; frozen: boolean } | undefined",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "{ number: string; frozen: boolean; } | undefined"
  },
  {
    "id": "OP-job-documents-resolveJobDocuments",
    "name": "resolveJobDocuments",
    "file": "src/job-documents.ts",
    "span": "src/job-documents.ts:71-83",
    "calls": [
      "documentInfo",
      "rows.push",
      "missingReason",
      "snapshots.filter"
    ],
    "sql": [],
    "body": "export function resolveJobDocuments(view: JobView, snapshots: readonly DocumentSnapshot[] = []): JobDocumentDescriptor[] {\n  const rows: JobDocumentDescriptor[] = [{ kind: \"job-card\", label: labels[\"job-card\"], available: true, expected: true, state: \"ready\", number: view.job.job_no }];\n  for (const kind of SLOT_KINDS) {\n    const info = documentInfo(kind, view);\n    rows.push(info\n      ? { kind, label: labels[kind], available: true, expected: true, state: info.frozen ? \"frozen\" : \"ready\", number: info.number }\n      : { kind, label: labels[kind], available: false, expected: true, state: \"missing\", message: missingReason(kind, view) });\n  }\n  for (const snap of snapshots.filter((item) => item.jobId === view.job.id && item.jobNo === view.job.job_no && item.state === \"void\")) {\n    rows.push({ kind: snap.kind, label: labels[snap.kind], available: true, expected: false, state: \"void\", number: snap.number, snapshotId: snap.id, message: `${labels[snap.kind]} ${snap.number} - void` });\n  }\n  return rows;\n}",
    "parameters": [
      {
        "name": "view",
        "type": "JobView",
        "optional": false
      },
      {
        "name": "snapshots",
        "type": "readonly DocumentSnapshot[]",
        "optional": true,
        "default": "[]"
      }
    ],
    "returnType": "JobDocumentDescriptor[]",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "jobs/estimates; TX-02/11/12",
    "resolvedReturnType": "JobDocumentDescriptor[]"
  },
  {
    "id": "OP-job-documents-documentFilename",
    "name": "documentFilename",
    "file": "src/job-documents.ts",
    "span": "src/job-documents.ts:85-88",
    "calls": [
      "view.job.job_no.trim().replace(/[^a-z0-9-]+/gi, \"-\").replace",
      "view.job.job_no.trim().replace",
      "view.job.job_no.trim"
    ],
    "sql": [],
    "body": "export function documentFilename(view: JobView, kind: DocumentKind) {\n  const stem = view.job.job_no.trim().replace(/[^a-z0-9-]+/gi, \"-\").replace(/^-|-$/g, \"\") || \"job\";\n  return `${stem}-${kind}.pdf`;\n}",
    "parameters": [
      {
        "name": "view",
        "type": "JobView",
        "optional": false
      },
      {
        "name": "kind",
        "type": "DocumentKind",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "string"
  },
  {
    "id": "OP-job-documents-withDamageDiagram",
    "name": "withDamageDiagram",
    "file": "src/job-documents.ts",
    "span": "src/job-documents.ts:95-102",
    "calls": [
      "DAMAGE_PLACEHOLDER.test",
      "template.html.replace",
      "template.html.lastIndexOf",
      "template.html.slice"
    ],
    "sql": [],
    "body": "export function withDamageDiagram<T extends { html: string }>(template: T): T {\n  if (DAMAGE_PLACEHOLDER.test(template.html)) return template;\n  const block = \"<h3>Vehicle damage</h3>{{blocks.damage_diagram}}\";\n  const html = template.html.replace(/{{\\s*blocks\\.tasks\\s*}}/, (m) => `${block}${m}`);\n  if (html !== template.html) return { ...template, html };\n  const close = template.html.lastIndexOf(\"</main>\");\n  return { ...template, html: close >= 0 ? template.html.slice(0, close) + block + template.html.slice(close) : template.html + block };\n}",
    "parameters": [
      {
        "name": "template",
        "type": "T",
        "optional": false
      }
    ],
    "returnType": "T",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "T"
  },
  {
    "id": "OP-job-documents-renderLive",
    "name": "renderLive",
    "file": "src/job-documents.ts",
    "span": "src/job-documents.ts:104-113",
    "calls": [
      "adminState.reportTemplates.find",
      "buildReportValues",
      "withDamageDiagram",
      "renderReportTemplate",
      "buildReportLines",
      "html.replace",
      "staticDamageDiagramHtml",
      "parseDamageMarks"
    ],
    "sql": [],
    "body": "export function renderLive(kind: DocumentKind, view: JobView, adminState: Pick<AdminDemoState, \"reportTemplates\" | \"businessSettings\" | \"companyAssets\">): string {\n  const category = kind as ReportCategory;\n  const template = adminState.reportTemplates.find((candidate) => candidate.category === category && candidate.active);\n  if (!template) throw new Error(`No active ${labels[kind]} template is configured.`);\n  const values = buildReportValues(category, view, adminState.businessSettings, adminState.companyAssets);\n  // Templates saved before {{blocks.damage_diagram}} existed lack it; the Job Card sheet always embeds the diagram.\n  const source = kind === \"job-card\" ? withDamageDiagram(template) : template;\n  const html = renderReportTemplate(source, values, buildReportLines(category, view));\n  return kind === \"job-card\" ? html.replace(DAMAGE_SLOT, staticDamageDiagramHtml(parseDamageMarks(view.job.damage_marks))) : html;\n}",
    "parameters": [
      {
        "name": "kind",
        "type": "DocumentKind",
        "optional": false
      },
      {
        "name": "view",
        "type": "JobView",
        "optional": false
      },
      {
        "name": "adminState",
        "type": "Pick<AdminDemoState, \"reportTemplates\" | \"businessSettings\" | \"companyAssets\">",
        "optional": false
      }
    ],
    "returnType": "string",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "string"
  },
  {
    "id": "OP-job-documents-renderJobDocument",
    "name": "renderJobDocument",
    "file": "src/job-documents.ts",
    "span": "src/job-documents.ts:116-123",
    "calls": [
      "documentInfo",
      "snapshots.find",
      "documentFilename",
      "renderLive"
    ],
    "sql": [],
    "body": "export function renderJobDocument(kind: DocumentKind, view: JobView, adminState: Pick<AdminDemoState, \"reportTemplates\" | \"businessSettings\" | \"companyAssets\">, snapshots: readonly DocumentSnapshot[] = []): RenderedDocument {\n  const info = documentInfo(kind, view);\n  if (!info) throw new Error(`${labels[kind]} is not available for this job.`);\n  const snap = !info.frozen ? undefined : snapshots.find((item) => item.jobId === view.job.id && item.jobNo === view.job.job_no && item.kind === kind && item.number === info.number && item.state === \"frozen\");\n  const filename = documentFilename(view, kind);\n  if (snap) return { html: snap.html, title: `${labels[kind]} ${snap.number}`, number: snap.number, filename, frozen: true };\n  return { html: renderLive(kind, view, adminState), title: `${labels[kind]} ${info.number}`, number: info.number, filename, frozen: false };\n}",
    "parameters": [
      {
        "name": "kind",
        "type": "DocumentKind",
        "optional": false
      },
      {
        "name": "view",
        "type": "JobView",
        "optional": false
      },
      {
        "name": "adminState",
        "type": "Pick<AdminDemoState, \"reportTemplates\" | \"businessSettings\" | \"companyAssets\">",
        "optional": false
      },
      {
        "name": "snapshots",
        "type": "readonly DocumentSnapshot[]",
        "optional": true,
        "default": "[]"
      }
    ],
    "returnType": "RenderedDocument",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "jobs/estimates; TX-02/11/12",
    "resolvedReturnType": "RenderedDocument"
  },
  {
    "id": "OP-job-documents-renderSnapshotDocument",
    "name": "renderSnapshotDocument",
    "file": "src/job-documents.ts",
    "span": "src/job-documents.ts:125-128",
    "calls": [
      "snap.jobNo.trim().replace(/[^a-z0-9-]+/gi, \"-\").replace",
      "snap.jobNo.trim().replace",
      "snap.jobNo.trim"
    ],
    "sql": [],
    "body": "export function renderSnapshotDocument(snap: DocumentSnapshot): RenderedDocument {\n  const stem = snap.jobNo.trim().replace(/[^a-z0-9-]+/gi, \"-\").replace(/^-|-$/g, \"\") || \"job\";\n  return { html: snap.html, title: `${labels[snap.kind]} ${snap.number} (void)`, number: snap.number, filename: `${stem}-${snap.kind}-${snap.number}-void.pdf`, frozen: true };\n}",
    "parameters": [
      {
        "name": "snap",
        "type": "DocumentSnapshot",
        "optional": false
      }
    ],
    "returnType": "RenderedDocument",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "RenderedDocument"
  },
  {
    "id": "OP-job-documents-printRenderedDocument",
    "name": "printRenderedDocument",
    "file": "src/job-documents.ts",
    "span": "src/job-documents.ts:133-148",
    "calls": [
      "window.open",
      "printWindow.document.open",
      "printWindow.document.write",
      "buildPrintDocument",
      "printWindow.document.close",
      "printWindow.focus",
      "printWindow.setTimeout",
      "printWindow.print",
      "printWindow.close"
    ],
    "sql": [],
    "body": "export function printRenderedDocument(doc: Pick<RenderedDocument, \"html\" | \"title\">): PrintJobDocumentResult {\n  const printWindow = window.open(\"\", \"_blank\", \"width=900,height=720\");\n  if (!printWindow) return { ok: false, error: \"Pop-up blocked. Allow pop-ups for WorkshopOS, then try Print again.\" };\n  try {\n    printWindow.opener = null;\n    printWindow.document.open();\n    printWindow.document.write(buildPrintDocument(doc.title, doc.html));\n    printWindow.document.close();\n    printWindow.focus();\n    printWindow.setTimeout(() => printWindow.print(), 100);\n    return { ok: true };\n  } catch (error) {\n    printWindow.close();\n    return { ok: false, error: error instanceof Error ? error.message : \"The report could not be rendered.\" };\n  }\n}",
    "parameters": [
      {
        "name": "doc",
        "type": "Pick<RenderedDocument, \"html\" | \"title\">",
        "optional": false
      }
    ],
    "returnType": "PrintJobDocumentResult",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "PrintJobDocumentResult"
  },
  {
    "id": "OP-job-media-validateMediaDataUrl",
    "name": "validateMediaDataUrl",
    "file": "src/job-media.ts",
    "span": "src/job-media.ts:20-29",
    "calls": [
      "/^data:([^;,]+);base64,([A-Za-z0-9+/=]+)$/.exec",
      "match[1].toLowerCase",
      "ACCEPTED_MEDIA_MIME_TYPES.includes",
      "decodedBytes",
      "signatures[mimeType as keyof typeof signatures]"
    ],
    "sql": [],
    "body": "export function validateMediaDataUrl(src: string) {\n  const match = /^data:([^;,]+);base64,([A-Za-z0-9+/=]+)$/.exec(src);\n  if (!match) throw new Error(\"Media must be a compressed image data URL.\");\n  const mimeType = match[1].toLowerCase();\n  if (!ACCEPTED_MEDIA_MIME_TYPES.includes(mimeType as (typeof ACCEPTED_MEDIA_MIME_TYPES)[number])) throw new Error(\"Only JPEG, PNG, or WebP images are accepted.\");\n  const bytes = decodedBytes(match[2]);\n  if (bytes.byteLength > MAX_MEDIA_DATA_URL_BYTES) throw new Error(\"The compressed image is too large.\");\n  if (!signatures[mimeType as keyof typeof signatures](bytes)) throw new Error(\"The image content does not match its MIME type.\");\n  return { mimeType, byteSize: bytes.byteLength };\n}",
    "parameters": [
      {
        "name": "src",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "{ mimeType: string; byteSize: number; }"
  },
  {
    "id": "OP-job-media-validateMediaFile",
    "name": "validateMediaFile",
    "file": "src/job-media.ts",
    "span": "src/job-media.ts:31-37",
    "calls": [
      "ACCEPTED_MEDIA_MIME_TYPES.includes",
      "file.slice(0, 16).arrayBuffer",
      "file.slice",
      "signatures[file.type as keyof typeof signatures]"
    ],
    "sql": [],
    "body": "export async function validateMediaFile(file: File) {\n  if (!ACCEPTED_MEDIA_MIME_TYPES.includes(file.type as (typeof ACCEPTED_MEDIA_MIME_TYPES)[number])) throw new Error(\"Choose a JPEG, PNG, or WebP image.\");\n  if (file.size <= 0) throw new Error(\"The selected image is empty.\");\n  if (file.size > MAX_MEDIA_FILE_BYTES) throw new Error(\"Images must be 10 MB or smaller.\");\n  const header = new Uint8Array(await file.slice(0, 16).arrayBuffer());\n  if (!signatures[file.type as keyof typeof signatures](header)) throw new Error(\"The image content does not match its MIME type.\");\n}",
    "parameters": [
      {
        "name": "file",
        "type": "File",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "Promise<void>"
  },
  {
    "id": "OP-job-media-compressMediaFile",
    "name": "compressMediaFile",
    "file": "src/job-media.ts",
    "span": "src/job-media.ts:48-80",
    "calls": [
      "validateMediaFile",
      "createImageBitmap",
      "Math.min",
      "Math.max",
      "Math.round",
      "document.createElement",
      "canvas.getContext",
      "context.drawImage",
      "canvas.toDataURL",
      "validateMediaDataUrl",
      "error.message.includes",
      "bitmap.close"
    ],
    "sql": [],
    "body": "export async function compressMediaFile(file: File): Promise<PreparedJobMedia> {\n  await validateMediaFile(file);\n  const bitmap = await createImageBitmap(file);\n  let scale = Math.min(1, MAX_MEDIA_DIMENSION / Math.max(bitmap.width, bitmap.height));\n  let quality = 0.86;\n  let src = \"\";\n  let width = 0;\n  let height = 0;\n  try {\n    for (let attempt = 0; attempt < 8; attempt += 1) {\n      width = Math.max(1, Math.round(bitmap.width * scale));\n      height = Math.max(1, Math.round(bitmap.height * scale));\n      const canvas = document.createElement(\"canvas\");\n      canvas.width = width;\n      canvas.height = height;\n      const context = canvas.getContext(\"2d\");\n      if (!context) throw new Error(\"Image compression is unavailable in this browser.\");\n      context.drawImage(bitmap, 0, 0, width, height);\n      src = canvas.toDataURL(\"image/jpeg\", quality);\n      try {\n        const validated = validateMediaDataUrl(src);\n        return { src, ...validated, originalName: file.name, width, height };\n      } catch (error) {\n        if (!(error instanceof Error) || !error.message.includes(\"too large\")) throw error;\n      }\n      quality = Math.max(0.5, quality - 0.08);\n      scale *= 0.78;\n    }\n  } finally {\n    bitmap.close();\n  }\n  throw new Error(\"This image could not be compressed below 1 MB. Choose a smaller image.\");\n}",
    "parameters": [
      {
        "name": "file",
        "type": "File",
        "optional": false
      }
    ],
    "returnType": "Promise<PreparedJobMedia>",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "Promise<PreparedJobMedia>"
  },
  {
    "id": "OP-job-sheet-parseDamageMarks",
    "name": "parseDamageMarks",
    "file": "src/job-sheet.ts",
    "span": "src/job-sheet.ts:27-38",
    "calls": [
      "JSON.parse",
      "Array.isArray",
      "parsed\n      .filter((item): item is DamageMark => !!item && typeof item.id === \"number\" && Number.isFinite(item.x) && Number.isFinite(item.y))\n      .map",
      "parsed\n      .filter",
      "Number.isFinite",
      "legacyMarkToUnified",
      "clamp",
      "isBodyView"
    ],
    "sql": [],
    "body": "export function parseDamageMarks(raw: string | null | undefined): DamageMark[] {\n  if (!raw) return [];\n  try {\n    const parsed: unknown = JSON.parse(raw);\n    if (!Array.isArray(parsed)) return [];\n    return parsed\n      .filter((item): item is DamageMark => !!item && typeof item.id === \"number\" && Number.isFinite(item.x) && Number.isFinite(item.y))\n      .map((item) => legacyMarkToUnified({ id: item.id, x: clamp(item.x), y: clamp(item.y), ...(isBodyView(item.view) ? { view: item.view } : {}) }));\n  } catch {\n    return [];\n  }\n}",
    "parameters": [
      {
        "name": "raw",
        "type": "string | null | undefined",
        "optional": false
      }
    ],
    "returnType": "DamageMark[]",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "DamageMark[]"
  },
  {
    "id": "OP-job-sheet-serializeDamageMarks",
    "name": "serializeDamageMarks",
    "file": "src/job-sheet.ts",
    "span": "src/job-sheet.ts:40-44",
    "calls": [
      "JSON.stringify",
      "marks.map",
      "clamp"
    ],
    "sql": [],
    "body": "export function serializeDamageMarks(marks: DamageMark[]): string {\n  // New saves are always positions on the combined vehicle sheet. `parseDamageMarks`\n  // maps historical four-panel marks before they reach this point.\n  return JSON.stringify(marks.map((mark) => ({ id: mark.id, x: clamp(mark.x), y: clamp(mark.y) })));\n}",
    "parameters": [
      {
        "name": "marks",
        "type": "DamageMark[]",
        "optional": false
      }
    ],
    "returnType": "string",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "string"
  },
  {
    "id": "OP-job-sheet-legacyMarkToUnified",
    "name": "legacyMarkToUnified",
    "file": "src/job-sheet.ts",
    "span": "src/job-sheet.ts:47-52",
    "calls": [
      "clamp"
    ],
    "sql": [],
    "body": "export function legacyMarkToUnified(mark: DamageMark): DamageMark {\n  if (!mark.view) return { id: mark.id, x: clamp(mark.x), y: clamp(mark.y) };\n  const origins: Record<BodyView, [number, number]> = { LF: [8, 8], RF: [54, 8], LR: [8, 54], RR: [54, 54] };\n  const [left, top] = origins[mark.view];\n  return { id: mark.id, x: clamp(left + mark.x * .38), y: clamp(top + mark.y * .38) };\n}",
    "parameters": [
      {
        "name": "mark",
        "type": "DamageMark",
        "optional": false
      }
    ],
    "returnType": "DamageMark",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "DamageMark"
  },
  {
    "id": "OP-job-sheet-addDamageMark",
    "name": "addDamageMark",
    "file": "src/job-sheet.ts",
    "span": "src/job-sheet.ts:54-57",
    "calls": [
      "marks.reduce",
      "Math.max",
      "clamp"
    ],
    "sql": [],
    "body": "export function addDamageMark(marks: DamageMark[], x: number, y: number, view?: BodyView): DamageMark[] {\n  const id = marks.reduce((max, mark) => Math.max(max, mark.id), 0) + 1;\n  return [...marks, { id, x: clamp(x), y: clamp(y), ...(view ? { view } : {}) }];\n}",
    "parameters": [
      {
        "name": "marks",
        "type": "DamageMark[]",
        "optional": false
      },
      {
        "name": "x",
        "type": "number",
        "optional": false
      },
      {
        "name": "y",
        "type": "number",
        "optional": false
      },
      {
        "name": "view",
        "type": "BodyView",
        "optional": true
      }
    ],
    "returnType": "DamageMark[]",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "DamageMark[]"
  },
  {
    "id": "OP-job-sheet-removeDamageMark",
    "name": "removeDamageMark",
    "file": "src/job-sheet.ts",
    "span": "src/job-sheet.ts:59-61",
    "calls": [
      "marks.filter"
    ],
    "sql": [],
    "body": "export function removeDamageMark(marks: DamageMark[], id: number): DamageMark[] {\n  return marks.filter((mark) => mark.id !== id);\n}",
    "parameters": [
      {
        "name": "marks",
        "type": "DamageMark[]",
        "optional": false
      },
      {
        "name": "id",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "DamageMark[]",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "DamageMark[]"
  },
  {
    "id": "OP-job-sheet-bodyPanelShapes",
    "name": "bodyPanelShapes",
    "file": "src/job-sheet.ts",
    "span": "src/job-sheet.ts:69-86",
    "calls": [],
    "sql": [],
    "body": "export function bodyPanelShapes(view: BodyView): string {\n  const front = view === \"LF\" || view === \"RR\";\n  // \"front\" = the panel shows the front half of the car; the fender sits toward the car's nose.\n  const facingLeft = view === \"LF\" || view === \"LR\";\n  const noseLeft = facingLeft; // left side viewed from the left: nose points left\n  const fenderOnLeft = front ? noseLeft : !noseLeft;\n  const doorX = fenderOnLeft ? 44 : 12;\n  const fenderX = fenderOnLeft ? 8 : 92;\n  const fenderW = fenderOnLeft ? 34 : 20;\n  const wheelX = fenderOnLeft ? 26 : 102;\n  const lamp = front ? `<rect x=\"${fenderOnLeft ? 8 : 108}\" y=\"34\" width=\"4\" height=\"10\" rx=\"2\" fill=\"#f5d76e\" stroke=\"#9aa5b1\"/>` : `<rect x=\"${fenderOnLeft ? 8 : 108}\" y=\"34\" width=\"4\" height=\"10\" rx=\"2\" fill=\"#e07a7a\" stroke=\"#9aa5b1\"/>`;\n  return `<rect x=\"8\" y=\"12\" width=\"104\" height=\"52\" rx=\"8\" fill=\"#f3f5f8\" stroke=\"#7b8794\" stroke-width=\"1.5\"/>`\n    + `<rect x=\"${fenderX}\" y=\"14\" width=\"${fenderW}\" height=\"48\" rx=\"4\" fill=\"none\" stroke=\"#c3cad3\"/>`\n    + `<rect x=\"${doorX}\" y=\"14\" width=\"64\" height=\"48\" rx=\"5\" fill=\"none\" stroke=\"#9aa5b1\"/>`\n    + `<rect x=\"${doorX + 6}\" y=\"18\" width=\"52\" height=\"16\" rx=\"3\" fill=\"#dfe6ee\" stroke=\"#9aa5b1\"/>`\n    + `<rect x=\"${doorX + (fenderOnLeft ? 44 : 6)}\" y=\"40\" width=\"14\" height=\"4\" rx=\"2\" fill=\"#c3cad3\"/>`\n    + `<circle cx=\"${wheelX}\" cy=\"66\" r=\"10\" fill=\"#4b5563\" stroke=\"#1f2937\"/><circle cx=\"${wheelX}\" cy=\"66\" r=\"4\" fill=\"#d1d5db\"/>${lamp}`;\n}",
    "parameters": [
      {
        "name": "view",
        "type": "BodyView",
        "optional": false
      }
    ],
    "returnType": "string",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "string"
  },
  {
    "id": "OP-job-sheet-staticBodyMarksSvg",
    "name": "staticBodyMarksSvg",
    "file": "src/job-sheet.ts",
    "span": "src/job-sheet.ts:89-95",
    "calls": [
      "BODY_VIEWS.map",
      "marks.filter((mark) => mark.view === item.key).map((mark) => `<g transform=\"translate(${mark.x * 1.2} ${mark.y * 0.8})\"><circle r=\"5\" fill=\"#d64545\" stroke=\"#fff\" stroke-width=\"1\"/><text text-anchor=\"middle\" dy=\"2.5\" font-size=\"6\" font-weight=\"700\" font-family=\"Arial,sans-serif\" fill=\"#fff\">${mark.id}</text></g>`).join",
      "marks.filter((mark) => mark.view === item.key).map",
      "marks.filter",
      "bodyPanelShapes",
      "panels.join"
    ],
    "sql": [],
    "body": "export function staticBodyMarksSvg(marks: DamageMark[]): string {\n  const panels = BODY_VIEWS.map((item) => {\n    const dots = marks.filter((mark) => mark.view === item.key).map((mark) => `<g transform=\"translate(${mark.x * 1.2} ${mark.y * 0.8})\"><circle r=\"5\" fill=\"#d64545\" stroke=\"#fff\" stroke-width=\"1\"/><text text-anchor=\"middle\" dy=\"2.5\" font-size=\"6\" font-weight=\"700\" font-family=\"Arial,sans-serif\" fill=\"#fff\">${mark.id}</text></g>`).join(\"\");\n    return `<div style=\"width:170px\"><div style=\"font:600 11px Arial,sans-serif;margin-bottom:2px\">${item.label}</div><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 120 80\" width=\"170\" height=\"113\" role=\"img\" aria-label=\"${item.label} body panel\">${bodyPanelShapes(item.key)}${dots}</svg></div>`;\n  });\n  return `<div style=\"display:grid;grid-template-columns:repeat(2,170px);gap:8px\">${panels.join(\"\")}</div>`;\n}",
    "parameters": [
      {
        "name": "marks",
        "type": "DamageMark[]",
        "optional": false
      }
    ],
    "returnType": "string",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "string"
  },
  {
    "id": "OP-job-sheet-staticDamageDiagramHtml",
    "name": "staticDamageDiagramHtml",
    "file": "src/job-sheet.ts",
    "span": "src/job-sheet.ts:98-102",
    "calls": [
      "allMarks.map",
      "marks.map((mark) => `<span aria-label=\"Damage mark ${mark.id}\" style=\"position:absolute;left:${mark.x}%;top:${mark.y}%;transform:translate(-50%,-50%);display:flex;width:20px;height:20px;align-items:center;justify-content:center;border:1px solid #fff;border-radius:50%;background:#dc3545;color:#fff;font:700 10px Arial,sans-serif;line-height:1;box-shadow:0 1px 3px rgba(0,0,0,.3)\">${mark.id}</span>`).join",
      "marks.map"
    ],
    "sql": [],
    "body": "export function staticDamageDiagramHtml(allMarks: DamageMark[]): string {\n  const marks = allMarks.map(legacyMarkToUnified);\n  const dots = marks.map((mark) => `<span aria-label=\"Damage mark ${mark.id}\" style=\"position:absolute;left:${mark.x}%;top:${mark.y}%;transform:translate(-50%,-50%);display:flex;width:20px;height:20px;align-items:center;justify-content:center;border:1px solid #fff;border-radius:50%;background:#dc3545;color:#fff;font:700 10px Arial,sans-serif;line-height:1;box-shadow:0 1px 3px rgba(0,0,0,.3)\">${mark.id}</span>`).join(\"\");\n  return `<div style=\"width:220px;max-width:100%\"><div style=\"position:relative;width:100%;line-height:0\"><img src=\"${DAMAGE_DIAGRAM_ASSET}\" alt=\"Vehicle damage diagram\" style=\"display:block;width:100%;height:auto\"/>${dots}</div><p style=\"margin:4px 0 0;font:11px Arial,sans-serif\">${marks.length} damage mark${marks.length === 1 ? \"\" : \"s\"} recorded</p></div>`;\n}",
    "parameters": [
      {
        "name": "allMarks",
        "type": "DamageMark[]",
        "optional": false
      }
    ],
    "returnType": "string",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "string"
  },
  {
    "id": "OP-list-utils-normalizeSearch",
    "name": "normalizeSearch",
    "file": "src/list-utils.ts",
    "span": "src/list-utils.ts:6-8",
    "calls": [
      "value.trim().toLocaleLowerCase",
      "value.trim"
    ],
    "sql": [],
    "body": "export function normalizeSearch(value: string) {\n  return value.trim().toLocaleLowerCase();\n}",
    "parameters": [
      {
        "name": "value",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "string"
  },
  {
    "id": "OP-list-utils-clampPage",
    "name": "clampPage",
    "file": "src/list-utils.ts",
    "span": "src/list-utils.ts:10-13",
    "calls": [
      "Math.max",
      "Math.ceil",
      "Math.min"
    ],
    "sql": [],
    "body": "export function clampPage(page: number, totalCount: number, pageSize: number) {\n  const pageCount = Math.max(1, Math.ceil(totalCount / Math.max(1, pageSize)));\n  return Math.min(Math.max(1, page), pageCount);\n}",
    "parameters": [
      {
        "name": "page",
        "type": "number",
        "optional": false
      },
      {
        "name": "totalCount",
        "type": "number",
        "optional": false
      },
      {
        "name": "pageSize",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-list-utils-paginate",
    "name": "paginate",
    "file": "src/list-utils.ts",
    "span": "src/list-utils.ts:15-28",
    "calls": [
      "Math.max",
      "clampPage",
      "items.slice",
      "Math.ceil"
    ],
    "sql": [],
    "body": "export function paginate<T>(items: T[], requestedPage: number, pageSize: number): PagedResult<T> {\n  const safeSize = Math.max(1, pageSize);\n  const page = clampPage(requestedPage, items.length, safeSize);\n  const start = (page - 1) * safeSize;\n  const visible = items.slice(start, start + safeSize);\n  return {\n    items: visible,\n    totalCount: items.length,\n    pageCount: Math.max(1, Math.ceil(items.length / safeSize)),\n    page,\n    from: items.length === 0 ? 0 : start + 1,\n    to: items.length === 0 ? 0 : start + visible.length,\n  };\n}",
    "parameters": [
      {
        "name": "items",
        "type": "T[]",
        "optional": false
      },
      {
        "name": "requestedPage",
        "type": "number",
        "optional": false
      },
      {
        "name": "pageSize",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "PagedResult<T>",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "PagedResult<T>"
  },
  {
    "id": "OP-list-utils-pageNumbers",
    "name": "pageNumbers",
    "file": "src/list-utils.ts",
    "span": "src/list-utils.ts:30-47",
    "calls": [
      "Math.max",
      "Math.min",
      "Array.from"
    ],
    "sql": [],
    "body": "export function pageNumbers(page: number, pageCount: number) {\n  const safePageCount = Math.max(1, pageCount);\n  const currentPage = Math.min(Math.max(1, page), safePageCount);\n\n  if (safePageCount <= 7) {\n    return Array.from({ length: safePageCount }, (_, index) => index + 1);\n  }\n\n  if (currentPage <= 4) {\n    return [1, 2, 3, 4, 5, \"ellipsis\", safePageCount] as const;\n  }\n\n  if (currentPage >= safePageCount - 3) {\n    return [1, \"ellipsis\", ...Array.from({ length: 5 }, (_, index) => safePageCount - 4 + index)] as const;\n  }\n\n  return [1, \"ellipsis\", currentPage - 1, currentPage, currentPage + 1, \"ellipsis\", safePageCount] as const;\n}",
    "parameters": [
      {
        "name": "page",
        "type": "number",
        "optional": false
      },
      {
        "name": "pageCount",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "number[] | readonly [1, 2, 3, 4, 5, \"ellipsis\", number] | readonly [1, \"ellipsis\", ...number[]] | readonly [1, \"ellipsis\", number, number, number, \"ellipsis\", number]"
  },
  {
    "id": "OP-list-utils-activeFilterSummary",
    "name": "activeFilterSummary",
    "file": "src/list-utils.ts",
    "span": "src/list-utils.ts:49-53",
    "calls": [
      "Object.entries(filters)\n    .filter(([, value]) => !ignoredValues.includes(value))\n    .map",
      "Object.entries(filters)\n    .filter",
      "Object.entries",
      "ignoredValues.includes"
    ],
    "sql": [],
    "body": "export function activeFilterSummary(filters: Record<string, string>, ignoredValues = [\"\", \"ALL\"]) {\n  return Object.entries(filters)\n    .filter(([, value]) => !ignoredValues.includes(value))\n    .map(([label, value]) => `${label}: ${value}`);\n}",
    "parameters": [
      {
        "name": "filters",
        "type": "Record<string, string>",
        "optional": false
      },
      {
        "name": "ignoredValues",
        "type": "INFERRED",
        "optional": true,
        "default": "[\"\", \"ALL\"]"
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "string[]"
  },
  {
    "id": "OP-list-utils-applyFilterDraft",
    "name": "applyFilterDraft",
    "file": "src/list-utils.ts",
    "span": "src/list-utils.ts:61-63",
    "calls": [],
    "sql": [],
    "body": "export function applyFilterDraft<T>({ draft }: FilterDraftState<T>): FilterDraftState<T> {\n  return { draft, applied: draft, page: 1 };\n}",
    "parameters": [
      {
        "name": "{ draft }",
        "type": "FilterDraftState<T>",
        "optional": false
      }
    ],
    "returnType": "FilterDraftState<T>",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "FilterDraftState<T>"
  },
  {
    "id": "OP-list-utils-clearFilterDraft",
    "name": "clearFilterDraft",
    "file": "src/list-utils.ts",
    "span": "src/list-utils.ts:65-67",
    "calls": [],
    "sql": [],
    "body": "export function clearFilterDraft<T>(_state: FilterDraftState<T>, empty: T): FilterDraftState<T> {\n  return { draft: empty, applied: empty, page: 1 };\n}",
    "parameters": [
      {
        "name": "_state",
        "type": "FilterDraftState<T>",
        "optional": false
      },
      {
        "name": "empty",
        "type": "T",
        "optional": false
      }
    ],
    "returnType": "FilterDraftState<T>",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "FilterDraftState<T>"
  },
  {
    "id": "OP-materials-canManageMaterialRows",
    "name": "canManageMaterialRows",
    "file": "src/materials.ts",
    "span": "src/materials.ts:10-13",
    "calls": [],
    "sql": [],
    "body": "export function canManageMaterialRows(actor: Pick<User, \"id\" | \"role\">, job: { advisor_id: number; main_status: MainStatus; materialApprovalStatus?: \"Pending\" | \"Approved\" | \"Rejected\" }) {\n  const linkedAdvisor = actor.role === \"service\" && actor.id === job.advisor_id;\n  return (actor.role === \"admin\" || linkedAdvisor) && (job.main_status === \"IN_PROGRESS\" || (linkedAdvisor && job.main_status === \"HOLD\" && job.materialApprovalStatus === \"Rejected\"));\n}",
    "parameters": [
      {
        "name": "actor",
        "type": "Pick<User, \"id\" | \"role\">",
        "optional": false
      },
      {
        "name": "job",
        "type": "{ advisor_id: number; main_status: MainStatus; materialApprovalStatus?: \"Pending\" | \"Approved\" | \"Rejected\" }",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "materials/inventory; TX-06/07/10",
    "resolvedReturnType": "boolean"
  },
  {
    "id": "OP-materials-materialRowStatus",
    "name": "materialRowStatus",
    "file": "src/materials.ts",
    "span": "src/materials.ts:15-17",
    "calls": [],
    "sql": [],
    "body": "export function materialRowStatus(row: Pick<MaterialRequest, \"status\">): MaterialRowStatus {\n  return (row.status ?? \"Requested\") as MaterialRowStatus;\n}",
    "parameters": [
      {
        "name": "row",
        "type": "Pick<MaterialRequest, \"status\">",
        "optional": false
      }
    ],
    "returnType": "MaterialRowStatus",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "MaterialRowStatus"
  },
  {
    "id": "OP-materials-materialRowActions",
    "name": "materialRowActions",
    "file": "src/materials.ts",
    "span": "src/materials.ts:20-28",
    "calls": [
      "materialRowStatus"
    ],
    "sql": [],
    "body": "export function materialRowActions(row: Pick<MaterialRequest, \"status\" | \"invoiced_in\">): MaterialRowAction[] {\n  if (row.invoiced_in) return [];\n  switch (materialRowStatus(row)) {\n    case \"Draft\": return [\"edit\", \"request\", \"delete\"];\n    case \"Requested\":\n    case \"Re-requested\": return [\"re-request\", \"cancel\"];\n    default: return [];\n  }\n}",
    "parameters": [
      {
        "name": "row",
        "type": "Pick<MaterialRequest, \"status\" | \"invoiced_in\">",
        "optional": false
      }
    ],
    "returnType": "MaterialRowAction[]",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "MaterialRowAction[]"
  },
  {
    "id": "OP-materials-stockOnHand",
    "name": "stockOnHand",
    "file": "src/materials.ts",
    "span": "src/materials.ts:30-32",
    "calls": [],
    "sql": [],
    "body": "export function stockOnHand(item: Pick<InventoryItem, \"stock_qty\"> | undefined) {\n  return item ? item.stock_qty : 0;\n}",
    "parameters": [
      {
        "name": "item",
        "type": "Pick<InventoryItem, \"stock_qty\"> | undefined",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "number"
  },
  {
    "id": "OP-materials-overStockWarning",
    "name": "overStockWarning",
    "file": "src/materials.ts",
    "span": "src/materials.ts:35-37",
    "calls": [],
    "sql": [],
    "body": "export function overStockWarning(qty: number, onHand: number): string | undefined {\n  return qty > onHand ? `Requested ${qty} is more than the ${onHand} in stock.` : undefined;\n}",
    "parameters": [
      {
        "name": "qty",
        "type": "number",
        "optional": false
      },
      {
        "name": "onHand",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "string | undefined",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "string | undefined"
  },
  {
    "id": "OP-materials-triageMaterialDemand",
    "name": "triageMaterialDemand",
    "file": "src/materials.ts",
    "span": "src/materials.ts:57-66",
    "calls": [
      "Math.max",
      "stockOnHand"
    ],
    "sql": [],
    "body": "export function triageMaterialDemand(\n  row: Pick<MaterialRequest, \"requested_qty\" | \"issued_qty\">,\n  item: Pick<InventoryItem, \"stock_qty\"> | undefined,\n  alreadyAllocated = 0,\n): MaterialDemandTriage {\n  const outstanding = Math.max(0, row.requested_qty - row.issued_qty);\n  return Math.max(0, stockOnHand(item) - alreadyAllocated) >= outstanding\n    ? \"issuable\"\n    : \"procurement\";\n}",
    "parameters": [
      {
        "name": "row",
        "type": "Pick<MaterialRequest, \"requested_qty\" | \"issued_qty\">",
        "optional": false
      },
      {
        "name": "item",
        "type": "Pick<InventoryItem, \"stock_qty\"> | undefined",
        "optional": false
      },
      {
        "name": "alreadyAllocated",
        "type": "INFERRED",
        "optional": true,
        "default": "0"
      }
    ],
    "returnType": "MaterialDemandTriage",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "materials/inventory; TX-06/07/10",
    "resolvedReturnType": "MaterialDemandTriage"
  },
  {
    "id": "OP-materials-triageMaterialDemands",
    "name": "triageMaterialDemands",
    "file": "src/materials.ts",
    "span": "src/materials.ts:73-78",
    "calls": [
      "allocateMaterialDemands(demands, inventory).map",
      "allocateMaterialDemands"
    ],
    "sql": [],
    "body": "export function triageMaterialDemands(\n  demands: readonly MaterialDemand[],\n  inventory: readonly Pick<InventoryItem, \"id\" | \"stock_qty\">[],\n) {\n  return allocateMaterialDemands(demands, inventory).map(({ outcome }) => outcome);\n}",
    "parameters": [
      {
        "name": "demands",
        "type": "readonly MaterialDemand[]",
        "optional": false
      },
      {
        "name": "inventory",
        "type": "readonly Pick<InventoryItem, \"id\" | \"stock_qty\">[]",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "materials/inventory; TX-06/07/10",
    "resolvedReturnType": "MaterialDemandTriage[]"
  },
  {
    "id": "OP-materials-allocateMaterialDemands",
    "name": "allocateMaterialDemands",
    "file": "src/materials.ts",
    "span": "src/materials.ts:84-101",
    "calls": [
      "inventory.map",
      "demands.map",
      "allocatedByItem.get",
      "Math.max",
      "stockOnHand",
      "inventoryById.get",
      "allocatedByItem.set",
      "Math.min"
    ],
    "sql": [],
    "body": "export function allocateMaterialDemands(\n  demands: readonly MaterialDemand[],\n  inventory: readonly Pick<InventoryItem, \"id\" | \"stock_qty\">[],\n): MaterialDemandAllocation[] {\n  const allocatedByItem = new Map<number, number>();\n  const inventoryById = new Map(inventory.map((item) => [item.id, item]));\n  return demands.map((demand) => {\n    const allocated = allocatedByItem.get(demand.item_id) ?? 0;\n    const outstanding = Math.max(0, demand.requested_qty - demand.issued_qty);\n    const available = Math.max(\n      0,\n      stockOnHand(inventoryById.get(demand.item_id)) - allocated,\n    );\n    const procurementQty = Math.max(0, outstanding - available);\n    allocatedByItem.set(demand.item_id, allocated + Math.min(outstanding, available));\n    return { outcome: procurementQty ? \"procurement\" : \"issuable\", procurementQty };\n  });\n}",
    "parameters": [
      {
        "name": "demands",
        "type": "readonly MaterialDemand[]",
        "optional": false
      },
      {
        "name": "inventory",
        "type": "readonly Pick<InventoryItem, \"id\" | \"stock_qty\">[]",
        "optional": false
      }
    ],
    "returnType": "MaterialDemandAllocation[]",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "materials/inventory; TX-06/07/10",
    "resolvedReturnType": "MaterialDemandAllocation[]"
  },
  {
    "id": "OP-materials-filterInventory",
    "name": "filterInventory",
    "file": "src/materials.ts",
    "span": "src/materials.ts:103-106",
    "calls": [
      "query.trim().toLowerCase",
      "query.trim",
      "items.filter",
      "`${item.name} ${item.sku} ${item.category}`.toLowerCase().includes",
      "`${item.name} ${item.sku} ${item.category}`.toLowerCase"
    ],
    "sql": [],
    "body": "export function filterInventory(items: readonly InventoryItem[], query: string) {\n  const needle = query.trim().toLowerCase();\n  return items.filter((item) => !needle || `${item.name} ${item.sku} ${item.category}`.toLowerCase().includes(needle));\n}",
    "parameters": [
      {
        "name": "items",
        "type": "readonly InventoryItem[]",
        "optional": false
      },
      {
        "name": "query",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "materials/inventory; TX-06/07/10",
    "resolvedReturnType": "InventoryItem[]"
  },
  {
    "id": "OP-materials-pickerLabel",
    "name": "pickerLabel",
    "file": "src/materials.ts",
    "span": "src/materials.ts:108-110",
    "calls": [],
    "sql": [],
    "body": "export function pickerLabel(item: Pick<InventoryItem, \"name\" | \"stock_qty\" | \"unit\">) {\n  return `${item.name} · in stock: ${item.stock_qty}`;\n}",
    "parameters": [
      {
        "name": "item",
        "type": "Pick<InventoryItem, \"name\" | \"stock_qty\" | \"unit\">",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "string"
  },
  {
    "id": "OP-materials-canReleaseMaterialRows",
    "name": "canReleaseMaterialRows",
    "file": "src/materials.ts",
    "span": "src/materials.ts:116-118",
    "calls": [],
    "sql": [],
    "body": "export function canReleaseMaterialRows(actor: Actor, job: JobRef) {\n  return (actor.role === \"admin\" || actor.role === \"store\") && (job.main_status === \"IN_PROGRESS\" || job.main_status === \"HOLD\");\n}",
    "parameters": [
      {
        "name": "actor",
        "type": "Actor",
        "optional": false
      },
      {
        "name": "job",
        "type": "JobRef",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "materials/inventory; TX-06/07/10",
    "resolvedReturnType": "boolean"
  },
  {
    "id": "OP-materials-canEditIssuedMaterialRows",
    "name": "canEditIssuedMaterialRows",
    "file": "src/materials.ts",
    "span": "src/materials.ts:121-124",
    "calls": [],
    "sql": [],
    "body": "export function canEditIssuedMaterialRows(actor: Actor, job: JobRef) {\n  const who = actor.role === \"admin\" || actor.role === \"store\" || (actor.role === \"service\" && actor.id === job.advisor_id);\n  return who && (job.main_status === \"IN_PROGRESS\" || job.main_status === \"HOLD\" || job.main_status === \"COMPLETED\");\n}",
    "parameters": [
      {
        "name": "actor",
        "type": "Actor",
        "optional": false
      },
      {
        "name": "job",
        "type": "JobRef",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "materials/inventory; TX-06/07/10",
    "resolvedReturnType": "boolean"
  },
  {
    "id": "OP-materials-materialRowActionsFor",
    "name": "materialRowActionsFor",
    "file": "src/materials.ts",
    "span": "src/materials.ts:127-134",
    "calls": [
      "materialRowStatus",
      "canManageMaterialRows",
      "materialRowActions",
      "canReleaseMaterialRows",
      "actions.push",
      "canEditIssuedMaterialRows"
    ],
    "sql": [],
    "body": "export function materialRowActionsFor(actor: Actor, job: JobRef, row: Pick<MaterialRequest, \"status\" | \"invoiced_in\">): MaterialRowAction[] {\n  if (row.invoiced_in) return [];\n  const status = materialRowStatus(row);\n  const actions: MaterialRowAction[] = canManageMaterialRows(actor, job) ? materialRowActions(row) : [];\n  if ((status === \"Requested\" || status === \"Re-requested\") && canReleaseMaterialRows(actor, job)) actions.push(\"release\");\n  if (status === \"Issued\" && canEditIssuedMaterialRows(actor, job)) actions.push(\"edit-issued\");\n  return actions;\n}",
    "parameters": [
      {
        "name": "actor",
        "type": "Actor",
        "optional": false
      },
      {
        "name": "job",
        "type": "JobRef",
        "optional": false
      },
      {
        "name": "row",
        "type": "Pick<MaterialRequest, \"status\" | \"invoiced_in\">",
        "optional": false
      }
    ],
    "returnType": "MaterialRowAction[]",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "MaterialRowAction[]"
  },
  {
    "id": "OP-pdf-render-renderHtmlToPdf",
    "name": "renderHtmlToPdf",
    "file": "src/pdf-render.ts",
    "span": "src/pdf-render.ts:11-42",
    "calls": [
      "document.createElement",
      "host.setAttribute",
      "document.body.appendChild",
      "Promise.all",
      "import",
      "html2canvas",
      "pdf.internal.pageSize.getWidth",
      "pdf.internal.pageSize.getHeight",
      "Math.floor",
      "Math.max",
      "Math.ceil",
      "Math.min",
      "part.getContext",
      "context.fillRect",
      "context.drawImage",
      "pdf.addPage",
      "pdf.addImage",
      "part.toDataURL",
      "pdf.save",
      "host.remove"
    ],
    "sql": [],
    "body": "export async function renderHtmlToPdf(html: string, filename: string): Promise<void> {\n  const host = document.createElement(\"div\");\n  host.setAttribute(\"aria-hidden\", \"true\");\n  host.style.cssText = `position:fixed;left:0;top:0;z-index:-1;pointer-events:none;box-sizing:border-box;width:${PAGE_WIDTH_PX}px;background:#fff;color:#111`;\n  host.innerHTML = html;\n  document.body.appendChild(host);\n  try {\n    const [{ jsPDF }, { default: html2canvas }] = await Promise.all([import(\"jspdf\"), import(\"html2canvas\")]);\n    const canvas = await html2canvas(host, { scale: SCALE, useCORS: false, backgroundColor: \"#ffffff\", width: PAGE_WIDTH_PX, windowWidth: PAGE_WIDTH_PX, scrollX: 0, scrollY: 0 });\n    const pdf = new jsPDF({ unit: \"pt\", format: \"a4\", orientation: \"portrait\" });\n    const pageWidth = pdf.internal.pageSize.getWidth();\n    const pageHeight = pdf.internal.pageSize.getHeight();\n    const slice = Math.floor(canvas.width * A4_RATIO);\n    const pages = Math.max(1, Math.ceil((canvas.height - 2) / slice));\n    for (let index = 0; index < pages; index += 1) {\n      const height = Math.min(slice, canvas.height - index * slice);\n      const part = document.createElement(\"canvas\");\n      part.width = canvas.width;\n      part.height = slice;\n      const context = part.getContext(\"2d\");\n      if (!context) throw new Error(\"Canvas is not available.\");\n      context.fillStyle = \"#ffffff\";\n      context.fillRect(0, 0, part.width, part.height);\n      context.drawImage(canvas, 0, index * slice, canvas.width, height, 0, 0, canvas.width, height);\n      if (index > 0) pdf.addPage();\n      pdf.addImage(part.toDataURL(\"image/jpeg\", 0.95), \"JPEG\", 0, 0, pageWidth, pageHeight);\n    }\n    pdf.save(filename);\n  } finally {\n    host.remove();\n  }\n}",
    "parameters": [
      {
        "name": "html",
        "type": "string",
        "optional": false
      },
      {
        "name": "filename",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "Promise<void>",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "Promise<void>"
  },
  {
    "id": "OP-purchase-order-supplier-display-supplierNameForPurchaseOrder",
    "name": "supplierNameForPurchaseOrder",
    "file": "src/purchase-order-supplier-display.ts",
    "span": "src/purchase-order-supplier-display.ts:8-15",
    "calls": [
      "suppliers.find",
      "String",
      "Number"
    ],
    "sql": [],
    "body": "export function supplierNameForPurchaseOrder(\n  suppliers: readonly Pick<Supplier, \"id\" | \"name\">[],\n  supplierId: number | string | null | undefined,\n) {\n  const supplier = suppliers.find((candidate) => String(candidate.id) === String(supplierId));\n  if (supplier) return supplier.name;\n  return Number(supplierId) > 0 ? \"Unknown supplier\" : \"Supplier pending\";\n}",
    "parameters": [
      {
        "name": "suppliers",
        "type": "readonly Pick<Supplier, \"id\" | \"name\">[]",
        "optional": false
      },
      {
        "name": "supplierId",
        "type": "number | string | null | undefined",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "procurement/inventory; TX-08/09/10",
    "resolvedReturnType": "string"
  },
  {
    "id": "OP-report-templates-seedReportTemplates",
    "name": "seedReportTemplates",
    "file": "src/report-templates.ts",
    "span": "src/report-templates.ts:106-130",
    "calls": [
      "new Date(now).toISOString",
      "(Object.keys(REPORT_CATEGORY_LABELS) as ReportCategory[]).map",
      "Object.keys",
      "defaults.find",
      "quotation.html.replaceAll"
    ],
    "sql": [],
    "body": "export function seedReportTemplates(now: Date | string = new Date()): ReportTemplate[] {\n  const timestamp = new Date(now).toISOString();\n  const defaults = (Object.keys(REPORT_CATEGORY_LABELS) as ReportCategory[]).map((category) => ({\n    id: `template-${category}-default`, category, name: `Standard ${REPORT_CATEGORY_LABELS[category]}`,\n    html: DEFAULT_TEMPLATE_HTML[category], active: true, createdAt: timestamp, updatedAt: timestamp, seedVersion: DEFAULT_TEMPLATE_VERSION,\n  }));\n  const quotation = defaults.find((template) => template.category === \"quotation\")!;\n  return [\n    ...defaults,\n    {\n      ...quotation,\n      id: \"template-quotation-marron\",\n      name: \"Marron Template\",\n      html: quotation.html.replaceAll(ACCENT, \"#8b2f3c\"),\n      active: false,\n    },\n    {\n      ...quotation,\n      id: \"template-quotation-yellow\",\n      name: \"Yellow Template\",\n      html: quotation.html.replaceAll(ACCENT, \"#d97706\"),\n      active: false,\n    },\n  ];\n}",
    "parameters": [
      {
        "name": "now",
        "type": "Date | string",
        "optional": true,
        "default": "new Date()"
      }
    ],
    "returnType": "ReportTemplate[]",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "ReportTemplate[]"
  },
  {
    "id": "OP-report-templates-findUnsupportedPlaceholders",
    "name": "findUnsupportedPlaceholders",
    "file": "src/report-templates.ts",
    "span": "src/report-templates.ts:136-143",
    "calls": [
      "[...html.matchAll(LOOP_PATTERN)].map",
      "html.matchAll",
      "html.replace",
      "namesIn(outside).filter",
      "namesIn",
      "allowed.has",
      "loops.flatMap",
      "namesIn(body).filter",
      "inLoop.has",
      "[...new Set(found)].sort"
    ],
    "sql": [],
    "body": "export function findUnsupportedPlaceholders(html: string, category: ReportCategory): string[] {\n  const allowed = new Set<string>(REPORT_PLACEHOLDERS[category]);\n  const inLoop = new Set<string>([...allowed, ...LINE_PLACEHOLDERS]);\n  const loops = [...html.matchAll(LOOP_PATTERN)].map((match) => match[1]);\n  const outside = html.replace(LOOP_PATTERN, \"\");\n  const found = [...namesIn(outside).filter((name) => !allowed.has(name)), ...loops.flatMap((body) => namesIn(body).filter((name) => !inLoop.has(name)))];\n  return [...new Set(found)].sort();\n}",
    "parameters": [
      {
        "name": "html",
        "type": "string",
        "optional": false
      },
      {
        "name": "category",
        "type": "ReportCategory",
        "optional": false
      }
    ],
    "returnType": "string[]",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "string[]"
  },
  {
    "id": "OP-report-templates-rupeesInWords",
    "name": "rupeesInWords",
    "file": "src/report-templates.ts",
    "span": "src/report-templates.ts:147-162",
    "calls": [
      "Math.floor",
      "below100",
      "Math.round",
      "Math.max",
      "parts.push",
      "below1000",
      "parts.join"
    ],
    "sql": [],
    "body": "export function rupeesInWords(amount: number): string {\n  const ones = [\"\", \"One\", \"Two\", \"Three\", \"Four\", \"Five\", \"Six\", \"Seven\", \"Eight\", \"Nine\", \"Ten\", \"Eleven\", \"Twelve\", \"Thirteen\", \"Fourteen\", \"Fifteen\", \"Sixteen\", \"Seventeen\", \"Eighteen\", \"Nineteen\"];\n  const tens = [\"\", \"\", \"Twenty\", \"Thirty\", \"Forty\", \"Fifty\", \"Sixty\", \"Seventy\", \"Eighty\", \"Ninety\"];\n  const below100 = (n: number) => n < 20 ? ones[n] : `${tens[Math.floor(n / 10)]}${n % 10 ? ` ${ones[n % 10]}` : \"\"}`;\n  const below1000 = (n: number) => `${n >= 100 ? `${ones[Math.floor(n / 100)]} Hundred${n % 100 ? \" \" : \"\"}` : \"\"}${below100(n % 100)}`;\n  const total = Math.round(Math.max(0, amount) * 100);\n  let rupees = Math.floor(total / 100);\n  const paise = total % 100;\n  const parts: string[] = [];\n  for (const [size, name] of [[10000000, \"Crore\"], [100000, \"Lakh\"], [1000, \"Thousand\"]] as const) {\n    if (rupees >= size) { parts.push(`${below1000(Math.floor(rupees / size))} ${name}`); rupees %= size; }\n  }\n  if (rupees) parts.push(below1000(rupees));\n  const text = parts.join(\" \") || \"Zero\";\n  return `Rupees ${text}${paise ? ` and ${below100(paise)} Paise` : \"\"} Only`;\n}",
    "parameters": [
      {
        "name": "amount",
        "type": "number",
        "optional": false
      }
    ],
    "returnType": "string",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "string"
  },
  {
    "id": "OP-report-templates-reportAvailable",
    "name": "reportAvailable",
    "file": "src/report-templates.ts",
    "span": "src/report-templates.ts:191-197",
    "calls": [
      "Boolean",
      "view.payments.some"
    ],
    "sql": [],
    "body": "export function reportAvailable(category: ReportCategory, view: JobView) {\n  if (category === \"estimate\") return Boolean(view.estimate);\n  if (category === \"invoice\") return Boolean(view.invoice && !view.invoice.voided_at);\n  if (category === \"gate-pass\") return Boolean(view.invoice && view.gate_pass && !view.gate_pass.voided_at && view.gate_pass.invoice_id === view.invoice.id);\n  if (category === \"payment-receipt\") return Boolean(view.invoice && view.receipt && !view.receipt.voided_at && view.receipt.invoice_id === view.invoice.id && view.payments.some((payment) => payment.invoice_id === view.invoice!.id));\n  return Boolean(view.job);\n}",
    "parameters": [
      {
        "name": "category",
        "type": "ReportCategory",
        "optional": false
      },
      {
        "name": "view",
        "type": "JobView",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "boolean"
  },
  {
    "id": "OP-report-templates-buildReportValues",
    "name": "buildReportValues",
    "file": "src/report-templates.ts",
    "span": "src/report-templates.ts:199-232",
    "calls": [
      "reportItems.reduce",
      "invoiceTotals",
      "reportItems.map",
      "normalizeGstLine",
      "view.payments.reduce",
      "value",
      "date",
      "`${view.vehicle.make} ${view.vehicle.model}`.trim",
      "money",
      "Math.max",
      "imageBlock",
      "rupeesInWords",
      "table",
      "paymentDetailsBlock",
      "view.payments.map",
      "view.tasks.map",
      "view.qc_checks.map"
    ],
    "sql": [],
    "body": "export function buildReportValues(category: ReportCategory, view: JobView, settings: WorkshopBusinessSettings, assets: CompanyAssets): Record<string, string> {\n  const reportItems = category === \"invoice\" || category === \"payment-receipt\" ? view.invoice_items ?? view.estimate_items : view.estimate_items;\n  const subtotal = reportItems.reduce((sum, item) => sum + item.qty * item.rate, 0);\n  const discount = category === \"invoice\" || category === \"payment-receipt\" ? view.invoice?.discount ?? 0 : view.estimate?.discount ?? 0;\n  const fallbackGst = category === \"invoice\" || category === \"payment-receipt\" ? view.invoice?.gst_rate ?? settings.billing.defaultGstPercent : view.estimate?.gst_rate ?? settings.billing.defaultGstPercent;\n  const totals = invoiceTotals(reportItems.map((item) => ({ qty: item.qty, rate: item.rate, ...normalizeGstLine(item.gst_type, item.gst_rate, fallbackGst) })), discount);\n  const gst = totals.gst;\n  const invoiceTotal = view.invoice?.total ?? totals.total;\n  const paid = view.payments.reduce((sum, payment) => sum + payment.amount, 0);\n  const reportNumber = category === \"invoice\" ? view.invoice?.invoice_no : category === \"estimate\" ? `EST-${view.job.job_no}` : category === \"gate-pass\" ? view.gate_pass?.gate_pass_no : category === \"payment-receipt\" ? view.receipt?.receipt_no : view.job.job_no;\n  return {\n    \"company.name\": value(settings.profile.businessName), \"company.legal_name\": value(settings.profile.legalName), \"company.address\": value(settings.profile.address),\n    \"company.phone\": value(settings.profile.phone), \"company.email\": value(settings.profile.email), \"company.gstin\": value(settings.billing.gstin), \"company.footer\": value(settings.profile.footer),\n    \"company.bank_account_holder\": value(settings.billing.bankAccountHolder), \"company.bank_name\": value(settings.billing.bankName), \"company.bank_account_number\": value(settings.billing.bankAccountNumber),\n    \"company.bank_ifsc\": value(settings.billing.bankIfsc), \"company.bank_branch\": value(settings.billing.bankBranch), \"company.upi_id\": value(settings.billing.upiId),\n    \"report.title\": REPORT_CATEGORY_LABELS[category], \"report.number\": value(reportNumber), \"report.date\": date(view.invoice?.created_at ?? view.visit.received_at),\n    \"job.number\": value(view.job.job_no), \"job.status\": value(view.job.main_status), \"job.sub_status\": value(view.job.sub_status), \"job.work_list\": value(view.job.work_list || view.visit.requested_work),\n    \"customer.name\": value(view.customer.name), \"customer.mobile\": value(view.customer.mobile), \"customer.type\": value(view.customer.type),\n    \"vehicle.registration\": value(view.vehicle.number), \"vehicle.description\": value(`${view.vehicle.make} ${view.vehicle.model}`.trim()), \"vehicle.make\": value(view.vehicle.make), \"vehicle.model\": value(view.vehicle.model), \"vehicle.color\": value(view.vehicle.color), \"vehicle.km\": value(view.job.final_km ?? view.vehicle.km),\n    \"dates.received\": date(view.visit.received_at), \"dates.promised\": date(view.job.promised_at), \"dates.delivered\": date(view.job.closed_at || view.job.delivery_by),\n    \"staff.advisor\": value(view.advisor.name), \"staff.technician\": value(view.technician.name),\n    \"invoice.status\": value(view.invoice?.status), \"blocks.damage_diagram\": DAMAGE_SLOT, \"invoice.total\": money(invoiceTotal), \"invoice.paid\": money(paid), \"invoice.balance\": money(Math.max(0, invoiceTotal - paid)), \"receipt.number\": value(view.receipt?.receipt_no),\n    \"blocks.company_logo\": imageBlock(assets.logo, \"Company logo\"), \"blocks.company_stamp\": imageBlock(assets.stamp, \"Company stamp\"), \"blocks.authorized_signature\": imageBlock(assets.authorizedSignature, \"Authorized signature\"),\n    \"company.logo\": imageBlock(assets.logo, \"Company logo\"), \"company.stamp\": imageBlock(assets.stamp, \"Company stamp\"), \"company.signature\": imageBlock(assets.authorizedSignature, \"Authorized signature\"),\n    \"estimate.total\": money(totals.total), \"quotation.total\": money(totals.total), \"quotation.valid_until\": value(view.job.promised_at), \"quotation.notes\": \"\",\n    \"report.subtotal\": money(subtotal), \"report.discount\": discount ? `- ${money(discount)}` : money(0), \"report.gst\": money(gst),\n    \"report.amount_words\": rupeesInWords(category === \"payment-receipt\" ? paid : category === \"estimate\" ? totals.total : invoiceTotal),\n    \"blocks.line_items\": table([\"Type\", \"Description\", \"Qty\", \"Rate\", \"GST treatment\", \"GST %\", \"Amount\"], reportItems.map((item) => [item.kind, item.description, item.qty, money(item.rate), item.gst_type ?? (item.gst_rate === 0 ? \"No GST\" : \"CGST+SGST\"), `${item.gst_rate ?? fallbackGst}%`, money(item.qty * item.rate)])),\n    \"blocks.payment_details\": category === \"invoice\" ? paymentDetailsBlock(settings) : \"\",\n    \"blocks.payments\": table([\"Date\", \"Mode\", \"Reference\", \"Amount\"], view.payments.map((payment) => [date(payment.created_at), payment.mode, value(payment.reference), money(payment.amount)])),\n    \"blocks.tasks\": table([\"Task\", \"Status\", \"Notes\"], view.tasks.map((task) => [task.title, task.status, value(task.notes)])),\n    \"blocks.qc_rows\": table([\"Check\", \"Result\"], view.qc_checks.map((check) => [check.label, check.passed ? \"Pass\" : value(check.fail_reason || \"Pending\")])),\n  };\n}",
    "parameters": [
      {
        "name": "category",
        "type": "ReportCategory",
        "optional": false
      },
      {
        "name": "view",
        "type": "JobView",
        "optional": false
      },
      {
        "name": "settings",
        "type": "WorkshopBusinessSettings",
        "optional": false
      },
      {
        "name": "assets",
        "type": "CompanyAssets",
        "optional": false
      }
    ],
    "returnType": "Record<string, string>",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "Record<string, string>"
  },
  {
    "id": "OP-report-templates-buildReportLines",
    "name": "buildReportLines",
    "file": "src/report-templates.ts",
    "span": "src/report-templates.ts:235-238",
    "calls": [
      "items.map",
      "value",
      "String",
      "money"
    ],
    "sql": [],
    "body": "export function buildReportLines(category: ReportCategory, view: JobView): ReportLine[] {\n  const items = category === \"invoice\" || category === \"payment-receipt\" ? view.invoice_items ?? view.estimate_items : view.estimate_items;\n  return items.map((item) => ({ kind: value(item.kind), description: value(item.description), qty: String(item.qty), rate: money(item.rate), amount: money(item.qty * item.rate) }));\n}",
    "parameters": [
      {
        "name": "category",
        "type": "ReportCategory",
        "optional": false
      },
      {
        "name": "view",
        "type": "JobView",
        "optional": false
      }
    ],
    "returnType": "ReportLine[]",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "ReportLine[]"
  },
  {
    "id": "OP-report-templates-sampleReportLines",
    "name": "sampleReportLines",
    "file": "src/report-templates.ts",
    "span": "src/report-templates.ts:240-245",
    "calls": [],
    "sql": [],
    "body": "export function sampleReportLines(): ReportLine[] {\n  return [\n    { kind: \"Service\", description: \"Ceramic coating\", qty: \"1\", rate: \"₹8,000.00\", amount: \"₹8,000.00\" },\n    { kind: \"Service\", description: \"Interior detailing\", qty: \"1\", rate: \"₹2,000.00\", amount: \"₹2,000.00\" },\n  ];\n}",
    "parameters": [],
    "returnType": "ReportLine[]",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "ReportLine[]"
  },
  {
    "id": "OP-report-templates-sampleReportValues",
    "name": "sampleReportValues",
    "file": "src/report-templates.ts",
    "span": "src/report-templates.ts:247-266",
    "calls": [
      "Object.fromEntries",
      "REPORT_PLACEHOLDERS[category].map",
      "name.split(\".\").at(-1)?.replaceAll",
      "name.split(\".\").at",
      "name.split",
      "table"
    ],
    "sql": [],
    "body": "export function sampleReportValues(category: ReportCategory): Record<string, string> {\n  const scalar: Record<string, string> = Object.fromEntries(REPORT_PLACEHOLDERS[category].map((name) => [name, `Sample ${name.split(\".\").at(-1)?.replaceAll(\"_\", \" \")}`]));\n  return {\n    ...scalar,\n    \"company.name\": \"WorkshopOS Demo Studio\", \"company.legal_name\": \"WorkshopOS Automotive Services\", \"company.address\": \"Bhubaneswar, Odisha\", \"company.phone\": \"+91 98765 43210\", \"company.email\": \"hello@workshopos.demo\", \"company.gstin\": \"21ABCDE1234F1Z5\", \"company.footer\": \"Thank you for your business.\", \"estimate.total\": \"₹11,800.00\", \"report.subtotal\": \"₹10,000.00\", \"report.discount\": \"- ₹0.00\", \"report.gst\": \"₹1,800.00\", \"report.amount_words\": \"Rupees Eleven Thousand Eight Hundred Only\",\n    \"company.logo\": `<div style=\"font-weight:bold;font-size:20px;color:#fff\">WorkshopOS</div>`, \"company.stamp\": `<div style=\"border:2px solid #15803d;border-radius:50%;padding:15px;color:#15803d\">STAMP</div>`, \"company.signature\": `<div style=\"min-width:140px;text-align:center\"><em>Authorized signature</em><hr></div>`,\n    \"company.bank_account_holder\": \"WorkshopOS Automotive Services\", \"company.bank_name\": \"State Bank of India\", \"company.bank_account_number\": \"001234567890\", \"company.bank_ifsc\": \"SBIN0001234\", \"company.bank_branch\": \"Bhubaneswar Main Branch\", \"company.upi_id\": \"workshopos@sbi\",\n    \"report.title\": REPORT_CATEGORY_LABELS[category], \"report.number\": category === \"invoice\" ? \"INV-2026-0042\" : category === \"gate-pass\" ? \"GP-2026-0042\" : category === \"payment-receipt\" ? \"REC-2026-0042\" : \"JC-2026-0042\", \"report.date\": \"24/09/2026\",\n    \"job.number\": \"JC-2026-0042\", \"job.status\": \"COMPLETED\", \"job.sub_status\": \"Invoice Ready\", \"job.work_list\": \"Ceramic coating and interior detailing\",\n    \"customer.name\": \"Aarav Sharma\", \"customer.mobile\": \"98765 00042\", \"customer.type\": \"Individual\", \"vehicle.registration\": \"OD02AB0042\", \"vehicle.description\": \"Honda City\", \"vehicle.make\": \"Honda\", \"vehicle.model\": \"City\", \"vehicle.color\": \"White\", \"vehicle.km\": \"42,125\",\n    \"dates.received\": \"22/09/2026\", \"dates.promised\": \"24/09/2026\", \"dates.delivered\": \"24/09/2026\", \"staff.advisor\": \"Meera Das\", \"staff.technician\": \"Rohan Singh\",\n    \"invoice.status\": \"Cleared\", \"blocks.damage_diagram\": DAMAGE_SLOT, \"invoice.total\": \"₹11,800.00\", \"invoice.paid\": \"₹8,000.00\", \"invoice.balance\": \"₹3,800.00\", \"receipt.number\": \"REC-2026-0042\",\n    \"blocks.company_logo\": `<div style=\"font-weight:bold;font-size:20px;color:#fff\">WorkshopOS</div>`, \"blocks.company_stamp\": `<div style=\"border:2px solid #15803d;border-radius:50%;padding:15px;color:#15803d\">STAMP</div>`, \"blocks.authorized_signature\": `<div style=\"min-width:140px;text-align:center\"><em>Authorized signature</em><hr></div>`,\n    \"blocks.line_items\": table([\"Type\", \"Description\", \"Qty\", \"Rate\", \"Amount\"], [[\"Service\", \"Ceramic coating\", 1, \"₹8,000.00\", \"₹8,000.00\"], [\"Service\", \"Interior detailing\", 1, \"₹2,000.00\", \"₹2,000.00\"]]),\n    \"blocks.payments\": table([\"Date\", \"Mode\", \"Reference\", \"Amount\"], [[\"24/09/2026\", \"UPI\", \"UPI-0042\", \"₹8,000.00\"]]),\n    \"blocks.payment_details\": `<section><h3 style=\"margin:0 0 4px;font-size:12px\">Tax &amp; Payment Details</h3>${table([\"Detail\", \"Value\"], [[\"GSTIN\", \"21ABCDE1234F1Z5\"], [\"Bank\", \"State Bank of India\"], [\"UPI ID\", \"workshopos@sbi\"]])}</section>`,\n    \"blocks.tasks\": table([\"Task\", \"Status\", \"Notes\"], [[\"Ceramic coating\", \"Completed\", \"Final coat cured\"], [\"Interior detailing\", \"Completed\", \"Quality checked\"]]),\n    \"blocks.qc_rows\": table([\"Check\", \"Result\"], [[\"Surface finish\", \"Pass\"], [\"Customer items\", \"Pass\"]]),\n  };\n}",
    "parameters": [
      {
        "name": "category",
        "type": "ReportCategory",
        "optional": false
      }
    ],
    "returnType": "Record<string, string>",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "Record<string, string>"
  },
  {
    "id": "OP-report-templates-sanitizeReportHtml",
    "name": "sanitizeReportHtml",
    "file": "src/report-templates.ts",
    "span": "src/report-templates.ts:271-293",
    "calls": [
      "DOMPurify.sanitize",
      "[...SAFE_ELEMENTS].map",
      "tag.toLowerCase",
      "new DOMParser().parseFromString",
      "document.body.querySelectorAll",
      "DROP_WITH_CONTENT.has",
      "element.remove",
      "SAFE_ELEMENTS.has",
      "element.replaceWith",
      "attribute.name.toLowerCase",
      "attribute.value.trim",
      "[\"class\", \"title\", \"alt\", \"colspan\", \"rowspan\", \"width\", \"height\", \"style\"].includes",
      "name.startsWith",
      "element.removeAttribute",
      "/url\\s*\\(|expression\\s*\\(|@import|javascript:/i.test",
      "/^(#|mailto:|tel:)/i.test",
      "/^data:image\\/(png|jpeg);base64,/i.test",
      "element.setAttribute"
    ],
    "sql": [],
    "body": "export function sanitizeReportHtml(input: string): string {\n  const html = DOMPurify.isSupported\n    ? DOMPurify.sanitize(input, { ALLOWED_TAGS: [...SAFE_ELEMENTS].map((tag) => tag.toLowerCase()), ALLOWED_ATTR: [\"class\", \"title\", \"alt\", \"colspan\", \"rowspan\", \"width\", \"height\", \"style\", \"href\", \"src\"], ALLOW_DATA_ATTR: false })\n    : input;\n  if (typeof DOMParser === \"undefined\") return html;\n  const document = new DOMParser().parseFromString(html, \"text/html\");\n  for (const element of [...document.body.querySelectorAll(\"*\")]) {\n    if (DROP_WITH_CONTENT.has(element.tagName)) { element.remove(); continue; }\n    if (!SAFE_ELEMENTS.has(element.tagName)) { element.replaceWith(...element.childNodes); continue; }\n    for (const attribute of [...element.attributes]) {\n      const name = attribute.name.toLowerCase();\n      const raw = attribute.value.trim();\n      const allowed = [\"class\", \"title\", \"alt\", \"colspan\", \"rowspan\", \"width\", \"height\", \"style\"].includes(name)\n        || (element.tagName === \"A\" && name === \"href\") || (element.tagName === \"IMG\" && name === \"src\");\n      if (!allowed || name.startsWith(\"on\")) { element.removeAttribute(attribute.name); continue; }\n      if (name === \"style\" && /url\\s*\\(|expression\\s*\\(|@import|javascript:/i.test(raw)) element.removeAttribute(attribute.name);\n      if (name === \"href\" && !/^(#|mailto:|tel:)/i.test(raw)) element.removeAttribute(attribute.name);\n      if (name === \"src\" && !/^data:image\\/(png|jpeg);base64,/i.test(raw)) element.removeAttribute(attribute.name);\n    }\n    if (element.tagName === \"A\") element.setAttribute(\"rel\", \"noopener noreferrer\");\n  }\n  return document.body.innerHTML;\n}",
    "parameters": [
      {
        "name": "input",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "string",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "string"
  },
  {
    "id": "OP-report-templates-renderReportTemplate",
    "name": "renderReportTemplate",
    "file": "src/report-templates.ts",
    "span": "src/report-templates.ts:296-309",
    "calls": [
      "findUnsupportedPlaceholders",
      "unsupported.join",
      "Object.keys(values).filter",
      "Object.keys",
      "name.startsWith",
      "text.replace",
      "rawName.trim",
      "blockNames.has",
      "escapeHtml",
      "template.html.replace",
      "lines\n    .map((line) => scalar(body.replace(/{{\\s*line\\.(kind|description|qty|rate|amount)\\s*}}/g, (_m, key: keyof ReportLine) => escapeHtml(line[key]))))\n    .join",
      "lines\n    .map",
      "scalar",
      "body.replace",
      "sanitizeReportHtml"
    ],
    "sql": [
      "scalar(body.replace(/{{\\s*line\\.(kind\\|description\\|qty\\|rate\\|amount)\\s*}}/g, (_m, key: keyof ReportLine) => escapeHtml(line[key])))",
      "scalar(expanded)"
    ],
    "body": "export function renderReportTemplate(template: Pick<ReportTemplate, \"html\" | \"category\">, values: Record<string, string>, lines: readonly ReportLine[] = []): string {\n  const unsupported = findUnsupportedPlaceholders(template.html, template.category);\n  if (unsupported.length) throw new Error(`Unsupported placeholders: ${unsupported.join(\", \")}`);\n  const blockNames = new Set(Object.keys(values).filter((name) => name.startsWith(\"blocks.\") || name === \"company.logo\" || name === \"company.stamp\" || name === \"company.signature\"));\n  const scalar = (text: string) => text.replace(/{{\\s*([^{}]+?)\\s*}}/g, (_match, rawName: string) => {\n    const name = rawName.trim();\n    const replacement = values[name] ?? \"—\";\n    return blockNames.has(name) ? replacement : escapeHtml(replacement);\n  });\n  const expanded = template.html.replace(LOOP_PATTERN, (_match, body: string) => lines\n    .map((line) => scalar(body.replace(/{{\\s*line\\.(kind|description|qty|rate|amount)\\s*}}/g, (_m, key: keyof ReportLine) => escapeHtml(line[key]))))\n    .join(\"\"));\n  return sanitizeReportHtml(scalar(expanded));\n}",
    "parameters": [
      {
        "name": "template",
        "type": "Pick<ReportTemplate, \"html\" | \"category\">",
        "optional": false
      },
      {
        "name": "values",
        "type": "Record<string, string>",
        "optional": false
      },
      {
        "name": "lines",
        "type": "readonly ReportLine[]",
        "optional": true,
        "default": "[]"
      }
    ],
    "returnType": "string",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "string"
  },
  {
    "id": "OP-report-templates-buildPrintDocument",
    "name": "buildPrintDocument",
    "file": "src/report-templates.ts",
    "span": "src/report-templates.ts:313-315",
    "calls": [
      "escapeHtml"
    ],
    "sql": [],
    "body": "export function buildPrintDocument(title: string, bodyHtml: string) {\n  return `<!doctype html><html><head><meta charset=\"utf-8\"><meta http-equiv=\"Content-Security-Policy\" content=\"${PRINT_CSP}\"><title>${escapeHtml(title)}</title><style>@page{size:A4;margin:0}html,body{margin:0;background:white;print-color-adjust:exact;-webkit-print-color-adjust:exact}main{max-width:100%}body{font-family:Arial,sans-serif}img{max-width:100%;height:auto}table{page-break-inside:auto}tr{page-break-inside:avoid}@media print{button{display:none}}</style></head><body>${bodyHtml}</body></html>`;\n}",
    "parameters": [
      {
        "name": "title",
        "type": "string",
        "optional": false
      },
      {
        "name": "bodyHtml",
        "type": "string",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "tenant settings/admin; TX-13/14",
    "resolvedReturnType": "string"
  },
  {
    "id": "OP-service-advisor-isServiceActiveJob",
    "name": "isServiceActiveJob",
    "file": "src/service-advisor.ts",
    "span": "src/service-advisor.ts:6-8",
    "calls": [
      "SERVICE_ACTIVE_JOB_STATUSES.includes"
    ],
    "sql": [],
    "body": "export function isServiceActiveJob(view: Pick<JobView, \"job\">) {\n  return SERVICE_ACTIVE_JOB_STATUSES.includes(view.job.main_status);\n}",
    "parameters": [
      {
        "name": "view",
        "type": "Pick<JobView, \"job\">",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "jobs/estimates; TX-02/11/12",
    "resolvedReturnType": "boolean"
  },
  {
    "id": "OP-service-advisor-canAddServiceFollowup",
    "name": "canAddServiceFollowup",
    "file": "src/service-advisor.ts",
    "span": "src/service-advisor.ts:10-12",
    "calls": [
      "FOLLOWUP_EDITABLE_JOB_STATUSES.includes"
    ],
    "sql": [],
    "body": "export function canAddServiceFollowup(view: Pick<JobView, \"job\">) {\n  return FOLLOWUP_EDITABLE_JOB_STATUSES.includes(view.job.main_status);\n}",
    "parameters": [
      {
        "name": "view",
        "type": "Pick<JobView, \"job\">",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "followups; scoped aggregate",
    "resolvedReturnType": "boolean"
  },
  {
    "id": "OP-service-advisor-serviceFollowupStatus",
    "name": "serviceFollowupStatus",
    "file": "src/service-advisor.ts",
    "span": "src/service-advisor.ts:14-19",
    "calls": [
      "view.followups.filter",
      "Boolean"
    ],
    "sql": [],
    "body": "export function serviceFollowupStatus(view: Pick<JobView, \"followups\">) {\n  const completed = view.followups.filter((followup) => Boolean(followup.done)).length;\n  return view.followups.length > 0 && completed === view.followups.length\n    ? `Done(${completed})`\n    : `Pending (${completed}/${view.followups.length})`;\n}",
    "parameters": [
      {
        "name": "view",
        "type": "Pick<JobView, \"followups\">",
        "optional": false
      }
    ],
    "returnType": "inferred; see return expressions in source contract",
    "classification": "PURE/CLIENT",
    "endpoint": "No HTTP; pure presentation/validation helper",
    "service": "followups; scoped aggregate",
    "resolvedReturnType": "string"
  }
]