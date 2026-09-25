import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import initSqlJs, { type Database } from "sql.js";
import {
  recordPayment,
  approveEstimate,
  createFollowup,
  createPhoto,
  createSchema,
  createTask,
  generateInvoice,
  issueMaterial,
  MAIN_STATUS_TRANSITIONS,
  markWashingNeeded,
  migrateSchema,
  passQc,
  setChecklistItemChecked,
  transitionJobStatus,
  updateTask,
} from "../src/db";
import type { MainStatus, SubStatus } from "../src/types";

async function database() {
  const SQL = await initSqlJs({ locateFile: () => fileURLToPath(new URL("../node_modules/sql.js/dist/sql-wasm.wasm", import.meta.url)) });
  const db = new SQL.Database();
  createSchema(db);
  migrateSchema(db);
  return db;
}

function rows<T>(db: Database, sql: string, params: (string | number | null)[] = []): T[] {
  const statement = db.prepare(sql);
  statement.bind(params);
  const result: T[] = [];
  while (statement.step()) result.push(statement.getAsObject() as T);
  statement.free();
  return result;
}

function insertJob(db: Database, status: MainStatus, subStatus: SubStatus) {
  db.run("insert into visits(id,requested_work) values(1,'Repair and service')");
  db.run("insert into job_cards(id,job_no,visit_id,main_status,sub_status,qc_status,washing_needed,closed_at,created_at) values(1,'JC-1',1,?,?, 'Pending',0,'','2026-01-01T00:00:00.000Z')", [status, subStatus]);
  migrateSchema(db);
}

function completeActiveCycle(db: Database, actorId = 7) {
  const items = rows<{ id: number }>(db, "select i.id from checklist_items i join checklist_cycles c on c.id=i.checklist_cycle_id where c.job_card_id=1 order by c.id desc,i.sort_order limit 100");
  const latestCycle = rows<{ id: number }>(db, "select id from checklist_cycles where job_card_id=1 order by id desc limit 1")[0].id;
  for (const item of rows<{ id: number }>(db, "select id from checklist_items where checklist_cycle_id=? order by sort_order", [latestCycle])) {
    setChecklistItemChecked(db, item.id, actorId, true, `2026-01-02T00:00:0${item.id % 10}.000Z`);
  }
  assert.ok(items.length > 0);
}

test("central transition API enforces the complete allowed-transition table", async () => {
  assert.deepEqual(MAIN_STATUS_TRANSITIONS, {
    NEW: ["IN_PROGRESS", "CANCELLED"],
    IN_PROGRESS: ["COMPLETED", "HOLD", "CANCELLED"],
    HOLD: ["IN_PROGRESS", "CANCELLED"],
    COMPLETED: ["IN_PROGRESS", "CLOSED"],
    CANCELLED: [],
    CLOSED: [],
  });

  const statuses = Object.keys(MAIN_STATUS_TRANSITIONS) as MainStatus[];
  const subByStatus: Record<MainStatus, SubStatus> = { NEW: "Gather Requirements", IN_PROGRESS: "Material Requested", COMPLETED: "Customer Verification", CLOSED: "Delivered", CANCELLED: "Work Started", HOLD: "Material Requested" };
  for (const from of statuses) {
    for (const to of statuses) {
      const db = await database();
      insertJob(db, from, subByStatus[from]);
      if (from !== "CANCELLED" && from !== "HOLD") completeActiveCycle(db);
      const allowed = MAIN_STATUS_TRANSITIONS[from].includes(to);
      if (allowed) {
        transitionJobStatus(db, 1, to, `${from} to ${to}`, "2026-02-01T00:00:00.000Z");
        assert.equal(rows<{ main_status: MainStatus }>(db, "select main_status from job_cards")[0].main_status, to);
      } else {
        assert.throws(() => transitionJobStatus(db, 1, to, "invalid"));
        assert.equal(rows<{ main_status: MainStatus }>(db, "select main_status from job_cards")[0].main_status, from);
      }
    }
  }
});

test("checklists enforce ordering and gate forward transitions without partial writes", async () => {
  const db = await database();
  insertJob(db, "NEW", "Gather Requirements");
  const items = rows<{ id: number; label: string }>(db, "select id,label from checklist_items order by sort_order");

  assert.throws(() => setChecklistItemChecked(db, items[1].id, 7, true), /in order/);
  assert.throws(() => transitionJobStatus(db, 1, "IN_PROGRESS", "start work"), /Complete the NEW checklist.*Gather Requirements/);
  assert.equal(rows(db, "select * from status_history").length, 0);
  assert.equal(rows(db, "select * from checklist_cycles").length, 1);

  completeActiveCycle(db);
  transitionJobStatus(db, 1, "IN_PROGRESS", "Approved scope ready", "2026-02-01T01:02:03.000Z");
  assert.deepEqual(rows(db, "select main_status,sub_status from job_cards"), [{ main_status: "IN_PROGRESS", sub_status: "Material Requested" }]);
  assert.deepEqual(rows(db, "select main_status,note,created_at from status_history"), [{ main_status: "IN_PROGRESS", note: "Approved scope ready", created_at: "2026-02-01T01:02:03.000Z" }]);
});

test("every transition requires a note, cancellation bypasses gates, and CLOSED is terminal", async () => {
  const db = await database();
  insertJob(db, "NEW", "Gather Requirements");
  assert.throws(() => transitionJobStatus(db, 1, "CANCELLED", "  "), /confirmation note/);

  transitionJobStatus(db, 1, "CANCELLED", "Customer withdrew approval");
  assert.equal(rows<{ main_status: string }>(db, "select main_status from job_cards")[0].main_status, "CANCELLED");
  assert.throws(() => transitionJobStatus(db, 1, "IN_PROGRESS", "try reopen"), /Cannot move.*CANCELLED/);
});

test("CLOSED is terminal", async () => {
  const db = await database();
  insertJob(db, "IN_PROGRESS", "Material Requested");
  completeActiveCycle(db);
  transitionJobStatus(db, 1, "COMPLETED", "Work complete");
  completeActiveCycle(db);
  transitionJobStatus(db, 1, "CLOSED", "Vehicle released");
  assert.throws(() => transitionJobStatus(db, 1, "IN_PROGRESS", "try reopen"), /Cannot move.*CLOSED/);
});

test("HOLD pauses without a checklist gate and resumes the same IN_PROGRESS cycle", async () => {
  const db = await database();
  insertJob(db, "IN_PROGRESS", "Material Requested");
  assert.throws(() => transitionJobStatus(db, 1, "HOLD", " "), /confirmation note/);
  transitionJobStatus(db, 1, "HOLD", "Waiting for parts");
  assert.equal(rows<{ main_status: string }>(db, "select main_status from job_cards")[0].main_status, "HOLD");
  transitionJobStatus(db, 1, "IN_PROGRESS", "Parts arrived");
  assert.deepEqual(rows(db, "select stage,cycle_number from checklist_cycles order by id"), [{ stage: "IN_PROGRESS", cycle_number: 1 }]);
  transitionJobStatus(db, 1, "HOLD", "Paused again");
  transitionJobStatus(db, 1, "CANCELLED", "Customer withdrew");
  assert.equal(rows<{ main_status: string }>(db, "select main_status from job_cards")[0].main_status, "CANCELLED");
});

test("transition failure rolls back status, new cycle, and audit history atomically", async () => {
  const db = await database();
  insertJob(db, "NEW", "Gather Requirements");
  completeActiveCycle(db);
  db.run("create trigger reject_transition_history before insert on status_history begin select raise(abort, 'audit unavailable'); end");

  assert.throws(() => transitionJobStatus(db, 1, "IN_PROGRESS", "ready"), /audit unavailable/);
  assert.deepEqual(rows(db, "select main_status,sub_status from job_cards"), [{ main_status: "NEW", sub_status: "Get Confirmation" }]);
  assert.deepEqual(rows(db, "select stage,cycle_number from checklist_cycles"), [{ stage: "NEW", cycle_number: 1 }]);
  assert.equal(rows(db, "select * from status_history").length, 0);
});

test("completed-job rework creates fresh stage cycles and preserves prior history", async () => {
  const db = await database();
  insertJob(db, "COMPLETED", "Customer Verification");
  completeActiveCycle(db);
  transitionJobStatus(db, 1, "IN_PROGRESS", "Customer reported a rework item", "2026-03-01T00:00:00.000Z");
  completeActiveCycle(db);
  transitionJobStatus(db, 1, "COMPLETED", "Rework passed inspection", "2026-03-02T00:00:00.000Z");

  assert.deepEqual(rows(db, "select stage,cycle_number,completed_at is not null as complete from checklist_cycles order by id"), [
    { stage: "COMPLETED", cycle_number: 1, complete: 1 },
    { stage: "IN_PROGRESS", cycle_number: 1, complete: 1 },
    { stage: "COMPLETED", cycle_number: 2, complete: 0 },
  ]);
  assert.deepEqual(rows(db, "select main_status,note from status_history order by id"), [
    { main_status: "IN_PROGRESS", note: "Customer reported a rework item" },
    { main_status: "COMPLETED", note: "Rework passed inspection" },
  ]);
});

test("non-billing artifacts never advance main status; full payment does not close and manual Close creates the Gate Pass", async () => {
  const db = await database();
  insertJob(db, "NEW", "Gather Requirements");
  db.run("insert into inventory(id,sku,name,stock_qty,archived_at) values(1,'MAT-1','Material',100,null)");

  approveEstimate(db, 1, "Customer confirmed");
  assert.equal(rows<{ main_status: string }>(db, "select main_status from job_cards")[0].main_status, "NEW");
  assert.equal(rows<{ remaining: number }>(db, "select count(*) as remaining from checklist_items where checked_at is null")[0].remaining, 0);
  transitionJobStatus(db, 1, "IN_PROGRESS", "Start approved work");

  const requestId = rows<{ id: number }>(db, "select id from material_requests where job_card_id=1")[0].id;
  issueMaterial(db, requestId);
  markWashingNeeded(db, 1);
  const taskId = createTask(db, { job_card_id: 1, technician_id: 6, title: "Repair", status: "Pending", notes: "" });
  updateTask(db, taskId, "Started", "Work underway");
  createFollowup(db, { job_card_id: 1, note: "Update customer", due_at: "2026-03-01", done: 0, outcome: "" });
  createPhoto(db, { job_card_id: 1, label: "After work", src: "data:image/jpeg;base64,AA==", category: "After Work" });
  updateTask(db, taskId, "Completed", "Done");
  passQc(db, 1);
  assert.equal(rows<{ main_status: string }>(db, "select main_status from job_cards")[0].main_status, "IN_PROGRESS");
  assert.equal(rows<{ remaining: number }>(db, "select count(*) as remaining from checklist_items where checklist_cycle_id=(select max(id) from checklist_cycles) and checked_at is null")[0].remaining, 0);

  transitionJobStatus(db, 1, "COMPLETED", "QC evidence accepted");
  generateInvoice(db, 1, "TLY-1");
  const total = rows<{ total: number }>(db, "select total from invoices where job_card_id=1")[0].total;
  assert.ok(total > 0);
  recordPayment(db, rows<{ id: number }>(db, "select id from invoices where job_card_id=1")[0].id, { mode: "UPI", otherDetail: "", reference: "PAY-1" });
  assert.equal(rows<{ main_status: string }>(db, "select main_status from job_cards")[0].main_status, "COMPLETED");
  transitionJobStatus(db, 1, "CLOSED", "Handed over");
  assert.equal(rows<{ main_status: string }>(db, "select main_status from job_cards")[0].main_status, "CLOSED");
  assert.deepEqual(rows(db, "select label,checked_at is not null as checked from checklist_items where checklist_cycle_id=(select max(id) from checklist_cycles) order by sort_order"), [
    { label: "Receipt Generated", checked: 1 },
    { label: "Gate Pass Generated", checked: 1 },
    { label: "Delivered", checked: 0 },
  ]);
});
