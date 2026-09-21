import { expect, test, type Page } from "@playwright/test";

const permissions = [
  "work-items.page", "jobs.page", "customers.page", "vehicles.page",
  "media.page", "billing.page", "admin.users.page",
];

async function mockTenantSession(page: Page) {
  await page.route("**/api/v1/auth/config", route => route.fulfill({ json: { mode: "local", allowDemo: true } }));
  await page.route("**/api/v1/session", route => route.fulfill({ json: {
    tenant: { id: "tenant-a", name: "North Workshop" },
    membership: { id: "actor", displayName: "Release Auditor", email: "auditor@example.com", permissions },
  } }));
}

test("production workspace exposes navigation, active route, account identity, and Logout", async ({ page }) => {
  await mockTenantSession(page);
  await page.goto("/");

  await expect(page.getByRole("navigation", { name: "Workshop navigation" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Overview" })).toHaveAttribute("aria-current", "page");
  await expect(page.getByText("North Workshop", { exact: true })).toBeVisible();
  await expect(page.getByText("Release Auditor", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();
  await expect(page.locator("[data-ui-system='workshopos']")).toBeVisible();
});

test("production workspace exposes a mobile navigation drawer without losing Logout", async ({ page }) => {
  await mockTenantSession(page);
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/");

  const trigger = page.getByRole("button", { name: "Open navigation" });
  await expect(trigger).toBeVisible();
  await trigger.click();
  await expect(page.getByRole("navigation", { name: "Workshop navigation" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("navigation", { name: "Workshop navigation" })).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("collapse preference persists and local Logout ends the visible session", async ({ page }) => {
  await mockTenantSession(page);
  await page.goto("/");
  await page.getByRole("button", { name: "Collapse navigation" }).click();
  await expect(page.locator("[data-ui-system='workshopos']")).toHaveClass(/is-collapsed/);
  await page.reload();
  await expect(page.locator("[data-ui-system='workshopos']")).toHaveClass(/is-collapsed/);

  await page.getByRole("button", { name: "Logout" }).click();
  await expect(page.getByRole("heading", { name: "Signed out of WorkshopOS" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Workshop navigation" })).toBeHidden();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Signed out of WorkshopOS" })).toBeVisible();
});

test("production content exposes the scoped visual-system surfaces at supported widths", async ({ page }) => {
  await mockTenantSession(page);
  for (const width of [1280, 768, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator(".ws-page-header")).toBeVisible();
    await expect(page.locator(".ws-surface")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  }
});
