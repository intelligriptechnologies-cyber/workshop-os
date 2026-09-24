import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import initSqlJs, { type Database } from "sql.js";
import { archiveInvoiceItem, createInvoiceForActor, createInvoiceFromEstimate, createInvoiceItem, createSchema, editPayment, markJobDeliveredForActor, migrateSchema, readState, recordPayment, recordPaymentForActor, transitionJobStatus, updateInvoiceFields, updateInvoiceItem, voidInvoiceForActor, voidPayment } from "../src/db";

async function database() {
  const SQL = await initSqlJs({ locateFile: () => fileURLToPath(new URL("../node_modules/sql.js/dist/sql-wasm.wasm", import.meta.url)) });
  const db = new SQL.Database();
  createSchema(db);
  migrateSchema(db);
  return db;
}

function rows<T>(db: Database, sql: string, params: (string | number | null)[] = []): T[] {
  const statement = db.prepare(sql);
  statement.bind(params);
  const result: T[] = [];
  while (statement.step()) result.push(statement.getAsObject() as T);
  statement.free();
  return result;
}

function insertCompletedJob(db: Database) {
  db.run("insert into users(id,email,name,role,password) values(1,'owner@example.com','Owner','admin','x'),(2,'advisor@example.com','Advisor','service','x'),(6,'tech@example.com','Tech','tech','x')");
  db.run("insert into customers(id,name,mobile,type) values(1,'Customer','9999999999','Individual')");
  db.run("insert into vehicles(id,customer_id,number,make,model,color,km) values(1,1,'OD01AA0001','Make','Model','Blue',100)");
  db.run("insert into visits(id,customer_id,vehicle_id,advisor_id,received_by,received_at,requested_work) values(1,1,1,2,1,'2026-09-20T00:00:00.000Z','Service')");
  db.run("insert into job_cards(id,job_no,visit_id,advisor_id,technician_id,main_status,sub_status,qc_status,washing_needed,closed_at) values(1,'JC-1',1,2,6,'COMPLETED','Customer Verification','Pass',1,'')");
  db.run("insert into estimates(id,job_card_id,status,discount,gst_rate,approval_note) values(1,1,'Approved',100,18,'Approved')");
  db.run("insert into estimate_items(id,estimate_id,kind,description,qty,rate) values(1,1,'Service','Labour',2,500),(2,1,'Material','Oil',1,250)");
  migrateSchema(db);
}

test("invoice copies estimate items exactly once and then remains independent", async () => {
  const db = await database();
  insertCompletedJob(db);

  const invoiceId = createInvoiceFromEstimate(db, 1, { tallyInvoiceNo: "TLY-1", notes: "Initial invoice", documentAvailable: true });
  const again = createInvoiceFromEstimate(db, 1, { tallyInvoiceNo: "TLY-2", notes: "Ignored copy request", documentAvailable: true });
  assert.equal(again, invoiceId);
  assert.deepEqual(rows(db, "select kind,description,qty,rate from invoice_items where invoice_id=? and archived_at is null order by id", [invoiceId]), [
    { kind: "Service", description: "Labour", qty: 2, rate: 500 },
    { kind: "Material", description: "Oil", qty: 1, rate: 250 },
  ]);

  db.run("update estimate_items set description='Changed estimate',rate=999 where id=1");
  assert.deepEqual(rows(db, "select description,rate from invoice_items where invoice_id=? and archived_at is null order by id", [invoiceId]), [
    { description: "Labour", rate: 500 },
    { description: "Oil", rate: 250 },
  ]);
  assert.equal(readState(db).jobs[0].invoice_items.length, 2);
});

test("invoice fields and items recalculate subtotal, overall discount, GST, total, and document availability", async () => {
  const db = await database();
  insertCompletedJob(db);
  const invoiceId = createInvoiceFromEstimate(db, 1, { tallyInvoiceNo: "TLY-1", notes: "Initial", documentAvailable: true });
  let invoice = readState(db).jobs[0].invoice!;
  assert.deepEqual({ subtotal: invoice.subtotal, discount: invoice.discount, gst: invoice.gst_amount, total: invoice.total, status: invoice.status }, { subtotal: 1250, discount: 100, gst: 207, total: 1357, status: "Open" });

  const labour = readState(db).jobs[0].invoice_items[0];
  updateInvoiceItem(db, labour.id, { kind: "Service", description: "Revised labour", qty: 3, rate: 400 });
  const extraId = createInvoiceItem(db, invoiceId, { kind: "Material", description: "Filter", qty: 2, rate: 50 });
  archiveInvoiceItem(db, extraId, "Entered in error");
  updateInvoiceFields(db, invoiceId, { tallyInvoiceNo: "TLY-2", discount: 50, gstRate: 12, notes: "Final notes", documentAvailable: false });

  const view = readState(db).jobs[0];
  invoice = view.invoice!;
  assert.deepEqual({ tally: invoice.tally_invoice_no, subtotal: invoice.subtotal, discount: invoice.discount, gstRate: invoice.gst_rate, gst: invoice.gst_amount, total: invoice.total, notes: invoice.notes, available: invoice.document_available }, { tally: "TLY-2", subtotal: 1450, discount: 50, gstRate: 12, gst: 168, total: 1568, notes: "Final notes", available: 0 });
  assert.deepEqual(view.invoice_items.map((item) => item.description), ["Revised labour", "Oil"]);
});

test("payments validate mode and amount, stay tied to an invoice, prevent overpayment, support edit and reasoned void, and lock invoice financials", async () => {
  const db = await database();
  insertCompletedJob(db);
  const invoiceId = createInvoiceFromEstimate(db, 1, { tallyInvoiceNo: "TLY-1", notes: "", documentAvailable: true });

  assert.throws(() => recordPayment(db, invoiceId, { amount: 10, mode: "Cheque" as "Cash", otherDetail: "", reference: "", notes: "" }), /mode/);
  assert.throws(() => recordPayment(db, invoiceId, { amount: 10, mode: "Other", otherDetail: " ", reference: "", notes: "" }), /Other payment detail/);
  assert.throws(() => recordPayment(db, invoiceId, { amount: 0, mode: "Cash", otherDetail: "", reference: "", notes: "" }), /greater than zero/);

  const paymentId = recordPayment(db, invoiceId, { amount: 500, mode: "UPI", otherDetail: "", reference: "UPI-1", notes: "Advance" });
  let view = readState(db).jobs[0];
  assert.equal(view.invoice?.status, "Partial");
  assert.deepEqual(view.payments.map((payment) => ({ invoiceId: payment.invoice_id, mode: payment.mode, amount: payment.amount, notes: payment.notes })), [{ invoiceId, mode: "UPI", amount: 500, notes: "Advance" }]);
  assert.throws(() => updateInvoiceFields(db, invoiceId, { tallyInvoiceNo: "TLY-X", discount: 0, gstRate: 18, notes: "", documentAvailable: true }), /locked/);
  assert.throws(() => recordPayment(db, invoiceId, { amount: 858, mode: "Card", otherDetail: "", reference: "CARD-X", notes: "" }), /overpayment/);

  editPayment(db, paymentId, { amount: 600, mode: "Other", otherDetail: "Bank transfer", reference: "BANK-1", notes: "Corrected" });
  view = readState(db).jobs[0];
  assert.deepEqual({ status: view.invoice?.status, amount: view.payments[0].amount, detail: view.payments[0].other_detail }, { status: "Partial", amount: 600, detail: "Bank transfer" });
  assert.throws(() => voidPayment(db, paymentId, " "), /void reason/);
  voidPayment(db, paymentId, "Duplicate entry");
  assert.equal(readState(db).jobs[0].invoice?.status, "Open");
  assert.equal(readState(db).jobs[0].payments.length, 0);
});

test("cumulative full payment atomically clears billing, creates documents, completes billing evidence, and closes with Delivered still manual", async () => {
  const db = await database();
  insertCompletedJob(db);
  const invoiceId = createInvoiceFromEstimate(db, 1, { tallyInvoiceNo: "TLY-1", notes: "", documentAvailable: true });
  recordPayment(db, invoiceId, { amount: 500, mode: "Cash", otherDetail: "", reference: "", notes: "Deposit" });
  recordPayment(db, invoiceId, { amount: 857, mode: "Card", otherDetail: "", reference: "CARD-1", notes: "Balance" });

  const view = readState(db).jobs[0];
  assert.equal(view.invoice?.status, "Cleared");
  assert.equal(view.job.main_status, "CLOSED");
  assert.equal(view.receipt?.invoice_id, invoiceId);
  assert.equal(view.gate_pass?.invoice_id, invoiceId);
  const completed = view.checklist_items.filter((item) => item.stage === "COMPLETED").at(-1)?.cycle_number;
  assert.equal(view.checklist_items.filter((item) => item.stage === "COMPLETED" && item.cycle_number === completed).every((item) => item.checked_at), true);
  const closedItems = view.checklist_items.filter((item) => item.stage === "CLOSED" && item.cycle_number === 1);
  assert.deepEqual(closedItems.map((item) => [item.label, Boolean(item.checked_at)]), [["Receipt Generated", true], ["Gate Pass Generated", true], ["Delivered", false]]);
});

test("a cleared invoice closes automatically when rework later reaches COMPLETED", async () => {
  const db = await database();
  insertCompletedJob(db);
  const invoiceId = createInvoiceFromEstimate(db, 1, { tallyInvoiceNo: "TLY-REWORK", notes: "", documentAvailable: true });
  db.run("update checklist_items set checked_at='2026-09-25T09:00:00.000Z',completed_at='2026-09-25T09:00:00.000Z' where job_card_id=1 and checked_at is null");
  db.run("update checklist_cycles set completed_at='2026-09-25T09:00:00.000Z' where job_card_id=1 and completed_at is null");
  transitionJobStatus(db, 1, "IN_PROGRESS", "Customer requested rework", "2026-09-25T09:05:00.000Z");

  recordPayment(db, invoiceId, { amount: 1357, mode: "UPI", otherDetail: "", reference: "REWORK-FULL", notes: "Paid during rework" });
  let view = readState(db).jobs[0];
  assert.equal(view.invoice?.status, "Cleared");
  assert.equal(view.job.main_status, "IN_PROGRESS");
  assert.equal(view.receipt, undefined);

  db.run("update checklist_items set checked_at='2026-09-25T10:00:00.000Z',completed_at='2026-09-25T10:00:00.000Z' where checklist_cycle_id=(select id from checklist_cycles where job_card_id=1 order by id desc limit 1) and checked_at is null");
  db.run("update checklist_cycles set completed_at='2026-09-25T10:00:00.000Z' where id=(select id from checklist_cycles where job_card_id=1 order by id desc limit 1)");
  transitionJobStatus(db, 1, "COMPLETED", "Rework verified", "2026-09-25T10:05:00.000Z");

  view = readState(db).jobs[0];
  assert.equal(view.job.main_status, "CLOSED");
  assert.equal(view.receipt?.invoice_id, invoiceId);
  assert.equal(view.gate_pass?.invoice_id, invoiceId);
});

test("full-payment closure rolls back payment, documents, checklist, invoice, and job when any atomic step fails", async () => {
  const db = await database();
  insertCompletedJob(db);
  const invoiceId = createInvoiceFromEstimate(db, 1, { tallyInvoiceNo: "TLY-1", notes: "", documentAvailable: true });
  db.run("create trigger reject_gate_pass before insert on gate_passes begin select raise(abort, 'gate pass unavailable'); end");

  assert.throws(() => recordPayment(db, invoiceId, { amount: 1357, mode: "UPI", otherDetail: "", reference: "UPI-FULL", notes: "" }), /gate pass unavailable/);
  const view = readState(db).jobs[0];
  assert.equal(view.payments.length, 0);
  assert.equal(view.invoice?.status, "Open");
  assert.equal(view.receipt, undefined);
  assert.equal(view.gate_pass, undefined);
  assert.equal(view.job.main_status, "COMPLETED");
  assert.equal(view.checklist_items.find((item) => item.label === "Payment Received")?.checked_at, null);
});

test("editing a cleared payment under the total reopens through an audited system transition, voids stale documents, and starts a billing-correction cycle", async () => {
  const db = await database();
  insertCompletedJob(db);
  const invoiceId = createInvoiceFromEstimate(db, 1, { tallyInvoiceNo: "TLY-1", notes: "", documentAvailable: true });
  const paymentId = recordPayment(db, invoiceId, { amount: 1357, mode: "UPI", otherDetail: "", reference: "UPI-FULL", notes: "Paid" });
  const staleReceipt = readState(db).jobs[0].receipt!.id;
  const stalePass = readState(db).jobs[0].gate_pass!.id;

  editPayment(db, paymentId, { amount: 1000, mode: "UPI", otherDetail: "", reference: "UPI-CORRECTED", notes: "Bank reconciliation correction" });
  const view = readState(db).jobs[0];
  assert.equal(view.invoice?.status, "Partial");
  assert.equal(view.job.main_status, "COMPLETED");
  assert.equal(view.job.closed_at, null);
  assert.equal(view.receipt, undefined);
  assert.equal(view.gate_pass, undefined);
  assert.equal(view.receipt_history?.find((receipt) => receipt.id === staleReceipt)?.void_reason, "Billing correction: cleared invoice became underpaid");
  assert.equal(view.gate_pass_history?.find((pass) => pass.id === stalePass)?.void_reason, "Billing correction: cleared invoice became underpaid");
  assert.deepEqual(rows(db, "select id,void_reason from receipts where id=?", [staleReceipt]), [{ id: staleReceipt, void_reason: "Billing correction: cleared invoice became underpaid" }]);
  assert.deepEqual(rows(db, "select id,void_reason from gate_passes where id=?", [stalePass]), [{ id: stalePass, void_reason: "Billing correction: cleared invoice became underpaid" }]);
  assert.match(rows<{ note: string }>(db, "select note from status_history order by id desc limit 1")[0].note, /System billing correction/);
  const cycles = rows<{ cycle_number: number }>(db, "select cycle_number from checklist_cycles where job_card_id=1 and stage='COMPLETED' order by id");
  assert.deepEqual(cycles, [{ cycle_number: 1 }, { cycle_number: 2 }]);
  const correctionItems = view.checklist_items.filter((item) => item.stage === "COMPLETED" && item.cycle_number === 2);
  assert.deepEqual(correctionItems.map((item) => [item.label, Boolean(item.checked_at)]), [["Customer Verification", true], ["Invoice Ready", true], ["Payment Received", false]]);
});

test("voiding a cleared payment uses the same correction path and preserves payment history", async () => {
  const db = await database();
  insertCompletedJob(db);
  const invoiceId = createInvoiceFromEstimate(db, 1, { tallyInvoiceNo: "TLY-1", notes: "", documentAvailable: true });
  const paymentId = recordPayment(db, invoiceId, { amount: 1357, mode: "Cash", otherDetail: "", reference: "", notes: "" });
  voidPayment(db, paymentId, "Cash count correction");
  assert.deepEqual(rows(db, "select void_reason from payments where id=?", [paymentId]), [{ void_reason: "Cash count correction" }]);
  const view = readState(db).jobs[0];
  assert.equal(view.job.main_status, "COMPLETED");
  assert.equal(view.invoice?.status, "Open");
  assert.equal(view.payments.some((payment) => payment.id === paymentId), false);
  assert.equal(view.payment_history?.find((payment) => payment.id === paymentId)?.void_reason, "Cash count correction");
});

test("billing actor boundary allows Owner/Admin and Accounts while rejecting every other role", async () => {
  const db = await database();
  insertCompletedJob(db);
  db.run("insert into users(id,email,name,role,password) values(3,'accounts@example.com','Accounts','accounts','x'),(4,'reception@example.com','Reception','reception','x'),(5,'store@example.com','Store','store','x')");
  const invoiceId = createInvoiceForActor(db, 1, 1, { tallyInvoiceNo: "TLY-AUTH", notes: "", documentAvailable: true });
  assert.throws(() => voidInvoiceForActor(db, invoiceId, 2, "Not allowed"), /Only Owner\/Admin and Accounts/);
  assert.throws(() => recordPaymentForActor(db, invoiceId, 4, { amount: 10, mode: "Cash", otherDetail: "", reference: "", notes: "" }), /Only Owner\/Admin and Accounts/);
  assert.throws(() => recordPaymentForActor(db, invoiceId, 5, { amount: 10, mode: "Cash", otherDetail: "", reference: "", notes: "" }), /Only Owner\/Admin and Accounts/);
  const paymentId = recordPaymentForActor(db, invoiceId, 3, { amount: 100, mode: "Cash", otherDetail: "", reference: "AUTH", notes: "Allowed" });
  assert.equal(readState(db).jobs[0].payments[0].id, paymentId);
});

test("manual Delivered action requires a closed gate-passed job and records delivery details atomically", async () => {
  const db = await database();
  insertCompletedJob(db);
  db.run("insert into users(id,email,name,role,password) values(3,'accounts@example.com','Accounts','accounts','x')");
  const invoiceId = createInvoiceForActor(db, 1, 1, { tallyInvoiceNo: "TLY-DELIVERY", notes: "", documentAvailable: true });
  assert.throws(() => markJobDeliveredForActor(db, 1, 3, "Accounts", 150, "Received"), /closed job/);
  recordPaymentForActor(db, invoiceId, 3, { amount: 1357, mode: "UPI", otherDetail: "", reference: "FULL", notes: "" });
  markJobDeliveredForActor(db, 1, 3, "Accounts Desk", 150, "Customer received vehicle", "2026-09-24T12:00:00.000Z");
  const view = readState(db).jobs[0];
  assert.deepEqual({ by: view.job.delivery_by, km: view.job.final_km, acknowledgement: view.job.acknowledgement }, { by: "Accounts Desk", km: 150, acknowledgement: "Customer received vehicle" });
  const deliveredItem = view.checklist_items.find((item) => item.stage === "CLOSED" && item.label === "Delivered");
  assert.equal(deliveredItem?.checked_by, 3);
  assert.equal(deliveredItem?.checked_at, "2026-09-24T12:00:00.000Z");
  assert.throws(() => markJobDeliveredForActor(db, 1, 3, "Accounts Desk", 151, "Again"), /already marked Delivered/);
});
