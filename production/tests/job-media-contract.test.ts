import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

import {
  allowedMediaCategories,
  parseMediaListQuery,
} from "../src/job-media.js";

test("media categories follow the canonical Job lifecycle boundary", () => {
  assert.deepEqual(allowedMediaCategories("CHECK_IN"), [
    "BEFORE",
    "INSPECTION",
  ]);
  assert.deepEqual(allowedMediaCategories("ACTIVE"), ["PROGRESS"]);
  assert.deepEqual(allowedMediaCategories("QC"), ["PROGRESS", "AFTER"]);
  assert.deepEqual(allowedMediaCategories("BILLING"), ["AFTER"]);
  assert.deepEqual(allowedMediaCategories("CANCELLED"), []);
});

test("media list query validates dates and bounded pagination", () => {
  const parsed = parseMediaListQuery(
    new URLSearchParams(
      "visitDate=2026-09-15&category=AFTER&pageSize=50&includeArchived=true",
    ),
  );
  assert.equal(parsed.visitDate, "2026-09-15");
  assert.equal(parsed.category, "AFTER");
  assert.equal(parsed.pageSize, 50);
  assert.equal(parsed.includeArchived, true);
  assert.throws(
    () => parseMediaListQuery(new URLSearchParams("visitDate=2026-02-30")),
    /VISIT_DATE_INVALID/,
  );
  assert.throws(
    () => parseMediaListQuery(new URLSearchParams("pageSize=500")),
    /PAGE_SIZE_INVALID/,
  );
});

test("migration extends private media with Job linkage, thumbnails, scanner authority, RLS and no original byte column", async () => {
  const sql = await readFile(
    new URL("../db/migrations/040_job_linked_media.sql", import.meta.url),
    "utf8",
  );
  assert.match(sql, /ALTER TABLE workshopos\.secure_media_object/i);
  assert.match(
    sql,
    /FOREIGN KEY \(tenant_id,branch_id,job_id\).*reception_job_card/is,
  );
  assert.match(sql, /thumbnail_bytes bytea/i);
  assert.doesNotMatch(sql, /original_bytes|original_content|content bytea/i);
  assert.match(sql, /current_setting\('app\.scanner_authority'/i);
  assert.match(sql, /Job media cannot be hard deleted/i);
  assert.match(sql, /job_media_command_receipt ENABLE ROW LEVEL SECURITY/i);
  assert.match(
    sql,
    /job_id IS NOT NULL AND scan_status='CLEAN' AND archived_at IS NULL/i,
  );
});
