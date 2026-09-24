import assert from "node:assert/strict";
import test from "node:test";
import {
  ADMIN_DEMO_STORAGE_KEY,
  ADMIN_PAGE_GROUPS,
  addDemoRole,
  appendDemoLog,
  archiveDemoRole,
  clearDemoLogs,
  confirmInventoryImport,
  createDefaultAdminDemoState,
  enforceLogRetention,
  filterDemoLogs,
  loadAdminDemoState,
  normalizeBusinessSettings,
  resetAdminDemoState,
  resolvePermittedPages,
  saveAdminDemoState,
  updateBusinessSettings,
  updateDemoRole,
  updateRolePageAccess,
  validateBusinessSettings,
  type SessionStorageLike,
} from "../src/admin-demo-state";

class MemorySessionStorage implements SessionStorageLike {
  readonly values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }

  removeItem(key: string) {
    this.values.delete(key);
  }
}

const NOW = "2026-09-22T12:00:00.000Z";

test("defaults represent all six WorkshopOS roles and current menu pages", () => {
  const state = createDefaultAdminDemoState(NOW);
  assert.deepEqual(state.roles.map((role) => role.id), ["admin", "service", "reception", "accounts", "store", "tech"]);
  assert.equal(ADMIN_PAGE_GROUPS.flatMap((group) => group.pages).some((page) => page.label === "Admin Console"), true);
  assert.equal(ADMIN_PAGE_GROUPS.flatMap((group) => group.pages).find((page) => page.key === "jobs")?.label, "Job Cards");
  assert.deepEqual(resolvePermittedPages(state, "store"), ["material-requests", "issue-material", "reconcile", "stock", "search"]);
  assert.equal(resolvePermittedPages(state, "admin").includes("admin-console"), true);
});

test("session persistence is versioned, recoverable and resettable", () => {
  const storage = new MemorySessionStorage();
  const state = updateBusinessSettings(createDefaultAdminDemoState(NOW), { profile: { businessName: "Saved demo workshop" } });
  saveAdminDemoState(state, storage, NOW);
  assert.equal(storage.values.has(ADMIN_DEMO_STORAGE_KEY), true);
  assert.equal(loadAdminDemoState(storage, NOW).businessSettings.profile.businessName, "Saved demo workshop");

  storage.setItem(ADMIN_DEMO_STORAGE_KEY, "not JSON");
  assert.equal(loadAdminDemoState(storage, NOW).roles.length, 6);
  resetAdminDemoState(storage, NOW);
  assert.equal(storage.values.has(ADMIN_DEMO_STORAGE_KEY), false);
});

test("fresh billing settings contain valid tax and payment instructions", () => {
  const settings = createDefaultAdminDemoState(NOW).businessSettings;
  assert.equal(validateBusinessSettings(settings).length, 0);
  assert.equal(settings.billing.gstin, "21ABCDE1234F1Z5");
  assert.equal(settings.billing.bankAccountNumber.startsWith("00"), true);
  assert.match(settings.billing.upiId, /@/);
  assert.equal("gstin" in settings.profile, false);
});

test("older session GSTIN migrates to billing without replacing custom state", () => {
  const storage = new MemorySessionStorage();
  const old = createDefaultAdminDemoState(NOW) as unknown as Record<string, unknown>;
  const businessSettings = old.businessSettings as Record<string, Record<string, unknown>>;
  businessSettings.profile.gstin = "29ABCDE1234F1Z7";
  delete businessSettings.billing.gstin;
  businessSettings.billing.bankName = "Existing Bank";
  const templates = old.reportTemplates as Array<{ html: string }>;
  templates[0].html = "<h1>Custom {{report.number}}</h1>";
  storage.setItem(ADMIN_DEMO_STORAGE_KEY, JSON.stringify(old));

  const hydrated = loadAdminDemoState(storage, NOW);
  assert.equal(hydrated.businessSettings.billing.gstin, "29ABCDE1234F1Z7");
  assert.equal(hydrated.businessSettings.billing.bankName, "Existing Bank");
  assert.equal("gstin" in hydrated.businessSettings.profile, false);
  assert.equal(hydrated.reportTemplates[0].html, "<h1>Custom {{report.number}}</h1>");
});

test("business settings normalization trims values, preserves account zeros and uppercases identifiers", () => {
  const original = createDefaultAdminDemoState(NOW).businessSettings;
  const normalized = normalizeBusinessSettings({
    ...original,
    profile: { ...original.profile, businessName: "  Apex Auto  " },
    billing: { ...original.billing, gstin: " 21abcde1234f1z5 ", bankIfsc: " sbin0001234 ", bankAccountNumber: " 001234 " },
  });
  assert.equal(normalized.profile.businessName, "Apex Auto");
  assert.equal(normalized.billing.gstin, "21ABCDE1234F1Z5");
  assert.equal(normalized.billing.bankIfsc, "SBIN0001234");
  assert.equal(normalized.billing.bankAccountNumber, "001234");
});

test("billing validation reports GSTIN, IFSC and UPI errors independently", () => {
  const settings = createDefaultAdminDemoState(NOW).businessSettings;
  const errors = validateBusinessSettings({ ...settings, billing: { ...settings.billing, gstin: "bad", bankIfsc: "bad", upiId: "bad" } });
  assert.equal(errors.some((error) => error.startsWith("GSTIN")), true);
  assert.equal(errors.some((error) => error.startsWith("IFSC")), true);
  assert.equal(errors.some((error) => error.startsWith("UPI ID")), true);
  assert.equal(validateBusinessSettings({ ...settings, billing: { ...settings.billing, gstin: "", bankIfsc: "", upiId: "" } }).length, 0);
});

test("custom role helpers are immutable and preserve role mappings", () => {
  const original = createDefaultAdminDemoState(NOW);
  const added = addDemoRole(original, { label: "  Workshop Supervisor  ", pageAccess: ["dashboard", "jobs"] }, NOW);
  assert.equal(original.roles.length, 6);
  assert.equal(added.roles.at(-1)?.id, "custom-1");
  assert.deepEqual(resolvePermittedPages(added, "custom-1"), ["dashboard", "jobs"]);

  const updated = updateDemoRole(added, "custom-1", { label: "Floor Supervisor", description: "Coordinates the floor" }, NOW);
  assert.equal(updated.roles.at(-1)?.label, "Floor Supervisor");
  assert.deepEqual(resolvePermittedPages(updated, "custom-1"), ["dashboard", "jobs"]);

  const archived = archiveDemoRole(updated, "custom-1", NOW);
  assert.equal(archived.roles.at(-1)?.status, "archived");
  assert.deepEqual(resolvePermittedPages(archived, "custom-1"), []);
  assert.throws(() => archiveDemoRole(archived, "admin", NOW), /cannot be archived/i);
});

test("Owner/Admin always keeps Admin Console access", () => {
  const original = createDefaultAdminDemoState(NOW);
  const updated = updateRolePageAccess(original, "admin", ["dashboard", "made-up" as never]);
  assert.deepEqual(resolvePermittedPages(updated, "admin"), ["dashboard", "admin-console"]);
  assert.deepEqual(resolvePermittedPages(original, "admin"), original.rolePageAccess.admin);
});

test("business settings deep updates retain sibling values", () => {
  const original = createDefaultAdminDemoState(NOW);
  const named = updateBusinessSettings(original, { profile: { businessName: "Apex Auto" } });
  const contacted = updateBusinessSettings(named, { profile: { phone: "+91 90000 00000" } });
  assert.equal(contacted.businessSettings.profile.businessName, "Apex Auto");
  assert.equal(contacted.businessSettings.profile.phone, "+91 90000 00000");
  assert.equal(contacted.businessSettings.profile.currency, "INR");
});

test("logs append, filter, clear and enforce per-stream retention", () => {
  let state = { ...createDefaultAdminDemoState(NOW), logs: [] };
  state = appendDemoLog(state, {
    stream: "operational",
    level: "error",
    area: "Inventory",
    feature: "Import",
    message: "Duplicate SKU rejected",
    userId: "store",
    referenceId: "SKU-1",
  }, NOW);
  state = appendDemoLog(state, {
    stream: "feature",
    level: "info",
    area: "Administration",
    feature: "Roles",
    message: "Role mapping saved",
    userId: "admin",
    timestamp: "2026-09-18T12:00:00.000Z",
  }, NOW);
  assert.equal(filterDemoLogs(state.logs, { stream: "operational", search: "sku-1", levels: ["error"] }).length, 1);
  assert.equal(clearDemoLogs(state, "operational").logs.length, 1);

  const shortRetention = updateBusinessSettings(state, { logRetention: { operationalDays: 30, featureDays: 2 } });
  const retained = enforceLogRetention(shortRetention, NOW);
  assert.equal(retained.logs.some((log) => log.stream === "operational"), true);
  assert.equal(retained.logs.some((log) => log.stream === "feature"), false);
});

test("confirmInventoryImport merges valid rows into session inventory only", () => {
  const original = createDefaultAdminDemoState(NOW);
  const imported = confirmInventoryImport(original, {
    fileName: "opening-stock.xlsx",
    columnMapping: { sku: "SKU", name: "Item Name", category: "Category", unit: "Unit", stock_qty: "Opening Quantity", low_stock_qty: "Low Stock Threshold" },
    totalRows: 3,
    rejectedRows: 1,
    validRows: [
      { sku: "PPF-001", name: "Paint Protection Film", category: "Film", unit: "roll", stockQty: 10, lowStockQty: 2 },
      { sku: "OIL-005", name: "Engine Oil 5W-30", category: "Fluids", unit: "litre", stockQty: 40, lowStockQty: 8 },
    ],
  }, NOW);

  assert.equal(original.sessionInventory.length, 0);
  assert.equal(imported.sessionInventory.length, 2);
  assert.deepEqual(imported.sessionInventory.map((item) => item.sku), ["PPF-001", "OIL-005"]);
  assert.equal(imported.importBatches.length, 1);
  assert.equal(imported.importBatches[0].id, "import-1");
  assert.equal(imported.importBatches[0].status, "imported");
  assert.equal(imported.importBatches[0].acceptedRows, 2);
  assert.equal(imported.importBatches[0].rejectedRows, 1);
  assert.equal(imported.sessionInventory.every((item) => item.importBatchId === "import-1"), true);

  const importedAgain = confirmInventoryImport(imported, {
    fileName: "second-batch.xlsx",
    columnMapping: {},
    totalRows: 1,
    rejectedRows: 0,
    validRows: [{ sku: "BRK-010", name: "Brake Pad Set", category: "Brakes", unit: "set", stockQty: 5, lowStockQty: 1 }],
  }, NOW);
  assert.equal(importedAgain.importBatches.length, 2);
  assert.equal(importedAgain.importBatches[1].id, "import-2");
  assert.equal(importedAgain.sessionInventory.length, 3);
  assert.equal(new Set(importedAgain.sessionInventory.map((item) => item.id)).size, 3);
});
