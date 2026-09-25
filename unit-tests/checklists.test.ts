import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import initSqlJs, { type Database } from "sql.js";
import {
  createSchema,
  migrateSchema,
  saveEstimateForActor,
  setChecklistItemCheckedForActor,
  setChecklistItemNotApplicableForActor,
  transitionJobStatusForActor,
} from "../src/db";

async function database(main: string, sub: string) {
  const SQL = await initSqlJs({ locateFile: () => fileURLToPath(new URL("../node_modules/sql.js/dist/sql-wasm.wasm", import.meta.url)) });
  const db = new SQL.Database();
  createSchema(db);
  db.run("insert into users(id,email,name,role,password) values (1,'owner@test','Owner','admin','x'),(2,'linked@test','Linked','service','x'),(4,'accounts@test','Accounts','accounts','x')");
  db.run("insert into visits(id,advisor_id,requested_work) values(1,2,'Repair')");
  db.run(`insert into job_cards(id,job_no,visit_id,advisor_id,technician_id,main_status,sub_status,qc_status,washing_needed,closed_at) values(1,'JC-1',1,2,2,'${main}','${sub}','Pending',0,'')`);
  migrateSchema(db);
  return db;
}

function rows<T>(db: Database, sql: string): T[] {
  const result = db.exec(sql)[0];
  if (!result) return [];
  return result.values.map((values) => Object.fromEntries(result.columns.map((column, index) => [column, values[index]])) as T);
}

const itemId = (db: Database, label: string) => rows<{ id: number }>(db, `select id from checklist_items where label='${label}' order by id desc`)[0].id;

test("items are flagged required or optional and N/A carries its own timestamp and actor", async () => {
  const db = await database("IN_PROGRESS", "Material Requested");
  const flags = Object.fromEntries(rows<{ label: string; required: number }>(db, "select label,required from checklist_items").map((row) => [row.label, row.required]));
  assert.equal(flags["Washing Needed"], 0);
  assert.equal(flags["Work Started"], 1);

  setChecklistItemNotApplicableForActor(db, itemId(db, "Washing Needed"), 2, true, "2026-09-25T10:00:00.000Z");
  const [washing] = rows<{ na_at: string; na_by: number; checked_at: string }>(db, "select na_at,na_by,checked_at from checklist_items where label='Washing Needed'");
  assert.equal(washing.na_at, "2026-09-25T10:00:00.000Z");
  assert.equal(washing.na_by, 2);

  setChecklistItemNotApplicableForActor(db, itemId(db, "Washing Needed"), 2, false);
  assert.deepEqual(rows(db, "select na_at,na_by,checked_at from checklist_items where label='Washing Needed'"), [{ na_at: null, na_by: null, checked_at: null }]);
});

test("optional items do not block completion of the status checklist, required ones do", async () => {
  const db = await database("IN_PROGRESS", "Material Requested");
  const required = rows<{ id: number; label: string }>(db, "select id,label from checklist_items where required=1 order by sort_order");
  required.slice(0, -1).forEach((item) => setChecklistItemCheckedForActor(db, item.id, 2, true));
  assert.throws(() => transitionJobStatusForActor(db, 1, 2, "COMPLETED", "Done"), /Complete the IN_PROGRESS checklist/);
  setChecklistItemCheckedForActor(db, required.at(-1)!.id, 2, true);
  assert.equal(rows<{ completed_at: string | null }>(db, "select completed_at from checklist_cycles")[0].completed_at !== null, true);
});

test("a checklist is editable only while the card is in that status", async () => {
  const hold = await database("HOLD", "Work Started");
  assert.throws(() => setChecklistItemNotApplicableForActor(hold, itemId(hold, "Washing Needed"), 1, true), /read-only/);
  assert.throws(() => setChecklistItemCheckedForActor(hold, itemId(hold, "Material Requested"), 1, true), /read-only/);

  const db = await database("IN_PROGRESS", "Material Requested");
  const oldItem = itemId(db, "Material Requested");
  db.run("update checklist_items set checked_at='2026-09-25T09:00:00.000Z' where required=1");
  db.run("update checklist_cycles set completed_at='2026-09-25T09:00:00.000Z'");
  transitionJobStatusForActor(db, 1, 2, "COMPLETED", "Work finished");
  assert.throws(() => setChecklistItemCheckedForActor(db, oldItem, 2, false), /IN_PROGRESS checklist is read-only/);
});

test("Estimate and Invoice ticks refuse without a saved document, and ticks need no note", async () => {
  const db = await database("NEW", "Gather Requirements");
  setChecklistItemCheckedForActor(db, itemId(db, "Gather Requirements"), 2, true);
  assert.throws(() => setChecklistItemCheckedForActor(db, itemId(db, "Create Estimate"), 2, true), /Save the estimate/);
  assert.throws(() => setChecklistItemNotApplicableForActor(db, itemId(db, "Create Estimate"), 2, true), /Save the estimate/);
  saveEstimateForActor(db, 1, 2, { discount: 0, gst_rate: 18, notes: "", items: [{ kind: "Service", description: "Labour", qty: 1, rate: 500 }] });
  assert.ok(rows<{ checked_at: string | null }>(db, "select checked_at from checklist_items where label='Create Estimate'")[0].checked_at);

  const completed = await database("COMPLETED", "Customer Verification");
  setChecklistItemCheckedForActor(completed, itemId(completed, "Customer Verification"), 2, true);
  assert.throws(() => setChecklistItemCheckedForActor(completed, itemId(completed, "Invoice Ready"), 2, true), /Save the invoice/);
});

test("Close is blocked until the COMPLETED checklist is fully ticked", async () => {
  const db = await database("COMPLETED", "Customer Verification");
  assert.throws(() => transitionJobStatusForActor(db, 1, 4, "CLOSED", "Handed over"), /Complete the COMPLETED checklist/);
  assert.equal(rows<{ main_status: string }>(db, "select main_status from job_cards")[0].main_status, "COMPLETED");
});
