import { expect, test, type Page } from "@playwright/test";

const owner = { id: "00000000-0000-4000-8000-000000000301", name: "Business Owner/Admin", description: "Protected owner access", permissions: ["admin.roles.page", "role.manage"], protected: true, active: true, version: 1, updatedAt: "2026-09-14T00:00:00.000Z" };
const catalog = [{ key: "operations", label: "Workshop operations", pages: [{ key: "work-items.page", label: "Production work items", description: "Open work items", actions: [{ key: "work-item.read", label: "View work items", description: "Read permitted work items" }] }] }];

async function mock(page: Page, permissions = ["admin.roles.page", "role.manage"]) {
  const state = { roles: [owner], created: undefined as Record<string, unknown> | undefined, search: "" };
  await page.route("**/api/v1/auth/config", (route) => route.fulfill({ json: { mode: "local", allowDemo: true } }));
  await page.route("**/api/v1/session", (route) => route.fulfill({ json: { membership: { id: "admin", permissions }, tenant: { id: "tenant", name: "Workshop" } } }));
  await page.route("**/api/v1/admin/roles**", async (route) => {
    const request = route.request(); const url = new URL(request.url());
    if (request.method() === "GET") { state.search = url.searchParams.get("search") ?? ""; return route.fulfill({ json: { roles: state.roles, catalog: state.search ? catalog : catalog } }); }
    if (request.method() === "POST") { state.created = request.postDataJSON(); const role = { id: "10000000-0000-4000-8000-000000000001", ...state.created, protected: false, active: true, version: 1, updatedAt: new Date().toISOString() }; state.roles = [...state.roles, role as typeof owner]; return route.fulfill({ status: 201, json: { role } }); }
    return route.fulfill({ status: 404, json: { code: "NOT_FOUND" } });
  });
  return state;
}

test("role administrator searches the tree, creates a custom role, and cannot change a protected template", async ({ page }) => {
  const state = await mock(page); await page.goto("/production/roles");
  await expect(page.getByRole("heading", { name: "Roles and Permissions" })).toBeVisible();
  await expect(page.getByText("Protected template")).toBeVisible();
  await expect(page.getByRole("button", { name: "Edit Business Owner/Admin" })).toHaveCount(0);
  await page.getByRole("button", { name: "Create role", exact: true }).click();
  await page.getByLabel("Role name").fill("Technician"); await page.getByLabel("Search permission catalog").fill("work item");
  await page.getByRole("button", { name: "Search permissions" }).click(); await expect.poll(() => state.search).toBe("work item");
  await page.getByRole("checkbox", { name: /View work items/ }).check();
  await expect(page.getByRole("checkbox", { name: /Production work items/ })).toBeChecked();
  await page.getByRole("button", { name: "Create role", exact: true }).last().click();
  await expect(page.getByRole("heading", { name: "Technician" })).toBeVisible();
  expect(state.created).toEqual({ name: "Technician", description: "", permissions: ["work-items.page", "work-item.read"] });
});

test("roles page fails closed without both page and action grants", async ({ page }) => {
  await mock(page, ["admin.roles.page"]); await page.goto("/production/roles");
  await expect(page.getByRole("alert")).toContainText("do not have permission");
  await expect(page.getByRole("button", { name: "Create role", exact: true })).toHaveCount(0);
});

test("local role changes persist through HTTP and PostgreSQL", async ({ page }) => {
  test.skip(!process.env.PRODUCTION_E2E_BASE_URL, "requires the production Docker stack");
  const name = `Browser role ${Date.now()}`; await page.goto("/production/roles");
  await page.getByRole("button", { name: "Create role", exact: true }).click(); await page.getByLabel("Role name").fill(name);
  await page.getByRole("checkbox", { name: /Production work items/ }).check(); await page.getByRole("button", { name: "Create role", exact: true }).last().click();
  await expect(page.getByRole("heading", { name })).toBeVisible(); await page.reload(); await expect(page.getByRole("heading", { name })).toBeVisible();
  await page.getByRole("button", { name: `Archive ${name}` }).click(); const dialog = page.getByRole("dialog", { name: "Archive custom role" });
  await dialog.getByLabel("Reason").fill("Browser verification cleanup"); await dialog.getByRole("button", { name: "Archive role" }).click();
  await expect(page.getByRole("heading", { name })).toHaveCount(0);
});
