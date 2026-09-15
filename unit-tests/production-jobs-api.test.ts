import assert from "node:assert/strict";
import test from "node:test";

import { createJobsApi, JobApiError } from "../src/production-jobs-api.js";

test("Jobs client serializes URL state and preserves document error codes", async () => {
  const calls: Array<{ url: string; headers: Headers }> = [];
  const api = createJobsApi(
    { mode: "local", identity: "north-admin" },
    async (input, init) => {
      const url = String(input);
      const headers = new Headers(init?.headers);
      calls.push({ url, headers });
      if (url.includes("job-documents"))
        return new Response(
          JSON.stringify({
            code: "JOB_DOCUMENT_NOT_FOUND",
            traceId: "trace-doc",
          }),
          { status: 404, headers: { "content-type": "application/json" } },
        );
      return new Response(
        JSON.stringify({
          jobs: [],
          page: {},
          query: {},
          timezone: "Asia/Kolkata",
        }),
        { headers: { "content-type": "application/json" } },
      );
    },
  );
  await api.list({
    search: "Asha",
    branchId: "branch",
    visitDate: "2026-09-15",
    stage: "ACTIVE",
    sort: "visitDate.asc",
    page: 2,
    pageSize: 50,
  });
  assert.match(calls[0].url, /visitDate=2026-09-15/);
  assert.match(calls[0].url, /pageSize=50/);
  assert.equal(calls[0].headers.get("x-workshopos-identity"), "north-admin");
  await assert.rejects(
    () => api.document("missing"),
    (error: JobApiError) =>
      error.code === "JOB_DOCUMENT_NOT_FOUND" && error.traceId === "trace-doc",
  );
});

test("Jobs client uses versioned idempotent lifecycle commands and record-specific Data Flow", async () => {
  const calls: Array<{
    url: string;
    method: string;
    key: string | null;
    body?: any;
  }> = [];
  const api = createJobsApi(
    { mode: "local", identity: "north-admin" },
    async (input, init) => {
      calls.push({
        url: String(input),
        method: init?.method ?? "GET",
        key: new Headers(init?.headers).get("idempotency-key"),
        body: init?.body ? JSON.parse(String(init.body)) : undefined,
      });
      return new Response(
        JSON.stringify(
          String(input).startsWith("/api/v1/job-data-flow/jobs")
            ? { jobs: [] }
            : String(input).endsWith("data-flow")
            ? { dataFlow: { selectedJob: { id: "job-1" }, sections: [] } }
            : { lifecycle: { canonicalStage: "ACTIVE", version: 3 } },
        ),
        { headers: { "content-type": "application/json" } },
      );
    },
  );
  await api.lifecycle("job-1");
  await api.commandLifecycle("job-1", {
    command: "HOLD",
    version: 3,
    reason: "Awaiting customer",
  });
  await api.dataFlow("job-1");
  await api.dataFlowJobs("Asha Rao");
  assert.deepEqual(
    calls.map((call) => [call.url, call.method]),
    [
      ["/api/v1/jobs/job-1/lifecycle", "GET"],
      ["/api/v1/jobs/job-1/lifecycle", "POST"],
      ["/api/v1/jobs/job-1/data-flow", "GET"],
      ["/api/v1/job-data-flow/jobs?search=Asha%20Rao", "GET"],
    ],
  );
  assert.equal(calls[1].body.version, 3);
  assert.ok(calls[1].key);
});
