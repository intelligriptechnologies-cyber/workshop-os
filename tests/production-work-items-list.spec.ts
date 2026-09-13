import { expect, test } from "@playwright/test";

const branchId = "00000000-0000-4000-8000-000000000011";
const item = (index: number) => ({ id: `00000000-0000-4000-8000-${String(index).padStart(12, "0")}`, tenantId: "tenant-north", branchId, summary: `Brake ${String(index).padStart(2, "0")}`, version: 1, updatedAt: "2026-09-13T00:00:00.000Z" });

test.beforeEach(async ({ page }) => {
  await page.route("**/api/v1/auth/config", (route) => route.fulfill({ json: { mode: "local", allowDemo: true } }));
});

test("production list keeps server query in the URL and persists the selected view", async ({ page }) => {
  const requested: URL[] = []; let savedView = "table";
  await page.route("**/api/v1/list-preferences/work-items", async (route) => {
    if (route.request().method() === "PUT") { savedView = route.request().postDataJSON().viewMode; await route.fulfill({ json: { preference: { viewMode: savedView, version: 1 } } }); return; }
    await route.fulfill({ json: { preference: { viewMode: savedView, version: savedView === "table" ? 0 : 1 } } });
  });
  await page.route("**/api/v1/work-items*", async (route) => {
    const url = new URL(route.request().url()); requested.push(url);
    const search = url.searchParams.get("search") ?? ""; const pageNumber = Number(url.searchParams.get("page") ?? "1"); const pageSize = Number(url.searchParams.get("pageSize") ?? "25");
    const rows = search === "missing" ? [] : Array.from({ length: pageSize }, (_, offset) => item((pageNumber - 1) * pageSize + offset));
    await route.fulfill({ json: { workItems: rows, query: { search, branchId: url.searchParams.get("branchId") ?? "", sort: url.searchParams.get("sort"), page: pageNumber, pageSize }, page: { page: pageNumber, pageSize, totalCount: search ? 0 : 60, pageCount: search ? 1 : Math.ceil(60 / pageSize) } } });
  });

  await page.goto("/production/work-items?sort=summary.asc&page=2&pageSize=25");
  await expect(page.getByText("Brake 25", { exact: true })).toBeVisible();
  await page.getByLabel("Rows").selectOption("50");
  await expect(page).toHaveURL(/pageSize=50/);
  await page.getByRole("button", { name: "Grid", exact: true }).click();
  await expect(page.getByRole("button", { name: "Grid", exact: true })).toHaveAttribute("aria-pressed", "true");
  expect(savedView).toBe("grid");

  await page.getByLabel("Search").fill("missing"); await page.getByRole("button", { name: "Apply" }).click();
  await expect(page.getByText("No work items match these filters.")).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page).toHaveURL(/\/production\/work-items$/);
  expect(requested.some((url) => url.searchParams.get("search") === "missing")).toBe(true);
});

test("private asynchronous export downloads the server-reported complete filtered result", async ({ page }) => {
  let exportQuery: Record<string, unknown> | undefined;
  await page.route("**/api/v1/list-preferences/work-items", (route) => route.fulfill({ json: { preference: { viewMode: "table", version: 0 } } }));
  await page.route("**/api/v1/work-items*", (route) => route.fulfill({ json: { workItems: [item(1)], query: { search: "Brake", branchId: "", sort: "summary.asc", page: 1, pageSize: 25 }, page: { page: 1, pageSize: 25, totalCount: 51, pageCount: 3 } } }));
  await page.route("**/api/v1/work-item-exports", async (route) => { exportQuery = route.request().postDataJSON().query; await route.fulfill({ status: 202, json: { export: { id: "00000000-0000-4000-8000-000000000999", screenKey: "work-items", format: "XLSX", status: "PENDING" } } }); });
  await page.route("**/api/v1/work-item-exports/00000000-0000-4000-8000-000000000999", (route) => route.fulfill({ json: { export: { id: "00000000-0000-4000-8000-000000000999", screenKey: "work-items", format: "XLSX", status: "READY", rowCount: 51 } } }));
  await page.route("**/api/v1/work-item-exports/00000000-0000-4000-8000-000000000999/download", (route) => route.fulfill({ body: "private-xlsx-artifact", headers: { "content-type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "content-disposition": "attachment; filename=\"work-items.xlsx\"", "cache-control": "private, no-store" } }));

  await page.goto("/production/work-items?search=Brake&sort=summary.asc&page=1&pageSize=25");
  const download = page.waitForEvent("download"); await page.getByRole("button", { name: "Export XLSX" }).click();
  expect((await download).suggestedFilename()).toBe("work-items.xlsx");
  await expect(page.getByRole("status")).toHaveText("XLSX export ready: 51 rows.");
  expect(exportQuery).toEqual({ search: "Brake", branchId: "", sort: "summary.asc", page: 1, pageSize: 25 });
});
