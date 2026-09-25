import assert from "node:assert/strict";
import test from "node:test";
import { documentInfo, renderJobDocument, resolveJobDocumentActions, resolveJobDocuments } from "../src/job-documents";
import type { DocumentSnapshot } from "../src/document-snapshots";
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

const currentInvoice = (status = "Open") => ({ id: 9, job_card_id: 7, invoice_no: "INV-9", tally_invoice_no: "T-9", total: 1062, status, document_available: 1 }) as JobView["invoice"];
const rows = (view: JobView, snapshots: DocumentSnapshot[] = []) => resolveJobDocuments(view, snapshots).map((item) => [item.kind, item.state]);

test("Job Card sheet is always available and the four slots follow the creation rules", () => {
  assert.deepEqual(rows(job({ estimate: undefined })), [["job-card", "ready"], ["estimate", "missing"], ["invoice", "missing"], ["payment-receipt", "missing"], ["gate-pass", "missing"]]);
  const noEstimate = resolveJobDocuments(job({ estimate: undefined }));
  assert.equal(noEstimate.find((item) => item.kind === "estimate")?.message, "Estimate not created");
  assert.match(noEstimate.find((item) => item.kind === "invoice")?.message ?? "", /approve an estimate first/);
  assert.match(noEstimate.find((item) => item.kind === "payment-receipt")?.message ?? "", /when a payment is recorded/);
  assert.match(noEstimate.find((item) => item.kind === "gate-pass")?.message ?? "", /when the job is closed/);
  // no document is created by status alone
  assert.deepEqual(rows(job({ job: { ...job().job, main_status: "COMPLETED" } })).map((row) => row[1]), ["ready", "frozen", "missing", "missing", "missing"]);
  assert.equal(resolveJobDocuments(job()).find((item) => item.kind === "invoice")?.message, "Invoice not created");
});

test("Approved estimate, Cleared invoice, receipt and gate pass are frozen; Open invoice is ready", () => {
  assert.equal(documentInfo("estimate", job())?.frozen, true);
  assert.equal(documentInfo("estimate", job({ estimate: { ...job().estimate!, status: "Draft" } }))?.frozen, false);
  assert.deepEqual(documentInfo("invoice", job({ invoice: currentInvoice("Open") })), { number: "INV-9", frozen: false });
  assert.equal(documentInfo("invoice", job({ invoice: currentInvoice("Cleared") }))?.frozen, true);
  const closed = job({ job: { ...job().job, main_status: "CLOSED" }, invoice: currentInvoice("Cleared"), payments: [{ id: 1, job_card_id: 7, invoice_id: 9, amount: 1062, mode: "UPI", reference: "P" }] as JobView["payments"], receipt: { id: 1, job_card_id: 7, invoice_id: 9, receipt_no: "RCT-4509" }, gate_pass: { id: 1, job_card_id: 7, invoice_id: 9, gate_pass_no: "GP-3109" } });
  assert.deepEqual(rows(closed).map((row) => row[1]), ["ready", "frozen", "frozen", "frozen", "frozen"]);
});

test("void documents stay listed from their snapshots; cancelled jobs are read-only", () => {
  const snap = { id: "s1", jobId: 7, jobNo: "JC-2026-001245", kind: "invoice", number: "INV-8", state: "void", templateId: "t", html: "<p>x</p>", values: {}, lines: [], frozenAt: "" } as DocumentSnapshot;
  const listed = resolveJobDocuments(job(), [snap]);
  assert.deepEqual(listed.at(-1) && [listed.at(-1)!.kind, listed.at(-1)!.state, listed.at(-1)!.number, listed.at(-1)!.snapshotId], ["invoice", "void", "INV-8", "s1"]);
  assert.equal(resolveJobDocuments(job(), [{ ...snap, jobNo: "OTHER" }]).length, 5);
  const cancelled = job({ job: { ...job().job, main_status: "CANCELLED" }, estimate: undefined, estimate_items: [] });
  assert.match(resolveJobDocuments(cancelled).find((item) => item.kind === "estimate")?.message ?? "", /job cancelled/);
  assert.deepEqual(resolveJobDocumentActions("estimate", cancelled, { id: 99, role: "admin" }), []);
  assert.deepEqual(resolveJobDocumentActions("estimate", { ...cancelled, estimate: job().estimate }, { id: 99, role: "admin" }), ["download"]);
});

test("live rendering uses the Active template and company branding, Gate Pass shows Cleared not amounts, Job Card embeds the static diagram", () => {
  const admin = loadAdminDemoState();
  const closed = job({ job: { ...job().job, main_status: "CLOSED", damage_marks: JSON.stringify([{ id: 1, x: 40, y: 30 }]) }, invoice: currentInvoice("Cleared"), payments: [{ id: 1, job_card_id: 7, invoice_id: 9, amount: 1062, mode: "UPI", reference: "P" }] as JobView["payments"], receipt: { id: 1, job_card_id: 7, invoice_id: 9, receipt_no: "RCT-4509" }, gate_pass: { id: 1, job_card_id: 7, invoice_id: 9, gate_pass_no: "GP-3109" } });
  const gate = renderJobDocument("gate-pass", closed, admin);
  assert.match(gate.html, /Cleared/);
  assert.doesNotMatch(gate.html, /balance|₹\s*1,?062/);
  assert.equal(gate.number, "GP-3109");
  const sheet = renderJobDocument("job-card", closed, admin);
  assert.match(sheet.html, /<svg[^>]*viewBox="0 0 100 200"/);
  assert.match(sheet.html, /1 damage mark recorded/);
  assert.match(renderJobDocument("estimate", closed, admin).html, new RegExp(admin.businessSettings.profile.businessName));
  assert.match(renderJobDocument("invoice", closed, admin).html, /₹/);
  assert.equal(renderJobDocument("invoice", closed, admin).filename, "JC-2026-001245-invoice.pdf");
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

test("document actions reflect record availability, lifecycle, assignment and billing permissions", () => {
  const owner = { id: 99, role: "admin" as const };
  const advisor = { id: 1, role: "service" as const };
  const otherAdvisor = { id: 4, role: "service" as const };
  const accounts = { id: 5, role: "accounts" as const };
  const missingEstimate = job({ estimate: undefined, estimate_items: [] });
  assert.deepEqual(resolveJobDocumentActions("estimate", missingEstimate, owner), ["create-estimate"]);
  assert.deepEqual(resolveJobDocumentActions("estimate", missingEstimate, advisor), ["create-estimate"]);
  assert.deepEqual(resolveJobDocumentActions("estimate", missingEstimate, otherAdvisor), []);
  assert.deepEqual(resolveJobDocumentActions("estimate", job({ estimate: { ...job().estimate!, status: "Draft" } }), advisor), ["edit-estimate", "approve-estimate", "download"]);
  assert.deepEqual(resolveJobDocumentActions("estimate", job({ estimate: { ...job().estimate!, status: "Approved" } }), advisor), ["edit-estimate", "download"]);

  const completed = job({ job: { ...job().job, main_status: "COMPLETED" }, invoice: undefined, invoice_items: [] });
  assert.deepEqual(resolveJobDocumentActions("invoice", completed, accounts), ["create-invoice"]);
  assert.deepEqual(resolveJobDocumentActions("invoice", completed, advisor), []);
  const invoiced = job({ job: { ...job().job, main_status: "COMPLETED" }, invoice: { id: 1, job_card_id: 7, invoice_no: "INV-1", tally_invoice_no: "T-1", total: 1062, status: "Open", document_available: 1 } });
  assert.deepEqual(resolveJobDocumentActions("invoice", invoiced, accounts), ["edit-invoice", "download"]);
  assert.deepEqual(resolveJobDocumentActions("invoice", invoiced, advisor), ["edit-invoice", "download"]);
  assert.deepEqual(resolveJobDocumentActions("invoice", invoiced, otherAdvisor), ["download"]);
  const inProgress = job({ job: { ...job().job, main_status: "IN_PROGRESS" }, invoice: undefined, invoice_items: [] });
  assert.deepEqual(resolveJobDocumentActions("invoice", inProgress, advisor), ["create-invoice"]);
  assert.deepEqual(resolveJobDocumentActions("invoice", inProgress, accounts), []);
  assert.deepEqual(resolveJobDocumentActions("invoice", { ...inProgress, estimate: { ...inProgress.estimate!, status: "Draft" } }, advisor), []);
  assert.deepEqual(resolveJobDocumentActions("job-card", invoiced, advisor), ["download"]);
});

test("job card renders the damage diagram even when a stored template lacks the placeholder", () => {
  const admin = loadAdminDemoState();
  const old = { ...admin, reportTemplates: admin.reportTemplates.map((t) => t.category === "job-card" ? { ...t, html: t.html.replace(/<h3>Vehicle damage<\/h3>{{blocks\.damage_diagram}}/, "") } : t) };
  assert.ok(!old.reportTemplates.find((t) => t.category === "job-card")!.html.includes("damage_diagram"));
  const view = job({ job: { ...job().job, damage_marks: JSON.stringify([{ id: 1, x: 30, y: 40 }]) } as JobView["job"] });
  const html = renderJobDocument("job-card", view, old, []).html;
  assert.match(html, /Vehicle damage diagram/);
  assert.match(html, /1 damage mark recorded/);
});
