import { createReadStream } from "node:fs";
import { access, stat } from "node:fs/promises";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import path from "node:path";

import { memberships, PostgresVertical } from "./database.js";

const host = process.env.HOST ?? "127.0.0.1";
const port = Number(process.env.PORT ?? 4173);
const dist = path.resolve("dist");
const database = new PostgresVertical();

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

function membershipFor(request: IncomingMessage) {
  const identity = request.headers["x-workshopos-identity"];
  return typeof identity === "string" ? memberships[identity] : undefined;
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
  response.writeHead(200, { "content-type": contentTypes[extension] ?? "application/octet-stream" });
  createReadStream(file).pipe(response);
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);
    if (url.pathname === "/health") {
      json(response, 200, { status: "ok", ...(await database.health()) });
      return;
    }
    if (url.pathname.startsWith("/api/")) {
      const membership = membershipFor(request);
      if (!membership) {
        json(response, 401, { code: "LOCAL_IDENTITY_REQUIRED" });
        return;
      }
      if (url.pathname.startsWith("/api/platform/")) {
        json(response, 403, { code: "PLATFORM_CREDENTIAL_REQUIRED" });
        return;
      }
      if (url.pathname === "/api/v1/session" && request.method === "GET") {
        json(response, 200, { tenantId: membership.tenantId, branchIds: membership.branchIds });
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
    json(response, 500, { code: "INTERNAL_ERROR" });
  }
});

server.listen(port, host, () => console.log(`WorkshopOS local stack listening on http://${host}:${port}`));

async function shutdown() {
  server.close();
  await database.close();
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
