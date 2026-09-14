import assert from "node:assert/strict";
import test from "node:test";

import { createProductionBusinessSettingsApi, SettingsApiError, type SettingsWorkspace } from "../src/production-business-settings-api.js";

const workspace: SettingsWorkspace = {
  scope: { kind: "BRANCH", branchId: "branch-1", branchName: "Delhi" }, draftVersion: 2, publishedVersion: 1,
  inherited: { defaultLaborRateMinor: 150000, defaultJobDurationMinutes: 60, customerUpdatesEnabled: true, invoiceFooter: "Thanks" },
  overrides: {}, effective: { defaultLaborRateMinor: 150000, defaultJobDurationMinutes: 60, customerUpdatesEnabled: true, invoiceFooter: "Thanks" }, updatedAt: "2026-09-14T00:00:00.000Z",
};

test("Business Settings client scopes reads and sends versioned authenticated publication commands", async () => {
  const calls: { url: string; init?: RequestInit }[] = [];
  const fetcher = async (input: RequestInfo | URL, init?: RequestInit) => { calls.push({ url: String(input), init }); return new Response(JSON.stringify(workspace), { status: 200, headers: { "content-type": "application/json" } }); };
  const api = createProductionBusinessSettingsApi({ mode: "local", identity: "north-admin" }, fetcher);
  await api.get("branch-1"); await api.save(workspace, {}); await api.publish(workspace, "publish-key");
  assert.equal(calls[0].url, "/api/v1/admin/business-settings?branchId=branch-1");
  assert.equal(new Headers(calls[1].init?.headers).get("x-workshopos-identity"), "north-admin");
  assert.deepEqual(JSON.parse(String(calls[1].init?.body)), { branchId: "branch-1", version: 2, values: {} });
  assert.equal(new Headers(calls[2].init?.headers).get("idempotency-key"), "publish-key");
});

test("Business Settings client surfaces a safe conflict with its trace reference", async () => {
  const api = createProductionBusinessSettingsApi({ mode: "local", identity: "north-admin" }, async () => new Response(JSON.stringify({ code: "VERSION_CONFLICT", traceId: "trace-settings" }), { status: 409, headers: { "content-type": "application/json" } }));
  await assert.rejects(() => api.publish(workspace), (error: unknown) => error instanceof SettingsApiError && error.traceId === "trace-settings" && /Refresh/.test(error.message));
});
