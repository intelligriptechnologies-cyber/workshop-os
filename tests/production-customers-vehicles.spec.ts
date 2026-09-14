import { expect, test } from "@playwright/test";

const branchId = "00000000-0000-4000-8000-000000000011";
const session = { membership: { branches: [{ id: branchId, name: "Delhi" }], permissions: ["customers.page","customer.read","customer.manage","customer.export","vehicles.page","vehicle.read","vehicle.manage","vehicle.export"] } };

test.beforeEach(async ({ page }) => {
  await page.route("**/api/v1/auth/config", (route) => route.fulfill({ json: { mode: "local", allowDemo: true } }));
  await page.route("**/api/v1/session", (route) => route.fulfill({ json: session }));
  await page.route("**/api/v1/list-preferences/*", async (route) => route.fulfill({ json: { preference: { viewMode: route.request().method() === "PUT" ? route.request().postDataJSON().viewMode : "table", version: 1 } } }));
});

test("customer directory uses URL filters and accessible create/edit dialogs", async ({ page }) => {
  let customer = { id: "c1", tenantId: "t1", branchId, displayName: "Asha Rao", mobile: "9876543210", email: "asha@example.test", status: "ACTIVE", version: 1, updatedAt: "2026-09-14T00:00:00Z" };
  await page.route("**/api/v1/customers**", async (route) => {
    if (route.request().method() === "POST") { const body = route.request().postDataJSON(); customer = { ...customer, ...body }; await route.fulfill({ status: 201, json: { customer } }); return; }
    if (route.request().method() === "PATCH") { const body = route.request().postDataJSON(); customer = { ...customer, ...body, version: 2 }; await route.fulfill({ json: { customer } }); return; }
    const url = new URL(route.request().url()); if (url.pathname.endsWith("/c1")) return route.fulfill({ json: { customer } }); await route.fulfill({ json: { customers: url.searchParams.get("search") === "missing" ? [] : [customer], page: { page: 1, pageSize: 25, totalCount: 1, pageCount: 1 }, query: {} } });
  });
  await page.goto("/production/customers"); await expect(page.getByText("Asha Rao", { exact: true })).toBeVisible(); await page.getByRole("button", { name: "View Asha Rao" }).click(); await expect(page.getByRole("heading", { name: "Asha Rao" })).toBeVisible(); await page.getByRole("button", { name: "Close details" }).click();
  await page.getByRole("button", { name: "Create customer" }).click(); await expect(page.getByRole("dialog", { name: "Create customer" })).toBeVisible();
  await page.getByLabel("Name").fill("New Customer"); await page.getByLabel("Mobile").fill("9999999999"); await page.getByRole("button", { name: "Save" }).click(); await expect(page.getByRole("status")).toHaveText("Customer saved.");
  await page.getByLabel("Search").fill("missing"); await page.getByRole("button", { name: "Apply" }).click(); await expect(page).toHaveURL(/search=missing/); await expect(page.getByText("No customers match these filters.")).toBeVisible();
});

test("vehicle dialog selects an owner from the same-branch customer directory", async ({ page }) => {
  const owner = { id: "c1", tenantId: "t1", branchId, displayName: "Asha Rao", mobile: "9876543210", email: "", status: "ACTIVE", version: 1, updatedAt: "2026-09-14T00:00:00Z" };
  await page.route("**/api/v1/customers*", (route) => route.fulfill({ json: { customers: [owner], page: { page: 1, pageSize: 100, totalCount: 1, pageCount: 1 }, query: {} } }));
  await page.route("**/api/v1/vehicles*", async (route) => { if (route.request().method() === "POST") { const body = route.request().postDataJSON(); await route.fulfill({ status: 201, json: { vehicle: { id: "v1", ...body, ownerName: owner.displayName, version: 1 } } }); return; } await route.fulfill({ json: { vehicles: [], page: { page: 1, pageSize: 25, totalCount: 0, pageCount: 1 }, query: {} } }); });
  await page.goto("/production/vehicles"); await page.getByRole("button", { name: "Create vehicle" }).click(); await page.getByLabel("Registration").fill("DL 01 AB 1234"); await page.getByLabel("Owner customer").selectOption(owner.id); await page.getByRole("button", { name: "Save" }).click(); await expect(page.getByRole("status")).toHaveText("Vehicle saved.");
});

test("customer create persists through HTTP and PostgreSQL after reload", async ({ page }) => {
  test.skip(!process.env.PRODUCTION_E2E_BASE_URL, "requires the production Docker stack");
  const suffix = String(Date.now()).slice(-8); const name = `Browser Customer ${suffix}`; const mobile = `98${suffix}`;
  await page.goto("/production/customers"); await page.getByRole("button", { name: "Create customer" }).click();
  await page.getByLabel("Name").fill(name); await page.getByLabel("Mobile").fill(mobile); await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByRole("status")).toHaveText("Customer saved."); await page.reload(); await expect(page.getByText(name, { exact: true })).toBeVisible();
});
