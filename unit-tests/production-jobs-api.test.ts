import assert from "node:assert/strict";
import test from "node:test";

import { createJobsApi, JobApiError } from "../src/production-jobs-api.js";

test("Jobs client serializes URL state and preserves document error codes", async () => {
  const calls: Array<{ url: string; headers: Headers }> = [];
  const api = createJobsApi({ mode: "local", identity: "north-admin" }, async (input, init) => {
    const url = String(input); const headers = new Headers(init?.headers); calls.push({ url, headers });
    if (url.includes("job-documents")) return new Response(JSON.stringify({ code: "JOB_DOCUMENT_NOT_FOUND", traceId: "trace-doc" }), { status: 404, headers: { "content-type": "application/json" } });
    return new Response(JSON.stringify({ jobs: [], page: {}, query: {}, timezone: "Asia/Kolkata" }), { headers: { "content-type": "application/json" } });
  });
  await api.list({ search: "Asha", branchId: "branch", visitDate: "2026-09-15", stage: "ACTIVE", sort: "visitDate.asc", page: 2, pageSize: 50 });
  assert.match(calls[0].url, /visitDate=2026-09-15/);
  assert.match(calls[0].url, /pageSize=50/);
  assert.equal(calls[0].headers.get("x-workshopos-identity"), "north-admin");
  await assert.rejects(() => api.document("missing"), (error: JobApiError) => error.code === "JOB_DOCUMENT_NOT_FOUND" && error.traceId === "trace-doc");
});
