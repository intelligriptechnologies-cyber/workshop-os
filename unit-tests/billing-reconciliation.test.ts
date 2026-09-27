import assert from "node:assert/strict";
import test from "node:test";
import { billingReconciliation } from "../src/invoice-math";
import type { JobView } from "../src/types";

const view = (patch: Partial<JobView>): JobView => ({
  job: { id: 1, job_no: "JC-1", main_status: "CLOSED", delivery_by: "Accounts", acknowledgement: "Received" },
  invoice: { id: 2, job_card_id: 1, invoice_no: "INV-2", total: 100, status: "Cleared", document_available: 1 },
  payments: [{ id: 3, job_card_id: 1, invoice_id: 2, amount: 100, mode: "Cash", reference: "", notes: "", other_detail: "" }],
  receipt: { id: 4, job_card_id: 1, invoice_id: 2, receipt_no: "RCT-4" },
  gate_pass: { id: 5, job_card_id: 1, invoice_id: 2, gate_pass_no: "GP-5" },
  ...patch,
} as JobView);

test("reconciliation requires current invoice, payment, receipt, gate pass and delivery acknowledgement", () => {
  assert.deepEqual(billingReconciliation(view({})).missing, []);
  assert.equal(billingReconciliation(view({})).complete, true);
  assert.deepEqual(billingReconciliation(view({ receipt: undefined, gate_pass: { id: 5, job_card_id: 1, invoice_id: 2, gate_pass_no: "GP-5", voided_at: "2026-01-01" }, job: { id: 1, job_no: "JC-1", main_status: "CLOSED", delivery_by: "", acknowledgement: "" } as never })).missing, ["Receipt", "Gate pass", "Delivery acknowledgement"]);
});
