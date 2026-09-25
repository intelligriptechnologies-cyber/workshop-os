import { expect, test } from "@playwright/test";
import XLSX from "xlsx";
import { statSync } from "node:fs";

const roles = [
  ["reception@example.com", ["Receive Vehicle", "Today Queue", "Customers", "Vehicles", "Search"]],
  ["service@example.com", ["My Queue", "Job Card", "Estimate", "Follow-ups", "Media", "Search"]],
  ["store@example.com", ["Material Requests", "Issue Material", "Reconcile", "Stock", "Search"]],
  ["tech@example.com", ["My Tasks", "Work Update", "QC Prep", "Search"]],
  ["accounts@example.com", ["Ready To Invoice", "Invoice", "Payment", "Delivery", "Search"]],
  ["admin@example.com", ["Dashboard", "Data Flow", "Job Cards", "Customers", "Vehicles", "Media", "Masters", "Search"]],
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
  await page.getByLabel("Search records").fill("OD02E2E9999");
  await page.getByLabel("Search category").selectOption("vehicle");
  await page.locator("main").getByRole("button", { name: "Search", exact: true }).click();
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

test("Search actions use the WorkshopOS teal primary in management and entity lists", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  await page.getByRole("tab", { name: "Customers", exact: true }).click();
  const managementSearch = page.getByRole("tabpanel").getByRole("button", { name: "Search", exact: true });
  await expect(managementSearch).toHaveCSS("background-color", "rgb(21, 97, 109)");
  await expect(managementSearch).toHaveCSS("color", "rgb(255, 255, 255)");

  await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  const entitySearch = page.locator(".entity-list-page").getByRole("button", { name: "Search", exact: true });
  await expect(entitySearch).toHaveCSS("background-color", "rgb(21, 97, 109)");
  await expect(entitySearch).toHaveCSS("color", "rgb(255, 255, 255)");
});

test("search shows an explicit empty state without an unrelated job", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Search", exact: true }).click();
  await page.getByLabel("Search records").fill("definitely-no-workshop-record");
  await page.getByLabel("Search category").selectOption("job");
  await page.locator("main").getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByText("No matching records")).toBeVisible();
  await expect(page.getByText("Showing 0 to 0 of 0")).toBeVisible();
});

test("search combines entity and lifecycle filters and clears predictably", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Search", exact: true }).click();
  await page.getByLabel("Search records").fill("  od02AB1234  ");
  await page.getByLabel("Search category").selectOption("vehicle");
  await page.locator("main").getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByText("Showing 1 to 1 of 1")).toBeVisible();
  await expect(page.getByText("OD02AB1234")).toBeVisible();
  await page.getByLabel("Search category").selectOption("customer");
  await page.locator("main").getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByText("No matching records")).toBeVisible();
  await page.getByRole("button", { name: "Clear", exact: true }).click();
  await expect(page.getByText("Please select a category to activate search")).toBeVisible();
  await page.getByLabel("Search category").selectOption("job");
  await page.getByLabel("Job status").selectOption("IN_PROGRESS");
  await page.locator("main").getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByText(/Showing 1 to .* of/)).toBeVisible();
  await page.getByLabel("Search records").fill("inv-08947");
  await page.getByLabel("Search category").selectOption("invoice");
  await page.getByLabel("Job status").selectOption("ALL");
  await page.locator("main").getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByText("Showing 1 to 1 of 1")).toBeVisible();
  await expect(page.getByText("INV-08947")).toBeVisible();
});

test("admin loads the deterministic large dataset and paginates core lists", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Load Large Demo Dataset" }).click();
  await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  await expect(page.getByText("Showing 1 to 10 of 144")).toBeVisible();
  await expect(page.locator(".record-card")).toHaveCount(10);
  await page.getByRole("button", { name: "Table", exact: true }).click();
  await expect(page.locator("tbody tr")).toHaveCount(10);
  const pagination = page.getByRole("navigation", { name: "Results pagination" }).first();
  await expect(pagination.getByRole("button", { name: "First page" })).toBeDisabled();
  await expect(pagination.getByRole("button", { name: "Previous page" })).toBeDisabled();
  await expect(pagination.getByRole("button", { name: "Page 1", exact: true })).toHaveAttribute("aria-current", "page");
  await pagination.getByRole("button", { name: "Page 3", exact: true }).click();
  await expect(page.getByText("Showing 21 to 30 of 144")).toBeVisible();
  await pagination.getByRole("button", { name: "Previous page" }).click();
  await expect(page.getByText("Showing 11 to 20 of 144")).toBeVisible();
  await pagination.getByRole("button", { name: "First page" }).click();
  await expect(page.getByText("Showing 1 to 10 of 144")).toBeVisible();
  await pagination.getByRole("button", { name: "Last page" }).click();
  await expect(page.getByText("Showing 141 to 144 of 144")).toBeVisible();
  await expect(pagination.getByRole("button", { name: "Page 15", exact: true })).toHaveAttribute("aria-current", "page");
  await expect(pagination.getByRole("button", { name: "Next page" })).toBeDisabled();
  await expect(pagination.getByRole("button", { name: "Last page" })).toBeDisabled();
  await expect(page.getByLabel("Records per page").locator("option")).toHaveText(["10", "20", "50"]);
  await page.getByLabel("Records per page").selectOption("20");
  await expect(page.locator("tbody tr")).toHaveCount(20);
  await page.getByRole("button", { name: "Next page", exact: true }).first().click();
  await expect(page.getByText("Showing 21 to 40 of 144")).toBeVisible();
  await page.getByLabel("Search job cards").fill("JC-2026-002001");
  await page.locator("main").getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByText("Showing 1 to 1 of 1")).toBeVisible();
});

test("all four core lists switch views and expose deterministic totals", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Load Large Demo Dataset" }).click();
  for (const [name, total] of [["Job Cards", 144], ["Customers", 120], ["Vehicles", 132], ["Media", 288]] as const) {
    await page.locator(".role-nav").getByRole("button", { name, exact: true }).click();
    await expect(page.getByText(`Showing 1 to 10 of ${total}`)).toBeVisible();
    await page.getByRole("button", { name: "Table", exact: true }).click();
    await expect(page.locator("tbody tr")).toHaveCount(10);
    await page.getByRole("button", { name: "Grid", exact: true }).click();
    await expect(page.locator(".record-card")).toHaveCount(10);
  }
});

test("mobile lists use cards, compact pagination and no horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Load Large Demo Dataset" }).click();
  await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  await expect(page.getByText("Page 1 of 15").first()).toBeVisible();
  const pagination = page.getByRole("navigation", { name: "Results pagination" }).first();
  await expect(pagination.locator(".numbered-pages")).toBeHidden();
  await expect(pagination.getByRole("button")).toHaveCount(4);
  await expect(page.locator(".record-card")).toHaveCount(10);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBeTruthy();
});

test("opening a paginated record and returning preserves list state", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Load Large Demo Dataset" }).click();
  await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  await page.getByLabel("Main status").selectOption("IN_PROGRESS");
  await page.getByRole("button", { name: "Next page", exact: true }).first().click();
  await page.locator(".record-card").first().getByRole("button", { name: "View", exact: true }).click();
  await expect(page.getByRole("dialog", { name: /View Job/ })).toBeVisible();
  await page.getByRole("button", { name: "Close dialog" }).click();
  await expect(page.getByText(/Showing 11 to 20 of/)).toBeVisible();
  await expect(page.getByLabel("Main status")).toHaveValue("IN_PROGRESS");
});

test("job dialogs expose distinct modes, documents, focus return and shared search entry", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  const viewButton = page.locator(".record-card").first().getByRole("button", { name: "View", exact: true });
  await viewButton.click();
  await expect(page.getByRole("dialog", { name: /View Job/ })).toBeVisible();
  await page.getByRole("tab", { name: "Documents" }).click();
  await expect(page.locator(".document-center")).toBeVisible();
  await page.getByRole("button", { name: "Close dialog" }).click();
  await expect(viewButton).toBeFocused();

  await page.locator(".record-card").first().getByRole("button", { name: "Edit", exact: true }).click();
  await expect(page.getByRole("dialog", { name: /Edit Job/ })).toBeVisible();
  await expect(page.getByRole("button", { name: "Save Job Card" })).toBeVisible();
  await page.keyboard.press("Escape");

  await page.locator(".role-nav").getByRole("button", { name: "Search", exact: true }).click();
  await page.getByLabel("Search category").selectOption("job");
  await page.locator("main").getByRole("button", { name: "Search", exact: true }).click();
  await page.getByRole("table", { name: "Job search results" }).locator("tbody tr").first().getByRole("button", { name: "View" }).click();
  await expect(page.getByRole("dialog", { name: /View Job/ })).toBeVisible();
});

test("job card document actions stack editors, replace creation actions after save, and download financial PDFs", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  await page.getByRole("tab", { name: "Invoices", exact: true }).click();
  const invoiceManager = page.getByRole("table", { name: "Invoices manager" });
  await invoiceManager.locator("tbody tr").first().getByRole("button", { name: "Void" }).click();
  const voidDialog = page.getByRole("dialog", { name: "Void Invoice" });
  await voidDialog.getByLabel("Reason").fill("Recreate from job card E2E");
  await voidDialog.getByRole("button", { name: "Void" }).click();

  await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  await page.getByLabel("Main status").selectOption("COMPLETED");
  await page.locator("main").getByRole("button", { name: "Search", exact: true }).click();
  await page.locator(".record-card").first().getByRole("button", { name: "View", exact: true }).click();
  const jobDialog = page.getByRole("dialog", { name: /View Job/ });
  await jobDialog.getByRole("tab", { name: "Documents" }).click();

  const estimateRow = jobDialog.locator(".document-row").filter({ has: page.getByText("Estimate", { exact: true }) });
  const estimateEdit = estimateRow.getByRole("button", { name: "Edit", exact: true });
  await estimateEdit.click();
  await expect(page.getByRole("dialog")).toHaveCount(2);
  await page.keyboard.press("Escape");
  await expect(jobDialog).toBeVisible();
  await expect(estimateEdit).toBeFocused();
  await estimateEdit.click();
  const estimateDialog = page.getByRole("dialog", { name: "Edit Estimate" });
  await estimateDialog.getByLabel("Notes").fill("Edited from job card");
  await estimateDialog.getByRole("button", { name: "Save Estimate" }).click();
  await expect(jobDialog).toBeVisible();

  const invoiceRow = jobDialog.locator(".document-row").filter({ has: page.getByText("Invoice", { exact: true }) });
  await invoiceRow.getByRole("button", { name: "Create Invoice" }).click();
  const createInvoice = page.getByRole("dialog", { name: "Create Invoice" });
  await expect(page.getByRole("dialog")).toHaveCount(2);
  await expect(createInvoice.getByLabel("Billing job")).toHaveCount(0);
  await expect(createInvoice.getByLabel("Invoice item 1 description")).not.toHaveValue("");
  await createInvoice.getByLabel("Tally invoice number").fill("TLY-JOB-CARD");
  await createInvoice.getByLabel("Invoice item 1 quantity").fill("2");
  await createInvoice.getByLabel("Invoice discount").fill("50");
  await expect(createInvoice.getByLabel("Invoice totals")).toContainText("Total");
  await createInvoice.getByLabel("Notes").fill("Created from job card");
  await createInvoice.getByRole("button", { name: "Save Invoice" }).click();
  await expect(createInvoice).toBeHidden();
  await expect(jobDialog).toBeVisible();
  await expect(invoiceRow.getByRole("button", { name: "Create Invoice" })).toHaveCount(0);
  await expect(invoiceRow.getByRole("button", { name: "Edit", exact: true })).toBeVisible();

  await invoiceRow.getByRole("button", { name: "Edit", exact: true }).click();
  const editInvoice = page.getByRole("dialog", { name: "Edit Invoice" });
  await editInvoice.getByLabel("Notes").fill("Edited from job card");
  await editInvoice.getByRole("button", { name: "Save Invoice" }).click();
  await expect(editInvoice).toBeHidden();
  const pdfPromise = page.waitForEvent("download");
  await invoiceRow.getByRole("button", { name: "Download PDF" }).click();
  expect((await pdfPromise).suggestedFilename()).toMatch(/-invoice\.pdf$/);
});

test("customer and vehicle records use distinct view and edit dialogs on every list surface", async ({ page }) => {
  await loginAs(page, "admin@example.com");

  await page.locator(".role-nav").getByRole("button", { name: "Customers", exact: true }).click();
  const customerCard = page.locator(".record-card").first();
  await customerCard.getByRole("button", { name: "View", exact: true }).click();
  const customerView = page.getByRole("dialog", { name: "View Customer" });
  await expect(customerView).toBeVisible();
  await expect(customerView.getByRole("button", { name: "Save Customer" })).toHaveCount(0);
  await page.keyboard.press("Escape");
  await customerCard.getByRole("button", { name: "Edit", exact: true }).click();
  await page.getByRole("dialog", { name: "Edit Customer" }).getByRole("button", { name: "Save Customer" }).click();
  await expect(page.getByRole("dialog", { name: "Edit Customer" })).toBeHidden();

  await page.locator(".role-nav").getByRole("button", { name: "Vehicles", exact: true }).click();
  await page.getByRole("button", { name: "Table", exact: true }).click();
  const vehicleRow = page.locator(".table-wrap tbody tr").first();
  await vehicleRow.getByRole("button", { name: "View", exact: true }).click();
  const vehicleView = page.getByRole("dialog", { name: "View Vehicle" });
  await expect(vehicleView.getByText("Owner", { exact: true })).toBeVisible();
  await expect(vehicleView.getByRole("button", { name: "Save Vehicle" })).toHaveCount(0);
  await page.getByRole("button", { name: "Close dialog" }).click();
  await vehicleRow.getByRole("button", { name: "Edit", exact: true }).click();
  await page.getByRole("dialog", { name: "Edit Vehicle" }).getByRole("button", { name: "Save Vehicle" }).click();

  await page.locator(".role-nav").getByRole("button", { name: "Search", exact: true }).click();
  for (const category of ["customer", "vehicle"] as const) {
    await page.getByLabel("Search category").selectOption(category);
    await page.locator("main").getByRole("button", { name: "Search", exact: true }).click();
    const row = page.getByRole("table", { name: `${category === "customer" ? "Customer" : "Vehicle"} search results` }).locator("tbody tr").first();
    await row.getByRole("button", { name: "View", exact: true }).click();
    await expect(page.getByRole("dialog", { name: `View ${category === "customer" ? "Customer" : "Vehicle"}` })).toBeVisible();
    await page.getByRole("button", { name: "Close dialog" }).click();
    await row.getByRole("button", { name: "Edit", exact: true }).click();
    await expect(page.getByRole("dialog", { name: `Edit ${category === "customer" ? "Customer" : "Vehicle"}` })).toBeVisible();
    await page.keyboard.press("Escape");
  }

  await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  for (const tab of ["Customers", "Vehicles"] as const) {
    await page.getByRole("tab", { name: tab, exact: true }).click();
    const record = page.getByRole("tabpanel").locator(".managed-record").first();
    await record.getByRole("button", { name: "View", exact: true }).click();
    await expect(page.getByRole("dialog", { name: `View ${tab.slice(0, -1)}` })).toBeVisible();
    await page.getByRole("button", { name: "Close dialog" }).click();
    await record.getByRole("button", { name: "Edit", exact: true }).click();
    await expect(page.getByRole("dialog", { name: `Edit ${tab.slice(0, -1)}` })).toBeVisible();
    await page.keyboard.press("Escape");
  }
});

test("Data Flow cascades visit filters and supports keyboard, mouse, empty, clear, and PDF states", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Data Flow", exact: true }).click();
  const jobSearch = page.getByRole("combobox", { name: "Find a job" });
  await expect(jobSearch).toHaveValue("");
  await expect(page.getByText("Select a job to view its data flow.")).toBeVisible();

  const dateValue = await page.getByLabel("Visit date").locator("option").nth(1).getAttribute("value");
  expect(dateValue).toBeTruthy();
  await page.getByLabel("Visit date").selectOption(dateValue!);
  await expect(page.getByLabel("Visit month")).toHaveValue(dateValue!.slice(0, 7));
  await page.getByLabel("Visit month").selectOption("");
  await expect(page.getByLabel("Visit date")).toHaveValue("");

  await page.getByRole("button", { name: "Clear", exact: true }).click();
  await expect(page.getByLabel("Visit date")).toHaveValue("");
  await jobSearch.focus();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(page.locator(".flow-step").first()).toBeVisible();
  await expect(page.getByRole("region", { name: "Active lifecycle stage" })).toContainText("Active stage");
  await expect(page.getByRole("region", { name: "Active lifecycle stage" })).toContainText("Ordered remaining steps");
  const timeline = page.getByRole("region", { name: "Chronological data flow" });
  await expect(timeline).toBeVisible();
  await expect(timeline).toContainText("Vehicle visit received");
  await expect(timeline).toContainText(/checklist started|Status changed/);
  const timelineTimes = await timeline.locator("time").evaluateAll((nodes) => nodes.map((node) => node.getAttribute("datetime") ?? ""));
  expect(timelineTimes).toEqual([...timelineTimes].sort((left, right) => new Date(left).getTime() - new Date(right).getTime()));

  await jobSearch.fill("nothing-can-match-this");
  await expect(page.getByText("No matching jobs")).toBeVisible();
  await expect(page.getByText("Select a job to view its data flow.")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(jobSearch).toHaveAttribute("aria-expanded", "false");

  await page.getByRole("button", { name: "Clear", exact: true }).click();
  await jobSearch.fill("OD02AB1234");
  await page.getByRole("option", { name: /JC-2026-001245/ }).click();
  const pdfPromise = page.waitForEvent("download");
  const pdfButton = page.locator(".flow-step").filter({ hasText: "Estimate:" }).locator("button.document-download");
  await pdfButton.click();
  await expect(pdfButton).toHaveText(/Generating/);
  expect((await pdfPromise).suggestedFilename()).toBe("JC-2026-001245-estimate.pdf");

  await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  await page.getByRole("tab", { name: "Estimates", exact: true }).click();
  await expect(page.getByLabel("Job for Estimates")).toBeVisible();
  await page.locator(".role-nav").getByRole("button", { name: "Data Flow", exact: true }).click();
  await expect(page.getByRole("combobox", { name: "Find a job" })).toHaveValue("");
  await expect(page.getByText("Select a job to view its data flow.")).toBeVisible();
});

test("Data Flow filters and suggestions stay within a mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Data Flow", exact: true }).click();
  const jobSearch = page.getByRole("combobox", { name: "Find a job" });
  await jobSearch.fill("OD02");
  await expect(page.getByRole("listbox", { name: "Matching jobs" })).toBeVisible();
  const overflow = await page.locator(".data-flow-filters").evaluate((element) => ({ right: element.getBoundingClientRect().right, viewport: document.documentElement.clientWidth, bodyScroll: document.body.scrollWidth }));
  expect(overflow.right).toBeLessThanOrEqual(overflow.viewport + 1);
  expect(overflow.bodyScroll).toBeLessThanOrEqual(overflow.viewport + 1);
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(page.locator(".flow-step").first()).toBeVisible();
});

test("admin management domains expose contextual creation paths", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  for (const tab of ["Users", "Customers", "Vehicles", "Job Cards", "Estimates", "Tasks / QC", "Inventory / Materials", "Invoices", "Payments", "Delivery"]) {
    await expect(page.getByRole("tab", { name: tab, exact: true })).toBeVisible();
    await page.getByRole("tab", { name: tab, exact: true }).click();
    if (["Invoices", "Payments", "Delivery"].includes(tab)) await expect(page.locator(`[data-billing-manager="${tab}"]`)).toBeVisible();
    else await expect(page.getByRole("tabpanel").first()).toBeVisible();
  }
  await page.getByRole("tab", { name: "Customers", exact: true }).click();
  await page.getByRole("button", { name: "Add Customer", exact: true }).click();
  await expect(page.getByLabel("Customer name")).toBeVisible();
  await expect(page.getByRole("button", { name: "Save Customer", exact: true })).toBeVisible();
});

test("Manage and Accounts reuse global searchable billing managers with CRUD, filters and pagination", async ({ page }) => {
  test.setTimeout(45_000);
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Load Large Demo Dataset" }).click();
  await page.getByRole("tab", { name: "Invoices", exact: true }).click();
  await expect(page.locator('[data-billing-manager="Invoices"]')).toBeVisible();
  await expect(page.getByRole("table", { name: "Invoices manager" })).toBeVisible();
  await expect(page.getByText(/Showing 1 to 10 of/)).toBeVisible();
  await page.getByLabel("Search invoices").fill("INV-");
  await page.locator('[data-billing-manager="Invoices"]').getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByText(/Showing 1 to .* of/)).toBeVisible();
  await page.getByLabel("Invoices status filter").selectOption("Open");
  await page.locator('[data-billing-manager="Invoices"]').getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByRole("table", { name: "Invoices manager" }).locator("tbody tr").first()).toContainText("Open");
  const next = page.getByRole("navigation", { name: "Billing results pagination" }).first().getByRole("button", { name: "Next page" });
  if (await next.isEnabled()) { await next.click(); await expect(page.getByText(/Page 2 of/).first()).toBeVisible(); }
  await page.getByRole("table", { name: "Invoices manager" }).locator("tbody tr").first().getByRole("button", { name: "View" }).click();
  await expect(page.getByRole("dialog", { name: "View Invoice" })).toBeVisible();
  await page.getByRole("button", { name: "Close dialog" }).click();
  await page.getByRole("table", { name: "Invoices manager" }).locator("tbody tr").first().getByRole("button", { name: "Edit" }).click();
  const invoiceEditor = page.getByRole("dialog", { name: "Edit Invoice" });
  await expect(invoiceEditor.getByText("Invoice items", { exact: true })).toBeVisible();
  await invoiceEditor.getByLabel("Notes").fill("WP6 invoice edit");
  await invoiceEditor.getByRole("button", { name: "Save Invoice" }).click();
  await expect(invoiceEditor).toBeHidden();

  await page.locator(".logout").click();
  await loginAs(page, "accounts@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Invoice", exact: true }).click();
  await expect(page.locator('[data-billing-manager="Invoices"]')).toBeVisible();
  await page.locator(".role-nav").getByRole("button", { name: "Payment", exact: true }).click();
  await expect(page.locator('[data-billing-manager="Payments"]')).toBeVisible();
  await page.getByRole("button", { name: "Create Payment" }).click();
  const create = page.getByRole("dialog", { name: "Create Payment" });
  const billingJob = create.getByLabel("Billing job");
  if (await billingJob.count()) {
    const initialJob = await billingJob.inputValue();
    await create.getByLabel("Amount").fill("1");
    await create.getByLabel("Reference").fill("STALE-CANDIDATE");
    const nextJob = await billingJob.locator("option").nth(1).getAttribute("value");
    await billingJob.selectOption(nextJob!);
    await expect(create.getByLabel("Amount")).not.toHaveValue("1");
    await expect(create.getByLabel("Reference")).toHaveValue("");
    await billingJob.selectOption(initialJob);
  }
  await create.getByLabel("Amount").fill("100");
  await create.getByLabel("Mode").selectOption("UPI");
  await create.getByLabel("Reference").fill("WP6-E2E");
  await create.getByRole("button", { name: "Save" }).click();
  const paymentRow = page.getByRole("table", { name: "Payments manager" }).locator("tbody tr").filter({ hasText: "WP6-E2E" });
  await expect(paymentRow).toHaveCount(1);
  await paymentRow.getByRole("button", { name: "Edit" }).click();
  await page.getByRole("dialog", { name: "Edit Payment" }).getByLabel("Reference").fill("WP6-EDITED");
  await page.getByRole("dialog", { name: "Edit Payment" }).getByRole("button", { name: "Save" }).click();
  await page.getByLabel("Search payments").fill("WP6-EDITED");
  await page.locator('[data-billing-manager="Payments"]').getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByRole("table", { name: "Payments manager" })).toContainText("WP6-EDITED");
  const editedPaymentRow = page.getByRole("table", { name: "Payments manager" }).locator("tbody tr").filter({ hasText: "WP6-EDITED" });
  const correctedJob = (await editedPaymentRow.locator("td").first().textContent())!.trim();
  await editedPaymentRow.getByRole("button", { name: "Void" }).click();
  await page.getByRole("dialog", { name: "Void Payment" }).getByLabel("Reason").fill("E2E correction");
  await page.getByRole("dialog", { name: "Void Payment" }).getByRole("button", { name: "Void" }).click();
  await expect(page.getByRole("table", { name: "Payments manager" })).not.toContainText("WP6-EDITED");
  await page.getByRole("button", { name: "Create Payment" }).click();
  await page.getByRole("dialog", { name: "Create Payment" }).getByRole("button", { name: "Save" }).click();
  await page.locator('[data-billing-manager="Payments"]').getByRole("button", { name: "Clear", exact: true }).click();
  await page.locator(".role-nav").getByRole("button", { name: "Delivery", exact: true }).click();
  const deliveryRow = page.getByRole("table", { name: "Delivery manager" }).locator("tbody tr").filter({ has: page.getByRole("button", { name: "Delivered", exact: true }) }).first();
  await expect(deliveryRow).toContainText("GP-");
  await expect(deliveryRow).toContainText("Pending");
  await deliveryRow.getByRole("button", { name: "Delivered" }).click();
  await page.getByRole("dialog", { name: "Mark Delivery" }).getByRole("button", { name: "Mark Delivered" }).click();
  await expect(page.getByRole("table", { name: "Delivery manager" })).toContainText("Delivered");
  if (await page.getByRole("dialog").count()) await page.keyboard.press("Escape");

  await page.locator(".logout").click();
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Data Flow", exact: true }).click();
  await page.getByRole("combobox", { name: "Find a job" }).fill(correctedJob);
  await page.getByRole("option", { name: new RegExp(correctedJob) }).click();
  const correctedTimeline = page.getByRole("region", { name: "Chronological data flow" });
  await expect(correctedTimeline).toContainText("Payment voided");
  await expect(correctedTimeline).toContainText("E2E correction");
  await expect(correctedTimeline.locator(".timeline-event.voided")).toBeVisible();
});

test("Manage Job Cards uses view and edit dialogs with documents and confirmed archive", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  await page.getByRole("tab", { name: "Job Cards", exact: true }).click();

  await page.getByRole("button", { name: "Create Job Card", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Create Job Card" })).toBeVisible();
  await page.getByRole("button", { name: "Close dialog" }).click();
  await expect(page.getByRole("dialog", { name: "Create Job Card" })).toBeHidden();

  const table = page.getByRole("table", { name: "Managed job cards" });
  const firstRow = table.locator("tbody tr").first();
  await expect(table.locator("thead th")).toHaveText(["Job Card", "Vehicle", "Customer", "Status", "Actions"]);
  await expect(firstRow.getByRole("button", { name: "View", exact: true })).toBeVisible();
  await expect(firstRow.getByRole("button", { name: "Edit", exact: true })).toBeVisible();

  await firstRow.getByRole("button", { name: "View", exact: true }).click();
  await expect(page.getByRole("dialog", { name: /View Job/ })).toBeVisible();
  await page.getByRole("tab", { name: "Documents" }).click();
  const pdfPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /Download PDF/ }).first().click();
  expect((await pdfPromise).suggestedFilename()).toMatch(/-estimate\.pdf$/);
  await page.getByRole("button", { name: "Close dialog" }).click();

  await firstRow.getByRole("button", { name: "Edit", exact: true }).click();
  await expect(page.getByRole("button", { name: "Save Job Card" })).toBeVisible();
  const archive = page.getByRole("button", { name: "Archive Job", exact: true });
  await expect(archive).toBeVisible();
  page.once("dialog", (dialog) => dialog.accept());
  await archive.click();
  await expect(page.getByRole("dialog", { name: /Edit Job/ })).toBeHidden();
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
  await expect(page.getByText("Showing 1 to 6 of 6")).toBeVisible();
  await page.locator("main").getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByText("Showing 1 to 3 of 3")).toBeVisible();
  await page.getByLabel("Stock status").selectOption("LOW");
  await expect(page.getByRole("table", { name: "Stock results" }).locator("tbody tr")).toHaveCount(3);
  await page.locator("main").getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByRole("table", { name: "Stock results" }).locator("tbody tr")).toHaveCount(1);
  await expect(page.getByText("70% VLT Nano Ceramic Film")).toBeVisible();
  await page.getByLabel("Search stock").fill("no-such-stock-item");
  await expect(page.getByText("No matching records")).toHaveCount(0);
  await page.locator("main").getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByText("No matching records")).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.getByText("Showing 1 to 6 of 6")).toBeVisible();

  await page.locator(".role-nav").getByRole("button", { name: "Material Requests", exact: true }).click();
  await page.getByLabel("Request status").selectOption("Pending");
  await page.locator("main").getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByRole("table", { name: "Material Requests results" }).locator("tbody tr")).toHaveCount(1);
  await page.getByLabel("Search material requests").fill("nano");
  await page.locator("main").getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByRole("table", { name: "Material Requests results" }).getByRole("cell", { name: "JC-2026-001246" })).toBeVisible();
});

test("issue and reconcile lists filter by item, job and reconciliation state", async ({ page }) => {
  await loginAs(page, "store@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Issue Material", exact: true }).click();
  await page.getByLabel("Issue Material item").selectOption({ label: "70% VLT Nano Ceramic Film" });
  await page.locator("main").getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByRole("table", { name: "Issue Material results" }).locator("tbody tr")).toHaveCount(1);
  await page.getByLabel("Issue Material job").selectOption({ label: "JC-2026-001246" });
  await page.locator("main").getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByText("Showing 1 to 1 of 1")).toBeVisible();

  await page.locator(".role-nav").getByRole("button", { name: "Reconcile", exact: true }).click();
  await page.getByLabel("Reconciliation state").selectOption("Matched");
  await page.locator("main").getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByRole("table", { name: "Reconcile results" }).locator("tbody tr")).toHaveCount(2);
  await page.getByLabel("Reconciliation state").selectOption("Open");
  await page.locator("main").getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByRole("table", { name: "Reconcile results" }).locator("tbody tr")).toHaveCount(1);
});

test("PDF and Excel downloads use the current filtered rows and visible columns", async ({ page }) => {
  await loginAs(page, "store@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Stock", exact: true }).click();
  await page.getByLabel("Stock category").selectOption("PPF");
  await page.locator("main").getByRole("button", { name: "Search", exact: true }).click();

  await page.getByRole("button", { name: "Download", exact: true }).click();
  const pdfPromise = page.waitForEvent("download");
  await page.getByRole("menuitem", { name: "PDF" }).click();
  const pdf = await pdfPromise;
  expect(pdf.suggestedFilename()).toBe("stock.pdf");
  const pdfPath = await pdf.path();
  expect(pdfPath && statSync(pdfPath).size).toBeGreaterThan(500);

  await page.getByRole("button", { name: "Download", exact: true }).click();
  const ppfDownloadPromise = page.waitForEvent("download");
  await page.getByRole("menuitem", { name: "Excel" }).click();
  const ppfRows = await readWorksheet(await ppfDownloadPromise);
  expect(ppfRows[0][0]).toBe("Stock");
  expect(ppfRows[2][1]).toContain("Category: PPF");
  expect(ppfRows[4]).toEqual(["SKU", "Item", "Category", "Stock", "Unit", "Minimum", "Status"]);
  expect(ppfRows.slice(5)).toHaveLength(3);
  expect(ppfRows.slice(5).every((row) => row[2] === "PPF")).toBeTruthy();

  await page.getByLabel("Stock category").selectOption("Paint");
  await page.locator("main").getByRole("button", { name: "Search", exact: true }).click();
  await page.getByRole("button", { name: "Download", exact: true }).click();
  const paintDownloadPromise = page.waitForEvent("download");
  await page.getByRole("menuitem", { name: "Excel" }).click();
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
  await page.getByRole("button", { name: "Next page", exact: true }).first().click();
  await expect(page.getByText(/Showing 11 to 20 of/)).toBeVisible();
  await page.getByLabel("Request status").selectOption("Pending");
  await page.locator("main").getByRole("button", { name: "Search", exact: true }).click();
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

test("company settings validate, preview, reset and persist report assets", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Admin Console", exact: true }).click();
  await page.getByRole("tab", { name: "Build Company Settings", exact: true }).click();
  await page.getByLabel("Company name").fill("E2E Auto Studio");

  const logo = page.locator(".company-image-field").filter({ hasText: "Company logo" });
  const fileInput = logo.locator('input[type="file"]');
  await fileInput.setInputFiles({ name: "logo.png", mimeType: "image/png", buffer: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", "base64") });
  const preview = logo.getByRole("img", { name: "Company logo preview" });
  await expect(preview).toHaveAttribute("src", /^data:image\/png;base64,/);
  const validSrc = await preview.getAttribute("src");
  await fileInput.setInputFiles({ name: "bad.txt", mimeType: "text/plain", buffer: Buffer.from("not an image") });
  await expect(page.getByRole("alert")).toContainText("must be a PNG, JPEG, or WebP");
  await expect(preview).toHaveAttribute("src", validSrc!);

  await page.getByRole("button", { name: "Save Company Settings" }).click();
  await expect(page.getByText("Company settings saved for this session.")).toBeVisible();
  await logo.getByRole("button", { name: "Clear" }).click();
  await expect(preview).toHaveCount(0);
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Reset to Saved" }).click();
  await expect(logo.getByRole("img", { name: "Company logo preview" })).toBeVisible();

  await page.reload();
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Admin Console", exact: true }).click();
  await page.getByRole("tab", { name: "Build Company Settings", exact: true }).click();
  await expect(page.getByLabel("Company name")).toHaveValue("E2E Auto Studio");
  await expect(page.getByRole("img", { name: "Company logo preview" })).toBeVisible();
});

test("tax and billing settings validate, normalize, persist, audit and drive invoice print", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Admin Console", exact: true }).click();
  await page.getByRole("tab", { name: "Business Settings", exact: true }).click();
  await page.getByRole("tab", { name: "Tax & Billing", exact: true }).click();

  await page.getByLabel("GSTIN", { exact: true }).fill("invalid");
  await page.getByLabel("IFSC", { exact: true }).fill("invalid");
  await page.getByLabel("UPI ID", { exact: true }).fill("invalid");
  await page.getByRole("button", { name: "Save Settings" }).click();
  await expect(page.getByRole("alert")).toContainText("GSTIN must be a valid");
  await expect(page.getByRole("alert")).toContainText("IFSC must contain");
  await expect(page.getByRole("alert")).toContainText("UPI ID must use");

  await page.getByLabel("GSTIN", { exact: true }).fill(" 21abcde1234f1z5 ");
  await page.getByLabel("Account holder", { exact: true }).fill("  E2E Auto Studio  ");
  await page.getByLabel("Bank name", { exact: true }).fill("  Saved E2E Bank  ");
  await page.getByLabel("Account number", { exact: true }).fill(" 001234567890 ");
  await page.getByLabel("IFSC", { exact: true }).fill(" sbin0001234 ");
  await page.getByLabel("Bank branch", { exact: true }).fill(" <Unsafe Branch> ");
  await page.getByLabel("UPI ID", { exact: true }).fill(" e2e@sbi ");
  await page.getByRole("button", { name: "Save Settings" }).click();
  await expect(page.getByText("Settings saved for this session.")).toBeVisible();
  await expect(page.getByLabel("GSTIN", { exact: true })).toHaveValue("21ABCDE1234F1Z5");
  await expect(page.getByLabel("IFSC", { exact: true })).toHaveValue("SBIN0001234");
  await expect(page.getByLabel("Account number", { exact: true })).toHaveValue("001234567890");

  await page.getByLabel("Bank name", { exact: true }).fill("Reset me");
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Reset to Saved" }).click();
  await expect(page.getByLabel("Bank name", { exact: true })).toHaveValue("Saved E2E Bank");

  await page.getByRole("tab", { name: "Support & Logs", exact: true }).click();
  await page.getByRole("tab", { name: "Feature Activity", exact: true }).click();
  await expect(page.getByText("Business settings saved", { exact: true })).toBeVisible();

  await page.reload();
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Admin Console", exact: true }).click();
  await page.getByRole("tab", { name: "Business Settings", exact: true }).click();
  await page.getByRole("tab", { name: "Tax & Billing", exact: true }).click();
  await expect(page.getByLabel("Bank name", { exact: true })).toHaveValue("Saved E2E Bank");
  await page.getByLabel("Bank name", { exact: true }).fill("UNSAVED BANK");

  await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Load Large Demo Dataset" }).click();
  await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  await page.getByLabel("Main status").selectOption("CLOSED");
  await page.locator("main").getByRole("button", { name: "Search", exact: true }).click();
  await page.locator(".record-card").first().getByRole("button", { name: "View", exact: true }).click();
  await page.getByRole("tab", { name: "Documents" }).click();
  const invoiceRow = page.locator(".document-row").filter({ has: page.getByText("Invoice", { exact: true }) });
  const downloadPromise = page.waitForEvent("download");
  await invoiceRow.getByRole("button", { name: "Download PDF" }).click();
  expect((await downloadPromise).suggestedFilename()).toMatch(/-invoice\.pdf$/);
});

test("report templates preview safely, validate, activate and persist", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Admin Console", exact: true }).click();
  await page.getByRole("tab", { name: "Report Templates", exact: true }).click();

  for (const category of ["invoice", "gate-pass", "job-card", "payment-receipt"]) {
    await page.getByLabel("Report category").selectOption(category);
    await page.getByRole("tab", { name: "Preview", exact: true }).click();
    await expect(page.locator(".template-preview")).toBeVisible();
    await page.getByRole("tab", { name: "Type", exact: true }).click();
  }

  await page.getByLabel("Report category").selectOption("invoice");
  await page.getByRole("button", { name: "New Template" }).click();
  await page.getByLabel("Template name").fill("Compact Invoice");
  await page.getByLabel("Template HTML").fill('<section onclick="alert(1)"><script>window.bad=1</script><img src="https://bad.example/logo.png"><h1>{{report.number}}</h1><p>{{customer.name}}</p></section>');
  await page.getByText("Active template", { exact: true }).getByRole("checkbox").check();

  page.once("dialog", (dialog) => dialog.dismiss());
  await page.getByLabel("Report category").selectOption("gate-pass");
  await expect(page.getByLabel("Report category")).toHaveValue("invoice");

  await page.getByRole("tab", { name: "Preview", exact: true }).click();
  const preview = page.frameLocator(".template-preview");
  await expect(preview.getByRole("heading", { name: "INV-2026-0042" })).toBeVisible();
  await expect(preview.locator("script")).toHaveCount(0);
  await expect(preview.locator("img")).not.toHaveAttribute("src");
  await expect(preview.locator("section")).not.toHaveAttribute("onclick");

  await page.getByRole("tab", { name: "Type", exact: true }).click();
  await page.getByLabel("Template HTML").fill("<p>{{unsupported.value}}</p>");
  await page.getByRole("button", { name: "Create Template" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "unsupported.value" }).first()).toBeVisible();
  await page.getByLabel("Template HTML").fill("<h1>{{report.number}}</h1><p>{{customer.name}}</p>{{blocks.line_items}}");
  await page.getByRole("button", { name: "Create Template" }).click();
  await expect(page.getByText("Template saved for this session.")).toBeVisible();
  await expect(page.getByLabel("Report template").locator("option:checked")).toContainText("Compact Invoice (Active)");

  await page.getByLabel("Template name").fill("Dirty name");
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.getByRole("tab", { name: "Business Settings", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Report Templates" })).toBeVisible();
  await page.getByLabel("Template name").fill("Compact Invoice");

  await page.reload();
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Admin Console", exact: true }).click();
  await page.getByRole("tab", { name: "Report Templates", exact: true }).click();
  await expect(page.getByLabel("Report template").locator("option:checked")).toContainText("Compact Invoice (Active)");
});

test("job documents download financial PDFs, print other templated reports and explain blocked popups", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Load Large Demo Dataset" }).click();
  await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  await page.getByLabel("Main status").selectOption("CLOSED");
  await page.locator("main").getByRole("button", { name: "Search", exact: true }).click();
  await page.locator(".record-card").first().getByRole("button", { name: "View", exact: true }).click();
  await page.getByRole("tab", { name: "Documents" }).click();

  for (const label of ["Job Card", "Payment Receipt", "Gate Pass"]) {
    const row = page.locator(".document-row").filter({ has: page.getByText(label, { exact: true }) });
    await expect(row.getByRole("button", { name: "Print / Save as PDF" })).toBeVisible();
    const popupPromise = page.waitForEvent("popup");
    await row.getByRole("button", { name: "Print / Save as PDF" }).click();
    const popup = await popupPromise;
    await popup.waitForLoadState("domcontentloaded");
    await expect(popup.locator('meta[http-equiv="Content-Security-Policy"]')).toHaveAttribute("content", /default-src 'none'/);
    await expect(popup.locator("body")).toContainText(label === "Payment Receipt" ? "PAYMENT RECEIPT" : label.toUpperCase());
    await popup.close();
  }

  for (const label of ["Estimate", "Invoice"]) {
    const row = page.locator(".document-row").filter({ has: page.getByText(label, { exact: true }) });
    const downloadPromise = page.waitForEvent("download");
    await row.getByRole("button", { name: "Download PDF" }).click();
    expect((await downloadPromise).suggestedFilename()).toMatch(new RegExp(`-${label.toLowerCase()}\\.pdf$`));
  }
  await page.evaluate(() => Object.defineProperty(window, "open", { configurable: true, value: () => null }));
  await page.locator(".document-row").filter({ has: page.getByText("Job Card", { exact: true }) }).getByRole("button", { name: "Print / Save as PDF" }).click();
  await expect(page.getByRole("alert")).toContainText("Allow pop-ups");
});

test("job lifecycle editor is ordered, status is read-only, and every action requires a confirmation note", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  await page.locator(".record-card").first().getByRole("button", { name: "Edit", exact: true }).click();
  const editor = page.getByRole("dialog", { name: /Edit Job/ });
  await expect(editor.getByLabel("Main Status")).toBeDisabled();
  await expect(editor.getByLabel("Sub Status")).toHaveCount(0);
  await expect(editor.getByRole("region", { name: "Job lifecycle" }).locator(".lifecycle-checklist li")).toHaveCount(3);
  await expect(editor.getByRole("tab")).toHaveText(["Details", "Materials", "Documents", "Photos / Media", "Invoice", "Payment"]);
  await expect(editor.getByRole("group", { name: "Downloads" })).toBeVisible();
  await editor.getByRole("tab", { name: "Materials" }).click();
  await expect(editor.getByText("Materials is coming soon.")).toBeVisible();
  await editor.getByRole("tab", { name: "Documents" }).click();
  await expect(editor.getByRole("region", { name: "Current job documents" })).toBeVisible();
  await expect(editor.getByRole("region", { name: "Current job documents" }).getByText("Job Card", { exact: true })).toBeVisible();
  await expect(editor.getByText(/remaining:|All steps complete/)).toBeVisible();
  await expect(editor.getByRole("button", { name: "Close Job" })).toBeVisible();
  await expect(editor.getByRole("button", { name: "Start Rework" })).toBeVisible();
  await editor.getByRole("button", { name: "Start Rework" }).click();
  const confirmation = page.getByRole("dialog", { name: "Start Rework?" });
  const note = confirmation.getByLabel("Confirmation note");
  await expect(note).toBeFocused();
  await confirmation.getByRole("button", { name: "Confirm status change" }).click();
  await expect(confirmation.getByRole("alert")).toHaveText("A confirmation note is required.");
  await note.fill("Customer requested cancellation");
  await confirmation.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(confirmation).toBeHidden();
});

test("lifecycle surfaces provide keyboard tabs, stacked dialogs, accessible names and mobile containment", async ({ page }) => {
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 390, height: 844 });
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  await page.getByLabel("Search job cards").fill("JC-2026-001247");
  await page.getByLabel("Search job cards").press("Enter");
  const editTrigger = page.locator(".record-card").filter({ hasText: "JC-2026-001247" }).getByRole("button", { name: "Edit" });
  await editTrigger.click();
  const jobDialog = page.getByRole("dialog", { name: /Edit Job/ });
  await expect(jobDialog).toBeVisible();
  await expect(jobDialog.getByRole("tab", { name: "Details" })).toHaveAttribute("tabindex", "0");
  await jobDialog.getByRole("tab", { name: "Details" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(jobDialog.getByRole("tab", { name: "Materials" })).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  await expect(jobDialog.getByRole("tab", { name: "Photos / Media" })).toHaveAttribute("aria-selected", "true");
  await expect(jobDialog.getByRole("tabpanel", { name: "Photos / Media" })).toBeVisible();
  const before = jobDialog.getByRole("tab", { name: "Before Work" });
  await before.focus();
  await page.keyboard.press("ArrowRight");
  await expect(jobDialog.getByRole("tab", { name: "After Work" })).toHaveAttribute("aria-selected", "true");
  await jobDialog.getByRole("tab", { name: "Details" }).click();

  const lifecycle = jobDialog.getByRole("region", { name: "Job lifecycle" });
  const action = lifecycle.getByRole("button", { name: /Cancel Job|Start Work|Complete Work|Start Rework|Close Job|Reopen Job/ }).first();
  await action.click();
  const confirmation = page.getByRole("dialog", { name: /\?$/ });
  await expect(page.getByRole("dialog")).toHaveCount(2);
  const note = confirmation.getByLabel("Confirmation note");
  await expect(note).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(confirmation.getByRole("button", { name: "Close dialog" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(confirmation.getByRole("button", { name: "Cancel", exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(confirmation).toBeHidden();
  await expect(jobDialog).toBeVisible();
  await expect(action).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");
  await expectNoPageOverflow(page);
  await page.keyboard.press("Escape");
  await expect(jobDialog).toBeHidden();
  await expect(editTrigger).toBeFocused();

  await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  const managementTabs = page.getByRole("tablist", { name: "Management areas" });
  await managementTabs.getByRole("tab", { name: "Users", exact: true }).focus();
  await page.keyboard.press("End");
  await expect(managementTabs.getByRole("tab", { name: "Delivery", exact: true })).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Home");
  await expect(managementTabs.getByRole("tab", { name: "Users", exact: true })).toHaveAttribute("aria-selected", "true");
  await page.getByRole("tab", { name: "Estimates", exact: true }).click();
  const estimateTrigger = page.getByRole("button", { name: /Edit Estimate|Create Estimate/ });
  await estimateTrigger.click();
  const estimate = page.getByRole("dialog", { name: /Estimate$/ });
  await expect(estimate.getByLabel("Discount")).toBeVisible();
  await expect(estimate.getByLabel("Overall GST %")).toBeVisible();
  await expectNoPageOverflow(page);
  await page.keyboard.press("Escape");
  await expect(estimateTrigger).toBeFocused();

  await page.locator(".role-nav").getByRole("button", { name: "Data Flow", exact: true }).click();
  const combobox = page.getByRole("combobox", { name: "Find a job" });
  await combobox.focus();
  await page.keyboard.press("ArrowDown");
  await expect(combobox).toHaveAttribute("aria-activedescendant", /data-flow-job-/);
  await page.keyboard.press("Enter");
  await expect(page.getByRole("region", { name: "Active lifecycle stage" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Chronological data flow" })).toBeVisible();
  await expectNoPageOverflow(page);
});

test("estimate dialog stages item CRUD and persists only on Save", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  await page.getByRole("tab", { name: "Estimates", exact: true }).click();
  await page.getByRole("button", { name: "Edit Estimate" }).click();
  let dialog = page.getByRole("dialog", { name: "Edit Estimate" });
  const savedDescription = await dialog.getByLabel("Item 1 description").inputValue();
  await dialog.getByLabel("Item 1 description").fill("Unsaved change");
  await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
  await page.getByRole("button", { name: "Edit Estimate" }).click();
  dialog = page.getByRole("dialog", { name: "Edit Estimate" });
  await expect(dialog.getByLabel("Item 1 description")).toHaveValue(savedDescription);
  await dialog.getByRole("button", { name: "Add Item" }).click();
  await dialog.getByLabel("Item 2 kind").selectOption("Material");
  await dialog.getByLabel("Item 2 description").fill("E2E polish");
  await dialog.getByLabel("Item 2 quantity").fill("2");
  await dialog.getByLabel("Item 2 rate").fill("250");
  await dialog.getByLabel("Discount").fill("50");
  await dialog.getByLabel("Overall GST %").fill("12");
  await dialog.getByLabel("Notes").fill("E2E estimate note");
  await dialog.getByRole("button", { name: "Save Estimate" }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByText("E2E polish")).toBeVisible();
  await expect(page.getByText("E2E estimate note")).toBeVisible();
});

test("non-owner roles see lifecycle mutations as read only while the linked advisor can act", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  await page.getByRole("tab", { name: "Users", exact: true }).click();
  await page.getByRole("button", { name: "Add User" }).click();
  await page.getByLabel("User name").fill("Other Advisor");
  await page.getByLabel("User email").fill("other.advisor@example.com");
  await page.getByLabel("User role").selectOption("service");
  await page.getByLabel("User password").fill("admin123");
  await page.getByRole("button", { name: "Save User" }).click();
  await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  const reassignedJob = "JC-2026-001247";
  await page.locator(".record-card").filter({ hasText: reassignedJob }).getByRole("button", { name: "Edit" }).click();
  const editor = page.getByRole("dialog", { name: /Edit Job/ });
  await editor.locator("label").filter({ hasText: /^Advisor/ }).locator("select").selectOption({ label: "Other Advisor" });
  await editor.getByRole("button", { name: "Save Job Card" }).click();
  await editor.getByRole("button", { name: "Close dialog" }).click();
  await page.locator(".logout").click();
  await loginAs(page, "service@example.com");
  await expect(page.getByText(reassignedJob)).toHaveCount(0);
  await page.locator(".role-nav").getByRole("button", { name: "Job Card", exact: true }).click();
  await expect(page.getByRole("region", { name: "Job lifecycle" }).getByRole("button", { name: /Close Job|Cancel Job|Start Rework|Complete Work|Start Work|Reopen Job/ }).first()).toBeVisible();
});

test("job card media validates, compresses, edits, archives, stays session-only, and responds on mobile", async ({ page }) => {
  const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", "base64");
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  await page.locator(".record-card").first().getByRole("button", { name: "View", exact: true }).click();
  const job = page.getByRole("dialog", { name: /View Job/ });
  await job.getByRole("tab", { name: "Photos / Media" }).click();
  const media = job.getByRole("region", { name: "Job card photos and media" });
  await expect(media.getByRole("tab", { name: "Before Work" })).toHaveAttribute("aria-selected", "true");
  await expect(media.getByRole("tab", { name: "After Work" })).toBeVisible();

  await media.getByLabel("Image file").setInputFiles({ name: "unsafe.svg", mimeType: "image/svg+xml", buffer: Buffer.from("<svg></svg>") });
  await expect(media.getByRole("alert")).toContainText("JPEG, PNG, or WebP");
  await media.getByLabel("Image file").setInputFiles({ name: "wrong.jpg", mimeType: "image/jpeg", buffer: png });
  await expect(media.getByRole("alert")).toContainText("does not match");

  await media.getByLabel("Photo label").fill("Arrival inspection");
  await media.getByLabel("Image file").setInputFiles({ name: "before.png", mimeType: "image/png", buffer: png });
  await expect(media.getByText(/Ready: 1 × 1/)).toBeVisible();
  await media.getByRole("button", { name: "Upload to Before Work" }).click();
  const uploaded = media.getByRole("article").filter({ hasText: "Arrival inspection" });
  const uploadedImage = uploaded.getByRole("img", { name: "Arrival inspection" });
  await expect(uploadedImage).toHaveAttribute("src", /^data:image\/jpeg;base64,/);
  const compressedBytes = await uploadedImage.evaluate((image) => Math.floor(((image.getAttribute("src")?.split(",")[1].length ?? 0) * 3) / 4));
  expect(compressedBytes).toBeLessThanOrEqual(1_000_000);

  await uploaded.getByRole("button", { name: "Edit" }).click();
  const edit = page.getByRole("dialog", { name: "Edit photo metadata" });
  await edit.getByLabel("Photo label").fill("Completed inspection");
  await edit.getByLabel("Work phase").selectOption("After Work");
  await edit.getByRole("button", { name: "Save metadata" }).click();
  await expect(media.getByText("No before work images yet.")).toBeVisible();
  await media.getByRole("tab", { name: "After Work" }).click();
  await expect(media.getByRole("img", { name: "Completed inspection" })).toBeVisible();

  await media.getByRole("tab", { name: "Before Work" }).click();
  await media.getByLabel("Photo label").fill("Archive candidate");
  await media.getByLabel("Image file").setInputFiles({ name: "archive.png", mimeType: "image/png", buffer: png });
  await media.getByRole("button", { name: "Upload to Before Work" }).click();
  const candidate = media.getByRole("article").filter({ hasText: "Archive candidate" });
  await candidate.getByRole("button", { name: "Archive" }).click();
  const archive = page.getByRole("dialog", { name: "Archive photo?" });
  await expect(archive.getByLabel("Archive reason")).toBeFocused();
  await archive.getByLabel("Archive reason").fill("Duplicate view");
  await archive.getByRole("button", { name: "Archive photo" }).click();
  await expect(candidate).toHaveCount(0);

  const durableContainsMedia = await page.evaluate(() => Object.values(localStorage).some((value) => {
    try { return atob(value).includes("Completed inspection") || atob(value).includes("/9j/"); } catch { return false; }
  }));
  expect(durableContainsMedia).toBe(false);
  await job.getByRole("tab", { name: "Details" }).click();
  await job.getByRole("tab", { name: "Photos / Media" }).click();
  await media.getByRole("tab", { name: "After Work" }).click();
  await expect(media.getByRole("img", { name: "Completed inspection" })).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  const galleryBox = await media.getByTestId("job-media-gallery").boundingBox();
  expect(galleryBox).not.toBeNull();
  expect(galleryBox!.x + galleryBox!.width).toBeLessThanOrEqual(390);

  await page.reload();
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  await page.locator(".record-card").first().getByRole("button", { name: "View", exact: true }).click();
  await page.getByRole("dialog", { name: /View Job/ }).getByRole("tab", { name: "Photos / Media" }).click();
  await expect(page.getByText("Completed inspection")).toHaveCount(0);
});

test("linked advisor can change job media while other authorized job viewers are read only", async ({ page }) => {
  await loginAs(page, "service@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "My Queue", exact: true }).click();
  await page.locator(".record-card").first().getByRole("button", { name: "View", exact: true }).click();
  let job = page.getByRole("dialog", { name: /View Job/ });
  await job.getByRole("tab", { name: "Photos / Media" }).click();
  await expect(job.getByLabel("Image file")).toBeVisible();
  await job.getByRole("button", { name: "Close dialog" }).click();
  await page.locator(".logout").click();

  await loginAs(page, "reception@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Search", exact: true }).click();
  await page.getByLabel("Search category").selectOption("job");
  await page.locator("main").getByRole("button", { name: "Search", exact: true }).click();
  await page.getByRole("table", { name: "Job search results" }).getByRole("button", { name: "View" }).first().click();
  job = page.getByRole("dialog", { name: /View Job/ });
  await job.getByRole("tab", { name: "Photos / Media" }).click();
  await expect(job.getByText(/Read only.*Owner.*linked Service Advisor/)).toBeVisible();
  await expect(job.getByLabel("Image file")).toHaveCount(0);
});

async function loginAs(page: import("@playwright/test").Page, email: string) {
  await page.getByLabel("Emulate User:").selectOption(email);
  await page.getByRole("button", { name: "Login" }).click();
}

async function expectNoPageOverflow(page: import("@playwright/test").Page) {
  const dimensions = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
  expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport + 1);
  expect(dimensions.body).toBeLessThanOrEqual(dimensions.viewport + 1);
}

async function readWorksheet(download: import("@playwright/test").Download) {
  const filePath = await download.path();
  if (!filePath) throw new Error("Downloaded workbook was not saved");
  const workbook = XLSX.readFile(filePath);
  return XLSX.utils.sheet_to_json<(string | number)[]>(workbook.Sheets.Report, { header: 1, defval: "" });
}

test("job sheet intake fields and damage marks persist through the Job Card edit dialog", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  await page.locator(".record-card").first().getByRole("button", { name: "Edit", exact: true }).click();
  const sheet = page.getByRole("region", { name: "Job sheet" });
  await sheet.getByLabel("Service Type").selectOption("PPF");
  await sheet.getByLabel("Engine Number").fill("ENG-E2E-1");
  await sheet.getByLabel("Address").fill("12 MG Road");
  await sheet.getByRole("button", { name: "Save Job Sheet" }).click();
  const diagram = sheet.getByTestId("damage-diagram").locator("svg");
  await diagram.click({ position: { x: 20, y: 30 } });
  await diagram.click({ position: { x: 60, y: 90 } });
  await expect(sheet.getByTestId("damage-mark")).toHaveCount(2);
  await sheet.getByTestId("damage-mark").first().click();
  await expect(sheet.getByTestId("damage-mark")).toHaveCount(1);
  await page.getByRole("button", { name: "Close dialog" }).click();
  await page.locator(".record-card").first().getByRole("button", { name: "View", exact: true }).click();
  const view = page.getByRole("region", { name: "Job sheet" });
  await expect(view.getByText("ENG-E2E-1")).toBeVisible();
  await expect(view.getByText("12 MG Road")).toBeVisible();
  await expect(view.getByText("PPF", { exact: true })).toBeVisible();
  await expect(view.getByTestId("damage-mark")).toHaveCount(1);
});
