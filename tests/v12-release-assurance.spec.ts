import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const tenantRoutes = [
  "/", "/production/work-items", "/production/users", "/production/roles", "/production/search",
  "/production/settings", "/production/customers", "/production/vehicles", "/production/inventory",
  "/production/jobs", "/production/data-flow", "/production/media", "/production/estimates",
  "/production/tasks", "/production/qc", "/production/billing", "/production/appointments",
  "/production/follow-ups", "/production/action-inbox", "/production/materials", "/production/reports",
  "/production/masters",
] as const;

async function mockReleaseLanding(page: Page) {
  await page.route("**/api/v1/auth/config", route => route.fulfill({ json: { mode: "local", allowDemo: true } }));
  await page.route("**/api/v1/session", route => route.fulfill({ json: {
    tenant: { id: "tenant-a", name: "Accessible Workshop" },
    membership: { displayName: "Release Auditor", branches: [], permissions: ["work-items.page", "work-item.read", "jobs.page", "job.read"] },
  } }));
}

async function mockPlatformLanding(page: Page) {
  await page.route("**/api/v1/platform/auth/config", route => route.fulfill({ json: { mode: "local", allowDemo: true } }));
  await page.route("**/api/v1/platform/session", route => route.fulfill({ json: {
    principal: { identityId: "platform-admin", displayName: "Platform Admin", permissions: ["platform.tenants.read", "platform.logs.read"] },
    tenants: [{ id: "tenant-a", name: "Accessible Workshop", plan: "demo", timezone: "Asia/Kolkata", version: 1 }],
  } }));
  await page.route("**/api/v1/platform/tenants/tenant-a", route => route.fulfill({ json: {
    tenant: { id: "tenant-a", name: "Accessible Workshop", plan: "demo", timezone: "Asia/Kolkata", version: 1 }, branches: [], users: [],
  } }));
  await page.route("**/api/v1/platform/logs", route => route.fulfill({ json: { logs: [] } }));
  await page.route("**/api/v1/platform/support-grants?**", route => route.fulfill({ json: { grants: [] } }));
  await page.route("**/api/v1/platform/emulations?**", route => route.fulfill({ json: { emulations: [] } }));
}

async function auditRenderedScreen(page: Page, route: string) {
  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
  expect(results.violations, `${route}: ${results.violations.map(item => `${item.id}(${item.nodes.length})`).join(", ")}`).toEqual([]);

  const unnamed = page.locator('button:visible, a[href]:visible, input:not([type="hidden"]):visible, select:visible, textarea:visible');
  for (let index = 0; index < await unnamed.count(); index += 1) await expect(unnamed.nth(index)).toHaveAccessibleName(/\S/);

  const undersized = await page.locator('button:visible:not(:disabled), a[href]:visible, input:not([type="hidden"]):visible:not(:disabled), select:visible:not(:disabled), textarea:visible:not(:disabled)').evaluateAll(elements => elements.flatMap(element => {
    const box = element.getBoundingClientRect();
    return box.width + 0.5 < 44 || box.height + 0.5 < 44 ? [`${element.tagName.toLowerCase()}:${(element.textContent || (element as HTMLInputElement).name || (element as HTMLInputElement).type).trim()}:${Math.round(box.width)}x${Math.round(box.height)}`] : [];
  }));
  expect(undersized, `${route}: target-size failures`).toEqual([]);

  await page.keyboard.press("Tab");
  const focus = await page.evaluate(() => {
    const element = document.activeElement as HTMLElement | null;
    if (!element || element === document.body) return null;
    const style = getComputedStyle(element);
    return { tag: element.tagName, width: Number.parseFloat(style.outlineWidth), style: style.outlineStyle };
  });
  expect(focus, `${route}: keyboard focus did not enter the screen`).not.toBeNull();
  expect(focus!.width, `${route}: focus indicator is too thin`).toBeGreaterThanOrEqual(2);
  expect(focus!.style).not.toBe("none");
}

async function interactiveSignatures(page: Page) {
  return page.locator('button:visible:not(:disabled), a[href]:visible, input:not([type="hidden"]):visible:not(:disabled), select:visible:not(:disabled), textarea:visible:not(:disabled)').evaluateAll(elements => [...new Set(elements.map(element => {
    const control = element as HTMLInputElement;
    const name = (element.getAttribute("aria-label") || element.getAttribute("title") || [...(control.labels ?? [])].map(label => label.innerText).join(" ") || element.textContent || control.placeholder || control.name || control.type).replace(/\s+/g, " ").trim();
    const role = element.getAttribute("role") || (element.tagName === "A" ? "link" : element.tagName === "BUTTON" ? "button" : control.type || element.tagName.toLowerCase());
    return `${role}:${name}`;
  }))].sort());
}

test("tenant and platform entry screens pass automated WCAG, focus, target-size, reflow and reduced-motion gates", async ({ page }) => {
  await mockReleaseLanding(page);
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/");
  await expect(page.getByText("PostgreSQL is authoritative")).toBeVisible();
  await auditRenderedScreen(page, "/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);

  await mockPlatformLanding(page);
  await page.goto("/platform");
  await expect(page.getByRole("heading", { name: "Protected daily logs" })).toBeVisible();
  await auditRenderedScreen(page, "/platform");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);

  await page.emulateMedia({ reducedMotion: "reduce" });
  const moving = await page.locator("body *").evaluateAll(elements => elements.flatMap(element => {
    const style = getComputedStyle(element);
    const durations = [...style.animationDuration.split(","), ...style.transitionDuration.split(",")].map(value => value.endsWith("ms") ? Number.parseFloat(value) : Number.parseFloat(value) * 1000);
    return durations.some(value => value > 1) ? [`${element.tagName}:${Math.max(...durations)}ms`] : [];
  }));
  expect(moving).toEqual([]);
});

test("every production and platform route retains its accessible shell at phone, tablet, and desktop widths", async ({ page }) => {
  test.setTimeout(180_000);
  test.skip(!process.env.PRODUCTION_E2E_BASE_URL, "requires the production Docker stack");
  const desktopActions = new Map<string, string[]>();
  for (const width of [1280, 768, 320]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [...tenantRoutes, "/platform"] as const) {
      await page.goto(route);
      await auditRenderedScreen(page, route);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), `${route} overflows at ${width}px`).toBe(true);
      const actions = await interactiveSignatures(page);
      if (width === 1280) desktopActions.set(route, actions);
      else {
        const missing = desktopActions.get(route)!.filter(action => !actions.includes(action));
        expect(missing, `${route} loses desktop actions at ${width}px`).toEqual([]);
      }
    }
  }
});
