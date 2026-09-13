import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

type FetchEvent = {
  request: { method: string; mode: string; url: string };
  respondWith(response: Promise<unknown>): void;
  waitUntil(work: Promise<unknown>): void;
};

async function loadWorker(fetchImpl: (request: unknown) => Promise<unknown>) {
  const listeners = new Map<string, (event: FetchEvent) => void>();
  const matched: unknown[] = [];
  const cachedShell = { source: "offline-shell" };
  const context = {
    URL,
    fetch: fetchImpl,
    caches: {
      match: async (request: unknown) => {
        matched.push(request);
        return cachedShell;
      },
      open: async () => ({ addAll: async () => undefined, put: async () => undefined }),
      keys: async () => [],
      delete: async () => true,
    },
    self: {
      location: { origin: "https://workshopos.test" },
      clients: { claim: async () => undefined },
      skipWaiting: async () => undefined,
      addEventListener: (type: string, listener: (event: FetchEvent) => void) => listeners.set(type, listener),
    },
  };

  const source = await readFile(new URL("../public/sw.js", import.meta.url), "utf8");
  vm.runInNewContext(source, context);
  return { cachedShell, listeners, matched };
}

test("page navigations use the network before the offline shell", async () => {
  const networkResponse = { ok: true, clone: () => ({}) };
  const worker = await loadWorker(async () => networkResponse);
  let response: Promise<unknown> | undefined;
  const event: FetchEvent = {
    request: { method: "GET", mode: "navigate", url: "https://workshopos.test/jobs" },
    respondWith: (value) => {
      response = value;
    },
    waitUntil: () => undefined,
  };

  worker.listeners.get("fetch")?.(event);
  assert.equal(await response, networkResponse);
  assert.deepEqual(worker.matched, []);
});

test("page navigations fall back to the cached shell when offline", async () => {
  const worker = await loadWorker(async () => {
    throw new Error("offline");
  });
  let response: Promise<unknown> | undefined;
  const event: FetchEvent = {
    request: { method: "GET", mode: "navigate", url: "https://workshopos.test/manage" },
    respondWith: (value) => {
      response = value;
    },
    waitUntil: () => undefined,
  };

  worker.listeners.get("fetch")?.(event);
  assert.equal(await response, worker.cachedShell);
  assert.deepEqual(worker.matched, ["/"]);
});
