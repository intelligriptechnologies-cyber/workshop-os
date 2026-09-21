import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

test("production entry graph excludes sql.js and inventories every production route", () => {
  const result = spawnSync(process.execPath, ["scripts/verify-production-authority.mjs"], { cwd: process.cwd(), encoding: "utf8" });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /Production authority gate passed/);
});
