import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import initSqlJs from "sql.js";
import { createInventoryItem, createSchema, migrateSchema, readState, stockIn, updateInventoryItem } from "../src/db";

async function database() {
  const SQL = await initSqlJs({ locateFile: () => fileURLToPath(new URL("../node_modules/sql.js/dist/sql-wasm.wasm", import.meta.url)) });
  return new SQL.Database();
}

test("selling prices migrate to zero and persist through stock operations", async () => {
  const db = await database();
  // Simulate a database saved before selling_price existed.
  db.run("create table inventory(id integer primary key, sku text, category text, name text, unit text, stock_qty real, low_stock_qty real)");
  db.run("insert into inventory(id,sku,category,name,unit,stock_qty,low_stock_qty) values(1,'OLD-1','General','Old item','piece',2,1)");
  createSchema(db);
  migrateSchema(db);
  assert.equal(readState(db).inventory[0].selling_price, 0);

  const id = createInventoryItem(db, { sku: "NEW-1", category: "Film", name: "New item", unit: "roll", stock_qty: 3, low_stock_qty: 1, selling_price: 499.5 });
  stockIn(db, id, 2, "Delivery received");
  let item = readState(db).inventory.find((row) => row.id === id)!;
  assert.deepEqual([item.stock_qty, item.selling_price], [5, 499.5]);

  updateInventoryItem(db, id, { ...item, name: "Renamed item", selling_price: 550 });
  item = readState(db).inventory.find((row) => row.id === id)!;
  assert.deepEqual([item.name, item.stock_qty, item.selling_price], ["Renamed item", 5, 550]);
  assert.throws(() => stockIn(db, id, 0, "Invalid"), /greater than zero/);
});
