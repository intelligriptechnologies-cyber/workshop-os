import assert from "node:assert/strict";
import test from "node:test";
import * as XLSX from "xlsx";

import { createJobCardPdf, createJobListExportArtifact } from "../src/job-export.js";
import { jobStageLabel, parseJobListQuery } from "../src/job-list-contract.js";
import type { JobRecord } from "../local/database.js";

const job: JobRecord = {
  id: "job-1", tenantId: "tenant", branchId: "branch", jobNumber: "JOB-00000001", visitId: "visit-1",
  visitDate: "2026-09-15", checkedInAt: "2026-09-15T04:00:00.000Z", customerName: "Asha Rao",
  registration: "DL01AB1234", vehicleDescription: "Honda City", customerRequest: "Annual service",
  promisedHandoffAt: "2026-09-15T12:00:00.000Z", stage: "ACTIVE", statusLabel: "In Progress",
  version: 1, updatedAt: "2026-09-15T04:00:00.000Z", documents: [], settingsSnapshotCaptured: true,
};

test("Job list query accepts only real dates, canonical stages, sorts, and page sizes", () => {
  const valid = parseJobListQuery(new URLSearchParams("visitDate=2026-09-15&stage=ACTIVE&sort=jobNumber.asc&page=2&pageSize=50&search=%20Asha%20"));
  assert.deepEqual(valid, { visitDate: "2026-09-15", stage: "ACTIVE", sort: "jobNumber.asc", page: 2, pageSize: 50, search: "Asha", branchId: "" });
  const invalid = parseJobListQuery(new URLSearchParams("visitDate=2026-02-31&stage=UNKNOWN&sort=random&page=-2&pageSize=10"));
  assert.deepEqual(invalid, { visitDate: "", stage: "", sort: "visitDate.desc", page: 1, pageSize: 25, search: "", branchId: "" });
  assert.equal(jobStageLabel("ACTIVE"), "In Progress");
});

test("Job exports contain every supplied filtered row and Job Card is a real PDF", () => {
  const rows = Array.from({ length: 26 }, (_, index) => ({ ...job, id: `job-${index + 1}`, jobNumber: `JOB-${String(index + 1).padStart(8, "0")}` }));
  const artifact = createJobListExportArtifact("XLSX", rows);
  const workbook = XLSX.read(artifact.content);
  assert.equal(XLSX.utils.sheet_to_json(workbook.Sheets.Jobs).length, 26);
  assert.equal(artifact.rowCount, 26);
  const card = createJobCardPdf(job);
  assert.equal(card.mimeType, "application/pdf");
  assert.equal(card.content.subarray(0, 4).toString(), "%PDF");
  assert.match(card.filename, /JOB-00000001/);
});
