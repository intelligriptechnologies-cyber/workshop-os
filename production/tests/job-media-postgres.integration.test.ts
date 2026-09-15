import assert from "node:assert/strict";
import test from "node:test";
import { Client } from "pg";

import { PostgresVertical, type Membership } from "../local/database.js";

const adminUrl = process.env.MEDIA_TEST_ADMIN_URL,
  appUrl = process.env.MEDIA_TEST_APP_URL;
test(
  "PostgreSQL Job Media enforces Job/date/category, scanner quarantine, private originals, RLS and archive",
  {
    skip:
      !adminUrl || !appUrl ? "isolated PostgreSQL URLs not supplied" : false,
  },
  async () => {
    const tenant = "91000000-0000-4000-8000-000000000001",
      branch = "91000000-0000-4000-8000-000000000011",
      otherBranch = "91000000-0000-4000-8000-000000000012",
      member = "91000000-0000-4000-8000-000000000101",
      otherMember = "91000000-0000-4000-8000-000000000102",
      customer = "91000000-0000-4000-8000-000000000201",
      vehicle = "91000000-0000-4000-8000-000000000202",
      visit = "91000000-0000-4000-8000-000000000203",
      job = "91000000-0000-4000-8000-000000000204";
    const seed = new Client({ connectionString: adminUrl });
    await seed.connect();
    try {
      await seed.query(
        "INSERT INTO workshopos.tenant(tenant_id,legal_name,plan_id,entitlements,quotas,base_currency,timezone,configuration_template_id) VALUES($1,'Media Workshop','pilot','[]','{}','INR','Asia/Kolkata','india-v1')",
        [tenant],
      );
      await seed.query(
        "INSERT INTO workshopos.branch(id,tenant_id,name) VALUES($2,$1,'Delhi'),($3,$1,'Jaipur')",
        [tenant, branch, otherBranch],
      );
      await seed.query(
        "INSERT INTO workshopos.membership(id,tenant_id,identity_subject,email,display_name,status,cognito_username,active) VALUES($2,$1,'media-user','media@test.invalid','Media User','ACTIVE','media@test.invalid',true),($3,$1,'other-media-user','other-media@test.invalid','Other User','ACTIVE','other-media@test.invalid',true)",
        [tenant, member, otherMember],
      );
      await seed.query(
        "INSERT INTO workshopos.customer(id,tenant_id,branch_id,display_name) VALUES($3,$1,$2,'Asha Rao')",
        [tenant, branch, customer],
      );
      await seed.query(
        "INSERT INTO workshopos.vehicle(id,tenant_id,branch_id,registration,normalized_registration,attributes) VALUES($3,$1,$2,'DL 01 AB 1234','DL01AB1234','{}')",
        [tenant, branch, vehicle],
      );
      await seed.query(
        "INSERT INTO workshopos.reception_visit(id,tenant_id,branch_id,customer_id,vehicle_id,advisor_identity_id,odometer_km,fuel_level_eighths,key_count,customer_request,promised_handoff_at,reception_configuration_version_id,checked_in_at) VALUES($3,$1,$2,$4,$5,'media-user',100,4,1,'Media test',transaction_timestamp()+interval '1 hour',gen_random_uuid(),transaction_timestamp())",
        [tenant, branch, visit, customer, vehicle],
      );
      await seed.query(
        "INSERT INTO workshopos.reception_job_card(id,tenant_id,branch_id,visit_id,customer_id,vehicle_id,advisor_identity_id,customer_request,promised_handoff_at,status) VALUES($3,$1,$2,$4,$5,$6,'media-user','Media test',transaction_timestamp()+interval '1 hour','DRAFT')",
        [tenant, branch, job, visit, customer, vehicle],
      );
      await seed.query(
        'INSERT INTO workshopos.business_settings_version(id,tenant_id,scope_key,version,values,published_by_membership_id) VALUES(gen_random_uuid(),$1,\'00000000-0000-0000-0000-000000000000\',1,\'{"defaultLaborRateMinor":75000,"defaultJobDurationMinutes":120,"customerUpdatesEnabled":true,"invoiceFooter":"media"}\',$2)',
        [tenant, member],
      );
      await seed.query(
        "SELECT set_config('app.subject_id','media-user',false)",
      );
      await seed.query(
        "INSERT INTO workshopos.lifecycle_resources(id,tenant_id,branch_id,resource_type,stage,resource_version) VALUES($1,$2,$3,'JOB','ACTIVE',1)",
        [job, tenant, branch],
      );
      await seed.query(
        "INSERT INTO workshopos.secure_media_quota(tenant_id,quota_bytes) VALUES($1,1000000)",
        [tenant],
      );
    } finally {
      await seed.end();
    }
    const actor: Membership = {
        id: member,
        subject: "media-user",
        tenantId: tenant,
        branchIds: [branch],
      },
      denied: Membership = {
        id: otherMember,
        subject: "other-media-user",
        tenantId: tenant,
        branchIds: [otherBranch],
      };
    const database = new PostgresVertical(appUrl);
    let mediaId = "";
    try {
      const today = (
        await database.queryJobMedia(actor, {
          search: "",
          branchId: "",
          visitDate: "",
          jobId: "",
          category: "",
          includeArchived: false,
          page: 1,
          pageSize: 25,
        })
      ).query.visitDate;
      const choices = await database.mediaJobs(actor, {
        visitDate: today,
        search: "Asha",
      });
      assert.deepEqual(
        choices.jobs.map((item) => item.id),
        [job],
      );
      assert.deepEqual(choices.jobs[0].allowedCategories, ["PROGRESS"]);
      assert.equal(
        (await database.mediaJobs(denied, { visitDate: today, search: "" }))
          .jobs.length,
        0,
      );
      const input = {
        jobId: job,
        branchId: branch,
        category: "PROGRESS" as const,
        label: "Engine running",
        fileName: "engine.png",
        mimeType: "image/png",
        byteLength: 8,
        checksumSha256: "a".repeat(64),
        thumbnail: Buffer.from("thumbnail"),
      };
      const created = await database.createJobMedia(
        actor,
        input,
        "media-create",
      );
      mediaId = created.media.id;
      assert.equal(created.media.scanStatus, "PENDING");
      assert.equal(created.media.available, false);
      assert.equal(
        (await database.createJobMedia(actor, input, "media-create")).replay,
        true,
      );
      await assert.rejects(
        () =>
          database.createJobMedia(
            actor,
            { ...input, category: "BEFORE" },
            "before-active",
          ),
        (error: any) => error.code === "MEDIA_CATEGORY_STAGE_INVALID",
      );
      await assert.rejects(
        () => database.authorizeJobMediaAccess(actor, mediaId),
        (error: any) => error.code === "MEDIA_NOT_AVAILABLE",
      );
      const untrusted = new Client({ connectionString: appUrl });
      await untrusted.connect();
      try {
        await untrusted.query("BEGIN");
        await untrusted.query(
          "SELECT set_config('app.tenant_id',$1,true),set_config('app.branch_ids',$2,true)",
          [tenant, branch],
        );
        const genericReservation = await untrusted.query(
          "SELECT workshopos.reserve_secure_media_upload($1,$2,$3,$4,$5,$6) id",
          [
            branch,
            "non-job-evidence.png",
            "image/png",
            5,
            "b".repeat(64),
            member,
          ],
        );
        assert.ok(genericReservation.rows[0].id);
        await assert.rejects(
          () =>
            untrusted.query(
              "UPDATE workshopos.secure_media_object SET scan_status='CLEAN' WHERE media_id=$1",
              [mediaId],
            ),
          /scanner authority/i,
        );
        await untrusted.query("ROLLBACK");
      } finally {
        await untrusted.end();
      }
      await database.recordJobMediaScan(
        actor,
        mediaId,
        "CLEAN",
        "scanner:test:1",
      );
      const available = await database.authorizeJobMediaAccess(actor, mediaId);
      assert.match(
        available.objectKey,
        new RegExp(`^private/${tenant}/${branch}/media/`),
      );
      await assert.rejects(
        () => database.authorizeJobMediaAccess(denied, mediaId),
        (error: any) => error.code === "MEDIA_NOT_AVAILABLE",
      );
      const listed = await database.queryJobMedia(actor, {
        search: "Engine",
        branchId: "",
        visitDate: today,
        jobId: job,
        category: "PROGRESS",
        includeArchived: false,
        page: 1,
        pageSize: 25,
      });
      assert.equal(listed.media[0].available, true);
      assert.match(listed.media[0].thumbnailDataUrl, /^data:image\/png;base64/);
      const archived = await database.archiveJobMedia(
        actor,
        mediaId,
        { version: 2, reason: "Duplicate angle" },
        "media-archive",
      );
      assert.equal(archived.archived, true);
      await assert.rejects(
        () => database.authorizeJobMediaAccess(actor, mediaId),
        (error: any) => error.code === "MEDIA_NOT_AVAILABLE",
      );
      assert.equal(
        (
          await database.queryJobMedia(actor, {
            ...listed.query,
            includeArchived: true,
          })
        ).media[0].archived,
        true,
      );
      const upstream = new Client({ connectionString: adminUrl });
      await upstream.connect();
      try {
        await upstream.query(
          "UPDATE workshopos.lifecycle_resources SET stage='QC' WHERE id=$1",
          [job],
        );
      } finally {
        await upstream.end();
      }
      assert.equal(
        (
          await database.createJobMedia(
            actor,
            { ...input, category: "AFTER", label: "QC complete" },
            "after-qc",
          )
        ).media.category,
        "AFTER",
      );
    } finally {
      await database.close();
    }
    const verify = new Client({ connectionString: adminUrl });
    await verify.connect();
    try {
      const columns = await verify.query(
        "SELECT column_name FROM information_schema.columns WHERE table_schema='workshopos' AND table_name='secure_media_object'",
      );
      assert.equal(
        columns.rows.some((row) =>
          /content|original_bytes/.test(row.column_name),
        ),
        false,
      );
      const stored = await verify.query(
        "SELECT octet_length(thumbnail_bytes) thumbnail_size,archive_reason FROM workshopos.secure_media_object WHERE media_id=$1",
        [mediaId],
      );
      assert.deepEqual(stored.rows[0], {
        thumbnail_size: 9,
        archive_reason: "Duplicate angle",
      });
      await assert.rejects(
        () =>
          verify.query(
            "DELETE FROM workshopos.secure_media_object WHERE media_id=$1",
            [mediaId],
          ),
        /hard deleted/,
      );
    } finally {
      await verify.end();
    }
  },
);
