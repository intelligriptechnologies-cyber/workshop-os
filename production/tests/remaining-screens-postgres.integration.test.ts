import assert from "node:assert/strict";
import test from "node:test";

import { Client } from "pg";

import { PostgresVertical, type Membership } from "../local/database.js";
import {
  createRemainingScreenExportArtifact,
  REMAINING_SCREEN_KEYS,
} from "../src/remaining-screens.js";

const adminUrl = process.env.REMAINING_SCREENS_TEST_ADMIN_URL;
const appUrl = process.env.REMAINING_SCREENS_TEST_APP_URL;

test(
  "PostgreSQL remaining screens are scoped, paged, commandable, and completely exportable",
  { skip: !adminUrl || !appUrl ? "isolated PostgreSQL URLs not supplied" : false },
  async () => {
    const tenant = "94000000-0000-4000-8000-000000000001";
    const branch = "94000000-0000-4000-8000-000000000011";
    const hidden = "94000000-0000-4000-8000-000000000012";
    const member = "94000000-0000-4000-8000-000000000101";
    const customer = "94000000-0000-4000-8000-000000000201";
    const vehicle = "94000000-0000-4000-8000-000000000202";
    const visit = "94000000-0000-4000-8000-000000000203";
    const job = "94000000-0000-4000-8000-000000000204";
    const followUp = "94000000-0000-4000-8000-000000000205";
    const warehouse = "94000000-0000-4000-8000-000000000206";
    const hiddenWarehouse = "94000000-0000-4000-8000-000000000207";
    const seed = new Client({ connectionString: adminUrl });
    await seed.connect();
    try {
      await seed.query(
        "INSERT INTO workshopos.tenant(tenant_id,legal_name,plan_id,entitlements,quotas,base_currency,timezone,configuration_template_id) VALUES($1,'Remaining Workshop','pilot','[]','{}','INR','Asia/Kolkata','india-v1')",
        [tenant],
      );
      await seed.query(
        "INSERT INTO workshopos.branch(id,tenant_id,name) VALUES($1,$3,'Visible'),($2,$3,'Hidden')",
        [branch, hidden, tenant],
      );
      await seed.query(
        "INSERT INTO workshopos.membership(id,tenant_id,identity_subject,email,display_name,status,cognito_username,active) VALUES($1,$2,'remaining-user','remaining@test.invalid','Remaining User','ACTIVE','remaining-user',true)",
        [member, tenant],
      );
      await seed.query(
        "INSERT INTO workshopos.customer(id,tenant_id,branch_id,display_name) VALUES($1,$2,$3,'Asha')",
        [customer, tenant, branch],
      );
      await seed.query(
        "INSERT INTO workshopos.vehicle(id,tenant_id,branch_id,registration,normalized_registration,attributes) VALUES($1,$2,$3,'DL 1 AB 1','DL1AB1','{}')",
        [vehicle, tenant, branch],
      );
      await seed.query(
        "INSERT INTO workshopos.reception_visit(id,tenant_id,branch_id,customer_id,vehicle_id,advisor_identity_id,odometer_km,fuel_level_eighths,key_count,customer_request,promised_handoff_at,reception_configuration_version_id,checked_in_at) VALUES($1,$2,$3,$4,$5,'remaining-user',1,1,1,'Service',transaction_timestamp()+interval '1 hour',gen_random_uuid(),transaction_timestamp())",
        [visit, tenant, branch, customer, vehicle],
      );
      await seed.query(
        "INSERT INTO workshopos.reception_job_card(id,tenant_id,branch_id,visit_id,customer_id,vehicle_id,advisor_identity_id,customer_request,promised_handoff_at,status) VALUES($1,$2,$3,$4,$5,$6,'remaining-user','Service',transaction_timestamp()+interval '1 hour','DRAFT')",
        [job, tenant, branch, visit, customer, vehicle],
      );
      await seed.query(
        "INSERT INTO workshopos.advisor_follow_up(id,tenant_id,branch_id,job_id,owner_identity_id,description,due_at,created_at) VALUES($1,$2,$3,$4,'remaining-user','Call Asha',transaction_timestamp()+interval '1 day',transaction_timestamp())",
        [followUp, tenant, branch, job],
      );
      await seed.query(
        "INSERT INTO workshopos.inventory_warehouse(tenant_id,branch_id,id,name) VALUES($1,$2,$3,'MAIN'),($1,$4,$5,'HIDDEN')",
        [tenant, branch, warehouse, hidden, hiddenWarehouse],
      );
      await seed.query(
        "INSERT INTO workshopos.report_fact(tenant_id,branch_id,id,category,metric_key,metric_value,occurred_at,source_ledger_ref,drill_record,recorded_at) VALUES($1,$2,gen_random_uuid(),'OPERATIONAL','jobs_completed',1,transaction_timestamp(),'remaining:1','{}',transaction_timestamp())",
        [tenant, branch],
      );
      await seed.query(
        "INSERT INTO workshopos.notification_domain_event(tenant_id,branch_id,id,event_type,occurred_at,payload,payload_fingerprint) VALUES($1,$2,'event-1','FOLLOW_UP_DUE',transaction_timestamp(),'{}',repeat('a',64))",
        [tenant, branch],
      );
      await seed.query(
        "INSERT INTO workshopos.action_inbox(tenant_id,branch_id,id,source_event_id,action_key,role_codes,owner_membership_id,priority,title,next_action,href,created_at) VALUES($1,$2,'action-1','event-1','call',ARRAY['ADMIN'],$3,'NORMAL','Call customer','Open follow-up','/production/follow-ups',transaction_timestamp())",
        [tenant, branch, member],
      );
    } finally {
      await seed.end();
    }

    const actor: Membership = {
      id: member,
      subject: "remaining-user",
      tenantId: tenant,
      branchIds: [branch],
      warehouseIds: [warehouse],
    };
    const database = new PostgresVertical(appUrl!);
    try {
      for (const screen of REMAINING_SCREEN_KEYS) {
        const result = await database.queryRemainingScreen(actor, screen, {
          search: "",
          branchId: "",
          sort: "updatedAt.desc",
          page: 1,
          pageSize: 25,
        });
        assert.equal(result.page.pageSize, 25);
        if (screen === "masters")
          assert.ok(result.rows.some((row) => row.title === "MAIN"));
        assert.ok(result.rows.every((row) => row.branchId === branch));
      }

      const filtered = await database.queryRemainingScreen(
        actor,
        "follow-ups",
        {
          search: "Asha",
          branchId: branch,
          sort: "summary.asc",
          page: 1,
          pageSize: 25,
        },
      );
      assert.equal(filtered.page.totalCount, 1);
      const completed = await database.completeRemainingScreenRow(
        actor,
        "follow-ups",
        followUp,
        { version: 1, reason: "Customer reached" },
        "follow-complete",
      );
      assert.equal(completed.row.status, "COMPLETED");
      assert.equal(
        (
          await database.completeRemainingScreenRow(
            actor,
            "follow-ups",
            followUp,
            { version: 1, reason: "Customer reached" },
            "follow-complete",
          )
        ).replay,
        true,
      );
      assert.equal(
        (
          await database.queryRemainingScreen(actor, "follow-ups", {
            ...filtered.query,
            search: "COMPLETED",
          })
        ).rows[0].status,
        "COMPLETED",
      );
      const action = (
        await database.queryRemainingScreen(actor, "action-inbox", {
          search: "Call customer",
          branchId: branch,
          sort: "updatedAt.desc",
          page: 1,
          pageSize: 25,
        })
      ).rows[0];
      assert.equal(action.status, "OPEN");
      assert.equal(
        (
          await database.completeRemainingScreenRow(
            actor,
            "action-inbox",
            action.id,
            { version: action.version, reason: "Customer contact completed" },
            "action-complete",
          )
        ).row.status,
        "COMPLETED",
      );
      assert.equal(
        (
          await database.completeRemainingScreenRow(
            actor,
            "action-inbox",
            action.id,
            { version: action.version, reason: "Customer contact completed" },
            "action-complete",
          )
        ).replay,
        true,
      );

      assert.deepEqual(await database.saveListPreference(actor, "masters", "grid"), {
        viewMode: "grid",
        version: 1,
      });
      const all = await database.queryRemainingScreen(
        actor,
        "masters",
        {
          search: "",
          branchId: "",
          sort: "summary.asc",
          page: 1,
          pageSize: 25,
        },
        true,
      );
      const created = await database.createListExport(
        actor,
        "masters",
        "XLSX",
        all.query,
        "masters-export",
      );
      await database.completeListExport(
        actor,
        created.job.id,
        createRemainingScreenExportArtifact("masters", "XLSX", all.rows),
      );
      assert.equal(
        (await database.getListExport(actor, created.job.id)).rowCount,
        all.page.totalCount,
      );
      assert.equal(
        (await database.downloadListExport(actor, created.job.id)).mimeType,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
    } finally {
      await database.close();
    }
  },
);
