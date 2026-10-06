import { expect, test } from "@playwright/test";

const json = (body: unknown, status = 200) => ({ status, contentType: "application/json", body: JSON.stringify(body) });

test("authenticated Technician sends execution commands and keeps rejected transitions visible", async ({ page }) => {
  let task = { id: 31, jobId: 21, title: "Diagnose engine", instructions: "Check noise", status: "PENDING", startedAt: null, completedAt: null, createdAt: "2026-10-06T09:00:00Z", updatedAt: "2026-10-06T09:00:00Z" };
  const commands: Array<{ path: string; authorization?: string }> = [];
  await page.addInitScript(() => sessionStorage.setItem("workshopos.cognito.tokens.v1", JSON.stringify({ accessToken: "execution-token", expiresAt: Date.now() + 3_600_000 })));
  await page.route("**/api/v1/**", async (route) => {
    const request = route.request(); const path = new URL(request.url()).pathname;
    if (path === "/api/v1/auth/config") return route.fulfill(json({ mode: "cognito", clientId: "test-client", authorizationEndpoint: "https://example.test/authorize", tokenEndpoint: "https://example.test/token", logoutEndpoint: "https://example.test/logout", callbackUri: "http://127.0.0.1/callback", logoutUri: "http://127.0.0.1/", scopes: ["openid"] }));
    if (path === "/api/v1/session") return route.fulfill(json({ tenant: { id: "tenant-1", name: "North" }, membership: { id: "member-1", displayName: "Technician", email: "tech@example.test", status: "ACTIVE", roleIds: ["role-1"], roles: [{ id: "role-1", name: "Technician", permissions: ["page.my-tasks.read", "page.my-tasks.write", "page.work-update.read", "page.work-update.write"] }], branchIds: ["branch-1"], branches: [{ id: "branch-1", name: "Main" }], permissions: ["page.my-tasks.read", "page.my-tasks.write", "page.work-update.read", "page.work-update.write"], version: 1 } }));
    if (path === "/api/v1/technician-tasks/mine") return route.fulfill(json([task]));
    if (path === "/api/v1/jobs/21/execution") return route.fulfill(json({ job: { id: 21, jobNo: "JC-21", status: "IN_PROGRESS" }, tasks: [task], updates: [], attachments: [], qcChecks: [] }));
    if (path === "/api/v1/technician-tasks/31/commands/start") {
      commands.push({ path, authorization: request.headers().authorization }); task = { ...task, status: "IN_PROGRESS", startedAt: "2026-10-06T09:01:00Z" };
      return route.fulfill(json(task));
    }
    if (path === "/api/v1/jobs/21/work-updates") return route.fulfill(json({ code: "TASK_NOT_ACTIVE" }, 422));
    return route.fulfill(json({ code: "NOT_FOUND" }, 404));
  });
  await page.goto("/");
  await page.getByRole("button", { name: "My Tasks", exact: true }).click();
  const workspace = page.getByRole("region", { name: "Online technician execution" });
  await expect(workspace).toContainText("Diagnose engine");
  await workspace.getByRole("button", { name: "Start", exact: true }).click();
  await expect(workspace.getByRole("button", { name: "Complete task", exact: true })).toBeVisible();
  expect(commands).toEqual([{ path: "/api/v1/technician-tasks/31/commands/start", authorization: "Bearer execution-token" }]);
  await workspace.getByLabel("Update").fill("Inspection started");
  await workspace.getByRole("button", { name: "Record update", exact: true }).click();
  await expect(workspace.getByRole("alert")).toContainText("TASK_NOT_ACTIVE");
});
