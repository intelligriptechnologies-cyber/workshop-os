import { expect, test, type Page } from "@playwright/test";

const tenant = { scope: { kind: "TENANT" }, draftVersion: 1, publishedVersion: 1, inherited: { defaultLaborRateMinor: 150000, defaultJobDurationMinutes: 60, customerUpdatesEnabled: true, invoiceFooter: "Thank you" }, overrides: { defaultLaborRateMinor: 175000, defaultJobDurationMinutes: 60, customerUpdatesEnabled: true, invoiceFooter: "Thank you" }, effective: { defaultLaborRateMinor: 175000, defaultJobDurationMinutes: 60, customerUpdatesEnabled: true, invoiceFooter: "Thank you" }, updatedAt: "2026-09-14T00:00:00.000Z" };
const branch = { scope: { kind: "BRANCH", branchId: "branch-1", branchName: "Delhi" }, draftVersion: 2, publishedVersion: 1, inherited: tenant.effective, overrides: { defaultJobDurationMinutes: 90 }, effective: { ...tenant.effective, defaultJobDurationMinutes: 90 }, updatedAt: "2026-09-14T00:00:00.000Z" };

async function mock(page: Page, permissions = ["business-settings.page", "business-settings.manage"]) {
  const state = { saved: undefined as any, published: false };
  await page.route("**/api/v1/auth/config", (route) => route.fulfill({ json: { mode: "local", allowDemo: true } }));
  await page.route("**/api/v1/session", (route) => route.fulfill({ json: { membership: { id: "admin", permissions, branches: [{ id: "branch-1", name: "Delhi" }] }, tenant: { id: "tenant", name: "Workshop" } } }));
  await page.route("**/api/v1/admin/business-settings**", async (route) => {
    const request = route.request(); const url = new URL(request.url());
    if (request.method() === "GET") return route.fulfill({ json: url.searchParams.has("branchId") ? branch : tenant });
    if (url.pathname.endsWith("/publish")) { state.published = true; return route.fulfill({ json: { ...branch, draftVersion: 3, publishedVersion: 2 } }); }
    state.saved = request.postDataJSON(); return route.fulfill({ json: { ...branch, draftVersion: 3, overrides: state.saved.values, effective: { ...branch.inherited, ...state.saved.values } } });
  });
  return state;
}

test("Business Settings shows tabs, inheritance, reset, draft save, and publication", async ({ page }) => {
  const state = await mock(page); await page.goto("/production/settings");
  await expect(page.getByRole("heading", { name: "Business Settings" })).toBeVisible();
  await page.getByLabel("Tenant or branch").selectOption("branch-1");
  await expect(page.getByText("Inherited tenant value: 175000 (effective)")).toBeVisible();
  await expect(page.getByRole("spinbutton", { name: "Default Job duration (minutes)" })).toHaveValue("90");
  await page.getByRole("button", { name: "Reset all to inherited" }).click();
  await expect(page.getByRole("spinbutton", { name: "Default Job duration (minutes)" })).toHaveValue("60");
  await page.getByRole("button", { name: "Save draft" }).click(); await expect.poll(() => state.saved?.values).toEqual({});
  await page.getByRole("tab", { name: "Billing" }).click(); await expect(page.getByRole("textbox", { name: "Invoice footer" })).toHaveValue("Thank you");
  await page.getByRole("button", { name: "Publish settings" }).click(); await expect.poll(() => state.published).toBe(true);
  await expect(page.getByRole("status")).toContainText("Published version 2");
});

test("Business Settings fails closed without its action permission", async ({ page }) => {
  await mock(page, ["business-settings.page"]); await page.goto("/production/settings");
  await expect(page.getByRole("alert")).toContainText("do not have permission");
  await expect(page.getByRole("button", { name: "Publish settings" })).toHaveCount(0);
});

test("Business Settings persist through HTTP and PostgreSQL", async ({ page }) => {
  test.skip(!process.env.PRODUCTION_E2E_BASE_URL, "requires the production Docker stack");
  await page.goto("/production/settings"); await page.getByLabel("Tenant or branch").selectOption({ label: "Delhi overrides" });
  await page.getByRole("button", { name: "Reset all to inherited" }).click(); await page.getByRole("button", { name: "Save draft" }).click();
  await expect(page.getByRole("status")).toContainText("Draft saved"); await page.getByRole("button", { name: "Publish settings" }).click();
  await expect(page.getByRole("status")).toContainText("Active work keeps its existing snapshot"); await page.reload();
  await page.getByLabel("Tenant or branch").selectOption({ label: "Delhi overrides" }); await expect(page.getByText(/Published version [1-9]/)).toBeVisible();
});
