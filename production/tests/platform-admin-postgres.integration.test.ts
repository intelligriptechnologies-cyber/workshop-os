import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import test from "node:test";
import { Client } from "pg";
import { PlatformDatabase } from "../local/platform-database.js";

const adminUrl=process.env.PLATFORM_ADMIN_TEST_ADMIN_URL,appUrl=process.env.PLATFORM_ADMIN_TEST_APP_URL;
test("PostgreSQL platform workspace enforces approved grants, exact emulation, retention and dual attribution",{skip:!adminUrl||!appUrl?"isolated PostgreSQL URLs not supplied":false},async()=>{
  const tenant=randomUUID(),branch=randomUUID(),otherBranch=randomUUID(),member=randomUUID(),role=randomUUID(),warehouse=randomUUID();
  const suffix=randomUUID(),adminId=`admin-${suffix}`,approverId=`approver-${suffix}`,supportId=`support-${suffix}`;
  const onlineLog=randomUUID(),recoverableLog=randomUUID(),expiredLog=randomUUID(),onlineBytes=Buffer.from("online\n"),recoverableBytes=Buffer.from("recoverable\n"),expiredBytes=Buffer.from("expired\n");
  const seed=new Client({connectionString:adminUrl});await seed.connect();
  try{await seed.query("BEGIN");await seed.query(`INSERT INTO workshopos.platform_identity(identity_id,display_name,permissions) VALUES($1,'Admin',ARRAY['platform.tenants.read','platform.support.grant','platform.logs.read','platform.logs.download','platform.logs.recover']),($2,'Approver',ARRAY['platform.support.approve','platform.emulation.approve']),($3,'Support',ARRAY['platform.emulation.request','platform.emulation.use'])`,[adminId,approverId,supportId]);
    await seed.query("INSERT INTO workshopos.tenant(tenant_id,legal_name,plan_id,entitlements,quotas,base_currency,timezone,configuration_template_id) VALUES($1,'Platform Test','test','[]','{}','INR','Asia/Kolkata','india-v1')",[tenant]);
    await seed.query("INSERT INTO workshopos.branch(id,tenant_id,name) VALUES($1,$3,'Selected'),($2,$3,'Denied')",[branch,otherBranch,tenant]);
    await seed.query("INSERT INTO workshopos.role_template(id,tenant_id,name,permissions) VALUES($1,$2,'Effective role','[\"work-items.page\",\"work-item.read\"]')",[role,tenant]);
    await seed.query("INSERT INTO workshopos.membership(id,tenant_id,identity_subject,email,display_name,status,cognito_username,active) VALUES($1,$2,$3,$4,'Effective User','ACTIVE',$3,true)",[member,tenant,`effective-${suffix}`,`effective-${suffix}@test.invalid`]);
    await seed.query("INSERT INTO workshopos.membership_role(tenant_id,membership_id,role_id) VALUES($1,$2,$3)",[tenant,member,role]);
    await seed.query("INSERT INTO workshopos.membership_branch(tenant_id,membership_id,branch_id) VALUES($1,$2,$3)",[tenant,member,branch]);
    await seed.query("INSERT INTO workshopos.inventory_warehouse(tenant_id,branch_id,id,name) VALUES($1,$2,$3,'MAIN')",[tenant,branch,warehouse]);
    await seed.query("INSERT INTO workshopos.membership_inventory_warehouse(tenant_id,membership_id,branch_id,warehouse_id) VALUES($1,$2,$3,$4)",[tenant,member,branch,warehouse]);
    const insertLog=async(id:string,days:number,bytes:Buffer)=>seed.query(`INSERT INTO workshopos.platform_daily_log(log_id,log_date,object_key,content,checksum_sha256,online_until,recoverable_until) VALUES($1,current_date+$2::int,$3,$4,$5,current_date+$2::int+interval '30 days',current_date+$2::int+interval '90 days')`,[id,days,`private/test/${id}`,bytes,createHash("sha256").update(bytes).digest("hex")]);await insertLog(onlineLog,0,onlineBytes);await insertLog(recoverableLog,-45,recoverableBytes);await insertLog(expiredLog,-100,expiredBytes);await seed.query("COMMIT");
  }catch(error){await seed.query("ROLLBACK");throw error;}finally{await seed.end();}
  const recent=new Date().toISOString(),admin={identityId:adminId,displayName:"Admin",permissions:["platform.tenants.read","platform.support.grant","platform.logs.read","platform.logs.download","platform.logs.recover"],mfaAuthenticatedAt:recent},approver={identityId:approverId,displayName:"Approver",permissions:["platform.support.approve","platform.emulation.approve"],mfaAuthenticatedAt:recent},support={identityId:supportId,displayName:"Support",permissions:["platform.emulation.request","platform.emulation.use"],mfaAuthenticatedAt:recent};
  const db=new PlatformDatabase(appUrl!);try{
    assert.equal((await db.session(admin)).tenants.some((item:any)=>item.id===tenant),true);
    await assert.rejects(()=>db.requestSupportGrant({...admin,mfaAuthenticatedAt:new Date(Date.now()-16*60_000).toISOString()},{tenantId:tenant,supportIdentityId:supportId,branchIds:[branch],permissions:["tenant.emulate"],reason:"Stale authentication",expiresAt:new Date(Date.now()+60*60_000).toISOString()}),/RECENT_MFA_REQUIRED/);
    const grant=(await db.requestSupportGrant(admin,{tenantId:tenant,supportIdentityId:supportId,branchIds:[branch],permissions:["tenant.emulate"],reason:"Approved support case",expiresAt:new Date(Date.now()+60*60_000).toISOString()})).grant;
    await assert.rejects(()=>db.approveSupportGrant(admin,grant.id,{reason:"self approval"}),/DISTINCT_APPROVER_REQUIRED/);
    assert.equal((await db.approveSupportGrant(approver,grant.id,{reason:"Scope checked"})).grant.status,"ACTIVE");
    await assert.rejects(()=>db.requestEmulation(support,{grantId:grant.id,tenantId:tenant,membershipId:member,branchId:otherBranch,reason:"wrong branch"}),/ACTIVE_SUPPORT_GRANT_REQUIRED/);
    const emulation=(await db.requestEmulation(support,{grantId:grant.id,tenantId:tenant,membershipId:member,branchId:branch,reason:"Investigate reported failure"})).emulation;
    await assert.rejects(()=>db.approveEmulation(support,emulation.id,{reason:"self approval"}),/PLATFORM_PERMISSION_DENIED|DISTINCT_APPROVER_REQUIRED/);
    assert.equal((await db.approveEmulation(approver,emulation.id,{reason:"Identity and scope checked"})).emulation.status,"APPROVED");
    const active=(await db.startEmulation(support,emulation.id)).emulation;assert.equal(Date.parse(active.expiresAt)-Date.parse(active.startedAt),15*60_000);
    const resolved=await db.resolveEmulation(support,emulation.id);assert.ok(resolved);assert.deepEqual(resolved.membership.branchIds,[branch]);assert.deepEqual(resolved.membership.warehouseIds,[warehouse]);assert.deepEqual(resolved.membership.permissions.sort(),["work-item.read","work-items.page"]);assert.ok(!resolved.membership.permissions.some(value=>value.startsWith("platform.")));
    await db.recordEmulatedAction(support,resolved.context,"POST","/api/v1/work-items",undefined,"trace-denied");
    await db.recordEmulatedAction(support,resolved.context,"POST","/api/v1/work-items",403,"trace-denied");
    assert.deepEqual((await db.downloadLog(admin,onlineLog,"Incident evidence","trace-download") as any).content,onlineBytes);
    assert.equal((await db.downloadLog(admin,recoverableLog,"Need archive","trace-before") as any).deniedCode,"LOG_RECOVERY_REQUIRED");
    assert.equal((await db.recoverLog(admin,recoverableLog,"Recovery exercise","trace-recover") as any).recovery.checksumVerified,true);
    assert.deepEqual((await db.downloadLog(admin,recoverableLog,"Recovered evidence","trace-after") as any).content,recoverableBytes);
    await assert.rejects(()=>db.recoverLog(admin,expiredLog,"Expired request","trace-expired"),/LOG_RETENTION_EXPIRED/);
  }finally{await db.close();}
  const verify=new Client({connectionString:adminUrl});await verify.connect();try{
    type ActionRow={phase:"REQUEST"|"RESULT";platform_actor_id:string;effective_membership_id:string;response_status:number|null};
    const actions=(await verify.query<ActionRow>("SELECT phase,platform_actor_id,effective_membership_id,response_status FROM workshopos.platform_emulated_action WHERE trace_id='trace-denied' ORDER BY phase")).rows;
    assert.deepEqual(actions.map(row=>row.phase).sort(),["REQUEST","RESULT"]);
    assert.ok(actions.every(row=>row.platform_actor_id===supportId&&row.effective_membership_id===member));
    assert.equal(actions.find(row=>row.phase==="RESULT")?.response_status,403);
    const grantId=(await verify.query<{support_grant_id:string}>("SELECT support_grant_id FROM workshopos.platform_support_grant WHERE tenant_id=$1 AND status='ACTIVE' LIMIT 1",[tenant])).rows[0].support_grant_id;
    const approvedGrant=(await verify.query<{approval_reason:string;approval_authentication_context:{mfa:boolean};approved_at:Date}>("SELECT approval_reason,approval_authentication_context,approved_at FROM workshopos.platform_support_grant WHERE support_grant_id=$1",[grantId])).rows[0];
    assert.ok(approvedGrant.approval_reason);assert.equal(approvedGrant.approval_authentication_context.mfa,true);assert.ok(approvedGrant.approved_at);
    const audit=await verify.query<{action:string;outcome:string}>("SELECT action,outcome FROM workshopos.platform_log_access_audit WHERE log_id=ANY($1::uuid[]) ORDER BY occurred_at",[[onlineLog,recoverableLog,expiredLog]]);
    assert.ok(audit.rows.some(row=>row.action==="DOWNLOAD"&&row.outcome==="DENIED"));assert.ok(audit.rows.some(row=>row.action==="RECOVERY_EXERCISED"&&row.outcome==="VERIFIED"));assert.ok(audit.rows.some(row=>row.action==="RECOVERY_REQUESTED"&&row.outcome==="DENIED"));
    await assert.rejects(()=>verify.query("UPDATE workshopos.platform_log_recovery SET status='RESTORED' WHERE log_id=$1",[recoverableLog]),/append-only/);
  }finally{await verify.end();}
});
