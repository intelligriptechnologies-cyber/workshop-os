import { expect, test, type Page } from "@playwright/test";

const config = { mode: "cognito", clientId: "browser", authorizationEndpoint: "https://auth.test/authorize", tokenEndpoint: "https://auth.test/token", logoutEndpoint: "https://auth.test/logout", callbackUri: "http://127.0.0.1:4173/production/users", logoutUri: "http://127.0.0.1:4173/", scopes: ["openid"] };
const roles = [{ id: "role-admin", name: "Business Owner/Admin", permissions: ["membership.manage"] }, { id: "role-advisor", name: "Service Advisor", permissions: [] }];
const branches = [{ id: "branch-delhi", name: "Delhi" }];
const admin = { id: "user-admin", name: "Admin", email: "admin@example.com", status: "ACTIVE", roleIds: ["role-admin"], roles: [roles[0]], branchIds: ["branch-delhi"], branches, version: 1, createdAt: "2026-09-14T00:00:00.000Z", updatedAt: "2026-09-14T00:00:00.000Z" };

async function mock(page: Page, permissions = ["membership.manage"]) {
  const state = { users: [admin], query: "", staleOnce: true, invited: undefined as Record<string, unknown> | undefined };
  await page.addInitScript(() => sessionStorage.setItem("workshopos.cognito.tokens.v1", JSON.stringify({ accessToken: "token", expiresAt: Date.now() + 3_600_000 })));
  await page.route("**/api/v1/auth/config", (route) => route.fulfill({ json: config }));
  await page.route("**/api/v1/session", (route) => route.fulfill({ json: { membership: { ...admin, displayName: admin.name, permissions }, tenant: { id: "tenant", name: "Workshop" } } }));
  await page.route("**/api/v1/list-preferences/admin-users", async (route) => route.fulfill({ json: { preference: { viewMode: "table", version: 1 } } }));
  await page.route("**/api/v1/admin/users**", async (route) => {
    const req = route.request(); const url = new URL(req.url()); state.query = url.search;
    if (url.pathname === "/api/v1/admin/users" && req.method() === "GET") return route.fulfill({ json: { users: state.users, roles, branches, page: { page: 1, pageSize: 25, totalCount: state.users.length, pageCount: 1 }, query: {} } });
    if (url.pathname === "/api/v1/admin/users" && req.method() === "POST") { state.invited = req.postDataJSON(); const user = { ...admin, id: "user-invited", ...state.invited, status: "INVITED", roles: [roles[1]], version: 1 }; state.users = [...state.users, user as typeof admin]; return route.fulfill({ status: 201, json: { user } }); }
    if (req.method() === "PATCH") {
      if (state.staleOnce) { state.staleOnce = false; state.users = [{ ...admin, name: "Server Admin", version: 2 }]; return route.fulfill({ status: 409, headers: { "x-trace-id": "trace-stale" }, json: { code: "VERSION_CONFLICT", traceId: "trace-stale" } }); }
      const intended = req.postDataJSON(); const user = { ...admin, ...intended, version: Number(intended.version) + 1 }; state.users = [user]; return route.fulfill({ json: { user } });
    }
    return route.fulfill({ json: { user: admin } });
  });
  return state;
}

test("authorized admin filters, invites, and sees self-protected commands", async ({ page }) => {
  const state = await mock(page); await page.goto("/production/users");
  await expect(page.getByRole("heading", { name: "Tenant User Management" })).toBeVisible();
  await page.getByLabel("Search").fill("anita"); await page.getByRole("button", { name: "Apply" }).click();
  await expect.poll(() => state.query).toContain("search=anita"); await expect(page).toHaveURL(/search=anita/);
  await page.getByRole("button", { name: "Clear" }).click(); await page.getByRole("button", { name: "Invite user" }).click();
  await page.getByLabel("Name", { exact: true }).fill("Anita Advisor"); await page.getByLabel("Email", { exact: true }).fill("anita@example.com");
  await page.getByRole("checkbox", { name: "Service Advisor" }).check(); await page.getByRole("checkbox", { name: "Delhi" }).check(); await page.getByRole("button", { name: "Send invitation" }).click();
  await expect(page.getByText("anita@example.com")).toBeVisible(); expect(state.invited).toEqual({ name: "Anita Advisor", email: "anita@example.com", roleIds: ["role-advisor"], branchIds: ["branch-delhi"] });
  await expect(page.getByRole("button", { name: "Suspend Admin" })).toBeDisabled(); await expect(page.getByRole("button", { name: "Archive Admin" })).toBeDisabled();
});

test("stale edit refreshes its version without losing intent and denied users see no controls", async ({ page }) => {
  await mock(page); await page.goto("/production/users"); await page.getByRole("button", { name: "Edit Admin" }).click(); await page.getByLabel("Name", { exact: true }).fill("Intended Admin Name"); await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("alert")).toContainText("trace-stale"); await expect(page.getByLabel("Name", { exact: true })).toHaveValue("Intended Admin Name"); await page.getByRole("button", { name: "Refresh latest users" }).click();
  await expect(page.getByLabel("Name", { exact: true })).toHaveValue("Intended Admin Name"); await expect(page.getByRole("status")).toContainText("intended changes are preserved"); await page.getByRole("button", { name: "Save changes" }).click(); await expect(page.getByRole("dialog", { name: "Edit user" })).toBeHidden(); await expect(page.getByRole("cell", { name: "Intended Admin Name", exact: true })).toBeVisible();
  const denied = await page.context().newPage(); await mock(denied, []); await denied.goto("/production/users"); await expect(denied.getByRole("alert")).toContainText("do not have permission"); await expect(denied.getByRole("button", { name: "Invite user" })).toHaveCount(0);
});

test("local production user flow persists through HTTP and PostgreSQL", async ({ page }) => {
  test.skip(!process.env.PRODUCTION_E2E_BASE_URL, "requires the production Docker stack");
  const email = `browser-${Date.now()}@example.com`;
  await page.goto("/production/users");
  await expect(page.getByRole("heading", { name: "Tenant User Management" })).toBeVisible();
  await expect(page.getByText("local-admin@workshopos.test")).toBeVisible();

  await page.getByRole("button", { name: "Invite user" }).click();
  await page.getByLabel("Name", { exact: true }).fill("Browser Advisor");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByRole("checkbox", { name: "Service Advisor" }).check();
  await page.getByRole("checkbox", { name: "Delhi" }).check();
  await page.getByRole("button", { name: "Send invitation" }).click();
  await expect(page.getByText(email)).toBeVisible();
  await page.reload();
  await expect(page.getByText(email)).toBeVisible();

  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export XLSX" }).click();
  await expect((await download).suggestedFilename()).toMatch(/^users-.+\.xlsx$/);

  await page.getByRole("button", { name: "Archive Browser Advisor" }).click();
  const dialog = page.getByRole("dialog", { name: "Archive user" });
  await dialog.getByLabel("Reason").fill("Production browser verification cleanup");
  await dialog.getByRole("button", { name: "Archive" }).click();
  await expect(page.getByText(email)).toHaveCount(0);
});
