import assert from "node:assert/strict";
import test from "node:test";

import { createProductionUsersApi, DEFAULT_USER_QUERY, userListSearch, UsersApiError } from "../src/production-users-api.js";

test("production users client serializes URL state and sends versioned idempotent commands", async () => {
  const calls: Array<{ path: string; init?: RequestInit }> = [];
  const fetcher = async (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ path: String(input), init });
    return new Response(JSON.stringify({ users: [], roles: [], branches: [], page: { page: 1, pageSize: 25, totalCount: 0, pageCount: 1 }, query: DEFAULT_USER_QUERY }), { status: 200, headers: { "content-type": "application/json" } });
  };
  const api = createProductionUsersApi({ mode: "local", identity: "admin" }, fetcher);
  assert.equal(userListSearch({ ...DEFAULT_USER_QUERY, search: "anita", status: "ACTIVE", pageSize: 50 }), "search=anita&status=ACTIVE&pageSize=50");
  await api.list({ ...DEFAULT_USER_QUERY, search: "anita" });
  assert.equal(calls[0].path, "/api/v1/admin/users?search=anita");
});

test("production users client preserves readable conflict and trace details", async () => {
  const api = createProductionUsersApi({ mode: "local", identity: "admin" }, async () => new Response(JSON.stringify({ code: "VERSION_CONFLICT", traceId: "trace-user" }), { status: 409, headers: { "content-type": "application/json" } }));
  await assert.rejects(() => api.list(), (error: UsersApiError) => error.code === "VERSION_CONFLICT" && error.traceId === "trace-user" && /Refresh/.test(error.message));
});
