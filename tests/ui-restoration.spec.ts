import { expect, test } from "@playwright/test";

// These images are captured only from a315448 by capture-restoration-reference.mjs.
// Do not use Playwright's --update-snapshots for this suite.
for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`approved service shell ${viewport.width}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.clock.install({ time: new Date("2026-10-20T06:30:00Z") });
    const permissions = ["my-queue", "job-card", "estimate", "follow-ups", "media", "search"].map(key => `page.${key}.read`);
    await page.route("**/api/v1/**", route => {
      const path = new URL(route.request().url()).pathname;
      if (path.endsWith("/auth/config")) return route.fulfill({ json: { mode: "database" } });
      if (path.endsWith("/session")) return route.fulfill({ json: {
        tenant: { id: "tenant", name: "Workshop" },
        membership: {
          id: "service", displayName: "Service advisor 1", email: "service@example.com",
          status: "ACTIVE", roleIds: ["role"], version: 1, roles: [{ id: "role", name: "Service Advisor", permissions }],
          permissions, branchIds: ["branch"], branches: [{ id: "branch", name: "Main" }],
        },
      } });
      return route.fulfill({ json: [] });
    });
    await page.goto("/app/my-queue");
    await expect(page.locator(".role-nav")).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    const { readFileSync } = await import("node:fs");
    for (const area of ["rail", "topbar"]) {
      const actual = await page.locator(`.${area}`).screenshot({ animations: "disabled", path: `test-results/service-${area}-${viewport.width}.png` });
      expect(actual.equals(readFileSync(`tests/reference-a315448/service-${area}-${viewport.width}.png`)),
        `${area} must match immutable reference`).toBe(true);
    }
  });

  test(`approved database login ${viewport.width}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.clock.install({ time: new Date("2026-10-20T06:30:00Z") });
    await page.route("**/api/v1/**", route => {
      const path = new URL(route.request().url()).pathname;
      if (path.endsWith("/auth/config")) return route.fulfill({ json: { mode: "database", allowDemo: true } });
      return route.fulfill({ status: 401, json: { code: "AUTHENTICATION_REQUIRED" } });
    });
    await page.goto("/");
    await expect(page.getByLabel("Email", { exact: true })).toBeVisible();
    await expect(page.getByLabel("Password", { exact: true })).toBeVisible();
    await expect(page.getByLabel("Emulate User:")).toBeVisible();
    await expect(page.getByLabel("Workshop", { exact: true })).toHaveCount(0);
    await page.evaluate(() => document.fonts.ready);
    const { readFileSync } = await import("node:fs");
    const expected = readFileSync(`tests/reference-a315448/login-${viewport.width}.png`);
    const actual = await page.screenshot({ animations: "disabled", path: `test-results/login-restored-${viewport.width}.png` });
    expect(actual.equals(expected), "Login must match immutable reference capture").toBe(true);
  });
}
