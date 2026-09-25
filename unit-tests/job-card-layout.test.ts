import assert from "node:assert/strict";
import test from "node:test";
import { JOB_CARD_TABS, isStubTab, resolveJobCardFooter } from "../src/job-card-layout";
import type { JobView } from "../src/types";

const view = (main_status: string, extra: Record<string, unknown> = {}) => ({
  job: { id: 1, advisor_id: 2, main_status },
  estimate: undefined, invoice: undefined, estimate_items: [], invoice_items: [], payments: [], ...extra,
}) as unknown as JobView;

test("tab set and order match the dialog layout", () => {
  assert.deepEqual(JOB_CARD_TABS.map((t) => t.label), ["Details", "Materials", "Documents", "Photos / Media", "Invoice", "Payment"]);
});

test("unbuilt tabs are stubs, built tabs are not", () => {
  assert.deepEqual(JOB_CARD_TABS.filter((t) => isStubTab(t.key)).map((t) => t.key), ["materials", "invoice", "payment"]);
});

test("footer offers Create Estimate to the owner and lists Job Card download", () => {
  const footer = resolveJobCardFooter(view("IN_PROGRESS"), { id: 1, role: "admin" });
  assert.deepEqual(footer.actions, ["create-estimate"]);
  const jobCard = footer.downloads.find((d) => d.kind === "job-card");
  assert.ok(jobCard);
  const estimate = footer.downloads.find((d) => d.kind === "estimate");
  assert.equal(estimate?.enabled, false);
  assert.match(estimate?.reason ?? "", /not created/);
});

test("footer gives read-only roles no actions", () => {
  assert.deepEqual(resolveJobCardFooter(view("IN_PROGRESS"), { id: 9, role: "tech" }).actions, []);
});
