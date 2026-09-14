import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { createUserExportArtifact } from "../src/user-export.js";
import { DEFAULT_USER_LIST_QUERY, parseUserListQuery } from "../src/user-list-contract.js";

const users = [{
  id: "user-1", name: "Anita Admin", email: "anita@example.com", status: "ACTIVE" as const,
  roleIds: ["role-admin"], roles: [{ id: "role-admin", name: "Admin", permissions: ["membership.manage"] }],
  branchIds: ["branch-delhi"], branches: [{ id: "branch-delhi", name: "Delhi" }], version: 3,
  createdAt: "2026-09-14T00:00:00.000Z", updatedAt: "2026-09-14T01:00:00.000Z",
}];

test("user list query accepts only stable filters, sorts, and page sizes", () => {
  assert.deepEqual(parseUserListQuery(new URLSearchParams()), DEFAULT_USER_LIST_QUERY);
  assert.deepEqual(parseUserListQuery(new URLSearchParams("search=+anita+&status=ACTIVE&roleId=role-admin&branchId=branch-delhi&sort=email.desc&page=2&pageSize=50")), {
    search: "anita", status: "ACTIVE", roleId: "role-admin", branchId: "branch-delhi", sort: "email.desc", page: 2, pageSize: 50,
  });
  assert.deepEqual(parseUserListQuery(new URLSearchParams("status=unknown&sort=drop+table&page=-1&pageSize=500")), DEFAULT_USER_LIST_QUERY);
});

test("user exports are real PDF/XLSX artifacts containing every supplied row", () => {
  const pdf = createUserExportArtifact("PDF", users);
  const xlsx = createUserExportArtifact("XLSX", users);
  assert.equal(pdf.content.subarray(0, 4).toString(), "%PDF");
  assert.deepEqual([...xlsx.content.subarray(0, 2)], [0x50, 0x4b]);
  assert.equal(pdf.rowCount, 1); assert.equal(xlsx.rowCount, 1);
  assert.match(pdf.filename, /^users-.+\.pdf$/); assert.match(xlsx.filename, /^users-.+\.xlsx$/);
});

test("tenant user migration makes administration audit evidence append-only", async () => {
  const migration = await readFile(new URL("../db/migrations/033_tenant_user_management.sql", import.meta.url), "utf8");
  assert.match(migration, /FORCE ROW LEVEL SECURITY/);
  assert.match(migration, /membership_admin_audit_append_only/);
  assert.match(migration, /BEFORE UPDATE OR DELETE/);
});
