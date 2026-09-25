import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import initSqlJs, { type Database } from "sql.js";
import {
  addMaterialRowForActor,
  cancelMaterialRowForActor,
  createSchema,
  deleteMaterialRowForActor,
  editIssuedMaterialRowForActor,
  materialStockOnHand,
  releaseMaterialRowForActor,
  migrateSchema,
  readState,
  reconcileArtifactChecklist,
  reRequestMaterialRowForActor,
  requestMaterialRowForActor,
  setChecklistItemNotApplicableForActor,
  updateMaterialRowForActor,
} from "../src/db";
import { canManageMaterialRows, materialRowActions, overStockWarning } from "../src/materials";

async function database(main = "IN_PROGRESS", sub = "Material Requested") {
  const SQL = await initSqlJs({ locateFile: () => fileURLToPath(new URL("../node_modules/sql.js/dist/sql-wasm.wasm", import.meta.url)) });
  const db = new SQL.Database();
  createSchema(db);
  db.run("insert into users(id,email,name,role,password) values (1,'owner@test','Owner','admin','x'),(2,'linked@test','Linked','service','x'),(3,'other@test','Other','service','x'),(5,'tech@test','Tech','tech','x'),(6,'store@test','Store','store','x')");
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
const status = (db: Database, id: number) => rows<{ status: string }>(db, `select status from material_requests where id=${id}`)[0]?.status;
const ticked = (db: Database, label: string) => Boolean(rows<{ checked_at: string | null }>(db, `select checked_at from checklist_items where label='${label}' order by id desc`)[0].checked_at);

test("rows go Draft, Requested, Re-requested and Cancel only from requested states", async () => {
  const db = await database();
  const id = addMaterialRowForActor(db, 1, 2, 1, 3);
  assert.equal(status(db, id), "Draft");
  assert.throws(() => cancelMaterialRowForActor(db, id, 2), /cannot be cancelled/);
  updateMaterialRowForActor(db, id, 2, 2, 2);
  requestMaterialRowForActor(db, id, 2);
  assert.equal(status(db, id), "Requested");
  assert.throws(() => updateMaterialRowForActor(db, id, 2, 1, 1), /cannot be edited/);
  assert.throws(() => deleteMaterialRowForActor(db, id, 2), /cannot be deleted/);
  reRequestMaterialRowForActor(db, id, 2, 1, 5);
  assert.equal(status(db, id), "Re-requested");
  assert.deepEqual(rows(db, `select item_id,requested_qty from material_requests where id=${id}`), [{ item_id: 1, requested_qty: 5 }]);
  cancelMaterialRowForActor(db, id, 1);
  assert.equal(status(db, id), "Cancelled");
  assert.throws(() => reRequestMaterialRowForActor(db, id, 2, 1, 1), /cannot be re-requested/);
});

test("Draft rows delete freely", async () => {
  const db = await database();
  const id = addMaterialRowForActor(db, 1, 1, 1, 1);
  deleteMaterialRowForActor(db, id, 1);
  assert.equal(rows(db, "select * from material_requests").length, 0);
});

test("rows change only while IN_PROGRESS and only for Owner or the linked Advisor", async () => {
  const db = await database();
  assert.throws(() => addMaterialRowForActor(db, 1, 3, 1, 1), /linked Service Advisor/);
  assert.throws(() => addMaterialRowForActor(db, 1, 5, 1, 1), /linked Service Advisor/);
  assert.throws(() => addMaterialRowForActor(db, 1, 2, 1, 0), /greater than zero/);
  const id = addMaterialRowForActor(db, 1, 2, 1, 1);
  db.run("update job_cards set main_status='HOLD' where id=1");
  assert.throws(() => requestMaterialRowForActor(db, id, 2), /IN_PROGRESS/);
  assert.throws(() => addMaterialRowForActor(db, 1, 1, 1, 1), /IN_PROGRESS/);
  assert.equal(canManageMaterialRows({ id: 5, role: "tech" }, { advisor_id: 2, main_status: "IN_PROGRESS" }), false);
});

test("requesting over stock warns but succeeds; stock is seed minus ledger", async () => {
  const db = await database();
  const id = addMaterialRowForActor(db, 1, 2, 2, 9);
  const result = requestMaterialRowForActor(db, id, 2);
  assert.equal(result.onHand, 4);
  assert.match(result.warning ?? "", /more than the 4 in stock/);
  assert.equal(status(db, id), "Requested");
  db.run("insert into stock_ledger(job_card_id,material_row_id,item_id,qty,type,by_user,at) values(1,1,2,3,'issue',1,'2026-01-01')");
  assert.equal(readState(db).inventory.find((item) => item.id === 2)?.stock_qty, 1);
  assert.equal(overStockWarning(1, 1), undefined);
});

test("Materials Requested auto-ticks on the first Requested row and stays ticked when cancelled", async () => {
  const db = await database();
  const id = addMaterialRowForActor(db, 1, 2, 1, 2);
  assert.equal(ticked(db, "Material Requested"), false, "a Draft row does not tick");
  requestMaterialRowForActor(db, id, 2);
  assert.equal(ticked(db, "Material Requested"), true);
  cancelMaterialRowForActor(db, id, 2);
  assert.equal(ticked(db, "Material Requested"), true);
});

test("Materials Issued unticks when a new request is made", async () => {
  const db = await database();
  const first = addMaterialRowForActor(db, 1, 2, 1, 2);
  requestMaterialRowForActor(db, first, 2);
  db.run("update material_requests set status='Issued', issued_qty=2 where id=?", [first]);
  reconcileArtifactChecklist(db, 1);
  assert.equal(ticked(db, "Material Issued"), true);
  requestMaterialRowForActor(db, addMaterialRowForActor(db, 1, 2, 2, 1), 2);
  assert.equal(ticked(db, "Material Issued"), false);
});

test("N/A on the materials items is refused once rows exist", async () => {
  const db = await database();
  const itemId = rows<{ id: number }>(db, "select id from checklist_items where label='Material Requested'")[0].id;
  addMaterialRowForActor(db, 1, 2, 1, 1);
  assert.throws(() => setChecklistItemNotApplicableForActor(db, itemId, 2, true), /no material rows/);
  db.run("delete from material_requests");
  setChecklistItemNotApplicableForActor(db, itemId, 2, true);
  assert.equal(ticked(db, "Material Requested"), true);
});

test("permitted actions per row state", () => {
  assert.deepEqual(materialRowActions({ status: "Draft" }), ["edit", "request", "delete"]);
  assert.deepEqual(materialRowActions({ status: "Requested" }), ["re-request", "cancel"]);
  assert.deepEqual(materialRowActions({ status: "Issued" }), []);
  assert.deepEqual(materialRowActions({ status: "Requested", invoiced_in: 4 }), []);
});

async function requested(qty: number, itemId = 1) {
  const db = await database();
  const id = addMaterialRowForActor(db, 1, 2, itemId, qty);
  requestMaterialRowForActor(db, id, 2);
  return { db, id };
}
const ledgerRows = (db: Database) => rows<{ qty: number; type: string; by_user: number }>(db, "select qty,type,by_user from stock_ledger order by id");

test("Store release writes a signed ledger record, decrements stock and ticks Materials Issued", async () => {
  const { db, id } = await requested(3);
  assert.throws(() => releaseMaterialRowForActor(db, id, 2), /Only Store or the Owner/);
  releaseMaterialRowForActor(db, id, 6);
  assert.equal(status(db, id), "Issued");
  assert.deepEqual(ledgerRows(db), [{ qty: 3, type: "issue", by_user: 6 }]);
  assert.equal(materialStockOnHand(db, 1), 7);
  assert.equal(ticked(db, "Material Issued"), true);
  assert.throws(() => releaseMaterialRowForActor(db, id, 6), /cannot be released/);
  assert.equal(readState(db).jobs[0].material_events?.[0].kind, "release");
});

test("release over stock is blocked and writes nothing", async () => {
  const { db, id } = await requested(11);
  assert.throws(() => releaseMaterialRowForActor(db, id, 6), /only 10 in stock/);
  assert.equal(status(db, id), "Requested");
  assert.equal(ledgerRows(db).length, 0);
});

test("release is allowed on HOLD but not once COMPLETED", async () => {
  const { db, id } = await requested(2);
  db.run("update job_cards set main_status='HOLD' where id=1");
  releaseMaterialRowForActor(db, id, 1);
  assert.equal(status(db, id), "Issued");
  const second = await requested(2);
  second.db.run("update job_cards set main_status='COMPLETED' where id=1");
  assert.throws(() => releaseMaterialRowForActor(second.db, second.id, 6), /IN_PROGRESS or HOLD/);
});

test("Materials Issued needs every non-cancelled row Issued and unticks on a new request", async () => {
  const { db, id } = await requested(1);
  const other = addMaterialRowForActor(db, 1, 2, 2, 1);
  requestMaterialRowForActor(db, other, 2);
  releaseMaterialRowForActor(db, id, 6);
  assert.equal(ticked(db, "Material Issued"), false);
  cancelMaterialRowForActor(db, other, 2);
  reconcileArtifactChecklist(db, 1);
  assert.equal(ticked(db, "Material Issued"), true);
  requestMaterialRowForActor(db, addMaterialRowForActor(db, 1, 2, 1, 1), 2);
  assert.equal(ticked(db, "Material Issued"), false);
});

test("Issued edit needs a note, stays Issued, adjusts stock by the difference and logs old/new", async () => {
  const { db, id } = await requested(3);
  releaseMaterialRowForActor(db, id, 6);
  assert.throws(() => editIssuedMaterialRowForActor(db, id, 6, 1, 5, "  "), /note is required/);
  assert.throws(() => editIssuedMaterialRowForActor(db, id, 5, 1, 5, "x"), /Only Store/);
  assert.throws(() => editIssuedMaterialRowForActor(db, id, 3, 1, 5, "x"), /Only Store/);
  editIssuedMaterialRowForActor(db, id, 2, 1, 5, "Customer wants more");
  assert.equal(status(db, id), "Issued");
  assert.equal(materialStockOnHand(db, 1), 5);
  assert.deepEqual(ledgerRows(db).at(-1), { qty: 2, type: "adjustment", by_user: 2 });
  assert.equal(ticked(db, "Material Issued"), true);
  const event = readState(db).jobs[0].material_events!.at(-1)!;
  assert.deepEqual([event.kind, event.old_qty, event.new_qty, event.note], ["issued-edit", 3, 5, "Customer wants more"]);
  editIssuedMaterialRowForActor(db, id, 6, 1, 1, "Returned surplus to shelf");
  assert.equal(materialStockOnHand(db, 1), 9);
  assert.throws(() => editIssuedMaterialRowForActor(db, id, 6, 1, 99, "too many"), /only 9 in stock|more; only/);
});

test("Issued edit can switch item and is blocked once invoiced", async () => {
  const { db, id } = await requested(3);
  releaseMaterialRowForActor(db, id, 6);
  editIssuedMaterialRowForActor(db, id, 6, 2, 2, "Wrong item picked");
  assert.equal(materialStockOnHand(db, 1), 10);
  assert.equal(materialStockOnHand(db, 2), 2);
  db.run("update material_requests set invoiced_in=9 where id=?", [id]);
  assert.throws(() => editIssuedMaterialRowForActor(db, id, 6, 2, 1, "late"), /cannot be edited/);
});
