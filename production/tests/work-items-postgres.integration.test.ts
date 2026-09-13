import assert from "node:assert/strict";
import test from "node:test";

import { Client } from "pg";
import { ApiError } from "../src/admin-users.js";
import { PostgresVertical, type Membership } from "../local/database.js";

const adminUrl = process.env.WORK_ITEMS_TEST_ADMIN_URL;
const appUrl = process.env.WORK_ITEMS_TEST_APP_URL;

test("PostgreSQL work-item HTTP repository is replay-safe, versioned, and RLS isolated", {
  skip: !adminUrl || !appUrl ? "isolated PostgreSQL URLs not supplied" : false,
}, async () => {
  const seed = new Client({ connectionString: adminUrl });
  await seed.connect();
  try {
    await seed.query(`
      INSERT INTO workshopos.tenant(tenant_id,legal_name,plan_id,entitlements,quotas,base_currency,timezone,configuration_template_id)
      VALUES
        ('20000000-0000-4000-8000-000000000001','North Workshop','pilot','[]','{}','INR','Asia/Kolkata','india-v1'),
        ('20000000-0000-4000-8000-000000000002','South Workshop','pilot','[]','{}','INR','Asia/Kolkata','india-v1');
      INSERT INTO workshopos.branch(id,tenant_id,name) VALUES
        ('20000000-0000-4000-8000-000000000011','20000000-0000-4000-8000-000000000001','Delhi'),
        ('20000000-0000-4000-8000-000000000012','20000000-0000-4000-8000-000000000001','Jaipur'),
        ('20000000-0000-4000-8000-000000000021','20000000-0000-4000-8000-000000000002','Bengaluru');
    `);
  } finally { await seed.end(); }

  const north: Membership = { subject: "north-user", tenantId: "20000000-0000-4000-8000-000000000001", branchIds: ["20000000-0000-4000-8000-000000000011"] };
  const jaipur: Membership = { subject: "jaipur-user", tenantId: north.tenantId, branchIds: ["20000000-0000-4000-8000-000000000012"] };
  const south: Membership = { subject: "south-user", tenantId: "20000000-0000-4000-8000-000000000002", branchIds: ["20000000-0000-4000-8000-000000000021"] };
  const database = new PostgresVertical(appUrl);
  try {
    const input = { branchId: north.branchIds[0], summary: "Inspect vehicle" };
    const created = await database.createWorkItem(north, input, "inspect-1");
    const replay = await database.createWorkItem(north, input, "inspect-1");
    assert.equal(created.status, 201);
    assert.equal(replay.status, 200);
    assert.equal(replay.body.workItem.id, created.body.workItem.id);

    await assert.rejects(
      () => database.createWorkItem(north, { ...input, summary: "Different command" }, "inspect-1"),
      (error: unknown) => error instanceof ApiError && error.code === "IDEMPOTENCY_KEY_REUSED",
    );

    const updated = await database.updateWorkItem(north, created.body.workItem.id, { summary: "Inspect brakes", version: 1 });
    assert.equal(updated.summary, "Inspect brakes");
    assert.equal(updated.version, 2);
    await assert.rejects(
      () => database.updateWorkItem(north, created.body.workItem.id, { summary: "Stale edit", version: 1 }),
      (error: unknown) => error instanceof ApiError && error.code === "VERSION_CONFLICT",
    );

    assert.deepEqual(await database.listWorkItems(jaipur), []);
    assert.deepEqual(await database.listWorkItems(south), []);
    await assert.rejects(
      () => database.updateWorkItem(jaipur, created.body.workItem.id, { summary: "Branch hop", version: 2 }),
      (error: unknown) => error instanceof ApiError && error.code === "WORK_ITEM_NOT_FOUND",
    );
  } finally { await database.close(); }
});
