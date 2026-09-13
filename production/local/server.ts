import { createReadStream } from "node:fs";
import { access, stat } from "node:fs/promises";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import path from "node:path";

import { memberships, PostgresVertical } from "./database.js";
import { CognitoGateway } from "./cognito.js";
import { AdminUserService, ApiError, type AuthenticatedMembership } from "../src/admin-users.js";

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

function json(response: ServerResponse, status: number, body: unknown): void {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8" });
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
  const identity = request.headers["x-workshopos-identity"];
  return typeof identity === "string" ? memberships[identity] : undefined;
}

function isGlobalMembership(value: unknown): value is AuthenticatedMembership {
  return Boolean(value && typeof value === "object" && "permissions" in value && "roles" in value);
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
        json(response, 401, { code: cognito ? "MEMBERSHIP_REQUIRED" : "LOCAL_IDENTITY_REQUIRED" });
        return;
      }
      if (url.pathname.startsWith("/api/platform/")) {
        json(response, 403, { code: "PLATFORM_CREDENTIAL_REQUIRED" });
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
        json(response, 200, { workItems: await database.listWorkItems(membership) });
        return;
      }
      if (url.pathname === "/api/v1/work-items" && request.method === "POST") {
        const input = await body(request);
        const result = await database.createWorkItem(
          membership,
          { branchId: String(input.branchId ?? ""), summary: String(input.summary ?? "") },
          String(request.headers["idempotency-key"] ?? ""),
        );
        json(response, result.status, result.body);
        return;
      }
      json(response, 404, { code: "NOT_FOUND" });
      return;
    }
    await staticFile(url.pathname, response);
  } catch (error) {
    console.error(error);
    if (error instanceof ApiError) json(response, error.status, { code: error.code, message: error.message });
    else if ((error as { code?: string }).code === "23505") json(response, 409, { code: "EMAIL_EXISTS" });
    else json(response, 500, { code: "INTERNAL_ERROR" });
  }
});

server.listen(port, host, () => console.log(`WorkshopOS local stack listening on http://${host}:${port}`));

async function shutdown() {
  server.close();
  await database.close();
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
