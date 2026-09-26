import assert from "node:assert/strict";
import test from "node:test";
import { jobMatchesPeriod, localCalendarDate, selectedJobRemainsInPeriod, todayJobPeriod } from "../src/job-picker";
import type { JobView } from "../src/types";

const view = (received_at: string, id = 1) => ({ job: { id }, visit: { received_at } }) as JobView;

test("job picker starts from the local calendar day", () => {
  const now = new Date("2026-09-26T00:30:00+05:30");
  assert.equal(localCalendarDate(now), "2026-09-26");
  assert.deepEqual(todayJobPeriod(now), { date: "2026-09-26", month: "09", year: "2026" });
});

test("period changes invalidate a selected job instead of choosing a replacement", () => {
  const jobs = [view("2026-09-26T09:00:00.000Z", 1), view("2026-08-26T09:00:00.000Z", 2)];
  assert.equal(selectedJobRemainsInPeriod(jobs, 1, { date: "", month: "08", year: "2026" }), false);
  assert.equal(selectedJobRemainsInPeriod(jobs, 2, { date: "", month: "08", year: "2026" }), true);
});

test("exact received date is primary, with month/year and all fallbacks", () => {
  const september = view("2026-09-26T09:00:00.000Z");
  const august = view("2026-08-26T09:00:00.000Z");
  assert.equal(jobMatchesPeriod(september, { date: "2026-09-26", month: "08", year: "2025" }), true);
  assert.equal(jobMatchesPeriod(august, { date: "", month: "09", year: "2026" }), false);
  assert.equal(jobMatchesPeriod(august, { date: "", month: "ALL", year: "2026" }), true);
  assert.equal(jobMatchesPeriod(august, { date: "", month: "ALL", year: "ALL" }), true);
});
