import assert from "node:assert/strict";
import test from "node:test";
import {
  createOperationalApi,
  OpsApiError,
} from "../src/production-estimates-tasks-qc-api";

test("operational client authenticates versioned and idempotent estimate, task, and QC commands", async () => {
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  const fetcher = async (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(input), init });
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  };
  const api = createOperationalApi(
    { mode: "local", identity: "north-admin" },
    fetcher as typeof fetch,
  );
  await api.createEstimate({
    jobId: "job",
    branchId: "branch",
    totalMinor: "100",
  });
  await api.updateEstimate("estimate-1", {
    version: 1,
    totalMinor: "125",
    notes: "revised",
  });
  await api.task("task-1", "evidence", {
    version: 3,
    checklistKey: "finish",
    evidenceId: "media-1",
  });
  await api.inspect("task-1", { version: 4, result: "PASS", items: [] });
  assert.deepEqual(
    calls.map((x) => x.url),
    [
      "/api/v1/estimates",
      "/api/v1/estimates/estimate-1/draft",
      "/api/v1/tasks/task-1/evidence",
      "/api/v1/tasks/task-1/qc-inspections",
    ],
  );
  for (const call of calls) {
    const headers = new Headers(call.init?.headers);
    assert.equal(headers.get("x-workshopos-identity"), "north-admin");
    assert.ok(headers.get("idempotency-key"));
  }
  assert.match(String(calls[1].init?.body), /"version":1/);
  assert.match(String(calls[2].init?.body), /"evidenceId":"media-1"/);
});

test("operational client retains readable trace references", async () => {
  const api = createOperationalApi(
    { mode: "local", identity: "north-admin" },
    async () =>
      new Response(
        JSON.stringify({ code: "VERSION_CONFLICT", traceId: "trace-v12" }),
        { status: 409, headers: { "content-type": "application/json" } },
      ) as any,
  );
  await assert.rejects(
    () => api.tasks(),
    (error: unknown) =>
      error instanceof OpsApiError &&
      error.traceId === "trace-v12" &&
      /changed/.test(error.message),
  );
});
