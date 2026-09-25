import assert from "node:assert/strict";
import test from "node:test";
import { loadAdminDemoState, updateReportTemplate, updateBusinessSettings } from "../src/admin-demo-state";
import { planSnapshots } from "../src/document-snapshots";
import { renderJobDocument, resolveJobDocuments } from "../src/job-documents";
import type { JobView } from "../src/types";

function view(overrides: Partial<JobView> = {}): JobView {
  return {
    job: { id: 7, job_no: "JC-7", visit_id: 1, advisor_id: 1, technician_id: 2, main_status: "COMPLETED", sub_status: "", work_list: "Wash", promised_at: "2026-09-25", qc_status: "Pending", washing_needed: 0, closed_at: "", acknowledgement: "" },
    visit: { id: 1, customer_id: 1, vehicle_id: 1, advisor_id: 1, received_by: 1, received_at: "2026-09-23T09:00:00", fuel: "Half", keys: "1", accessories: "", requested_work: "Wash", photos_note: "" },
    customer: { id: 1, name: "Ravi", mobile: "9", type: "Individual" }, vehicle: { id: 1, customer_id: 1, number: "OD02", make: "Honda", model: "City", color: "White", km: 1 },
    advisor: { id: 1, email: "a", name: "Adv", role: "service", password: "" }, technician: { id: 2, email: "t", name: "Tech", role: "tech", password: "" },
    estimate: { id: 1, job_card_id: 7, status: "Approved", discount: 0, gst_rate: 18, approval_note: "" },
    estimate_items: [{ id: 1, estimate_id: 1, kind: "Service", description: "Wash", qty: 1, rate: 1000 }],
    invoice: { id: 9, job_card_id: 7, invoice_no: "INV-9", tally_invoice_no: "", discount: 0, gst_rate: 18, subtotal: 1000, gst_amount: 180, total: 1180, status: "Open", notes: "", document_available: 1 },
    invoice_items: [{ id: 1, invoice_id: 9, kind: "Service", description: "Wash", qty: 1, rate: 1000 }],
    material_requests: [], inventory: [], tasks: [], payments: [], photos: [], followups: [], qc_checks: [], status_history: [], material_movements: [],
    ...overrides,
  } as JobView;
}
const cleared = () => view({ invoice: { ...view().invoice!, status: "Cleared" }, payments: [{ id: 1, job_card_id: 7, invoice_id: 9, amount: 1180, mode: "UPI", reference: "R" }] as JobView["payments"], receipt: { id: 1, job_card_id: 7, invoice_id: 9, receipt_no: "RCT-4509" } });

test("approved estimate freezes on first sight; open invoice does not", () => {
  const snaps = planSnapshots([], undefined, [view()], loadAdminDemoState());
  assert.deepEqual(snaps.map((s) => [s.kind, s.number, s.state]), [["estimate", "EST-JC-7", "frozen"]]);
});

test("Cleared invoice and receipt freeze, and later template and settings edits do not change them", () => {
  const admin = loadAdminDemoState();
  const snaps = planSnapshots([], [view()], [cleared()], admin);
  assert.deepEqual(snaps.map((s) => s.kind).sort(), ["estimate", "invoice", "payment-receipt"]);
  const invoiceTemplate = admin.reportTemplates.find((t) => t.category === "invoice" && t.active)!;
  const edited = updateBusinessSettings(updateReportTemplate(admin, invoiceTemplate.id, { html: "<p>CHANGED {{report.number}}</p>" }), { profile: { businessName: "Renamed Co" } });
  const rendered = renderJobDocument("invoice", cleared(), edited, snaps);
  assert.equal(rendered.frozen, true);
  assert.doesNotMatch(rendered.html, /CHANGED|Renamed Co/);
  assert.match(rendered.html, new RegExp(admin.businessSettings.profile.businessName));
  assert.equal(snaps.find((s) => s.kind === "invoice")!.templateId, invoiceTemplate.id);
  // an unfrozen document follows the edit
  assert.match(renderJobDocument("invoice", view(), edited, snaps).html, /CHANGED/);
});

test("voiding keeps the document listed from its frozen copy; reopened invoice unfreezes", () => {
  const admin = loadAdminDemoState();
  const frozen = planSnapshots([], [view()], [cleared()], admin);
  const afterVoid = planSnapshots(frozen, [cleared()], [view({ invoice: undefined, invoice_items: [], receipt: undefined, payments: [] })], admin);
  const voided = afterVoid.filter((s) => s.state === "void").map((s) => [s.kind, s.number]).sort();
  assert.deepEqual(voided, [["invoice", "INV-9"], ["payment-receipt", "RCT-4509"]]);
  assert.deepEqual(resolveJobDocuments(view({ invoice: undefined }), afterVoid).filter((r) => r.state === "void").map((r) => r.number).sort(), ["INV-9", "RCT-4509"]);
  // unpaid invoice voided: no earlier snapshot, so it is frozen at void time from the last live view
  const unpaid = planSnapshots([], [view()], [view({ invoice: undefined, invoice_items: [] })], admin);
  assert.deepEqual(unpaid.filter((s) => s.kind === "invoice").map((s) => s.state), ["void"]);
  // payment voided: invoice reopens (Open), snapshot removed, receipt voided
  const reopened = planSnapshots(frozen, [cleared()], [view()], admin);
  assert.equal(reopened.some((s) => s.kind === "invoice" && s.state === "frozen"), false);
  assert.equal(reopened.some((s) => s.kind === "payment-receipt" && s.state === "void"), true);
});

test("a different job with the same id after a dataset swap does not produce void documents", () => {
  const admin = loadAdminDemoState();
  const swapped = view({ job: { ...view().job, job_no: "JC-OTHER" }, invoice: undefined, invoice_items: [], estimate: undefined });
  assert.equal(planSnapshots([], [cleared()], [swapped], admin).length, 0);
});
