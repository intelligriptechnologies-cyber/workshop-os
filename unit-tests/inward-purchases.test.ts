import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import initSqlJs from "sql.js";
import {
  createInwardPurchaseDraft,
  approveInwardPurchaseForActor,
  createPurchaseOrderForActor,
  createSchema,
  createSupplierForActor,
  materialStockOnHand,
  migrateSchema,
  reviseInwardPurchaseForActor,
  recordStockInwardForActor,
  receiveAndPostInwardPurchaseForActor,
  sendInwardPurchaseForPoApprovalForActor,
  setPurchaseOrderStatusForActor,
  submitInwardPurchaseForActor,
  updateInwardPurchaseDraftForActor,
} from "../src/db";

async function database() {
  const SQL = await initSqlJs({ locateFile: () => fileURLToPath(new URL("../node_modules/sql.js/dist/sql-wasm.wasm", import.meta.url)) });
  const db = new SQL.Database();
  createSchema(db);
  db.run("insert into users(id,email,name,role,password) values (1,'owner@test','Owner','admin','x'),(2,'store@test','Store','store','x'),(3,'service@test','Service','service','x')");
  db.run("insert into inventory(id,sku,category,name,unit,stock_qty,low_stock_qty) values (1,'OIL','Fluids','Engine oil','litre',10,2)");
  migrateSchema(db);
  return db;
}

const scan = { original_name: "supplier-invoice.pdf", mime_type: "application/pdf", byte_size: 10, document_url: "data:application/pdf;base64,AA==" };
const line = { item_id: 1, received_qty: 5, unit_cost: 100, discount: 10, gst_rate: 18 };

test("migration preserves legacy submitted receipts as read-only received history", async () => {
  const SQL = await initSqlJs({ locateFile: () => fileURLToPath(new URL("../node_modules/sql.js/dist/sql-wasm.wasm", import.meta.url)) });
  const db = new SQL.Database();
  createSchema(db);
  db.run("insert into users(id,email,name,role,password) values (1,'owner@test','Owner','admin','x')");
  db.run("insert into inward_purchases(id,status,created_by,created_at,updated_at) values (1,'Submitted',1,'2026-09-01','2026-09-01')");
  migrateSchema(db);
  assert.equal(db.exec("select status from inward_purchases where id=1")[0].values[0][0], "Received");
});

test("Store submits an invoice receipt once and its signed ledger increases the shared stock balance", async () => {
  const db = await database();
  const supplier = createSupplierForActor(db, 1, { name: "Acme Supplies" });
  const purchase = createInwardPurchaseDraft(db, 2, { supplier_id: supplier, supplier_invoice_no: "ACME-001", invoice_date: "2026-09-26", lines: [line], attachments: [scan] });
  submitInwardPurchaseForActor(db, purchase, 2);
  assert.equal(materialStockOnHand(db, 1), 15);
  submitInwardPurchaseForActor(db, purchase, 2);
  assert.equal(materialStockOnHand(db, 1), 15, "a retry is idempotent");
  assert.equal(db.exec("select * from stock_ledger where type='inward'")[0].values.length, 1);
  assert.throws(() => updateInwardPurchaseDraftForActor(db, purchase, 2, { lines: [line] }), /cannot be edited/);
});

test("submission validates the supplier invoice and document requirements", async () => {
  const db = await database();
  const supplier = createSupplierForActor(db, 1, { name: "Acme Supplies" });
  const missingScan = createInwardPurchaseDraft(db, 2, { supplier_id: supplier, supplier_invoice_no: "ACME-002", invoice_date: "2026-09-26", lines: [line] });
  assert.throws(() => submitInwardPurchaseForActor(db, missingScan, 2), /invoice scan/);
  const good = createInwardPurchaseDraft(db, 2, { supplier_id: supplier, supplier_invoice_no: "ACME-002", invoice_date: "2026-09-26", lines: [line], attachments: [scan] });
  submitInwardPurchaseForActor(db, good, 2);
  const duplicate = createInwardPurchaseDraft(db, 2, { supplier_id: supplier, supplier_invoice_no: "ACME-002", invoice_date: "2026-09-26", lines: [line], attachments: [scan] });
  assert.throws(() => submitInwardPurchaseForActor(db, duplicate, 2), /already been submitted/);
  assert.throws(() => createSupplierForActor(db, 2, { name: "Unauthorised" }), /Only Admin/);
});

test("an Admin revision retains the original receipt and applies only the quantity delta", async () => {
  const db = await database();
  const supplier = createSupplierForActor(db, 1, { name: "Acme Supplies" });
  const purchase = createInwardPurchaseDraft(db, 2, { supplier_id: supplier, supplier_invoice_no: "ACME-003", invoice_date: "2026-09-26", lines: [line], attachments: [scan] });
  submitInwardPurchaseForActor(db, purchase, 2);
  assert.throws(() => reviseInwardPurchaseForActor(db, purchase, 2, { reason: "Short delivery", lines: [{ ...line, received_qty: 3 }] }), /Only Admin/);
  reviseInwardPurchaseForActor(db, purchase, 1, { reason: "Short delivery", lines: [{ ...line, received_qty: 3 }] });
  assert.equal(materialStockOnHand(db, 1), 13);
  assert.equal(db.exec("select * from inward_purchase_revisions")[0].values.length, 1);
  assert.equal(db.exec("select * from inward_purchases where id=1 and status='Submitted'")[0].values.length, 1);
});

test("purchase orders reconcile linked stock inwards without creating a second receipt movement", async () => {
  const db = await database();
  const supplier = createSupplierForActor(db, 1, { name: "Acme Supplies" });
  const po = createPurchaseOrderForActor(db, 2, { supplier_id: supplier, po_number: "PO-100", order_date: "2026-09-28", lines: [{ item_id: 1, ordered_qty: 5, unit_cost: 100, discount: 0, gst_rate: 18 }] });
  setPurchaseOrderStatusForActor(db, po, 2, "send");
  const lineId = Number(db.exec("select id from purchase_order_lines where purchase_order_id=1")[0].values[0][0]);
  recordStockInwardForActor(db, 2, { item_id: 1, qty: 3, purchase_order_line_id: lineId });
  assert.equal(materialStockOnHand(db, 1), 13);
  assert.equal(db.exec("select status from purchase_orders where id=1")[0].values[0][0], "Partially Received");
  recordStockInwardForActor(db, 2, { item_id: 1, qty: 2, purchase_order_line_id: lineId });
  assert.equal(materialStockOnHand(db, 1), 15);
  assert.equal(db.exec("select status from purchase_orders where id=1")[0].values[0][0], "Ready to Close");
  recordStockInwardForActor(db, 2, { item_id: 1, qty: 1 });
  assert.equal(db.exec("select count(*) from stock_inwards where purchase_order_line_id is null")[0].values[0][0], 1);
  assert.equal(db.exec("select count(*) from stock_ledger where type='manual-inward'")[0].values[0][0], 3);
});

test("a draft creates one approved PO snapshot and posts its receipt only once", async () => {
  const db = await database();
  const supplier = createSupplierForActor(db, 1, { name: "Lifecycle Supplies" });
  const purchase = createInwardPurchaseDraft(db, 2, { supplier_id: supplier, po_number: "PO-LIFE-1", lines: [line] });
  sendInwardPurchaseForPoApprovalForActor(db, purchase, 2);
  assert.equal(db.exec("select status from inward_purchases where id=?", [purchase])[0].values[0][0], "Awaiting PO Approval");
  assert.equal(db.exec("select count(*) from purchase_orders")[0].values[0][0], 1);
  assert.throws(() => approveInwardPurchaseForActor(db, purchase, 2), /Only Admin/);
  approveInwardPurchaseForActor(db, purchase, 1);
  assert.equal(db.exec("select status from purchase_orders where id=1")[0].values[0][0], "Sent");
  receiveAndPostInwardPurchaseForActor(db, purchase, 2, { supplier_invoice_no: "LIFE-001", invoice_date: "2026-09-28", lines: [{ ...line, purchase_order_line_id: 1 }], attachments: [scan] });
  assert.equal(materialStockOnHand(db, 1), 15);
  receiveAndPostInwardPurchaseForActor(db, purchase, 2, { supplier_invoice_no: "LIFE-001", invoice_date: "2026-09-28", lines: [{ ...line, purchase_order_line_id: 1 }], attachments: [scan] });
  assert.equal(materialStockOnHand(db, 1), 15, "a received receipt is idempotent");
  assert.equal(db.exec("select status from inward_purchases where id=?", [purchase])[0].values[0][0], "Received");
  assert.equal(db.exec("select count(*) from stock_inwards where purchase_order_line_id=1")[0].values[0][0], 1);
});

test("receipt posting rejects mismatched linked PO rows atomically", async () => {
  const db = await database();
  const supplier = createSupplierForActor(db, 1, { name: "Exact Match Supplies" });
  const purchase = createInwardPurchaseDraft(db, 2, { supplier_id: supplier, lines: [line] });
  sendInwardPurchaseForPoApprovalForActor(db, purchase, 2);
  approveInwardPurchaseForActor(db, purchase, 1);
  assert.throws(() => receiveAndPostInwardPurchaseForActor(db, purchase, 2, { supplier_invoice_no: "EXACT-1", invoice_date: "2026-09-28", lines: [{ ...line, purchase_order_line_id: 99 }], attachments: [scan] }), /exactly match/);
  assert.equal(materialStockOnHand(db, 1), 10);
  assert.equal(db.exec("select status from inward_purchases where id=?", [purchase])[0].values[0][0], "Approved");
});
