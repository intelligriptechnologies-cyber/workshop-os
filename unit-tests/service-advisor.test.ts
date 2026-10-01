import assert from "node:assert/strict";
import test from "node:test";
import { canAddServiceFollowup, serviceFollowupStatus } from "../src/service-advisor";

test("service follow-up status includes counts for empty and pending histories", () => {
  assert.equal(serviceFollowupStatus({ followups: [] }), "Pending (0/0)");
  assert.equal(serviceFollowupStatus({ followups: [{ id: 1, job_card_id: 1, note: "Call customer", due_at: "2026-09-27", done: 1 }, { id: 2, job_card_id: 1, note: "Confirm visit", due_at: "2026-09-28", done: 0 }] }), "Pending (1/2)");
});

test("service follow-up status is Done with the exact completed count only when every saved record is complete", () => {
  assert.equal(serviceFollowupStatus({ followups: [{ id: 1, job_card_id: 1, note: "Call customer", due_at: "2026-09-27", done: 1 }, { id: 2, job_card_id: 1, note: "Confirm visit", due_at: "2026-09-28", done: 1 }] }), "Done(2)");
});

test("only operational follow-up statuses permit new contacts", () => {
  for (const main_status of ["NEW", "IN_PROGRESS", "COMPLETED"] as const)
    assert.equal(canAddServiceFollowup({ job: { main_status } }), true);
  for (const main_status of ["HOLD", "CLOSED", "CANCELLED"] as const)
    assert.equal(canAddServiceFollowup({ job: { main_status } }), false);
});
