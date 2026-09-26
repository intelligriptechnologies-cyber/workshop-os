import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import initSqlJs, { type Database } from "sql.js";
import { archiveJobPhotoForActor, createSchema, migrateSchema, receiveVehicle, saveJobDetailsForActor, saveJobPhotoForActor, setDamageMarksForActor, updateJobSheetForActor } from "../src/db";
import { addDamageMark, parseDamageMarks, removeDamageMark } from "../src/job-sheet";

async function database() {
  const SQL = await initSqlJs({ locateFile: () => fileURLToPath(new URL("../node_modules/sql.js/dist/sql-wasm.wasm", import.meta.url)) });
  const db = new SQL.Database();
  createSchema(db);
  migrateSchema(db);
  db.run("insert into users(id,email,name,role,password) values (1,'o@t','Owner','admin','x'),(2,'a@t','Adv','service','x'),(3,'r@t','Rec','reception','x'),(5,'t@t','Tech','tech','x')");
  return db;
}
const row = (db: Database, sql: string) => db.exec(sql)[0].values[0];
const intake = { customerName: "Asha", mobile: "9000000001", customerType: "Individual", vehicleNo: "OD01A1", make: "Kia", model: "Seltos", color: "Red", km: 100, fuel: "Half", keys: "2", accessories: "Mats", requestedWork: "PPF", advisorId: 2, receptionId: 3 };

test("intake fields are saved on job card, vehicle and customer", async () => {
  const db = await database();
  const jobId = receiveVehicle(db, { ...intake, km: 100, odoReading: 12345, fuel: "70 %", fuelLevelValue: "70", fuelLevelUnit: "%", address: "12 MG Road", engineNo: "ENG123", serviceType: "PPF", pickupDrop: "Pickup and drop", estimatedDelivery: "2026-10-01" });
  assert.deepEqual(row(db, `select service_type,pickup_drop,estimated_delivery from job_cards where id=${jobId}`), ["PPF", "Pickup and drop", "2026-10-01"]);
  assert.equal(row(db, "select engine_no from vehicles")[0], "ENG123");
  assert.equal(row(db, "select address from customers")[0], "12 MG Road");
  assert.deepEqual(row(db, "select odo_reading,fuel_level_value,fuel_level_unit,fuel from visits"), [12345, "70", "%", "70 %"]);
  assert.equal(row(db, "select km from vehicles")[0], 12345);
});

test("Details edits persist and a re-intake without new fields keeps them", async () => {
  const db = await database();
  const jobId = receiveVehicle(db, intake);
  updateJobSheetForActor(db, jobId, 2, { service_type: "Repair", fuel: "Full", accessories: "Spare wheel", engine_no: "E9", address: "Cuttack" });
  assert.deepEqual(row(db, `select service_type from job_cards where id=${jobId}`), ["Repair"]);
  assert.deepEqual(row(db, "select fuel,accessories from visits"), ["Full", "Spare wheel"]);
  assert.equal(row(db, "select engine_no from vehicles")[0], "E9");
  assert.equal(row(db, "select address from customers")[0], "Cuttack");
  receiveVehicle(db, intake);
  assert.equal(row(db, "select engine_no from vehicles")[0], "E9");
});

test("one job-details save updates the job card and job sheet records together", async () => {
  const db = await database();
  const jobId = receiveVehicle(db, intake);
  saveJobDetailsForActor(db, jobId, 2, {
    work_list: "Door repair", promised_at: "2026-10-02", advisor_notes: "Call first", customer_instructions: "Use OEM", internal_instructions: "Inspect hinges",
    service_type: "Repair", pickup_drop: "Walk-in", estimated_delivery: "2026-10-03", fuel: "Full", accessories: "Mats", engine_no: "E10", address: "Bhubaneswar",
  });
  assert.deepEqual(row(db, `select work_list,promised_at,advisor_notes,customer_instructions,internal_instructions,service_type,pickup_drop,estimated_delivery from job_cards where id=${jobId}`), ["Door repair", "2026-10-02", "Call first", "Use OEM", "Inspect hinges", "Repair", "Walk-in", "2026-10-03"]);
  assert.deepEqual(row(db, "select fuel,accessories from visits"), ["Full", "Mats"]);
  assert.equal(row(db, "select engine_no from vehicles")[0], "E10");
  assert.equal(row(db, "select address from customers")[0], "Bhubaneswar");
});

test("before and after photo mutation gates follow the job status", async () => {
  const db = await database();
  const jobId = receiveVehicle(db, intake);
  const photo = { label: "Evidence", src: "data:image/png;base64,AA==", originalName: "e.png", width: 1, height: 1 };
  assert.throws(() => saveJobPhotoForActor(db, jobId, 2, { ...photo, category: "After Work" }), /After photos can only/);
  assert.throws(() => saveJobPhotoForActor(db, jobId, 2, { ...photo, category: "Before Work" }), /image|data/i, "Before Work passes the NEW gate before image validation");
  db.run(`update job_cards set main_status='IN_PROGRESS' where id=${jobId}`);
  assert.throws(() => saveJobPhotoForActor(db, jobId, 2, { ...photo, category: "Before Work" }), /Before photos can only/);
  assert.throws(() => saveJobPhotoForActor(db, jobId, 2, { ...photo, category: "After Work" }), /image|data/i, "After Work passes the IN_PROGRESS gate");
  db.run(`insert into photos(id,job_card_id,label,src,category) values(99,${jobId},'Before','x','Before Work')`);
  assert.throws(() => archiveJobPhotoForActor(db, 99, 2, "replace"), /Before photos can only/);
  db.run(`update job_cards set main_status='COMPLETED' where id=${jobId}`);
  assert.throws(() => saveJobPhotoForActor(db, jobId, 2, { ...photo, category: "Before Work" }), /Before photos can only/);
  db.run(`update job_cards set main_status='HOLD' where id=${jobId}`);
  assert.throws(() => saveJobPhotoForActor(db, jobId, 2, { ...photo, category: "After Work" }), /After photos can only/);
});

test("damage marks add, remove and persist with the job card; technician cannot edit", async () => {
  const db = await database();
  const jobId = receiveVehicle(db, intake);
  let marks = addDamageMark(addDamageMark([], 10, 20), 55.55, 80);
  setDamageMarksForActor(db, jobId, 2, marks);
  let [storedMarks, recordedAt] = row(db, `select damage_marks,damage_marks_recorded_at from job_cards where id=${jobId}`);
  let stored = parseDamageMarks(storedMarks as string);
  assert.equal(stored.length, 2);
  assert.match(recordedAt as string, /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
  db.run(`update job_cards set damage_marks_recorded_at='2000-01-01 00:00:00' where id=${jobId}`);
  marks = removeDamageMark(stored, stored[0].id);
  setDamageMarksForActor(db, jobId, 1, marks);
  [storedMarks, recordedAt] = row(db, `select damage_marks,damage_marks_recorded_at from job_cards where id=${jobId}`);
  stored = parseDamageMarks(storedMarks as string);
  assert.deepEqual(stored.map((m) => m.id), [2]);
  assert.notEqual(recordedAt, "2000-01-01 00:00:00");
  assert.throws(() => setDamageMarksForActor(db, jobId, 5, []));
});

test("migration adds the body-mark record timestamp without changing legacy marks", async () => {
  const SQL = await initSqlJs({ locateFile: () => fileURLToPath(new URL("../node_modules/sql.js/dist/sql-wasm.wasm", import.meta.url)) });
  const db = new SQL.Database();
  const legacyMarks = '[{"id":1,"x":10,"y":20}]';
  db.run("create table job_cards(id integer primary key, damage_marks text, main_status text, sub_status text, created_at text)");
  db.run("insert into job_cards(id,damage_marks,main_status,sub_status,created_at) values(1,?,'NEW','Gather Requirements','2026-01-01 00:00:00')", [legacyMarks]);
  createSchema(db);
  migrateSchema(db);
  assert.equal(row(db, "select damage_marks from job_cards where id=1")[0], legacyMarks);
  assert.equal(row(db, "select damage_marks_recorded_at from job_cards where id=1")[0], null);
  assert.ok((row(db, "select group_concat(name) from pragma_table_info('job_cards')")[0] as string).includes("damage_marks_recorded_at"));
});

test("pure helpers clamp, tolerate bad JSON, and never reuse ids", () => {
  assert.deepEqual(parseDamageMarks("nope"), []);
  assert.deepEqual(parseDamageMarks(null), []);
  const m = addDamageMark(removeDamageMark(addDamageMark(addDamageMark([], 1, 1), 2, 2), 2), 150, -5);
  assert.deepEqual(m.map((x) => [x.id, x.x, x.y]), [[1, 1, 1], [2, 100, 0]]);
});

test("legacy four-panel damage marks map into the unified illustration", () => {
  const marks = parseDamageMarks('[{"id":1,"x":50,"y":50,"view":"LF"},{"id":2,"x":50,"y":50,"view":"RR"}]');
  assert.deepEqual(marks.map(({ id, x, y }) => [id, x, y]), [[1, 27, 27], [2, 73, 73]]);
});

test("dropped paper fields (D.O.B., tyres, road test) are not in the schema", async () => {
  const db = await database();
  const cols = db.exec("select group_concat(name) from (select name from pragma_table_info('customers') union select name from pragma_table_info('vehicles') union select name from pragma_table_info('visits') union select name from pragma_table_info('job_cards'))")[0].values[0][0] as string;
  assert.doesNotMatch(cols, /dob|birth|tyre|tire|road_test/i);
});
