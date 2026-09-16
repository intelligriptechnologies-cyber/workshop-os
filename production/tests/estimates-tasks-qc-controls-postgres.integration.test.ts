import assert from "node:assert/strict";
import test from "node:test";
import { Client } from "pg";
import { PostgresVertical, type Membership } from "../local/database.js";

const adminUrl = process.env.OPS_TEST_ADMIN_URL;
const appUrl = process.env.OPS_TEST_APP_URL;

test(
  "PostgreSQL Tasks and QC enforce assignee, clean evidence, lifecycle, independence, rework, and audit controls",
  {
    skip:
      !adminUrl || !appUrl ? "isolated PostgreSQL URLs not supplied" : false,
  },
  async () => {
    const tenant = "93000000-0000-4000-8000-000000000001",
      branch = "93000000-0000-4000-8000-000000000011";
    const techId = "93000000-0000-4000-8000-000000000101",
      inspectorId = "93000000-0000-4000-8000-000000000102";
    const customer = "93000000-0000-4000-8000-000000000201",
      vehicle = "93000000-0000-4000-8000-000000000202",
      visit = "93000000-0000-4000-8000-000000000203",
      job = "93000000-0000-4000-8000-000000000204";
    const stream = "93000000-0000-4000-8000-000000000205",
      estimate = "93000000-0000-4000-8000-000000000206",
      line = "93000000-0000-4000-8000-000000000207",
      outcome = "93000000-0000-4000-8000-000000000208",
      activation = "93000000-0000-4000-8000-000000000209";
    const planningEvent = "93000000-0000-4000-8000-000000000210",
      plan = "93000000-0000-4000-8000-000000000211",
      taskId = "93000000-0000-4000-8000-000000000212",
      assignmentEvent = "93000000-0000-4000-8000-000000000213",
      mediaId = "93000000-0000-4000-8000-000000000215";
    const seed = new Client({ connectionString: adminUrl });
    await seed.connect();
    try {
      const values = [
        tenant,
        branch,
        techId,
        inspectorId,
        customer,
        vehicle,
        visit,
        job,
        stream,
        estimate,
        line,
        outcome,
        activation,
        planningEvent,
        plan,
        taskId,
        assignmentEvent,
        mediaId,
      ];
      const seedSql = `
      INSERT INTO workshopos.tenant(tenant_id,legal_name,plan_id,entitlements,quotas,base_currency,timezone,configuration_template_id) VALUES($1,'Task QC Workshop','pilot','[]','{}','INR','Asia/Kolkata','india-v1');
      INSERT INTO workshopos.branch(id,tenant_id,name) VALUES($2,$1,'Delhi');
      INSERT INTO workshopos.membership(id,tenant_id,identity_subject,email,display_name,status,cognito_username,active) VALUES
        ($3,$1,'task-tech','task-tech@test.invalid','Task Tech','ACTIVE','task-tech@test.invalid',true),
        ($4,$1,'qc-inspector','qc-inspector@test.invalid','QC Inspector','ACTIVE','qc-inspector@test.invalid',true);
      INSERT INTO workshopos.membership_branch(tenant_id,membership_id,branch_id) VALUES($1,$3,$2),($1,$4,$2);
      SELECT set_config('app.subject_id','task-tech',false);
      INSERT INTO workshopos.business_settings_version(id,tenant_id,scope_key,version,values,published_by_membership_id)
        VALUES(gen_random_uuid(),$1,'00000000-0000-0000-0000-000000000000',1,'{"defaultLaborRateMinor":100000,"defaultJobDurationMinutes":60,"customerUpdatesEnabled":true,"invoiceFooter":"Thank you"}',$3);
      INSERT INTO workshopos.customer(id,tenant_id,branch_id,display_name) VALUES($5,$1,$2,'Asha');
      INSERT INTO workshopos.vehicle(id,tenant_id,branch_id,registration,normalized_registration,attributes) VALUES($6,$1,$2,'DL 2','DL2','{}');
      INSERT INTO workshopos.reception_visit(id,tenant_id,branch_id,customer_id,vehicle_id,advisor_identity_id,odometer_km,fuel_level_eighths,key_count,customer_request,promised_handoff_at,reception_configuration_version_id,checked_in_at)
        VALUES($7,$1,$2,$5,$6,'task-tech',1,1,1,'Service',transaction_timestamp()+interval '1 hour',gen_random_uuid(),transaction_timestamp());
      INSERT INTO workshopos.reception_job_card(id,tenant_id,branch_id,visit_id,customer_id,vehicle_id,advisor_identity_id,customer_request,promised_handoff_at,status)
        VALUES($8,$1,$2,$7,$5,$6,'task-tech','Service',transaction_timestamp()+interval '1 hour','DRAFT');
      INSERT INTO workshopos.lifecycle_resources(id,tenant_id,branch_id,resource_type,stage,resource_version) VALUES($8,$1,$2,'JOB','ACTIVE',1);
      INSERT INTO workshopos.estimate_stream(tenant_id,branch_id,id,job_id,kind,scope_handoff_id) VALUES($1,$2,$9,$8,'PRIMARY',gen_random_uuid());
      INSERT INTO workshopos.estimate_version(tenant_id,branch_id,id,estimate_stream_id,revision,configuration_version_id,status,totals,payer_totals,resource_version,created_at,notes)
        VALUES($1,$2,$10,$9,1,'test','APPROVED','{"grandTotalMinor":"1000","currency":"INR"}','[]',1,transaction_timestamp(),'Approved');
      INSERT INTO workshopos.estimate_line(tenant_id,branch_id,estimate_version_id,id,configuration_line_id,scope_code,kind,quantity,unit_price_minor,discount_minor,tax_rate_bps,total_minor,partial_approval_allowed)
        VALUES($1,$2,$10,$11,'line','GENERAL','SERVICE',1,1000,0,0,1000,false);
      INSERT INTO workshopos.estimate_approval_outcome(tenant_id,branch_id,id,estimate_version_id,outcome,selected_line_ids,source,evidence,checker_membership_id,receipt_reference,recorded_at)
        VALUES($1,$2,$12,$10,'APPROVE_ALL',jsonb_build_array($11),'MANUAL','{"signed":true}',$4,'approval',transaction_timestamp());
      INSERT INTO workshopos.estimate_scope_activation(tenant_id,branch_id,id,estimate_version_id,job_id,approval_outcome_id,approved_line_ids,configuration_snapshot,activated_at)
        VALUES($1,$2,$13,$10,$8,$12,jsonb_build_array($11),'{"PRICE":{"version":1},"TAX":{"version":1},"WORKFLOW":{"version":1},"RECIPE":{"version":1},"CHECKLIST":{"version":1},"POLICY":{"version":1}}',transaction_timestamp());
      INSERT INTO workshopos.work_planning_event(tenant_id,branch_id,id,activation_id,job_id,event_type,configuration_snapshot,approved_lines,payload_fingerprint,occurred_at)
        VALUES($1,$2,$14,$13,$8,'APPROVED_SCOPE_WORK_PLANNING','{"PRICE":{"version":1},"TAX":{"version":1},"WORKFLOW":{"version":1},"RECIPE":{"version":1},"CHECKLIST":{"version":1},"POLICY":{"version":1}}','[]',repeat('a',64),transaction_timestamp());
      INSERT INTO workshopos.work_plan(tenant_id,branch_id,id,job_id,activation_id,source_event_id,configuration_snapshot,priority,projected_completion_at,delivery_risk,created_at)
        VALUES($1,$2,$15,$8,$13,$14,'{"PRICE":{"version":1},"TAX":{"version":1},"WORKFLOW":{"version":1},"RECIPE":{"version":1},"CHECKLIST":{"version":1},"POLICY":{"version":1}}','NORMAL',transaction_timestamp()+interval '1 hour','ON_TRACK',transaction_timestamp());
      INSERT INTO workshopos.work_task(tenant_id,branch_id,plan_id,id,source_estimate_line_id,template_key,title,required_skill_ids,bay_type_id,estimated_minutes,checklist_snapshot,material_snapshot,priority,technician_ids,responsible_technician_id)
        VALUES($1,$2,$15,$16,$11,'service','Service task',ARRAY[gen_random_uuid()],gen_random_uuid(),30,'[{"key":"finish","required":true,"evidenceRequired":true}]','[]','NORMAL',ARRAY[$3]::uuid[],$3);
      INSERT INTO workshopos.job_planning_outbox(tenant_id,branch_id,id,aggregate_id,aggregate_version,event_type,payload) VALUES($1,$2,$17,$16,1,'S12_TASK_ASSIGNMENT_READY','{}');
      INSERT INTO workshopos.technician_assignment_event(tenant_id,branch_id,source_event_id,task_id,source_task_version,payload_fingerprint,payload,occurred_at)
        VALUES($1,$2,$17,$16,1,repeat('b',64),'{}',transaction_timestamp());
      INSERT INTO workshopos.technician_task(tenant_id,branch_id,task_id,job_id,source_event_id,source_task_version,title,priority,estimated_minutes,technician_ids,responsible_technician_id,checklist_snapshot,material_snapshot,status,resource_version,updated_at)
        VALUES($1,$2,$16,$8,$17,1,'Service task','NORMAL',30,ARRAY[$3]::uuid[],$3,'[{"key":"finish","required":true,"evidenceRequired":true}]','[]','ASSIGNED',1,transaction_timestamp());
      INSERT INTO workshopos.secure_media_object(tenant_id,branch_id,media_id,job_id,object_key,file_name,mime_type,byte_length,checksum_sha256,scan_status,created_by_membership_id,category,label,thumbnail_bytes,thumbnail_mime_type,scanned_at,scanner_reference)
        VALUES($1,$2,$18,$8,'private/test/task-media','task.png','image/png',68,repeat('c',64),'CLEAN',$3,'PROGRESS','Task evidence',decode('00','hex'),'image/png',transaction_timestamp(),'test-scanner');
    `;
      await seed.query(
        seedSql.replace(
          /\$(\d+)/g,
          (_match, index) => `'${values[Number(index) - 1]}'`,
        ),
      );
    } finally {
      await seed.end();
    }

    const tech: Membership = {
      id: techId,
      subject: "task-tech",
      tenantId: tenant,
      branchIds: [branch],
    };
    const inspector: Membership = {
      id: inspectorId,
      subject: "qc-inspector",
      tenantId: tenant,
      branchIds: [branch],
    };
    const db = new PostgresVertical(appUrl!);
    let reworkId = "";
    try {
      assert.equal(
        (
          await db.assignTask(
            inspector,
            taskId,
            { version: 1, technicianId: techId },
            "assign-task",
          )
        ).task.version,
        2,
      );
      await assert.rejects(
        () =>
          db.commandTask(
            inspector,
            taskId,
            { action: "START", version: 2, reason: "" },
            "wrong-start",
          ),
        (e: any) => e.code === "TASK_ASSIGNEE_REQUIRED",
      );
      assert.equal(
        (
          await db.commandTask(
            tech,
            taskId,
            { action: "START", version: 2, reason: "" },
            "start",
          )
        ).task.status,
        "IN_PROGRESS",
      );
      await assert.rejects(
        () =>
          db.commandTask(
            tech,
            taskId,
            {
              action: "EVIDENCE",
              version: 3,
              reason: "",
              checklistKey: "finish",
              evidenceId: "93000000-0000-4000-8000-000000000299",
            },
            "forged",
          ),
        (e: any) => e.code === "VERIFIED_CLEAN_EVIDENCE_REQUIRED",
      );
      assert.equal(
        (
          await db.commandTask(
            tech,
            taskId,
            {
              action: "EVIDENCE",
              version: 3,
              reason: "",
              checklistKey: "finish",
              evidenceId: mediaId,
            },
            "evidence",
          )
        ).task.evidenceCount,
        1,
      );
      assert.equal(
        (
          await db.commandTask(
            tech,
            taskId,
            { action: "COMPLETE", version: 4, reason: "Completed" },
            "complete",
          )
        ).task.status,
        "COMPLETED",
      );
      const qcSeed = new Client({ connectionString: adminUrl });
      await qcSeed.connect();
      try {
        await qcSeed.query(
          "UPDATE workshopos.lifecycle_resources SET stage='QC',resource_version=resource_version+1 WHERE id=$1",
          [job],
        );
        await qcSeed.query(
          "INSERT INTO workshopos.qc_task_state(tenant_id,branch_id,task_id,job_id,checklist_master_id,checklist_version,policy_version,technician_membership_ids,completion_event_id,reconciliation_event_id,qc_status,updated_at) VALUES($1,$2,$3,$4,gen_random_uuid(),1,1,ARRAY[$5]::uuid[],gen_random_uuid(),gen_random_uuid(),'PENDING_QC',transaction_timestamp())",
          [tenant, branch, taskId, job, techId],
        );
      } finally {
        await qcSeed.end();
      }
      const passItem = { key: "finish", status: "PASS", notes: "Checked" };
      await assert.rejects(
        () =>
          db.inspectQc(
            tech,
            taskId,
            { version: 1, result: "PASS", reason: "Self", items: [passItem] },
            "self-qc",
          ),
        (e: any) => e.code === "INDEPENDENT_QC_REQUIRED",
      );
      const failed = await db.inspectQc(
        inspector,
        taskId,
        {
          version: 1,
          result: "FAIL",
          reason: "Defect",
          items: [{ ...passItem, status: "FAIL" }],
        },
        "fail-qc",
      );
      reworkId = failed.reworkId!;
      await assert.rejects(
        () =>
          db.inspectQc(
            inspector,
            taskId,
            { version: 2, result: "PASS", reason: "Bypass", items: [passItem] },
            "bypass",
          ),
        (e: any) => e.code === "QC_NOT_ACTIONABLE",
      );
      assert.equal(
        (
          await db.commandReworkVerified(
            inspector,
            reworkId,
            {
              action: "ASSIGN",
              version: 1,
              reason: "Correct",
              technicianId: techId,
            },
            "assign-r",
          )
        ).rework.status,
        "ASSIGNED",
      );
      await assert.rejects(
        () =>
          db.commandReworkVerified(
            inspector,
            reworkId,
            {
              action: "COMPLETE",
              version: 2,
              reason: "Wrong actor",
              evidenceId: mediaId,
            },
            "wrong-r",
          ),
        (e: any) => e.code === "REWORK_NOT_ASSIGNED_TO_ACTOR",
      );
      assert.equal(
        (
          await db.commandReworkVerified(
            tech,
            reworkId,
            {
              action: "COMPLETE",
              version: 2,
              reason: "Corrected",
              evidenceId: mediaId,
            },
            "complete-r",
          )
        ).rework.status,
        "READY_FOR_REINSPECTION",
      );
      await assert.rejects(
        () =>
          db.commandReworkVerified(
            tech,
            reworkId,
            {
              action: "REINSPECT",
              version: 3,
              reason: "Self",
              result: "PASS",
              items: [passItem],
            },
            "self-r",
          ),
        (e: any) => e.code === "INDEPENDENT_REINSPECTION_REQUIRED",
      );
      assert.equal(
        (
          await db.commandReworkVerified(
            inspector,
            reworkId,
            {
              action: "REINSPECT",
              version: 3,
              reason: "Independent pass",
              result: "PASS",
              items: [passItem],
            },
            "pass-r",
          )
        ).rework.status,
        "PASSED",
      );
      assert.equal((await db.queryQc(inspector)).qc[0].status, "PASSED");
    } finally {
      await db.close();
    }
    const verify = new Client({ connectionString: adminUrl });
    await verify.connect();
    try {
      assert.equal(
        Number(
          (
            await verify.query(
              "SELECT count(*) count FROM workshopos.work_task_assignment_history WHERE task_id=$1",
              [taskId],
            )
          ).rows[0].count,
        ),
        1,
      );
      assert.equal(
        Number(
          (
            await verify.query(
              "SELECT count(*) count FROM workshopos.technician_task_evidence WHERE task_id=$1 AND checksum=repeat('c',64)",
              [taskId],
            )
          ).rows[0].count,
        ),
        1,
      );
      assert.equal(
        Number(
          (
            await verify.query(
              "SELECT count(*) count FROM workshopos.qc_rework_history WHERE rework_id=$1",
              [reworkId],
            )
          ).rows[0].count,
        ),
        3,
      );
    } finally {
      await verify.end();
    }
  },
);
