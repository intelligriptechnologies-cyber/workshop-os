import assert from "node:assert/strict";
import test from "node:test";
import { buildDataFlowTimeline, buildGhostSteps, dataFlowDates, dataFlowMonths, filterDataFlowJobs, summarizeJobLifecycle } from "../src/data-flow";
import type { JobView, User } from "../src/types";

const job = (id: number, receivedAt: string, jobNo: string, customer: string, registration: string) => ({
  job: { id, job_no: jobNo },
  visit: { received_at: receivedAt },
  customer: { name: customer, mobile: `900000000${id}` },
  vehicle: { number: registration, make: "Honda", model: "City" },
}) as JobView;

const jobs = [
  job(1, "2026-08-01T09:00:00", "JC-001", "Asha Rao", "OD02AA0001"),
  job(2, "2026-09-23T11:00:00", "JC-002", "Ravi Kumar", "OD02BB0002"),
  job(3, "2026-09-03T08:00:00", "JC-003", "Mina Das", "OD02CC0003"),
];

test("Data Flow derives distinct visit months and dates newest first", () => {
  assert.deepEqual(dataFlowMonths(jobs), ["2026-09", "2026-08"]);
  assert.deepEqual(dataFlowDates(jobs, "2026-09"), ["2026-09-23", "2026-09-03"]);
  assert.deepEqual(dataFlowDates(jobs, ""), ["2026-09-23", "2026-09-03", "2026-08-01"]);
});

test("Data Flow combines normalized text, month, and exact-date filters", () => {
  assert.deepEqual(filterDataFlowJobs(jobs, { query: "  ravi  ", month: "2026-09", date: "" }).map((view) => view.job.id), [2]);
  assert.deepEqual(filterDataFlowJobs(jobs, { query: "od02", month: "2026-09", date: "2026-09-03" }).map((view) => view.job.id), [3]);
  assert.deepEqual(filterDataFlowJobs(jobs, { query: "missing", month: "", date: "" }), []);
});

test("chronological Data Flow combines lifecycle, financial, document and media audit events", () => {
  const view = {
    ...job(7, "2026-09-01T08:00:00.000Z", "JC-007", "Ravi", "OD02AB0007"),
    visit: { id: 1, received_at: "2026-09-01T08:00:00.000Z", received_by: 8, requested_work: "Service" },
    job: { id: 7, job_no: "JC-007", main_status: "COMPLETED", sub_status: "Invoice Ready" },
    checklist_cycles: [{ id: 10, job_card_id: 7, stage: "COMPLETED", cycle_number: 2, started_at: "2026-09-01T09:00:00.000Z", completed_at: null }],
    checklist_items: [
      { id: 11, checklist_cycle_id: 10, job_card_id: 7, stage: "COMPLETED", cycle_number: 2, item_key: "customer-verification", label: "Customer Verification", sort_order: 1, checked_by: 8, started_at: "2026-09-01T09:10:00.000Z", checked_at: "2026-09-01T09:20:00.000Z", completed_at: "2026-09-01T09:20:00.000Z" },
      { id: 12, checklist_cycle_id: 10, job_card_id: 7, stage: "COMPLETED", cycle_number: 2, item_key: "invoice-ready", label: "Invoice Ready", sort_order: 2, checked_by: null, started_at: "2026-09-01T09:20:00.000Z", checked_at: null, completed_at: null },
    ],
    status_history: [{ id: 2, job_card_id: 7, main_status: "COMPLETED", sub_status: "Customer Verification", note: "Work accepted", created_at: "2026-09-01T09:05:00.000Z" }],
    estimate_history: [{ id: 3, job_card_id: 7, status: "Approved", discount: 0, gst_rate: 18, approval_note: "Approved", created_at: "2026-09-01T08:30:00.000Z" }],
    invoice: undefined,
    invoice_history: [{ id: 4, job_card_id: 7, invoice_no: "INV-OLD", tally_invoice_no: "T-OLD", discount: 0, gst_rate: 18, subtotal: 100, gst_amount: 18, total: 118, status: "Open", notes: "", document_available: 1, document_generated_at: "2026-09-01T10:01:00.000Z", created_at: "2026-09-01T10:00:00.000Z", voided_at: "2026-09-01T10:20:00.000Z", void_reason: "Corrected" }],
    payments: [], payment_history: [{ id: 5, job_card_id: 7, invoice_id: 4, amount: 50, mode: "UPI", reference: "UPI-1", notes: "", other_detail: "", created_at: "2026-09-01T10:05:00.000Z", voided_at: "2026-09-01T10:15:00.000Z", void_reason: "Reversed" }],
    receipt_history: [{ id: 6, job_card_id: 7, invoice_id: 4, receipt_no: "RCT-OLD", created_at: "2026-09-01T10:10:00.000Z", voided_at: "2026-09-01T10:20:00.000Z", void_reason: "Invoice corrected" }],
    gate_pass_history: [],
    photos: [], photo_history: [{ id: 7, job_card_id: 7, label: "Front", src: "data:image/jpeg;base64,/9j/2Q==", category: "Before Work", created_at: "2026-09-01T08:40:00.000Z", updated_at: "2026-09-01T08:50:00.000Z", archived_at: "2026-09-01T08:55:00.000Z", archived_reason: "Retake" }],
  } as JobView;
  const users = [{ id: 8, name: "Asha Advisor" }] as User[];
  const events = buildDataFlowTimeline(view, users);
  assert.deepEqual(events.map((event) => event.timestamp), [...events.map((event) => event.timestamp)].sort());
  assert.ok(events.some((event) => event.title === "Customer Verification completed" && event.actor === "Asha Advisor"));
  assert.ok(events.some((event) => event.title === "Status changed to COMPLETED" && event.detail.includes("Work accepted")));
  assert.ok(events.some((event) => event.title === "Invoice PDF voided" && event.state === "voided"));
  assert.ok(events.some((event) => event.title === "Payment voided" && event.detail.includes("Reversed")));
  assert.ok(events.some((event) => event.title === "Media details edited"));
  assert.ok(events.some((event) => event.title === "Media archived" && event.detail.includes("Retake")));
});

test("terminal audit events suppress same-timestamp edits and retain invoice generation after availability changes", () => {
  const terminal = "2026-09-01T11:00:00.000Z";
  const view = {
    ...job(9, "2026-09-01T08:00:00.000Z", "JC-009", "Ravi", "OD02AB0009"),
    visit: { id: 1, received_at: "2026-09-01T08:00:00.000Z", requested_work: "Service" },
    job: { id: 9, job_no: "JC-009", main_status: "COMPLETED", sub_status: "Invoice Ready" },
    checklist_cycles: [], checklist_items: [], status_history: [], estimate_history: [],
    invoice: undefined,
    invoice_history: [{ id: 4, job_card_id: 9, invoice_no: "INV-9", tally_invoice_no: "T-9", discount: 0, gst_rate: 18, subtotal: 100, gst_amount: 18, total: 118, status: "Open", notes: "", document_available: 0, document_generated_at: "2026-09-01T10:05:00.000Z", created_at: "2026-09-01T10:00:00.000Z", updated_at: terminal, voided_at: terminal, void_reason: "Corrected" }],
    payments: [], payment_history: [{ id: 5, job_card_id: 9, invoice_id: 4, amount: 118, mode: "Cash", reference: "", notes: "", other_detail: "", created_at: "2026-09-01T10:10:00.000Z", updated_at: terminal, voided_at: terminal, void_reason: "Reversed" }],
    receipt_history: [], gate_pass_history: [], photos: [],
    photo_history: [{ id: 6, job_card_id: 9, label: "Front", src: "", category: "Before Work", created_at: "2026-09-01T10:15:00.000Z", updated_at: terminal, archived_at: terminal, archived_reason: "Retake" }],
  } as JobView;
  const titles = buildDataFlowTimeline(view).map((event) => event.title);
  assert.equal(titles.filter((title) => title === "Invoice PDF generated").length, 1);
  assert.equal(titles.filter((title) => title === "Invoice voided").length, 1);
  assert.equal(titles.filter((title) => title === "Payment voided").length, 1);
  assert.equal(titles.filter((title) => title === "Media archived").length, 1);
  assert.equal(titles.includes("Invoice updated"), false);
  assert.equal(titles.includes("Payment updated"), false);
  assert.equal(titles.includes("Media details edited"), false);
});

test("lifecycle summary reports the active cycle and ordered remaining steps", () => {
  const view = {
    ...job(7, "2026-09-01T08:00:00.000Z", "JC-007", "Ravi", "OD02AB0007"),
    job: { id: 7, job_no: "JC-007", main_status: "COMPLETED", sub_status: "Invoice Ready" },
    checklist_cycles: [{ id: 1, stage: "IN_PROGRESS", cycle_number: 1 }, { id: 2, stage: "COMPLETED", cycle_number: 2 }],
    checklist_items: [
      { id: 1, checklist_cycle_id: 2, label: "Customer Verification", sort_order: 1, checked_at: "2026-09-01T10:00:00Z" },
      { id: 2, checklist_cycle_id: 2, label: "Invoice Ready", sort_order: 2, checked_at: null },
      { id: 3, checklist_cycle_id: 2, label: "Payment Received", sort_order: 3, checked_at: null },
    ],
  } as JobView;
  assert.deepEqual(summarizeJobLifecycle(view), { stage: "COMPLETED", cycle: 2, activeStep: "Invoice Ready", remainingSteps: ["Invoice Ready", "Payment Received"], completed: false });
});

test("ghost steps list remaining checklist items then uncreated documents with reasons", () => {
  const view = {
    ...job(7, "2026-09-01T08:00:00.000Z", "JC-007", "Ravi", "OD02AB0007"),
    job: { id: 7, job_no: "JC-007", main_status: "COMPLETED", sub_status: "Invoice Ready" },
    estimate: undefined, invoice: undefined, receipt: undefined, gate_pass: undefined,
    checklist_cycles: [{ id: 2, stage: "COMPLETED", cycle_number: 1 }],
    checklist_items: [
      { id: 2, checklist_cycle_id: 2, label: "Invoice Ready", sort_order: 2, checked_at: null, required: 1, na_at: null },
      { id: 1, checklist_cycle_id: 2, label: "Customer Verification", sort_order: 1, checked_at: "2026-09-01T10:00:00Z", required: 1, na_at: null },
      { id: 3, checklist_cycle_id: 2, label: "Payment Received", sort_order: 3, checked_at: null, required: 1, na_at: "2026-09-01T10:30:00Z" },
    ],
  } as unknown as JobView;
  const ghosts = buildGhostSteps(view);
  assert.deepEqual(ghosts.map((ghost) => ghost.title), ["Invoice Ready", "Estimate", "Invoice", "Payment Receipt", "Gate Pass"]);
  assert.equal(ghosts[0].kind, "checklist");
  assert.match(ghosts.find((ghost) => ghost.title === "Gate Pass")!.reason, /not created/);
  assert.match(ghosts.find((ghost) => ghost.title === "Payment Receipt")!.reason, /payment is recorded/);
});

test("document-creating events carry a document reference; void ones are flagged", () => {
  const view = {
    ...job(9, "2026-09-01T08:00:00.000Z", "JC-009", "Ravi", "OD02AB0009"),
    visit: { id: 1, received_at: "2026-09-01T08:00:00.000Z", requested_work: "Service" },
    job: { id: 9, job_no: "JC-009", main_status: "COMPLETED", sub_status: "Invoice Ready" },
    checklist_cycles: [], checklist_items: [], status_history: [], photos: [], payments: [],
    invoice: undefined,
    invoice_history: [{ id: 4, invoice_no: "INV-9", status: "Open", document_available: 1, document_generated_at: "2026-09-01T10:05:00.000Z", created_at: "2026-09-01T10:00:00.000Z", voided_at: "2026-09-01T11:00:00.000Z", void_reason: "Wrong" }],
  } as unknown as JobView;
  const docs = buildDataFlowTimeline(view).filter((event) => event.document);
  assert.deepEqual(docs.map((event) => [event.title, event.document!.kind, Boolean(event.document!.void)]), [["Invoice PDF voided", "invoice", true]]);
});
