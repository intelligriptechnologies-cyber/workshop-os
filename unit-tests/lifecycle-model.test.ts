import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import initSqlJs, { type Database } from "sql.js";
import {
  createSchema,
  deriveChecklistSubStatus,
  LIFECYCLE_CHECKLIST,
  loadLargeDemoDataset,
  MAIN_STATUS_TRANSITIONS,
  migrateLifecycleStorage,
  migrateSchema,
  setChecklistItemChecked,
  updateJobCard,
} from "../src/db";

async function database() {
  const SQL = await initSqlJs({ locateFile: () => fileURLToPath(new URL("../node_modules/sql.js/dist/sql-wasm.wasm", import.meta.url)) });
  const db = new SQL.Database();
  createSchema(db);
  migrateSchema(db);
  return db;
}

function rows<T>(db: Database, sql: string): T[] {
  const result = db.exec(sql)[0];
  if (!result) return [];
  return result.values.map((values) => Object.fromEntries(result.columns.map((column, index) => [column, values[index]])) as T);
}

test("lifecycle model exposes exactly five main statuses and ordered stage templates", () => {
  assert.deepEqual(Object.keys(MAIN_STATUS_TRANSITIONS), ["NEW", "IN_PROGRESS", "COMPLETED", "CANCELLED", "CLOSED"]);
  assert.deepEqual(LIFECYCLE_CHECKLIST.COMPLETED, ["Customer Verification", "Invoice Ready", "Payment Received"]);
  assert.equal(deriveChecklistSubStatus([
    { label: "Invoice Ready", sort_order: 2, checked_at: null },
    { label: "Customer Verification", sort_order: 1, checked_at: "2026-01-01T00:00:00.000Z" },
  ]), "Invoice Ready");
});

test("migration normalizes HOLD once, preserves audit evidence, and creates lifecycle storage", async () => {
  const db = await database();
  db.run("insert into job_cards(id,job_no,main_status,sub_status,created_at,updated_at) values(1,'JC-OLD','HOLD','Invoice Ready','2026-01-02T03:04:05.000Z','2026-01-02T03:04:05.000Z')");
  db.run("insert into status_history(job_card_id,main_status,sub_status,note,created_at) values(1,'HOLD','Invoice Ready','Legacy hold','2026-01-02T03:04:05.000Z')");
  db.run("insert into status_history(job_card_id,main_status,sub_status,note,created_at) values(99,'HOLD','Work Started','Historical hold','2026-01-01T00:00:00.000Z')");

  migrateLifecycleStorage(db);
  migrateLifecycleStorage(db);

  assert.deepEqual(rows(db, "select main_status,sub_status from job_cards"), [{ main_status: "IN_PROGRESS", sub_status: "Invoice Ready" }]);
  assert.equal(rows(db, "select * from status_history where main_status='HOLD'").length, 0);
  assert.equal(rows(db, "select * from status_history where note='Migration: HOLD normalized to IN_PROGRESS'").length, 1);
  assert.deepEqual(rows(db, "select stage,cycle_number,started_at,completed_at from checklist_cycles"), [{ stage: "COMPLETED", cycle_number: 1, started_at: "2026-01-02T03:04:05.000Z", completed_at: null }]);
  assert.deepEqual(rows(db, "select label,sort_order,checked_by,checked_at,started_at,completed_at from checklist_items order by sort_order"), [
    { label: "Customer Verification", sort_order: 1, checked_by: null, checked_at: "2026-01-02T03:04:05.000Z", started_at: "2026-01-02T03:04:05.000Z", completed_at: "2026-01-02T03:04:05.000Z" },
    { label: "Invoice Ready", sort_order: 2, checked_by: null, checked_at: null, started_at: "2026-01-02T03:04:05.000Z", completed_at: null },
    { label: "Payment Received", sort_order: 3, checked_by: null, checked_at: null, started_at: null, completed_at: null },
  ]);
});

test("checklist changes derive the compatibility sub-status and actor timestamps", async () => {
  const db = await database();
  db.run("insert into job_cards(id,job_no,main_status,sub_status,created_at) values(1,'JC-1','IN_PROGRESS','Work Started','2026-01-01T00:00:00.000Z')");
  migrateLifecycleStorage(db);
  const item = rows<{ id: number }>(db, "select id from checklist_items where label='Work Started'")[0];

  setChecklistItemChecked(db, item.id, 42, true, "2026-01-03T04:05:06.000Z");

  assert.deepEqual(rows(db, "select checked_by,checked_at,completed_at from checklist_items where id=" + item.id), [{ checked_by: 42, checked_at: "2026-01-03T04:05:06.000Z", completed_at: "2026-01-03T04:05:06.000Z" }]);
  assert.deepEqual(rows(db, "select sub_status from job_cards"), [{ sub_status: "Follow-up Needed" }]);
});

test("legacy job edits cannot override the checklist-derived compatibility summary", async () => {
  const db = await database();
  db.run("insert into job_cards(id,job_no,main_status,sub_status,created_at) values(1,'JC-1','IN_PROGRESS','Work Started','2026-01-01T00:00:00.000Z')");
  migrateLifecycleStorage(db);

  updateJobCard(db, 1, { sub_status: "Delivered" }, "attempted legacy edit");

  assert.deepEqual(rows(db, "select sub_status from job_cards"), [{ sub_status: "Work Started" }]);
});

test("large demo lifecycle seeds are deterministic and contain no HOLD status", async () => {
  const first = await database();
  const second = await database();
  loadLargeDemoDataset(first);
  loadLargeDemoDataset(second);
  const snapshot = (db: Database) => rows(db, "select c.job_card_id,c.stage,c.cycle_number,c.started_at,i.item_key,i.label,i.sort_order,i.checked_at from checklist_cycles c join checklist_items i on i.checklist_cycle_id=c.id order by c.job_card_id,i.sort_order");

  assert.equal(rows(first, "select * from job_cards where main_status='HOLD'").length, 0);
  assert.equal(rows(first, "select * from checklist_cycles").length, 144);
  assert.deepEqual(snapshot(first), snapshot(second));
});
