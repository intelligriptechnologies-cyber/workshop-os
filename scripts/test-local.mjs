import assert from "node:assert/strict";

const baseUrl = process.env.LOCAL_BASE_URL ?? "http://127.0.0.1:4173";
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
assert.equal(health.database, "workshopos");
assert.equal(health.migrations, 35);

const adminSessionResponse = await api("/api/v1/session", "north-admin");
assert.equal(adminSessionResponse.status, 200);
const adminSession = await adminSessionResponse.json();
assert.ok(adminSession.membership.permissions.includes("membership.manage"));
assert.ok(adminSession.membership.permissions.includes("role.manage"));
assert.ok(adminSession.membership.permissions.includes("global-search.use"));
assert.ok(adminSession.membership.permissions.includes("business-settings.manage"));
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
  checks: ["database health", "versioned Business Settings publication", "production tenant-admin session", "protected and versioned roles", "exact role API authorization", "permission-filtered global search", "authorized user directory", "denied user-management controls", "tenant spoof rejected", "idempotent replay", "idempotency payload binding", "optimistic version conflict", "trace-correlated readable errors", "concurrent retry serialization", "cross-tenant RLS", "cross-branch RLS", "server list query", "private view preference", "complete asynchronous private export", "export permission", "reason-required archive", "archive replay and audit"],
}, null, 2));
