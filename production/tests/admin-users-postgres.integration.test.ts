import assert from "node:assert/strict";
import test from "node:test";

import { Client } from "pg";
import { AdminUserService, type CognitoAdminPort } from "../src/admin-users.js";
import { PostgresVertical } from "../local/database.js";

const adminUrl = process.env.USER_MGMT_TEST_ADMIN_URL;
const appUrl = process.env.USER_MGMT_TEST_APP_URL;

test("PostgreSQL user-management repository enforces real RLS, idempotency, lifecycle, and assignment rules", {
  skip: !adminUrl || !appUrl ? "isolated PostgreSQL URLs not supplied" : false,
}, async () => {
  const seed = new Client({ connectionString: adminUrl });
  await seed.connect();
  try {
    await seed.query(`
      INSERT INTO workshopos.tenant(tenant_id,legal_name,plan_id,entitlements,quotas,base_currency,timezone,configuration_template_id)
      VALUES('10000000-0000-4000-8000-000000000001','North Workshop','pilot','[]','{"users":3}','INR','Asia/Kolkata','india-v1');
      INSERT INTO workshopos.branch(id,tenant_id,name) VALUES
        ('10000000-0000-4000-8000-000000000011','10000000-0000-4000-8000-000000000001','Delhi'),
        ('10000000-0000-4000-8000-000000000012','10000000-0000-4000-8000-000000000001','Jaipur');
      INSERT INTO workshopos.role_template(id,tenant_id,name,permissions,system_template) VALUES
        ('10000000-0000-4000-8000-000000000021','10000000-0000-4000-8000-000000000001','Business Owner/Admin','["membership.manage"]',true),
        ('10000000-0000-4000-8000-000000000022','10000000-0000-4000-8000-000000000001','Service Advisor','["visit.view"]',true);
      INSERT INTO workshopos.membership(id,tenant_id,identity_subject,email,display_name,status,cognito_username)
      VALUES('10000000-0000-4000-8000-000000000031','10000000-0000-4000-8000-000000000001','sub-admin','admin@example.com','Admin','ACTIVE','admin@example.com');
      INSERT INTO workshopos.membership_role VALUES('10000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000031','10000000-0000-4000-8000-000000000021');
      INSERT INTO workshopos.membership_branch VALUES
        ('10000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000031','10000000-0000-4000-8000-000000000011'),
        ('10000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000031','10000000-0000-4000-8000-000000000012');
    `);
  } finally { await seed.end(); }

  const database = new PostgresVertical(appUrl);
  const identities = new Map<string, string>();
  const disabled: string[] = [];
  const cognito: CognitoAdminPort = {
    async ensureUser(input) {
      const subject = identities.get(input.email) ?? `sub-${identities.size + 1}`;
      identities.set(input.email, subject);
      return { identitySubject: subject, username: input.email, status: "INVITED" };
    },
    async disableUser(username) { disabled.push(username); },
    async resendInvitation() {},
  };
  try {
    const actor = await database.resolveMembership("sub-admin");
    assert.ok(actor);
    assert.deepEqual(actor.branchIds.sort(), ["10000000-0000-4000-8000-000000000011", "10000000-0000-4000-8000-000000000012"]);
    assert.deepEqual(actor.permissions, ["membership.manage"]);
    assert.equal(await database.resolveMembership("unknown-subject"), undefined);

    const service = new AdminUserService(database, cognito);
    const command = { name: "Advisor", email: "advisor@example.com", roleIds: ["10000000-0000-4000-8000-000000000022"], branchIds: ["10000000-0000-4000-8000-000000000011"] };
    const created = await service.create(actor, command, "invite-advisor");
    const replay = await service.create(actor, command, "invite-advisor");
    assert.equal(created.user.status, "INVITED");
    assert.equal(replay.user.id, created.user.id);
    assert.equal(replay.replay, true);

    const listed = await service.list(actor);
    assert.deepEqual(listed.users.map((item) => item.email).sort(), ["admin@example.com", "advisor@example.com"]);
    assert.deepEqual(created.user.branches.map((item) => item.name), ["Delhi"]);

    await assert.rejects(() => service.archive(actor, actor.id, "self"), (error: any) => error.code === "SELF_ARCHIVE_FORBIDDEN");
    await assert.rejects(() => service.update(actor, actor.id, { name: "Admin", roleIds: ["10000000-0000-4000-8000-000000000022"], branchIds: actor.branchIds, version: actor.version }), (error: any) => error.code === "FINAL_ADMIN_REQUIRED");
    await service.archive(actor, created.user.id, "Employment ended");
    assert.deepEqual(disabled, ["advisor@example.com"]);
    assert.equal((await service.list(actor)).users.some((item) => item.email === "advisor@example.com"), false);
  } finally { await database.close(); }
});
