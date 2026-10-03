import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import initSqlJs from "sql.js";
import { addJobTaskListItemForActor, archiveJobTaskListItemForActor, archiveServiceCatalogItemForActor, createSchema, createServiceCatalogItemForActor, migrateSchema, prefillEstimateFromTaskListForActor, updateJobTaskListItemForActor } from "../src/db";

async function database(status = "NEW") {
  const SQL = await initSqlJs({ locateFile: () => fileURLToPath(new URL("../node_modules/sql.js/dist/sql-wasm.wasm", import.meta.url)) });
  const db = new SQL.Database(); createSchema(db);
  db.run("insert into users(id,email,name,role,password) values(1,'owner@test','Owner','admin','x'),(2,'advisor@test','Advisor','service','x'),(3,'other@test','Other','service','x')");
  db.run("insert into visits(id,advisor_id,requested_work) values(1,2,'Repair')");
  db.run(`insert into job_cards(id,job_no,visit_id,advisor_id,technician_id,main_status,sub_status,qc_status,washing_needed,closed_at) values(1,'JC-1',1,2,2,'${status}','Gather Requirements','Pending',0,'')`);
  migrateSchema(db); db.run("insert into service_departments(id,name,status,created_at,updated_at) values(1,'General','ACTIVE',datetime('now'),datetime('now')); insert into service_brands(id,name,status,created_at,updated_at) values(1,'Toyota','ACTIVE',datetime('now'),datetime('now')); insert into car_segments(id,name,status,created_at,updated_at) values(1,'SUV','ACTIVE',datetime('now'),datetime('now'))"); return db;
}
const value = (db: any, sql: string) => db.exec(sql)[0]?.values[0]?.[0];

test("catalog snapshots active services into repeatable task-list rows and preserves the snapshot after archive", async () => {
  const db = await database(); const catalogId = createServiceCatalogItemForActor(db, 1, { name: "Wheel alignment", base_rate: 850, service_department_id: 1, brand_id: 1, car_segment_id: 1 });
  const first = addJobTaskListItemForActor(db, 1, 2, { service_catalog_item_id: catalogId });
  addJobTaskListItemForActor(db, 1, 2, { service_catalog_item_id: catalogId });
  archiveServiceCatalogItemForActor(db, 1, catalogId);
  assert.deepEqual(db.exec("select name,base_rate from job_task_list_items where id=?", [first])[0].values[0], ["Wheel alignment", 850]);
  assert.equal(value(db, "select count(*) from job_task_list_items where archived_at is null"), 2);
});

test("task-list mutations enforce advisor ownership and active lifecycle, and estimate prefill is idempotent", async () => {
  const db = await database(); const row = addJobTaskListItemForActor(db, 1, 2, { name: "Manual wash", base_rate: 0 });
  assert.throws(() => updateJobTaskListItemForActor(db, row, 3, { name: "Manual wash", base_rate: 0, done: 1 }), /linked Service Advisor/);
  updateJobTaskListItemForActor(db, row, 2, { name: "Manual wash", base_rate: 0, done: 1 });
  prefillEstimateFromTaskListForActor(db, 1, 2); prefillEstimateFromTaskListForActor(db, 1, 2);
  assert.equal(value(db, "select count(*) from estimate_items where task_list_item_id=" + row), 1);
  archiveJobTaskListItemForActor(db, row, 2);
  assert.equal(value(db, "select count(*) from estimate_items where task_list_item_id=" + row), 1);
});
