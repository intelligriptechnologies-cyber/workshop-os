import assert from "node:assert/strict";

const baseUrl = process.env.LOCAL_BASE_URL ?? "http://127.0.0.1:4173";
const branch = "00000000-0000-4000-8000-000000000011";
const key = `local-smoke-${Date.now()}`;

async function api(path, identity, init = {}) {
  return fetch(`${baseUrl}${path}`, {
    ...init,
    headers: { "content-type": "application/json", "x-workshopos-identity": identity, ...(init.headers ?? {}) },
  });
}

const health = await fetch(`${baseUrl}/health`).then((response) => response.json());
assert.equal(health.status, "ok");
assert.equal(health.database, "workshopos");
assert.equal(health.migrations, 30);

const createInput = JSON.stringify({ branchId: branch, tenantId: "spoofed-tenant", summary: "Docker PostgreSQL smoke inspection" });
const createdResponse = await api("/api/v1/work-items", "north-reception", {
  method: "POST", body: createInput, headers: { "idempotency-key": key },
});
assert.equal(createdResponse.status, 201);
const created = await createdResponse.json();
assert.equal(created.workItem.tenantId, "00000000-0000-4000-8000-000000000001");

const replayResponse = await api("/api/v1/work-items", "north-reception", {
  method: "POST", body: createInput, headers: { "idempotency-key": key },
});
assert.equal(replayResponse.status, 200);
const replay = await replayResponse.json();
assert.equal(replay.workItem.id, created.workItem.id);
assert.equal(replay.auditReference, created.auditReference);

const changedKeyResponse = await api("/api/v1/work-items", "north-reception", {
  method: "POST", body: JSON.stringify({ branchId: branch, summary: "A different command" }), headers: { "idempotency-key": key },
});
assert.equal(changedKeyResponse.status, 409);
const changedKey = await changedKeyResponse.json();
assert.equal(changedKey.code, "IDEMPOTENCY_KEY_REUSED");
assert.ok(changedKey.message);
assert.equal(changedKey.traceId, changedKeyResponse.headers.get("x-trace-id"));

const updatedResponse = await api(`/api/v1/work-items/${created.workItem.id}`, "north-reception", {
  method: "PATCH", body: JSON.stringify({ summary: "Docker PostgreSQL brake inspection", version: 1 }),
});
assert.equal(updatedResponse.status, 200);
const updated = await updatedResponse.json();
assert.equal(updated.workItem.version, 2);

const staleResponse = await api(`/api/v1/work-items/${created.workItem.id}`, "north-reception", {
  method: "PATCH", body: JSON.stringify({ summary: "Stale overwrite", version: 1 }),
});
assert.equal(staleResponse.status, 409);
const stale = await staleResponse.json();
assert.equal(stale.code, "VERSION_CONFLICT");
assert.match(stale.message, /Refresh/);
assert.equal(stale.traceId, staleResponse.headers.get("x-trace-id"));

const northItems = await api("/api/v1/work-items", "north-reception").then((response) => response.json());
assert.ok(northItems.workItems.some((item) => item.id === created.workItem.id));
const southItems = await api("/api/v1/work-items", "south-reception").then((response) => response.json());
assert.ok(!southItems.workItems.some((item) => item.id === created.workItem.id));
const jaipurItems = await api("/api/v1/work-items", "north-jaipur-manager").then((response) => response.json());
assert.ok(!jaipurItems.workItems.some((item) => item.id === created.workItem.id));

const forbidden = await api("/api/v1/work-items", "north-reception", {
  method: "POST",
  body: JSON.stringify({ branchId: "00000000-0000-4000-8000-000000000012", summary: "Branch hop" }),
  headers: { "idempotency-key": `${key}-branch-hop` },
});
assert.equal(forbidden.status, 403);
const forbiddenBody = await forbidden.json();
assert.equal(forbiddenBody.code, "BRANCH_FORBIDDEN");
assert.equal(forbiddenBody.traceId, forbidden.headers.get("x-trace-id"));

const concurrentKey = `${key}-concurrent`;
const concurrentCalls = await Promise.all([
  api("/api/v1/work-items", "north-reception", {
    method: "POST", body: createInput, headers: { "idempotency-key": concurrentKey },
  }),
  api("/api/v1/work-items", "north-reception", {
    method: "POST", body: createInput, headers: { "idempotency-key": concurrentKey },
  }),
]);
assert.deepEqual(concurrentCalls.map((response) => response.status).sort(), [200, 201]);
const concurrentBodies = await Promise.all(concurrentCalls.map((response) => response.json()));
assert.equal(concurrentBodies[0].workItem.id, concurrentBodies[1].workItem.id);

console.log(JSON.stringify({
  result: "PASS",
  migrations: health.migrations,
  workItemId: created.workItem.id,
  checks: ["database health", "tenant spoof rejected", "idempotent replay", "idempotency payload binding", "optimistic version conflict", "trace-correlated readable errors", "concurrent retry serialization", "cross-tenant RLS", "cross-branch RLS"],
}, null, 2));
