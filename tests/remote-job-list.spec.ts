import { expect, test } from "@playwright/test";

const json = (body: unknown) => ({ contentType: "application/json", body: JSON.stringify(body) });
const date = (year: number, month: number, day: number) => `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

for (const roleName of ["Service Advisor", "Owner/Admin"] as const) {
test(`${roleName} Job Cards browse authoritative delivery dates and urgency`, async ({ page }) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const today = date(year, month, now.getDate());
  const yesterday = new Date(year, month - 1, now.getDate() - 1);
  const overdue = date(yesterday.getFullYear(), yesterday.getMonth() + 1, yesterday.getDate());
  const nextMonthDate = new Date(year, month, 2);
  const nextMonth = date(nextMonthDate.getFullYear(), nextMonthDate.getMonth() + 1, 2);
  const tomorrowDate = new Date(year, month - 1, now.getDate() + 1);
  const tomorrow = date(tomorrowDate.getFullYear(), tomorrowDate.getMonth() + 1, tomorrowDate.getDate());
  const base = { visitId: 11, branchId: "branch-1", advisorId: "actor-1", departmentId: null, responsibleManagerId: null, assignmentState: "ASSIGNED_TO_ADVISOR", department: null, responsibleManager: null, advisor: null, assignmentHistory: [], workList: "Service", promisedAt: null, archivedAt: null, createdAt: "2026-01-01T09:00:00Z", updatedAt: "2026-01-01T09:00:00Z", estimates: [], events: [] };
  const jobs = [
    { ...base, id: 1, jobNo: "JC-OVERDUE", status: "NEW", estimatedDelivery: overdue },
    { ...base, id: 2, jobNo: "JC-TODAY", status: "IN_PROGRESS", estimatedDelivery: today },
    { ...base, id: 3, jobNo: "JC-FUTURE", status: "NEW", estimatedDelivery: nextMonth },
    { ...base, id: 4, jobNo: "JC-UNDATED", status: "NEW", estimatedDelivery: null },
    { ...base, id: 5, jobNo: "JC-CLOSED", status: "CLOSED", estimatedDelivery: overdue },
    { ...base, id: 6, jobNo: "JC-ARCHIVED", status: "NEW", estimatedDelivery: overdue, archivedAt: "2026-01-02T00:00:00Z" },
    { ...base, id: 7, jobNo: "JC-TOMORROW", status: "NEW", estimatedDelivery: tomorrow },
  ];
  await page.clock.install({ time: new Date(year, month - 1, now.getDate(), 12) });
  await page.addInitScript(() => sessionStorage.setItem("workshopos.cognito.tokens.v1", JSON.stringify({ accessToken: "delivery-list-token", expiresAt: Date.now() + 3_600_000 })));
  await page.route("**/api/v1/**", async (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path === "/api/v1/auth/config") return route.fulfill(json({ mode: "cognito", clientId: "test-client", authorizationEndpoint: "https://example.test/authorize", tokenEndpoint: "https://example.test/token", logoutEndpoint: "https://example.test/logout", callbackUri: "http://127.0.0.1/callback", logoutUri: "http://127.0.0.1/", scopes: ["openid"] }));
    if (path === "/api/v1/session") return route.fulfill(json({ actorId: "actor-1", actorType: "tenant_user", tenant: { id: "tenant-1", name: "North" }, membership: { id: "member-1", displayName: roleName, email: "advisor@example.test", status: "ACTIVE", roleIds: ["role-1"], roles: [{ id: "role-1", name: roleName, permissions: ["page.job-card.read"] }], branchIds: ["branch-1"], branches: [{ id: "branch-1", name: "Main" }], permissions: ["page.job-card.read"], version: 1 } }));
    if (path === "/api/v1/jobs") return route.fulfill(json(jobs));
    return route.fulfill({ status: 404, ...json({ code: "NOT_FOUND" }) });
  });
  await page.goto("/");
  await page.getByRole("button", { name: roleName === "Owner/Admin" ? "Job Cards" : "Job Card", exact: true }).click();
  const workspace = page.getByRole("region", { name: "Online job workflow" });
  const table = workspace.getByRole("table", { name: "Online Job Cards" });
  const monthFilter = workspace.getByRole("combobox", { name: "Filter by delivery month" });
  const dateFilter = workspace.getByLabel("Filter by exact delivery date");
  await expect(monthFilter).toHaveValue(today.slice(0, 7));
  await expect(table.getByRole("row", { name: /JC-TODAY/ })).toContainText("Approaching");
  await expect(table.getByRole("row", { name: /JC-FUTURE/ })).toHaveCount(0);
  await dateFilter.fill(today);
  await expect(monthFilter).toHaveValue("");
  await expect(table.getByRole("row", { name: /JC-TODAY/ })).toBeVisible();
  await expect(table.getByRole("row", { name: /JC-OVERDUE/ })).toHaveCount(0);
  await dateFilter.fill("2099-01-01");
  await expect(workspace.getByText("No Job Cards match these delivery filters.", { exact: false })).toBeVisible();
  await monthFilter.selectOption(nextMonth.slice(0, 7));
  await expect(dateFilter).toHaveValue("");
  await expect(table.getByRole("row", { name: /JC-FUTURE/ })).toBeVisible();
  await workspace.getByRole("button", { name: "Clear filters" }).click();
  await expect(table.getByRole("row", { name: /JC-UNDATED/ })).toBeVisible();
  await expect(table.getByRole("row", { name: /JC-OVERDUE/ })).toContainText("Overdue");
  await expect(table.getByRole("row", { name: /JC-CLOSED/ })).not.toContainText("Overdue");
  await expect(table.getByRole("row", { name: /JC-ARCHIVED/ })).not.toContainText("Overdue");
  await workspace.getByRole("combobox", { name: "Sort Job Cards" }).selectOption("delivery-soonest");
  await expect(table.locator("tbody tr").first()).toContainText(overdue);
  await workspace.getByRole("combobox", { name: "Sort Job Cards" }).selectOption("delivery-latest");
  await expect(table.locator("tbody tr").first()).toContainText("JC-FUTURE");
  await page.clock.fastForward(24 * 60 * 60 * 1000);
  await expect(table.getByRole("row", { name: /JC-TODAY/ })).toContainText("Overdue");
  await page.clock.setFixedTime(new Date(year, month - 1, now.getDate() + 2, 12));
  await page.evaluate(() => document.dispatchEvent(new Event("visibilitychange")));
  await expect(table.getByRole("row", { name: /JC-TOMORROW/ })).toContainText("Overdue");
});
}
