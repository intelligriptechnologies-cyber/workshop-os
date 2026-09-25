import assert from "node:assert/strict";
import test from "node:test";
import { ADMIN_DEMO_STORAGE_KEY, activateReportTemplate, createDefaultAdminDemoState, createReportTemplate, deleteReportTemplate, loadAdminDemoState, saveCompanyIdentity, updateBusinessSettings, updateReportTemplate, type SessionStorageLike } from "../src/admin-demo-state";
import { REPORT_PLACEHOLDERS, buildReportLines, buildReportValues, findUnsupportedPlaceholders, renderReportTemplate, reportAvailable, sampleReportValues } from "../src/report-templates";
import type { JobView } from "../src/types";

const NOW = "2026-09-24T10:00:00.000Z";

class MemoryStorage implements SessionStorageLike {
  values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
  removeItem(key: string) { this.values.delete(key); }
}

function job(overrides: Partial<JobView> = {}): JobView {
  return {
    job: { id: 7, job_no: "JC-7", visit_id: 1, advisor_id: 1, technician_id: 2, main_status: "CLOSED", sub_status: "Delivered", work_list: "Detailing", promised_at: "2026-09-24", qc_status: "Pass", washing_needed: 0, closed_at: "2026-09-24", acknowledgement: "Received" },
    visit: { id: 1, customer_id: 1, vehicle_id: 1, advisor_id: 1, received_by: 1, received_at: "2026-09-22T09:00:00", fuel: "Half", keys: "1", accessories: "", requested_work: "Detailing", photos_note: "" },
    customer: { id: 1, name: "Ravi <Kumar>", mobile: "9999999999", type: "Individual" },
    vehicle: { id: 1, customer_id: 1, number: "OD02AB1234", make: "Honda", model: "City", color: "White", km: 42000 },
    advisor: { id: 1, email: "a@a.com", name: "Advisor", role: "service", password: "" }, technician: { id: 2, email: "t@a.com", name: "Tech", role: "tech", password: "" },
    estimate: { id: 1, job_card_id: 7, status: "Approved", discount: 100, gst_rate: 18, approval_note: "Approved" },
    estimate_items: [{ id: 1, estimate_id: 1, kind: "Service", description: "Detailing", qty: 2, rate: 500 }],
    invoice: { id: 1, job_card_id: 7, invoice_no: "INV-7", tally_invoice_no: "T-7", total: 1062, status: "Generated", document_available: 1 },
    payments: [{ id: 1, job_card_id: 7, invoice_id: 1, amount: 500, mode: "UPI", reference: "PAY-1", created_at: NOW }, { id: 2, job_card_id: 7, invoice_id: 1, amount: 200, mode: "Cash", reference: "", created_at: NOW }],
    receipt: { id: 1, job_card_id: 7, invoice_id: 1, receipt_no: "REC-7" }, gate_pass: { id: 1, job_card_id: 7, invoice_id: 1, gate_pass_no: "GP-7" },
    material_requests: [], inventory: [], tasks: [], photos: [], followups: [], qc_checks: [], status_history: [], material_movements: [], ...overrides,
  };
}

test("defaults seed exactly one active template for every report category", () => {
  const state = createDefaultAdminDemoState(NOW);
  assert.equal(state.reportTemplates.length, 5);
  for (const category of ["estimate", "invoice", "gate-pass", "job-card", "payment-receipt"] as const) {
    assert.equal(state.reportTemplates.filter((template) => template.category === category && template.active).length, 1);
    assert.ok(REPORT_PLACEHOLDERS[category].length > 10);
  }
  assert.deepEqual(state.companyAssets, { logo: null, stamp: null, authorizedSignature: null });
  assert.match(state.reportTemplates.find((template) => template.category === "invoice")!.html, /{{blocks\.payment_details}}/);
});

test("older session JSON hydrates new defaults and repairs active-template invariants", () => {
  const storage = new MemoryStorage();
  const old = createDefaultAdminDemoState(NOW) as Record<string, unknown>;
  delete old.reportTemplates; delete old.companyAssets;
  storage.setItem(ADMIN_DEMO_STORAGE_KEY, JSON.stringify(old));
  assert.equal(loadAdminDemoState(storage, NOW).reportTemplates.length, 5);

  const broken = createDefaultAdminDemoState(NOW);
  broken.reportTemplates = broken.reportTemplates.map((template) => ({ ...template, active: false }));
  storage.setItem(ADMIN_DEMO_STORAGE_KEY, JSON.stringify(broken));
  assert.equal(loadAdminDemoState(storage, NOW).reportTemplates.filter((template) => template.active).length, 5);
});

test("template creation validates names/placeholders and active transfer is immutable", () => {
  const original = createDefaultAdminDemoState(NOW);
  const added = createReportTemplate(original, { category: "invoice", name: "Compact", html: "<h1>{{report.number}}</h1>" }, NOW);
  assert.equal(original.reportTemplates.length, 5);
  assert.equal(added.reportTemplates.length, 6);
  assert.throws(() => createReportTemplate(added, { category: "invoice", name: " compact ", html: "<p>duplicate</p>" }, NOW), /unique/i);
  assert.throws(() => createReportTemplate(added, { category: "invoice", name: "Bad", html: "{{customer.secret}}" }, NOW), /customer.secret/);
  assert.equal(added.reportTemplates.length, 6);

  const compact = added.reportTemplates.find((template) => template.name === "Compact")!;
  const activated = activateReportTemplate(added, compact.id, NOW);
  assert.equal(activated.reportTemplates.filter((template) => template.category === "invoice" && template.active).length, 1);
  assert.equal(activated.reportTemplates.find((template) => template.id === compact.id)?.active, true);
  assert.throws(() => updateReportTemplate(activated, compact.id, { active: false }, NOW), /activate another/i);
});

test("company identity saves name and assets atomically", () => {
  const original = createDefaultAdminDemoState(NOW);
  const saved = saveCompanyIdentity(original, " Apex Auto ", { logo: "data:image/png;base64,AA==", stamp: null, authorizedSignature: null });
  assert.equal(saved.businessSettings.profile.businessName, "Apex Auto");
  assert.equal(saved.companyAssets.logo, "data:image/png;base64,AA==");
  assert.equal(original.companyAssets.logo, null);
  assert.throws(() => saveCompanyIdentity(original, " ", saved.companyAssets), /required/i);
  assert.equal(original.businessSettings.profile.businessName, "WorkshopOS Demo Studio");
});

test("placeholder validation and rendering escape scalar values while preserving generated blocks", () => {
  assert.deepEqual(findUnsupportedPlaceholders("{{ customer.name }} {{evil.code}} {{evil.code}}", "invoice"), ["evil.code"]);
  const html = renderReportTemplate({ category: "invoice", html: "<p>{{customer.name}}</p>{{blocks.line_items}}" }, { ...sampleReportValues("invoice"), "customer.name": "<script>alert(1)</script>" });
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.match(html, /<table/);
});

test("report availability and values aggregate every payment and balance", () => {
  const state = createDefaultAdminDemoState(NOW);
  const view = job();
  assert.equal(reportAvailable("job-card", view), true);
  assert.equal(reportAvailable("payment-receipt", view), true);
  assert.equal(reportAvailable("payment-receipt", job({ receipt: undefined })), false);
  const values = buildReportValues("payment-receipt", view, state.businessSettings, state.companyAssets);
  assert.equal(values["receipt.number"], "REC-7");
  assert.match(values["invoice.paid"], /700/);
  assert.match(values["invoice.balance"], /362/);
  assert.match(values["blocks.payments"], /PAY-1/);
  assert.match(values["blocks.payments"], /Cash/);
});

test("invoice values expose saved billing placeholders and sanitize the configured payment block", () => {
  const original = createDefaultAdminDemoState(NOW);
  const saved = updateBusinessSettings(original, { billing: { bankName: "Saved & Safe Bank", bankBranch: "<script>unsafe</script>", upiId: "pay@sbi" } });
  const values = buildReportValues("invoice", job(), saved.businessSettings, saved.companyAssets);
  assert.equal(values["company.gstin"], saved.businessSettings.billing.gstin);
  assert.equal(values["company.bank_name"], "Saved & Safe Bank");
  assert.match(values["blocks.payment_details"], /Saved &amp; Safe Bank/);
  assert.match(values["blocks.payment_details"], /&lt;script&gt;unsafe&lt;\/script&gt;/);
  assert.doesNotMatch(values["blocks.payment_details"], /<script>/);

  const rendered = renderReportTemplate(
    { category: "invoice", html: "<p>{{company.bank_name}}</p>{{blocks.payment_details}}" },
    values,
  );
  assert.match(rendered, /Saved &amp; Safe Bank/);
  assert.match(rendered, /Tax &amp; Payment Details/);
});

test("invoice payment block omits blank rows and disappears when nothing is configured", () => {
  const state = createDefaultAdminDemoState(NOW);
  const blankBilling = { ...state.businessSettings.billing, gstin: "", bankAccountHolder: "", bankName: "", bankAccountNumber: "", bankIfsc: "", bankBranch: "", upiId: "" };
  const blank = buildReportValues("invoice", job(), { ...state.businessSettings, billing: blankBilling }, state.companyAssets);
  assert.equal(blank["blocks.payment_details"], "");

  const partial = buildReportValues("invoice", job(), { ...state.businessSettings, billing: { ...blankBilling, upiId: "pay@sbi" } }, state.companyAssets);
  assert.match(partial["blocks.payment_details"], /pay@sbi/);
  assert.doesNotMatch(partial["blocks.payment_details"], /Account holder/);
});

test("estimate is a seeded category with a default that uses the lines loop", () => {
  const state = createDefaultAdminDemoState(NOW);
  const estimate = state.reportTemplates.find((template) => template.category === "estimate")!;
  assert.equal(estimate.active, true);
  assert.match(estimate.html, /{{#lines}}/);
  assert.equal(reportAvailable("estimate", job()), true);
  assert.equal(reportAvailable("estimate", job({ estimate: undefined })), false);
});

test("{{#lines}} loops merge one row per line with escaped values; line keys only work inside the loop", () => {
  const view = job({ estimate_items: [{ id: 1, estimate_id: 1, kind: "Service", description: "<b>Wash</b>", qty: 2, rate: 500 }, { id: 2, estimate_id: 1, kind: "Part", description: "Wax", qty: 1, rate: 100 }] });
  const state = createDefaultAdminDemoState(NOW);
  const values = buildReportValues("estimate", view, state.businessSettings, state.companyAssets);
  const html = renderReportTemplate({ category: "estimate", html: "<ul>{{#lines}}<li>{{line.description}}:{{line.qty}}</li>{{/lines}}</ul>" }, values, buildReportLines("estimate", view));
  assert.equal((html.match(/<li>/g) ?? []).length, 2);
  assert.match(html, /&lt;b&gt;Wash&lt;\/b&gt;:2/);
  assert.deepEqual(findUnsupportedPlaceholders("{{line.qty}}", "estimate"), ["line.qty"]);
  assert.deepEqual(findUnsupportedPlaceholders("{{#lines}}{{line.evil}}{{/lines}}", "estimate"), ["line.evil"]);
  assert.deepEqual(findUnsupportedPlaceholders("{{#lines}}{{#lines}}x{{/lines}}{{/lines}}", "estimate"), ["#lines", "/lines"]);
  assert.deepEqual(findUnsupportedPlaceholders("{{#lines}}no end", "estimate"), ["#lines"]);
});

test("company settings singleton saves contact details, GSTIN and footer atomically and exposes them as merge keys", () => {
  const original = createDefaultAdminDemoState(NOW);
  const saved = saveCompanyIdentity(original, "Apex", original.companyAssets, { address: " 1 Main Rd ", phone: "999", email: "a@b.co", gstin: "21abcde1234f1z5", footer: "Terms apply" });
  assert.equal(saved.businessSettings.profile.address, "1 Main Rd");
  assert.equal(saved.businessSettings.billing.gstin, "21ABCDE1234F1Z5");
  const values = buildReportValues("estimate", job(), saved.businessSettings, saved.companyAssets);
  assert.equal(values["company.footer"], "Terms apply");
  assert.equal(values["company.gstin"], "21ABCDE1234F1Z5");
});

test("images merge only when they are PNG/JPEG data URLs", () => {
  const state = createDefaultAdminDemoState(NOW);
  const bad = saveCompanyIdentity(state, "A", { logo: "https://evil.example/x.png", stamp: "data:image/svg+xml;base64,AA==", authorizedSignature: "data:image/png;base64,AA==" });
  const values = buildReportValues("invoice", job(), bad.businessSettings, bad.companyAssets);
  assert.equal(values["blocks.company_logo"], "");
  assert.equal(values["blocks.company_stamp"], "");
  assert.match(values["blocks.authorized_signature"], /data:image\/png/);
});

test("a template can be deleted unless it is the active one", () => {
  const state = createReportTemplate(createDefaultAdminDemoState(NOW), { category: "invoice", name: "Spare", html: "<p>x</p>" }, NOW);
  const spare = state.reportTemplates.find((template) => template.name === "Spare")!;
  assert.equal(deleteReportTemplate(state, spare.id).reportTemplates.length, state.reportTemplates.length - 1);
  const active = state.reportTemplates.find((template) => template.category === "invoice" && template.active)!;
  assert.throws(() => deleteReportTemplate(state, active.id), /active/i);
});
