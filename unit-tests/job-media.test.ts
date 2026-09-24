import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import initSqlJs, { type Database } from "sql.js";
import {
  archiveJobPhotoForActor,
  createSchema,
  exportPersistableDatabase,
  migrateSchema,
  readState,
  saveJobPhotoForActor,
  updateJobPhotoForActor,
} from "../src/db";
import { MAX_MEDIA_DATA_URL_BYTES, MAX_MEDIA_FILE_BYTES, validateMediaDataUrl, validateMediaFile } from "../src/job-media";

const PNG_DATA_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

async function database() {
  const SQL = await initSqlJs({ locateFile: () => fileURLToPath(new URL("../node_modules/sql.js/dist/sql-wasm.wasm", import.meta.url)) });
  const db = new SQL.Database();
  createSchema(db);
  db.run("insert into users(id,email,name,role,password) values (1,'owner@test','Owner','admin','x'),(2,'linked@test','Linked','service','x'),(3,'other@test','Other','service','x'),(4,'viewer@test','Viewer','accounts','x')");
  db.run("insert into visits(id,advisor_id,requested_work) values(1,2,'Repair')");
  db.run("insert into job_cards(id,job_no,visit_id,advisor_id,technician_id,main_status,sub_status,qc_status,washing_needed,closed_at) values(1,'JC-1',1,2,2,'IN_PROGRESS','Photos Shared','Pending',0,'')");
  migrateSchema(db);
  return { SQL, db };
}

function row<T>(db: Database, sql: string) {
  const statement = db.prepare(sql);
  statement.step();
  const value = statement.getAsObject() as T;
  statement.free();
  return value;
}

test("media validation accepts bounded raster data URLs and rejects unsafe or mismatched content", () => {
  assert.deepEqual(validateMediaDataUrl(PNG_DATA_URL), { mimeType: "image/png", byteSize: 68 });
  assert.throws(() => validateMediaDataUrl("https://example.test/photo.png"), /compressed image data URL/);
  assert.throws(() => validateMediaDataUrl("data:image/svg+xml;base64,PHN2Zz48L3N2Zz4="), /JPEG, PNG, or WebP/);
  assert.throws(() => validateMediaDataUrl("data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUg=="), /does not match/);
  assert.throws(() => validateMediaDataUrl(`data:image/png;base64,${Buffer.alloc(MAX_MEDIA_DATA_URL_BYTES + 1).toString("base64")}`), /compressed image is too large/);
});

test("file validation enforces declared MIME, magic bytes, and the 10 MB input bound", async () => {
  const png = Buffer.from(PNG_DATA_URL.split(",")[1], "base64");
  await validateMediaFile(new File([png], "valid.png", { type: "image/png" }));
  await assert.rejects(validateMediaFile(new File(["<svg></svg>"], "unsafe.svg", { type: "image/svg+xml" })), /JPEG, PNG, or WebP/);
  await assert.rejects(validateMediaFile(new File([png], "spoofed.jpg", { type: "image/jpeg" })), /does not match/);
  await assert.rejects(validateMediaFile(new File([Buffer.alloc(MAX_MEDIA_FILE_BYTES + 1)], "large.png", { type: "image/png" })), /10 MB or smaller/);
});

test("owner and linked advisor can save metadata while other roles cannot mutate media", async () => {
  const { db } = await database();
  assert.throws(() => saveJobPhotoForActor(db, 1, 3, { label: "Before", category: "Before Work", src: PNG_DATA_URL, originalName: "before.png", width: 1, height: 1 }), /Owner or the linked Service Advisor/);
  assert.throws(() => saveJobPhotoForActor(db, 1, 4, { label: "Before", category: "Before Work", src: PNG_DATA_URL, originalName: "before.png", width: 1, height: 1 }), /Owner or the linked Service Advisor/);

  const id = saveJobPhotoForActor(db, 1, 2, { label: " Before repair ", category: "Before Work", src: PNG_DATA_URL, originalName: "before.png", width: 1, height: 1 });
  assert.deepEqual(row(db, "select label,category,mime_type,byte_size,original_name,width,height from photos where id=1"), {
    label: "Before repair", category: "Before Work", mime_type: "image/png", byte_size: 68, original_name: "before.png", width: 1, height: 1,
  });
  assert.equal(row<{ main_status: string }>(db, "select main_status from job_cards where id=1").main_status, "IN_PROGRESS");
  assert.ok(row<{ checked_at: string | null }>(db, "select checked_at from checklist_items where job_card_id=1 and label='Photos Shared'").checked_at);

  updateJobPhotoForActor(db, id, 1, { label: "Inspection view", category: "After Work" });
  assert.deepEqual(row(db, "select label,category,src from photos where id=1"), { label: "Inspection view", category: "After Work", src: PNG_DATA_URL });
  assert.throws(() => updateJobPhotoForActor(db, id, 3, { label: "Denied", category: "After Work" }), /linked Service Advisor/);
  assert.throws(() => archiveJobPhotoForActor(db, id, 4, "No"), /linked Service Advisor/);
  archiveJobPhotoForActor(db, id, 2, "Duplicate image");
  assert.deepEqual(row(db, "select archived_at is not null as archived,archived_reason from photos where id=1"), { archived: 1, archived_reason: "Duplicate image" });
  assert.equal(row<{ main_status: string }>(db, "select main_status from job_cards where id=1").main_status, "IN_PROGRESS");
  assert.equal(row<{ checked_at: string | null }>(db, "select checked_at from checklist_items where job_card_id=1 and label='Photos Shared'").checked_at, null);
});

test("media stays in the live SQL.js session but is stripped from the localStorage snapshot", async () => {
  const { SQL, db } = await database();
  saveJobPhotoForActor(db, 1, 1, { label: "Session only", category: "After Work", src: PNG_DATA_URL, originalName: "after.png", width: 1, height: 1 });
  assert.equal(readState(db).jobs[0].photos[0].src, PNG_DATA_URL);

  const snapshot = exportPersistableDatabase(db, (bytes) => new SQL.Database(bytes));
  const restored = new SQL.Database(snapshot);
  assert.equal(row<{ count: number }>(restored, "select count(*) as count from photos").count, 0);
  assert.equal(row<{ checked_at: string | null }>(restored, "select checked_at from checklist_items where job_card_id=1 and label='Photos Shared'").checked_at, null);
  assert.ok(!Buffer.from(snapshot).includes(Buffer.from("iVBORw0KGgo")));
});
