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

    INSERT INTO workshopos.branch(id,tenant_id,name) VALUES
      ('00000000-0000-4000-8000-000000000011','00000000-0000-4000-8000-000000000001','Delhi'),
      ('00000000-0000-4000-8000-000000000012','00000000-0000-4000-8000-000000000001','Jaipur')
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO workshopos.role_template(id,tenant_id,name,permissions,system_template) VALUES
      ('00000000-0000-4000-8000-000000000301','00000000-0000-4000-8000-000000000001','Business Owner/Admin','["admin.users.page","membership.manage","admin.roles.page","role.manage","work-items.page","work-item.read","work-item.manage","work-item.export","global-search.page","global-search.use"]',true),
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
  `);
  await client.query("COMMIT");
  console.log("local demo tenant administrator ready");
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  await client.end();
}
