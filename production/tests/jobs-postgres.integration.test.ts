import assert from "node:assert/strict";
import test from "node:test";
import { Client } from "pg";

import { PostgresVertical, type Membership } from "../local/database.js";

const adminUrl = process.env.JOBS_TEST_ADMIN_URL;
const appUrl = process.env.JOBS_TEST_APP_URL;

test("PostgreSQL Job List uses Visit date, canonical lifecycle, immutable settings, and final documents", { skip: !adminUrl || !appUrl ? "isolated PostgreSQL URLs not supplied" : false }, async () => {
  const tenant = "90000000-0000-4000-8000-000000000001";
  const branch = "90000000-0000-4000-8000-000000000011";
  const otherBranch = "90000000-0000-4000-8000-000000000012";
  const member = "90000000-0000-4000-8000-000000000101";
  const otherMember = "90000000-0000-4000-8000-000000000102";
  const customer = "90000000-0000-4000-8000-000000000201";
  const vehicle = "90000000-0000-4000-8000-000000000202";
  const visit = "90000000-0000-4000-8000-000000000203";
  const job = "90000000-0000-4000-8000-000000000204";
  const receipt = "90000000-0000-4000-8000-000000000205";
  const validDocument = "90000000-0000-4000-8000-000000000206";
  const draftDocument = "90000000-0000-4000-8000-000000000207";
  const seed = new Client({ connectionString: adminUrl }); await seed.connect();
  try {
    await seed.query("INSERT INTO workshopos.tenant(tenant_id,legal_name,plan_id,entitlements,quotas,base_currency,timezone,configuration_template_id) VALUES($1,'Job Workshop','pilot','[]','{}','INR','Asia/Kolkata','india-v1')", [tenant]);
    await seed.query("INSERT INTO workshopos.branch(id,tenant_id,name) VALUES($2,$1,'Delhi'),($3,$1,'Jaipur')", [tenant, branch, otherBranch]);
    await seed.query("INSERT INTO workshopos.membership(id,tenant_id,identity_subject,email,display_name,status,cognito_username,active) VALUES($2,$1,'job-user','job-user@test.invalid','Job User','ACTIVE','job-user@test.invalid',true),($3,$1,'other-job-user','other-job-user@test.invalid','Other Job User','ACTIVE','other-job-user@test.invalid',true)", [tenant, member, otherMember]);
    await seed.query("INSERT INTO workshopos.customer(id,tenant_id,branch_id,display_name) VALUES($3,$1,$2,'Asha Rao')", [tenant, branch, customer]);
    await seed.query("INSERT INTO workshopos.vehicle(id,tenant_id,branch_id,registration,normalized_registration,attributes) VALUES($3,$1,$2,'DL 01 AB 1234','DL01AB1234','{\"make\":\"Honda\",\"model\":\"City\"}')", [tenant, branch, vehicle]);
    await seed.query("INSERT INTO workshopos.reception_visit(id,tenant_id,branch_id,customer_id,vehicle_id,advisor_identity_id,odometer_km,fuel_level_eighths,key_count,customer_request,promised_handoff_at,reception_configuration_version_id,checked_in_at) VALUES($3,$1,$2,$4,$5,'job-user',42000,4,1,'Annual service',transaction_timestamp()+interval '4 hours',gen_random_uuid(),transaction_timestamp())", [tenant, branch, visit, customer, vehicle]);
    await seed.query("INSERT INTO workshopos.reception_job_card(id,tenant_id,branch_id,visit_id,customer_id,vehicle_id,advisor_identity_id,customer_request,promised_handoff_at,status) VALUES($3,$1,$2,$4,$5,$6,'job-user','Annual service',transaction_timestamp()+interval '4 hours','DRAFT')", [tenant, branch, job, visit, customer, vehicle]);
    await seed.query("INSERT INTO workshopos.business_settings_version(id,tenant_id,scope_key,version,values,published_by_membership_id) VALUES(gen_random_uuid(),$1,'00000000-0000-0000-0000-000000000000',1,'{\"defaultLaborRateMinor\":75000,\"defaultJobDurationMinutes\":120,\"customerUpdatesEnabled\":true,\"invoiceFooter\":\"v1\"}',$2)", [tenant, member]);
    await seed.query("SELECT set_config('app.subject_id','job-user',false)");
    await seed.query("INSERT INTO workshopos.lifecycle_resources(id,tenant_id,branch_id,resource_type,stage,resource_version) VALUES($1,$2,$3,'JOB','ACTIVE',1)", [job, tenant, branch]);
    await seed.query("INSERT INTO workshopos.financial_event(tenant_id,branch_id,id,event_kind,customer_id,visit_id,job_id,payer_id,currency,amount_minor,payment_mode,external_reference,evidence_ref,occurred_at,actor_membership_id,audit_reference) VALUES($1,$2,$3,'PAYMENT_RECEIPT',$4,$5,$6,$4,'INR',10000,'UPI','job-test-receipt','private/test/receipt',transaction_timestamp(),$7,gen_random_uuid())", [tenant, branch, receipt, customer, visit, job, member]);
    await seed.query("INSERT INTO workshopos.rendered_document(tenant_id,branch_id,id,document_type,source_id,public_reference,template_version,artifacts,private_object_ref,content_sha256,rendered_at,audit_reference) VALUES($1,$2,$4,'RECEIPT',$3,'RCPT-TEST-001',1,'[]','private/test/receipt.pdf',repeat('a',64),transaction_timestamp(),gen_random_uuid()),($1,$2,$5,'RECEIPT',gen_random_uuid(),'RCPT-DRAFT-001',1,'[]','private/test/draft.pdf',repeat('b',64),transaction_timestamp(),gen_random_uuid())", [tenant, branch, receipt, validDocument, draftDocument]);
    await seed.query("INSERT INTO workshopos.job_document_content(tenant_id,branch_id,document_id,content,mime_type,filename) VALUES($1,$2,$3,decode('255044462d312e340a','hex'),'application/pdf','receipt.pdf'),($1,$2,$4,decode('255044462d312e340a','hex'),'application/pdf','draft.pdf')", [tenant, branch, validDocument, draftDocument]);
  } finally { await seed.end(); }

  const actor: Membership = { id: member, subject: "job-user", tenantId: tenant, branchIds: [branch], permissions: [] };
  const denied: Membership = { id: otherMember, subject: "other-job-user", tenantId: tenant, branchIds: [otherBranch], permissions: [] };
  const database = new PostgresVertical(appUrl);
  try {
    const result = await database.queryJobs(actor, { search: "Asha", branchId: "", visitDate: "", stage: "ACTIVE", sort: "visitDate.desc", page: 1, pageSize: 25 });
    assert.equal(result.jobs.length, 1); assert.equal(result.jobs[0].statusLabel, "In Progress"); assert.equal(result.jobs[0].settingsSnapshotCaptured, true);
    assert.deepEqual(result.jobs[0].documents.map(item => item.id), [validDocument]);
    assert.equal((await database.getJob(actor, job)).id, job);
    assert.equal((await database.downloadJobDocument(actor, validDocument)).content.subarray(0, 4).toString(), "%PDF");
    await assert.rejects(() => database.downloadJobDocument(actor, draftDocument), (error: any) => error.code === "JOB_DOCUMENT_NOT_FOUND");
    await assert.rejects(() => database.getJob(denied, job), (error: any) => error.code === "JOB_NOT_FOUND");
    const explicitPast = await database.queryJobs(actor, { search: "", branchId: "", visitDate: "2000-01-01", stage: "", sort: "visitDate.desc", page: 1, pageSize: 25 });
    assert.equal(explicitPast.jobs.length, 0);
  } finally { await database.close(); }

  const verify = new Client({ connectionString: adminUrl }); await verify.connect();
  try {
    const snapshot = await verify.query("SELECT tenant_version,values->>'invoiceFooter' footer,capture_source FROM workshopos.job_settings_snapshot WHERE tenant_id=$1 AND branch_id=$2 AND job_id=$3", [tenant, branch, job]);
    assert.deepEqual(snapshot.rows[0], { tenant_version: "1", footer: "v1", capture_source: "LIFECYCLE" });
    await assert.rejects(() => verify.query("DELETE FROM workshopos.job_settings_snapshot WHERE tenant_id=$1", [tenant]), /immutable/);
    await assert.rejects(() => verify.query("DELETE FROM workshopos.rendered_document WHERE tenant_id=$1", [tenant]), /immutable/);
  } finally { await verify.end(); }
});
