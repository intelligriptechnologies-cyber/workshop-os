import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import initSqlJs, { type Database } from "sql.js";
import {
  addMaterialRowForActor,
  approveEstimateForActor,
  closureBlockers,
  createInvoiceForActor,
  createSchema,
  editIssuedMaterialRowForActor,
  materialStockOnHand,
  migrateSchema,
  readState,
  recordPaymentForActor,
  releaseMaterialRowForActor,
  setChecklistItemCheckedForActor,
  requestMaterialRowForActor,
  saveEstimateForActor,
  saveInvoiceForActor,
  transitionJobStatusForActor,
  voidInvoiceForActor,
} from "../src/db";
import { buildInvoiceDraft, canCompleteWithInvoice, canCreateInvoice, invoiceTotals } from "../src/invoice-math";
import { buildDataFlowTimeline } from "../src/data-flow";
import { materialRowActionsFor } from "../src/materials";

async function database(main = "IN_PROGRESS", sub = "Material Requested") {
  const SQL = await initSqlJs({ locateFile: () => fileURLToPath(new URL("../node_modules/sql.js/dist/sql-wasm.wasm", import.meta.url)) });
  const db = new SQL.Database();
  createSchema(db);
  db.run("insert into users(id,email,name,role,password) values (1,'owner@test','Owner','admin','x'),(2,'linked@test','Linked','service','x'),(3,'other@test','Other','service','x'),(4,'acc@test','Accounts','accounts','x'),(5,'tech@test','Tech','tech','x'),(6,'store@test','Store','store','x')");
  db.run("insert into inventory(id,sku,category,name,unit,stock_qty,low_stock_qty,selling_price) values (1,'P-1','PPF','Gloss PPF','metre',10,2,125),(2,'C-1','Paint','Clear','litre',4,1,0)");
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
const invoiceInput = (items: Parameters<typeof createInvoiceForActor>[3]["items"], discount = 0) => ({ tallyInvoiceNo: "", discount, notes: "", items });

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

test("line GST accepts only the supported rates, normalizes No GST, and totals mixed treatments", async () => {
  const db = await database();
  assert.throws(() => saveEstimateForActor(db, 1, 2, { discount: 0, gst_rate: 18, notes: "", items: [{ kind: "Service", description: "Bad tax", qty: 1, rate: 100, gst_type: "IGST", gst_rate: 7 }] }), /GST rate must be 5%, 9%, 12%, 18%, or 28%/);
  saveEstimateForActor(db, 1, 2, {
    discount: 100,
    gst_rate: 18,
    notes: "",
    items: [
      { kind: "Service", description: "CGST work", qty: 1, rate: 1000, gst_type: "CGST+SGST", gst_rate: 18 },
      { kind: "Material", description: "IGST part", qty: 1, rate: 500, gst_type: "IGST", gst_rate: 5 },
      { kind: "Material", description: "Exempt item", qty: 1, rate: 500, gst_type: "No GST", gst_rate: 18 },
    ],
  });
  const estimateItems = view(db).estimate_items;
  assert.deepEqual(estimateItems.map((item) => [item.gst_type, item.gst_rate]), [["CGST+SGST", 18], ["IGST", 5], ["No GST", 0]]);
  assert.deepEqual(invoiceTotals(estimateItems.map((item) => ({ qty: item.qty, rate: item.rate, gst_rate: item.gst_rate ?? 0 })), 100), { lines: [{ amount: 1000, discount: 50, taxable: 950, gst: 171, total: 1121 }, { amount: 500, discount: 25, taxable: 475, gst: 23.75, total: 498.75 }, { amount: 500, discount: 25, taxable: 475, gst: 0, total: 475 }], subtotal: 2000, discount: 100, taxable: 1900, gst: 194.75, total: 2094.75 });
});

test("migration assigns legacy zero-rate rows to No GST and preserves other tax amounts", async () => {
  const db = await database();
  db.run("insert into estimates(id,job_card_id,status,discount,gst_rate,approval_note) values(10,1,'Draft',0,18,'')");
  db.run("insert into estimate_items(id,estimate_id,kind,description,qty,rate,gst_type,gst_rate) values(10,10,'Service','Exempt',1,100,null,0),(11,10,'Service','Taxable',1,100,null,18)");
  db.run("insert into invoices(id,job_card_id,invoice_no,tally_invoice_no,discount,gst_rate,subtotal,gst_amount,total,status) values(10,1,'INV-LEGACY','',0,18,200,18,218,'Open')");
  db.run("insert into invoice_items(id,invoice_id,kind,description,qty,rate,gst_type,gst_rate) values(10,10,'Service','Exempt',1,100,null,0),(11,10,'Service','Taxable',1,100,null,18)");
  migrateSchema(db);
  assert.deepEqual(rows<{ gst_type: string; gst_rate: number }>(db, "select gst_type,gst_rate from estimate_items where estimate_id=10 order by id"), [{ gst_type: "No GST", gst_rate: 0 }, { gst_type: "CGST+SGST", gst_rate: 18 }]);
  assert.deepEqual(rows<{ gst_type: string; gst_rate: number }>(db, "select gst_type,gst_rate from invoice_items where invoice_id=10 order by id"), [{ gst_type: "No GST", gst_rate: 0 }, { gst_type: "CGST+SGST", gst_rate: 18 }]);
  assert.equal(rows<{ total: number }>(db, "select total from invoices where id=10")[0].total, 218);
});

test("migration makes active legacy invoices available and records document generation", async () => {
  const db = await database();
  db.run("insert into invoices(id,job_card_id,invoice_no,tally_invoice_no,total,status,document_available,created_at) values(10,1,'INV-LEGACY','T-10',100,'Pending',0,'2026-09-01T10:00:00.000Z')");
  migrateSchema(db);
  assert.deepEqual(rows<{ document_available: number; document_generated_at: string }>(db, "select document_available,document_generated_at from invoices where id=10"), [{ document_available: 1, document_generated_at: "2026-09-01T10:00:00.000Z" }]);
});

test("invoice persistence ignores a legacy unavailable value on create and edit", async () => {
  const db = await database();
  estimate(db);
  approveEstimateForActor(db, 1, 2, "ok");
  const legacyCreate = { tallyInvoiceNo: "T-1", notes: "", documentAvailable: false, items: [{ kind: "Service" as const, description: "Labour", qty: 1, rate: 100, gst_rate: 18 }] };
  const id = createInvoiceForActor(db, 1, 2, legacyCreate);
  assert.equal(view(db).invoice?.document_available, 1);
  assert.ok(view(db).invoice?.document_generated_at);
  const item = view(db).invoice_items[0];
  const legacyEdit = { tallyInvoiceNo: "T-2", discount: 0, notes: "Updated", documentAvailable: false, items: [{ id: item.id, kind: item.kind, description: item.description, qty: item.qty, rate: item.rate, gst_rate: item.gst_rate }] };
  saveInvoiceForActor(db, id, 2, legacyEdit);
  assert.equal(view(db).invoice?.document_available, 1);
  assert.ok(view(db).invoice?.document_generated_at);
});

test("legacy invoice availability does not block closure readiness", async () => {
  const db = await database();
  estimate(db);
  approveEstimateForActor(db, 1, 2, "ok");
  createInvoiceForActor(db, 1, 2, { tallyInvoiceNo: "T-1", notes: "" });
  const current = view(db);
  const legacyUnavailable = { ...current, invoice: { ...current.invoice!, document_available: 0 } };
  assert.ok(!closureBlockers(legacyUnavailable).includes("Available Tally invoice required"));
});

test("estimate-to-invoice conversion transfers every line's GST treatment", async () => {
  const db = await database();
  saveEstimateForActor(db, 1, 2, { discount: 0, gst_rate: 18, notes: "", items: [
    { kind: "Service", description: "Local service", qty: 1, rate: 100, gst_type: "CGST+SGST", gst_rate: 18 },
    { kind: "Material", description: "Interstate part", qty: 1, rate: 100, gst_type: "IGST", gst_rate: 12 },
    { kind: "Material", description: "Exempt part", qty: 1, rate: 100, gst_type: "No GST", gst_rate: 0 },
  ] });
  approveEstimateForActor(db, 1, 2, "ok");
  createInvoiceForActor(db, 1, 2, { tallyInvoiceNo: "", notes: "" });
  assert.deepEqual(view(db).invoice_items.map((item) => [item.gst_type, item.gst_rate]), [["CGST+SGST", 18], ["IGST", 12], ["No GST", 0]]);
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
  assert.equal(draft.lines.find((line) => line.material_row_id === issued)?.rate, 125);
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

test("Accounts may create invoices only for completed jobs", async () => {
  const db = await database();
  const accounts = { id: 4, role: "accounts" as const };
  const job = view(db).job;
  assert.equal(canCreateInvoice(accounts, job), false);
  assert.equal(canCreateInvoice({ id: 2, role: "service" }, job), true);
  db.run("update job_cards set main_status='COMPLETED' where id=1");
  assert.equal(canCreateInvoice(accounts, view(db).job), true);
  db.run("update job_cards set main_status='CLOSED' where id=1");
  assert.equal(canCreateInvoice(accounts, view(db).job), false);
  db.run("update job_cards set main_status='CANCELLED' where id=1");
  assert.equal(canCreateInvoice(accounts, view(db).job), false);
  db.run("update job_cards set main_status='COMPLETED' where id=1");
  assert.throws(() => createInvoiceForActor(db, 1, 4, invoiceInput([{ kind: "Service", description: "Labour", qty: 1, rate: 100, gst_rate: 18 }])), /Approve the Estimate/);
  estimate(db);
  approveEstimateForActor(db, 1, 2, "approved");
  assert.doesNotThrow(() => createInvoiceForActor(db, 1, 4, invoiceInput([{ kind: "Service", description: "Labour", qty: 1, rate: 100, gst_rate: 18 }])));
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
  assert.throws(() => saveInvoiceForActor(db, id, 2, { tallyInvoiceNo: "", discount: 0, notes: "", items: [...items, { ...lateLine, rate: 50 }] }), /note is required/);
  assert.throws(() => saveInvoiceForActor(db, id, 5, { tallyInvoiceNo: "", discount: 0, notes: "", items, note: "x" }), /cannot edit/);
  saveInvoiceForActor(db, id, 2, { tallyInvoiceNo: "", discount: 0, notes: "", items: [...items, { ...lateLine, rate: 50, gst_rate: 28 }], note: "Late paint" });
  assert.equal(view(db).material_requests.find((row) => row.id === late)?.invoiced_in, id);
  assert.equal(view(db).invoice?.total, 1 * 0 + (2 * 100 * 1.18) + (3 * 100 * 1.18) + 50 * 1.28);
  const timeline = buildDataFlowTimeline({ ...view(db), vehicle: { number: "MH01", make: "", model: "" } as never, customer: { name: "C" } as never }, readState(db).users);
  assert.ok(timeline.some((event) => event.title === "Invoice edited" && event.detail.includes("Late paint") && event.detail.includes("late material")));

  const afterEdit = view(db).invoice_items;
  saveInvoiceForActor(db, id, 2, { tallyInvoiceNo: "", discount: 0, notes: "", items: afterEdit.filter((item) => item.material_row_id !== late).map((item) => ({ id: item.id, kind: item.kind, description: item.description, qty: item.qty, rate: item.rate, gst_rate: item.gst_rate ?? 18, material_row_id: item.material_row_id ?? undefined })), note: "Not needed" });
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
  assert.throws(() => saveInvoiceForActor(db, id, 2, { tallyInvoiceNo: "", discount: 0, notes: "", items, note: "n" }), /locked/);
  assert.equal(rows<{ n: number }>(db, "select count(*) n from invoice_events where kind='edit'")[0].n, 0);
});

async function completedWithInvoice() {
  const db = await database("IN_PROGRESS", "Material Requested");
  db.run("update checklist_items set checked_at='2026-09-25T09:00:00.000Z' where required=1");
  db.run("update checklist_cycles set completed_at='2026-09-25T09:00:00.000Z'");
  estimate(db);
  approveEstimateForActor(db, 1, 2, "ok");
  const id = createInvoiceForActor(db, 1, 2, invoiceInput([{ kind: "Service", description: "Labour", qty: 1, rate: 100, gst_rate: 18 }]));
  transitionJobStatusForActor(db, 1, 2, "COMPLETED", "Done");
  const item = (label: string) => view(db).checklist_items.filter((row) => row.stage === "COMPLETED").find((row) => row.label === label)!;
  setChecklistItemCheckedForActor(db, item("Customer Verification").id, 1, true);
  setChecklistItemCheckedForActor(db, item("Invoice Ready").id, 1, true);
  return { db, id, item };
}

test("ticking Payment Received creates the payment, receipt and gate pass, then closes the job", async () => {
  const { db, id, item } = await completedWithInvoice();
  assert.throws(() => setChecklistItemCheckedForActor(db, item("Payment Received").id, 2, true), /Only Owner\/Admin and Accounts/);
  assert.throws(() => setChecklistItemCheckedForActor(db, item("Payment Received").id, 4, true), /Google review\/feedback reminder/);
  setChecklistItemCheckedForActor(db, item("Remind Customer for Sharing Google Review/Feedback").id, 1, true);
  setChecklistItemCheckedForActor(db, item("Payment Received").id, 4, true);
  const v = view(db);
  assert.equal(v.invoice?.status, "Cleared");
  assert.equal(v.payments.length, 1);
  assert.equal(v.payments[0].amount, 118);
  assert.equal(v.receipt?.invoice_id, id);
  assert.equal(v.gate_pass?.invoice_id, id);
  assert.equal(v.job.main_status, "CLOSED");
  assert.ok(item("Payment Received").checked_at);
  assert.throws(() => setChecklistItemCheckedForActor(db, item("Payment Received").id, 4, false), /read-only/);
});

test("ticking Payment Received requires a current invoice", async () => {
  const { db, id, item } = await completedWithInvoice();
  voidInvoiceForActor(db, id, 4, "Wrong customer");
  assert.throws(() => setChecklistItemCheckedForActor(db, item("Payment Received").id, 4, true), /Create an Invoice/);
  assert.equal(view(db).payments.length, 0);
});

test("voiding needs Owner/Accounts and a reason; a paid invoice cannot be voided; a re-created invoice gets a new number", async () => {
  const { db, id, item } = await completedWithInvoice();
  assert.throws(() => voidInvoiceForActor(db, id, 2, "Advisor"), /Only Owner\/Admin and Accounts/);
  assert.throws(() => voidInvoiceForActor(db, id, 4, " "), /reason/);
  const first = view(db).invoice!.invoice_no;
  voidInvoiceForActor(db, id, 4, "Wrong customer");
  const again = createInvoiceForActor(db, 1, 1, invoiceInput([{ kind: "Service", description: "Labour", qty: 1, rate: 100, gst_rate: 18 }]));
  assert.notEqual(view(db).invoice!.invoice_no, first);
  setChecklistItemCheckedForActor(db, item("Remind Customer for Sharing Google Review/Feedback").id, 1, true);
  recordPaymentForActor(db, again, 4, { mode: "UPI", otherDetail: "", reference: "R" });
  assert.throws(() => voidInvoiceForActor(db, again, 4, "Too late"), /active payments/);
  assert.equal(rows<{ n: number }>(db, "select count(*)-count(distinct invoice_no) n from invoices")[0].n, 0);
});
