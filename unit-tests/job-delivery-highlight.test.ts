import assert from "node:assert/strict";
import test from "node:test";
import { jobDeliveryClass, jobDeliveryTone } from "../src/job-delivery-highlight";
import type { JobCard } from "../src/types";

const today = "2026-10-09";
const job = (estimated_delivery?: string, main_status: JobCard["main_status"] = "NEW", archived_at?: string) => ({
  estimated_delivery,
  main_status,
  archived_at,
});

test("estimated delivery highlights local calendar boundaries", () => {
  assert.equal(jobDeliveryTone(job("2026-10-08"), today), "overdue");
  assert.equal(jobDeliveryTone(job("2026-10-09"), today), "approaching");
  assert.equal(jobDeliveryTone(job("2026-10-16"), today), "approaching");
  assert.equal(jobDeliveryTone(job("2026-10-17"), today), undefined);
  assert.equal(jobDeliveryClass(job("2026-10-08"), today), "job-delivery-overdue");
});

test("invalid or missing delivery dates have no highlight", () => {
  for (const value of [undefined, "", "2026-02-30", "2026-13-01", "2026-10-09T00:00:00Z", "garbage"])
    assert.equal(jobDeliveryTone(job(value), today), undefined);
  assert.equal(jobDeliveryTone(job("2026-10-09"), "invalid"), undefined);
});

test("only active unarchived jobs receive delivery highlights", () => {
  for (const status of ["NEW", "IN_PROGRESS", "HOLD", "COMPLETED"] as const)
    assert.equal(jobDeliveryTone(job("2026-10-09", status), today), "approaching");
  for (const status of ["CLOSED", "CANCELLED"] as const)
    assert.equal(jobDeliveryTone(job("2026-10-08", status), today), undefined);
  assert.equal(jobDeliveryTone(job("2026-10-08", "COMPLETED", "2026-10-09"), today), undefined);
});
