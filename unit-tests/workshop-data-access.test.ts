import assert from "node:assert/strict";
import test from "node:test";
import type { Database } from "sql.js";
import { createApiCustomerDataAccess, createApiIntakeDataAccess, createLocalWorkshopDataAccess, createWorkshopDataAccessTestDouble, WorkshopDataAccessError } from "../src/workshop-data-access";
import type { Customer, Vehicle, WorkshopState } from "../src/types";

const customer = (id: number, name = "Asha") => ({ id, name, mobile: "9999999999", type: "Individual" } satisfies Customer);
const state = (customers: Customer[] = []) => ({ customers, archived_customers: [], marker: "state" } as unknown as WorkshopState);

test("the local data-access boundary owns opening, legacy commands, persistence, and refreshed reads", async () => {
  const database = {} as Database;
  let opens = 0;
  let persists = 0;
  let marker = "before";
  const access = createLocalWorkshopDataAccess({
    open: async () => { opens += 1; return database; },
    persist: (candidate) => { assert.equal(candidate, database); persists += 1; },
    read: (candidate) => { assert.equal(candidate, database); return { ...state(), marker } as WorkshopState; },
  });

  assert.equal(access.getReachability(), "online");
  assert.equal((await access.load() as unknown as { marker: string }).marker, "before");
  access.runLegacyMutation((candidate) => { assert.equal(candidate, database); marker = "after"; });

  assert.equal(opens, 1);
  assert.equal(persists, 1);
  assert.equal((access.read() as unknown as { marker: string }).marker, "after");
});

test("the typed Customer port maps a feature to local persistence without exposing SQL.js", async () => {
  const database = {} as Database;
  let current = state();
  const access = createLocalWorkshopDataAccess({
    open: async () => database,
    persist: () => undefined,
    read: () => current,
    createCustomer: (_database, input) => { assert.equal(input.name, "Asha"); current = state([customer(7)]); return 7; },
    updateCustomer: () => assert.fail("create command must not update"),
    archiveCustomer: () => assert.fail("create command must not archive"),
  });

  await access.load();
  const saved = await access.customers.command({ type: "customers.save", customer: { name: "Asha", mobile: "9999999999", type: "Individual" } });

  assert.equal(saved.id, 7);
  assert.deepEqual(await access.customers.query({ type: "customers.list" }), [customer(7)]);
});

test("the same typed Customer port runs against an API-shaped adapter", async () => {
  const calls: Array<{ method: string; path: string; body?: unknown }> = [];
  const api = createApiCustomerDataAccess(async (request) => {
    calls.push(request);
    return request.method === "GET" ? [customer(3)] : customer(3, "Updated");
  });

  assert.deepEqual(await api.query({ type: "customers.list", archived: false }), [customer(3)]);
  assert.equal((await api.command({ type: "customers.save", customer: { id: 3, name: "Updated", mobile: "9999999999", type: "Individual" } })).name, "Updated");
  await api.command({ type: "customers.archive", customerId: 3, reason: "Duplicate" });

  assert.deepEqual(calls, [
    { method: "GET", path: "/customers?archived=false" },
    { method: "PUT", path: "/customers/3", body: { id: 3, name: "Updated", mobile: "9999999999", type: "Individual" } },
    { method: "POST", path: "/customers/3/archive", body: { reason: "Duplicate" } },
  ]);
});

test("the app can receive a whole-app test double and data-access failures are normalized", async () => {
  const access = createWorkshopDataAccessTestDouble(state([customer(9)]), { reachability: "offline" });
  assert.equal(access.getReachability(), "offline");
  assert.deepEqual(await access.customers.query({ type: "customers.list" }), [customer(9)]);
  assert.throws(() => access.runLegacyMutation(() => undefined), (error: unknown) => error instanceof WorkshopDataAccessError && error.code === "COMMAND_FAILED");
});

test("the expanded intake seam maps vehicle and visit commands to their API routes", async () => {
  const calls: Array<{ method: string; path: string; body?: unknown }> = [];
  const vehicle = { id: 4, customer_id: 3, number: "KA01AB1234", make: "Honda", model: "City", color: "Blue", km: 1200 } satisfies Vehicle;
  const vehicleInput = { customer_id: 3, number: "KA01AB1234", make: "Honda", model: "City", color: "Blue", km: 1200 };
  const api = createApiIntakeDataAccess(async (request) => { calls.push(request); return request.path.startsWith("/vehicles") ? vehicle : { id: 7, customerId: 3, vehicleId: 4, fuel: "3 bars", odoReading: 1200, requestedWork: "Service", archivedAt: null }; });
  assert.equal((await api.vehicles.command({ type: "vehicles.save", vehicle: vehicleInput })).id, 4);
  await api.vehicles.command({ type: "vehicles.save", vehicle });
  assert.equal((await api.visits.command({ type: "visits.create", visit: { customerId: 3, vehicleId: 4, advisorId: null, fuel: "3 bars", odoReading: 1200, requestedWork: "Service" } })).id, 7);
  await api.visits.command({ type: "visits.update", visitId: 7, visit: { advisorId: null, fuel: "2 bars", odoReading: 1250, requestedWork: "Brake check" } });
  await api.visits.command({ type: "visits.archive", visitId: 7, reason: "Duplicate" });
  assert.deepEqual(calls, [
    { method: "POST", path: "/vehicles", body: vehicleInput },
    { method: "PUT", path: "/vehicles/4", body: vehicle },
    { method: "POST", path: "/visits", body: { customerId: 3, vehicleId: 4, advisorId: null, fuel: "3 bars", odoReading: 1200, requestedWork: "Service" } },
    { method: "PUT", path: "/visits/7", body: { advisorId: null, fuel: "2 bars", odoReading: 1250, requestedWork: "Brake check" } },
    { method: "POST", path: "/visits/7/archive", body: { reason: "Duplicate" } },
  ]);
});
