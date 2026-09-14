import assert from "node:assert/strict";
import test from "node:test";

import { Client } from "pg";
import { PostgresVertical } from "../local/database.js";
import { BusinessSettingsService } from "../src/business-settings.js";

const adminUrl = process.env.SETTINGS_TEST_ADMIN_URL;
const appUrl = process.env.SETTINGS_TEST_APP_URL;

test("PostgreSQL Business Settings publish inherited versions and freeze effective work values", {
  skip: !adminUrl || !appUrl ? "isolated PostgreSQL URLs not supplied" : false,
}, async () => {
  const seed = new Client({ connectionString: adminUrl }); await seed.connect();
  try { await seed.query(`
    INSERT INTO workshopos.tenant(tenant_id,legal_name,plan_id,entitlements,quotas,base_currency,timezone,configuration_template_id) VALUES
      ('50000000-0000-4000-8000-000000000001','Settings Workshop','pilot','[]','{}','INR','Asia/Kolkata','india-v1'),
      ('50000000-0000-4000-8000-000000000002','Other Workshop','pilot','[]','{}','INR','Asia/Kolkata','india-v1');
    INSERT INTO workshopos.branch(id,tenant_id,name) VALUES
      ('50000000-0000-4000-8000-000000000011','50000000-0000-4000-8000-000000000001','Delhi'),
      ('50000000-0000-4000-8000-000000000012','50000000-0000-4000-8000-000000000001','Jaipur'),
      ('50000000-0000-4000-8000-000000000013','50000000-0000-4000-8000-000000000002','Other');
    INSERT INTO workshopos.role_template(id,tenant_id,name,permissions,system_template) VALUES
      ('50000000-0000-4000-8000-000000000021','50000000-0000-4000-8000-000000000001','Settings Admin','["business-settings.page","business-settings.manage","work-item.manage"]',false),
      ('50000000-0000-4000-8000-000000000022','50000000-0000-4000-8000-000000000001','Settings Viewer','["business-settings.page"]',false);
    INSERT INTO workshopos.membership(id,tenant_id,identity_subject,email,display_name,status,cognito_username) VALUES
      ('50000000-0000-4000-8000-000000000031','50000000-0000-4000-8000-000000000001','settings-admin','admin@settings.test','Settings Admin','ACTIVE','admin@settings.test'),
      ('50000000-0000-4000-8000-000000000032','50000000-0000-4000-8000-000000000001','settings-viewer','viewer@settings.test','Settings Viewer','ACTIVE','viewer@settings.test');
    INSERT INTO workshopos.membership_role VALUES
      ('50000000-0000-4000-8000-000000000001','50000000-0000-4000-8000-000000000031','50000000-0000-4000-8000-000000000021'),
      ('50000000-0000-4000-8000-000000000001','50000000-0000-4000-8000-000000000032','50000000-0000-4000-8000-000000000022');
    INSERT INTO workshopos.membership_branch VALUES
      ('50000000-0000-4000-8000-000000000001','50000000-0000-4000-8000-000000000031','50000000-0000-4000-8000-000000000011'),
      ('50000000-0000-4000-8000-000000000001','50000000-0000-4000-8000-000000000032','50000000-0000-4000-8000-000000000011');
    INSERT INTO workshopos.work_item(id,tenant_id,branch_id,summary) VALUES
      ('50000000-0000-4000-8000-000000000041','50000000-0000-4000-8000-000000000002','50000000-0000-4000-8000-000000000013','Other tenant work');
  `); } finally { await seed.end(); }

  const database = new PostgresVertical(appUrl); const service = new BusinessSettingsService(database);
  let workItemId = "";
  try {
    const actor = await database.resolveMembership("settings-admin"); const viewer = await database.resolveMembership("settings-viewer"); assert.ok(actor && viewer);
    const initial = await service.get(actor); assert.equal(initial.effective.defaultJobDurationMinutes, 60);
    const tenantDraft = await service.save(actor, undefined, { version: initial.draftVersion, values: { ...initial.effective, defaultLaborRateMinor: 175000, invoiceFooter: "Delhi workshop" } });
    const tenantPublished = await service.publish(actor, undefined, { version: tenantDraft.draftVersion }, "tenant-publish-1");
    assert.equal(tenantPublished.publishedVersion, 1);
    assert.deepEqual(await service.publish(actor, undefined, { version: tenantDraft.draftVersion }, "tenant-publish-1"), tenantPublished);

    const branchInitial = await service.get(actor, actor.branchIds[0]);
    assert.equal(branchInitial.inherited.defaultLaborRateMinor, 175000); assert.deepEqual(branchInitial.overrides, {});
    const branchDraft = await service.save(actor, actor.branchIds[0], { version: branchInitial.draftVersion, values: { defaultJobDurationMinutes: 90 } });
    const branchPublished = await service.publish(actor, actor.branchIds[0], { version: branchDraft.draftVersion }, "branch-publish-1");
    assert.equal(branchPublished.effective.defaultJobDurationMinutes, 90); assert.equal(branchPublished.effective.defaultLaborRateMinor, 175000);
    const resetDraft = await service.save(actor, actor.branchIds[0], { version: branchPublished.draftVersion, values: {} });
    assert.equal(resetDraft.effective.defaultJobDurationMinutes, 60);
    await assert.rejects(() => service.publish(actor, actor.branchIds[0], { version: branchDraft.draftVersion }, "stale-publish"), (error: any) => error.code === "VERSION_CONFLICT");
    const resetPublished = await service.publish(actor, actor.branchIds[0], { version: resetDraft.draftVersion }, "branch-publish-2");
    assert.equal(resetPublished.publishedVersion, 2);

    workItemId = (await database.createWorkItem(actor, { branchId: actor.branchIds[0], summary: "Settings snapshot job" }, "settings-work-item")).body.workItem.id;
    const snapshot = await service.snapshot(actor, workItemId, actor.branchIds[0], "snapshot-1");
    assert.equal(snapshot.values.defaultLaborRateMinor, 175000); assert.equal(snapshot.values.defaultJobDurationMinutes, 60);
    const nextDraft = await service.save(actor, undefined, { version: tenantPublished.draftVersion, values: { ...tenantPublished.effective, defaultLaborRateMinor: 225000 } });
    await service.publish(actor, undefined, { version: nextDraft.draftVersion }, "tenant-publish-2");
    assert.equal((await service.snapshot(actor, workItemId, actor.branchIds[0], "snapshot-existing")).values.defaultLaborRateMinor, 175000);
    await assert.rejects(() => service.save(viewer, actor.branchIds[0], { version: 1, values: {} }), (error: any) => error.code === "PERMISSION_DENIED");
    await assert.rejects(() => service.get(actor, "50000000-0000-4000-8000-000000000012"), (error: any) => error.code === "BRANCH_FORBIDDEN");
  } finally { await database.close(); }

  const immutable = new Client({ connectionString: adminUrl }); await immutable.connect();
  try {
    await assert.rejects(() => immutable.query("UPDATE workshopos.business_settings_version SET values='{}' WHERE tenant_id='50000000-0000-4000-8000-000000000001'"), /immutable/);
    await assert.rejects(() => immutable.query("DELETE FROM workshopos.work_item_settings_snapshot WHERE work_item_id=$1", [workItemId]), /immutable/);
    await assert.rejects(() => immutable.query(`INSERT INTO workshopos.work_item_settings_snapshot
      (work_item_id,tenant_id,branch_id,tenant_version,values,captured_by_membership_id)
      VALUES('50000000-0000-4000-8000-000000000041','50000000-0000-4000-8000-000000000001','50000000-0000-4000-8000-000000000011',1,
      '{"defaultLaborRateMinor":1,"defaultJobDurationMinutes":60,"customerUpdatesEnabled":true,"invoiceFooter":"x"}',
      '50000000-0000-4000-8000-000000000031')`), /foreign key/);
    const versions = await immutable.query<{ version: string }>("SELECT version::text FROM workshopos.business_settings_version WHERE tenant_id='50000000-0000-4000-8000-000000000001' AND branch_id IS NULL ORDER BY version");
    assert.deepEqual(versions.rows.map((row) => Number(row.version)), [1, 2]);
  } finally { await immutable.end(); }
});
