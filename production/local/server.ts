import { createReadStream } from "node:fs";
import { access, stat } from "node:fs/promises";
import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import { createHash, randomUUID, timingSafeEqual } from "node:crypto";
import { tmpdir } from "node:os";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import path from "node:path";

import { memberships, PostgresVertical } from "./database.js";
import { CognitoGateway, LocalIdentityGateway } from "./cognito.js";
import { AdminUserService, ApiError, type AuthenticatedMembership } from "../src/admin-users.js";
import { publicApiError } from "../src/http-errors.js";
import { parseListQuery, type ServerListQuery } from "../src/server-list-contract.js";
import { createWorkItemExportArtifact } from "../src/work-item-export.js";
import { parseUserListQuery, type UserListQuery } from "../src/user-list-contract.js";
import { createUserExportArtifact } from "../src/user-export.js";
import { RolePermissionService } from "../src/role-permissions.js";
import { BusinessSettingsService } from "../src/business-settings.js";
import { createCustomerVehicleExportArtifact } from "../src/customer-vehicle-export.js";
import { createInventoryExportArtifact } from "../src/inventory-export.js";
import { parseJobListQuery, type JobListQuery } from "../src/job-list-contract.js";
import { createJobCardPdf, createJobListExportArtifact } from "../src/job-export.js";
import { parseMediaListQuery, type MediaCategory } from "../src/job-media.js";
import { createEstimateDocument } from "../src/estimate-task-qc.js";

const host = process.env.HOST ?? "127.0.0.1";
const port = Number(process.env.PORT ?? 4173);
const dist = path.resolve("dist");
const database = new PostgresVertical();
const identityMode = process.env.IDENTITY_MODE ?? (process.env.COGNITO_USER_POOL_ID ? "cognito" : "local");
const cognitoDomain = process.env.COGNITO_DOMAIN?.replace(/\/$/, "");
const cognito = identityMode === "cognito" ? new CognitoGateway(
  required("COGNITO_USER_POOL_ID"), required("COGNITO_APP_CLIENT_ID"), required("AWS_REGION"),
) : undefined;
const localIdentity = !cognito && process.env.ALLOW_DEMO_LOGIN === "true" ? new LocalIdentityGateway() : undefined;
const adminUsers = cognito || localIdentity ? new AdminUserService(database, cognito ?? localIdentity!) : undefined;
const rolePermissions = new RolePermissionService(database);
const businessSettings = new BusinessSettingsService(database);
const privateObjectRoot = path.resolve(process.env.PRIVATE_OBJECT_DIR ?? path.join(tmpdir(), "workshopos-private-objects"));
const thumbnailPng = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", "base64");
const maxMediaRequestBytes = 28 * 1024 * 1024;

function privateObjectPath(objectKey:string):string{const file=path.resolve(privateObjectRoot,...objectKey.split("/"));if(!file.startsWith(`${privateObjectRoot}${path.sep}`))throw new ApiError(500,"INTERNAL_ERROR");return file;}
async function putPrivateObject(objectKey:string,content:Buffer):Promise<void>{const file=privateObjectPath(objectKey);const temporary=`${file}.${randomUUID()}.tmp`;await mkdir(path.dirname(file),{recursive:true});try{await writeFile(temporary,content,{flag:"wx"});await rename(temporary,file);}catch(error){await unlink(temporary).catch(()=>undefined);throw error;}}
function trustedScannerToken(value:string|string[]|undefined):boolean{const expected=process.env.SCANNER_TOKEN;if(!expected||typeof value!=="string")return false;const actualBytes=Buffer.from(value),expectedBytes=Buffer.from(expected);return actualBytes.length===expectedBytes.length&&timingSafeEqual(actualBytes,expectedBytes);}
function validMediaSignature(content:Buffer,mimeType:string):boolean{if(mimeType==="image/jpeg")return content.length>=3&&content[0]===0xff&&content[1]===0xd8&&content[2]===0xff;if(mimeType==="image/png")return content.length>=8&&content.subarray(0,8).equals(Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]));if(mimeType==="application/pdf")return content.length>=5&&content.subarray(0,5).toString("ascii")==="%PDF-";return false;}

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required when IDENTITY_MODE=cognito`);
  return value;
}

function json(response: ServerResponse, status: number, body: unknown, traceId?: string): void {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8", ...(traceId ? { "x-trace-id": traceId } : {}) });
  response.end(JSON.stringify(body));
}

async function body(request: IncomingMessage, maximumBytes = 1024 * 1024): Promise<Record<string, unknown>> {
  const declaredLength = Number(request.headers["content-length"] ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > maximumBytes) throw new ApiError(413, "REQUEST_BODY_TOO_LARGE");
  const chunks: Buffer[] = [];
  let receivedBytes = 0;
  for await (const chunk of request) {
    const buffer = Buffer.from(chunk);
    receivedBytes += buffer.length;
    if (receivedBytes > maximumBytes) throw new ApiError(413, "REQUEST_BODY_TOO_LARGE");
    chunks.push(buffer);
  }
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as Record<string, unknown>;
}

async function membershipFor(request: IncomingMessage) {
  if (cognito) {
    const authorization = request.headers.authorization;
    if (!authorization?.startsWith("Bearer ")) return undefined;
    const subject = await cognito.verifyAccessToken(authorization.slice(7));
    return database.resolveMembership(subject);
  }
  if (process.env.ALLOW_DEMO_LOGIN !== "true") return undefined;
  const identity = request.headers["x-workshopos-identity"];
  if (identity === "north-admin") return database.resolveMembership("local-north-admin");
  if (identity === "north-users-admin") return database.resolveMembership("local-north-users-admin");
  return typeof identity === "string" ? memberships[identity] : undefined;
}

function isGlobalMembership(value: unknown): value is AuthenticatedMembership {
  return Boolean(value && typeof value === "object" && "permissions" in value && "roles" in value);
}

function hasPermission(membership: { permissions?: string[] }, permission: string): boolean {
  return Boolean(membership.permissions?.includes(permission));
}

function requirePermission(membership: { permissions?: string[] }, permission: string): void {
  if (!hasPermission(membership, permission)) throw new ApiError(403, "PERMISSION_DENIED");
}

function queryFromJson(value: unknown): ServerListQuery {
  const input = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const params = new URLSearchParams();
  for (const key of ["search", "branchId", "sort", "page", "pageSize"]) if (input[key] !== undefined) params.set(key, String(input[key]));
  return parseListQuery(params);
}

function jobQueryFromJson(value:unknown):JobListQuery{const input=value&&typeof value==="object"?value as Record<string,unknown>:{};const params=new URLSearchParams();for(const key of ["search","branchId","visitDate","stage","sort","page","pageSize"])if(input[key]!==undefined)params.set(key,String(input[key]));return parseJobListQuery(params);}

function queueWorkItemExport(membership: Parameters<PostgresVertical["queryWorkItems"]>[0], id: string, format: "PDF" | "XLSX", query: ServerListQuery): void {
  setImmediate(() => void (async () => {
    try {
      const rows = (await database.queryWorkItems(membership, query, true)).workItems;
      await database.completeListExport(membership, id, createWorkItemExportArtifact(format, rows));
    } catch {
      await database.failListExport(membership, id);
    }
  })());
}

function queueUserExport(membership: AuthenticatedMembership, id: string, format: "PDF" | "XLSX", query: UserListQuery): void {
  setImmediate(() => void (async () => {
    try {
      const rows = (await adminUsers!.list(membership, query, true)).users;
      await database.completeListExport(membership, id, createUserExportArtifact(format, rows));
    } catch {
      await database.failListExport(membership, id);
    }
  })());
}

function queueCustomerVehicleExport(membership: Parameters<PostgresVertical["queryCustomers"]>[0], id: string, screen: "customers" | "vehicles", format: "PDF" | "XLSX", query: ServerListQuery): void {
  setImmediate(() => void (async () => { try { const rows = screen === "customers" ? (await database.queryCustomers(membership, query, true)).customers : (await database.queryVehicles(membership, query, true)).vehicles; await database.completeListExport(membership, id, createCustomerVehicleExportArtifact(screen, format, rows)); } catch { await database.failListExport(membership, id); } })());
}

function queueInventoryExport(membership: Parameters<PostgresVertical["queryInventory"]>[0], id: string, format: "PDF" | "XLSX", query: ServerListQuery): void {
  setImmediate(() => void (async () => { try { const rows = (await database.queryInventory(membership, query, true)).inventory; await database.completeListExport(membership, id, createInventoryExportArtifact(format, rows)); } catch { await database.failListExport(membership, id); } })());
}
function queueJobExport(membership:Parameters<PostgresVertical["queryJobs"]>[0],id:string,format:"PDF"|"XLSX",query:JobListQuery):void{setImmediate(()=>void(async()=>{try{const rows=(await database.queryJobs(membership,query,true)).jobs;await database.completeListExport(membership,id,createJobListExportArtifact(format,rows));}catch{await database.failListExport(membership,id);}})());}

async function staticFile(urlPath: string, response: ServerResponse): Promise<void> {
  const requested = urlPath === "/" ? "index.html" : urlPath.slice(1);
  let file = path.resolve(dist, requested);
  if (!file.startsWith(`${dist}${path.sep}`) && file !== path.join(dist, "index.html")) {
    json(response, 404, { code: "NOT_FOUND" });
    return;
  }
  try {
    await access(file);
    if (!(await stat(file)).isFile()) throw new Error("not a file");
  } catch {
    file = path.join(dist, "index.html");
  }
  const extension = path.extname(file);
  const contentTypes: Record<string, string> = {
    ".css": "text/css", ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml",
  };
  const cacheControl = extension === ".html" || requested === "sw.js" || requested === "manifest.webmanifest"
    ? "no-cache"
    : "public, max-age=31536000, immutable";
  response.writeHead(200, { "content-type": contentTypes[extension] ?? "application/octet-stream", "cache-control": cacheControl });
  createReadStream(file).pipe(response);
}

const server = createServer(async (request, response) => {
  const traceId = randomUUID();
  try {
    const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);
    if (url.pathname === "/health") {
      json(response, 200, { status: "ok", ...(await database.health()) });
      return;
    }
    if (url.pathname === "/api/v1/auth/config" && request.method === "GET") {
      if (!cognito) {
        json(response, 200, { mode: "local", allowDemo: process.env.ALLOW_DEMO_LOGIN === "true" });
      } else {
        if (!cognitoDomain) throw new Error("COGNITO_DOMAIN is required when IDENTITY_MODE=cognito");
        json(response, 200, {
          mode: "cognito",
          clientId: required("COGNITO_APP_CLIENT_ID"),
          authorizationEndpoint: `${cognitoDomain}/oauth2/authorize`,
          tokenEndpoint: `${cognitoDomain}/oauth2/token`,
          logoutEndpoint: `${cognitoDomain}/logout`,
          callbackUri: process.env.COGNITO_CALLBACK_URL ?? `${url.origin}/`,
          logoutUri: process.env.COGNITO_LOGOUT_URL ?? `${url.origin}/`,
          scopes: ["openid", "email", "profile"],
        });
      }
      return;
    }
    if (url.pathname.startsWith("/api/")) {
      const membership = await membershipFor(request);
      if (!membership) {
        const failure = publicApiError(new ApiError(401, cognito ? "MEMBERSHIP_REQUIRED" : "LOCAL_IDENTITY_REQUIRED"), traceId);
        json(response, failure.status, failure.body, traceId);
        return;
      }
      if (url.pathname.startsWith("/api/platform/")) {
        const failure = publicApiError(new ApiError(403, "PLATFORM_CREDENTIAL_REQUIRED"), traceId);
        json(response, failure.status, failure.body, traceId);
        return;
      }
      if (url.pathname === "/api/v1/session" && request.method === "GET") {
        if (isGlobalMembership(membership)) {
          json(response, 200, { membership, tenant: await database.tenantSummary(membership) });
        } else {
          json(response, 200, { tenantId: membership.tenantId, branchIds: membership.branchIds });
        }
        return;
      }
      if (url.pathname === "/api/v1/admin/business-settings" && request.method === "GET" && isGlobalMembership(membership)) {
        json(response, 200, await businessSettings.get(membership, url.searchParams.get("branchId") ?? undefined), traceId);
        return;
      }
      if (url.pathname === "/api/v1/admin/business-settings" && request.method === "PATCH" && isGlobalMembership(membership)) {
        const input = await body(request); const branchId = typeof input.branchId === "string" ? input.branchId : undefined;
        json(response, 200, await businessSettings.save(membership, branchId, input), traceId);
        return;
      }
      if (url.pathname === "/api/v1/admin/business-settings/publish" && request.method === "POST" && isGlobalMembership(membership)) {
        const input = await body(request); const branchId = typeof input.branchId === "string" ? input.branchId : undefined;
        json(response, 200, await businessSettings.publish(membership, branchId, input, String(request.headers["idempotency-key"] ?? "")), traceId);
        return;
      }
      const settingsSnapshotRoute = url.pathname.match(/^\/api\/v1\/work-items\/([0-9a-f-]+)\/settings-snapshot$/i);
      if (settingsSnapshotRoute && request.method === "POST" && isGlobalMembership(membership)) {
        const input = await body(request); const branchId = String(input.branchId ?? "");
        json(response, 201, { snapshot: await businessSettings.snapshot(membership, settingsSnapshotRoute[1], branchId, String(request.headers["idempotency-key"] ?? "")) }, traceId);
        return;
      }
      if (url.pathname === "/api/v1/admin/roles" && request.method === "GET" && isGlobalMembership(membership)) {
        json(response, 200, await rolePermissions.list(membership, url.searchParams.get("search") ?? ""));
        return;
      }
      if (url.pathname === "/api/v1/admin/roles" && request.method === "POST" && isGlobalMembership(membership)) {
        const result = await rolePermissions.create(membership, await body(request), String(request.headers["idempotency-key"] ?? ""));
        json(response, result.replay ? 200 : 201, { role: result.role }, traceId);
        return;
      }
      const roleRoute = url.pathname.match(/^\/api\/v1\/admin\/roles\/([0-9a-f-]+)$/i);
      if (roleRoute && request.method === "PATCH" && isGlobalMembership(membership)) {
        json(response, 200, { role: await rolePermissions.update(membership, roleRoute[1], await body(request)) }, traceId);
        return;
      }
      const roleArchiveRoute = url.pathname.match(/^\/api\/v1\/admin\/roles\/([0-9a-f-]+)\/archive$/i);
      if (roleArchiveRoute && request.method === "POST" && isGlobalMembership(membership)) {
        const result = await rolePermissions.archive(membership, roleArchiveRoute[1], await body(request), String(request.headers["idempotency-key"] ?? ""));
        json(response, 200, { role: result.role }, traceId);
        return;
      }
      if (url.pathname === "/api/v1/search" && request.method === "GET") {
        requirePermission(membership, "global-search.use");
        json(response, 200, await database.globalSearch(membership, url.searchParams.get("query") ?? ""));
        return;
      }
      if (url.pathname === "/api/v1/admin/users" && request.method === "GET" && adminUsers && isGlobalMembership(membership)) {
        json(response, 200, await adminUsers.list(membership, parseUserListQuery(url.searchParams)));
        return;
      }
      if (url.pathname === "/api/v1/admin/users" && request.method === "POST" && adminUsers && isGlobalMembership(membership)) {
        const result = await adminUsers.create(membership, await body(request), String(request.headers["idempotency-key"] ?? ""));
        json(response, result.replay ? 200 : 201, { user: result.user });
        return;
      }
      const userRoute = url.pathname.match(/^\/api\/v1\/admin\/users\/([0-9a-f-]+)$/i);
      if (userRoute && request.method === "PATCH" && adminUsers && isGlobalMembership(membership)) {
        json(response, 200, { user: await adminUsers.update(membership, userRoute[1], await body(request)) });
        return;
      }
      const archiveRoute = url.pathname.match(/^\/api\/v1\/admin\/users\/([0-9a-f-]+)\/archive$/i);
      if (archiveRoute && request.method === "POST" && adminUsers && isGlobalMembership(membership)) {
        const input = await body(request);
        json(response, 200, { user: await adminUsers.archive(membership, archiveRoute[1], input, String(request.headers["idempotency-key"] ?? "")) });
        return;
      }
      const resendRoute = url.pathname.match(/^\/api\/v1\/admin\/users\/([0-9a-f-]+)\/resend-invite$/i);
      if (resendRoute && request.method === "POST" && adminUsers && isGlobalMembership(membership)) {
        json(response, 200, { user: await adminUsers.resendInvite(membership, resendRoute[1], await body(request), String(request.headers["idempotency-key"] ?? "")) });
        return;
      }
      const statusRoute = url.pathname.match(/^\/api\/v1\/admin\/users\/([0-9a-f-]+)\/status$/i);
      if (statusRoute && request.method === "POST" && adminUsers && isGlobalMembership(membership)) {
        json(response, 200, { user: await adminUsers.changeStatus(membership, statusRoute[1], await body(request), String(request.headers["idempotency-key"] ?? "")) });
        return;
      }
      if (url.pathname === "/api/v1/list-preferences/admin-users" && request.method === "GET" && isGlobalMembership(membership)) {
        requirePermission(membership, "membership.manage");
        json(response, 200, { preference: await database.getListPreference(membership, "admin-users") });
        return;
      }
      if (url.pathname === "/api/v1/list-preferences/admin-users" && request.method === "PUT" && isGlobalMembership(membership)) {
        requirePermission(membership, "membership.manage");
        const input = await body(request); const viewMode = String(input.viewMode ?? "");
        if (viewMode !== "grid" && viewMode !== "table") throw new ApiError(400, "VIEW_MODE_INVALID");
        json(response, 200, { preference: await database.saveListPreference(membership, "admin-users", viewMode) });
        return;
      }
      if (url.pathname === "/api/v1/admin/user-exports" && request.method === "POST" && adminUsers && isGlobalMembership(membership)) {
        requirePermission(membership, "membership.manage");
        const input = await body(request); const format = String(input.format ?? "").toUpperCase();
        if (format !== "PDF" && format !== "XLSX") throw new ApiError(400, "EXPORT_FORMAT_INVALID");
        const params = new URLSearchParams(); const rawQuery = input.query && typeof input.query === "object" ? input.query as Record<string, unknown> : {};
        for (const key of ["search", "status", "roleId", "branchId", "sort", "page", "pageSize"]) if (rawQuery[key] !== undefined) params.set(key, String(rawQuery[key]));
        const query = parseUserListQuery(params);
        const result = await database.createListExport(membership, "admin-users", format, query, String(request.headers["idempotency-key"] ?? ""));
        if (!result.replay || result.job.status === "PENDING") queueUserExport(membership, result.job.id, format, query);
        json(response, result.replay ? 200 : 202, { export: result.job }, traceId);
        return;
      }
      const userExportRoute = url.pathname.match(/^\/api\/v1\/admin\/user-exports\/([0-9a-f-]+)$/i);
      if (userExportRoute && request.method === "GET" && isGlobalMembership(membership)) {
        requirePermission(membership, "membership.manage");
        json(response, 200, { export: await database.getListExport(membership, userExportRoute[1]) });
        return;
      }
      const userExportDownloadRoute = url.pathname.match(/^\/api\/v1\/admin\/user-exports\/([0-9a-f-]+)\/download$/i);
      if (userExportDownloadRoute && request.method === "GET" && isGlobalMembership(membership)) {
        requirePermission(membership, "membership.manage");
        const artifact = await database.downloadListExport(membership, userExportDownloadRoute[1]);
        response.writeHead(200, { "content-type": artifact.mimeType, "content-disposition": `attachment; filename="${artifact.filename.replace(/["\r\n]/g, "")}"`, "cache-control": "private, no-store" });
        response.end(artifact.content);
        return;
      }
      if (url.pathname === "/api/v1/work-items" && request.method === "GET") {
        requirePermission(membership, "work-item.read");
        json(response, 200, await database.queryWorkItems(membership, parseListQuery(url.searchParams)));
        return;
      }
      if(url.pathname==="/api/v1/job-data-flow/jobs"&&request.method==="GET"){requirePermission(membership,"job.data-flow.read");json(response,200,await database.searchJobDataFlowJobs(membership,url.searchParams.get("search")??""),traceId);return;}
      if(url.pathname==="/api/v1/media/jobs"&&request.method==="GET"){requirePermission(membership,"media.read");json(response,200,await database.mediaJobs(membership,{visitDate:url.searchParams.get("visitDate")??"",search:url.searchParams.get("search")??"",branchId:url.searchParams.get("branchId")??undefined}),traceId);return;}
      if(url.pathname==="/api/v1/media"&&request.method==="GET"){requirePermission(membership,"media.read");json(response,200,await database.queryJobMedia(membership,parseMediaListQuery(url.searchParams)),traceId);return;}
      if(url.pathname==="/api/v1/estimates"&&request.method==="GET"){requirePermission(membership,"estimate.read");json(response,200,await database.queryEstimates(membership,url.searchParams.get("search")??"",url.searchParams.get("branchId")??""),traceId);return;}
      if(url.pathname==="/api/v1/estimates"&&request.method==="POST"){requirePermission(membership,"estimate.manage");const input=await body(request);const result=await database.createEstimateVersion(membership,{branchId:String(input.branchId??""),jobId:String(input.jobId??""),priorVersionId:input.priorVersionId?String(input.priorVersionId):undefined,notes:String(input.notes??""),totalMinor:String(input.totalMinor??""),validDays:Number(input.validDays??14)},String(request.headers["idempotency-key"]??""));json(response,result.replay?200:201,result,traceId);return;}
      const estimateDraft=url.pathname.match(/^\/api\/v1\/estimates\/([0-9a-f-]+)\/draft$/i);if(estimateDraft&&request.method==="POST"){requirePermission(membership,"estimate.manage");const input=await body(request);const result=await database.updateEstimateDraft(membership,estimateDraft[1],{version:Number(input.version),notes:String(input.notes??""),totalMinor:String(input.totalMinor??"")},String(request.headers["idempotency-key"]??""));json(response,result.replay?200:201,result,traceId);return;}
      const estimateSubmit=url.pathname.match(/^\/api\/v1\/estimates\/([0-9a-f-]+)\/submit$/i);if(estimateSubmit&&request.method==="POST"){requirePermission(membership,"estimate.submit");const input=await body(request);const result=await database.submitEstimate(membership,estimateSubmit[1],{version:Number(input.version),validDays:Number(input.validDays??14)},String(request.headers["idempotency-key"]??""));json(response,result.replay?200:201,result,traceId);return;}
      const estimateApprove=url.pathname.match(/^\/api\/v1\/estimates\/([0-9a-f-]+)\/approve$/i);if(estimateApprove&&request.method==="POST"){requirePermission(membership,"estimate.approve");const input=await body(request);const result=await database.approveEstimate(membership,estimateApprove[1],{version:Number(input.version),customerName:String(input.customerName??""),acknowledgement:String(input.acknowledgement??"")},String(request.headers["idempotency-key"]??""));json(response,result.replay?200:201,result,traceId);return;}
      const estimateDocument=url.pathname.match(/^\/api\/v1\/estimates\/([0-9a-f-]+)\/document$/i);if(estimateDocument&&request.method==="GET"){requirePermission(membership,"estimate.document.download");const artifact=createEstimateDocument(await database.getEstimateDocument(membership,estimateDocument[1]));response.writeHead(200,{"content-type":artifact.mimeType,"content-disposition":`attachment; filename="${artifact.filename.replace(/["\r\n]/g,"")}"`,"cache-control":"private, no-store"});response.end(artifact.content);return;}
      if(url.pathname==="/api/v1/tasks"&&request.method==="GET"){requirePermission(membership,"task.read");json(response,200,await database.queryTasks(membership),traceId);return;}
      const taskCommand=url.pathname.match(/^\/api\/v1\/tasks\/([0-9a-f-]+)\/(assign|start|pause|resume|complete|evidence)$/i);if(taskCommand&&request.method==="POST"){const action=taskCommand[2].toUpperCase();requirePermission(membership,action==="ASSIGN"?"task.assign":action==="EVIDENCE"?"task.evidence.write":"task.execute");const input=await body(request);const key=String(request.headers["idempotency-key"]??"");const result=action==="ASSIGN"?await database.assignTask(membership,taskCommand[1],{version:Number(input.version),technicianId:String(input.technicianId??"")},key):await database.commandTask(membership,taskCommand[1],{action,version:Number(input.version),reason:String(input.reason??""),checklistKey:input.checklistKey?String(input.checklistKey):undefined,evidenceId:input.evidenceId?String(input.evidenceId):undefined},key);json(response,result.replay?200:201,result,traceId);return;}
      if(url.pathname==="/api/v1/qc"&&request.method==="GET"){requirePermission(membership,"qc.read");json(response,200,await database.queryQc(membership),traceId);return;}
      const qcInspection=url.pathname.match(/^\/api\/v1\/tasks\/([0-9a-f-]+)\/qc-inspections$/i);if(qcInspection&&request.method==="POST"){requirePermission(membership,"qc.inspect");const input=await body(request);const items=Array.isArray(input.items)?input.items.map((raw:any)=>({key:String(raw?.key??""),status:String(raw?.status??""),notes:String(raw?.notes??"")})):[];const result=await database.inspectQc(membership,qcInspection[1],{version:Number(input.version),result:String(input.result??""),reason:String(input.reason??""),items},String(request.headers["idempotency-key"]??""));json(response,result.replay?200:201,result,traceId);return;}
      const reworkCommand=url.pathname.match(/^\/api\/v1\/reworks\/([0-9a-f-]+)\/(assign|completion|reinspection)$/i);if(reworkCommand&&request.method==="POST"){const action=reworkCommand[2]==="completion"?"COMPLETE":reworkCommand[2].toUpperCase();requirePermission(membership,action==="ASSIGN"?"rework.assign":action==="REINSPECTION"?"qc.inspect":"rework.execute");const input=await body(request);const items=Array.isArray(input.items)?input.items.map((raw:any)=>({key:String(raw?.key??""),status:String(raw?.status??""),notes:String(raw?.notes??"")})):undefined;const result=await database.commandReworkVerified(membership,reworkCommand[1],{action:action==="REINSPECTION"?"REINSPECT":action,version:Number(input.version),reason:String(input.reason??""),technicianId:input.technicianId?String(input.technicianId):undefined,evidenceId:input.evidenceId?String(input.evidenceId):undefined,result:input.result?String(input.result):undefined,items},String(request.headers["idempotency-key"]??""));json(response,result.replay?200:201,result,traceId);return;}
      if(url.pathname==="/api/v1/media"&&request.method==="POST"){requirePermission(membership,"media.upload");const input=await body(request,maxMediaRequestBytes);const encoded=String(input.contentBase64??"");if(!/^[A-Za-z0-9+/]*={0,2}$/.test(encoded)||!encoded)throw new ApiError(422,"MEDIA_FILE_INVALID");const content=Buffer.from(encoded,"base64");const mimeType=String(input.mimeType??"");if(content.toString("base64").replace(/=+$/,"")!==encoded.replace(/=+$/,"")||!validMediaSignature(content,mimeType))throw new ApiError(422,"MEDIA_FILE_INVALID");const result=await database.createJobMedia(membership,{jobId:String(input.jobId??""),branchId:String(input.branchId??""),category:String(input.category??"") as MediaCategory,label:String(input.label??""),fileName:String(input.fileName??""),mimeType,byteLength:content.length,checksumSha256:createHash("sha256").update(content).digest("hex"),thumbnail:thumbnailPng},String(request.headers["idempotency-key"]??""));if(!result.replay){try{await putPrivateObject(result.objectKey,content);}catch(error){await database.recordJobMediaScan(membership,result.media.id,"FAILED","object-store-write-failed");throw error;}}const media=result.replay?await database.getJobMedia(membership,result.media.id):result.media;if(media.scanStatus==="FAILED")throw new ApiError(409,"MEDIA_UPLOAD_FAILED");json(response,result.replay?200:201,{media},traceId);return;}
      const mediaArchiveRoute=url.pathname.match(/^\/api\/v1\/media\/([0-9a-f-]+)\/archive$/i);if(mediaArchiveRoute&&request.method==="POST"){requirePermission(membership,"media.archive");const input=await body(request);const result=await database.archiveJobMedia(membership,mediaArchiveRoute[1],{version:Number(input.version),reason:String(input.reason??"")},String(request.headers["idempotency-key"]??""));json(response,200,result,traceId);return;}
      const mediaScanRoute=url.pathname.match(/^\/api\/v1\/internal\/media\/([0-9a-f-]+)\/scan$/i);if(mediaScanRoute&&request.method==="POST"){if(!trustedScannerToken(request.headers["x-workshopos-scanner-token"]))throw new ApiError(403,"SCANNER_AUTHORITY_REQUIRED");const input=await body(request);const status=String(input.status??"");if(!["CLEAN","INFECTED","FAILED"].includes(status))throw new ApiError(422,"MEDIA_SCAN_RESULT_INVALID");json(response,200,await database.recordJobMediaScan(membership,mediaScanRoute[1],status as "CLEAN"|"INFECTED"|"FAILED",String(input.scannerReference??"")),traceId);return;}
      const mediaAccessRoute=url.pathname.match(/^\/api\/v1\/media\/([0-9a-f-]+)\/(view|download)$/i);if(mediaAccessRoute&&request.method==="GET"){requirePermission(membership,"media.download");const artifact=await database.authorizeJobMediaAccess(membership,mediaAccessRoute[1]);let content:Buffer;try{content=await readFile(privateObjectPath(artifact.objectKey));}catch{throw new ApiError(404,"MEDIA_OBJECT_NOT_FOUND");}response.writeHead(200,{"content-type":artifact.mimeType,"content-disposition":mediaAccessRoute[2]==="download"?`attachment; filename="${artifact.fileName.replace(/["\r\n]/g,"")}"`:`inline; filename="${artifact.fileName.replace(/["\r\n]/g,"")}"`,"cache-control":"private, no-store","x-content-type-options":"nosniff"});response.end(content);return;}
      if(url.pathname==="/api/v1/jobs"&&request.method==="GET"){requirePermission(membership,"job.read");json(response,200,await database.queryJobs(membership,parseJobListQuery(url.searchParams)),traceId);return;}
      const jobRoute=url.pathname.match(/^\/api\/v1\/jobs\/([0-9a-f-]+)$/i);if(jobRoute&&request.method==="GET"){requirePermission(membership,"job.read");json(response,200,{job:await database.getJob(membership,jobRoute[1])},traceId);return;}
      const billingJobRoute=url.pathname.match(/^\/api\/v1\/billing\/jobs\/([0-9a-f-]+)$/i);if(billingJobRoute&&request.method==="GET"){requirePermission(membership,"billing.read");json(response,200,{billing:await database.getBillingJob(membership,billingJobRoute[1])},traceId);return;}
      const billingInvoiceRoute=url.pathname.match(/^\/api\/v1\/billing\/jobs\/([0-9a-f-]+)\/invoice\/finalize$/i);if(billingInvoiceRoute&&request.method==="POST"){requirePermission(membership,"invoice.finalize");const input=await body(request);const result=await database.finalizeJobInvoice(membership,billingInvoiceRoute[1],{version:Number(input.version)},String(request.headers["idempotency-key"]??""));json(response,result.replay?200:201,result,traceId);return;}
      const billingAcceptedRoute=url.pathname.match(/^\/api\/v1\/billing\/jobs\/([0-9a-f-]+)\/work-accepted$/i);if(billingAcceptedRoute&&request.method==="POST"){requirePermission(membership,"job.work-acceptance.record");const input=await body(request);const result=await database.recordWorkAccepted(membership,billingAcceptedRoute[1],{version:Number(input.version),customerName:String(input.customerName??""),acknowledgement:String(input.acknowledgement??"")},String(request.headers["idempotency-key"]??""));json(response,result.replay?200:201,result,traceId);return;}
      const billingPaymentRoute=url.pathname.match(/^\/api\/v1\/billing\/jobs\/([0-9a-f-]+)\/payments$/i);if(billingPaymentRoute&&request.method==="POST"){requirePermission(membership,"payment.record");const input=await body(request);const result=await database.recordJobPayment(membership,billingPaymentRoute[1],{version:Number(input.version),amountMinor:String(input.amountMinor??""),mode:String(input.mode??""),reference:String(input.reference??"")},String(request.headers["idempotency-key"]??""));json(response,result.replay?200:201,result,traceId);return;}
      const paymentCorrectionRoute=url.pathname.match(/^\/api\/v1\/billing\/payments\/([0-9a-f-]+)\/corrections$/i);if(paymentCorrectionRoute&&request.method==="POST"){requirePermission(membership,"payment.correction.request");const input=await body(request);const result=await database.requestPaymentCorrection(membership,paymentCorrectionRoute[1],{amountMinor:String(input.amountMinor??""),reason:String(input.reason??"")},String(request.headers["idempotency-key"]??""));json(response,result.replay?200:201,result,traceId);return;}
      const invoiceCorrectionRoute=url.pathname.match(/^\/api\/v1\/billing\/invoices\/([0-9a-f-]+)\/corrections$/i);if(invoiceCorrectionRoute&&request.method==="POST"){requirePermission(membership,"invoice.correction.request");const input=await body(request);const result=await database.requestInvoiceCorrection(membership,invoiceCorrectionRoute[1],{amountMinor:String(input.amountMinor??""),reason:String(input.reason??"")},String(request.headers["idempotency-key"]??""));json(response,result.replay?200:201,result,traceId);return;}
      const approveInvoiceCorrectionRoute=url.pathname.match(/^\/api\/v1\/billing\/invoice-corrections\/([0-9a-f-]+)\/approve$/i);if(approveInvoiceCorrectionRoute&&request.method==="POST"){requirePermission(membership,"invoice.correction.approve");const input=await body(request);const result=await database.approveInvoiceCorrection(membership,approveInvoiceCorrectionRoute[1],{version:Number(input.version)},String(request.headers["idempotency-key"]??""));json(response,200,result,traceId);return;}
      const approvePaymentCorrectionRoute=url.pathname.match(/^\/api\/v1\/billing\/payment-corrections\/([0-9a-f-]+)\/approve$/i);if(approvePaymentCorrectionRoute&&request.method==="POST"){requirePermission(membership,"payment.correction.approve");const input=await body(request);const result=await database.approvePaymentCorrection(membership,approvePaymentCorrectionRoute[1],{version:Number(input.version)},String(request.headers["idempotency-key"]??""));json(response,200,result,traceId);return;}
      const billingDeliveryRoute=url.pathname.match(/^\/api\/v1\/billing\/jobs\/([0-9a-f-]+)\/delivery-evidence$/i);if(billingDeliveryRoute&&request.method==="POST"){requirePermission(membership,"delivery.record");const input=await body(request);const result=await database.recordDeliveryEvidence(membership,billingDeliveryRoute[1],{version:Number(input.version),finalOdometerKm:Number(input.finalOdometerKm),deliveredToName:String(input.deliveredToName??""),identityType:String(input.identityType??""),identityLast4:String(input.identityLast4??""),acknowledgement:String(input.acknowledgement??"")},String(request.headers["idempotency-key"]??""));json(response,result.replay?200:201,result,traceId);return;}
      const billingGateRoute=url.pathname.match(/^\/api\/v1\/billing\/jobs\/([0-9a-f-]+)\/gate-pass$/i);if(billingGateRoute&&request.method==="POST"){requirePermission(membership,"gate-pass.issue");const input=await body(request);const result=await database.issueGatePass(membership,billingGateRoute[1],{version:Number(input.version),validUntil:String(input.validUntil??"")},String(request.headers["idempotency-key"]??""));json(response,result.replay?200:201,result,traceId);return;}
      const billingReleaseRoute=url.pathname.match(/^\/api\/v1\/billing\/gate-passes\/([0-9a-f-]+)\/release$/i);if(billingReleaseRoute&&request.method==="POST"){requirePermission(membership,"gate-pass.verify");const input=await body(request);const result=await database.releaseGatePass(membership,billingReleaseRoute[1],{version:Number(input.version),registration:String(input.registration??""),verificationMode:String(input.verificationMode??""),evidence:String(input.evidence??"")},String(request.headers["idempotency-key"]??""));json(response,200,result,traceId);return;}
      const billingCloseRoute=url.pathname.match(/^\/api\/v1\/billing\/jobs\/([0-9a-f-]+)\/close$/i);if(billingCloseRoute&&request.method==="POST"){requirePermission(membership,"job.close");const input=await body(request);const result=await database.closeDeliveredJob(membership,billingCloseRoute[1],{version:Number(input.version)},String(request.headers["idempotency-key"]??""));json(response,200,result,traceId);return;}
      const jobLifecycleRoute=url.pathname.match(/^\/api\/v1\/jobs\/([0-9a-f-]+)\/lifecycle$/i);
      if(jobLifecycleRoute&&request.method==="GET"){requirePermission(membership,"job.read");json(response,200,{lifecycle:await database.getJobLifecycle(membership,jobLifecycleRoute[1])},traceId);return;}
      if(jobLifecycleRoute&&request.method==="POST"){const input=await body(request);const command=String(input.command??"");const factPermission:Record<string,string>={RECORD_ESTIMATE_APPROVED:"job.estimate-approval.record",RECORD_WORK_ACCEPTED:"job.work-acceptance.record",RECORD_PAYMENT_CLEARED:"job.payment-clearance.record"};requirePermission(membership,factPermission[command]??"job.lifecycle.manage");const reason=String(input.reason??"");const evidence=input.evidence&&typeof input.evidence==="object"&&!Array.isArray(input.evidence)?input.evidence as Record<string,unknown>:command.startsWith("RECORD_")&&reason.trim()?{note:reason.trim()}:{};const result=await database.commandJobLifecycle(membership,jobLifecycleRoute[1],{command,version:Number(input.version),reason,evidence},String(request.headers["idempotency-key"]??""));json(response,result.replay?200:201,result,traceId);return;}
      const jobDataFlowRoute=url.pathname.match(/^\/api\/v1\/jobs\/([0-9a-f-]+)\/data-flow$/i);if(jobDataFlowRoute&&request.method==="GET"){requirePermission(membership,"job.data-flow.read");json(response,200,{dataFlow:await database.getJobDataFlow(membership,jobDataFlowRoute[1])},traceId);return;}
      const jobCardRoute=url.pathname.match(/^\/api\/v1\/jobs\/([0-9a-f-]+)\/job-card$/i);if(jobCardRoute&&request.method==="GET"){requirePermission(membership,"job.document.download");const artifact=createJobCardPdf(await database.getJob(membership,jobCardRoute[1]));response.writeHead(200,{"content-type":artifact.mimeType,"content-disposition":`attachment; filename="${artifact.filename.replace(/["\r\n]/g,"")}"`,"cache-control":"private, no-store"});response.end(artifact.content);return;}
      const jobDocumentRoute=url.pathname.match(/^\/api\/v1\/job-documents\/([0-9a-f-]+)\/download$/i);if(jobDocumentRoute&&request.method==="GET"){requirePermission(membership,"job.document.download");const artifact=await database.downloadJobDocument(membership,jobDocumentRoute[1]);response.writeHead(200,{"content-type":artifact.mimeType,"content-disposition":`attachment; filename="${artifact.filename.replace(/["\r\n]/g,"")}"`,"cache-control":"private, no-store"});response.end(artifact.content);return;}
      if(url.pathname==="/api/v1/list-preferences/jobs"&&request.method==="GET"){requirePermission(membership,"job.read");json(response,200,{preference:await database.getListPreference(membership,"jobs")},traceId);return;}
      if(url.pathname==="/api/v1/list-preferences/jobs"&&request.method==="PUT"){requirePermission(membership,"job.read");const input=await body(request);const viewMode=String(input.viewMode??"");if(viewMode!=="grid"&&viewMode!=="table")throw new ApiError(400,"VIEW_MODE_INVALID");json(response,200,{preference:await database.saveListPreference(membership,"jobs",viewMode)},traceId);return;}
      if(url.pathname==="/api/v1/job-exports"&&request.method==="POST"){requirePermission(membership,"job.export");const input=await body(request);const format=String(input.format??"").toUpperCase();if(format!=="PDF"&&format!=="XLSX")throw new ApiError(400,"EXPORT_FORMAT_INVALID");const query=jobQueryFromJson(input.query);const result=await database.createListExport(membership,"jobs",format,query as any,String(request.headers["idempotency-key"]??""));if(!result.replay||result.job.status==="PENDING")queueJobExport(membership,result.job.id,format,query);json(response,result.replay?200:202,{export:result.job},traceId);return;}
      const jobExportRoute=url.pathname.match(/^\/api\/v1\/job-exports\/([0-9a-f-]+)$/i);if(jobExportRoute&&request.method==="GET"){requirePermission(membership,"job.export");const job=await database.getListExport(membership,jobExportRoute[1]);if(job.screenKey!=="jobs")throw new ApiError(404,"EXPORT_NOT_FOUND");json(response,200,{export:job},traceId);return;}
      const jobExportDownload=url.pathname.match(/^\/api\/v1\/job-exports\/([0-9a-f-]+)\/download$/i);if(jobExportDownload&&request.method==="GET"){requirePermission(membership,"job.export");const job=await database.getListExport(membership,jobExportDownload[1]);if(job.screenKey!=="jobs")throw new ApiError(404,"EXPORT_NOT_FOUND");const artifact=await database.downloadListExport(membership,jobExportDownload[1]);response.writeHead(200,{"content-type":artifact.mimeType,"content-disposition":`attachment; filename="${artifact.filename.replace(/["\r\n]/g,"")}"`,"cache-control":"private, no-store"});response.end(artifact.content);return;}
      if (url.pathname === "/api/v1/customers" && request.method === "GET") { requirePermission(membership, "customer.read"); json(response, 200, await database.queryCustomers(membership, parseListQuery(url.searchParams)), traceId); return; }
      if (url.pathname === "/api/v1/customers" && request.method === "POST") { requirePermission(membership, "customer.manage"); const input = await body(request); json(response, 201, await database.createCustomer(membership, { branchId: String(input.branchId ?? ""), displayName: String(input.displayName ?? ""), mobile: String(input.mobile ?? ""), email: String(input.email ?? "") }, String(request.headers["idempotency-key"] ?? "")), traceId); return; }
      const customerRoute = url.pathname.match(/^\/api\/v1\/customers\/([0-9a-f-]+)$/i);
      if (customerRoute && request.method === "GET") { requirePermission(membership, "customer.read"); json(response, 200, { customer: await database.getCustomer(membership, customerRoute[1]) }, traceId); return; }
      if (customerRoute && request.method === "PATCH") { requirePermission(membership, "customer.manage"); const input = await body(request); json(response, 200, { customer: await database.updateCustomer(membership, customerRoute[1], { displayName: String(input.displayName ?? ""), mobile: String(input.mobile ?? ""), email: String(input.email ?? ""), version: Number(input.version) }) }, traceId); return; }
      if (url.pathname === "/api/v1/vehicles" && request.method === "GET") { requirePermission(membership, "vehicle.read"); json(response, 200, await database.queryVehicles(membership, parseListQuery(url.searchParams)), traceId); return; }
      if (url.pathname === "/api/v1/vehicles" && request.method === "POST") { requirePermission(membership, "vehicle.manage"); const input = await body(request); json(response, 201, await database.createVehicle(membership, { branchId: String(input.branchId ?? ""), registration: String(input.registration ?? ""), vin: String(input.vin ?? ""), make: String(input.make ?? ""), model: String(input.model ?? ""), ownerCustomerId: String(input.ownerCustomerId ?? "") }, String(request.headers["idempotency-key"] ?? "")), traceId); return; }
      const vehicleRoute = url.pathname.match(/^\/api\/v1\/vehicles\/([0-9a-f-]+)$/i);
      if (vehicleRoute && request.method === "GET") { requirePermission(membership, "vehicle.read"); json(response, 200, { vehicle: await database.getVehicle(membership, vehicleRoute[1]) }, traceId); return; }
      if (vehicleRoute && request.method === "PATCH") { requirePermission(membership, "vehicle.manage"); const input = await body(request); json(response, 200, { vehicle: await database.updateVehicle(membership, vehicleRoute[1], { registration: String(input.registration ?? ""), vin: String(input.vin ?? ""), make: String(input.make ?? ""), model: String(input.model ?? ""), ownerCustomerId: String(input.ownerCustomerId ?? ""), version: Number(input.version) }) }, traceId); return; }
      const identityPreference = url.pathname.match(/^\/api\/v1\/list-preferences\/(customers|vehicles)$/);
      if (identityPreference && request.method === "GET") { requirePermission(membership, identityPreference[1] === "customers" ? "customer.read" : "vehicle.read"); json(response, 200, { preference: await database.getListPreference(membership, identityPreference[1]) }, traceId); return; }
      if (identityPreference && request.method === "PUT") { requirePermission(membership, identityPreference[1] === "customers" ? "customer.read" : "vehicle.read"); const input = await body(request); const viewMode = String(input.viewMode ?? ""); if (viewMode !== "grid" && viewMode !== "table") throw new ApiError(400, "VIEW_MODE_INVALID"); json(response, 200, { preference: await database.saveListPreference(membership, identityPreference[1], viewMode) }, traceId); return; }
      if (url.pathname === "/api/v1/customer-vehicle-exports" && request.method === "POST") { const input = await body(request); const screen = String(input.screen ?? "") as "customers" | "vehicles"; if (screen !== "customers" && screen !== "vehicles") throw new ApiError(400, "EXPORT_SCREEN_INVALID"); requirePermission(membership, screen === "customers" ? "customer.export" : "vehicle.export"); const format = String(input.format ?? "").toUpperCase(); if (format !== "PDF" && format !== "XLSX") throw new ApiError(400, "EXPORT_FORMAT_INVALID"); const query = queryFromJson(input.query); const result = await database.createListExport(membership, screen, format, query, String(request.headers["idempotency-key"] ?? "")); if (!result.replay || result.job.status === "PENDING") queueCustomerVehicleExport(membership, result.job.id, screen, format, query); json(response, result.replay ? 200 : 202, { export: result.job }, traceId); return; }
      const identityExportRoute = url.pathname.match(/^\/api\/v1\/customer-vehicle-exports\/([0-9a-f-]+)$/i); if (identityExportRoute && request.method === "GET") { if (!hasPermission(membership, "customer.export") && !hasPermission(membership, "vehicle.export")) throw new ApiError(403, "PERMISSION_DENIED"); const job = await database.getListExport(membership, identityExportRoute[1]); requirePermission(membership, job.screenKey === "customers" ? "customer.export" : "vehicle.export"); json(response, 200, { export: job }, traceId); return; }
      const identityExportDownload = url.pathname.match(/^\/api\/v1\/customer-vehicle-exports\/([0-9a-f-]+)\/download$/i); if (identityExportDownload && request.method === "GET") { if (!hasPermission(membership, "customer.export") && !hasPermission(membership, "vehicle.export")) throw new ApiError(403, "PERMISSION_DENIED"); const job = await database.getListExport(membership, identityExportDownload[1]); requirePermission(membership, job.screenKey === "customers" ? "customer.export" : "vehicle.export"); const artifact = await database.downloadListExport(membership, identityExportDownload[1]); response.writeHead(200, { "content-type": artifact.mimeType, "content-disposition": `attachment; filename="${artifact.filename.replace(/["\r\n]/g, "")}"`, "cache-control": "private, no-store" }); response.end(artifact.content); return; }
      if (url.pathname === "/api/v1/inventory" && request.method === "GET") { requirePermission(membership, "inventory.read"); json(response, 200, await database.queryInventory(membership, parseListQuery(url.searchParams)), traceId); return; }
      if (url.pathname === "/api/v1/inventory/receipts" && request.method === "POST") { requirePermission(membership, "inventory.operate"); const input = await body(request); const result = await database.receiveInventory(membership, { branchId: String(input.branchId ?? ""), warehouseId: String(input.warehouseId ?? ""), itemId: String(input.itemId ?? ""), quantity: String(input.quantity ?? ""), valueMinor: String(input.valueMinor ?? ""), reason: String(input.reason ?? "") }, String(request.headers["idempotency-key"] ?? "")); json(response, result.replay ? 200 : 201, { receipt: result }, traceId); return; }
      if (url.pathname === "/api/v1/inventory/imports" && request.method === "POST") { requirePermission(membership, "inventory.import"); const input = await body(request); const result = await database.stageInventoryImport(membership, { branchId: String(input.branchId ?? ""), filename: String(input.filename ?? ""), rows: input.rows }, String(request.headers["idempotency-key"] ?? "")); json(response, result.replay ? 200 : 201, { import: result.import }, traceId); return; }
      const inventoryImportRoute = url.pathname.match(/^\/api\/v1\/inventory\/imports\/([0-9a-f-]+)$/i); if (inventoryImportRoute && request.method === "GET") { requirePermission(membership, "inventory.import"); json(response, 200, { import: await database.getInventoryImport(membership, inventoryImportRoute[1]) }, traceId); return; }
      const inventoryImportCommit = url.pathname.match(/^\/api\/v1\/inventory\/imports\/([0-9a-f-]+)\/commit$/i); if (inventoryImportCommit && request.method === "POST") { requirePermission(membership, "inventory.import"); const input = await body(request); const result = await database.commitInventoryImport(membership, inventoryImportCommit[1], { version: Number(input.version) }, String(request.headers["idempotency-key"] ?? "")); json(response, 200, result, traceId); return; }
      const inventoryImportManifest = url.pathname.match(/^\/api\/v1\/inventory\/imports\/([0-9a-f-]+)\/error-manifest$/i); if (inventoryImportManifest && request.method === "GET") { requirePermission(membership, "inventory.import"); const artifact = await database.downloadInventoryImportErrors(membership, inventoryImportManifest[1]); response.writeHead(200, { "content-type": artifact.mimeType, "content-disposition": `attachment; filename="${artifact.filename.replace(/["\r\n]/g, "")}"`, "cache-control": "private, no-store" }); response.end(artifact.content); return; }
      const inventoryPreference = url.pathname === "/api/v1/list-preferences/inventory"; if (inventoryPreference && request.method === "GET") { requirePermission(membership, "inventory.read"); json(response, 200, { preference: await database.getListPreference(membership, "inventory") }, traceId); return; } if (inventoryPreference && request.method === "PUT") { requirePermission(membership, "inventory.read"); const input = await body(request); const viewMode = String(input.viewMode ?? ""); if (viewMode !== "grid" && viewMode !== "table") throw new ApiError(400, "VIEW_MODE_INVALID"); json(response, 200, { preference: await database.saveListPreference(membership, "inventory", viewMode) }, traceId); return; }
      if (url.pathname === "/api/v1/inventory-exports" && request.method === "POST") { requirePermission(membership, "inventory.export"); const input = await body(request); const format = String(input.format ?? "").toUpperCase(); if (format !== "PDF" && format !== "XLSX") throw new ApiError(400, "EXPORT_FORMAT_INVALID"); const query = queryFromJson(input.query); const result = await database.createListExport(membership, "inventory", format, query, String(request.headers["idempotency-key"] ?? "")); if (!result.replay || result.job.status === "PENDING") queueInventoryExport(membership, result.job.id, format, query); json(response, result.replay ? 200 : 202, { export: result.job }, traceId); return; }
      const inventoryExportRoute = url.pathname.match(/^\/api\/v1\/inventory-exports\/([0-9a-f-]+)$/i); if (inventoryExportRoute && request.method === "GET") { requirePermission(membership, "inventory.export"); const job = await database.getListExport(membership, inventoryExportRoute[1]); if (job.screenKey !== "inventory") throw new ApiError(404, "EXPORT_NOT_FOUND"); json(response, 200, { export: job }, traceId); return; }
      const inventoryExportDownload = url.pathname.match(/^\/api\/v1\/inventory-exports\/([0-9a-f-]+)\/download$/i); if (inventoryExportDownload && request.method === "GET") { requirePermission(membership, "inventory.export"); const job = await database.getListExport(membership, inventoryExportDownload[1]); if (job.screenKey !== "inventory") throw new ApiError(404, "EXPORT_NOT_FOUND"); const artifact = await database.downloadListExport(membership, inventoryExportDownload[1]); response.writeHead(200, { "content-type": artifact.mimeType, "content-disposition": `attachment; filename="${artifact.filename.replace(/["\r\n]/g, "")}"`, "cache-control": "private, no-store" }); response.end(artifact.content); return; }
      if (url.pathname === "/api/v1/work-items" && request.method === "POST") {
        requirePermission(membership, "work-item.manage");
        const input = await body(request);
        const result = await database.createWorkItem(
          membership,
          { branchId: String(input.branchId ?? ""), summary: String(input.summary ?? "") },
          String(request.headers["idempotency-key"] ?? ""),
        );
        json(response, result.status, result.body);
        return;
      }
      const workItemRoute = url.pathname.match(/^\/api\/v1\/work-items\/([0-9a-f-]+)$/i);
      if (workItemRoute && request.method === "PATCH") {
        requirePermission(membership, "work-item.manage");
        const input = await body(request);
        json(response, 200, { workItem: await database.updateWorkItem(membership, workItemRoute[1], {
          summary: String(input.summary ?? ""), version: Number(input.version),
        }) }, traceId);
        return;
      }
      const archiveWorkItemRoute = url.pathname.match(/^\/api\/v1\/work-items\/([0-9a-f-]+)\/archive$/i);
      if (archiveWorkItemRoute && request.method === "POST") {
        requirePermission(membership, "work-item.manage");
        const input = await body(request);
        const result = await database.archiveWorkItem(membership, archiveWorkItemRoute[1], {
          reason: String(input.reason ?? ""), version: Number(input.version),
        }, String(request.headers["idempotency-key"] ?? ""));
        json(response, result.status, result.body, traceId);
        return;
      }
      if (url.pathname === "/api/v1/list-preferences/work-items" && request.method === "GET") {
        requirePermission(membership, "work-item.read");
        json(response, 200, { preference: await database.getListPreference(membership, "work-items") });
        return;
      }
      if (url.pathname === "/api/v1/list-preferences/work-items" && request.method === "PUT") {
        requirePermission(membership, "work-item.read");
        const input = await body(request); const viewMode = String(input.viewMode ?? "");
        if (viewMode !== "grid" && viewMode !== "table") throw new ApiError(400, "VIEW_MODE_INVALID");
        json(response, 200, { preference: await database.saveListPreference(membership, "work-items", viewMode) });
        return;
      }
      if (url.pathname === "/api/v1/work-item-exports" && request.method === "POST") {
        requirePermission(membership, "work-item.export");
        const input = await body(request); const format = String(input.format ?? "").toUpperCase();
        if (format !== "PDF" && format !== "XLSX") throw new ApiError(400, "EXPORT_FORMAT_INVALID");
        const query = queryFromJson(input.query);
        const result = await database.createListExport(membership, "work-items", format, query, String(request.headers["idempotency-key"] ?? ""));
        if (!result.replay || result.job.status === "PENDING") queueWorkItemExport(membership, result.job.id, format, query);
        json(response, result.replay ? 200 : 202, { export: result.job }, traceId);
        return;
      }
      const listExportRoute = url.pathname.match(/^\/api\/v1\/work-item-exports\/([0-9a-f-]+)$/i);
      if (listExportRoute && request.method === "GET") {
        requirePermission(membership, "work-item.export");
        json(response, 200, { export: await database.getListExport(membership, listExportRoute[1]) });
        return;
      }
      const listExportDownloadRoute = url.pathname.match(/^\/api\/v1\/work-item-exports\/([0-9a-f-]+)\/download$/i);
      if (listExportDownloadRoute && request.method === "GET") {
        requirePermission(membership, "work-item.export");
        const artifact = await database.downloadListExport(membership, listExportDownloadRoute[1]);
        response.writeHead(200, { "content-type": artifact.mimeType, "content-disposition": `attachment; filename="${artifact.filename.replace(/["\r\n]/g, "")}"`, "cache-control": "private, no-store" });
        response.end(artifact.content); return;
      }
      const missing = publicApiError(new ApiError(404, "NOT_FOUND"), traceId);
      json(response, missing.status, missing.body, traceId);
      return;
    }
    await staticFile(url.pathname, response);
  } catch (error) {
    const failure = publicApiError(error, traceId);
    console.error(JSON.stringify({ event: "api.request.failed", traceId, code: failure.body.code, status: failure.status }));
    json(response, failure.status, failure.body, traceId);
  }
});

server.listen(port, host, () => console.log(`WorkshopOS local stack listening on http://${host}:${port}`));

async function shutdown() {
  server.close();
  await database.close();
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
