import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import initSqlJs from "sql.js";
import {
  addJobTaskListItemForActor,
  createSchema,
  createServiceCatalogItemForActor,
  migrateSchema,
  prefillEstimateFromTaskListForActor,
  updateServiceCatalogItemForActor,
} from "../src/db";

async function database() {
  const SQL = await initSqlJs({
    locateFile: () =>
      fileURLToPath(
        new URL("../node_modules/sql.js/dist/sql-wasm.wasm", import.meta.url),
      ),
  });
  const db = new SQL.Database();
  createSchema(db);
  db.run(
    "insert into users(id,email,name,role,password) values(1,'owner@test','Owner','admin','x'),(2,'advisor@test','Advisor','service','x')",
  );
  db.run("insert into visits(id,advisor_id,requested_work) values(1,2,'Repair')");
  db.run(
    "insert into job_cards(id,job_no,visit_id,advisor_id,technician_id,main_status,sub_status,qc_status,washing_needed,closed_at) values(1,'JC-1',1,2,2,'NEW','Gather Requirements','Pending',0,'')",
  );
  migrateSchema(db);
  db.run("insert into service_departments(id,name,status,created_at,updated_at) values(1,'General','ACTIVE',datetime('now'),datetime('now')); insert into service_brands(id,name,status,created_at,updated_at) values(1,'Toyota','ACTIVE',datetime('now'),datetime('now')); insert into car_segments(id,name,status,created_at,updated_at) values(1,'SUV','ACTIVE',datetime('now'),datetime('now'))");
  return db;
}

const row = (db: any, sql: string, values: unknown[] = []) =>
  db.exec(sql, values)[0]?.values[0];

test("catalog GST is validated and snapshots through tasks into estimate lines", async () => {
  const db = await database();
  assert.throws(
    () => createServiceCatalogItemForActor(db, 1, { name: "", base_rate: 0, gst_rate: 18, service_department_id: 1, brand_id: 1, car_segment_id: 1 }),
    /Service name is required/,
  );
  assert.throws(
    () => createServiceCatalogItemForActor(db, 1, { name: "Wash", base_rate: -1, gst_rate: 18, service_department_id: 1, brand_id: 1, car_segment_id: 1 }),
    /Base rate must be zero or greater/,
  );
  assert.throws(
    () => createServiceCatalogItemForActor(db, 1, { name: "Wash", base_rate: 100, gst_rate: 7, service_department_id: 1, brand_id: 1, car_segment_id: 1 }),
    /GST rate must be No GST/,
  );

  const catalogId = createServiceCatalogItemForActor(db, 1, {
    name: "Exterior wash",
    base_rate: 600,
    gst_rate: 0,
    service_department_id: 1,
    brand_id: 1,
    car_segment_id: 1,
  });
  const taskId = addJobTaskListItemForActor(db, 1, 2, {
    service_catalog_item_id: catalogId,
  });
  prefillEstimateFromTaskListForActor(db, 1, 2);
  assert.deepEqual(
    row(db, "select name,base_rate,gst_rate from job_task_list_items where id=?", [taskId]),
    ["Exterior wash", 600, 0],
  );
  assert.deepEqual(
    row(db, "select description,rate,gst_type,gst_rate from estimate_items where task_list_item_id=?", [taskId]),
    ["Exterior wash", 600, "No GST", 0],
  );

  updateServiceCatalogItemForActor(db, 1, catalogId, {
    name: "Premium exterior wash",
    base_rate: 900,
    gst_rate: 18,
    service_department_id: 1,
    brand_id: 1,
    car_segment_id: 1,
  });
  assert.deepEqual(
    row(db, "select name,base_rate,gst_rate from job_task_list_items where id=?", [taskId]),
    ["Exterior wash", 600, 0],
  );
  assert.deepEqual(
    row(db, "select description,rate,gst_type,gst_rate from estimate_items where task_list_item_id=?", [taskId]),
    ["Exterior wash", 600, "No GST", 0],
  );
});

test("migration gives legacy catalog and job task rows the 18% GST default", async () => {
  const SQL = await initSqlJs({
    locateFile: () =>
      fileURLToPath(
        new URL("../node_modules/sql.js/dist/sql-wasm.wasm", import.meta.url),
      ),
  });
  const db = new SQL.Database();
  db.run("create table service_catalog_items(id integer primary key, name text not null, base_rate real not null)");
  db.run("create table job_task_list_items(id integer primary key, job_card_id integer not null, name text not null, base_rate real not null, done integer not null default 0)");
  db.run("insert into service_catalog_items(id,name,base_rate) values(1,'Legacy service',500)");
  db.run("insert into job_task_list_items(id,job_card_id,name,base_rate,done) values(1,1,'Legacy task',500,0)");
  createSchema(db);
  migrateSchema(db);
  assert.equal(row(db, "select gst_rate from service_catalog_items where id=1")[0], 18);
  assert.equal(row(db, "select gst_rate from job_task_list_items where id=1")[0], 18);
});
