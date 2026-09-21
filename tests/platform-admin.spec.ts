import { expect, test, type Page, type Route } from "@playwright/test";

const tenantId = "00000000-0000-4000-8000-000000000001";
const branchId = "00000000-0000-4000-8000-000000000011";
const membershipId = "00000000-0000-4000-8000-000000000104";

function identity(route: Route) {
  return route.request().headers()["x-workshopos-platform-identity"] ?? "platform-admin";
}

async function mockPlatform(page: Page) {
  let grantStatus = "PENDING";
  let emulationStatus = "PENDING";
  await page.route("**/api/v1/platform/auth/config", route =>
    route.fulfill({ json: { mode: "local", allowDemo: true } }),
  );
  await page.route("**/api/v1/platform/session", route => {
    const current = identity(route);
    const permissions = current === "platform-admin"
      ? ["platform.tenants.read", "platform.support.grant", "platform.logs.read", "platform.logs.download", "platform.logs.recover"]
      : current === "platform-approver"
        ? ["platform.tenants.read", "platform.support.approve", "platform.emulation.approve", "platform.logs.read"]
        : ["platform.tenants.read", "platform.emulation.request", "platform.emulation.use"];
    return route.fulfill({ json: { principal: { identityId: current, displayName: current, permissions }, tenants: [{ id: tenantId, name: "North Workshop", plan: "demo", timezone: "Asia/Kolkata", version: 1 }] } });
  });
  await page.route(`**/api/v1/platform/tenants/${tenantId}`, route =>
    route.fulfill({ json: { tenant: { id: tenantId, name: "North Workshop", plan: "demo", timezone: "Asia/Kolkata", version: 1 }, branches: [{ id: branchId, name: "Delhi", active: true }], users: [{ id: membershipId, displayName: "Service Advisor", email: "advisor@example.invalid", status: "ACTIVE", active: true }] } }),
  );
  await page.route("**/api/v1/platform/logs", route =>
    route.fulfill({ json: { logs: [{ id: "00000000-0000-4000-8000-000000001501", date: "2026-09-21", objectKey: "private/log", contentType: "application/x-ndjson", checksum: "a".repeat(64), onlineUntil: "2026-10-21T00:00:00.000Z", recoverableUntil: "2026-12-20T00:00:00.000Z", tier: "ONLINE", restored: false }] } }),
  );
  await page.route("**/api/v1/platform/support-grants?**", route =>
    route.fulfill({ json: { grants: [{ id: "grant-1", tenantId, supportIdentityId: "support-agent", branchIds: [branchId], permissions: ["tenant.emulate"], reason: "Investigate case", status: grantStatus, requestedBy: "platform-admin", version: 1, requestedAt: "2026-09-21T00:00:00.000Z", expiresAt: "2026-09-21T23:00:00.000Z" }] } }),
  );
  await page.route("**/api/v1/platform/support-grants/grant-1/approve", route => {
    grantStatus = "ACTIVE";
    return route.fulfill({ json: { grant: { id: "grant-1", status: grantStatus } } });
  });
  await page.route("**/api/v1/platform/emulations?**", route =>
    route.fulfill({ json: { emulations: [{ id: "emulation-1", grantId: "grant-1", tenantId, membershipId, branchId, requestedBy: "support-agent", reason: "Reproduce issue", status: emulationStatus, version: 1, requestedAt: "2026-09-21T00:00:00.000Z" }] } }),
  );
  await page.route("**/api/v1/platform/emulations/emulation-1/approve", route => {
    emulationStatus = "APPROVED";
    return route.fulfill({ json: { emulation: { id: "emulation-1", status: emulationStatus } } });
  });
  await page.route("**/api/v1/platform/emulations/emulation-1/start", route => {
    emulationStatus = "ACTIVE";
    const startedAt = new Date();
    return route.fulfill({ json: { emulation: { id: "emulation-1", status: emulationStatus, startedAt: startedAt.toISOString(), expiresAt: new Date(startedAt.getTime() + 15 * 60_000).toISOString() } } });
  });
}

test("platform workspace is isolated, tenant-scoped, and uses independent approval", async ({ page }) => {
  await mockPlatform(page);
  let emulatedHeaders: Record<string, string> = {};
  await page.route("**/api/v1/auth/config", route =>
    route.fulfill({ json: { mode: "local", allowDemo: true } }),
  );
  await page.route("**/api/v1/session", route => {
    emulatedHeaders = route.request().headers();
    return route.fulfill({ json: { membership: { id: membershipId, displayName: "Service Advisor", permissions: ["work-items.page"] }, tenant: { id: tenantId, name: "North Workshop" } } });
  });
  await page.goto("/platform");
  await expect(page.getByRole("heading", { name: "Platform Super Admin" })).toBeVisible();
  await expect(page.getByText("Tenant navigation and ambient tenant access are intentionally unavailable.")).toBeVisible();
  await expect(page.getByRole("navigation")).toHaveCount(0);
  await expect(page.getByLabel("Selected tenant")).toHaveValue(tenantId);
  await expect(page.getByRole("heading", { name: "Protected daily logs" })).toBeVisible();
  await expect(page.locator(".platform-account")).toContainText("platform-admin");
  await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();
  await page.getByRole("button", { name: "Request support grant" }).click();
  await expect(page.getByRole("dialog", { name: "Request support grant" })).toBeVisible();
  await page.getByRole("dialog", { name: "Request support grant" }).getByRole("button", { name: "Cancel" }).click();

  await page.getByLabel("Platform identity").selectOption("platform-approver");
  await expect(page.getByRole("heading", { name: "Pending support grants" })).toBeVisible();
  await page.getByRole("button", { name: "Approve grant" }).click();
  await expect(page.getByRole("status")).toContainText("Support grant approved");

  await page.getByLabel("Platform identity").selectOption("support-agent");
  await page.getByRole("button", { name: "Request tenant-user emulation" }).click();
  const emulationDialog = page.getByRole("dialog", { name: "Request tenant-user emulation" });
  await expect(emulationDialog).toBeVisible();
  await emulationDialog.getByLabel("Approved support grant").selectOption("grant-1");
  await expect(emulationDialog.getByLabel("Effective tenant user")).toHaveValue(membershipId);
  await emulationDialog.getByRole("button", { name: "Cancel" }).click();

  await page.getByLabel("Platform identity").selectOption("platform-approver");
  await page.getByRole("button", { name: "Approve emulation" }).click();
  await expect(page.getByRole("status")).toContainText("Emulation approved");

  await page.getByLabel("Platform identity").selectOption("support-agent");
  await page.getByRole("button", { name: "Start 15-minute session" }).click();
  await expect(page.getByText(/Active until/)).toBeVisible();
  const tenantLink = page.getByRole("link", { name: "Open scoped tenant workspace" });
  await expect(tenantLink).toHaveAttribute("href", "/production?emulation=emulation-1");
  await tenantLink.click();
  await expect(page.getByRole("heading", { name: "Welcome, Service Advisor" })).toBeVisible();
  expect(emulatedHeaders["x-workshopos-emulation-id"]).toBe("emulation-1");
  expect(emulatedHeaders["x-workshopos-platform-identity"]).toBe("support-agent");
});

test("platform workspace renders against the real PostgreSQL stack", async ({ page }) => {
  test.skip(!process.env.PRODUCTION_E2E_BASE_URL, "requires the production Docker stack");
  await page.goto("/platform");
  await expect(page.getByRole("heading", { name: "Platform Super Admin" })).toBeVisible();
  await expect(page.getByLabel("Selected tenant")).not.toHaveValue("");
  await expect(page.getByRole("heading", { name: "Protected daily logs" })).toBeVisible();
  await expect(page.getByRole("navigation")).toHaveCount(0);
});

test("local platform Logout ends the isolated session", async ({ page }) => {
  await mockPlatform(page);
  await page.goto("/platform");
  await page.getByRole("button", { name: "Logout" }).click();
  await expect(page.getByRole("heading", { name: "Signed out of Platform Administration" })).toBeVisible();
  await expect(page.getByRole("navigation")).toHaveCount(0);
});
