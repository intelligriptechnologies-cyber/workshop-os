import assert from "node:assert/strict";
import test from "node:test";
import { serviceFollowupStatus } from "../src/service-advisor";

test("service follow-up status is Pending without records or when any record remains open", () => {
  assert.equal(serviceFollowupStatus({ followups: [] }), "Pending");
  assert.equal(serviceFollowupStatus({ followups: [{ id: 1, job_card_id: 1, note: "Call customer", due_at: "2026-09-27", done: 1 }, { id: 2, job_card_id: 1, note: "Confirm visit", due_at: "2026-09-28", done: 0 }] }), "Pending");
});

test("service follow-up status is Done only when every saved record is complete", () => {
  assert.equal(serviceFollowupStatus({ followups: [{ id: 1, job_card_id: 1, note: "Call customer", due_at: "2026-09-27", done: 1 }, { id: 2, job_card_id: 1, note: "Confirm visit", due_at: "2026-09-28", done: 1 }] }), "Done");
});
