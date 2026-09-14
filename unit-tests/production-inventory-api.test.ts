import assert from "node:assert/strict";
import test from "node:test";

import { createInventoryApi } from "../src/production-inventory-api.js";

test("inventory client sends authenticated list state and idempotent staged-import commit", async () => {
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  const fetcher = async (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(input), init });
    if (String(input).endsWith("/commit")) return new Response(JSON.stringify({ import: { id: "i", status: "COMMITTED" }, reconciliation: { ledgerBatches: 1, quantity: "2", valueMinor: "100" } }), { status: 200, headers: { "content-type": "application/json" } });
    if (init?.method === "POST") return new Response(JSON.stringify({ import: { id: "i", status: "STAGED", version: 1 } }), { status: 201, headers: { "content-type": "application/json" } });
    return new Response(JSON.stringify({ inventory: [], analytics: {}, page: {} }), { status: 200, headers: { "content-type": "application/json" } });
  };
  const api = createInventoryApi({ mode: "local", identity: "north-admin" }, fetcher);
  await api.list({ search: "oil", branchId: "b", sort: "summary.asc", page: 2, pageSize: 50 });
  const staged = await api.stageImport({ branchId: "b", filename: "stock.csv", rows: [{ sku: "OIL", warehouseCode: "MAIN", quantity: "2", valueMinor: "100" }] }, "stage-key");
  await api.commitImport(staged, "commit-key");

  assert.match(calls[0].url, /search=oil.*branchId=b.*sort=summary.asc.*page=2.*pageSize=50/);
  assert.equal(new Headers(calls[1].init?.headers).get("idempotency-key"), "stage-key");
  assert.deepEqual(JSON.parse(String(calls[2].init?.body)), { version: 1 });
  assert.equal(new Headers(calls[2].init?.headers).get("idempotency-key"), "commit-key");
});
