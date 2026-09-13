import { expect, test } from "@playwright/test";
import XLSX from "xlsx";
import { statSync } from "node:fs";

const roles = [
  ["reception@example.com", ["Receive Vehicle", "Today Queue", "Customers", "Vehicles", "Search"]],
  ["service@example.com", ["My Queue", "Job Card", "Estimate", "Follow-ups", "Media", "Search"]],
  ["store@example.com", ["Material Requests", "Issue Material", "Reconcile", "Stock", "Search"]],
  ["tech@example.com", ["My Tasks", "Work Update", "QC Prep", "Search"]],
  ["accounts@example.com", ["Ready To Invoice", "Invoice", "Payment", "Delivery", "Search"]],
  ["admin@example.com", ["Dashboard", "Data Flow", "Jobs", "Customers", "Vehicles", "Media", "Masters", "Search"]],
] as const;

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

for (const [email, navItems] of roles) {
  test(`${email} can open every role screen`, async ({ page }) => {
    await loginAs(page, email);
    for (const item of navItems) {
      await page.locator(".role-nav").getByRole("button", { name: item, exact: true }).click();
      await expect(page.getByText(item).first()).toBeVisible();
    }
  });
}

test("reception creates a linked customer vehicle visit and job searchable after reload", async ({ page }) => {
  await loginAs(page, "reception@example.com");
  await page.getByLabel("Customer Name").fill("E2E Customer");
  await page.getByLabel("Mobile").fill("9000099999");
  await page.getByLabel("Vehicle Number").fill("OD02E2E9999");
  await page.getByLabel("Requested Work").fill("E2E coating inspection");
  await page.getByRole("button", { name: "Create Visit" }).click();
  await page.reload();
  await loginAs(page, "reception@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Search", exact: true }).click();
  await page.locator(".search-box input").fill("OD02E2E9999");
  await expect(page.getByText("OD02E2E9999").first()).toBeVisible();
  await expect(page.getByText("E2E Customer").first()).toBeVisible();
});

test("admin can open the management hub and create a user", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Management Hub" })).toBeVisible();
  await page.getByRole("tab", { name: "Users" }).click();
  await page.getByRole("button", { name: "Add User" }).click();
  await page.getByLabel("User name").fill("E2E Manager");
  await page.getByLabel("User email").fill("e2e.manager@example.com");
  await page.getByLabel("User role").selectOption("service");
  await page.getByLabel("User password").fill("secure123");
  await page.getByRole("button", { name: "Save User" }).click();
  await expect(page.getByText("e2e.manager@example.com")).toBeVisible();
});

test("search shows an explicit empty state without an unrelated job", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Search", exact: true }).click();
  await page.getByLabel("Search records").fill("definitely-no-workshop-record");
  await expect(page.getByText("No matching records")).toBeVisible();
  await expect(page.locator(".search-summary")).toHaveCount(0);
  await expect(page.getByText("0 results")).toBeVisible();
});

test("search combines entity and lifecycle filters and clears predictably", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Search", exact: true }).click();
  await page.getByLabel("Search records").fill("  od02AB1234  ");
  await page.getByLabel("Search category").selectOption("vehicle");
  await expect(page.getByText("1 result")).toBeVisible();
  await expect(page.locator(".search-summary").getByText("OD02AB1234")).toBeVisible();
  await page.getByLabel("Search category").selectOption("customer");
  await expect(page.getByText("0 results")).toBeVisible();
  await page.getByRole("button", { name: "Clear", exact: true }).click();
  await expect(page.getByText("3 results")).toBeVisible();
  await page.getByLabel("Job status").selectOption("IN_PROGRESS");
  await expect(page.getByText("3 results")).toBeVisible();
  await page.getByLabel("Search records").fill("inv-08947");
  await page.getByLabel("Search category").selectOption("invoice");
  await expect(page.getByText("1 result")).toBeVisible();
  await expect(page.getByText("INV-08947")).toBeVisible();
});

test("admin loads the deterministic large dataset and paginates core lists", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Load Large Demo Dataset" }).click();
  await page.locator(".role-nav").getByRole("button", { name: "Jobs", exact: true }).click();
  await expect(page.getByText("Showing 1 to 12 of 144")).toBeVisible();
  await expect(page.locator(".record-card")).toHaveCount(12);
  await page.getByRole("button", { name: "Table", exact: true }).click();
  await expect(page.locator("tbody tr")).toHaveCount(12);
  await page.getByLabel("Records per page").selectOption("24");
  await expect(page.locator("tbody tr")).toHaveCount(24);
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.getByText("Showing 25 to 48 of 144")).toBeVisible();
  await page.getByLabel("Search jobs").fill("JC-2026-002001");
  await expect(page.getByText("Showing 1 to 1 of 1")).toBeVisible();
});

test("all four core lists switch views and expose deterministic totals", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Load Large Demo Dataset" }).click();
  for (const [name, total] of [["Jobs", 144], ["Customers", 120], ["Vehicles", 132], ["Media", 288]] as const) {
    await page.locator(".role-nav").getByRole("button", { name, exact: true }).click();
    await expect(page.getByText(`Showing 1 to 12 of ${total}`)).toBeVisible();
    await page.getByRole("button", { name: "Table", exact: true }).click();
    await expect(page.locator("tbody tr")).toHaveCount(12);
    await page.getByRole("button", { name: "Grid", exact: true }).click();
    await expect(page.locator(".record-card")).toHaveCount(12);
  }
});

test("mobile lists use cards, compact pagination and no horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Load Large Demo Dataset" }).click();
  await page.locator(".role-nav").getByRole("button", { name: "Jobs", exact: true }).click();
  await expect(page.getByText("Page 1 of 12")).toBeVisible();
  await expect(page.locator(".record-card")).toHaveCount(12);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBeTruthy();
});

test("opening a paginated record and returning preserves list state", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Load Large Demo Dataset" }).click();
  await page.locator(".role-nav").getByRole("button", { name: "Jobs", exact: true }).click();
  await page.getByLabel("Main status").selectOption("IN_PROGRESS");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.locator(".record-card").first().getByRole("button", { name: "View", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Job Card Workspace" })).toBeVisible();
  await page.getByRole("button", { name: /Back to Jobs/ }).click();
  await expect(page.getByText(/Showing 13 to 24 of/)).toBeVisible();
  await expect(page.getByLabel("Main status")).toHaveValue("IN_PROGRESS");
});

test("admin management domains expose contextual creation paths", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  for (const tab of ["Users", "Customers", "Vehicles", "Visits / Jobs", "Estimates", "Tasks / QC", "Inventory / Materials", "Billing / Delivery"]) {
    await expect(page.getByRole("tab", { name: tab, exact: true })).toBeVisible();
    await page.getByRole("tab", { name: tab, exact: true }).click();
    await expect(page.getByRole("tabpanel").first()).toBeVisible();
  }
  await page.getByRole("tab", { name: "Customers", exact: true }).click();
  await page.getByRole("button", { name: "Add Customer", exact: true }).click();
  await expect(page.getByLabel("Customer name")).toBeVisible();
  await expect(page.getByRole("button", { name: "Save Customer", exact: true })).toBeVisible();
});

test("admin receives readable duplicate user validation", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  await page.getByRole("button", { name: "Add User" }).click();
  await page.getByLabel("User name").fill("Duplicate Admin");
  await page.getByLabel("User email").fill("ADMIN@example.com");
  await page.getByLabel("User role").selectOption("admin");
  await page.getByLabel("User password").fill("secure123");
  page.once("dialog", async (dialog) => {
    expect(dialog.message()).toBe("A user with this email already exists.");
    await dialog.accept();
  });
  await page.getByRole("button", { name: "Save User" }).click();
  await expect(page.getByLabel("User email")).toBeVisible();
});

test("contextual create actions remain visible on mobile role screens", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await loginAs(page, "reception@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Customers", exact: true }).click();
  const add = page.getByRole("button", { name: "Add Customer", exact: true });
  await expect(add).toBeVisible();
  await add.click();
  await expect(page.getByLabel("Customer name")).toBeVisible();
});

test("store stock and material requests combine search with domain filters", async ({ page }) => {
  await loginAs(page, "store@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Stock", exact: true }).click();
  await page.getByLabel("Stock category").selectOption("PPF");
  await expect(page.getByText("Showing 1 to 3 of 3")).toBeVisible();
  await page.getByLabel("Stock status").selectOption("LOW");
  await expect(page.getByRole("table", { name: "Stock results" }).locator("tbody tr")).toHaveCount(1);
  await expect(page.getByText("70% VLT Nano Ceramic Film")).toBeVisible();
  await page.getByLabel("Search stock").fill("no-such-stock-item");
  await expect(page.getByText("No matching records")).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.getByText("Showing 1 to 6 of 6")).toBeVisible();

  await page.locator(".role-nav").getByRole("button", { name: "Material Requests", exact: true }).click();
  await page.getByLabel("Request status").selectOption("Pending");
  await expect(page.getByRole("table", { name: "Material Requests results" }).locator("tbody tr")).toHaveCount(1);
  await page.getByLabel("Search material requests").fill("nano");
  await expect(page.getByRole("table", { name: "Material Requests results" }).getByRole("cell", { name: "JC-2026-001246" })).toBeVisible();
});

test("issue and reconcile lists filter by item, job and reconciliation state", async ({ page }) => {
  await loginAs(page, "store@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Issue Material", exact: true }).click();
  await page.getByLabel("Issue Material item").selectOption({ label: "70% VLT Nano Ceramic Film" });
  await expect(page.getByRole("table", { name: "Issue Material results" }).locator("tbody tr")).toHaveCount(1);
  await page.getByLabel("Issue Material job").selectOption({ label: "JC-2026-001246" });
  await expect(page.getByText("Showing 1 to 1 of 1")).toBeVisible();

  await page.locator(".role-nav").getByRole("button", { name: "Reconcile", exact: true }).click();
  await page.getByLabel("Reconciliation state").selectOption("Matched");
  await expect(page.getByRole("table", { name: "Reconcile results" }).locator("tbody tr")).toHaveCount(2);
  await page.getByLabel("Reconciliation state").selectOption("Open");
  await expect(page.getByRole("table", { name: "Reconcile results" }).locator("tbody tr")).toHaveCount(1);
});

test("PDF and Excel downloads use the current filtered rows and visible columns", async ({ page }) => {
  await loginAs(page, "store@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Stock", exact: true }).click();
  await page.getByLabel("Stock category").selectOption("PPF");

  const pdfPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download PDF" }).click();
  const pdf = await pdfPromise;
  expect(pdf.suggestedFilename()).toBe("stock.pdf");
  const pdfPath = await pdf.path();
  expect(pdfPath && statSync(pdfPath).size).toBeGreaterThan(500);

  const ppfDownloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download Excel" }).click();
  const ppfRows = await readWorksheet(await ppfDownloadPromise);
  expect(ppfRows[0][0]).toBe("Stock");
  expect(ppfRows[2][1]).toContain("Category: PPF");
  expect(ppfRows[4]).toEqual(["SKU", "Item", "Category", "Stock", "Unit", "Minimum", "Status"]);
  expect(ppfRows.slice(5)).toHaveLength(3);
  expect(ppfRows.slice(5).every((row) => row[2] === "PPF")).toBeTruthy();

  await page.getByLabel("Stock category").selectOption("Paint");
  const paintDownloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download Excel" }).click();
  const paintRows = await readWorksheet(await paintDownloadPromise);
  expect(paintRows[2][1]).toContain("Category: Paint");
  expect(paintRows.slice(5).every((row) => row[2] === "Paint")).toBeTruthy();
  expect(paintRows.slice(5).map((row) => row[0])).not.toEqual(ppfRows.slice(5).map((row) => row[0]));
});

test("store pagination resets after filtering", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Load Large Demo Dataset" }).click();
  await page.getByRole("button", { name: "Logout" }).click();
  await loginAs(page, "store@example.com");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.getByText(/Showing 13 to 24 of/)).toBeVisible();
  await page.getByLabel("Request status").selectOption("Pending");
  await expect(page.getByText(/Showing 1 to/)).toBeVisible();
});

test("admin user CRUD persists and protects the signed-in admin", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  await page.getByRole("button", { name: "Add User" }).click();
  await page.getByLabel("User name").fill("Persistent User");
  await page.getByLabel("User email").fill("persistent@example.com");
  await page.getByLabel("User password").fill("secure123");
  await page.getByRole("button", { name: "Save User" }).click();
  await page.reload();
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  const created = page.locator(".managed-record").filter({ hasText: "persistent@example.com" });
  await created.getByRole("button", { name: "Edit" }).click();
  await page.getByLabel("User name").fill("Updated User");
  await page.getByRole("button", { name: "Save User" }).click();
  await expect(page.getByText("Updated User")).toBeVisible();
  await created.getByRole("button", { name: "Archive" }).click();
  await expect(page.getByText("persistent@example.com")).toHaveCount(0);
  const self = page.locator(".managed-record").filter({ hasText: "admin@example.com" });
  await expect(self.getByRole("button", { name: "Archive" })).toBeDisabled();
});

async function loginAs(page: import("@playwright/test").Page, email: string) {
  await page.getByLabel("Emulate User:").selectOption(email);
  await page.getByRole("button", { name: "Login" }).click();
}

async function readWorksheet(download: import("@playwright/test").Download) {
  const filePath = await download.path();
  if (!filePath) throw new Error("Downloaded workbook was not saved");
  const workbook = XLSX.readFile(filePath);
  return XLSX.utils.sheet_to_json<(string | number)[]>(workbook.Sheets.Report, { header: 1, defval: "" });
}
