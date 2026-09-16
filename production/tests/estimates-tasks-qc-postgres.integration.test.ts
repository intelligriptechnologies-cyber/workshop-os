import assert from "node:assert/strict";
import test from "node:test";
import { Client } from "pg";
import { PostgresVertical, type Membership } from "../local/database.js";

const adminUrl = process.env.OPS_TEST_ADMIN_URL,
  appUrl = process.env.OPS_TEST_APP_URL;
test(
  "PostgreSQL Estimates preserve versions, evidence, canonical lifecycle fact, idempotency and RLS",
  {
    skip:
      !adminUrl || !appUrl ? "isolated PostgreSQL URLs not supplied" : false,
  },
  async () => {
    const tenant = "92000000-0000-4000-8000-000000000001",
      branch = "92000000-0000-4000-8000-000000000011",
      other = "92000000-0000-4000-8000-000000000012",
      member = "92000000-0000-4000-8000-000000000101",
      customer = "92000000-0000-4000-8000-000000000201",
      vehicle = "92000000-0000-4000-8000-000000000202",
      visit = "92000000-0000-4000-8000-000000000203",
      job = "92000000-0000-4000-8000-000000000204";
    const seed = new Client({ connectionString: adminUrl });
    await seed.connect();
    try {
      await seed.query(
        "INSERT INTO workshopos.tenant(tenant_id,legal_name,plan_id,entitlements,quotas,base_currency,timezone,configuration_template_id) VALUES($1,'Ops Workshop','pilot','[]','{}','INR','Asia/Kolkata','india-v1')",
        [tenant],
      );
      await seed.query(
        "INSERT INTO workshopos.branch(id,tenant_id,name) VALUES($2,$1,'Delhi'),($3,$1,'Hidden')",
        [tenant, branch, other],
      );
      await seed.query(
        "INSERT INTO workshopos.membership(id,tenant_id,identity_subject,email,display_name,status,cognito_username,active) VALUES($2,$1,'ops-user','ops@test.invalid','Ops User','ACTIVE','ops@test.invalid',true)",
        [tenant, member],
      );
      await seed.query(
        "INSERT INTO workshopos.customer(id,tenant_id,branch_id,display_name) VALUES($3,$1,$2,'Asha')",
        [tenant, branch, customer],
      );
      await seed.query(
        "INSERT INTO workshopos.vehicle(id,tenant_id,branch_id,registration,normalized_registration,attributes) VALUES($3,$1,$2,'DL 1','DL1','{}')",
        [tenant, branch, vehicle],
      );
      await seed.query(
        "INSERT INTO workshopos.reception_visit(id,tenant_id,branch_id,customer_id,vehicle_id,advisor_identity_id,odometer_km,fuel_level_eighths,key_count,customer_request,promised_handoff_at,reception_configuration_version_id,checked_in_at) VALUES($3,$1,$2,$4,$5,'ops-user',1,1,1,'Service',transaction_timestamp()+interval '1 hour',gen_random_uuid(),transaction_timestamp())",
        [tenant, branch, visit, customer, vehicle],
      );
      await seed.query(
        "INSERT INTO workshopos.reception_job_card(id,tenant_id,branch_id,visit_id,customer_id,vehicle_id,advisor_identity_id,customer_request,promised_handoff_at,status) VALUES($3,$1,$2,$4,$5,$6,'ops-user','Service',transaction_timestamp()+interval '1 hour','DRAFT')",
        [tenant, branch, job, visit, customer, vehicle],
      );
      await seed.query("SELECT set_config('app.subject_id','ops-user',false)");
      await seed.query(
        "INSERT INTO workshopos.lifecycle_resources(id,tenant_id,branch_id,resource_type,stage,resource_version) VALUES($1,$2,$3,'JOB','ESTIMATE',1)",
        [job, tenant, branch],
      );
    } finally {
      await seed.end();
    }
    const actor: Membership = {
        id: member,
        subject: "ops-user",
        tenantId: tenant,
        branchIds: [branch],
      },
      denied: Membership = {
        id: member,
        subject: "ops-user",
        tenantId: tenant,
        branchIds: [other],
      };
    const db = new PostgresVertical(appUrl!);
    let estimateId = "";
    try {
      const created = await db.createEstimateVersion(
        actor,
        {
          branchId: branch,
          jobId: job,
          notes: "Frozen scope",
          totalMinor: "125000",
          validDays: 14,
        },
        "create-estimate",
      );
      estimateId = created.estimate.id;
      assert.equal(created.replay, false);
      assert.equal(
        (
          await db.createEstimateVersion(
            actor,
            {
              branchId: branch,
              jobId: job,
              notes: "Frozen scope",
              totalMinor: "125000",
              validDays: 14,
            },
            "create-estimate",
          )
        ).replay,
        true,
      );
      await assert.rejects(
        () =>
          db.createEstimateVersion(
            actor,
            {
              branchId: branch,
              jobId: job,
              notes: "Different",
              totalMinor: "125000",
              validDays: 14,
            },
            "create-estimate",
          ),
        (e: any) => e.code === "IDEMPOTENCY_KEY_REUSED",
      );
      const edited = await db.updateEstimateDraft(
        actor,
        estimateId,
        { version: 1, notes: "Edited draft scope", totalMinor: "130000" },
        "edit-estimate",
      );
      assert.equal(edited.estimate.version, 2);
      assert.equal(edited.estimate.totalMinor, "130000");
      await assert.rejects(
        () =>
          db.updateEstimateDraft(
            actor,
            estimateId,
            { version: 1, notes: "Stale", totalMinor: "1" },
            "stale-edit-estimate",
          ),
        (e: any) => e.code === "VERSION_CONFLICT",
      );
      const sent = await db.submitEstimate(
        actor,
        estimateId,
        { version: 2, validDays: 14 },
        "submit-estimate",
      );
      assert.equal(sent.estimate.status, "SENT");
      const estimateDocument = (await db.getJob(actor, job)).documents.find(
        (document) => document.type === "ESTIMATE",
      );
      assert.ok(estimateDocument);
      assert.equal(estimateDocument.label, sent.estimate.documentNumber);
      const downloaded = await db.downloadJobDocument(actor, estimateDocument.id);
      assert.equal(downloaded.mimeType, "application/pdf");
      assert.match(downloaded.filename, /-v1\.pdf$/);
      assert.ok(downloaded.content.byteLength > 500);
      const approved = await db.approveEstimate(
        actor,
        estimateId,
        {
          version: 3,
          customerName: "Asha",
          acknowledgement: "Signed approval",
        },
        "approve-estimate",
      );
      assert.equal(approved.estimate.approval?.evidence.customerName, "Asha");
      assert.equal(
        (await db.getJobLifecycle(actor, job)).facts.estimateApproved,
        true,
      );
      assert.equal((await db.queryEstimates(denied)).estimates.length, 0);
      await assert.rejects(
        () =>
          db.submitEstimate(
            actor,
            estimateId,
            { version: 2, validDays: 14 },
            "stale-submit",
          ),
        (e: any) => e.code === "ESTIMATE_NOT_DRAFT",
      );
    } finally {
      await db.close();
    }
    const verify = new Client({ connectionString: adminUrl });
    await verify.connect();
    try {
      const facts = await verify.query(
        "SELECT evidence FROM workshopos.job_lifecycle_fact WHERE job_id=$1 AND fact_kind='ESTIMATE_APPROVED'",
        [job],
      );
      assert.equal(facts.rowCount, 1);
      assert.equal(facts.rows[0].evidence.estimateVersionId, estimateId);
      const documents = await verify.query(
        `SELECT d.document_type,d.source_id,d.content_sha256,octet_length(c.content) byte_length
         FROM workshopos.rendered_document d
         JOIN workshopos.job_document_content c
           ON c.tenant_id=d.tenant_id AND c.branch_id=d.branch_id AND c.document_id=d.id
         WHERE d.source_id=$1`,
        [estimateId],
      );
      assert.equal(documents.rowCount, 1);
      assert.equal(documents.rows[0].document_type, "ESTIMATE");
      assert.match(documents.rows[0].content_sha256, /^[0-9a-f]{64}$/);
      assert.ok(Number(documents.rows[0].byte_length) > 500);
      const outbox = await verify.query(
        "SELECT event_type,payload FROM workshopos.estimate_outbox WHERE payload->>'estimateVersionId'=$1 ORDER BY event_type",
        [estimateId],
      );
      assert.deepEqual(
        outbox.rows.map((row) => row.event_type),
        ["APPROVED_SCOPE_MATERIAL_CONTROL", "APPROVED_SCOPE_WORK_PLANNING"],
      );
      assert.ok(
        outbox.rows.every(
          (row) =>
            row.payload.jobId === job &&
            row.payload.approvedLineIds.length === 1 &&
            row.payload.configurationSnapshot.POLICY.version === 1,
        ),
      );
      await assert.rejects(
        () =>
          verify.query(
            "UPDATE workshopos.estimate_version SET notes='rewritten' WHERE id=$1",
            [estimateId],
          ),
        /immutable/,
      );
    } finally {
      await verify.end();
    }
  },
);
