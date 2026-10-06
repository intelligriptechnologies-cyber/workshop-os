import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import initSqlJs from "sql.js";
import {
  createSchema,
  createServiceCatalogItemForActor,
  createServiceCatalogMaster,
  createServiceDepartment,
  migrateSchema,
  readState,
  updateServiceCatalogItemForActor,
  updateServiceCatalogMaster,
} from "../src/db";

async function database() {
  const SQL = await initSqlJs({ locateFile: () => fileURLToPath(new URL("../node_modules/sql.js/dist/sql-wasm.wasm", import.meta.url)) });
  const db = new SQL.Database();
  createSchema(db); migrateSchema(db);
  db.run("insert into users(id,email,name,role,password) values(1,'owner@test','Owner','admin','x')");
  return db;
}

test("catalog assignments require an active department, allow unassigned brand and segment, and retain archived master labels", async () => {
  const db = await database();
  const departmentId = createServiceDepartment(db, "General Service");
  const brandId = createServiceCatalogMaster(db, "service_brands", "Toyota");
  const segmentId = createServiceCatalogMaster(db, "car_segments", "SUV");
  assert.throws(() => createServiceCatalogItemForActor(db, 1, { name: "Wash", base_rate: 300 }), /Service department is required/);
  assert.throws(() => createServiceCatalogMaster(db, "service_brands", "toyota"), /already exists/);
  const universalId = createServiceCatalogItemForActor(db, 1, {
    name: "Universal wash",
    base_rate: 300,
    service_department_id: departmentId,
  });
  assert.deepEqual(
    db.exec("select brand_id,car_segment_id from service_catalog_items where id=?", [universalId])[0].values[0],
    [null, null],
  );
  updateServiceCatalogItemForActor(db, 1, universalId, {
    name: "Universal premium wash",
    base_rate: 450,
    service_department_id: departmentId,
    brand_id: null,
    car_segment_id: null,
  });
  assert.deepEqual(
    db.exec("select name,brand_id,car_segment_id from service_catalog_items where id=?", [universalId])[0].values[0],
    ["Universal premium wash", null, null],
  );
  const id = createServiceCatalogItemForActor(db, 1, { name: "Wash", base_rate: 300, service_department_id: departmentId, brand_id: brandId, car_segment_id: segmentId });
  updateServiceCatalogMaster(db, "service_brands", brandId, "Toyota", "ARCHIVED");
  assert.throws(() => createServiceCatalogItemForActor(db, 1, { name: "Polish", base_rate: 500, service_department_id: departmentId, brand_id: brandId, car_segment_id: segmentId }), /active brand/);
  assert.throws(() => createServiceCatalogItemForActor(db, 1, { name: "Wax", base_rate: 500, service_department_id: departmentId, car_segment_id: segmentId + 99 }), /active car segment/);
  const catalog = readState(db).service_catalog.find((item) => item.id === id);
  assert.deepEqual([catalog?.department_name, catalog?.brand_name, catalog?.car_segment_name], ["General Service", "Toyota", "SUV"]);
});
