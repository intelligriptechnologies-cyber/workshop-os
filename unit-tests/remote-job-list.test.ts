import assert from "node:assert/strict";
import test from "node:test";
import { filterRemoteJobs, remoteJobDeliveryClass } from "../src/remote-job-list";
import type { RemoteJob } from "../src/jobs-api";

const job = (id: number, estimatedDelivery: string | null, status = "NEW", archivedAt: string | null = null) => ({
  id, jobNo: `JC-${id}`, estimatedDelivery, status, archivedAt,
}) as RemoteJob;

test("remote list filters authoritative delivery and leaves undated jobs in all months", () => {
  const jobs = [job(1, "2026-10-09"), job(2, "2026-11-02"), job(3, null)];
  assert.deepEqual(filterRemoteJobs(jobs, { month: "2026-10", date: "", sort: "newest" }).map((item) => item.id), [1]);
  assert.deepEqual(filterRemoteJobs(jobs, { month: "", date: "2026-11-02", sort: "newest" }).map((item) => item.id), [2]);
  assert.deepEqual(filterRemoteJobs(jobs, { month: "", date: "", sort: "newest" }).map((item) => item.id), [3, 2, 1]);
  assert.deepEqual(filterRemoteJobs(jobs, { month: "", date: "", sort: "delivery-soonest" }).map((item) => item.id), [1, 2, 3]);
  assert.deepEqual(filterRemoteJobs(jobs, { month: "", date: "", sort: "delivery-latest" }).map((item) => item.id), [2, 1, 3]);
});

test("remote urgency uses local calendar boundaries and excludes terminal or archived jobs", () => {
  const today = "2026-10-09";
  assert.equal(remoteJobDeliveryClass(job(1, "2026-10-08"), today), "job-delivery-overdue");
  assert.equal(remoteJobDeliveryClass(job(2, "2026-10-09"), today), "job-delivery-approaching");
  assert.equal(remoteJobDeliveryClass(job(3, "2026-10-16"), today), "job-delivery-approaching");
  for (const candidate of [job(4, "2026-10-17"), job(5, null), job(6, "2026-02-30"), job(7, "2026-10-08", "CLOSED"), job(8, "2026-10-08", "CANCELLED"), job(9, "2026-10-08", "NEW", "2026-10-01")]) {
    assert.equal(remoteJobDeliveryClass(candidate, today), "");
  }
});
