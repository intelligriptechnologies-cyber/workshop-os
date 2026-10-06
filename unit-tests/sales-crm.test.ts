import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import initSqlJs from "sql.js";
import { createSalesLead, createSalesQuotation, createSchema, migrateSchema, readState, setSalesQuotationStatus, updateSalesLead, updateSalesQuotation } from "../src/db";
import { filterSalesLeads, leadDraft, leadFilterQuery } from "../src/sales-lead-register";
import type { Lead } from "../src/sales-api";

async function database() {
  const SQL = await initSqlJs({ locateFile: () => fileURLToPath(new URL("../node_modules/sql.js/dist/sql-wasm.wasm", import.meta.url)) });
  const db = new SQL.Database();
  createSchema(db);
  migrateSchema(db);
  return db;
}

test("updating a sales lead preserves its ID and normalizes every editable field", async () => {
  const db = await database();
  const id = createSalesLead(db, { display_name: " Original ", phone: " 9000000000 ", company: " Old ", email: " old@example.test ", address: " Old address ", service_interest: " Old service ", notes: " Old notes ", stage: "NEW", temperature: "WARM", follow_up_due: null, site_visit_completed: 0, site_visit_date: null });
  db.run("update sales_leads set updated_at='2000-01-01 00:00:00' where id=?", [id]);
  updateSalesLead(db, id, { display_name: "  Updated Lead  ", phone: " 9999999999 ", company: "  Updated Co  ", email: " updated@example.test ", address: " Updated address ", service_interest: " Ceramic coating ", notes: " Priority customer ", stage: "QUALIFIED", temperature: "HOT", follow_up_due: "2026-10-20", site_visit_completed: 1, site_visit_date: "2026-10-12" });
  const lead = readState(db).sales_leads.find((item) => item.id === id)!;
  assert.deepEqual({ id: lead.id, display_name: lead.display_name, phone: lead.phone, company: lead.company, email: lead.email, address: lead.address, service_interest: lead.service_interest, notes: lead.notes, stage: lead.stage, temperature: lead.temperature, follow_up_due: lead.follow_up_due, site_visit_completed: lead.site_visit_completed, site_visit_date: lead.site_visit_date }, { id, display_name: "Updated Lead", phone: "9999999999", company: "Updated Co", email: "updated@example.test", address: "Updated address", service_interest: "Ceramic coating", notes: "Priority customer", stage: "QUALIFIED", temperature: "HOT", follow_up_due: "2026-10-20", site_visit_completed: 1, site_visit_date: "2026-10-12" });
  assert.notEqual(lead.updated_at, "2000-01-01 00:00:00");
});

test("updating a sales lead requires a name and phone", async () => {
  const db = await database();
  const id = createSalesLead(db, { display_name: "Lead", phone: "9000000000", company: "", email: "", address: "", service_interest: "", notes: "", stage: "NEW", temperature: "WARM", follow_up_due: null, site_visit_completed: 0, site_visit_date: null });
  const input = { display_name: " ", phone: "9000000000", company: "", email: "", address: "", service_interest: "", notes: "", stage: "NEW" as const, temperature: "WARM" as const, follow_up_due: null, site_visit_completed: 0, site_visit_date: null };
  assert.throws(() => updateSalesLead(db, id, input), /Lead name and phone are required/);
  assert.throws(() => updateSalesLead(db, id, { ...input, display_name: "Lead", phone: " " }), /Lead name and phone are required/);
});

test("sales lead not-entered flags default to false and round-trip through updates", async () => {
  const db = await database();
  const id = createSalesLead(db, { display_name: "Lead", phone: "9000000000", company: "", email: "", address: "", service_interest: "", notes: "", stage: "NEW", temperature: "WARM", follow_up_due: null, site_visit_completed: 0, site_visit_date: null });
  let lead = readState(db).sales_leads.find((item) => item.id === id)!;
  assert.equal(lead.company_not_entered, 0);
  assert.equal(lead.email_not_entered, 0);

  updateSalesLead(db, id, { display_name: "Lead", phone: "9000000000", company: "", company_not_entered: 1, email: "", email_not_entered: 1, address: "", service_interest: "", notes: "", stage: "NEW", temperature: "WARM", follow_up_due: null, site_visit_completed: 0, site_visit_date: null });
  lead = readState(db).sales_leads.find((item) => item.id === id)!;
  assert.equal(lead.company_not_entered, 1);
  assert.equal(lead.email_not_entered, 1);
});

test("lead register filters locally and resets to all statuses", () => {
  const leads: Lead[] = [
    { id: 1, branchId: "local", displayName: "Asha Motors", phone: "9000000001", company: "Asha Auto", companyNotEntered: false, email: "asha@example.test", emailNotEntered: false, address: "", serviceInterest: "", notes: "", stage: "NEW", temperature: "HOT", followUpDue: null, siteVisitCompleted: false, siteVisitDate: null, createdAt: "", updatedAt: "" },
    { id: 2, branchId: "local", displayName: "Bharat", phone: "9000000002", company: "", companyNotEntered: false, email: "", emailNotEntered: false, address: "", serviceInterest: "", notes: "", stage: "QUALIFIED", temperature: "COLD", followUpDue: null, siteVisitCompleted: false, siteVisitDate: null, createdAt: "", updatedAt: "" },
  ];
  assert.deepEqual(filterSalesLeads(leads, "asha", "NEW").map((lead) => lead.id), [1]);
  assert.deepEqual(filterSalesLeads(leads, "", "QUALIFIED").map((lead) => lead.id), [2]);
  assert.deepEqual(filterSalesLeads(leads, "", "").map((lead) => lead.id), [1, 2]);
});

test("inline lead saves preserve the complete draft and live filters include query and stage", () => {
  const lead: Lead = { id: 1, branchId: "branch", displayName: "Asha", phone: "9000000001", company: "Asha Auto", companyNotEntered: false, email: "asha@example.test", emailNotEntered: false, address: "Workshop Road", serviceInterest: "Coating", notes: "Call after lunch", stage: "NEW", temperature: "WARM", followUpDue: null, siteVisitCompleted: false, siteVisitDate: null, createdAt: "", updatedAt: "" };
  const draft = { ...leadDraft(lead), stage: "QUALIFIED" as const, temperature: "HOT" as const, followUpDue: "2026-11-10", siteVisitCompleted: true };
  assert.deepEqual(draft, { ...leadDraft(lead), stage: "QUALIFIED", temperature: "HOT", followUpDue: "2026-11-10", siteVisitCompleted: true });
  assert.equal(leadFilterQuery(" Asha & Co ", "QUALIFIED"), "?q=Asha+%26+Co&stage=QUALIFIED");
  assert.equal(leadFilterQuery("", ""), "");
});

test("draft quotations replace their saved lines and template snapshot without changing terminal documents", async () => {
  const db = await database();
  const lead = createSalesLead(db, { display_name: "Quotation lead", phone: "9000000000", company: "", email: "", address: "", service_interest: "", notes: "", stage: "NEW", temperature: "WARM", follow_up_due: null, site_visit_completed: 0, site_visit_date: null });
  const input = { lead_id: lead, template_id: "quotation-default", template_html: "<main>first</main>", discount: 0, lines: [{ kind: "Service", description: "Initial line", quantity: 1, rate: 100, gst_rate: 18 }] };
  const draft = createSalesQuotation(db, input);
  updateSalesQuotation(db, draft, { ...input, template_html: "<main>draft override</main>", discount: 10, lines: [{ kind: "Service", description: "Replacement line", quantity: 2, rate: 200, gst_rate: 5 }] });
  let quotation = readState(db).sales_quotations.find((item) => item.id === draft)!;
  assert.equal(quotation.template_html, "<main>draft override</main>");
  assert.equal(quotation.lines.length, 1);
  assert.equal(quotation.lines[0].description, "Replacement line");
  setSalesQuotationStatus(db, draft, "SENT");
  assert.throws(() => updateSalesQuotation(db, draft, input), /Only draft quotations can be edited/);
  quotation = readState(db).sales_quotations.find((item) => item.id === draft)!;
  assert.equal(quotation.template_html, "<main>draft override</main>");
});
