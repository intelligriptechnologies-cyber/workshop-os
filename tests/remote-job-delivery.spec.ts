import { expect, test } from "@playwright/test";

const json = (body: unknown, status = 200) => ({ status, contentType: "application/json", body: JSON.stringify(body) });

test("authenticated advisor saves and clears estimated delivery only after API persistence", async ({ page }) => {
  const job = {
    id: 21, jobNo: "JC-21", visitId: 11, branchId: "branch-1", advisorId: "actor-1",
    departmentId: null, responsibleManagerId: null, assignmentState: "ASSIGNED_TO_ADVISOR",
    department: null, responsibleManager: null, advisor: null, assignmentHistory: [],
    status: "IN_PROGRESS", workList: "Service", promisedAt: "2026-10-11T09:00:00Z",
    estimatedDelivery: null as string | null, archivedAt: null, createdAt: "2026-10-11T09:00:00Z",
    updatedAt: "2026-10-11T09:00:00Z", estimates: [], events: [],
  };
  const otherJob = { ...job, id: 22, jobNo: "JC-22", visitId: 12 };
  const commands: Array<{ date: string | null; authorization: string | undefined }> = [];
  let rejectNext = false;
  let outageNext = false;
  let pauseNext = false;
  let releaseSave: (() => void) | undefined;
  let actorType = "tenant_user";
  let membershipStatus = "ACTIVE";
  await page.addInitScript(() => sessionStorage.setItem("workshopos.cognito.tokens.v1", JSON.stringify({ accessToken: "delivery-token", expiresAt: Date.now() + 3_600_000 })));
  await page.route("**/api/v1/**", async (route) => {
    const request = route.request(); const path = new URL(request.url()).pathname;
    if (path === "/api/v1/auth/config") return route.fulfill(json({ mode: "cognito", clientId: "test-client", authorizationEndpoint: "https://example.test/authorize", tokenEndpoint: "https://example.test/token", logoutEndpoint: "https://example.test/logout", callbackUri: "http://127.0.0.1/callback", logoutUri: "http://127.0.0.1/", scopes: ["openid"] }));
    if (path === "/api/v1/session") return route.fulfill(json({ actorId: "actor-1", actorType, tenant: { id: "tenant-1", name: "North" }, membership: { id: "member-1", displayName: "Advisor", email: "advisor@example.test", status: membershipStatus, roleIds: ["role-1"], roles: [{ id: "role-1", name: "Service Advisor", permissions: ["page.job-card.read", "page.job-card.write"] }], branchIds: ["branch-1"], branches: [{ id: "branch-1", name: "Main" }], permissions: ["page.job-card.read", "page.job-card.write"], version: 1 } }));
    if (path === "/api/v1/jobs") return route.fulfill(json([job, otherJob]));
    if (path === "/api/v1/jobs/21") return route.fulfill(json(job));
    if (path === "/api/v1/jobs/21/estimated-delivery" && request.method() === "PUT") {
      const date = (request.postDataJSON() as { estimatedDelivery: string | null }).estimatedDelivery;
      commands.push({ date, authorization: request.headers().authorization });
      if (pauseNext) { pauseNext = false; await new Promise<void>((resolve) => { releaseSave = resolve; }); }
      if (rejectNext) { rejectNext = false; return route.fulfill(json({ code: "JOB_READ_ONLY" }, 422)); }
      if (outageNext) { outageNext = false; return route.fulfill(json({ code: "API_UNAVAILABLE" }, 503)); }
      job.estimatedDelivery = date;
      return route.fulfill(json(job));
    }
    return route.fulfill(json({ code: "NOT_FOUND" }, 404));
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Job Card", exact: true }).click();
  const workspace = page.getByRole("region", { name: "Online job workflow" });
  await workspace.getByRole("button", { name: "Clear filters" }).click();
  await expect(workspace.getByText("JC-21").first()).toBeVisible();
  await workspace.getByLabel("Estimated Delivery Date").fill("2026-10-20");
  pauseNext = true;
  await workspace.getByRole("button", { name: "Save delivery date" }).click();
  await expect.poll(() => Boolean(releaseSave)).toBeTruthy();
  await expect(workspace.getByRole("button", { name: "JC-22" })).toBeDisabled();
  await workspace.getByRole("row", { name: /JC-22/ }).click({ force: true });
  await expect(workspace.getByRole("heading", { name: /JC-21/ })).toBeVisible();
  releaseSave?.();
  await expect(workspace.getByRole("status")).toHaveText("Estimated delivery date saved.");
  expect(commands).toEqual([{ date: "2026-10-20", authorization: "Bearer delivery-token" }]);
  await workspace.getByRole("button", { name: "JC-22" }).click();
  await expect(workspace.getByRole("status")).toHaveCount(0);
  await workspace.getByRole("button", { name: "JC-21" }).click();
  await page.reload();
  await page.getByRole("button", { name: "Job Card", exact: true }).click();
  const reloaded = page.getByRole("region", { name: "Online job workflow" });
  await reloaded.getByRole("button", { name: "Clear filters" }).click();
  await expect(reloaded.getByLabel("Estimated Delivery Date")).toHaveValue("2026-10-20");
  await reloaded.getByRole("button", { name: "Clear date" }).click();
  await reloaded.getByRole("button", { name: "Save delivery date" }).click();
  await expect(reloaded.getByRole("status")).toHaveText("Estimated delivery date saved.");
  expect(commands.at(-1)?.date).toBeNull();
  rejectNext = true;
  await reloaded.getByLabel("Estimated Delivery Date").fill("2026-10-21");
  await reloaded.getByRole("button", { name: "Save delivery date" }).click();
  await expect(reloaded.getByRole("alert")).toContainText("JOB_READ_ONLY");
  await expect(reloaded.getByRole("status")).toHaveCount(0);
  await page.reload();
  await page.getByRole("button", { name: "Job Card", exact: true }).click();
  await page.getByRole("region", { name: "Online job workflow" }).getByRole("button", { name: "Clear filters" }).click();
  await expect(page.getByRole("region", { name: "Online job workflow" }).getByLabel("Estimated Delivery Date")).toHaveValue("");
  outageNext = true;
  const afterReload = page.getByRole("region", { name: "Online job workflow" });
  await afterReload.getByLabel("Estimated Delivery Date").fill("2026-10-22");
  await afterReload.getByRole("button", { name: "Save delivery date" }).click();
  await expect(afterReload.getByRole("alert").first()).toContainText("API_UNREACHABLE");
  await expect(afterReload.getByText("Offline mode is read-only. Reconnect to save a delivery date.")).toBeVisible();
  await expect(afterReload.getByRole("button", { name: "Save delivery date" })).toBeDisabled();
  await expect(afterReload.getByRole("status")).toHaveCount(0);
  actorType = "support_emulation";
  await page.reload();
  await page.getByRole("button", { name: "Job Card", exact: true }).click();
  const readOnly = page.getByRole("region", { name: "Online job workflow" });
  await readOnly.getByRole("button", { name: "Clear filters" }).click();
  await expect(readOnly.getByText("Estimated Delivery Date: Not set")).toBeVisible();
  await expect(readOnly.getByRole("button", { name: "Save delivery date" })).toHaveCount(0);
  actorType = "tenant_user"; membershipStatus = "READ_ONLY";
  await page.reload();
  await page.getByRole("button", { name: "Job Card", exact: true }).click();
  await page.getByRole("region", { name: "Online job workflow" }).getByRole("button", { name: "Clear filters" }).click();
  await expect(page.getByRole("region", { name: "Online job workflow" }).getByRole("button", { name: "Save delivery date" })).toHaveCount(0);
});
