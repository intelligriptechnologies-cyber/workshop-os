import { expect, test } from "@playwright/test";

const productionBaseUrl = process.env.PRODUCTION_E2E_BASE_URL;

test("browser-created work item survives reload through the production PostgreSQL API", async ({ page }) => {
  test.skip(!productionBaseUrl, "production local-stack URL not supplied");
  const summary = `Browser PostgreSQL tracer ${Date.now()}`;
  await page.goto(`${productionBaseUrl}/production/work-items`);
  await page.getByRole("button", { name: "Create work item" }).click();
  const createDialog = page.getByRole("dialog", { name: "Create work item" });
  await createDialog.getByLabel("Summary").fill(summary);
  await createDialog.getByRole("button", { name: "Create", exact: true }).click();
  await expect(page.getByText(summary, { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText(summary, { exact: true })).toBeVisible();
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
  await page.getByRole("button", { name: "Create work item" }).click();
  const createDialog = page.getByRole("dialog", { name: "Create work item" });
  await createDialog.getByLabel("Summary").fill("Inspect incoming vehicle");
  await createDialog.getByRole("button", { name: "Create", exact: true }).click();
  await expect(page.getByText("Inspect incoming vehicle", { exact: true })).toBeVisible();
  expect(authenticated).toBe(true);
  expect(idempotencyKey).toBeTruthy();

  await page.reload();
  await expect(page.getByText("Inspect incoming vehicle", { exact: true })).toBeVisible();
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

test("create work item dialog is labelled, validates, traps focus, and restores focus", async ({ page }) => {
  await page.route("**/api/v1/auth/config", (route) => route.fulfill({ json: { mode: "local", allowDemo: true } }));
  await page.route("**/api/v1/work-items", (route) => route.fulfill({ json: { workItems: [] } }));

  await page.goto("/production/work-items");
  const opener = page.getByRole("button", { name: "Create work item" });
  await opener.click();
  const dialog = page.getByRole("dialog", { name: "Create work item" });
  await expect(dialog).toBeVisible();
  await expect(page.getByLabel("Branch")).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("button", { name: "Cancel" })).toBeFocused();
  await dialog.getByRole("button", { name: "Create" }).click();
  await expect(dialog.getByRole("alert")).toContainText("Enter a summary");
  await dialog.getByRole("button", { name: "Cancel" }).click();
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});

test("dirty dialog confirms discard and reason command records a required reason", async ({ page }) => {
  const item = { id: "00000000-0000-4000-8000-000000000901", tenantId: "tenant-north", branchId: "00000000-0000-4000-8000-000000000011", summary: "Inspect", version: 1 };
  let archiveBody: { reason?: string; version?: number } = {};
  await page.route("**/api/v1/auth/config", (route) => route.fulfill({ json: { mode: "local", allowDemo: true } }));
  await page.route("**/api/v1/work-items", (route) => route.fulfill({ json: { workItems: [item] } }));
  await page.route("**/api/v1/work-items/*/archive", async (route) => {
    archiveBody = route.request().postDataJSON() as typeof archiveBody;
    await route.fulfill({ json: { workItem: { ...item, version: 2 } } });
  });

  await page.goto("/production/work-items");
  await page.getByRole("button", { name: "Create work item" }).click();
  const createDialog = page.getByRole("dialog", { name: "Create work item" });
  await createDialog.getByLabel("Summary").fill("Unsaved change");
  await createDialog.getByRole("button", { name: "Cancel" }).click();
  const discard = page.getByRole("alertdialog", { name: "Discard unsaved changes" });
  await expect(discard).toBeVisible();
  await discard.getByRole("button", { name: "Keep editing" }).click();
  await expect(createDialog.getByLabel("Summary")).toHaveValue("Unsaved change");
  await page.keyboard.press("Escape");
  await discard.getByRole("button", { name: "Discard changes" }).click();

  await page.getByRole("button", { name: "Archive Inspect" }).click();
  const reasonDialog = page.getByRole("dialog", { name: "Archive work item" });
  await expect(reasonDialog.getByLabel("Reason")).toBeFocused();
  await reasonDialog.getByRole("button", { name: "Archive" }).click();
  await expect(reasonDialog.getByRole("alert")).toContainText("Enter a reason");
  await reasonDialog.getByLabel("Reason").fill("Duplicate training item");
  await reasonDialog.getByRole("button", { name: "Archive" }).click();
  await expect(reasonDialog).toBeHidden();
  expect(archiveBody).toEqual({ reason: "Duplicate training item", version: 1 });
});
