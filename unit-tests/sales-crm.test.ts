import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import initSqlJs from "sql.js";
import { createSalesLead, createSchema, migrateSchema, readState, updateSalesLead } from "../src/db";

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
