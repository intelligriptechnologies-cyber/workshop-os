# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: global-users.spec.ts >> global User Management invites without passwords, persists, polls, edits, resends, and archives
- Location: tests\global-users.spec.ts:62:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.management-table tbody tr').filter({ hasText: 'admin@example.com' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('.management-table tbody tr').filter({ hasText: 'admin@example.com' }) with timeout 5000ms
  - waiting for locator('.management-table tbody tr').filter({ hasText: 'admin@example.com' })

```

# Test source

```ts
  1  | import { expect, test, type Page } from "@playwright/test";
  2  | 
  3  | const config = {
  4  |   mode: "cognito", clientId: "browser-client", authorizationEndpoint: "https://tenant.auth.example.com/oauth2/authorize",
  5  |   tokenEndpoint: "https://tenant.auth.example.com/oauth2/token", logoutEndpoint: "https://tenant.auth.example.com/logout",
  6  |   callbackUri: "http://127.0.0.1:4174/", logoutUri: "http://127.0.0.1:4174/", scopes: ["openid", "email", "profile"],
  7  | };
  8  | const roles = [
  9  |   { id: "role-admin", name: "Business Owner/Admin", permissions: ["membership.manage"] },
  10 |   { id: "role-advisor", name: "Service Advisor", permissions: ["visit.view"] },
  11 | ];
  12 | const branches = [{ id: "branch-delhi", name: "Delhi" }, { id: "branch-jaipur", name: "Jaipur" }];
  13 | const admin = {
  14 |   id: "membership-admin", name: "Business Admin", email: "admin@example.com", status: "ACTIVE",
  15 |   roleIds: ["role-admin"], roles: [roles[0]], branchIds: branches.map((item) => item.id), branches,
  16 |   version: 1, createdAt: "2026-09-13T00:00:00.000Z", updatedAt: "2026-09-13T00:00:00.000Z",
  17 | };
  18 | 
  19 | async function mockAuthenticatedApp(page: Page) {
  20 |   const state = { users: [admin], listCalls: 0, lastCreate: undefined as Record<string, unknown> | undefined };
  21 |   await page.addInitScript(() => sessionStorage.setItem("workshopos.cognito.tokens.v1", JSON.stringify({ accessToken: "verified-by-mock", refreshToken: "refresh", expiresAt: Date.now() + 3_600_000 })));
  22 |   await page.route("**/api/v1/auth/config", (route) => route.fulfill({ json: config }));
  23 |   await page.route("**/api/v1/session", (route) => route.fulfill({ json: {
  24 |     membership: { id: admin.id, displayName: admin.name, email: admin.email, status: "ACTIVE", roleIds: admin.roleIds, roles: admin.roles, branchIds: admin.branchIds, branches: admin.branches, permissions: ["membership.manage"], version: 1 },
  25 |     tenant: { id: "tenant-north", name: "North Workshop" },
  26 |   } }));
  27 |   await page.route("**/api/v1/admin/users**", async (route) => {
  28 |     const request = route.request(); const url = new URL(request.url()); const method = request.method();
  29 |     if (url.pathname === "/api/v1/admin/users" && method === "GET") {
  30 |       state.listCalls += 1; await route.fulfill({ json: { users: state.users, roles, branches } }); return;
  31 |     }
  32 |     if (url.pathname === "/api/v1/admin/users" && method === "POST") {
  33 |       const input = request.postDataJSON() as any; state.lastCreate = input;
  34 |       const created = { ...admin, id: "membership-invited", name: input.name, email: input.email, status: "INVITED", roleIds: input.roleIds, roles: roles.filter((item) => input.roleIds.includes(item.id)), branchIds: input.branchIds, branches: branches.filter((item) => input.branchIds.includes(item.id)) };
  35 |       state.users.push(created); await route.fulfill({ status: 201, json: { user: created } }); return;
  36 |     }
  37 |     const target = state.users.find((item) => url.pathname.includes(item.id));
  38 |     if (url.pathname.endsWith("/resend-invite")) { await route.fulfill({ json: { user: target } }); return; }
  39 |     if (url.pathname.endsWith("/archive")) { if (target) state.users = state.users.filter((item) => item.id !== target.id); await route.fulfill({ json: { user: target } }); return; }
  40 |     if (method === "PATCH" && target) {
  41 |       const input = request.postDataJSON() as any; Object.assign(target, input, { version: target.version + 1 });
  42 |       await route.fulfill({ json: { user: target } }); return;
  43 |     }
  44 |     await route.fulfill({ status: 404, json: { code: "NOT_FOUND" } });
  45 |   });
  46 |   return state;
  47 | }
  48 | 
  49 | test("Cognito login uses authorization-code PKCE and never renders the demo selector", async ({ page }) => {
  50 |   await page.route("**/api/v1/auth/config", (route) => route.fulfill({ json: config }));
  51 |   await page.route("https://tenant.auth.example.com/**", (route) => route.abort());
  52 |   await page.goto("/");
  53 |   await expect(page.getByLabel("Emulate User:")).toHaveCount(0);
  54 |   const request = page.waitForRequest((item) => item.url().startsWith(config.authorizationEndpoint));
  55 |   await page.getByRole("button", { name: "Continue with Cognito" }).click();
  56 |   const authorization = new URL((await request).url());
  57 |   expect(authorization.searchParams.get("response_type")).toBe("code");
  58 |   expect(authorization.searchParams.get("code_challenge_method")).toBe("S256");
  59 |   expect(authorization.searchParams.get("code_challenge")).toBeTruthy();
  60 | });
  61 | 
  62 | test("global User Management invites without passwords, persists, polls, edits, resends, and archives", async ({ page }) => {
  63 |   await page.clock.install();
  64 |   const state = await mockAuthenticatedApp(page);
  65 |   await page.goto("/");
  66 |   await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
> 67 |   await expect(page.locator(".management-table tbody tr").filter({ hasText: "admin@example.com" })).toBeVisible();
     |                                                                                                     ^ Error: expect(locator).toBeVisible() failed
  68 |   await page.getByRole("button", { name: "Add User" }).click();
  69 |   await page.getByLabel("User name").fill("Invited Advisor");
  70 |   await page.getByLabel("User email").fill("advisor@example.com");
  71 |   await page.getByLabel("Business Owner/Admin").uncheck();
  72 |   await page.getByLabel("Service Advisor").check();
  73 |   await page.getByRole("button", { name: "Invite User" }).click();
  74 |   await expect(page.getByText("Invitation pending")).toBeVisible();
  75 |   expect(state.lastCreate).toEqual({ name: "Invited Advisor", email: "advisor@example.com", roleIds: ["role-advisor"], branchIds: ["branch-delhi"] });
  76 |   expect(state.lastCreate).not.toHaveProperty("password");
  77 | 
  78 |   await page.reload();
  79 |   await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  80 |   const invited = page.locator(".management-table tbody tr").filter({ hasText: "advisor@example.com" });
  81 |   await invited.getByRole("button", { name: "Edit" }).click();
  82 |   await expect(page.getByLabel("User email")).toBeDisabled();
  83 |   await page.getByLabel("User name").fill("Updated Advisor");
  84 |   await page.getByRole("button", { name: "Save Changes" }).click();
  85 |   await expect(page.getByText("Updated Advisor")).toBeVisible();
  86 |   await invited.getByRole("button", { name: "Resend invite" }).click();
  87 | 
  88 |   const beforePoll = state.listCalls;
  89 |   await page.clock.fastForward(30_000);
  90 |   await expect.poll(() => state.listCalls).toBeGreaterThan(beforePoll);
  91 |   page.once("dialog", (dialog) => dialog.accept("Employment ended"));
  92 |   await invited.getByRole("button", { name: "Archive" }).click();
  93 |   await expect(page.getByText("advisor@example.com")).toHaveCount(0);
  94 |   await expect(page.locator(".management-table tbody tr").filter({ hasText: "admin@example.com" }).getByRole("button", { name: "Archive" })).toBeDisabled();
  95 | });
  96 | 
```