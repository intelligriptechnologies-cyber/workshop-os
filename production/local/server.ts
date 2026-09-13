import { createReadStream } from "node:fs";
import { access, stat } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import path from "node:path";

import { memberships, PostgresVertical } from "./database.js";
import { CognitoGateway } from "./cognito.js";
import { AdminUserService, ApiError, type AuthenticatedMembership } from "../src/admin-users.js";
import { publicApiError } from "../src/http-errors.js";
import { parseListQuery, type ServerListQuery } from "../src/server-list-contract.js";
import { createWorkItemExportArtifact } from "../src/work-item-export.js";

const host = process.env.HOST ?? "127.0.0.1";
const port = Number(process.env.PORT ?? 4173);
const dist = path.resolve("dist");
const database = new PostgresVertical();
const identityMode = process.env.IDENTITY_MODE ?? (process.env.COGNITO_USER_POOL_ID ? "cognito" : "local");
const cognitoDomain = process.env.COGNITO_DOMAIN?.replace(/\/$/, "");
const cognito = identityMode === "cognito" ? new CognitoGateway(
  required("COGNITO_USER_POOL_ID"), required("COGNITO_APP_CLIENT_ID"), required("AWS_REGION"),
) : undefined;
const adminUsers = cognito ? new AdminUserService(database, cognito) : undefined;

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required when IDENTITY_MODE=cognito`);
  return value;
}

function json(response: ServerResponse, status: number, body: unknown, traceId?: string): void {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8", ...(traceId ? { "x-trace-id": traceId } : {}) });
  response.end(JSON.stringify(body));
}

async function body(request: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) chunks.push(Buffer.from(chunk));
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
  return typeof identity === "string" ? memberships[identity] : undefined;
}

function isGlobalMembership(value: unknown): value is AuthenticatedMembership {
  return Boolean(value && typeof value === "object" && "permissions" in value && "roles" in value);
}

function hasPermission(membership: { permissions?: string[] }, permission: string): boolean {
  return Boolean(membership.permissions?.includes(permission) || membership.permissions?.includes("membership.manage"));
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
      if (url.pathname === "/api/v1/admin/users" && request.method === "GET" && adminUsers && isGlobalMembership(membership)) {
        json(response, 200, await adminUsers.list(membership));
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
        json(response, 200, { user: await adminUsers.archive(membership, archiveRoute[1], String(input.reason ?? "")) });
        return;
      }
      const resendRoute = url.pathname.match(/^\/api\/v1\/admin\/users\/([0-9a-f-]+)\/resend-invite$/i);
      if (resendRoute && request.method === "POST" && adminUsers && isGlobalMembership(membership)) {
        json(response, 200, { user: await adminUsers.resendInvite(membership, resendRoute[1]) });
        return;
      }
      if (url.pathname === "/api/v1/work-items" && request.method === "GET") {
        requirePermission(membership, "work-item.read");
        json(response, 200, await database.queryWorkItems(membership, parseListQuery(url.searchParams)));
        return;
      }
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
