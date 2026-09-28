import assert from "node:assert/strict";
import test from "node:test";
import { jobMatchesPeriod, localCalendarDate, selectedJobRemainsInPeriod, todayJobPeriod } from "../src/job-picker";
import type { JobView } from "../src/types";

const view = (received_at: string, id = 1) => ({ job: { id }, visit: { received_at } }) as JobView;

test("job picker derives its current Month-Year from the local calendar", () => {
  const now = new Date("2026-09-26T00:30:00+05:30");
  assert.equal(localCalendarDate(now), "2026-09-26");
  assert.deepEqual(todayJobPeriod(now), { monthYear: "2026-09" });
});

test("period changes invalidate a selected job instead of choosing a replacement", () => {
  const jobs = [view("2026-09-26T09:00:00.000Z", 1), view("2026-08-26T09:00:00.000Z", 2)];
  assert.equal(selectedJobRemainsInPeriod(jobs, 1, { monthYear: "2026-08" }), false);
  assert.equal(selectedJobRemainsInPeriod(jobs, 2, { monthYear: "2026-08" }), true);
});

test("jobs match one Month-Year or the unfiltered all-months option", () => {
  const september = view("2026-09-26T09:00:00.000Z");
  const august = view("2026-08-26T09:00:00.000Z");
  assert.equal(jobMatchesPeriod(september, { monthYear: "2026-08" }), false);
  assert.equal(jobMatchesPeriod(august, { monthYear: "2026-08" }), true);
  assert.equal(jobMatchesPeriod(august, { monthYear: "ALL" }), true);
});
