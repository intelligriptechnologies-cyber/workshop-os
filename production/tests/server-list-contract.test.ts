import assert from "node:assert/strict";
import test from "node:test";

import { parseListQuery } from "../src/server-list-contract.js";
import { createWorkItemExportArtifact } from "../src/work-item-export.js";

test("work-item list query normalizes URL state and accepts only supported pagination and sorting", () => {
  assert.deepEqual(parseListQuery(new URLSearchParams("search=%20brakes%20&page=2&pageSize=50&sort=summary.asc&branchId=branch-a")), {
    search: "brakes", branchId: "branch-a", sort: "summary.asc", page: 2, pageSize: 50,
  });
  assert.deepEqual(parseListQuery(new URLSearchParams("page=-2&pageSize=10&sort=version.desc")), {
    search: "", branchId: "", sort: "updatedAt.desc", page: 1, pageSize: 25,
  });
});

test("work-item export artifacts include every supplied authorized row", () => {
  const rows = Array.from({ length: 51 }, (_, index) => ({
    id: `id-${index}`, tenantId: "tenant-a", branchId: "branch-a", summary: `Item ${index}`, version: 1, updatedAt: "2026-09-13T00:00:00.000Z",
  }));
  const artifact = createWorkItemExportArtifact("XLSX", rows);
  assert.equal(artifact.rowCount, 51);
  assert.equal(artifact.mimeType, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  assert.ok(artifact.content.byteLength > 100);

  const pdf = createWorkItemExportArtifact("PDF", rows);
  assert.equal(pdf.rowCount, 51);
  assert.equal(pdf.mimeType, "application/pdf");
  assert.equal(pdf.content.subarray(0, 4).toString(), "%PDF");
});
