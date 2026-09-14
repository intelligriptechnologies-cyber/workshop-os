import assert from "node:assert/strict";
import test from "node:test";

import { Client } from "pg";
import { PostgresVertical } from "../local/database.js";
import { AdminUserService } from "../src/admin-users.js";
import { RolePermissionService } from "../src/role-permissions.js";

const adminUrl = process.env.ROLES_TEST_ADMIN_URL;
const appUrl = process.env.ROLES_TEST_APP_URL;

test("PostgreSQL roles are tenant-isolated, versioned, protected, and refresh unified record policy", {
  skip: !adminUrl || !appUrl ? "isolated PostgreSQL URLs not supplied" : false,
}, async () => {
  const seed = new Client({ connectionString: adminUrl }); await seed.connect();
  try {
    await seed.query(`
      INSERT INTO workshopos.tenant(tenant_id,legal_name,plan_id,entitlements,quotas,base_currency,timezone,configuration_template_id) VALUES
        ('40000000-0000-4000-8000-000000000001','Role Workshop','pilot','[]','{}','INR','Asia/Kolkata','india-v1'),
        ('40000000-0000-4000-8000-000000000002','Other Workshop','pilot','[]','{}','INR','Asia/Kolkata','india-v1');
      INSERT INTO workshopos.branch(id,tenant_id,name) VALUES
        ('40000000-0000-4000-8000-000000000011','40000000-0000-4000-8000-000000000001','Visible'),
        ('40000000-0000-4000-8000-000000000012','40000000-0000-4000-8000-000000000001','Hidden');
      INSERT INTO workshopos.role_template(id,tenant_id,name,description,permissions,system_template) VALUES
        ('40000000-0000-4000-8000-000000000021','40000000-0000-4000-8000-000000000001','Business Owner/Admin','Protected','["admin.users.page","membership.manage","admin.roles.page","role.manage","work-items.page","work-item.read","work-item.manage","work-item.export","global-search.page","global-search.use"]',true),
        ('40000000-0000-4000-8000-000000000022','40000000-0000-4000-8000-000000000002','Other Tenant Role','','["work-items.page"]',false);
      INSERT INTO workshopos.membership(id,tenant_id,identity_subject,email,display_name,status,cognito_username) VALUES
        ('40000000-0000-4000-8000-000000000031','40000000-0000-4000-8000-000000000001','role-admin','admin@roles.test','Role Admin','ACTIVE','admin@roles.test'),
        ('40000000-0000-4000-8000-000000000032','40000000-0000-4000-8000-000000000001','role-limited','limited@roles.test','Secret User','ACTIVE','limited@roles.test');
      INSERT INTO workshopos.membership_role VALUES('40000000-0000-4000-8000-000000000001','40000000-0000-4000-8000-000000000031','40000000-0000-4000-8000-000000000021');
      INSERT INTO workshopos.membership_branch VALUES
        ('40000000-0000-4000-8000-000000000001','40000000-0000-4000-8000-000000000031','40000000-0000-4000-8000-000000000011'),
        ('40000000-0000-4000-8000-000000000001','40000000-0000-4000-8000-000000000031','40000000-0000-4000-8000-000000000012'),
        ('40000000-0000-4000-8000-000000000001','40000000-0000-4000-8000-000000000032','40000000-0000-4000-8000-000000000011');
    `);
  } finally { await seed.end(); }

  const database = new PostgresVertical(appUrl); const service = new RolePermissionService(database);
  try {
    const actor = await database.resolveMembership("role-admin"); assert.ok(actor);
    assert.ok(actor.permissions.includes("role.manage"));
    const created = await service.create(actor, { name: "Technician", description: "Visible work only", permissions: ["work-items.page", "work-item.read", "global-search.page", "global-search.use"] }, "role-create");
    assert.equal((await service.create(actor, { name: "Technician", description: "Visible work only", permissions: ["work-items.page", "work-item.read", "global-search.page", "global-search.use"] }, "role-create")).replay, true);
    assert.ok((await database.directory(actor)).roles.some((role) => role.id === created.role.id));
    const users = new AdminUserService(database, {
      async ensureUser() { throw new Error("not used"); }, async disableUser() {}, async enableUser() {}, async resendInvitation() {},
    });
    await users.update(actor, "40000000-0000-4000-8000-000000000032", {
      name: "Secret User", roleIds: [created.role.id], branchIds: ["40000000-0000-4000-8000-000000000011"], version: 1,
    });
    const beforeRefresh = await database.resolveMembership("role-limited"); assert.ok(beforeRefresh);
    assert.ok(!beforeRefresh.permissions.includes("work-item.manage"));
    const revised = await service.update(actor, created.role.id, { name: "Senior Technician", description: "Visible work only", permissions: ["work-items.page", "work-item.read", "work-item.manage", "global-search.page", "global-search.use"], version: 1 });
    assert.equal(revised.version, 2);
    await assert.rejects(() => service.update(actor, revised.id, { ...revised, version: 1 }), (error: any) => error.code === "VERSION_CONFLICT");
    const limited = await database.resolveMembership("role-limited"); assert.ok(limited);
    assert.deepEqual(limited.permissions.sort(), ["global-search.page", "global-search.use", "work-item.manage", "work-item.read", "work-items.page"]);
    const visible = await database.createWorkItem(actor, { branchId: actor.branchIds[0], summary: "Policy needle visible" }, "visible-work");
    const hidden = await database.createWorkItem(actor, { branchId: actor.branchIds[1], summary: "Policy needle hidden" }, "hidden-work");
    const search = await database.globalSearch(limited, "Policy needle");
    assert.deepEqual(search.records.map((record) => record.id), [visible.body.workItem.id]);
    assert.ok(!JSON.stringify(search).includes(hidden.body.workItem.id));
    assert.deepEqual((await database.globalSearch(limited, "Secret User")).records, []);
    assert.deepEqual((await database.globalSearch(actor, "Secret User")).records.map((record) => record.label), ["Secret User"]);
    assert.ok(!("totalCount" in search));
    await assert.rejects(() => service.archive(actor, revised.id, { version: 2, reason: "Still assigned" }, "archive-used"), (error: any) => error.code === "ROLE_IN_USE");

    const soleAdmin = (await service.create(actor, {
      name: "Sole Custom Admin", description: "Exercises the final effective administrator invariant",
      permissions: ["admin.users.page", "membership.manage", "admin.roles.page", "role.manage"],
    }, "sole-admin-create")).role;
    await users.update(actor, actor.id, {
      name: actor.displayName, roleIds: [soleAdmin.id], branchIds: actor.branchIds, version: actor.version,
    });
    await assert.rejects(() => service.update(actor, soleAdmin.id, {
      name: soleAdmin.name, description: soleAdmin.description,
      permissions: ["admin.roles.page", "role.manage"], version: soleAdmin.version,
    }), (error: any) => error.code === "FINAL_ADMIN_REQUIRED");

    const unused = (await service.create(actor, { name: "Unused", description: "", permissions: ["work-items.page"] }, "unused-create")).role;
    const archived = await service.archive(actor, unused.id, { version: 1, reason: "No longer required" }, "unused-archive");
    assert.equal(archived.role.active, false); assert.equal(archived.role.version, 2);
    assert.equal((await service.archive(actor, unused.id, { version: 1, reason: "No longer required" }, "unused-archive")).replay, true);
    assert.equal((await service.list(actor)).roles.some((role) => role.name === "Other Tenant Role"), false);
  } finally { await database.close(); }

  const immutable = new Client({ connectionString: adminUrl }); await immutable.connect();
  try {
    await assert.rejects(() => immutable.query("UPDATE workshopos.role_template SET name='Weakened',version=version+1 WHERE id='40000000-0000-4000-8000-000000000021'"), /protected role templates/);
    await assert.rejects(() => immutable.query("DELETE FROM workshopos.role_template WHERE id='40000000-0000-4000-8000-000000000021'"), /archived, not deleted/);
    await assert.rejects(() => immutable.query("UPDATE workshopos.role_template_version SET change_reason='rewritten'"), /append-only/);
    const versions = await immutable.query<{ version: string }>("SELECT version::text FROM workshopos.role_template_version WHERE name IN ('Technician','Senior Technician') ORDER BY version");
    assert.deepEqual(versions.rows.map((row) => Number(row.version)), [1, 2]);
  } finally { await immutable.end(); }
});
