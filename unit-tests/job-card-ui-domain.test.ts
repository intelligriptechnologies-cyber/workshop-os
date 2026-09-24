import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import initSqlJs, { type Database } from "sql.js";
import {
  createSchema,
  archiveJobCardForActor,
  migrateSchema,
  saveEstimateForActor,
  setChecklistItemCheckedForActor,
  transitionJobStatusForActor,
  updateJobCardForActor,
} from "../src/db";

async function database() {
  const SQL = await initSqlJs({ locateFile: () => fileURLToPath(new URL("../node_modules/sql.js/dist/sql-wasm.wasm", import.meta.url)) });
  const db = new SQL.Database();
  createSchema(db);
  db.run("insert into users(id,email,name,role,password) values (1,'owner@test','Owner','admin','x'),(2,'linked@test','Linked','service','x'),(3,'other@test','Other','service','x'),(4,'accounts@test','Accounts','accounts','x')");
  db.run("insert into visits(id,advisor_id,requested_work) values(1,2,'Repair')");
  db.run("insert into job_cards(id,job_no,visit_id,advisor_id,technician_id,main_status,sub_status,qc_status,washing_needed,closed_at) values(1,'JC-1',1,2,2,'NEW','Gather Requirements','Pending',0,'')");
  migrateSchema(db);
  return db;
}

test("job card edit and archive wrappers reject unlinked actors", async () => {
  const db = await database();
  assert.throws(() => updateJobCardForActor(db, 1, 3, { work_list: "Unauthorized" }), /Only the Owner or the linked Service Advisor/);
  assert.throws(() => archiveJobCardForActor(db, 1, 4, "Unauthorized"), /Only the Owner or the linked Service Advisor/);
  updateJobCardForActor(db, 1, 2, { work_list: "Linked advisor update" });
  assert.equal(value<{ work_list: string }>(db, "select work_list from job_cards where id=1").work_list, "Linked advisor update");
});

function value<T>(db: Database, sql: string) {
  const statement = db.prepare(sql);
  statement.step();
  const row = statement.getAsObject() as T;
  statement.free();
  return row;
}

test("only owner and linked service advisor can mutate lifecycle and checklist", async () => {
  for (const deniedActor of [3, 4]) {
    const db = await database();
    const item = value<{ id: number }>(db, "select id from checklist_items order by sort_order limit 1");
    assert.throws(() => setChecklistItemCheckedForActor(db, item.id, deniedActor, true), /Owner or the linked Service Advisor/);
    assert.throws(() => transitionJobStatusForActor(db, 1, deniedActor, "CANCELLED", "Denied"), /Owner or the linked Service Advisor/);
  }

  const linkedDb = await database();
  const linkedItem = value<{ id: number }>(linkedDb, "select id from checklist_items order by sort_order limit 1");
  setChecklistItemCheckedForActor(linkedDb, linkedItem.id, 2, true, "2026-09-24T10:00:00.000Z");
  assert.deepEqual(value(linkedDb, "select checked_by,checked_at from checklist_items where id=1"), { checked_by: 2, checked_at: "2026-09-24T10:00:00.000Z" });

  const ownerDb = await database();
  transitionJobStatusForActor(ownerDb, 1, 1, "CANCELLED", "Owner cancelled");
  assert.equal(value<{ main_status: string }>(ownerDb, "select main_status from job_cards where id=1").main_status, "CANCELLED");
});

test("estimate save validates, persists items and completes Create Estimate only after save", async () => {
  const db = await database();
  assert.equal(value<{ count: number }>(db, "select count(*) as count from estimates").count, 0);
  assert.throws(() => saveEstimateForActor(db, 1, 3, { discount: 0, gst_rate: 18, notes: "", items: [{ kind: "Service", description: "Labour", qty: 1, rate: 500 }] }), /linked Service Advisor/);
  assert.equal(value<{ count: number }>(db, "select count(*) as count from estimates").count, 0);
  assert.throws(() => saveEstimateForActor(db, 1, 2, { discount: 0, gst_rate: 18, notes: "", items: [] }), /at least one/);
  assert.equal(value<{ count: number }>(db, "select count(*) as count from estimates").count, 0);

  saveEstimateForActor(db, 1, 2, {
    discount: 100,
    gst_rate: 12,
    notes: "Customer requested itemised quote",
    items: [
      { kind: "Service", description: "Workshop labour", qty: 2, rate: 500 },
      { kind: "Material", description: "Film", qty: 3, rate: 250 },
    ],
  });
  assert.deepEqual(value(db, "select discount,gst_rate,approval_note from estimates"), { discount: 100, gst_rate: 12, approval_note: "Customer requested itemised quote" });
  assert.equal(value<{ count: number }>(db, "select count(*) as count from estimate_items where archived_at is null").count, 2);
  assert.ok(value<{ checked_at: string | null }>(db, "select checked_at from checklist_items where label='Create Estimate'").checked_at);

  saveEstimateForActor(db, 1, 1, { discount: 0, gst_rate: 18, notes: "Revised", items: [{ kind: "Service", description: "Revised labour", qty: 1, rate: 900 }] });
  assert.equal(value<{ count: number }>(db, "select count(*) as count from estimate_items where archived_at is null").count, 1);
  assert.equal(value<{ count: number }>(db, "select count(*) as count from estimate_items where archived_at is not null").count, 2);
});
