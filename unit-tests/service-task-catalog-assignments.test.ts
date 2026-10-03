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
  updateServiceCatalogMaster,
} from "../src/db";

async function database() {
  const SQL = await initSqlJs({ locateFile: () => fileURLToPath(new URL("../node_modules/sql.js/dist/sql-wasm.wasm", import.meta.url)) });
  const db = new SQL.Database();
  createSchema(db); migrateSchema(db);
  db.run("insert into users(id,email,name,role,password) values(1,'owner@test','Owner','admin','x')");
  return db;
}

test("catalog assignments require active independent masters and retain archived master labels", async () => {
  const db = await database();
  const departmentId = createServiceDepartment(db, "General Service");
  const brandId = createServiceCatalogMaster(db, "service_brands", "Toyota");
  const segmentId = createServiceCatalogMaster(db, "car_segments", "SUV");
  assert.throws(() => createServiceCatalogItemForActor(db, 1, { name: "Wash", base_rate: 300 }), /Service department is required/);
  assert.throws(() => createServiceCatalogMaster(db, "service_brands", "toyota"), /already exists/);
  const id = createServiceCatalogItemForActor(db, 1, { name: "Wash", base_rate: 300, service_department_id: departmentId, brand_id: brandId, car_segment_id: segmentId });
  updateServiceCatalogMaster(db, "service_brands", brandId, "Toyota", "ARCHIVED");
  assert.throws(() => createServiceCatalogItemForActor(db, 1, { name: "Polish", base_rate: 500, service_department_id: departmentId, brand_id: brandId, car_segment_id: segmentId }), /active brand/);
  const catalog = readState(db).service_catalog.find((item) => item.id === id);
  assert.deepEqual([catalog?.department_name, catalog?.brand_name, catalog?.car_segment_name], ["General Service", "Toyota", "SUV"]);
});
