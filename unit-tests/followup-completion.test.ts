import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import initSqlJs, { type Database } from "sql.js";
import {
  createFollowup,
  createResolvedFollowup,
  createSchema,
  migrateSchema,
  readState,
} from "../src/db";
import { serviceFollowupStatus } from "../src/service-advisor";

async function database() {
  const SQL = await initSqlJs({
    locateFile: () =>
      fileURLToPath(
        new URL("../node_modules/sql.js/dist/sql-wasm.wasm", import.meta.url),
      ),
  });
  const db = new SQL.Database();
  createSchema(db);
  db.run("insert into users(id,email,name,role,password) values(1,'advisor@test','Advisor','service','x')");
  db.run("insert into customers(id,name,mobile,type,address) values(1,'Customer','9999999999','Individual','')");
  db.run("insert into vehicles(id,customer_id,number,make,model,color,km,engine_no) values(1,1,'KA01AB1234','Make','Model','',0,'')");
  db.run("insert into visits(id,customer_id,vehicle_id,advisor_id,requested_work) values(1,1,1,1,'Repair')");
  db.run("insert into job_cards(id,job_no,visit_id,advisor_id,main_status,sub_status,qc_status,washing_needed,closed_at) values(1,'JC-1',1,1,'IN_PROGRESS','Follow-up Needed','Pending',0,'')");
  migrateSchema(db);
  return db;
}

test("a resolved new contact closes prior open follow-ups while preserving their history", async () => {
  const db = await database();
  createFollowup(db, {
    job_card_id: 1,
    note: "Initial unanswered call",
    due_at: "2026-10-01",
    done: 0,
    outcome: "",
  });
  assert.equal(serviceFollowupStatus(readState(db).jobs[0]), "Pending (0/1)");

  createResolvedFollowup(
    db,
    {
      job_card_id: 1,
      note: "Customer confirmed the update",
      due_at: "2026-10-02",
      done: 1,
      outcome: "Confirmed",
    },
    "2026-10-02T10:00:00.000Z",
  );

  let followups = readState(db).jobs[0].followups;
  assert.equal(serviceFollowupStatus({ followups }), "Done(2)");
  assert.deepEqual(
    followups.map(({ note, outcome, done, updated_at }) => ({ note, outcome, done, updated_at })),
    [
      {
        note: "Initial unanswered call",
        outcome: "",
        done: 1,
        updated_at: "2026-10-02T10:00:00.000Z",
      },
      {
        note: "Customer confirmed the update",
        outcome: "Confirmed",
        done: 1,
        updated_at: "2026-10-02T10:00:00.000Z",
      },
    ],
  );

  createFollowup(db, {
    job_card_id: 1,
    note: "Follow-up requested after the call",
    due_at: "2026-10-03",
    done: 0,
    outcome: "",
  });
  followups = readState(db).jobs[0].followups;
  assert.equal(serviceFollowupStatus({ followups }), "Pending (2/3)");
});
