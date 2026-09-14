import assert from "node:assert/strict";
import test from "node:test";
import { createCustomersVehiclesApi, type IdentityAuth } from "../src/production-customers-vehicles-api";

test("customer and vehicle client sends authenticated versioned production requests", async () => {
  const calls: Array<{ path: string; init: RequestInit }> = [];
  const responses = [
    { customers: [], page: { page: 1, pageSize: 25, totalCount: 0, pageCount: 1 } },
    { customer: { id: "c1", version: 1 } },
    { vehicle: { id: "v1", version: 2 } },
  ];
  const api = createCustomersVehiclesApi({ mode: "local", identity: "north-admin" } satisfies IdentityAuth, async (path, init = {}) => {
    calls.push({ path: String(path), init }); return new Response(JSON.stringify(responses.shift()), { status: 200, headers: { "content-type": "application/json" } });
  });
  await api.listCustomers({ search: "Asha", branchId: "", sort: "summary.asc", page: 1, pageSize: 25 });
  await api.createCustomer({ branchId: "b1", displayName: "Asha", mobile: "9999999999", email: "" }, "retry-1");
  await api.updateVehicle({ id: "v1", registration: "DL01AB1", vin: "", make: "", model: "", ownerCustomerId: "c1", version: 1 });
  assert.equal(calls[0].path, "/api/v1/customers?search=Asha&sort=summary.asc");
  assert.equal(new Headers(calls[1].init.headers).get("idempotency-key"), "retry-1");
  assert.equal(calls[2].path, "/api/v1/vehicles/v1"); assert.equal(calls[2].init.method, "PATCH");
});
