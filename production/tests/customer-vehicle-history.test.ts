import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { createLocalCustomerVehicleApi } from "../src/customer-vehicle-history.js";

const manager = {
  identityId: "manager-north",
  membershipId: "membership-manager-north",
  tenantId: "tenant-north",
  branchIds: ["branch-delhi"],
  permissions: ["customer.manage", "vehicle.manage", "identity.merge", "identity.merge.compensate"],
  authenticatedAt: "2026-09-10T09:55:00.000Z",
  mfa: true,
};

test("customer create and search preserve multiple contacts while flagging tenant-safe exact and probable duplicates", async () => {
  const south = { ...manager, identityId: "manager-south", membershipId: "membership-manager-south", tenantId: "tenant-south" };
  const api = createLocalCustomerVehicleApi({ memberships: { north: manager, south } });
  const north = api.signIn("north");

  const created = await north.post("/api/v1/customers", {
    tenantId: "tenant-south",
    branchId: "branch-delhi",
    displayName: "Aarav Sharma",
    contacts: [
      { id: "contact-aarav-phone", name: "Aarav", type: "MOBILE", value: "+91 98765 43210", consent: "OPTED_IN", preferred: true },
      { id: "contact-neha-email", name: "Neha", type: "EMAIL", value: "Neha@Example.com", consent: "UNKNOWN", preferred: false },
    ],
    payerRelations: [{ payerCustomerId: "self", relationship: "SELF", effectiveFrom: "2026-09-01" }],
  }, { idempotencyKey: "create-aarav" });

  assert.equal(created.status, 201);
  assert.equal(created.body.customer?.tenantId, "tenant-north");
  assert.equal(created.body.customer?.contacts.length, 2);
  assert.equal(created.body.customer?.contacts[0].value, "+91 98765 43210");
  assert.deepEqual(created.body.duplicateMatches, []);
  assert.equal(created.body.resourceVersion, 1);
  assert.match(String(created.body.auditReference), /^audit-customer-/);

  const exact = await north.post("/api/v1/customers", {
    branchId: "branch-delhi", displayName: "A. Sharma",
    contacts: [{ id: "contact-duplicate", name: "Aarav", type: "MOBILE", value: "9876543210", consent: "OPTED_OUT", preferred: true }],
    payerRelations: [],
  }, { idempotencyKey: "create-aarav-exact" });
  assert.deepEqual(exact.body.duplicateMatches, [{ entityId: created.body.customer?.id, confidence: "EXACT", reasons: ["MOBILE"] }]);

  const probable = await north.get("/api/v1/customers?branchId=branch-delhi&query=Aarav%20Sharm");
  assert.equal(probable.status, 200);
  assert.ok(probable.body.customers?.some((customer) => customer.id === created.body.customer?.id));
  assert.ok(probable.body.duplicateMatches?.some((match) => match.entityId === created.body.customer?.id && match.confidence === "PROBABLE"));

  await api.signIn("south").post("/api/v1/customers", {
    branchId: "branch-delhi", displayName: "South Customer",
    contacts: [{ id: "south-phone", name: "South", type: "MOBILE", value: "9876543210", consent: "OPTED_IN", preferred: true }],
    payerRelations: [],
  }, { idempotencyKey: "south-same-phone" });
  const southSearch = await api.signIn("south").get("/api/v1/customers?branchId=branch-delhi&query=9876543210");
  assert.equal(southSearch.body.customers?.length, 1);
  const northSearch = await north.get("/api/v1/customers?branchId=branch-delhi&query=9876543210");
  assert.equal(northSearch.body.customers?.length, 2);
});

test("vehicle identity updates use version tokens and retain append-only odometer and service snapshots", async () => {
  const api = createLocalCustomerVehicleApi({ memberships: { manager } });
  const session = api.signIn("manager");
  const customer = await session.post("/api/v1/customers", {
    branchId: "branch-delhi", displayName: "Meera Iyer",
    contacts: [{ id: "meera-phone", name: "Meera", type: "MOBILE", value: "9000011111", consent: "OPTED_IN", preferred: true }],
    payerRelations: [],
  }, { idempotencyKey: "create-meera" });
  const customerId = String(customer.body.customer?.id);

  const vehicle = await session.post("/api/v1/vehicles", {
    branchId: "branch-delhi", registration: "DL 01 AB 1234", vin: "MA3EUA61S00123456",
    attributes: { make: "Maruti Suzuki", model: "Baleno", year: 2024, colour: "Blue", fuel: "PETROL" },
    ownerCustomerId: customerId, ownershipEffectiveFrom: "2025-01-15",
  }, { idempotencyKey: "create-baleno" });
  assert.equal(vehicle.status, 201);
  assert.equal(vehicle.body.vehicle?.registration, "DL 01 AB 1234");
  assert.deepEqual(vehicle.body.duplicateMatches, []);

  const exact = await session.post("/api/v1/vehicles", {
    branchId: "branch-delhi", registration: "dl01ab1234", vin: "",
    attributes: { make: "Maruti", model: "Baleno" }, ownerCustomerId: customerId, ownershipEffectiveFrom: "2026-01-01",
  }, { idempotencyKey: "duplicate-baleno" });
  assert.deepEqual(exact.body.duplicateMatches, [{ entityId: vehicle.body.vehicle?.id, confidence: "EXACT", reasons: ["REGISTRATION"] }]);

  const updated = await session.patch(`/api/v1/vehicles/${vehicle.body.vehicle?.id}`, {
    branchId: "branch-delhi", attributes: { colour: "Nexa Blue" },
  }, { ifMatch: 1 });
  assert.equal(updated.status, 200);
  assert.equal(updated.body.resourceVersion, 2);
  const stale = await session.patch(`/api/v1/vehicles/${vehicle.body.vehicle?.id}`, {
    branchId: "branch-delhi", attributes: { colour: "Red" },
  }, { ifMatch: 1 });
  assert.equal(stale.status, 412);

  await session.post(`/api/v1/vehicles/${vehicle.body.vehicle?.id}/odometer-readings`, {
    branchId: "branch-delhi", readingKm: 24500, recordedAt: "2026-09-10T10:00:00.000Z", source: "CHECK_IN",
  }, { idempotencyKey: "baleno-km-1" });
  const implausible = await session.post(`/api/v1/vehicles/${vehicle.body.vehicle?.id}/odometer-readings`, {
    branchId: "branch-delhi", readingKm: 24000, recordedAt: "2026-09-11T10:00:00.000Z", source: "CHECK_IN",
  }, { idempotencyKey: "baleno-km-backwards" });
  assert.equal(implausible.status, 409);
  assert.equal(implausible.body.code, "ODOMETER_ROLLBACK_REQUIRES_CORRECTION");

  await session.post(`/api/v1/vehicles/${vehicle.body.vehicle?.id}/service-history`, {
    branchId: "branch-delhi", jobId: "job-101", payerCustomerId: customerId,
    servicedAt: "2026-09-10T12:00:00.000Z", odometerKm: 24500, summary: "Annual service",
  }, { idempotencyKey: "service-job-101" });
  const fetched = await session.get(`/api/v1/vehicles/${vehicle.body.vehicle?.id}?branchId=branch-delhi`);
  assert.equal(fetched.body.vehicle?.odometerHistory.length, 1);
  assert.equal(fetched.body.vehicle?.serviceHistory[0].ownerCustomerId, customerId);
  assert.equal(fetched.body.vehicle?.serviceHistory[0].payerCustomerId, customerId);
});

test("effective-dated ownership changes preserve historical job owner and payer snapshots", async () => {
  const api = createLocalCustomerVehicleApi({ memberships: { manager } });
  const session = api.signIn("manager");
  const createCustomer = async (name: string, phone: string, key: string) => session.post("/api/v1/customers", {
    branchId: "branch-delhi", displayName: name,
    contacts: [{ id: `${key}-phone`, name, type: "MOBILE", value: phone, consent: "OPTED_IN", preferred: true }], payerRelations: [],
  }, { idempotencyKey: key });
  const firstOwner = String((await createCustomer("Ravi Kumar", "9000000001", "ravi")).body.customer?.id);
  const nextOwner = String((await createCustomer("Sonal Gupta", "9000000002", "sonal")).body.customer?.id);
  const vehicle = await session.post("/api/v1/vehicles", {
    branchId: "branch-delhi", registration: "HR26DK8337", vin: "MA3EUA61S00999999",
    attributes: { make: "Maruti", model: "Swift" }, ownerCustomerId: firstOwner, ownershipEffectiveFrom: "2024-01-01",
  }, { idempotencyKey: "create-swift" });
  const vehicleId = String(vehicle.body.vehicle?.id);
  await session.post(`/api/v1/vehicles/${vehicleId}/service-history`, {
    branchId: "branch-delhi", jobId: "job-before-sale", payerCustomerId: firstOwner,
    servicedAt: "2026-03-01T09:00:00.000Z", odometerKm: 12000, summary: "Service before sale",
  }, { idempotencyKey: "service-before-sale" });

  const transferred = await session.post(`/api/v1/vehicles/${vehicleId}/ownerships`, {
    branchId: "branch-delhi", customerId: nextOwner, effectiveFrom: "2026-04-01", reason: "Vehicle sold",
    evidence: ["signed-transfer-form-22"],
  }, { idempotencyKey: "transfer-swift", ifMatch: 2 });
  assert.equal(transferred.status, 201);
  assert.equal(transferred.body.vehicle?.ownershipHistory[0].effectiveTo, "2026-04-01");
  assert.equal(transferred.body.vehicle?.ownershipHistory[1].customerId, nextOwner);

  const overlap = await session.post(`/api/v1/vehicles/${vehicleId}/ownerships`, {
    branchId: "branch-delhi", customerId: firstOwner, effectiveFrom: "2026-03-15", reason: "Invalid overlap", evidence: ["note"],
  }, { idempotencyKey: "overlap-swift", ifMatch: 3 });
  assert.equal(overlap.status, 409);
  assert.equal(overlap.body.code, "OWNERSHIP_PERIOD_CONFLICT");

  await session.post(`/api/v1/vehicles/${vehicleId}/service-history`, {
    branchId: "branch-delhi", jobId: "job-after-sale", payerCustomerId: nextOwner,
    servicedAt: "2026-05-01T09:00:00.000Z", odometerKm: 15000, summary: "Service after sale",
  }, { idempotencyKey: "service-after-sale" });
  const fetched = await session.get(`/api/v1/vehicles/${vehicleId}?branchId=branch-delhi`);
  assert.deepEqual(fetched.body.vehicle?.serviceHistory.map((entry) => [entry.jobId, entry.ownerCustomerId, entry.payerCustomerId]), [
    ["job-before-sale", firstOwner, firstOwner], ["job-after-sale", nextOwner, nextOwner],
  ]);
});

test("controlled customer merge preserves aliases and history, rejects unsafe vehicle conflicts, and compensates without erasure", async () => {
  const unauthorized = { ...manager, identityId: "advisor", membershipId: "membership-advisor", permissions: ["customer.manage", "vehicle.manage"] };
  const api = createLocalCustomerVehicleApi({ memberships: { manager, unauthorized }, recentAuthenticationMinutes: 15 });
  const session = api.signIn("manager");
  const createCustomer = async (name: string, phone: string, key: string) => session.post("/api/v1/customers", {
    branchId: "branch-delhi", displayName: name,
    contacts: [{ id: `${key}-phone`, name, type: "MOBILE", value: phone, consent: "OPTED_IN", preferred: true }], payerRelations: [],
  }, { idempotencyKey: key, now: "2026-09-10T10:00:00.000Z" });
  const canonical = await createCustomer("Priya Nair", "9888800000", "priya-canonical");
  const duplicate = await createCustomer("Priya K Nair", "9888800000", "priya-duplicate");
  const canonicalId = String(canonical.body.customer?.id);
  const duplicateId = String(duplicate.body.customer?.id);
  const vehicle = await session.post("/api/v1/vehicles", {
    branchId: "branch-delhi", registration: "KA03MN1000", vin: "MALBB51BLAM123456",
    attributes: { make: "Hyundai", model: "i20" }, ownerCustomerId: duplicateId, ownershipEffectiveFrom: "2025-01-01",
  }, { idempotencyKey: "priya-i20" });
  await session.post(`/api/v1/vehicles/${vehicle.body.vehicle?.id}/service-history`, {
    branchId: "branch-delhi", jobId: "job-priya-before-merge", payerCustomerId: duplicateId,
    servicedAt: "2026-08-01T10:00:00.000Z", odometerKm: 9000, summary: "Historical job",
  }, { idempotencyKey: "priya-old-job" });

  const denied = await api.signIn("unauthorized").post("/api/v1/identity/merges", {
    branchId: "branch-delhi", entityType: "CUSTOMER", canonicalId, duplicateIds: [duplicateId],
    sourceVersions: { [canonicalId]: 1, [duplicateId]: 1 }, reason: "Confirmed duplicate", evidence: ["signed-merge-review-1"],
  }, { idempotencyKey: "unauthorized-merge", ifMatch: 1, now: "2026-09-10T10:01:00.000Z" });
  assert.equal(denied.status, 403);

  const merged = await session.post("/api/v1/identity/merges", {
    branchId: "branch-delhi", entityType: "CUSTOMER", canonicalId, duplicateIds: [duplicateId],
    sourceVersions: { [canonicalId]: 1, [duplicateId]: 1 }, reason: "Confirmed duplicate", evidence: ["signed-merge-review-1"],
  }, { idempotencyKey: "merge-priya", ifMatch: 1, now: "2026-09-10T10:01:00.000Z" });
  assert.equal(merged.status, 201);
  assert.ok(merged.body.customer?.aliases.includes(duplicateId));
  assert.equal(merged.body.customer?.contacts.length, 2);
  assert.equal(merged.body.merge?.status, "APPLIED");
  const mergeId = String(merged.body.merge?.id);

  const historicalVehicle = await session.get(`/api/v1/vehicles/${vehicle.body.vehicle?.id}?branchId=branch-delhi`);
  assert.equal(historicalVehicle.body.vehicle?.ownershipHistory[0].customerId, duplicateId);
  assert.equal(historicalVehicle.body.vehicle?.serviceHistory[0].ownerCustomerId, duplicateId);
  assert.equal(historicalVehicle.body.vehicle?.serviceHistory[0].payerCustomerId, duplicateId);

  const conflictingVehicle = await session.post("/api/v1/vehicles", {
    branchId: "branch-delhi", registration: "KA03MN1000", vin: "MALBB51BLAM654321",
    attributes: { make: "Hyundai", model: "i20" }, ownerCustomerId: canonicalId, ownershipEffectiveFrom: "2025-01-01",
  }, { idempotencyKey: "conflicting-i20" });
  const unsafe = await session.post("/api/v1/identity/merges", {
    branchId: "branch-delhi", entityType: "VEHICLE", canonicalId: vehicle.body.vehicle?.id,
    duplicateIds: [conflictingVehicle.body.vehicle?.id],
    sourceVersions: { [String(vehicle.body.vehicle?.id)]: 2, [String(conflictingVehicle.body.vehicle?.id)]: 1 },
    reason: "Same plate", evidence: ["registration-review"],
  }, { idempotencyKey: "unsafe-vehicle-merge", ifMatch: 2, now: "2026-09-10T10:02:00.000Z" });
  assert.equal(unsafe.status, 409);
  assert.equal(unsafe.body.code, "UNSAFE_IDENTITY_CONFLICT");

  const compensated = await session.post(`/api/v1/identity/merges/${mergeId}/compensations`, {
    branchId: "branch-delhi", reason: "Documents prove two different people", evidence: ["government-id-review-2"],
  }, { idempotencyKey: "compensate-priya", ifMatch: 1, now: "2026-09-10T10:03:00.000Z" });
  assert.equal(compensated.status, 201);
  assert.equal(compensated.body.merge?.status, "COMPENSATED");
  assert.equal(compensated.body.customer?.aliases.includes(duplicateId), false);
  const restoredSearch = await session.get("/api/v1/customers?branchId=branch-delhi&query=Priya");
  assert.equal(restoredSearch.body.customers?.filter((item) => item.status === "ACTIVE").length, 2);
  const audit = await session.get("/api/v1/identity/audit?branchId=branch-delhi");
  assert.deepEqual(audit.body.auditEntries?.filter((entry) => entry.action.startsWith("identity.")).map((entry) => entry.action), ["identity.customer-merged", "identity.merge-compensated"]);
});

test("customer and vehicle update/search surfaces report duplicate candidates and reject stale or cross-branch access", async () => {
  const api = createLocalCustomerVehicleApi({ memberships: { manager } });
  const session = api.signIn("manager");
  const first = await session.post("/api/v1/customers", {
    branchId: "branch-delhi", displayName: "Kabir Singh",
    contacts: [{ id: "kabir-one", name: "Kabir", type: "EMAIL", value: "kabir@example.com", consent: "OPTED_IN", preferred: true }], payerRelations: [],
  }, { idempotencyKey: "kabir-one" });
  const second = await session.post("/api/v1/customers", {
    branchId: "branch-delhi", displayName: "K Singh",
    contacts: [{ id: "kabir-two", name: "Kabir", type: "MOBILE", value: "9777700000", consent: "UNKNOWN", preferred: true }], payerRelations: [],
  }, { idempotencyKey: "kabir-two" });
  const updated = await session.patch(`/api/v1/customers/${second.body.customer?.id}`, {
    branchId: "branch-delhi", displayName: "Kabir S Singh",
    contacts: [{ id: "kabir-two", name: "Kabir", type: "EMAIL", value: "KABIR@example.com", consent: "OPTED_IN", preferred: true }],
    payerRelations: [],
  }, { ifMatch: 1 });
  assert.equal(updated.status, 200);
  assert.deepEqual(updated.body.duplicateMatches, [{ entityId: first.body.customer?.id, confidence: "EXACT", reasons: ["EMAIL"] }]);
  const stale = await session.patch(`/api/v1/customers/${second.body.customer?.id}`, {
    branchId: "branch-delhi", displayName: "Stale", contacts: [], payerRelations: [],
  }, { ifMatch: 1 });
  assert.equal(stale.status, 412);

  const vehicle = await session.post("/api/v1/vehicles", {
    branchId: "branch-delhi", registration: "DL8CAF5031", vin: "",
    attributes: { make: "Honda", model: "City" }, ownerCustomerId: String(first.body.customer?.id), ownershipEffectiveFrom: "2020-01-01",
  }, { idempotencyKey: "kabir-car" });
  const found = await session.get("/api/v1/vehicles?branchId=branch-delhi&query=DL8CAF5031");
  assert.equal(found.body.vehicles?.[0].id, vehicle.body.vehicle?.id);
  assert.equal((await session.get("/api/v1/vehicles?branchId=branch-jaipur&query=DL8CAF5031")).status, 403);
});

test("PostgreSQL customer and vehicle contract forces tenant isolation and append-only identity history", async () => {
  const migration = await readFile(new URL("../db/migrations/005_customer_vehicle_history.sql", import.meta.url), "utf8");
  const tables = [
    "customer", "customer_contact", "customer_payer_relation", "vehicle", "vehicle_ownership_history",
    "vehicle_odometer_history", "vehicle_service_history", "identity_alias", "identity_merge",
    "identity_merge_member", "identity_merge_compensation", "customer_vehicle_audit", "customer_vehicle_idempotency",
  ];
  for (const table of tables) {
    assert.match(migration, new RegExp(`CREATE TABLE workshopos\\.${table}`, "i"));
    assert.match(migration, new RegExp(`ALTER TABLE workshopos\\.${table} FORCE ROW LEVEL SECURITY`, "i"));
    assert.match(migration, new RegExp(`CREATE POLICY ${table}_tenant_isolation`, "i"));
  }
  assert.match(migration, /CREATE UNIQUE INDEX customer_contact_exact_identity/i);
  assert.match(migration, /CREATE UNIQUE INDEX vehicle_registration_identity/i);
  assert.match(migration, /CREATE UNIQUE INDEX vehicle_vin_identity/i);
  assert.match(migration, /reject_customer_vehicle_history_mutation/i);
  for (const table of ["vehicle_ownership_history", "vehicle_odometer_history", "vehicle_service_history", "identity_alias", "identity_merge_member", "identity_merge_compensation", "customer_vehicle_audit"]) {
    assert.match(migration, new RegExp(`BEFORE UPDATE OR DELETE ON workshopos\\.${table}`, "i"));
  }
  assert.match(migration, /historical_owner_customer_id uuid NOT NULL/i);
  assert.match(migration, /historical_payer_customer_id uuid NOT NULL/i);
  assert.match(migration, /UNIQUE \(tenant_id, idempotency_key\)/i);
});
