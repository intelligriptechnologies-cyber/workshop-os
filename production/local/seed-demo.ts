import { Client } from "pg";

if (process.env.ALLOW_DEMO_LOGIN !== "true") {
  console.log("local demo seed skipped");
  process.exit(0);
}

const adminUrl = process.env.DATABASE_ADMIN_URL;
if (!adminUrl) throw new Error("DATABASE_ADMIN_URL is required");

const client = new Client({ connectionString: adminUrl });
await client.connect();
try {
  await client.query("BEGIN");
  await client.query(`
    INSERT INTO workshopos.tenant(tenant_id,legal_name,plan_id,entitlements,quotas,base_currency,timezone,configuration_template_id)
    VALUES('00000000-0000-4000-8000-000000000001','WorkshopOS Local North','local-demo','[]','{"users":100}','INR','Asia/Kolkata','india-v1')
    ON CONFLICT (tenant_id) DO NOTHING;

    INSERT INTO workshopos.secure_media_quota(tenant_id,quota_bytes)
    VALUES('00000000-0000-4000-8000-000000000001',1073741824)
    ON CONFLICT (tenant_id) DO NOTHING;

    INSERT INTO workshopos.branch(id,tenant_id,name) VALUES
      ('00000000-0000-4000-8000-000000000011','00000000-0000-4000-8000-000000000001','Delhi'),
      ('00000000-0000-4000-8000-000000000012','00000000-0000-4000-8000-000000000001','Jaipur')
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO workshopos.role_template(id,tenant_id,name,permissions,system_template) VALUES
      ('00000000-0000-4000-8000-000000000301','00000000-0000-4000-8000-000000000001','Business Owner/Admin','["admin.users.page","membership.manage","admin.roles.page","role.manage","business-settings.page","business-settings.manage","customers.page","customer.read","customer.manage","customer.export","vehicles.page","vehicle.read","vehicle.manage","vehicle.export","inventory.page","inventory.read","inventory.operate","inventory.export","inventory.import","jobs.page","job.read","job.lifecycle.manage","job.estimate-approval.record","job.work-acceptance.record","job.payment-clearance.record","job.document.download","job.export","data-flow.page","job.data-flow.read","media.page","media.read","media.upload","media.archive","media.download","estimates.page","estimate.read","estimate.manage","estimate.submit","estimate.approve","estimate.document.download","tasks.page","task.read","task.assign","task.execute","task.evidence.write","qc.page","qc.read","qc.inspect","rework.assign","rework.execute","work-items.page","work-item.read","work-item.manage","work-item.export","global-search.page","global-search.use"]',true),
      ('00000000-0000-4000-8000-000000000302','00000000-0000-4000-8000-000000000001','Service Advisor','["visit.view"]',true),
      ('00000000-0000-4000-8000-000000000303','00000000-0000-4000-8000-000000000001','User Administrator','["admin.users.page","membership.manage","global-search.page","global-search.use"]',true)
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO workshopos.membership(id,tenant_id,identity_subject,email,display_name,status,cognito_username,active)
    VALUES('00000000-0000-4000-8000-000000000103','00000000-0000-4000-8000-000000000001','local-north-admin','local-admin@workshopos.test','Local Admin','ACTIVE','local-admin@workshopos.test',true)
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO workshopos.membership(id,tenant_id,identity_subject,email,display_name,status,cognito_username,active)
    VALUES('00000000-0000-4000-8000-000000000104','00000000-0000-4000-8000-000000000001','local-north-users-admin','local-users-admin@workshopos.test','Local Users Admin','ACTIVE','local-users-admin@workshopos.test',true)
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO workshopos.membership_role(tenant_id,membership_id,role_id)
    VALUES('00000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000103','00000000-0000-4000-8000-000000000301')
    ON CONFLICT DO NOTHING;

    INSERT INTO workshopos.membership_role(tenant_id,membership_id,role_id)
    VALUES('00000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000104','00000000-0000-4000-8000-000000000303')
    ON CONFLICT DO NOTHING;

    INSERT INTO workshopos.membership_branch(tenant_id,membership_id,branch_id) VALUES
      ('00000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000103','00000000-0000-4000-8000-000000000011'),
      ('00000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000103','00000000-0000-4000-8000-000000000012'),
      ('00000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000104','00000000-0000-4000-8000-000000000011')
    ON CONFLICT DO NOTHING;

    INSERT INTO workshopos.inventory_warehouse(tenant_id,branch_id,id,name) VALUES
      ('00000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000011','00000000-0000-4000-8000-000000000501','MAIN'),
      ('00000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000012','00000000-0000-4000-8000-000000000502','MAIN')
    ON CONFLICT DO NOTHING;

    INSERT INTO workshopos.membership_inventory_warehouse(tenant_id,membership_id,branch_id,warehouse_id) VALUES
      ('00000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000103','00000000-0000-4000-8000-000000000011','00000000-0000-4000-8000-000000000501'),
      ('00000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000103','00000000-0000-4000-8000-000000000012','00000000-0000-4000-8000-000000000502')
    ON CONFLICT DO NOTHING;

    INSERT INTO workshopos.inventory_item(tenant_id,branch_id,id,category_id,sku,base_uom,stock_uom,purchase_uom,issue_uom,costing_method,tax_code,reorder_point,tracking) VALUES
      ('00000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000011','00000000-0000-4000-8000-000000000601','00000000-0000-4000-8000-000000000701','OIL-5W30','ML','ML','ML','ML','MOVING_AVERAGE','GST18',5000,'NONE'),
      ('00000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000011','00000000-0000-4000-8000-000000000602','00000000-0000-4000-8000-000000000702','FILTER-A1','EA','EA','EA','EA','MOVING_AVERAGE','GST18',5,'NONE')
    ON CONFLICT DO NOTHING;

    INSERT INTO workshopos.business_settings_version(id,tenant_id,scope_key,version,values,published_by_membership_id)
    VALUES('00000000-0000-4000-8000-000000000801','00000000-0000-4000-8000-000000000001','00000000-0000-0000-0000-000000000000',1,
      '{"defaultLaborRateMinor":75000,"defaultJobDurationMinutes":120,"customerUpdatesEnabled":true,"invoiceFooter":"Thank you"}',
      '00000000-0000-4000-8000-000000000103')
    ON CONFLICT (tenant_id,scope_key,version) DO NOTHING;

    INSERT INTO workshopos.customer(id,tenant_id,branch_id,display_name)
    VALUES('00000000-0000-4000-8000-000000000901','00000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000011','Asha Rao')
    ON CONFLICT DO NOTHING;
    INSERT INTO workshopos.vehicle(id,tenant_id,branch_id,registration,normalized_registration,attributes)
    VALUES('00000000-0000-4000-8000-000000000902','00000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000011','DL 01 AB 1234','DL01AB1234','{"make":"Honda","model":"City"}')
    ON CONFLICT DO NOTHING;
    INSERT INTO workshopos.reception_visit(id,tenant_id,branch_id,customer_id,vehicle_id,advisor_identity_id,odometer_km,fuel_level_eighths,key_count,customer_request,promised_handoff_at,reception_configuration_version_id,checked_in_at)
    VALUES('00000000-0000-4000-8000-000000000903','00000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000011','00000000-0000-4000-8000-000000000901','00000000-0000-4000-8000-000000000902','local-north-admin',42000,4,1,'Annual service',transaction_timestamp()+interval '4 hours','00000000-0000-4000-8000-000000000904',transaction_timestamp())
    ON CONFLICT DO NOTHING;
    INSERT INTO workshopos.reception_job_card(id,tenant_id,branch_id,visit_id,customer_id,vehicle_id,advisor_identity_id,customer_request,promised_handoff_at,status)
    VALUES('00000000-0000-4000-8000-000000000905','00000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000011','00000000-0000-4000-8000-000000000903','00000000-0000-4000-8000-000000000901','00000000-0000-4000-8000-000000000902','local-north-admin','Annual service',transaction_timestamp()+interval '4 hours','DRAFT')
    ON CONFLICT DO NOTHING;
    SELECT set_config('app.subject_id','local-north-admin',true);
    INSERT INTO workshopos.lifecycle_resources(id,tenant_id,branch_id,resource_type,stage,resource_version)
    VALUES('00000000-0000-4000-8000-000000000905','00000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000011','JOB','ACTIVE',1)
    ON CONFLICT DO NOTHING;

    INSERT INTO workshopos.financial_event(tenant_id,branch_id,id,event_kind,customer_id,visit_id,job_id,payer_id,currency,amount_minor,payment_mode,external_reference,evidence_ref,occurred_at,actor_membership_id,audit_reference)
    VALUES('00000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000011','00000000-0000-4000-8000-000000000906','PAYMENT_RECEIPT','00000000-0000-4000-8000-000000000901','00000000-0000-4000-8000-000000000903','00000000-0000-4000-8000-000000000905','00000000-0000-4000-8000-000000000901','INR',10000,'UPI','local-job-receipt','private/local/finance/receipt',transaction_timestamp(),'00000000-0000-4000-8000-000000000103','00000000-0000-4000-8000-000000000907')
    ON CONFLICT DO NOTHING;
    INSERT INTO workshopos.rendered_document(tenant_id,branch_id,id,document_type,source_id,public_reference,template_version,artifacts,private_object_ref,content_sha256,rendered_at,audit_reference)
    VALUES('00000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000011','00000000-0000-4000-8000-000000000908','RECEIPT','00000000-0000-4000-8000-000000000906','RCPT-LOCAL-001',1,'[]','private/local/finance/receipt.pdf',repeat('a',64),transaction_timestamp(),'00000000-0000-4000-8000-000000000909')
    ON CONFLICT DO NOTHING;
    INSERT INTO workshopos.job_document_content(tenant_id,branch_id,document_id,content,mime_type,filename)
    VALUES('00000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000011','00000000-0000-4000-8000-000000000908',decode('255044462d312e340a','hex'),'application/pdf','receipt-RCPT-LOCAL-001.pdf')
    ON CONFLICT DO NOTHING;
  `);
  await client.query("COMMIT");
  console.log("local demo tenant administrator ready");
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  await client.end();
}
