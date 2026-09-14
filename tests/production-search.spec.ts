import { expect, test, type Page } from "@playwright/test";

async function mockSession(page: Page, permissions: string[]) {
  await page.route("**/api/v1/auth/config", (route) => route.fulfill({ json: { mode: "local", allowDemo: true } }));
  await page.route("**/api/v1/session", (route) => route.fulfill({ json: { membership: { id: "actor", permissions }, tenant: { id: "tenant", name: "Workshop" } } }));
}

test("global search renders only the server-authorized records and no aggregate count", async ({ page }) => {
  await mockSession(page, ["global-search.page", "global-search.use", "work-items.page", "work-item.read"]);
  await page.route("**/api/v1/search**", (route) => route.fulfill({ json: { records: [{ kind: "work-item", id: "visible", label: "Visible brake job" }] } }));
  await page.goto("/production/search"); await page.getByLabel("Search permitted records").fill("brake"); await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByText("Visible brake job")).toBeVisible(); await expect(page.getByText(/\b\d+\s+(result|record)/i)).toHaveCount(0); await expect(page.getByText("Denied customer")).toHaveCount(0);
});

test("global search page fails closed without its exact action grant", async ({ page }) => {
  await mockSession(page, ["global-search.page"]); await page.goto("/production/search");
  await expect(page.getByRole("alert")).toContainText("do not have permission"); await expect(page.getByRole("search")).toHaveCount(0);
});

test("local global search reads authorized PostgreSQL records", async ({ page }) => {
  test.skip(!process.env.PRODUCTION_E2E_BASE_URL, "requires the production Docker stack"); await page.goto("/production/search");
  await page.getByLabel("Search permitted records").fill("Local Users Admin"); await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByText("Local Users Admin", { exact: true })).toBeVisible();
});
