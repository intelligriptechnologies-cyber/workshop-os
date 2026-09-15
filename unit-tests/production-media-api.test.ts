import assert from "node:assert/strict";
import test from "node:test";

import {
  createMediaApi,
  MediaApiError,
  mediaSearch,
} from "../src/production-media-api.js";

test("media API keeps list state in HTTP and authenticates the local request", async () => {
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  const api = createMediaApi(
    { mode: "local", identity: "north-admin" },
    async (input, init) => {
      calls.push({ url: String(input), init });
      return new Response(
        JSON.stringify({
          media: [],
          page: {},
          query: {},
          timezone: "Asia/Kolkata",
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    },
  );
  await api.list({
    search: "Asha",
    branchId: "branch",
    visitDate: "2026-09-15",
    jobId: "job",
    category: "PROGRESS",
    includeArchived: false,
    page: 1,
    pageSize: 25,
  });
  assert.match(calls[0].url, /visitDate=2026-09-15/);
  assert.match(calls[0].url, /category=PROGRESS/);
  assert.equal(
    (calls[0].init?.headers as Record<string, string>)["x-workshopos-identity"],
    "north-admin",
  );
  assert.doesNotMatch(
    mediaSearch({
      search: "",
      branchId: "",
      visitDate: "",
      jobId: "",
      category: "",
      includeArchived: false,
      page: 1,
      pageSize: 25,
    }),
    /page=/,
  );
});

test("media API preserves readable server error and trace reference", async () => {
  const api = createMediaApi(
    { mode: "local", identity: "north-admin" },
    async () =>
      new Response(
        JSON.stringify({
          code: "MEDIA_NOT_AVAILABLE",
          message: "Original is quarantined.",
          traceId: "trace-media",
        }),
        { status: 404, headers: { "content-type": "application/json" } },
      ),
  );
  await assert.rejects(
    () => api.view("media-id"),
    (error: unknown) =>
      error instanceof MediaApiError &&
      error.code === "MEDIA_NOT_AVAILABLE" &&
      error.traceId === "trace-media" &&
      error.message === "Original is quarantined.",
  );
});
