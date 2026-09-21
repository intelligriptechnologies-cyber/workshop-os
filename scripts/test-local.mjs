import assert from "node:assert/strict";

const baseUrl = process.env.LOCAL_BASE_URL ?? "http://127.0.0.1:4173";
const expectedDatabase = process.env.LOCAL_DATABASE_NAME ?? "workshopos";
const branch = "00000000-0000-4000-8000-000000000011";
const key = `local-smoke-${Date.now()}`;

async function api(path, identity, init = {}) {
  return fetch(`${baseUrl}${path}`, {
    ...init,
    headers: { "content-type": "application/json", "x-workshopos-identity": identity, ...(init.headers ?? {}) },
  });
}

const health = await fetch(`${baseUrl}/health`).then((response) => response.json());
assert.equal(health.status, "ok");
assert.equal(health.database, expectedDatabase);
assert.equal(health.migrations, 43);

const adminSessionResponse = await api("/api/v1/session", "north-admin");
assert.equal(adminSessionResponse.status, 200);
const adminSession = await adminSessionResponse.json();
assert.ok(adminSession.membership.permissions.includes("membership.manage"));
assert.ok(adminSession.membership.permissions.includes("role.manage"));
assert.ok(adminSession.membership.permissions.includes("global-search.use"));
assert.ok(adminSession.membership.permissions.includes("business-settings.manage"));
assert.ok(adminSession.membership.permissions.includes("customer.manage"));
assert.ok(adminSession.membership.permissions.includes("vehicle.manage"));
assert.ok(adminSession.membership.permissions.includes("inventory.import"));
assert.ok(adminSession.membership.permissions.includes("job.document.download"));
assert.ok(adminSession.membership.permissions.includes("job.lifecycle.manage"));
assert.ok(adminSession.membership.permissions.includes("job.work-acceptance.record"));
assert.ok(adminSession.membership.permissions.includes("job.payment-clearance.record"));
assert.ok(adminSession.membership.permissions.includes("job.data-flow.read"));
assert.ok(adminSession.membership.permissions.includes("media.upload"));
assert.ok(adminSession.membership.permissions.includes("media.download"));
assert.ok(adminSession.membership.permissions.includes("estimate.approve"));
assert.ok(adminSession.membership.permissions.includes("task.execute"));
assert.ok(adminSession.membership.permissions.includes("qc.inspect"));
assert.ok(adminSession.membership.permissions.includes("billing.read"));
assert.ok(adminSession.membership.permissions.includes("appointments.page"));
assert.ok(adminSession.membership.permissions.includes("follow-ups.page"));
assert.ok(adminSession.membership.permissions.includes("action-inbox.page"));
assert.ok(adminSession.membership.permissions.includes("materials.page"));
assert.ok(adminSession.membership.permissions.includes("reports.page"));
assert.ok(adminSession.membership.permissions.includes("masters.page"));
for (const screen of ["appointments", "follow-ups", "action-inbox", "materials", "reports", "masters"]) {
  const response = await api(`/api/v1/operations/${screen}?pageSize=25&sort=updatedAt.desc`, "north-admin");
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(payload.page.pageSize, 25);
  assert.ok(Array.isArray(payload.rows));
}
const masterPreference = await api("/api/v1/list-preferences/masters", "north-admin", {
  method: "PUT", body: JSON.stringify({ viewMode: "grid" }),
}).then((response) => response.json());
assert.equal(masterPreference.preference.viewMode, "grid");
const masterList = await api("/api/v1/operations/masters?search=MAIN", "north-admin").then((response) => response.json());
assert.ok(masterList.rows.some((row) => row.title === "MAIN"));
const masterExportResponse = await api("/api/v1/operation-exports", "north-admin", {
  method: "POST", headers: { "idempotency-key": `${key}-masters-export` },
  body: JSON.stringify({ screen: "masters", format: "XLSX", query: { search: "MAIN", branchId: "", sort: "summary.asc", page: 1, pageSize: 25 } }),
});
assert.equal(masterExportResponse.status, 202);
let masterExport = (await masterExportResponse.json()).export;
for (let attempt = 0; masterExport.status === "PENDING" && attempt < 30; attempt += 1) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  masterExport = await api(`/api/v1/operation-exports/${masterExport.id}`, "north-admin").then((response) => response.json()).then((payload) => payload.export);
}
assert.equal(masterExport.status, "READY");
assert.equal(masterExport.rowCount, masterList.page.totalCount);
const masterDownload = await api(`/api/v1/operation-exports/${masterExport.id}/download`, "north-admin");
assert.equal(masterDownload.status, 200);
assert.match(masterDownload.headers.get("cache-control") ?? "", /private/);
assert.equal((await api("/api/v1/operations/masters", "north-users-admin")).status, 403);
const jobsTodayResponse = await api("/api/v1/jobs", "north-admin");
assert.equal(jobsTodayResponse.status, 200);
const jobsToday = await jobsTodayResponse.json();
assert.equal(jobsToday.jobs.length, 1);
assert.equal(jobsToday.jobs[0].statusLabel, "In Progress");
assert.equal(jobsToday.jobs[0].settingsSnapshotCaptured, true);
assert.ok(jobsToday.jobs[0].documents.some((document) => document.type === "RECEIPT"));
const billingJobResponse=await api(`/api/v1/billing/jobs/${jobsToday.jobs[0].id}`,"north-admin");assert.equal(billingJobResponse.status,200);const billingJob=(await billingJobResponse.json()).billing;assert.equal(billingJob.id,jobsToday.jobs[0].id);assert.equal(billingJob.stage,"ACTIVE");assert.equal((await api(`/api/v1/billing/jobs/${jobsToday.jobs[0].id}`,"north-users-admin")).status,403);
const estimateCreate=await api("/api/v1/estimates","north-admin",{method:"POST",headers:{"idempotency-key":`${key}-estimate-create`},body:JSON.stringify({branchId:branch,jobId:jobsToday.jobs[0].id,notes:"Local immutable estimate smoke",totalMinor:"99000",validDays:14})});
assert.equal(estimateCreate.status,201);const estimate=(await estimateCreate.json()).estimate;assert.equal(estimate.status,"DRAFT");
assert.equal((await api("/api/v1/estimates","north-admin",{method:"POST",headers:{"idempotency-key":`${key}-estimate-create`},body:JSON.stringify({branchId:branch,jobId:jobsToday.jobs[0].id,notes:"Local immutable estimate smoke",totalMinor:"99000",validDays:14})})).status,200);
const estimateEdit=await api(`/api/v1/estimates/${estimate.id}/draft`,"north-admin",{method:"POST",headers:{"idempotency-key":`${key}-estimate-edit`},body:JSON.stringify({version:1,notes:"Edited local immutable estimate smoke",totalMinor:"100000"})});assert.equal(estimateEdit.status,201);assert.equal((await estimateEdit.json()).estimate.version,2);
const estimateSubmit=await api(`/api/v1/estimates/${estimate.id}/submit`,"north-admin",{method:"POST",headers:{"idempotency-key":`${key}-estimate-submit`},body:JSON.stringify({version:2,validDays:14})});assert.equal(estimateSubmit.status,201);const submittedEstimate=(await estimateSubmit.json()).estimate;
const estimateDocument=await api(`/api/v1/estimates/${estimate.id}/document`,"north-admin");assert.equal(estimateDocument.status,200);assert.match(estimateDocument.headers.get("content-disposition")??"",/-v1\.pdf/);assert.equal((await estimateDocument.arrayBuffer()).byteLength>500,true);
const jobWithEstimate=await api(`/api/v1/jobs/${jobsToday.jobs[0].id}`,"north-admin");assert.equal(jobWithEstimate.status,200);const estimateLink=(await jobWithEstimate.json()).job.documents.find((document)=>document.type==="ESTIMATE"&&document.label===submittedEstimate.documentNumber);assert.ok(estimateLink);const linkedEstimate=await api(`/api/v1/job-documents/${estimateLink.id}/download`,"north-admin");assert.equal(linkedEstimate.status,200);assert.equal((await linkedEstimate.arrayBuffer()).byteLength>500,true);
const estimateApprove=await api(`/api/v1/estimates/${estimate.id}/approve`,"north-admin",{method:"POST",headers:{"idempotency-key":`${key}-estimate-approve`},body:JSON.stringify({version:3,customerName:"Asha Sharma",acknowledgement:"Signed local smoke approval"})});assert.equal(estimateApprove.status,201);assert.equal((await estimateApprove.json()).estimate.status,"APPROVED");
assert.equal((await api("/api/v1/estimates","north-users-admin")).status,403);
const jobCardResponse = await api(`/api/v1/jobs/${jobsToday.jobs[0].id}/job-card`, "north-admin");
assert.equal(jobCardResponse.status, 200);
assert.match(jobCardResponse.headers.get("content-type") ?? "", /application\/pdf/);
assert.equal((await jobCardResponse.arrayBuffer()).byteLength > 500, true);
assert.equal((await api(`/api/v1/jobs/${jobsToday.jobs[0].id}/job-card`, "north-users-admin")).status, 403);
const mediaJobsResponse = await api(`/api/v1/media/jobs?visitDate=${jobsToday.query.visitDate}&search=Asha`, "north-admin");
assert.equal(mediaJobsResponse.status, 200); const mediaJobs = await mediaJobsResponse.json(); assert.deepEqual(mediaJobs.jobs.map((job) => job.id), [jobsToday.jobs[0].id]); assert.deepEqual(mediaJobs.jobs[0].allowedCategories, ["PROGRESS"]);
const mediaBytes = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", "base64");
const mediaUploadResponse = await api("/api/v1/media", "north-admin", { method: "POST", headers: { "idempotency-key": `${key}-media-upload` }, body: JSON.stringify({ jobId: jobsToday.jobs[0].id, branchId: branch, category: "PROGRESS", label: "Local smoke progress", fileName: "progress.png", mimeType: "image/png", contentBase64: mediaBytes.toString("base64") }) });
assert.equal(mediaUploadResponse.status, 201); const mediaRecord = (await mediaUploadResponse.json()).media; assert.equal(mediaRecord.scanStatus, "PENDING");
assert.equal((await api(`/api/v1/media/${mediaRecord.id}/download`, "north-admin")).status, 404);
assert.equal((await api(`/api/v1/internal/media/${mediaRecord.id}/scan`, "north-admin", { method: "POST", body: JSON.stringify({ status: "CLEAN", scannerReference: "local-smoke" }) })).status, 403);
const scanResponse = await api(`/api/v1/internal/media/${mediaRecord.id}/scan`, "north-admin", { method: "POST", headers: { "x-workshopos-scanner-token": "local-dev-scanner" }, body: JSON.stringify({ status: "CLEAN", scannerReference: "local-smoke" }) }); assert.equal(scanResponse.status, 200);
const mediaDownload = await api(`/api/v1/media/${mediaRecord.id}/download`, "north-admin"); assert.equal(mediaDownload.status, 200); assert.deepEqual(Buffer.from(await mediaDownload.arrayBuffer()), mediaBytes); assert.match(mediaDownload.headers.get("cache-control") ?? "", /private/);
const mediaArchive = await api(`/api/v1/media/${mediaRecord.id}/archive`, "north-admin", { method: "POST", headers: { "idempotency-key": `${key}-media-archive` }, body: JSON.stringify({ version: 2, reason: "Local smoke cleanup" }) }); assert.equal(mediaArchive.status, 200); assert.equal((await api(`/api/v1/media/${mediaRecord.id}/view`, "north-admin")).status, 404);
assert.equal((await api("/api/v1/media", "north-users-admin")).status, 403);
const lifecycleBefore = await api(`/api/v1/jobs/${jobsToday.jobs[0].id}/lifecycle`, "north-admin").then((response) => response.json());
assert.equal(lifecycleBefore.lifecycle.canonicalStage, "ACTIVE");
const holdBody = JSON.stringify({ command: "HOLD", version: lifecycleBefore.lifecycle.version, reason: "Local smoke parts delay" });
const holdResponse = await api(`/api/v1/jobs/${jobsToday.jobs[0].id}/lifecycle`, "north-admin", { method: "POST", headers: { "idempotency-key": `${key}-job-hold` }, body: holdBody });
assert.equal(holdResponse.status, 201); const heldLifecycle = (await holdResponse.json()).lifecycle; assert.equal(heldLifecycle.held, true); assert.equal(heldLifecycle.canonicalStage, "ACTIVE");
assert.equal((await api(`/api/v1/jobs/${jobsToday.jobs[0].id}/lifecycle`, "north-admin", { method: "POST", headers: { "idempotency-key": `${key}-job-hold` }, body: holdBody })).status, 200);
const resumeResponse = await api(`/api/v1/jobs/${jobsToday.jobs[0].id}/lifecycle`, "north-admin", { method: "POST", headers: { "idempotency-key": `${key}-job-resume` }, body: JSON.stringify({ command: "RESUME", version: heldLifecycle.version, reason: "Parts available" }) });
assert.equal(resumeResponse.status, 201); assert.equal((await resumeResponse.json()).lifecycle.held, false);
const dataFlowResponse = await api(`/api/v1/jobs/${jobsToday.jobs[0].id}/data-flow`, "north-admin"); assert.equal(dataFlowResponse.status, 200);
const dataFlow = (await dataFlowResponse.json()).dataFlow; assert.equal(dataFlow.selectedJob.id, jobsToday.jobs[0].id); assert.equal(dataFlow.sections.length, 9);
assert.equal((await api(`/api/v1/jobs/${jobsToday.jobs[0].id}/data-flow`, "north-users-admin")).status, 403);
assert.equal((await api(`/api/v1/jobs/${jobsToday.jobs[0].id}/lifecycle`, "north-users-admin", { method: "POST", headers: { "idempotency-key": `${key}-denied-job-command` }, body: JSON.stringify({ command: "HOLD", version: 1, reason: "Denied" }) })).status, 403);
const inventoryBefore = await api("/api/v1/inventory?search=OIL-5W30", "north-admin").then((response) => response.json());
assert.equal(inventoryBefore.inventory.length, 1);
assert.equal((await api("/api/v1/inventory", "north-reception")).status, 403);
const inventoryStageResponse = await api("/api/v1/inventory/imports", "north-admin", { method: "POST", headers: { "idempotency-key": `${key}-inventory-stage` }, body: JSON.stringify({ branchId: branch, filename: "local-smoke.csv", rows: [{ sku: "OIL-5W30", warehouseCode: "MAIN", quantity: "2", valueMinor: "100" }] }) });
assert.equal(inventoryStageResponse.status, 201); const inventoryStage = (await inventoryStageResponse.json()).import; assert.equal(inventoryStage.summary.invalidRows, 0);
const inventoryCommitResponse = await api(`/api/v1/inventory/imports/${inventoryStage.id}/commit`, "north-admin", { method: "POST", headers: { "idempotency-key": `${key}-inventory-commit` }, body: JSON.stringify({ version: inventoryStage.version }) });
assert.equal(inventoryCommitResponse.status, 200); const inventoryCommit = await inventoryCommitResponse.json(); assert.equal(inventoryCommit.reconciliation.ledgerBatches, 1);
assert.equal((await api(`/api/v1/inventory/imports/${inventoryStage.id}/commit`, "north-admin", { method: "POST", headers: { "idempotency-key": `${key}-inventory-commit` }, body: JSON.stringify({ version: inventoryStage.version }) })).status, 200);
const customerInput = JSON.stringify({ branchId: branch, displayName: "Local Identity Smoke", mobile: `9${String(Date.now()).slice(-9)}`, email: "identity-smoke@example.test" });
const customerResponse = await api("/api/v1/customers", "north-admin", { method: "POST", headers: { "idempotency-key": `${key}-customer` }, body: customerInput });
assert.equal(customerResponse.status, 201); const customer = (await customerResponse.json()).customer;
assert.equal((await api("/api/v1/customers", "north-admin", { method: "POST", headers: { "idempotency-key": `${key}-customer` }, body: customerInput })).status, 201);
const duplicateMobileResponse = await api("/api/v1/customers", "north-admin", { method: "POST", headers: { "idempotency-key": `${key}-customer-duplicate` }, body: JSON.stringify({ branchId: branch, displayName: "Duplicate", mobile: customer.mobile, email: "" }) });
assert.equal(duplicateMobileResponse.status, 409); assert.equal((await duplicateMobileResponse.json()).code, "DUPLICATE_MOBILE");
const vehicleInput = JSON.stringify({ branchId: branch, registration: `DL01${String(Date.now()).slice(-6)}`, vin: "", make: "Tata", model: "Nexon", ownerCustomerId: customer.id });
const vehicleResponse = await api("/api/v1/vehicles", "north-admin", { method: "POST", headers: { "idempotency-key": `${key}-vehicle` }, body: vehicleInput });
assert.equal(vehicleResponse.status, 201); const vehicle = (await vehicleResponse.json()).vehicle; assert.equal(vehicle.ownerCustomerId, customer.id);
const vehicleDirectory = await api("/api/v1/vehicles?search=DL01&sort=summary.asc", "north-admin").then((response) => response.json()); assert.ok(vehicleDirectory.vehicles.some((row) => row.id === vehicle.id));
assert.equal((await api("/api/v1/customers", "north-reception")).status, 403);
const identityExportResponse = await api("/api/v1/customer-vehicle-exports", "north-admin", { method: "POST", headers: { "idempotency-key": `${key}-customer-export` }, body: JSON.stringify({ screen: "customers", format: "XLSX", query: { search: "Local Identity Smoke", branchId: "", sort: "summary.asc", page: 1, pageSize: 25 } }) });
assert.equal(identityExportResponse.status, 202); let identityExport = (await identityExportResponse.json()).export;
for (let attempt=0;identityExport.status==="PENDING"&&attempt<30;attempt+=1){await new Promise(resolve=>setTimeout(resolve,100));identityExport=await api(`/api/v1/customer-vehicle-exports/${identityExport.id}`,"north-admin").then(response=>response.json()).then(payload=>payload.export);}
assert.equal(identityExport.status,"READY"); assert.ok(identityExport.rowCount >= 1); const identityDownload=await api(`/api/v1/customer-vehicle-exports/${identityExport.id}/download`,"north-admin"); assert.equal(identityDownload.status,200); assert.match(identityDownload.headers.get("cache-control"),/private/);
const tenantSettingsResponse = await api("/api/v1/admin/business-settings", "north-admin");
assert.equal(tenantSettingsResponse.status, 200); const tenantSettings = await tenantSettingsResponse.json();
const savedSettingsResponse = await api("/api/v1/admin/business-settings", "north-admin", { method: "PATCH", body: JSON.stringify({ version: tenantSettings.draftVersion, values: { ...tenantSettings.effective, invoiceFooter: "WorkshopOS local verification" } }) });
assert.equal(savedSettingsResponse.status, 200); const savedSettings = await savedSettingsResponse.json();
const publishedSettingsResponse = await api("/api/v1/admin/business-settings/publish", "north-admin", { method: "POST", headers: { "idempotency-key": `${key}-settings-publish` }, body: JSON.stringify({ version: savedSettings.draftVersion }) });
assert.equal(publishedSettingsResponse.status, 200); const publishedSettings = await publishedSettingsResponse.json(); assert.ok(publishedSettings.publishedVersion > 0);
const settingsWorkResponse = await api("/api/v1/work-items", "north-admin", { method: "POST", headers: { "idempotency-key": `${key}-settings-work` }, body: JSON.stringify({ branchId: branch, summary: "Business Settings snapshot smoke" }) });
assert.equal(settingsWorkResponse.status, 201); const settingsWork = await settingsWorkResponse.json();
const firstSnapshotResponse = await api(`/api/v1/work-items/${settingsWork.workItem.id}/settings-snapshot`, "north-admin", { method: "POST", headers: { "idempotency-key": `${key}-settings-snapshot-1` }, body: JSON.stringify({ branchId: branch }) });
assert.equal(firstSnapshotResponse.status, 201); const firstSnapshot = (await firstSnapshotResponse.json()).snapshot;
const nextSettingsResponse = await api("/api/v1/admin/business-settings", "north-admin", { method: "PATCH", body: JSON.stringify({ version: publishedSettings.draftVersion, values: { ...publishedSettings.effective, defaultLaborRateMinor: publishedSettings.effective.defaultLaborRateMinor + 1 } }) });
assert.equal(nextSettingsResponse.status, 200); const nextSettings = await nextSettingsResponse.json();
assert.equal((await api("/api/v1/admin/business-settings/publish", "north-admin", { method: "POST", headers: { "idempotency-key": `${key}-settings-publish-2` }, body: JSON.stringify({ version: nextSettings.draftVersion }) })).status, 200);
const stableSnapshotResponse = await api(`/api/v1/work-items/${settingsWork.workItem.id}/settings-snapshot`, "north-admin", { method: "POST", headers: { "idempotency-key": `${key}-settings-snapshot-2` }, body: JSON.stringify({ branchId: branch }) });
assert.equal(stableSnapshotResponse.status, 201); assert.deepEqual((await stableSnapshotResponse.json()).snapshot.values, firstSnapshot.values);
const roleDirectoryResponse = await api("/api/v1/admin/roles?search=export", "north-admin");
assert.equal(roleDirectoryResponse.status, 200);
const roleDirectory = await roleDirectoryResponse.json();
assert.ok(roleDirectory.roles.some((role) => role.protected && role.name === "Business Owner/Admin"));
assert.ok(roleDirectory.catalog.flatMap((group) => group.pages).some((page) => page.actions.some((action) => action.key === "work-item.export")));
const deniedRoleDirectory = await api("/api/v1/admin/roles", "north-reception");
assert.equal(deniedRoleDirectory.status, 404);
const usersAdminSession = await api("/api/v1/session", "north-users-admin").then((response) => response.json());
assert.ok(usersAdminSession.membership.permissions.includes("membership.manage"));
assert.ok(!usersAdminSession.membership.permissions.includes("role.manage"));
assert.ok(!usersAdminSession.membership.permissions.includes("work-item.export"));
assert.equal((await api("/api/v1/admin/roles", "north-users-admin")).status, 403);
const roleName = `Smoke role ${Date.now()}`;
const createRoleInput = JSON.stringify({ name: roleName, description: "Local role smoke", permissions: ["work-items.page", "work-item.read"] });
const createRoleResponse = await api("/api/v1/admin/roles", "north-admin", { method: "POST", body: createRoleInput, headers: { "idempotency-key": `${key}-role-create` } });
assert.equal(createRoleResponse.status, 201);
const createdRole = (await createRoleResponse.json()).role;
const replayRoleResponse = await api("/api/v1/admin/roles", "north-admin", { method: "POST", body: createRoleInput, headers: { "idempotency-key": `${key}-role-create` } });
assert.equal(replayRoleResponse.status, 200); assert.equal((await replayRoleResponse.json()).role.id, createdRole.id);
const revisedRoleResponse = await api(`/api/v1/admin/roles/${createdRole.id}`, "north-admin", { method: "PATCH", body: JSON.stringify({ ...createdRole, name: `${roleName} revised`, permissions: ["work-items.page", "work-item.read", "work-item.manage"] }) });
assert.equal(revisedRoleResponse.status, 200); const revisedRole = (await revisedRoleResponse.json()).role; assert.equal(revisedRole.version, 2);
const protectedRoleResponse = await api("/api/v1/admin/roles/00000000-0000-4000-8000-000000000301", "north-admin", { method: "PATCH", body: JSON.stringify({ name: "Weakened", description: "", permissions: ["admin.roles.page"], version: 1 }) });
assert.equal(protectedRoleResponse.status, 409); assert.equal((await protectedRoleResponse.json()).code, "PROTECTED_ROLE");
const archiveRoleResponse = await api(`/api/v1/admin/roles/${createdRole.id}/archive`, "north-admin", { method: "POST", body: JSON.stringify({ version: revisedRole.version, reason: "Smoke-test cleanup" }), headers: { "idempotency-key": `${key}-role-archive` } });
assert.equal(archiveRoleResponse.status, 200); assert.equal((await archiveRoleResponse.json()).role.active, false);
const adminDirectoryResponse = await api("/api/v1/admin/users?pageSize=25&sort=name.asc", "north-admin");
assert.equal(adminDirectoryResponse.status, 200);
const adminDirectory = await adminDirectoryResponse.json();
assert.ok(adminDirectory.users.some((user) => user.email === "local-admin@workshopos.test"));
assert.equal(adminDirectory.query.sort, "name.asc");
const deniedAdminDirectory = await api("/api/v1/admin/users", "north-reception");
assert.equal(deniedAdminDirectory.status, 404);

const createInput = JSON.stringify({ branchId: branch, tenantId: "spoofed-tenant", summary: "Docker PostgreSQL smoke inspection" });
const createdResponse = await api("/api/v1/work-items", "north-reception", {
  method: "POST", body: createInput, headers: { "idempotency-key": key },
});
assert.equal(createdResponse.status, 201);
const created = await createdResponse.json();
assert.equal(created.workItem.tenantId, "00000000-0000-4000-8000-000000000001");
const globalSearchResponse = await api("/api/v1/search?query=Docker%20PostgreSQL", "north-admin");
assert.equal(globalSearchResponse.status, 200);
const globalSearch = await globalSearchResponse.json();
assert.ok(globalSearch.records.some((record) => record.id === created.workItem.id));
assert.equal(Object.hasOwn(globalSearch, "totalCount"), false);
const usersAdminSearch = await api("/api/v1/search?query=Docker%20PostgreSQL", "north-users-admin").then((response) => response.json());
assert.deepEqual(usersAdminSearch.records, []);
const usersAdminDeniedExport = await api("/api/v1/work-item-exports", "north-users-admin", { method: "POST", headers: { "idempotency-key": `${key}-users-admin-export` }, body: JSON.stringify({ format: "XLSX", query: {} }) });
assert.equal(usersAdminDeniedExport.status, 403);

const replayResponse = await api("/api/v1/work-items", "north-reception", {
  method: "POST", body: createInput, headers: { "idempotency-key": key },
});
assert.equal(replayResponse.status, 200);
const replay = await replayResponse.json();
assert.equal(replay.workItem.id, created.workItem.id);
assert.equal(replay.auditReference, created.auditReference);

const changedKeyResponse = await api("/api/v1/work-items", "north-reception", {
  method: "POST", body: JSON.stringify({ branchId: branch, summary: "A different command" }), headers: { "idempotency-key": key },
});
assert.equal(changedKeyResponse.status, 409);
const changedKey = await changedKeyResponse.json();
assert.equal(changedKey.code, "IDEMPOTENCY_KEY_REUSED");
assert.ok(changedKey.message);
assert.equal(changedKey.traceId, changedKeyResponse.headers.get("x-trace-id"));

const updatedResponse = await api(`/api/v1/work-items/${created.workItem.id}`, "north-reception", {
  method: "PATCH", body: JSON.stringify({ summary: "Docker PostgreSQL brake inspection", version: 1 }),
});
assert.equal(updatedResponse.status, 200);
const updated = await updatedResponse.json();
assert.equal(updated.workItem.version, 2);

const staleResponse = await api(`/api/v1/work-items/${created.workItem.id}`, "north-reception", {
  method: "PATCH", body: JSON.stringify({ summary: "Stale overwrite", version: 1 }),
});
assert.equal(staleResponse.status, 409);
const stale = await staleResponse.json();
assert.equal(stale.code, "VERSION_CONFLICT");
assert.match(stale.message, /Refresh/);
assert.equal(stale.traceId, staleResponse.headers.get("x-trace-id"));

const northItems = await api("/api/v1/work-items", "north-reception").then((response) => response.json());
assert.ok(northItems.workItems.some((item) => item.id === created.workItem.id));
assert.equal(northItems.page.pageSize, 25);
const filteredItems = await api("/api/v1/work-items?search=brake&sort=summary.asc&page=1&pageSize=50", "north-reception").then((response) => response.json());
assert.ok(filteredItems.workItems.some((item) => item.id === created.workItem.id));
assert.equal(filteredItems.query.sort, "summary.asc");
const southItems = await api("/api/v1/work-items", "south-reception").then((response) => response.json());
assert.ok(!southItems.workItems.some((item) => item.id === created.workItem.id));
const jaipurItems = await api("/api/v1/work-items", "north-jaipur-manager").then((response) => response.json());
assert.ok(!jaipurItems.workItems.some((item) => item.id === created.workItem.id));

const savedPreference = await api("/api/v1/list-preferences/work-items", "north-reception", { method: "PUT", body: JSON.stringify({ viewMode: "grid" }) }).then((response) => response.json());
assert.equal(savedPreference.preference.viewMode, "grid");
const privatePreference = await api("/api/v1/list-preferences/work-items", "north-jaipur-manager").then((response) => response.json());
assert.equal(privatePreference.preference.viewMode, "table");

const exportResponse = await api("/api/v1/work-item-exports", "north-reception", { method: "POST", headers: { "idempotency-key": `${key}-export` }, body: JSON.stringify({ format: "XLSX", query: filteredItems.query }) });
assert.equal(exportResponse.status, 202);
let exportJob = (await exportResponse.json()).export;
for (let attempt = 0; exportJob.status === "PENDING" && attempt < 30; attempt += 1) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  exportJob = await api(`/api/v1/work-item-exports/${exportJob.id}`, "north-reception").then((response) => response.json()).then((payload) => payload.export);
}
assert.equal(exportJob.status, "READY");
assert.equal(exportJob.rowCount, filteredItems.page.totalCount);
const exportDownload = await api(`/api/v1/work-item-exports/${exportJob.id}/download`, "north-reception");
assert.equal(exportDownload.status, 200); assert.match(exportDownload.headers.get("content-type"), /spreadsheet/);
const hiddenExport = await api(`/api/v1/work-item-exports/${exportJob.id}`, "north-jaipur-manager");
assert.equal(hiddenExport.status, 404);
const deniedExport = await api("/api/v1/work-item-exports", "south-reception", { method: "POST", headers: { "idempotency-key": `${key}-denied-export` }, body: JSON.stringify({ format: "PDF", query: filteredItems.query }) });
assert.equal(deniedExport.status, 403);

const forbidden = await api("/api/v1/work-items", "north-reception", {
  method: "POST",
  body: JSON.stringify({ branchId: "00000000-0000-4000-8000-000000000012", summary: "Branch hop" }),
  headers: { "idempotency-key": `${key}-branch-hop` },
});
assert.equal(forbidden.status, 403);
const forbiddenBody = await forbidden.json();
assert.equal(forbiddenBody.code, "BRANCH_FORBIDDEN");
assert.equal(forbiddenBody.traceId, forbidden.headers.get("x-trace-id"));

const concurrentKey = `${key}-concurrent`;
const concurrentCalls = await Promise.all([
  api("/api/v1/work-items", "north-reception", {
    method: "POST", body: createInput, headers: { "idempotency-key": concurrentKey },
  }),
  api("/api/v1/work-items", "north-reception", {
    method: "POST", body: createInput, headers: { "idempotency-key": concurrentKey },
  }),
]);
assert.deepEqual(concurrentCalls.map((response) => response.status).sort(), [200, 201]);
const concurrentBodies = await Promise.all(concurrentCalls.map((response) => response.json()));
assert.equal(concurrentBodies[0].workItem.id, concurrentBodies[1].workItem.id);

const missingReason = await api(`/api/v1/work-items/${created.workItem.id}/archive`, "north-reception", {
  method: "POST", body: JSON.stringify({ reason: "", version: 2 }), headers: { "idempotency-key": `${key}-archive-empty` },
});
assert.equal(missingReason.status, 400);
assert.equal((await missingReason.json()).code, "REASON_REQUIRED");
const hiddenArchive = await api(`/api/v1/work-items/${created.workItem.id}/archive`, "north-jaipur-manager", {
  method: "POST", body: JSON.stringify({ reason: "Out of scope", version: 2 }), headers: { "idempotency-key": `${key}-archive-hop` },
});
assert.equal(hiddenArchive.status, 404);
const archiveInput = JSON.stringify({ reason: "Smoke-test cleanup", version: 2 });
const archivedResponse = await api(`/api/v1/work-items/${created.workItem.id}/archive`, "north-reception", {
  method: "POST", body: archiveInput, headers: { "idempotency-key": `${key}-archive` },
});
assert.equal(archivedResponse.status, 200);
const archived = await archivedResponse.json();
assert.equal(archived.workItem.version, 3);
const archivedReplayResponse = await api(`/api/v1/work-items/${created.workItem.id}/archive`, "north-reception", {
  method: "POST", body: archiveInput, headers: { "idempotency-key": `${key}-archive` },
});
assert.equal(archivedReplayResponse.status, 200);
assert.equal((await archivedReplayResponse.json()).auditReference, archived.auditReference);
const remainingItems = await api("/api/v1/work-items", "north-reception").then((response) => response.json());
assert.ok(!remainingItems.workItems.some((item) => item.id === created.workItem.id));

console.log(JSON.stringify({
  result: "PASS",
  migrations: health.migrations,
  workItemId: created.workItem.id,
  checks: ["database health", "remaining-screen production lists", "remaining-screen exact authorization", "remaining-screen private view preference", "remaining-screen complete private export", "Job List branch-local Visit date", "canonical In Progress presentation", "immutable Job settings snapshot", "conditional Job document discovery", "authorized Job Card PDF", "Estimate create and idempotent replay", "optimistic draft Estimate edit", "immutable submitted Estimate PDF", "evidenced Estimate approval", "Estimate exact authorization", "Billing and custody projection", "Billing exact authorization", "Visit-date Job Media selector", "lifecycle-gated private Media upload", "scanner quarantine and trusted release", "private original download", "Media archive without hard delete", "Media exact authorization", "Hold overlay and same-stage resume", "lifecycle command idempotency", "record-specific Job Data Flow", "Data Flow permission", "inventory analytics", "inventory staged dry run", "inventory idempotent commit reconciliation", "customer duplicate control", "vehicle owner association", "customer and vehicle server lists", "versioned Business Settings publication", "production tenant-admin session", "protected and versioned roles", "exact role API authorization", "permission-filtered global search", "authorized user directory", "denied user-management controls", "tenant spoof rejected", "idempotent replay", "idempotency payload binding", "optimistic version conflict", "trace-correlated readable errors", "concurrent retry serialization", "cross-tenant RLS", "cross-branch RLS", "server list query", "private view preference", "complete asynchronous private export", "export permission", "reason-required archive", "archive replay and audit"],
}, null, 2));
