import { expect, test, type Page } from "@playwright/test";

const config = {
  mode: "cognito", clientId: "browser-client", authorizationEndpoint: "https://tenant.auth.example.com/oauth2/authorize",
  tokenEndpoint: "https://tenant.auth.example.com/oauth2/token", logoutEndpoint: "https://tenant.auth.example.com/logout",
  callbackUri: "http://127.0.0.1:4174/", logoutUri: "http://127.0.0.1:4174/", scopes: ["openid", "email", "profile"],
};
const roles = [
  { id: "role-admin", name: "Business Owner/Admin", permissions: ["membership.manage"] },
  { id: "role-advisor", name: "Service Advisor", permissions: ["visit.view"] },
];
const branches = [{ id: "branch-delhi", name: "Delhi" }, { id: "branch-jaipur", name: "Jaipur" }];
const admin = {
  id: "membership-admin", name: "Business Admin", email: "admin@example.com", status: "ACTIVE",
  roleIds: ["role-admin"], roles: [roles[0]], branchIds: branches.map((item) => item.id), branches,
  version: 1, createdAt: "2026-09-13T00:00:00.000Z", updatedAt: "2026-09-13T00:00:00.000Z",
};

async function mockAuthenticatedApp(page: Page) {
  const state = { users: [admin], listCalls: 0, lastCreate: undefined as Record<string, unknown> | undefined };
  await page.addInitScript(() => sessionStorage.setItem("workshopos.cognito.tokens.v1", JSON.stringify({ accessToken: "verified-by-mock", refreshToken: "refresh", expiresAt: Date.now() + 3_600_000 })));
  await page.route("**/api/v1/auth/config", (route) => route.fulfill({ json: config }));
  await page.route("**/api/v1/session", (route) => route.fulfill({ json: {
    membership: { id: admin.id, displayName: admin.name, email: admin.email, status: "ACTIVE", roleIds: admin.roleIds, roles: admin.roles, branchIds: admin.branchIds, branches: admin.branches, permissions: ["membership.manage"], version: 1 },
    tenant: { id: "tenant-north", name: "North Workshop" },
  } }));
  await page.route("**/api/v1/admin/users**", async (route) => {
    const request = route.request(); const url = new URL(request.url()); const method = request.method();
    if (url.pathname === "/api/v1/admin/users" && method === "GET") {
      state.listCalls += 1; await route.fulfill({ json: { users: state.users, roles, branches } }); return;
    }
    if (url.pathname === "/api/v1/admin/users" && method === "POST") {
      const input = request.postDataJSON() as any; state.lastCreate = input;
      const created = { ...admin, id: "membership-invited", name: input.name, email: input.email, status: "INVITED", roleIds: input.roleIds, roles: roles.filter((item) => input.roleIds.includes(item.id)), branchIds: input.branchIds, branches: branches.filter((item) => input.branchIds.includes(item.id)) };
      state.users.push(created); await route.fulfill({ status: 201, json: { user: created } }); return;
    }
    const target = state.users.find((item) => url.pathname.includes(item.id));
    if (url.pathname.endsWith("/resend-invite")) { await route.fulfill({ json: { user: target } }); return; }
    if (url.pathname.endsWith("/archive")) { if (target) state.users = state.users.filter((item) => item.id !== target.id); await route.fulfill({ json: { user: target } }); return; }
    if (method === "PATCH" && target) {
      const input = request.postDataJSON() as any; Object.assign(target, input, { version: target.version + 1 });
      await route.fulfill({ json: { user: target } }); return;
    }
    await route.fulfill({ status: 404, json: { code: "NOT_FOUND" } });
  });
  return state;
}

test("Cognito login uses authorization-code PKCE and never renders the demo selector", async ({ page }) => {
  await page.route("**/api/v1/auth/config", (route) => route.fulfill({ json: config }));
  await page.route("https://tenant.auth.example.com/**", (route) => route.abort());
  await page.goto("/demo");
  await expect(page.getByLabel("Emulate User:")).toHaveCount(0);
  const request = page.waitForRequest((item) => item.url().startsWith(config.authorizationEndpoint));
  await page.getByRole("button", { name: "Continue with Cognito" }).click();
  const authorization = new URL((await request).url());
  expect(authorization.searchParams.get("response_type")).toBe("code");
  expect(authorization.searchParams.get("code_challenge_method")).toBe("S256");
  expect(authorization.searchParams.get("code_challenge")).toBeTruthy();
});

test("global User Management invites without passwords, persists, polls, edits, resends, and archives", async ({ page }) => {
  await page.clock.install();
  const state = await mockAuthenticatedApp(page);
  await page.goto("/demo");
  await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  await expect(page.locator(".managed-record").filter({ hasText: "admin@example.com" })).toBeVisible();
  await page.getByRole("button", { name: "Add User" }).click();
  await page.getByLabel("User name").fill("Invited Advisor");
  await page.getByLabel("User email").fill("advisor@example.com");
  await page.getByLabel("Business Owner/Admin").uncheck();
  await page.getByLabel("Service Advisor").check();
  await page.getByRole("button", { name: "Invite User" }).click();
  await expect(page.getByText("Invitation pending")).toBeVisible();
  expect(state.lastCreate).toEqual({ name: "Invited Advisor", email: "advisor@example.com", roleIds: ["role-advisor"], branchIds: ["branch-delhi"] });
  expect(state.lastCreate).not.toHaveProperty("password");

  await page.reload();
  await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  const invited = page.locator(".managed-record").filter({ hasText: "advisor@example.com" });
  await invited.getByRole("button", { name: "Edit" }).click();
  await expect(page.getByLabel("User email")).toBeDisabled();
  await page.getByLabel("User name").fill("Updated Advisor");
  await page.getByRole("button", { name: "Save Changes" }).click();
  await expect(page.getByText("Updated Advisor")).toBeVisible();
  await invited.getByRole("button", { name: "Resend invite" }).click();

  const beforePoll = state.listCalls;
  await page.clock.fastForward(30_000);
  await expect.poll(() => state.listCalls).toBeGreaterThan(beforePoll);
  page.once("dialog", (dialog) => dialog.accept("Employment ended"));
  await invited.getByRole("button", { name: "Archive" }).click();
  await expect(page.getByText("advisor@example.com")).toHaveCount(0);
  await expect(page.locator(".managed-record").filter({ hasText: "admin@example.com" }).getByRole("button", { name: "Archive" })).toBeDisabled();
});
