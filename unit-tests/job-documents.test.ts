import assert from "node:assert/strict";
import test from "node:test";
import { buildJobDocumentModel, documentFilename, resolveJobDocuments } from "../src/job-documents";
import { loadAdminDemoState } from "../src/admin-demo-state";
import type { JobView } from "../src/types";

function job(overrides: Partial<JobView> = {}): JobView {
  return {
    job: { id: 7, job_no: "JC-2026-001245", visit_id: 1, advisor_id: 1, technician_id: 2, main_status: "IN_PROGRESS", sub_status: "Create Estimate", work_list: "Oil service", promised_at: "2026-09-25", qc_status: "Pending", washing_needed: 0, closed_at: "", acknowledgement: "" },
    visit: { id: 1, customer_id: 1, vehicle_id: 1, advisor_id: 1, received_by: 1, received_at: "2026-09-23T09:00:00", fuel: "Half", keys: "1", accessories: "", requested_work: "Oil service", photos_note: "" },
    customer: { id: 1, name: "Ravi Kumar", mobile: "9999999999", type: "Individual" },
    vehicle: { id: 1, customer_id: 1, number: "OD02AB1234", make: "Honda", model: "City", color: "White", km: 42000 },
    advisor: { id: 1, email: "a@a.com", name: "Advisor", role: "service", password: "" },
    technician: { id: 2, email: "t@a.com", name: "Tech", role: "tech", password: "" },
    estimate: { id: 1, job_card_id: 7, status: "Approved", discount: 100, gst_rate: 18, approval_note: "Approved" },
    estimate_items: [{ id: 1, estimate_id: 1, kind: "Service", description: "Oil service", qty: 2, rate: 500 }],
    material_requests: [], inventory: [], tasks: [], payments: [{ id: 1, job_card_id: 7, amount: 500, mode: "UPI", reference: "PAY-1" }], photos: [], followups: [], qc_checks: [], status_history: [], material_movements: [],
    ...overrides,
  };
}

test("document availability is cumulative across lifecycle statuses", () => {
  assert.deepEqual(resolveJobDocuments(job({ estimate: undefined })).map((item) => [item.kind, item.available, item.message]), [["job-card", true, undefined], ["estimate", false, "Estimate not created"]]);
  const completed = job({ job: { ...job().job, main_status: "COMPLETED" }, invoice: undefined });
  assert.deepEqual(resolveJobDocuments(completed).map((item) => [item.kind, item.available]), [["job-card", true], ["estimate", true], ["invoice", false]]);
  const closed = job({ job: { ...job().job, main_status: "CLOSED" }, invoice: { id: 1, job_card_id: 7, invoice_no: "INV-1", tally_invoice_no: "T-1", total: 1062, status: "Generated" } });
  assert.deepEqual(resolveJobDocuments(closed).map((item) => [item.kind, item.available]), [["job-card", true], ["estimate", true], ["invoice", true], ["payment-receipt", false], ["gate-pass", false]]);
});

test("non-progressing statuses expose only records that exist", () => {
  const view = job({ job: { ...job().job, main_status: "CANCELLED" }, invoice: { id: 1, job_card_id: 7, invoice_no: "INV-1", tally_invoice_no: "", total: 1062, status: "Generated" } });
  assert.deepEqual(resolveJobDocuments(view).map((item) => item.kind), ["job-card", "estimate", "invoice"]);
});

test("PDF models calculate totals, balance, branding and deterministic names", () => {
  const settings = loadAdminDemoState().businessSettings;
  const view = job({ invoice: { id: 1, job_card_id: 7, invoice_no: "INV-1", tally_invoice_no: "T-1", total: 1062, status: "Generated" }, gate_pass: { id: 1, job_card_id: 7, gate_pass_no: "GP-1" } });
  const estimate = buildJobDocumentModel("estimate", view, settings);
  const invoice = buildJobDocumentModel("invoice", view, settings);
  const gatePass = buildJobDocumentModel("gate-pass", view, settings);
  assert.equal(estimate.totals?.subtotal, 1000);
  assert.equal(estimate.totals?.total, 1062);
  assert.equal(invoice.totals?.balance, 562);
  assert.equal(gatePass.identifiers.documentNumber, "GP-1");
  assert.equal(documentFilename(view, "gate-pass"), "JC-2026-001245-gate-pass.pdf");
  assert.equal(estimate.business.name, settings.profile.businessName);
  assert.equal(estimate.business.gstin, settings.billing.gstin);
});

test("current document actions reject voided, unavailable, or mismatched financial records", () => {
  const currentInvoice = { id: 9, job_card_id: 7, invoice_no: "INV-9", tally_invoice_no: "T-9", total: 1062, status: "Cleared", document_available: 1 };
  const view = job({
    job: { ...job().job, main_status: "CLOSED" },
    invoice: currentInvoice,
    payments: [{ id: 10, job_card_id: 7, invoice_id: 9, amount: 1062, mode: "UPI", reference: "PAY-9" }],
    receipt: { id: 11, job_card_id: 7, invoice_id: 8, receipt_no: "RCT-STALE" },
    gate_pass: { id: 12, job_card_id: 7, invoice_id: 8, gate_pass_no: "GP-STALE" },
    invoice_history: [{ ...currentInvoice, id: 8, invoice_no: "INV-VOID", voided_at: "2026-09-24T10:00:00Z", void_reason: "Corrected" }, currentInvoice],
  });
  assert.deepEqual(resolveJobDocuments(view).map((item) => [item.kind, item.available]), [["job-card", true], ["estimate", true], ["invoice", true], ["payment-receipt", false], ["gate-pass", false]]);
  assert.equal(resolveJobDocuments(job({ job: { ...job().job, main_status: "COMPLETED" }, invoice: { ...currentInvoice, document_available: 0 } })).find((item) => item.kind === "invoice")?.available, false);
  assert.equal(resolveJobDocuments(job({ estimate: { ...job().estimate!, archived_at: "2026-09-24T10:00:00Z" } })).find((item) => item.kind === "estimate")?.available, false);
});
