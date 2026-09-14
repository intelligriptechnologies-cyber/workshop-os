import assert from "node:assert/strict";
import test from "node:test";

import { createProductionRolesApi, RolesApiError } from "../src/production-roles-api.js";

test("roles client uses authenticated versioned and idempotent role endpoints", async () => {
  const calls: Array<{ path: string; init: RequestInit }> = [];
  const fetcher = async (input: RequestInfo | URL, init: RequestInit = {}) => {
    calls.push({ path: String(input), init });
    return new Response(JSON.stringify({ role: { id: "role", version: 2 }, roles: [], catalog: [] }), { headers: { "content-type": "application/json" } });
  };
  const api = createProductionRolesApi({ mode: "local", identity: "north-admin" }, fetcher);
  await api.list("work items");
  await api.create({ name: "Technician", description: "", permissions: ["work-items.page", "work-item.read"] }, "create-key");
  await api.update({ id: "11111111-1111-4111-8111-111111111111", name: "Senior Technician", description: "", permissions: ["work-items.page"], version: 2 });
  await api.archive({ id: "11111111-1111-4111-8111-111111111111", version: 3 }, "No longer used", "archive-key");
  assert.deepEqual(calls.map((call) => [call.path, call.init.method ?? "GET", new Headers(call.init.headers).get("idempotency-key")]), [
    ["/api/v1/admin/roles?search=work+items", "GET", null], ["/api/v1/admin/roles", "POST", "create-key"],
    ["/api/v1/admin/roles/11111111-1111-4111-8111-111111111111", "PATCH", null],
    ["/api/v1/admin/roles/11111111-1111-4111-8111-111111111111/archive", "POST", "archive-key"],
  ]);
});

test("roles client exposes readable traced conflicts", async () => {
  const api = createProductionRolesApi({ mode: "local", identity: "north-admin" }, async () => new Response(
    JSON.stringify({ code: "PROTECTED_ROLE", traceId: "trace-role" }), { status: 409, headers: { "content-type": "application/json" } },
  ));
  await assert.rejects(() => api.list(), (error: RolesApiError) => error.code === "PROTECTED_ROLE" && error.traceId === "trace-role" && /Protected/.test(error.message));
});
