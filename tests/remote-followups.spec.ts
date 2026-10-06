import { expect, test } from "@playwright/test";

const cognitoConfig = {
  mode: "cognito",
  clientId: "test-client",
  authorizationEndpoint: "https://identity.example.test/authorize",
  tokenEndpoint: "https://identity.example.test/token",
  logoutEndpoint: "https://identity.example.test/logout",
  callbackUri: "http://127.0.0.1:4173/",
  logoutUri: "http://127.0.0.1:4173/",
  scopes: ["openid", "email"],
};

test("authenticated Service Advisor uses API-backed Follow-ups and Search", async ({ page }) => {
  let createdFollowup: unknown;
  let createAuthorization = "";
  await page.addInitScript(() => {
    sessionStorage.setItem("workshopos.cognito.tokens.v1", JSON.stringify({ accessToken: "test-token", expiresAt: Date.now() + 3_600_000 }));
  });
  await page.route("**/api/v1/auth/config", (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify(cognitoConfig) }));
  await page.route("**/api/v1/session", (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify({
    tenant: { id: "tenant-1", name: "North" },
    membership: { id: "membership-1", displayName: "Advisor", email: "advisor@example.test", status: "ACTIVE", roleIds: ["role-1"], roles: [{ id: "role-1", name: "Service Advisor", permissions: ["page.follow-ups.read", "page.follow-ups.write", "page.search.read"] }], branchIds: ["branch-1"], branches: [{ id: "branch-1", name: "Main" }], permissions: ["page.follow-ups.read", "page.follow-ups.write", "page.search.read"], version: 1 },
  }) }));
  await page.route("**/api/v1/follow-ups/jobs", (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify([{ id: 101, branchId: "branch-1", jobNo: "JC-101", status: "IN_PROGRESS", customerName: "Asha", vehicleNo: "KA01AA0001" }]) }));
  await page.route("**/api/v1/follow-ups?*", (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify([{ id: 7, jobId: 101, branchId: "branch-1", jobNo: "JC-101", customerName: "Asha", vehicleNo: "KA01AA0001", note: "Call customer", dueAt: "2026-10-02", status: "OPEN", outcome: "", completedAt: null, archivedAt: null, archiveReason: null, version: 1, createdAt: "2026-10-01T00:00:00Z", updatedAt: "2026-10-01T00:00:00Z" }]) }));
  await page.route("**/api/v1/follow-ups", async (route) => {
    if (route.request().method() !== "POST") return route.fallback();
    createdFollowup = route.request().postDataJSON();
    createAuthorization = route.request().headers()["authorization"] ?? "";
    await route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ id: 8, jobId: 101, branchId: "branch-1", jobNo: "JC-101", customerName: "Asha", vehicleNo: "KA01AA0001", note: "New API follow-up", dueAt: null, status: "OPEN", outcome: "", completedAt: null, archivedAt: null, archiveReason: null, version: 1, createdAt: "2026-10-01T00:00:00Z", updatedAt: "2026-10-01T00:00:00Z" }) });
  });
  await page.route("**/api/v1/search?q=Asha", (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify({ query: "Asha", results: [{ entity: "customer", id: 1, branchId: "branch-1", title: "Asha", subtitle: "9000000000", rank: 0 }] }) }));

  await page.goto("/");
  const nav = page.locator(".role-nav");
  await expect(nav.getByRole("button", { name: "Follow-ups", exact: true })).toBeVisible();
  await nav.getByRole("button", { name: "Follow-ups", exact: true }).click();
  await expect(page.getByRole("region", { name: "Online follow-ups" })).toContainText("Call customer");
  await page.getByLabel("Note").fill("New API follow-up");
  await page.getByRole("button", { name: "Create Follow-up", exact: true }).click();
  await expect.poll(() => createdFollowup).toEqual({ jobId: 101, note: "New API follow-up" });
  expect(createAuthorization).toBe("Bearer test-token");

  await nav.getByRole("button", { name: "Search", exact: true }).click();
  await page.getByLabel("Search all records").fill("Asha");
  const searchWorkspace = page.getByRole("region", { name: "Online global search" });
  await searchWorkspace.getByRole("button", { name: "Search", exact: true }).click();
  await expect(searchWorkspace.getByRole("table", { name: "Global search results" })).toContainText("Asha");
});
