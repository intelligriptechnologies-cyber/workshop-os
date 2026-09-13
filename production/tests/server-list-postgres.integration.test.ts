import assert from "node:assert/strict";
import test from "node:test";

import { Client } from "pg";
import { PostgresVertical, type Membership } from "../local/database.js";
import { createWorkItemExportArtifact } from "../src/work-item-export.js";

const adminUrl = process.env.WORK_ITEMS_TEST_ADMIN_URL;
const appUrl = process.env.WORK_ITEMS_TEST_APP_URL;

test("PostgreSQL list contract pages, persists private preferences, and exports the complete authorized result", {
  skip: !adminUrl || !appUrl ? "isolated PostgreSQL URLs not supplied" : false,
}, async () => {
  const seed = new Client({ connectionString: adminUrl }); await seed.connect();
  try {
    await seed.query(`
      INSERT INTO workshopos.tenant(tenant_id,legal_name,plan_id,entitlements,quotas,base_currency,timezone,configuration_template_id)
      VALUES('30000000-0000-4000-8000-000000000001','List Workshop','pilot','[]','{}','INR','Asia/Kolkata','india-v1');
      INSERT INTO workshopos.branch(id,tenant_id,name) VALUES
      ('30000000-0000-4000-8000-000000000011','30000000-0000-4000-8000-000000000001','Visible'),
      ('30000000-0000-4000-8000-000000000012','30000000-0000-4000-8000-000000000001','Hidden');
    `);
  } finally { await seed.end(); }
  const visible: Membership = { subject: "list-user-a", tenantId: "30000000-0000-4000-8000-000000000001", branchIds: ["30000000-0000-4000-8000-000000000011"] };
  const other: Membership = { subject: "list-user-b", tenantId: visible.tenantId, branchIds: visible.branchIds };
  const database = new PostgresVertical(appUrl);
  try {
    for (let index = 0; index < 31; index += 1) await database.createWorkItem(visible, { branchId: visible.branchIds[0], summary: `Brake ${String(index).padStart(2, "0")}` }, `list-${index}`);
    const first = await database.queryWorkItems(visible, { search: "Brake", branchId: "", sort: "summary.asc", page: 1, pageSize: 25 });
    const second = await database.queryWorkItems(visible, { ...first.query, page: 2 });
    assert.equal(first.workItems.length, 25); assert.equal(second.workItems.length, 6); assert.equal(first.page.totalCount, 31);
    assert.equal(first.workItems[0].summary, "Brake 00"); assert.equal(second.workItems[5].summary, "Brake 30");

    assert.deepEqual(await database.getListPreference(visible, "work-items"), { viewMode: "table", version: 0 });
    assert.deepEqual(await database.saveListPreference(visible, "work-items", "grid"), { viewMode: "grid", version: 1 });
    assert.deepEqual(await database.getListPreference(other, "work-items"), { viewMode: "table", version: 0 });

    const created = await database.createListExport(visible, "work-items", "XLSX", first.query, "complete-list-1");
    assert.equal(created.job.status, "PENDING");
    const allRows = (await database.queryWorkItems(visible, first.query, true)).workItems;
    await database.completeListExport(visible, created.job.id, createWorkItemExportArtifact("XLSX", allRows));
    assert.equal((await database.getListExport(visible, created.job.id)).rowCount, 31);
    assert.equal((await database.downloadListExport(visible, created.job.id)).mimeType, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    await assert.rejects(() => database.getListExport(other, created.job.id), (error: any) => error.code === "EXPORT_NOT_FOUND");
  } finally { await database.close(); }
});
