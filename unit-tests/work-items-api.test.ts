import assert from "node:assert/strict";
import test from "node:test";

import { WorkItemsApiError, createWorkItemsApi, type WorkItemAuth } from "../src/work-items-api";

const auth: WorkItemAuth = { mode: "local", identity: "north-reception" };

test("work-items client authenticates list/create/update and preserves retry keys", async () => {
  const requests: Array<{ path: string; init: RequestInit }> = [];
  const responses = [
    new Response(JSON.stringify({ workItems: [] }), { status: 200, headers: { "content-type": "application/json" } }),
    new Response(JSON.stringify({ workItem: { id: "wi-1", tenantId: "tenant-north", branchId: "north-delhi", summary: "Inspect", version: 1 } }), { status: 201, headers: { "content-type": "application/json" } }),
    new Response(JSON.stringify({ workItem: { id: "wi-1", tenantId: "tenant-north", branchId: "north-delhi", summary: "Inspect brakes", version: 2 } }), { status: 200, headers: { "content-type": "application/json" } }),
    new Response(JSON.stringify({ workItem: { id: "wi-1", tenantId: "tenant-north", branchId: "north-delhi", summary: "Inspect brakes", version: 3 } }), { status: 200, headers: { "content-type": "application/json" } }),
  ];
  const api = createWorkItemsApi(auth, async (path, init = {}) => {
    requests.push({ path: String(path), init });
    return responses.shift()!;
  });

  await api.list();
  await api.create({ branchId: "north-delhi", summary: "Inspect" }, "retry-key-1");
  await api.update({ id: "wi-1", summary: "Inspect brakes", version: 1 });
  await api.archive({ id: "wi-1", version: 2, reason: "Duplicate training item" }, "archive-key-1");

  assert.equal(new Headers(requests[0].init.headers).get("x-workshopos-identity"), "north-reception");
  assert.equal(new Headers(requests[1].init.headers).get("idempotency-key"), "retry-key-1");
  assert.deepEqual(JSON.parse(String(requests[2].init.body)), { summary: "Inspect brakes", version: 1 });
  assert.equal(requests[2].init.method, "PATCH");
  assert.equal(requests[3].path, "/api/v1/work-items/wi-1/archive");
  assert.equal(new Headers(requests[3].init.headers).get("idempotency-key"), "archive-key-1");
  assert.deepEqual(JSON.parse(String(requests[3].init.body)), { version: 2, reason: "Duplicate training item" });
});

test("work-items client exposes a safe readable error and trace identifier", async () => {
  const api = createWorkItemsApi(auth, async () => new Response(JSON.stringify({
    code: "VERSION_CONFLICT",
    message: "This work item changed since you opened it. Refresh and try again.",
    traceId: "trace-123",
  }), { status: 409, headers: { "content-type": "application/json", "x-trace-id": "trace-123" } }));

  await assert.rejects(
    () => api.update({ id: "wi-1", summary: "Stale", version: 1 }),
    (error: unknown) => error instanceof WorkItemsApiError
      && error.code === "VERSION_CONFLICT"
      && error.traceId === "trace-123"
      && error.message.includes("Refresh"),
  );
});
