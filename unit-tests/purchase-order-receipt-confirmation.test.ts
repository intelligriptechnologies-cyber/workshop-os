import assert from "node:assert/strict";
import test from "node:test";
import initSqlJs from "sql.js";
import { fileURLToPath } from "node:url";
import {
  approvePurchaseRequestForActor,
  createPurchaseRequestForActor,
  createSchema,
  createSupplierForActor,
  issuePurchaseOrderForActor,
  migrateSchema,
  confirmPurchaseOrderForActor,
  recordPurchaseOrderReceiptForActor,
  closePurchaseOrderForActor,
  readState,
} from "../src/db";

async function database() {
  const SQL = await initSqlJs({
    locateFile: () => fileURLToPath(new URL("../node_modules/sql.js/dist/sql-wasm.wasm", import.meta.url)),
  });
  const db = new SQL.Database();
  createSchema(db);
  migrateSchema(db);
  db.run("insert into users(id,email,name,role,password) values (1,'admin@test','Admin','admin','x'),(2,'store@test','Store','store','x')");
  db.run("insert into inventory(id,sku,category,name,unit,stock_qty,low_stock_qty) values (1,'OIL-1','Consumables','Engine oil','litre',10,1)");
  return db;
}

async function issuedOrder() {
  const db = await database();
  const supplier = createSupplierForActor(db, 1, { name: "Receipt supplier" });
  const po = createPurchaseRequestForActor(db, 2, {
    order_date: "2026-10-01",
    lines: [{ item_id: 1, ordered_qty: 5 }],
  });
  const lineId = Number(db.exec("select id from purchase_order_lines where purchase_order_id=?", [po])[0].values[0][0]);
  approvePurchaseRequestForActor(db, po, 1, {
    lines: [{ purchase_order_line_id: lineId, supplier_id: supplier, unit_cost: 100 }],
  });
  issuePurchaseOrderForActor(db, po, 1);
  return { db, po, lineId };
}

test("Admin records multiple partial PO deliveries without changing stock", async () => {
  const { db, po, lineId } = await issuedOrder();
  recordPurchaseOrderReceiptForActor(db, po, 1, { lines: [{ purchase_order_line_id: lineId, delivered_qty: 2 }] });
  recordPurchaseOrderReceiptForActor(db, po, 1, { lines: [{ purchase_order_line_id: lineId, delivered_qty: 3 }] });

  assert.deepEqual(
    db.exec("select status from purchase_orders where id=?", [po])[0].values,
    [["PO Received"]],
  );
  assert.deepEqual(
    db.exec("select delivered_qty from purchase_order_receipt_lines order by id")[0].values,
    [[2], [3]],
  );
  assert.deepEqual(db.exec("select stock_qty from inventory where id=1")[0].values, [[10]]);
  assert.throws(
    () => recordPurchaseOrderReceiptForActor(db, po, 1, { lines: [{ purchase_order_line_id: lineId, delivered_qty: 1 }] }),
    /cannot exceed the ordered quantity/i,
  );
  assert.throws(
    () => recordPurchaseOrderReceiptForActor(db, po, 2, { lines: [{ purchase_order_line_id: lineId, delivered_qty: 1 }] }),
    /Only Admin/,
  );
});

test("closure posts accepted stock once and locks the confirmed Purchase Order", async () => {
  const { db, po, lineId } = await issuedOrder();
  recordPurchaseOrderReceiptForActor(db, po, 1, { lines: [{ purchase_order_line_id: lineId, delivered_qty: 5 }] });
  assert.throws(() => closePurchaseOrderForActor(db, po, 1), /fully confirmed/i);
  confirmPurchaseOrderForActor(db, po, 1, { lines: [{ purchase_order_line_id: lineId, accepted_qty: 3, returned_qty: 1, damaged_qty: 1, wasted_qty: 0 }] });
  assert.equal(readState(db).inventory.find((item) => item.id === 1)?.stock_qty, 10);
  const first = closePurchaseOrderForActor(db, po, 1);
  assert.deepEqual(closePurchaseOrderForActor(db, po, 1), first);
  assert.equal(readState(db).inventory.find((item) => item.id === 1)?.stock_qty, 13);
  assert.deepEqual(db.exec("select status from purchase_orders where id=?", [po])[0].values, [["Closed"]]);
  assert.equal(db.exec("select count(*) from stock_inwards where purchase_order_id=?", [po])[0].values[0][0], 1);
});

test("Admin confirms a partial delivery when every delivered unit is accounted for", async () => {
  const { db, po, lineId } = await issuedOrder();
  recordPurchaseOrderReceiptForActor(db, po, 1, { lines: [{ purchase_order_line_id: lineId, delivered_qty: 3 }] });

  assert.throws(
    () => confirmPurchaseOrderForActor(db, po, 1, { lines: [{ purchase_order_line_id: lineId, accepted_qty: 1, returned_qty: 1, damaged_qty: 0, wasted_qty: 0 }] }),
    /must equal the delivered quantity/i,
  );
  assert.throws(
    () => confirmPurchaseOrderForActor(db, po, 1, { lines: [{ purchase_order_line_id: lineId, accepted_qty: 4, returned_qty: 0, damaged_qty: 0, wasted_qty: 0 }] }),
    /must equal the delivered quantity/i,
  );

  confirmPurchaseOrderForActor(db, po, 1, {
    lines: [{ purchase_order_line_id: lineId, accepted_qty: 1, returned_qty: 1, damaged_qty: 1, wasted_qty: 0 }],
  });
  assert.deepEqual(db.exec("select status from purchase_orders where id=?", [po])[0].values, [["PO Confirmation"]]);
  assert.deepEqual(
    db.exec("select accepted_qty,returned_qty,damaged_qty,wasted_qty from purchase_order_confirmations where purchase_order_line_id=?", [lineId])[0].values,
    [[1, 1, 1, 0]],
  );
  assert.equal(db.exec("select count(*) from stock_inwards")[0].values[0][0], 0);
  assert.throws(
    () => recordPurchaseOrderReceiptForActor(db, po, 1, { lines: [{ purchase_order_line_id: lineId, delivered_qty: 1 }] }),
    /only be recorded for an issued or received Purchase Order/i,
  );
  assert.throws(
    () => confirmPurchaseOrderForActor(db, po, 2, { lines: [{ purchase_order_line_id: lineId, accepted_qty: 3, returned_qty: 0, damaged_qty: 0, wasted_qty: 0 }] }),
    /Only Admin/,
  );
});
