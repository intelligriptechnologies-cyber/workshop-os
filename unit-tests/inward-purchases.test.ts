import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import initSqlJs from "sql.js";
import {
  createInwardPurchaseDraft,
  createPurchaseRequestForActor,
  cancelPurchaseRequestForActor,
  approveInwardPurchaseForActor,
  approvePurchaseRequestForActor,
  createPurchaseOrderForActor,
  createSchema,
  createSupplierForActor,
  materialStockOnHand,
  migrateSchema,
  reviseInwardPurchaseForActor,
  recordStockInwardForActor,
  previousPurchaseHistoryForItem,
  savePurchaseOrderQuotationForActor,
  receiveAndPostInwardPurchaseForActor,
  sendInwardPurchaseForPoApprovalForActor,
  issuePurchaseOrderForActor,
  setPurchaseOrderStatusForActor,
  submitInwardPurchaseForActor,
  updateInwardPurchaseDraftForActor,
  updatePurchaseRequestForActor,
} from "../src/db";

async function database() {
  const SQL = await initSqlJs({ locateFile: () => fileURLToPath(new URL("../node_modules/sql.js/dist/sql-wasm.wasm", import.meta.url)) });
  const db = new SQL.Database();
  createSchema(db);
  db.run("insert into users(id,email,name,role,password) values (1,'owner@test','Owner','admin','x'),(2,'store@test','Store','store','x'),(3,'service@test','Service','service','x'),(4,'other-store@test','Other Store','store','x')");
  db.run("insert into inventory(id,sku,category,name,unit,stock_qty,low_stock_qty) values (1,'OIL','Fluids','Engine oil','litre',10,2)");
  migrateSchema(db);
  return db;
}

const scan = { original_name: "supplier-invoice.pdf", mime_type: "application/pdf", byte_size: 10, document_url: "data:application/pdf;base64,AA==" };
const line = { item_id: 1, received_qty: 5, unit_cost: 100, discount: 10, gst_rate: 18 };

test("Store creates editable Purchase Requests with permanent auto-generated PO numbers", async () => {
  const db = await database();
  const first = createPurchaseRequestForActor(db, 2, {
    order_date: "2026-10-01",
    lines: [{ item_id: 1, ordered_qty: 3 }, { item_name: "Custom polishing pad", unit: "piece", ordered_qty: 4 }],
  });
  const second = createPurchaseRequestForActor(db, 2, {
    order_date: "2026-10-01",
    lines: [{ item_id: 1, ordered_qty: 1 }],
  });
  assert.deepEqual(
    db.exec("select po_number,status,supplier_id from purchase_orders order by id")[0].values,
    [["PO-WOS-A-00001", "PO Request", 0], ["PO-WOS-A-00002", "PO Request", 0]],
  );
  assert.deepEqual(
    db.exec("select item_id,item_name,unit,ordered_qty from purchase_order_lines where purchase_order_id=? order by id", [first])[0].values,
    [[1, "", "", 3], [0, "Custom polishing pad", "piece", 4]],
  );
  updatePurchaseRequestForActor(db, first, 2, {
    order_date: "2026-10-02",
    notes: "Urgent",
    lines: [{ item_id: 1, ordered_qty: 5 }],
  });
  assert.deepEqual(
    db.exec("select po_number,order_date,notes from purchase_orders where id=?", [first])[0].values,
    [["PO-WOS-A-00001", "2026-10-02", "Urgent"]],
  );
  assert.throws(
    () => updatePurchaseRequestForActor(db, second, 4, { order_date: "2026-10-03", lines: [{ item_id: 1, ordered_qty: 1 }] }),
    /Only the requesting Store user can change this Purchase Request/,
  );
  cancelPurchaseRequestForActor(db, first, 2);
  assert.equal(db.exec("select status from purchase_orders where id=?", [first])[0].values[0][0], "Cancelled");
  assert.throws(
    () => updatePurchaseRequestForActor(db, first, 2, { order_date: "2026-10-03", lines: [{ item_id: 1, ordered_qty: 1 }] }),
    /Only unreviewed Purchase Requests can be changed/,
  );
  assert.throws(
    () => updatePurchaseRequestForActor(db, second, 1, { order_date: "2026-10-03", lines: [{ item_id: 1, ordered_qty: 1 }] }),
    /Only the requesting Store user can change this Purchase Request/,
  );
});

test("Store cannot bypass Purchase Requests with a supplier-priced PO or later-stage command", async () => {
  const db = await database();
  const supplier = createSupplierForActor(db, 1, { name: "Admin-only PO supplier" });
  const input = { supplier_id: supplier, po_number: "PO-ADMIN-ONLY", order_date: "2026-10-01", lines: [{ item_id: 1, ordered_qty: 1, unit_cost: 100 }] };
  assert.throws(() => createPurchaseOrderForActor(db, 2, input), /Only Admin/);
  const order = createPurchaseOrderForActor(db, 1, input);
  assert.throws(() => setPurchaseOrderStatusForActor(db, order, 2, "send"), /Only Admin/);
});

test("PO request numbering rolls over after 99,999 and never reuses a cancelled number", async () => {
  const db = await database();
  db.run("insert into purchase_orders(supplier_id,po_number,order_date,notes,status,created_by,created_at,updated_at) values(0,'PO-WOS-A-99999','2026-10-01','','Cancelled',2,datetime('now'),datetime('now'))");
  const rollover = createPurchaseRequestForActor(db, 2, { order_date: "2026-10-01", lines: [{ item_id: 1, ordered_qty: 1 }] });
  assert.equal(db.exec("select po_number from purchase_orders where id=?", [rollover])[0].values[0][0], "PO-WOS-B-00001");
  db.run("insert into purchase_orders(supplier_id,po_number,order_date,notes,status,created_by,created_at,updated_at) values(0,'PO-WOS-Z-99999','2026-10-01','','Cancelled',2,datetime('now'),datetime('now'))");
  const request = createPurchaseRequestForActor(db, 2, { order_date: "2026-10-01", lines: [{ item_id: 1, ordered_qty: 1 }] });
  assert.equal(db.exec("select po_number from purchase_orders where id=?", [request])[0].values[0][0], "PO-WOS-AA-00001");
});

test("Admin reviews only the three newest completed purchases for a requested SKU across suppliers", async () => {
  const db = await database();
  const suppliers = ["First supplier", "Second supplier", "Third supplier", "Latest supplier"].map((name) => createSupplierForActor(db, 1, { name }));
  ["2026-03-01", "2026-06-01", "2026-09-01", "2026-10-01"].forEach((order_date, index) => {
    const po = createPurchaseOrderForActor(db, 1, { supplier_id: suppliers[index], po_number: `HISTORY-${index}`, order_date, lines: [{ item_id: 1, ordered_qty: index + 1, unit_cost: 100 + index }] });
    db.run("update purchase_orders set status='Closed' where id=?", [po]);
  });
  const draft = createPurchaseOrderForActor(db, 1, { supplier_id: suppliers[0], po_number: "OPEN-PRICE", order_date: "2026-10-02", lines: [{ item_id: 1, ordered_qty: 99, unit_cost: 1 }] });
  db.run("update purchase_orders set status='Sent' where id=?", [draft]);

  assert.deepEqual(previousPurchaseHistoryForItem(db, 1), [
    { supplier_name: "Latest supplier", purchase_date: "2026-10-01", unit_cost: 103, quantity: 4 },
    { supplier_name: "Third supplier", purchase_date: "2026-09-01", unit_cost: 102, quantity: 3 },
    { supplier_name: "Second supplier", purchase_date: "2026-06-01", unit_cost: 101, quantity: 2 },
  ]);
  assert.deepEqual(previousPurchaseHistoryForItem(db, 0), []);
});

test("Admin can optionally save a manual quotation only for a requested PO line", async () => {
  const db = await database();
  const request = createPurchaseRequestForActor(db, 2, { order_date: "2026-10-01", lines: [{ item_id: 1, ordered_qty: 3 }, { item_name: "Never stocked", unit: "piece", ordered_qty: 1 }] });
  const lines = db.exec("select id from purchase_order_lines where purchase_order_id=? order by id", [request])[0].values;
  const quotation = savePurchaseOrderQuotationForActor(db, request, 1, { purchase_order_line_id: Number(lines[1][0]), supplier_name: "New item supplier", quote_date: "2026-10-02", quoted_qty: 1, unit_cost: 25, notes: "Phone quote" });
  assert.deepEqual(db.exec("select supplier_name,quote_date,quoted_qty,unit_cost,notes from purchase_order_quotations where id=?", [quotation])[0].values, [["New item supplier", "2026-10-02", 1, 25, "Phone quote"]]);
  assert.throws(() => savePurchaseOrderQuotationForActor(db, request, 2, { purchase_order_line_id: Number(lines[0][0]), supplier_name: "Store cannot quote", quoted_qty: 1, unit_cost: 20 }), /Only Admin/);
  assert.throws(() => savePurchaseOrderQuotationForActor(db, request, 1, { purchase_order_line_id: 999, supplier_name: "Wrong line", quoted_qty: 1, unit_cost: 20 }), /line from this Purchase Request/);
  db.run("update purchase_orders set status='Draft' where id=?", [request]);
  assert.throws(() => savePurchaseOrderQuotationForActor(db, request, 1, { purchase_order_line_id: Number(lines[0][0]), supplier_name: "Late quote", quoted_qty: 1, unit_cost: 20 }), /while a Purchase Request is under review/);
});

test("only Admin can commercially approve a request, enriching new items at zero stock and splitting suppliers", async () => {
  const db = await database();
  const firstSupplier = createSupplierForActor(db, 1, { name: "Primary supplier" });
  const secondSupplier = createSupplierForActor(db, 1, { name: "Specialist supplier" });
  const request = createPurchaseRequestForActor(db, 2, {
    order_date: "2026-10-01",
    lines: [{ item_id: 1, ordered_qty: 3 }, { item_name: "Ceramic coating", unit: "bottle", ordered_qty: 2 }],
  });
  const lines = db.exec("select id from purchase_order_lines where purchase_order_id=? order by id", [request])[0].values;
  const approval = {
    lines: [
      { purchase_order_line_id: Number(lines[0][0]), supplier_id: firstSupplier, unit_cost: 110 },
      { purchase_order_line_id: Number(lines[1][0]), supplier_id: secondSupplier, unit_cost: 500, inventory_item: { sku: "COAT-01", category: "Detailing", name: "Ceramic coating", unit: "bottle", low_stock_qty: 1, selling_price: 750 } },
    ],
  };
  assert.throws(() => approvePurchaseRequestForActor(db, request, 2, approval), /Only Admin/);
  assert.throws(() => approvePurchaseRequestForActor(db, request, 1, { lines: [approval.lines[0]] }), /every requested line/);
  const approved = approvePurchaseRequestForActor(db, request, 1, approval);
  assert.equal(approved.length, 2);
  assert.deepEqual(
    db.exec("select po_number,supplier_id,status,source_purchase_order_id from purchase_orders order by id")[0].values,
    [["PO-WOS-A-00001", firstSupplier, "PO Request Approved", null], ["PO-WOS-A-00002", secondSupplier, "PO Request Approved", request]],
  );
  assert.deepEqual(
    db.exec("select sku,stock_qty from inventory where sku='COAT-01'")[0].values,
    [["COAT-01", 0]],
  );
  assert.deepEqual(
    db.exec("select item_id,unit_cost from purchase_order_lines where purchase_order_id=?", [request])[0].values,
    [[1, 110]],
  );
  assert.throws(() => approvePurchaseRequestForActor(db, request, 1, approval), /Only Purchase Requests/);
});

test("only an Admin can issue a fully approved Purchase Order to its assigned supplier", async () => {
  const db = await database();
  const supplier = createSupplierForActor(db, 1, { name: "Issuing supplier", contact_name: "Nina Buyer", phone: "9000000000", email: "nina@example.com" });
  const request = createPurchaseRequestForActor(db, 2, {
    order_date: "2026-10-01",
    lines: [{ item_id: 1, ordered_qty: 3 }],
  });
  const lineId = Number(db.exec("select id from purchase_order_lines where purchase_order_id=?", [request])[0].values[0][0]);

  assert.throws(() => issuePurchaseOrderForActor(db, request, 1), /only be issued after it is fully approved/i);
  approvePurchaseRequestForActor(db, request, 1, {
    lines: [{ purchase_order_line_id: lineId, supplier_id: supplier, unit_cost: 125 }],
  });
  assert.throws(() => issuePurchaseOrderForActor(db, request, 2), /Only Admin/);

  issuePurchaseOrderForActor(db, request, 1);
  assert.deepEqual(
    db.exec("select status,supplier_id from purchase_orders where id=?", [request])[0].values,
    [["PO Issued", supplier]],
  );
});

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
  const po = createPurchaseOrderForActor(db, 1, { supplier_id: supplier, po_number: "PO-100", order_date: "2026-09-28", lines: [{ item_id: 1, ordered_qty: 5, unit_cost: 100, discount: 0, gst_rate: 18 }] });
  setPurchaseOrderStatusForActor(db, po, 1, "send");
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

test("PO links reject mismatches and terminal orders while manual inward remains independent", async () => {
  const db = await database();
  const supplier = createSupplierForActor(db, 1, { name: "Link Safety Supplies" });
  db.run("insert into inventory(id,sku,category,name,unit,stock_qty,low_stock_qty) values (2,'FILTER','Parts','Oil filter','piece',0,1)");
  const po = createPurchaseOrderForActor(db, 1, { supplier_id: supplier, po_number: "PO-LINK-SAFE", order_date: "2026-09-28", lines: [{ item_id: 1, ordered_qty: 2, unit_cost: 10 }] });
  const lineId = Number(db.exec("select id from purchase_order_lines where purchase_order_id=?", [po])[0].values[0][0]);
  assert.throws(() => recordStockInwardForActor(db, 2, { item_id: 1, qty: 1, purchase_order_line_id: lineId }), /open purchase order line/);
  setPurchaseOrderStatusForActor(db, po, 1, "send");
  assert.throws(() => recordStockInwardForActor(db, 2, { item_id: 2, qty: 1, purchase_order_line_id: lineId }), /different inventory item/);
  recordStockInwardForActor(db, 2, { item_id: 1, qty: 1, purchase_order_line_id: lineId });
  setPurchaseOrderStatusForActor(db, po, 1, "cancel");
  assert.equal(db.exec("select status from purchase_orders where id=?", [po])[0].values[0][0], "Cancelled");
  assert.throws(() => recordStockInwardForActor(db, 2, { item_id: 1, qty: 1, purchase_order_line_id: lineId }), /open purchase order line/);
  recordStockInwardForActor(db, 2, { item_id: 1, qty: 1 });
  assert.equal(materialStockOnHand(db, 1), 12, "unlinked receipt changes stock but not PO reconciliation");
  assert.equal(db.exec("select count(*) from stock_inwards where purchase_order_id=?", [po])[0].values[0][0], 1);
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
