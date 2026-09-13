import { expect, test } from "@playwright/test";

const productionBaseUrl = process.env.PRODUCTION_E2E_BASE_URL;

test("browser-created work item survives reload through the production PostgreSQL API", async ({ page }) => {
  test.skip(!productionBaseUrl, "production local-stack URL not supplied");
  const summary = `Browser PostgreSQL tracer ${Date.now()}`;
  await page.goto(`${productionBaseUrl}/production/work-items`);
  await page.getByLabel("Summary").first().fill(summary);
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByText(summary)).toBeVisible();
  await page.reload();
  await expect(page.getByText(summary)).toBeVisible();
});

test("production work-item screen creates through authenticated HTTP and reloads server state", async ({ page }) => {
  const workItems: Array<{ id: string; tenantId: string; branchId: string; summary: string; version: number }> = [];
  let authenticated = false;
  let idempotencyKey = "";
  await page.route("**/api/v1/auth/config", (route) => route.fulfill({ json: { mode: "local", allowDemo: true } }));
  await page.route("**/api/v1/work-items", async (route) => {
    authenticated = route.request().headers()["x-workshopos-identity"] === "north-reception";
    if (route.request().method() === "POST") {
      idempotencyKey = route.request().headers()["idempotency-key"];
      const input = route.request().postDataJSON() as { branchId: string; summary: string };
      workItems.push({ id: "00000000-0000-4000-8000-000000000901", tenantId: "tenant-north", branchId: input.branchId, summary: input.summary, version: 1 });
      await route.fulfill({ status: 201, json: { workItem: workItems[0] } });
      return;
    }
    await route.fulfill({ json: { workItems } });
  });

  await page.goto("/production/work-items");
  await page.getByLabel("Summary").first().fill("Inspect incoming vehicle");
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByText("Inspect incoming vehicle")).toBeVisible();
  expect(authenticated).toBe(true);
  expect(idempotencyKey).toBeTruthy();

  await page.reload();
  await expect(page.getByText("Inspect incoming vehicle")).toBeVisible();
});

test("production work-item screen presents version conflicts with the trace reference", async ({ page }) => {
  const item = { id: "00000000-0000-4000-8000-000000000901", tenantId: "tenant-north", branchId: "00000000-0000-4000-8000-000000000011", summary: "Inspect", version: 1 };
  await page.route("**/api/v1/auth/config", (route) => route.fulfill({ json: { mode: "local", allowDemo: true } }));
  await page.route("**/api/v1/work-items", (route) => route.fulfill({ json: { workItems: [item] } }));
  await page.route("**/api/v1/work-items/*", (route) => route.fulfill({
    status: 409,
    headers: { "content-type": "application/json", "x-trace-id": "trace-conflict-1" },
    json: { code: "VERSION_CONFLICT", message: "This work item changed since you opened it. Refresh and try again.", traceId: "trace-conflict-1" },
  }));

  await page.goto("/production/work-items");
  await page.getByRole("button", { name: "Edit" }).click();
  await page.getByLabel("Summary").last().fill("Stale edit");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByRole("alert")).toContainText("Refresh and try again. Reference: trace-conflict-1");
});

test("production tracer fails closed when local demo authentication is disabled", async ({ page }) => {
  let workItemsRequested = false;
  await page.route("**/api/v1/auth/config", (route) => route.fulfill({ json: { mode: "local", allowDemo: false } }));
  await page.route("**/api/v1/work-items", (route) => { workItemsRequested = true; return route.abort(); });
  await page.goto("/production/work-items");
  await expect(page.getByRole("alert")).toHaveText("Local demo authentication is disabled.");
  expect(workItemsRequested).toBe(false);
});
