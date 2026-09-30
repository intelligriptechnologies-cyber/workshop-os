import assert from "node:assert/strict";
import test from "node:test";

import {
  authenticatedFetch,
  checkAuthenticatedApiReachability,
  clearAuthenticatedReadCache,
  getAuthenticatedApiReachability,
  setAuthenticatedCacheScope,
  type CognitoConfig,
  type WorkshopSession,
} from "../src/auth";

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, String(value)); }
}

const config: CognitoConfig = {
  mode: "cognito", clientId: "client", authorizationEndpoint: "https://id.example/authorize", tokenEndpoint: "https://id.example/token", logoutEndpoint: "https://id.example/logout", callbackUri: "https://app.example/callback", logoutUri: "https://app.example/", scopes: ["openid"],
};

function session(tenant = "tenant-a", membership = "member-a", version = 1): WorkshopSession {
  return {
    tenant: { id: tenant, name: tenant },
    membership: { id: membership, displayName: "A User", email: "user@example.test", status: "ACTIVE", roleIds: ["role-a"], roles: [], branchIds: ["branch-a"], branches: [], permissions: ["page.customers.read"], version },
  };
}

function installSession() {
  const storage = new MemoryStorage();
  storage.setItem("workshopos.cognito.tokens.v1", JSON.stringify({ accessToken: "token", expiresAt: Date.now() + 3_600_000 }));
  Object.defineProperty(globalThis, "sessionStorage", { value: storage, configurable: true });
  return storage;
}

test("authenticated GETs fall back only to the current tenant/branch/membership cache and mark stale", async () => {
  installSession();
  clearAuthenticatedReadCache();
  setAuthenticatedCacheScope(session());
  let calls = 0;
  globalThis.fetch = (async () => {
    calls += 1;
    return new Response(JSON.stringify([{ id: 7, name: "Scoped customer" }]), { headers: { "content-type": "application/json" } });
  }) as typeof fetch;

  const online = await authenticatedFetch(config, "/api/v1/customers");
  assert.equal(online.headers.get("x-workshopos-cache"), null);
  await new Promise((resolve) => setTimeout(resolve, 0));

  globalThis.fetch = (async () => { calls += 1; throw new TypeError("network unavailable"); }) as typeof fetch;
  const stale = await authenticatedFetch(config, "/api/v1/customers");
  assert.equal(stale.headers.get("x-workshopos-cache"), "stale");
  assert.deepEqual(await stale.json(), [{ id: 7, name: "Scoped customer" }]);
  assert.equal(getAuthenticatedApiReachability().status, "offline");
  assert.equal(calls, 2);

  setAuthenticatedCacheScope(session("tenant-b", "member-b"));
  await assert.rejects(() => authenticatedFetch(config, "/api/v1/customers"), /API_UNREACHABLE/);
});

test("offline mode rejects mutations before dispatch and never queues them", async () => {
  installSession();
  setAuthenticatedCacheScope(session("tenant-c", "member-c"));
  globalThis.fetch = (async () => { throw new TypeError("network unavailable"); }) as typeof fetch;
  await assert.rejects(() => authenticatedFetch(config, "/api/v1/vehicles"), /API_UNREACHABLE/);
  let dispatched = false;
  globalThis.fetch = (async () => { dispatched = true; return new Response("{}", { headers: { "content-type": "application/json" } }); }) as typeof fetch;
  await assert.rejects(() => authenticatedFetch(config, "/api/v1/vehicles", { method: "POST", body: "{}" }), /OFFLINE_READ_ONLY/);
  assert.equal(dispatched, false);
});

test("a late response from an old tenant scope cannot populate the new tenant cache", async () => {
  installSession();
  clearAuthenticatedReadCache();
  setAuthenticatedCacheScope(session("tenant-old", "member-old"));
  globalThis.fetch = (async () => new Response(JSON.stringify([{ id: 1 }]), { headers: { "content-type": "application/json" } })) as typeof fetch;
  await authenticatedFetch(config, "/api/v1/jobs");
  setAuthenticatedCacheScope(session("tenant-new", "member-new"));
  await new Promise((resolve) => setTimeout(resolve, 0));
  globalThis.fetch = (async () => { throw new TypeError("network unavailable"); }) as typeof fetch;
  await assert.rejects(() => authenticatedFetch(config, "/api/v1/jobs"), /API_UNREACHABLE/);
});

test("authorization invalidation clears tokens and all cached authenticated reads", async () => {
  const storage = installSession();
  setAuthenticatedCacheScope(session("tenant-e", "member-e"));
  globalThis.fetch = (async () => new Response("{}", { status: 401, headers: { "content-type": "application/json" } })) as typeof fetch;
  const response = await authenticatedFetch(config, "/api/v1/session");
  assert.equal(response.status, 401);
  assert.equal(storage.getItem("workshopos.cognito.tokens.v1"), null);
  assert.equal(storage.getItem("workshopos.auth.read-cache.v1"), null);
});

test("a successful authenticated probe restores online mode without replaying a blocked command", async () => {
  installSession();
  setAuthenticatedCacheScope(session("tenant-d", "member-d"));
  globalThis.fetch = (async () => new Response(JSON.stringify(session("tenant-d", "member-d")), { headers: { "content-type": "application/json" } })) as typeof fetch;
  const status = await checkAuthenticatedApiReachability(config);
  assert.equal(status.status, "online");
  assert.ok(status.lastSuccessfulAt);
});
