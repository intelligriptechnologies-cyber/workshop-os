import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import initSqlJs, { type Database } from "sql.js";
import {
  addMaterialRowForActor,
  approveEstimateForActor,
  createInvoiceForActor,
  createSchema,
  editIssuedMaterialRowForActor,
  materialStockOnHand,
  migrateSchema,
  readState,
  releaseMaterialRowForActor,
  requestMaterialRowForActor,
  saveEstimateForActor,
  saveInvoiceForActor,
  transitionJobStatusForActor,
  voidInvoiceForActor,
} from "../src/db";
import { buildInvoiceDraft, canCompleteWithInvoice, invoiceTotals } from "../src/invoice-math";
import { buildDataFlowTimeline } from "../src/data-flow";
import { materialRowActionsFor } from "../src/materials";

async function database(main = "IN_PROGRESS", sub = "Material Requested") {
  const SQL = await initSqlJs({ locateFile: () => fileURLToPath(new URL("../node_modules/sql.js/dist/sql-wasm.wasm", import.meta.url)) });
  const db = new SQL.Database();
  createSchema(db);
  db.run("insert into users(id,email,name,role,password) values (1,'owner@test','Owner','admin','x'),(2,'linked@test','Linked','service','x'),(3,'other@test','Other','service','x'),(4,'acc@test','Accounts','accounts','x'),(5,'tech@test','Tech','tech','x'),(6,'store@test','Store','store','x')");
  db.run("insert into inventory(id,sku,category,name,unit,stock_qty,low_stock_qty) values (1,'P-1','PPF','Gloss PPF','metre',10,2),(2,'C-1','Paint','Clear','litre',4,1)");
  db.run("insert into visits(id,advisor_id,requested_work) values(1,2,'Repair')");
  db.run(`insert into job_cards(id,job_no,visit_id,advisor_id,technician_id,main_status,sub_status,qc_status,washing_needed,closed_at) values(1,'JC-1',1,2,5,'${main}','${sub}','Pending',0,'')`);
  migrateSchema(db);
  return db;
}

function rows<T>(db: Database, sql: string): T[] {
  const result = db.exec(sql)[0];
  if (!result) return [];
  return result.values.map((values) => Object.fromEntries(result.columns.map((column, index) => [column, values[index]])) as T);
}

const estimate = (db: Database, actor = 2) => saveEstimateForActor(db, 1, actor, { discount: 0, gst_rate: 18, notes: "", items: [{ kind: "Service", description: "Labour", qty: 2, rate: 500 }, { kind: "Material", description: "Quoted oil", qty: 1, rate: 100 }] });
const issue = (db: Database, item = 1, qty = 3) => {
  const id = addMaterialRowForActor(db, 1, 2, item, qty);
  requestMaterialRowForActor(db, id, 2);
  releaseMaterialRowForActor(db, id, 6);
  return id;
};
const view = (db: Database) => readState(db).jobs[0];
const invoiceInput = (items: Parameters<typeof createInvoiceForActor>[3]["items"], discount = 0) => ({ tallyInvoiceNo: "", discount, notes: "", documentAvailable: true, items });

test("flat discount is spread proportionally and GST is computed per line on the reduced value", () => {
  const totals = invoiceTotals([{ qty: 1, rate: 1000, gst_rate: 18 }, { qty: 2, rate: 500, gst_rate: 5 }, { qty: 1, rate: 2000, gst_rate: 0 }], 400);
  assert.deepEqual(totals.lines.map((line) => line.discount), [100, 100, 200]);
  assert.deepEqual(totals.lines.map((line) => line.gst), [162, 45, 0]);
  assert.deepEqual({ subtotal: totals.subtotal, discount: totals.discount, gst: totals.gst, total: totals.total }, { subtotal: 4000, discount: 400, gst: 207, total: 3807 });
});

test("discount rounding remainder lands on the last line and a discount never exceeds the subtotal", () => {
  const totals = invoiceTotals([{ qty: 1, rate: 100, gst_rate: 0 }, { qty: 1, rate: 100, gst_rate: 0 }, { qty: 1, rate: 100, gst_rate: 0 }], 100);
  assert.equal(totals.lines.reduce((sum, line) => sum + line.discount, 0), 100);
  assert.equal(invoiceTotals([{ qty: 1, rate: 50, gst_rate: 18 }], 999).total, 0);
});

test("estimate is generated explicitly, approved by Owner or linked Advisor with a note", async () => {
  const db = await database();
  assert.throws(() => approveEstimateForActor(db, 1, 2, "ok"), /Generate the Estimate/);
  estimate(db);
  assert.equal(view(db).estimate?.status, "Draft");
  assert.throws(() => approveEstimateForActor(db, 1, 3, "ok"), /Owner or the linked Service Advisor/);
  assert.throws(() => approveEstimateForActor(db, 1, 2, " "), /note is required/);
  approveEstimateForActor(db, 1, 2, "Customer said yes");
  assert.equal(view(db).estimate?.status, "Approved");
  assert.throws(() => approveEstimateForActor(db, 1, 2, "again"), /already approved/);
});

test("invoice pre-fills Service lines from the estimate and Issued rows; unissued rows only warn", async () => {
  const db = await database();
  estimate(db);
  const issued = issue(db, 1, 3);
  const requested = addMaterialRowForActor(db, 1, 2, 2, 1);
  requestMaterialRowForActor(db, requested, 2);
  const draft = buildInvoiceDraft(view(db));
  assert.deepEqual(draft.lines.map((line) => [line.kind, line.description, line.qty, line.material_row_id]), [["Service", "Labour", 2, undefined], ["Material", "Gloss PPF", 3, issued]]);
  assert.equal(draft.unissuedRows, 1);
  assert.throws(() => createInvoiceForActor(db, 1, 2, invoiceInput(draft.lines)), /Approve the Estimate/);
});

test("creating an invoice locks picked-up rows with the invoice id and needs Owner or Advisor in IN_PROGRESS", async () => {
  const db = await database();
  estimate(db);
  approveEstimateForActor(db, 1, 2, "ok");
  const issued = issue(db);
  const lines = buildInvoiceDraft(view(db)).lines.map((line) => ({ ...line, rate: line.kind === "Material" ? 200 : line.rate }));
  assert.throws(() => createInvoiceForActor(db, 1, 3, invoiceInput(lines)), /cannot create/);
  assert.throws(() => createInvoiceForActor(db, 1, 4, invoiceInput(lines)), /cannot create/);
  const id = createInvoiceForActor(db, 1, 2, invoiceInput(lines, 100));
  const v = view(db);
  assert.equal(v.material_requests.find((row) => row.id === issued)?.invoiced_in, id);
  assert.deepEqual(materialRowActionsFor({ id: 2, role: "service" }, v.job, v.material_requests[0]), []);
  assert.throws(() => editIssuedMaterialRowForActor(db, issued, 6, 1, 4, "more"), /cannot be edited/);
  assert.deepEqual({ subtotal: v.invoice?.subtotal, discount: v.invoice?.discount, gst: v.invoice?.gst_amount, total: v.invoice?.total }, { subtotal: 1600, discount: 100, gst: 270, total: 1770 });
  assert.deepEqual(v.invoice_items.map((item) => item.gst_rate), [18, 18]);
});

test("Completed is enabled only once an invoice exists, and voiding it disables Completed again", async () => {
  const db = await database("IN_PROGRESS", "Material Requested");
  db.run("update checklist_items set checked_at='2026-09-25T09:00:00.000Z' where required=1");
  db.run("update checklist_cycles set completed_at='2026-09-25T09:00:00.000Z'");
  estimate(db);
  approveEstimateForActor(db, 1, 2, "ok");
  assert.equal(canCompleteWithInvoice(view(db)), false);
  assert.throws(() => transitionJobStatusForActor(db, 1, 2, "COMPLETED", "Done"), /Create an Invoice/);
  const id = createInvoiceForActor(db, 1, 2, invoiceInput([{ kind: "Service", description: "Labour", qty: 1, rate: 100, gst_rate: 18 }]));
  assert.equal(canCompleteWithInvoice(view(db)), true);
  voidInvoiceForActor(db, id, 4, "Wrong customer");
  assert.equal(canCompleteWithInvoice(view(db)), false);
  createInvoiceForActor(db, 1, 2, invoiceInput([{ kind: "Service", description: "Labour", qty: 1, rate: 100, gst_rate: 18 }]));
  transitionJobStatusForActor(db, 1, 2, "COMPLETED", "Done");
  assert.equal(view(db).job.main_status, "COMPLETED");
});

test("unpaid invoice edits are audited, add late materials and lock them; removing a line or voiding unlocks rows", async () => {
  const db = await database();
  estimate(db);
  approveEstimateForActor(db, 1, 2, "ok");
  const first = issue(db, 1, 3);
  const id = createInvoiceForActor(db, 1, 2, invoiceInput(buildInvoiceDraft(view(db)).lines.map((line) => ({ ...line, rate: 100 }))));
  const late = issue(db, 2, 1);
  const items = view(db).invoice_items.map((item) => ({ id: item.id, kind: item.kind, description: item.description, qty: item.qty, rate: item.rate, gst_rate: item.gst_rate ?? 18, material_row_id: item.material_row_id ?? undefined }));
  const lateLine = buildInvoiceDraft({ ...view(db), estimate_items: [] }).lines.find((line) => line.material_row_id === late)!;
  assert.throws(() => saveInvoiceForActor(db, id, 2, { tallyInvoiceNo: "", discount: 0, notes: "", documentAvailable: true, items: [...items, { ...lateLine, rate: 50 }] }), /note is required/);
  assert.throws(() => saveInvoiceForActor(db, id, 5, { tallyInvoiceNo: "", discount: 0, notes: "", documentAvailable: true, items, note: "x" }), /cannot edit/);
  saveInvoiceForActor(db, id, 2, { tallyInvoiceNo: "", discount: 0, notes: "", documentAvailable: true, items: [...items, { ...lateLine, rate: 50, gst_rate: 28 }], note: "Late paint" });
  assert.equal(view(db).material_requests.find((row) => row.id === late)?.invoiced_in, id);
  assert.equal(view(db).invoice?.total, 1 * 0 + (2 * 100 * 1.18) + (3 * 100 * 1.18) + 50 * 1.28);
  const timeline = buildDataFlowTimeline({ ...view(db), vehicle: { number: "MH01", make: "", model: "" } as never, customer: { name: "C" } as never }, readState(db).users);
  assert.ok(timeline.some((event) => event.title === "Invoice edited" && event.detail.includes("Late paint") && event.detail.includes("late material")));

  const afterEdit = view(db).invoice_items;
  saveInvoiceForActor(db, id, 4, { tallyInvoiceNo: "", discount: 0, notes: "", documentAvailable: true, items: afterEdit.filter((item) => item.material_row_id !== late).map((item) => ({ id: item.id, kind: item.kind, description: item.description, qty: item.qty, rate: item.rate, gst_rate: item.gst_rate ?? 18, material_row_id: item.material_row_id ?? undefined })), note: "Not needed" });
  assert.equal(view(db).material_requests.find((row) => row.id === late)?.invoiced_in, null);

  voidInvoiceForActor(db, id, 4, "Rebill");
  assert.equal(view(db).material_requests.find((row) => row.id === first)?.invoiced_in, null);
  assert.ok(view(db).material_requests.every((row) => !row.invoiced_in));
  assert.equal(materialStockOnHand(db, 1), 7);
});

test("a paid invoice rejects line edits", async () => {
  const db = await database();
  estimate(db);
  approveEstimateForActor(db, 1, 2, "ok");
  const id = createInvoiceForActor(db, 1, 2, invoiceInput([{ kind: "Service", description: "Labour", qty: 1, rate: 100, gst_rate: 18 }]));
  db.run("insert into payments(job_card_id,invoice_id,amount,mode) values(1,?,118,'Cash')", [id]);
  const items = view(db).invoice_items.map((item) => ({ id: item.id, kind: item.kind, description: item.description, qty: item.qty, rate: 999, gst_rate: 18 }));
  assert.throws(() => saveInvoiceForActor(db, id, 2, { tallyInvoiceNo: "", discount: 0, notes: "", documentAvailable: true, items, note: "n" }), /locked/);
  assert.equal(rows<{ n: number }>(db, "select count(*) n from invoice_events where kind='edit'")[0].n, 0);
});
