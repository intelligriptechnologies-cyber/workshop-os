import { expect, test, type Page } from "@playwright/test";

const permissions = ["page.dashboard.read", "page.search.read", "page.sales-leads.read"];
const session = {
  tenant: { id: "tenant-1", name: "Workshop" },
  membership: {
    id: "member-1", displayName: "Owner", email: "owner@example.test", status: "ACTIVE",
    roleIds: ["role-1"], roles: [{ id: "role-1", name: "Owner/Admin", permissions }],
    branchIds: ["branch-1"], branches: [{ id: "branch-1", name: "Main" }],
    permissions, version: 1,
  },
};

async function mockDatabase(page: Page) {
  let signedIn = true;
  let sessionFailure = false;
  const requests: string[] = [];
  await page.route("**/api/v1/**", async (route) => {
    const path = new URL(route.request().url()).pathname;
    requests.push(path);
    const json = (data: unknown, status = 200) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(data) });
    if (path === "/api/v1/auth/config") return json({ mode: "database" });
    if (path === "/api/v1/auth/workshops") return json([{ code: "demo", name: "Sambit Autocare" }, { code: "north", name: "North Garage" }]);
    if (path === "/api/v1/auth/login") { signedIn = true; return json({ status: "ok" }); }
    if (path === "/api/v1/auth/logout") { signedIn = false; return json({ status: "ok" }); }
    if (path === "/api/v1/session") {
      if (sessionFailure) return json({ code: "SESSION_FAILED" }, 503);
      return signedIn ? json(session) : json({ code: "AUTHENTICATION_REQUIRED" }, 401);
    }
    if (path.startsWith("/api/v1/auth/tenants/")) return json([{ id: "member-1", name: "Owner" }]);
    return json([]);
  });
  return { requests, expire: () => { signedIn = false; }, failSession: (value: boolean) => { sessionFailure = value; } };
}

test("database session restores menu URLs and follows browser history", async ({ page }) => {
  const api = await mockDatabase(page);
  await page.goto("/app/dashboard");
  await expect(page.locator(".role-nav").getByRole("button", { name: "Dashboard" })).toHaveClass(/active/);
  await page.reload();
  await expect(page).toHaveURL(/\/app\/dashboard$/);
  await page.locator(".role-nav").getByRole("button", { name: "Search" }).click();
  await expect(page).toHaveURL(/\/app\/search$/);
  await page.reload();
  await expect(page.locator(".role-nav").getByRole("button", { name: "Search" })).toHaveClass(/active/);
  await page.goBack();
  await expect(page).toHaveURL(/\/app\/dashboard$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/app\/search$/);
  await page.goto("/app/sales-leads");
  await expect(page.locator(".sales-crm-nav button", { hasText: "Leads" })).toHaveClass(/active/);
  await page.goto("/app/forbidden");
  await expect(page).toHaveURL(/\/app\/(dashboard|sales-leads)$/);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".topbar .mobile-logout")).toBeVisible();
  await expect(page.getByRole("button", { name: "Logout", exact: true })).toBeVisible();
  expect(api.requests).toContain("/api/v1/session");
  expect(api.requests).toContain("/api/v1/jobs");
});

test("expired session shows login and database logout survives refresh", async ({ page }) => {
  const api = await mockDatabase(page);
  await page.goto("/app/dashboard");
  api.expire();
  await page.reload();
  await expect(page.getByRole("button", { name: "Login", exact: true })).toBeVisible();
  await page.goto("/app/dashboard");
  await expect(page.getByRole("button", { name: "Login", exact: true })).toBeVisible();
  await page.getByLabel("Email", { exact: true }).fill("owner@example.test");
  await page.getByLabel("Password").fill("secret");
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await expect(page).toHaveURL(/\/app\/dashboard$/);
  await page.getByRole("button", { name: "Logout", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.reload();
  await expect(page.getByRole("button", { name: "Login", exact: true })).toBeVisible();
  expect(api.requests).toContain("/api/v1/auth/logout");
});

test("database sign-in uses email and keeps entered values after rejection", async ({ page }) => {
  const api = await mockDatabase(page);
  api.expire();
  const attempts: unknown[] = [];
  await page.route("**/api/v1/auth/login", route => {
    attempts.push(route.request().postDataJSON());
    return route.fulfill({ status: 401, json: { code: "INVALID_CREDENTIALS" } });
  });
  await page.goto("/");
  await page.getByLabel("Email", { exact: true }).fill("owner@example.test");
  await page.getByLabel("Password").fill("incorrect");
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await expect(page.getByText("Incorrect password.", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Email", { exact: true })).toHaveValue("owner@example.test");
  await expect(page.getByLabel("Password")).toHaveValue("incorrect");
  expect(attempts).toEqual([{ email: "owner@example.test", password: "incorrect" }]);
  expect(api.requests).not.toContain("/api/v1/auth/workshops");
  expect(api.requests.some(path => path.startsWith("/api/v1/auth/tenants/"))).toBe(false);
});

test("session API failure offers retry without opening browser SQLite", async ({ page }) => {
  const api = await mockDatabase(page);
  api.failSession(true);
  const sqliteRequests: string[] = [];
  page.on("request", (request) => { if (request.url().includes("sql-wasm")) sqliteRequests.push(request.url()); });
  await page.goto("/app/dashboard");
  await expect(page.getByRole("button", { name: "Retry" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Login", exact: true })).toHaveCount(0);
  expect(sqliteRequests).toHaveLength(0);
  api.failSession(false);
  await page.getByRole("button", { name: "Retry" }).click();
  await expect(page.locator(".role-nav").getByRole("button", { name: "Dashboard" })).toHaveClass(/active/);
});

test("auth config failure offers retry without demo login", async ({ page }) => {
  let failed = true;
  await page.route("**/api/v1/**", (route) => route.fulfill({ json: [] }));
  await page.route("**/api/v1/auth/config", (route) => failed
    ? route.fulfill({ status: 503, body: "unavailable" })
    : route.fulfill({ json: { mode: "database" } }));
  await page.route("**/api/v1/session", (route) => route.fulfill({ json: session }));
  await page.goto("/app/dashboard");
  await expect(page.getByRole("button", { name: "Retry" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Login", exact: true })).toHaveCount(0);
  failed = false;
  await page.getByRole("button", { name: "Retry" }).click();
  await expect(page.locator(".role-nav").getByRole("button", { name: "Dashboard" })).toHaveClass(/active/);
});
