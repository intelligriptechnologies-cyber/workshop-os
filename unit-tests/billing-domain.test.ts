import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import initSqlJs, { type Database } from "sql.js";
import { archiveInvoiceItem, createInvoiceForActor, createInvoiceFromEstimate, createInvoiceItem, createSchema, markJobDeliveredForActor, migrateSchema, readState, recordPayment, recordPaymentForActor, saveInvoiceForActor, transitionJobStatus, transitionJobStatusForActor, updateInvoiceFields, updateInvoiceItem, voidInvoiceForActor, voidPayment, voidPaymentForActor } from "../src/db";

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

test("custom invoice creation persists finalized lines and totals and rejects invalid drafts without partial writes", async () => {
  const db = await database();
  insertCompletedJob(db);
  const input = { tallyInvoiceNo: " TLY-CUSTOM ", discount: 75, gstRate: 12, notes: " Finalized in dialog ", documentAvailable: true, items: [
    { kind: "Service" as const, description: " Custom labour ", qty: 3, rate: 400 },
    { kind: "Material" as const, description: "Filter", qty: 2, rate: 125 },
  ] };
  const invoiceId = createInvoiceFromEstimate(db, 1, input);
  const view = readState(db).jobs[0];
  assert.deepEqual(view.invoice_items.map(({ kind, description, qty, rate }) => ({ kind, description, qty, rate })), [
    { kind: "Service", description: "Custom labour", qty: 3, rate: 400 },
    { kind: "Material", description: "Filter", qty: 2, rate: 125 },
  ]);
  assert.deepEqual({ tally: view.invoice?.tally_invoice_no, subtotal: view.invoice?.subtotal, discount: view.invoice?.discount, gst: view.invoice?.gst_amount, total: view.invoice?.total }, { tally: "TLY-CUSTOM", subtotal: 1450, discount: 75, gst: 165, total: 1540 });
  assert.equal(createInvoiceFromEstimate(db, 1, { ...input, tallyInvoiceNo: "DUPLICATE" }), invoiceId);

  const invalidDb = await database();
  insertCompletedJob(invalidDb);
  assert.throws(() => createInvoiceFromEstimate(invalidDb, 1, { ...input, items: [] }), /at least one item/);
  assert.throws(() => createInvoiceFromEstimate(invalidDb, 1, { ...input, items: [{ kind: "Service", description: " ", qty: 1, rate: 1 }] }), /description/);
  assert.throws(() => createInvoiceFromEstimate(invalidDb, 1, { ...input, items: [{ kind: "Service", description: "Labour", qty: 0, rate: 1 }] }), /quantity/);
  assert.throws(() => createInvoiceFromEstimate(invalidDb, 1, { ...input, items: [{ kind: "Service", description: "Labour", qty: 1, rate: 1, gst_rate: 101 }] }), /GST/);
  assert.equal(rows(invalidDb, "select id from invoices").length, 0);
});

test("post-payment invoice is fully locked once Cleared", async () => {
  const db = await database();
  insertCompletedJob(db);
  const invoiceId = createInvoiceForActor(db, 1, 1, { tallyInvoiceNo: "TLY-1", discount: 100, gstRate: 18, notes: "Initial", documentAvailable: true, items: [
    { kind: "Service", description: "Labour", qty: 2, rate: 500 },
    { kind: "Material", description: "Oil", qty: 1, rate: 250 },
  ] });
  recordPayment(db, invoiceId, { mode: "Cash", otherDetail: "", reference: "" });
  const items = readState(db).jobs[0].invoice_items.map(({ id, kind, description, qty, rate }) => ({ id, kind, description, qty, rate }));
  assert.throws(() => saveInvoiceForActor(db, invoiceId, 1, { tallyInvoiceNo: "TLY-META", discount: 100, notes: "Metadata updated", documentAvailable: false, items }), /Pending invoice/);
  assert.throws(() => saveInvoiceForActor(db, invoiceId, 1, { tallyInvoiceNo: "TLY-META", discount: 99, notes: "", documentAvailable: true, items }), /Pending invoice/);
  assert.throws(() => updateInvoiceFields(db, invoiceId, { tallyInvoiceNo: "TLY-X", discount: 0, gstRate: 18, notes: "", documentAvailable: true }), /Pending invoice/);
});

test("invoice fields and items recalculate subtotal, overall discount, GST, total, and document availability", async () => {
  const db = await database();
  insertCompletedJob(db);
  const invoiceId = createInvoiceFromEstimate(db, 1, { tallyInvoiceNo: "TLY-1", notes: "Initial", documentAvailable: true });
  let invoice = readState(db).jobs[0].invoice!;
  assert.deepEqual({ subtotal: invoice.subtotal, discount: invoice.discount, gst: invoice.gst_amount, total: invoice.total, status: invoice.status }, { subtotal: 1250, discount: 100, gst: 207, total: 1357, status: "Pending" });

  const labour = readState(db).jobs[0].invoice_items[0];
  updateInvoiceItem(db, labour.id, { kind: "Service", description: "Revised labour", qty: 3, rate: 400 });
  const extraId = createInvoiceItem(db, invoiceId, { kind: "Material", description: "Filter", qty: 2, rate: 50 });
  archiveInvoiceItem(db, extraId, "Entered in error");
  updateInvoiceFields(db, invoiceId, { tallyInvoiceNo: "TLY-2", discount: 50, notes: "Final notes", documentAvailable: false });

  const view = readState(db).jobs[0];
  invoice = view.invoice!;
  assert.deepEqual({ tally: invoice.tally_invoice_no, subtotal: invoice.subtotal, discount: invoice.discount, gstRate: invoice.gst_rate, gst: invoice.gst_amount, total: invoice.total, notes: invoice.notes, available: invoice.document_available }, { tally: "TLY-2", subtotal: 1450, discount: 50, gstRate: 0, gst: 252, total: 1652, notes: "Final notes", available: 1 });
  assert.deepEqual(view.invoice_items.map((item) => item.description), ["Revised labour", "Oil"]);
});

test("Record Payment validates mode, is a single full payment, and needs an active invoice", async () => {
  const db = await database();
  insertCompletedJob(db);
  const invoiceId = createInvoiceFromEstimate(db, 1, { tallyInvoiceNo: "TLY-1", notes: "", documentAvailable: true });

  assert.throws(() => recordPayment(db, invoiceId, { mode: "Cheque" as "Cash", otherDetail: "", reference: "" }), /mode/);
  assert.throws(() => recordPayment(db, invoiceId, { mode: "Other", otherDetail: " ", reference: "" }), /Other payment detail/);
  assert.throws(() => recordPayment(db, 999, { mode: "Cash", otherDetail: "", reference: "" }), /./);

  const paymentId = recordPayment(db, invoiceId, { mode: "UPI", otherDetail: "", reference: "UPI-1" });
  const view = readState(db).jobs[0];
  assert.equal(view.invoice?.status, "Cleared");
  assert.deepEqual(view.payments.map((payment) => ({ id: payment.id, invoiceId: payment.invoice_id, mode: payment.mode, amount: payment.amount, reference: payment.reference })), [{ id: paymentId, invoiceId, mode: "UPI", amount: 1357, reference: "UPI-1" }]);
  assert.throws(() => recordPayment(db, invoiceId, { mode: "Card", otherDetail: "", reference: "CARD-X" }), /completed job card/);
});

test("Record Payment atomically creates payment, receipt, gate pass and delivery acknowledgement, then closes", async () => {
  const db = await database();
  insertCompletedJob(db);
  const invoiceId = createInvoiceFromEstimate(db, 1, { tallyInvoiceNo: "TLY-1", notes: "", documentAvailable: true });
  recordPayment(db, invoiceId, { mode: "Card", otherDetail: "", reference: "CARD-1" });

  const view = readState(db).jobs[0];
  assert.equal(view.invoice?.status, "Cleared");
  assert.equal(view.job.main_status, "CLOSED");
  assert.equal(view.receipt?.invoice_id, invoiceId);
  assert.equal(view.gate_pass?.invoice_id, invoiceId);
  assert.ok(view.job.delivery_by);
  assert.ok(view.job.acknowledgement);
});

test("direct manual Close remains forbidden after a payment", async () => {
  const db = await database();
  insertCompletedJob(db);
  const invoiceId = createInvoiceFromEstimate(db, 1, { tallyInvoiceNo: "TLY-1", notes: "", documentAvailable: true });
  recordPayment(db, invoiceId, { mode: "Cash", otherDetail: "", reference: "" });
  const view = readState(db).jobs[0];
  assert.equal(view.job.main_status, "CLOSED");
  assert.equal(view.gate_pass?.invoice_id, invoiceId);
  assert.throws(() => transitionJobStatus(db, 1, "CLOSED", "Vehicle handed over"), /only close when a valid payment|already CLOSED/);
});

test("payment is rejected during rework and closes only after the job is completed again", async () => {
  const db = await database();
  insertCompletedJob(db);
  const invoiceId = createInvoiceFromEstimate(db, 1, { tallyInvoiceNo: "TLY-REWORK", notes: "", documentAvailable: true });
  db.run("update checklist_items set checked_at='2026-09-25T09:00:00.000Z',completed_at='2026-09-25T09:00:00.000Z' where job_card_id=1 and checked_at is null");
  db.run("update checklist_cycles set completed_at='2026-09-25T09:00:00.000Z' where job_card_id=1 and completed_at is null");
  transitionJobStatus(db, 1, "IN_PROGRESS", "Customer requested rework", "2026-09-25T09:05:00.000Z");

  assert.throws(() => recordPayment(db, invoiceId, { mode: "UPI", otherDetail: "", reference: "REWORK-FULL" }), /completed job card/);
  assert.equal(readState(db).jobs[0].job.main_status, "IN_PROGRESS");

  db.run("update checklist_items set checked_at='2026-09-25T10:00:00.000Z',completed_at='2026-09-25T10:00:00.000Z' where checklist_cycle_id=(select id from checklist_cycles where job_card_id=1 order by id desc limit 1) and checked_at is null");
  db.run("update checklist_cycles set completed_at='2026-09-25T10:00:00.000Z' where id=(select id from checklist_cycles where job_card_id=1 order by id desc limit 1)");
  transitionJobStatus(db, 1, "COMPLETED", "Rework verified", "2026-09-25T10:05:00.000Z");

  recordPayment(db, invoiceId, { mode: "UPI", otherDetail: "", reference: "REWORK-FULL" });
  const view = readState(db).jobs[0];
  assert.equal(view.job.main_status, "CLOSED");
  assert.equal(view.gate_pass?.invoice_id, invoiceId);
});

test("Record Payment rolls back payment, receipt and invoice status when a step fails", async () => {
  const db = await database();
  insertCompletedJob(db);
  const invoiceId = createInvoiceFromEstimate(db, 1, { tallyInvoiceNo: "TLY-1", notes: "", documentAvailable: true });
  db.run("create trigger reject_receipt before insert on receipts begin select raise(abort, 'receipt unavailable'); end");

  assert.throws(() => recordPayment(db, invoiceId, { mode: "UPI", otherDetail: "", reference: "UPI-FULL" }), /receipt unavailable/);
  const view = readState(db).jobs[0];
  assert.equal(view.payments.length, 0);
  assert.equal(view.invoice?.status, "Pending");
  assert.equal(view.receipt, undefined);
  assert.equal(view.checklist_items.find((item) => item.label === "Payment Received")?.checked_at, null);
});

test("a payment-created closure is immutable", async () => {
  const db = await database();
  insertCompletedJob(db);
  const invoiceId = createInvoiceFromEstimate(db, 1, { tallyInvoiceNo: "TLY-1", notes: "", documentAvailable: true });
  const paymentId = recordPayment(db, invoiceId, { mode: "Cash", otherDetail: "", reference: "" });
  assert.throws(() => voidPayment(db, paymentId, "Cash count correction"), /read-only/);
  const view = readState(db).jobs[0];
  assert.equal(view.job.main_status, "CLOSED");
  assert.equal(view.invoice?.status, "Cleared");
  assert.equal(view.receipt?.invoice_id, invoiceId);
});

test("a closed job's payment can no longer be voided or recorded", async () => {
  const db = await database();
  insertCompletedJob(db);
  const invoiceId = createInvoiceFromEstimate(db, 1, { tallyInvoiceNo: "TLY-1", notes: "", documentAvailable: true });
  const paymentId = recordPayment(db, invoiceId, { mode: "Cash", otherDetail: "", reference: "" });
  assert.throws(() => voidPayment(db, paymentId, "Too late"), /read-only/);
});

test("billing actor boundary allows Owner/Admin and Accounts while rejecting every other role", async () => {
  const db = await database();
  insertCompletedJob(db);
  db.run("insert into users(id,email,name,role,password) values(3,'accounts@example.com','Accounts','accounts','x'),(4,'reception@example.com','Reception','reception','x'),(5,'store@example.com','Store','store','x')");
  const invoiceId = createInvoiceForActor(db, 1, 1, { tallyInvoiceNo: "TLY-AUTH", notes: "", documentAvailable: true });
  assert.throws(() => voidInvoiceForActor(db, invoiceId, 2, "Not allowed"), /Only Owner\/Admin/);
  assert.throws(() => recordPaymentForActor(db, invoiceId, 4, { mode: "Cash", otherDetail: "", reference: "" }), /Only Owner\/Admin and Accounts/);
  assert.throws(() => recordPaymentForActor(db, invoiceId, 5, { mode: "Cash", otherDetail: "", reference: "" }), /Only Owner\/Admin and Accounts/);
  assert.throws(() => recordPaymentForActor(db, invoiceId, 2, { mode: "Cash", otherDetail: "", reference: "" }), /Only Owner\/Admin and Accounts/);
  const paymentId = recordPaymentForActor(db, invoiceId, 3, { mode: "Cash", otherDetail: "", reference: "AUTH" });
  assert.equal(readState(db).jobs[0].payments[0].id, paymentId);
  assert.throws(() => voidPaymentForActor(db, paymentId, 2, "Advisor"), /Only Owner\/Admin/);
  assert.throws(() => voidPaymentForActor(db, paymentId, 3, "Accounts void"), /Only Owner\/Admin/);
});

test("Accounts payment records delivery details as part of the handover", async () => {
  const db = await database();
  insertCompletedJob(db);
  db.run("insert into users(id,email,name,role,password) values(3,'accounts@example.com','Accounts','accounts','x')");
  const invoiceId = createInvoiceForActor(db, 1, 1, { tallyInvoiceNo: "TLY-DELIVERY", notes: "", documentAvailable: true });
  recordPaymentForActor(db, invoiceId, 3, { mode: "UPI", otherDetail: "", reference: "FULL" });
  const view = readState(db).jobs[0];
  assert.equal(view.job.main_status, "CLOSED");
  assert.ok(view.job.delivery_by);
  assert.ok(view.job.acknowledgement);
  const deliveredItem = view.checklist_items.find((item) => item.stage === "CLOSED" && item.label === "Delivered");
  assert.equal(deliveredItem?.checked_by, 3);
  assert.ok(deliveredItem?.checked_at);
});

test("payments mixed list orders unpaid, received, then void and gates void/record actions", async () => {
  const { mixedPaymentRows, canRecordOrVoidPayment, canVoidCurrentInvoice } = await import("../src/invoice-math");
  const inv = (id: number, voided_at: string | null = null) => ({ id, voided_at }) as never;
  const pay = (id: number, invoice_id: number, voided_at: string | null = null) => ({ id, invoice_id, voided_at }) as never;
  const views = [
    { invoice: inv(1), payments: [pay(10, 1, "x")] },
    { invoice: inv(2), payments: [pay(11, 2)] },
    { invoice: inv(3, "v"), payments: [] },
    { invoice: inv(4), payments: [] },
    { invoice: undefined, payments: [] },
  ] as never[];
  const rows = mixedPaymentRows(views as never);
  assert.deepEqual(rows.map((row) => row.kind), ["unpaid", "unpaid", "received", "void"]);
  assert.equal(mixedPaymentRows(views as never, { includeUnpaid: false }).length, 2);
  assert.equal(canRecordOrVoidPayment({ role: "accounts" }, { main_status: "COMPLETED" }), true);
  assert.equal(canRecordOrVoidPayment({ role: "service" }, { main_status: "COMPLETED" }), false);
  assert.equal(canRecordOrVoidPayment({ role: "admin" }, { main_status: "CLOSED" }), false);
  assert.equal(canVoidCurrentInvoice({ role: "admin" }, { invoice: inv(4), payments: [], job: { main_status: "COMPLETED" } } as never), true);
  assert.equal(canVoidCurrentInvoice({ role: "admin" }, { invoice: inv(2), payments: [pay(11, 2)], job: { main_status: "COMPLETED" } } as never), false);
});
