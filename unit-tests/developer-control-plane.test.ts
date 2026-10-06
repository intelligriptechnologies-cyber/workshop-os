import assert from "node:assert/strict";
import test from "node:test";
import {
  DEVELOPER_CONTROL_PLANE_STORAGE_KEY,
  chargeStatus,
  createDefaultDeveloperControlPlane,
  createPlatformCharge,
  createTenant,
  loadDeveloperControlPlane,
  recordPlatformPayment,
  resetDeveloperControlPlane,
  saveDeveloperControlPlane,
  selectedTenant,
  setTenantLifecycle,
  simulateCommunicationTest,
  updateTenantProfile,
  type SessionStorageLike,
} from "../src/developer-control-plane";

class MemoryStorage implements SessionStorageLike {
  values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
  removeItem(key: string) { this.values.delete(key); }
}

const NOW = "2026-10-02T12:00:00.000Z";
const profile = { name: "North Star Garage", brandName: "North Star", address: "1 Main St", contactName: "Asha", email: "asha@example.test", phone: "9000000000", gstin: "", timezone: "Asia/Kolkata", currency: "INR", invoicePrefix: "NSG" };

test("seeds one selected active tenant and persists safely in session storage", () => {
  const storage = new MemoryStorage();
  const state = createDefaultDeveloperControlPlane(NOW);
  assert.equal(state.tenants.length, 1);
  assert.equal(selectedTenant(state).lifecycle, "active");
  saveDeveloperControlPlane(state, storage);
  assert.equal(loadDeveloperControlPlane(storage, NOW).selectedTenantId, state.selectedTenantId);
  assert.equal(storage.values.has(DEVELOPER_CONTROL_PLANE_STORAGE_KEY), true);
});

test("creates, selects, disables, restores and updates a tenant profile", () => {
  const initial = createDefaultDeveloperControlPlane(NOW);
  const created = createTenant(initial, profile, NOW);
  assert.equal(selectedTenant(created).profile.name, "North Star Garage");
  const disabled = setTenantLifecycle(created, selectedTenant(created).id, "disabled");
  assert.equal(selectedTenant(disabled).lifecycle, "disabled");
  const restored = setTenantLifecycle(disabled, selectedTenant(disabled).id, "active");
  assert.equal(updateTenantProfile(restored, selectedTenant(restored).id, { invoicePrefix: "NORTH" }).tenants.at(-1)?.profile.invoicePrefix, "NORTH");
});

test("simulated communication logs outcomes without provider calls", () => {
  const initial = createDefaultDeveloperControlPlane(NOW);
  const active = simulateCommunicationTest(initial, "email", initial.selectedTenantId, "test@example.test", NOW);
  assert.equal(active.communicationLogs[0].result, "simulated");
  const disabled = setTenantLifecycle(active, active.selectedTenantId, "disabled");
  assert.equal(simulateCommunicationTest(disabled, "whatsapp", disabled.selectedTenantId, "", NOW).communicationLogs[0].result, "blocked");
});

test("charges allow partial and full payment histories", () => {
  const initial = createDefaultDeveloperControlPlane(NOW);
  const charged = createPlatformCharge(initial, { tenantId: initial.selectedTenantId, description: "Platform plan", amount: 1000, dueDate: "2026-10-31" }, NOW);
  const partial = recordPlatformPayment(charged, charged.charges[0].id, 300, "UPI", NOW);
  assert.equal(chargeStatus(partial.charges[0]), "Partial");
  const paid = recordPlatformPayment(partial, partial.charges[0].id, 700, "Bank", NOW);
  assert.equal(chargeStatus(paid.charges[0]), "Paid");
  assert.equal(paid.charges[0].payments.length, 2);
});

test("reset restores the seeded browser-session state", () => {
  const storage = new MemoryStorage();
  saveDeveloperControlPlane(createTenant(createDefaultDeveloperControlPlane(NOW), profile, NOW), storage);
  const reset = resetDeveloperControlPlane(storage, NOW);
  assert.equal(reset.tenants.length, 1);
  assert.equal(loadDeveloperControlPlane(storage, NOW).charges.length, 0);
});
