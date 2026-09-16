import assert from "node:assert/strict";
import test from "node:test";
import {
  createEstimateDocument,
  ESTIMATE_PERMISSIONS,
  QC_PERMISSIONS,
  TASK_PERMISSIONS,
} from "../src/estimate-task-qc.js";
import { permissionKeys } from "../src/role-permissions.js";

test("V12-12 permissions use one catalog for navigation and API authorization", () => {
  const known = new Set(permissionKeys());
  for (const key of [
    ...ESTIMATE_PERMISSIONS,
    ...TASK_PERMISSIONS,
    ...QC_PERMISSIONS,
  ])
    assert.ok(known.has(key), `${key} missing from catalog`);
});

test("estimate document identifies the intended immutable version", () => {
  const artifact = createEstimateDocument({
    id: "estimate-1",
    jobNumber: "JOB-1",
    revision: 7,
    documentNumber: "EST-007",
    status: "APPROVED",
    notes: "Approved scope",
    totalMinor: "12345",
    currency: "INR",
    validUntil: "2026-10-01T00:00:00.000Z",
  });
  assert.equal(artifact.mimeType, "application/pdf");
  assert.match(artifact.filename, /EST-007-v7/);
  assert.ok(artifact.content.subarray(0, 4).equals(Buffer.from("%PDF")));
});
