import { expect, test } from "@playwright/test";
import XLSX from "xlsx";
import { readFileSync, statSync } from "node:fs";

const roles = [
  ["reception@example.com", ["Today Queue", "Advance Bookings", "Customers", "Vehicles", "Search"]],
  ["service@example.com", ["My Queue", "Job Card", "Estimate", "Follow-ups", "Media", "Search"]],
  ["store@example.com", ["Material Requests", "Issue Material", "Reconcile", "Stock", "Search"]],
  ["tech@example.com", ["My Tasks", "Work Update", "QC Prep", "Search"]],
  ["accounts@example.com", ["Ready To Invoice", "Invoice", "Payment", "Delivery", "Search"]],
  ["admin@example.com", ["Dashboard", "Data Flow", "Job Cards", "Media", "Search"]],
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

test("advance bookings are limited to the next two complete months", async ({ page }) => {
  await loginAs(page, "reception@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Advance Bookings", exact: true }).click();

  const expected = await page.evaluate(() => {
    const now = new Date();
    const month = (offset: number) => {
      const value = new Date(now.getFullYear(), now.getMonth() + offset, 1);
      return {
        key: `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}`,
        label: value.toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
      };
    };
    const first = month(1);
    const last = month(2);
    return {
      first,
      last,
      min: `${first.key}-01`,
      max: `${last.key}-${String(new Date(now.getFullYear(), now.getMonth() + 3, 0).getDate()).padStart(2, "0")}`,
    };
  });

  const calendar = page.getByLabel("Booking month calendar");
  await expect(calendar.getByRole("heading", { level: 3 })).toHaveText(expected.first.label);
  await expect(calendar.getByRole("button", { name: "Previous month" })).toBeDisabled();
  await expect(calendar.locator('button[role="gridcell"]:disabled')).not.toHaveCount(0);

  await calendar.getByRole("button", { name: "Next month" }).click();
  await expect(calendar.getByRole("heading", { level: 3 })).toHaveText(expected.last.label);
  await expect(calendar.getByRole("button", { name: "Next month" })).toBeDisabled();

  await page.getByRole("button", { name: "Create Booking" }).click();
  const dateInput = page.getByRole("dialog", { name: "Create advance booking" }).getByLabel("Booking date");
  await expect(dateInput).toHaveValue(`${expected.last.key}-01`);
  await expect(dateInput).toHaveAttribute("min", expected.min);
  await expect(dateInput).toHaveAttribute("max", expected.max);
});

test("Accounts Ready To Invoice lists only active pending invoices and is read only", async ({ page }) => {
  await loginAs(page, "accounts@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Ready To Invoice", exact: true }).click();

  const manager = page.locator('[data-billing-manager="Invoices"]');
  const table = page.getByRole("table", { name: "Invoices manager" });
  const records = table.locator("tbody > tr:not(.billing-detail-row)");
  await expect(manager.getByRole("heading", { name: "Ready To Invoice" })).toBeVisible();
  await expect(records).not.toHaveCount(0);
  expect((await records.locator("td:nth-last-child(2)").allTextContents()).every((status) => status.trim() === "Pending")).toBe(true);
  await expect(table.getByRole("button", { name: "Quick Mark Paid", exact: true })).toHaveCount(0);
  await expect(table.getByRole("button", { name: "Download", exact: true }).first()).toBeVisible();

  await table.getByRole("button", { name: "View", exact: true }).first().click();
  await expect(page.getByRole("dialog", { name: "View Invoice" })).toBeVisible();
  await expect(page.getByRole("dialog", { name: "View Invoice" }).getByRole("button", { name: /Save Invoice|Update Invoice/ })).toHaveCount(0);
});

test("desktop main content scrolls without moving the navigation rail", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 720 });
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Load Large Demo Dataset" }).click();
  await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();

  const rail = page.locator(".rail");
  const main = page.locator("main");
  const railBefore = await rail.boundingBox();
  const scroll = await main.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
    return { clientHeight: element.clientHeight, scrollHeight: element.scrollHeight, scrollTop: element.scrollTop };
  });

  expect(scroll.scrollHeight).toBeGreaterThan(scroll.clientHeight);
  expect(scroll.scrollTop).toBeGreaterThan(0);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  expect((await rail.boundingBox())?.y).toBe(railBefore?.y);
});

test("desktop navigation scrolls independently in a short viewport", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 360 });
  await loginAs(page, "admin@example.com");

  const nav = page.locator(".role-nav");
  const scroll = await nav.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
    return { clientHeight: element.clientHeight, scrollHeight: element.scrollHeight, scrollTop: element.scrollTop };
  });

  expect(scroll.scrollHeight).toBeGreaterThan(scroll.clientHeight);
  expect(scroll.scrollTop).toBeGreaterThan(0);
  await nav.getByRole("button", { name: "Search", exact: true }).scrollIntoViewIfNeeded();
  await expect(nav.getByRole("button", { name: "Search", exact: true })).toBeVisible();
});

test("admin hides customer and vehicle pages from its navigation rail", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  const nav = page.locator(".role-nav");
  await expect(nav.getByRole("button", { name: "Search", exact: true })).toBeVisible();
  await expect(nav.getByRole("button", { name: "Customers", exact: true })).toHaveCount(0);
  await expect(nav.getByRole("button", { name: "Vehicles", exact: true })).toHaveCount(0);
});

test("saved Store page access immediately removes Purchase Orders from its inventory navigation", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Admin Console", exact: true }).click();
  await page.getByRole("tab", { name: "Roles & Page Access", exact: true }).click();
  await page.locator(".role-list").getByRole("button", { name: /Store/ }).click();
  await page.getByLabel("Purchase Orders", { exact: true }).uncheck();
  await page.getByRole("button", { name: "Save Changes", exact: true }).click();
  await page.getByRole("button", { name: "Logout", exact: true }).click();

  await loginAs(page, "store@example.com");
  const nav = page.locator(".role-nav");
  await expect(nav.getByRole("button", { name: "Stock", exact: true })).toBeVisible();
  await expect(nav.getByRole("button", { name: "Purchase Orders", exact: true })).toHaveCount(0);
});

test("admin dashboard presents live metrics in an accessible command-center grid", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await loginAs(page, "admin@example.com");

  const dashboard = page.getByRole("region", { name: "Workshop command center" });
  const grid = dashboard.locator(".command-grid");
  const metrics = ["Active today", "Total visits", "In progress", "Closed", "On hold", "Total collections", "Projected monthly collection", "Payments received", "Invoices generated", "Customers served", "Vehicles served", "Low-stock items", "Pending approvals", "Material requests", "Materials issued"];
  await expect(grid.locator(".command-card")).toHaveCount(4);
  await expect(grid.locator(".command-metric")).toHaveCount(15);
  await expect(dashboard.getByLabel(/^Today:/)).toContainText("Real-time overview");
  for (const variant of ["flow", "cashflow", "reach", "inventory"]) await expect(grid.locator(`[data-dashboard-card="${variant}"]`)).toHaveCount(1);
  for (const metric of metrics) await expect(grid.getByRole("button", { name: new RegExp(`Open ${metric}:`) })).toBeVisible();
  expect(await grid.evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length)).toBe(2);
  expect(await grid.locator(".command-card").first().evaluate((element) => getComputedStyle(element).height)).toBe(await grid.locator(".command-card").nth(1).evaluate((element) => getComputedStyle(element).height));
  await expect(grid.locator(".command-card-open")).toHaveCount(4);
  await expect(grid.locator(".command-card-open").first()).toHaveAttribute("aria-label", "View active jobs");
  expect(await grid.locator(".command-flow").evaluate((element) => getComputedStyle(element).backgroundImage)).not.toBe("none");

  const cashflowMonth = dashboard.getByLabel("Cashflow month");
  await expect(cashflowMonth).toHaveCount(1);
  const initialCashflowMonth = await cashflowMonth.inputValue();
  await expect(grid.locator(".command-cashflow .command-metric-primary")).toHaveCount(1);
  await expect(grid.locator(".command-cashflow .command-metric-projection")).toHaveCount(1);
  await expect(grid.locator(".collection-pace-track")).toBeVisible();
  await expect(grid.locator(".collection-bars i")).toHaveCount(7);
  await expect(grid.locator(".customer-trend")).toBeVisible();

  await grid.locator(".command-card").first().focus();
  await expect(grid.locator(".command-card").first()).toHaveCSS("outline-style", "solid");

  await grid.getByRole("button", { name: /Open Total visits:/ }).click();
  await expect(page.getByRole("heading", { name: "Job Cards", exact: true })).toBeVisible();
  await page.locator(".role-nav").getByRole("button", { name: "Dashboard", exact: true }).click();

  await grid.locator(".command-cashflow").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".role-nav").getByRole("button", { name: "Search", exact: true })).toHaveClass(/active/);

  await page.locator(".role-nav").getByRole("button", { name: "Dashboard", exact: true }).click();
  await dashboard.getByRole("button", { name: "View collections", exact: true }).click();
  await expect(page.getByLabel("Search category")).toHaveValue("payment");
  await expect(page.getByLabel("Search month-year")).toHaveValue(initialCashflowMonth);

  await page.locator(".role-nav").getByRole("button", { name: "Dashboard", exact: true }).click();
  await dashboard.getByRole("button", { name: "View customers served", exact: true }).click();
  await expect(page.getByLabel("Search category")).toHaveValue("customer");
  await expect(page.locator(".record-grid.customers")).toBeVisible();

  await page.locator(".role-nav").getByRole("button", { name: "Dashboard", exact: true }).click();
  await dashboard.getByRole("button", { name: "View low-stock blockers", exact: true }).click();
  await expect(page.getByLabel("Search category")).toHaveValue("stock");
  const stockRows = page.getByRole("table", { name: "Stock search results" }).locator("tbody tr");
  const lowStockCount = await stockRows.count();
  expect(await stockRows.evaluateAll((rows) => rows.every((row) => Number(row.children[3]?.textContent) < Number(row.children[5]?.textContent)))).toBe(true);
  await page.locator(".portal > .list-filter-bar").getByRole("button", { name: "Clear", exact: true }).click();
  await expect(page.getByLabel("Search category")).toHaveValue("stock");
  await expect(stockRows.first()).toBeVisible();
  expect(await stockRows.count()).toBeGreaterThanOrEqual(lowStockCount);

  await page.locator(".role-nav").getByRole("button", { name: "Dashboard", exact: true }).click();
  if (await cashflowMonth.locator("option").count() > 1) {
    const historicalCashflowMonth = await cashflowMonth.locator("option").nth(1).getAttribute("value");
    await cashflowMonth.selectOption(historicalCashflowMonth!);
    await expect(dashboard.getByText("Month complete", { exact: true })).toBeVisible();
    await expect(dashboard.getByRole("button", { name: /Open Final collection:/ })).toBeVisible();
    await dashboard.getByRole("button", { name: "View collections", exact: true }).click();
    await expect(page.getByLabel("Search month-year")).toHaveValue(historicalCashflowMonth!);
    await page.locator(".role-nav").getByRole("button", { name: "Dashboard", exact: true }).click();
  }

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".command-card").first()).toHaveCSS("transition-duration", "0s");
  await page.setViewportSize({ width: 390, height: 844 });
  await expectNoPageOverflow(page);
  expect(await page.locator(".command-grid").evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length)).toBe(1);

  await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Job Cards", exact: true })).toBeVisible();
  await expectNoPageOverflow(page);
});

test("reception creates a linked customer vehicle visit and job searchable after reload", async ({ page }) => {
  await loginAs(page, "reception@example.com");
  await page.getByRole("button", { name: "Create New Visit" }).click();
  const dialog = page.getByRole("dialog", { name: "Create New Visit" });
  const details = dialog.getByRole("tab", { name: "Details", exact: true });
  const bodyMark = dialog.getByRole("tab", { name: "Body Mark", exact: true });
  await expect(details).toHaveAttribute("aria-selected", "true");
  await expect(dialog.getByRole("tabpanel", { name: "Details" })).toBeVisible();
  await expect(dialog.getByTestId("damage-diagram")).toHaveCount(0);
  const customerPicker = dialog.getByRole("combobox", {
    name: "Existing customer",
  });
  const vehiclePicker = dialog.getByRole("combobox", {
    name: "Existing vehicle",
  });
  const rahulVehicle = "OD02AB1234 · Hyundai Creta · Rahul Sharma · 9876543210";

  await customerPicker.fill("9876543210");
  await dialog
    .getByRole("option", { name: "Rahul Sharma · 9876543210" })
    .click();
  await expect(dialog.getByLabel("Customer Name")).toHaveValue("Rahul Sharma");
  await expect(dialog.getByLabel("Mobile")).toHaveValue("9876543210");
  await expect(dialog.getByLabel("Vehicle Number")).toHaveValue("OD02AB1234");
  await expect(dialog.getByLabel("Make")).toHaveValue("Hyundai");
  await expect(dialog.getByLabel("Model")).toHaveValue("Creta");

  await customerPicker.click();
  await dialog
    .getByRole("option", { name: "Clear customer and vehicle" })
    .click();
  await expect(dialog.getByLabel("Customer Name")).toHaveValue("");
  await expect(dialog.getByLabel("Vehicle Number")).toHaveValue("");

  await vehiclePicker.fill("Rahul Sharma");
  await dialog.getByRole("option", { name: rahulVehicle }).click();
  await expect(dialog.getByLabel("Customer Name")).toHaveValue("Rahul Sharma");
  await expect(dialog.getByLabel("Mobile")).toHaveValue("9876543210");
  await expect(dialog.getByLabel("Vehicle Number")).toHaveValue("OD02AB1234");

  await vehiclePicker.click();
  await dialog.getByRole("option", { name: "Clear vehicle" }).click();
  await expect(dialog.getByLabel("Customer Name")).toHaveValue("Rahul Sharma");
  await expect(dialog.getByLabel("Vehicle Number")).toHaveValue("");

  await vehiclePicker.fill("OD02AB1234");
  await expect(dialog.getByRole("option", { name: rahulVehicle })).toBeVisible();
  await vehiclePicker.fill("Creta");
  await dialog.getByRole("option", { name: rahulVehicle }).click();
  await expect(dialog.getByLabel("Customer Name")).toHaveValue("Rahul Sharma");
  await expect(dialog.getByLabel("Model")).toHaveValue("Creta");

  await customerPicker.click();
  await dialog
    .getByRole("option", { name: "Clear customer and vehicle" })
    .click();
  await dialog.getByLabel("Customer Name").fill("E2E Customer");
  await dialog.getByLabel("Mobile").fill("9000099999");
  await dialog.getByLabel("Vehicle Number").fill("OD02E2E9999");
  await dialog.getByLabel("Make").fill("Kia");
  await dialog.getByLabel("Model").fill("Seltos");
  await dialog.getByLabel("ODO meter reading (km)").fill("12000");
  await dialog.locator("#create-visit-form .field-pair input").fill("3");
  const requestedWork = dialog.getByLabel("Requested Work");
  await expect(requestedWork).toHaveAttribute("rows", "3");
  await requestedWork.fill("E2E coating inspection");

  await bodyMark.click();
  const bodyMarkPanel = dialog.getByRole("tabpanel", { name: "Body Mark" });
  const diagram = bodyMarkPanel.getByTestId("damage-diagram");
  await expect(diagram).toBeVisible();
  const panelBox = await bodyMarkPanel.boundingBox();
  const diagramBox = await diagram.boundingBox();
  expect(panelBox).not.toBeNull();
  expect(diagramBox).not.toBeNull();
  expect(Math.abs((diagramBox!.x + diagramBox!.width / 2) - (panelBox!.x + panelBox!.width / 2))).toBeLessThanOrEqual(2);
  await diagram.locator(".body-mark-canvas").click({ position: { x: 60, y: 60 } });
  await expect(diagram.getByTestId("damage-mark")).toHaveCount(1);

  await details.click();
  await expect(requestedWork).toHaveValue("E2E coating inspection");
  await bodyMark.click();
  await expect(diagram.getByTestId("damage-mark")).toHaveCount(1);
  await details.click();
  await dialog.getByRole("button", { name: "Create Visit" }).click();
  await page.reload();
  await loginAs(page, "reception@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Search", exact: true }).click();
  await page.getByLabel("Search records").fill("OD02E2E9999");
  await page.getByLabel("Search category").selectOption("vehicle");
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

test("list filters expose Clear but no Search submit action", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  await page.getByRole("tab", { name: "Customers", exact: true }).click();
  await expect(page.getByRole("tabpanel").getByRole("button", { name: "Clear", exact: true })).toBeVisible();
  await expect(page.getByRole("tabpanel").getByRole("button", { name: "Search", exact: true })).toHaveCount(0);

  await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  await expect(page.locator(".entity-list-page").getByRole("button", { name: "Search", exact: true })).toHaveCount(0);
});

test("Management Hub filters use compact Month-Year toolbars and remain keyboard and mobile safe", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  const hub = page.locator(".management-hub");

  await page.getByRole("tab", { name: "Invoices", exact: true }).click();
  const invoices = hub.locator('[data-billing-manager="Invoices"]');
  await expect(invoices.getByLabel("Search invoices")).toBeVisible();
  await expect(invoices.getByLabel("Invoices Month-Year filter")).toBeVisible();
  await expect(invoices.getByLabel("Invoices status filter")).toBeVisible();
  await expect(invoices.locator('input[type="date"]')).toHaveCount(0);
  await expect(invoices.locator(".job-selector")).toHaveCount(0);
  await expect(invoices.getByRole("button", { name: "Search", exact: true })).toHaveCount(0);
  await expectManagementToolbarHasOneRow(invoices, ".billing-panel-filter-grid");

  await page.getByRole("tab", { name: "Payments", exact: true }).click();
  const payments = hub.locator('[data-billing-manager="Payments"]');
  await expect(payments.getByLabel("Search payments")).toBeVisible();
  await expect(payments.getByLabel("Payments Month-Year filter")).toBeVisible();
  await expect(payments.getByLabel("Payment mode filter")).toBeVisible();
  await expect(payments.getByLabel("Payments status filter")).toHaveCount(0);
  await expect(payments.locator('input[type="date"]')).toHaveCount(0);
  await expectManagementToolbarHasOneRow(payments, ".billing-panel-filter-grid");

  await page.getByRole("tab", { name: "Delivery", exact: true }).click();
  await expect(hub.getByLabel("Search delivery")).toBeVisible();
  await expect(hub.getByRole("button", { name: "Search", exact: true })).toHaveCount(0);
  await expectNoPageOverflow(page);

  await page.getByRole("tab", { name: "Estimates", exact: true }).click();
  await expect(hub.getByLabel("Job for Estimates search")).toBeVisible();
  await expect(hub.getByLabel("Job for Estimates Month-Year filter")).toBeVisible();
  await expect(hub.getByLabel("Job for Estimates received date")).toHaveCount(0);
  await expect(hub.getByLabel("Job for Estimates month", { exact: true })).toHaveCount(0);
  await expect(hub.getByLabel("Job for Estimates year", { exact: true })).toHaveCount(0);
  await expectManagementToolbarHasOneRow(hub, ".job-selector");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("tab", { name: "Job Cards", exact: true }).click();
  await expect(hub.getByLabel("Search job cards")).toBeVisible();
  await expectNoPageOverflow(page);
  await page.getByRole("tab", { name: "Estimates", exact: true }).click();
  await expectManagementToolbarStacks(hub, ".job-selector");
  await expectNoPageOverflow(page);
});

test("Management Hub Job Cards filters received dates, months, archived records, and clears", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  await page.getByRole("tab", { name: "Job Cards", exact: true }).click();

  const toolbar = page.locator(".job-card-filter-grid");
  const date = toolbar.getByLabel("Managed job cards date");
  const month = toolbar.getByLabel("Managed job cards month-year");
  const archived = toolbar.getByRole("switch", { name: "Show archived only" });
  const tableRows = page.getByRole("table", { name: "Managed job cards" }).locator("tbody tr");
  const today = await page.evaluate(() => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60_000;
    return new Date(now.getTime() - offset).toISOString().slice(0, 10);
  });

  await expect(date).toHaveValue(today);
  await expect(tableRows).not.toHaveCount(0);
  await expectJobCardToolbarHasOneRow(page);

  const months = await month.locator("option").evaluateAll((options) => options.slice(1).map((option) => (option as HTMLOptionElement).value));
  expect(months).not.toHaveLength(0);
  expect(months).toEqual([...months].sort((left, right) => right.localeCompare(left)));
  await month.selectOption(months[0]);
  await expect(date).toHaveValue("");
  await expect(tableRows).not.toHaveCount(0);

  await date.fill(today);
  await expect(month).toHaveValue("");
  await archived.click();
  await expect(archived).toHaveAttribute("aria-checked", "true");
  await expect(page.getByText(/Showing 0 to 0 of 0|Showing 1 to/)).toBeVisible();

  await toolbar.getByRole("button", { name: "Clear", exact: true }).click();
  await expect(date).toHaveValue("");
  await expect(month).toHaveValue("");
  await expect(archived).toHaveAttribute("aria-checked", "false");

  await page.setViewportSize({ width: 390, height: 844 });
  const directOverflow = await page.locator(".entity-list-page.kind-jobs *").evaluateAll((elements) => elements.map((element) => ({ tag: element.tagName, className: (element as HTMLElement).className, scrollWidth: (element as HTMLElement).scrollWidth, clientWidth: (element as HTMLElement).clientWidth, display: getComputedStyle(element).display })).filter((element) => element.scrollWidth > element.clientWidth + 1).slice(0, 12));
  if (directOverflow.some((element) => element.scrollWidth > element.clientWidth + 1)) throw new Error(JSON.stringify(directOverflow));
  await expectNoPageOverflow(page);
  const [clearBox, toolbarBox] = await Promise.all([
    toolbar.getByRole("button", { name: "Clear", exact: true }).boundingBox(),
    toolbar.boundingBox(),
  ]);
  expect(clearBox).not.toBeNull();
  expect(toolbarBox).not.toBeNull();
  expect(clearBox!.width).toBeCloseTo(toolbarBox!.width, 0);
});

test("direct Job Cards uses the focused received-date toolbar", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();

  const toolbar = page.locator(".direct-job-card-filter-grid");
  const date = toolbar.getByLabel("Direct job cards date");
  const month = toolbar.getByLabel("Direct job cards month-year");
  const archived = toolbar.getByRole("switch", { name: "Show archived only" });
  const today = await page.evaluate(() => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60_000;
    return new Date(now.getTime() - offset).toISOString().slice(0, 10);
  });

  await expect(date).toHaveValue(today);
  await expect(toolbar.getByLabel("Job status filter")).toBeVisible();
  await expect(toolbar.getByLabel("Workflow status")).toHaveCount(0);
  await expect(toolbar.getByLabel("Customer filter")).toHaveCount(0);
  await expect(toolbar.getByLabel("Vehicle filter")).toHaveCount(0);
  await expect(toolbar.getByLabel("Service advisor filter")).toHaveCount(0);
  await expect(toolbar.getByLabel("Sort results")).toHaveCount(0);
  const desktopRows = await toolbar.locator("> label, > .list-search-actions").evaluateAll((controls) => {
    const positions = controls.map((control) => Math.round(control.getBoundingClientRect().bottom));
    return new Set(positions).size;
  });
  expect(desktopRows).toBeLessThanOrEqual(2);

  const months = await month.locator("option").evaluateAll((options) => options.slice(1).map((option) => (option as HTMLOptionElement).value));
  expect(months).not.toHaveLength(0);
  expect(months).toEqual([...months].sort((left, right) => right.localeCompare(left)));
  await month.selectOption(months[0]);
  await expect(date).toHaveValue("");

  await date.fill(today);
  await expect(month).toHaveValue("");
  await page.locator(".record-card").first().getByRole("button", { name: "View", exact: true }).click();
  await expect(page.getByRole("dialog", { name: /View Job/ })).toBeVisible();
  await page.getByRole("button", { name: "Go Back" }).click();
  await archived.click();
  await expect(archived).toHaveAttribute("aria-checked", "true");
  await expect(page.getByRole("dialog", { name: /View Job/ })).toHaveCount(0);

  await toolbar.getByRole("button", { name: "Clear", exact: true }).click();
  await expect(date).toHaveValue("");
  await expect(month).toHaveValue("");
  await expect(archived).toHaveAttribute("aria-checked", "false");
  await expect(page.getByText(/Showing 1 to/)).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  const [clearBox, toolbarBox] = await Promise.all([
    toolbar.getByRole("button", { name: "Clear", exact: true }).boundingBox(),
    toolbar.boundingBox(),
  ]);
  expect(clearBox).not.toBeNull();
  expect(toolbarBox).not.toBeNull();
  expect(clearBox!.width).toBeGreaterThanOrEqual(toolbarBox!.width - 24);
});

test("search shows an explicit empty state without an unrelated job", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Search", exact: true }).click();
  await page.getByLabel("Search records").fill("definitely-no-workshop-record");
  await page.getByLabel("Search category").selectOption("job");
  await expect(page.getByText("No matching records")).toBeVisible();
  await expect(page.getByText("Showing 0 to 0 of 0")).toBeVisible();
});

test("service Search retains its four record categories without the underlying page grants", async ({ page }) => {
  await page.evaluate(() => sessionStorage.setItem("workshopos.admin-demo.v1", JSON.stringify({
    version: 1, roles: [], rolePageAccess: { service: ["search"] }, logs: [],
  })));
  await page.reload();
  await loginAs(page, "service@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Search", exact: true }).click();

  const categorySelect = page.getByLabel("Search category");
  await expect(categorySelect.locator("option")).toHaveCount(5);
  for (const [value, label] of [["job", "Job Card"], ["customer", "Customer"], ["vehicle", "Vehicle"], ["invoice", "Invoice"]]) {
    await expect(categorySelect.locator(`option[value="${value}"]`)).toHaveText(label);
  }

  await categorySelect.selectOption("customer");
  const customerResults = page.locator(".record-grid.customers");
  await expect(customerResults.getByRole("button", { name: "View", exact: true }).first()).toBeVisible();
  await expect(customerResults.getByRole("button", { name: "Edit", exact: true })).toHaveCount(0);

  await categorySelect.selectOption("vehicle");
  const vehicleResults = page.locator(".record-grid.vehicles");
  await expect(vehicleResults.getByRole("button", { name: "View", exact: true }).first()).toBeVisible();
  await expect(vehicleResults.getByRole("button", { name: "Edit", exact: true })).toHaveCount(0);
});

test("search combines entity and lifecycle filters and clears predictably", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Search", exact: true }).click();
  const categorySelect = page.getByLabel("Search category");
  await expect(categorySelect.locator('option[value="invoice"]')).toHaveText("Invoice");
  await expect(categorySelect.locator('option[value="stock"]')).toHaveText("Stock");
  await page.getByLabel("Search records").fill("  od02AB1234  ");
  await categorySelect.selectOption("vehicle");
  await expect(categorySelect.locator('option[value="job"]')).toHaveText("Job Card");
  await expect(page.getByLabel("Job status")).toBeHidden();
  await expect(page.getByRole("group", { name: "View mode" }).getByRole("button", { name: "Grid", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByLabel("Sort results")).toBeVisible();
  await expect(page.getByRole("switch", { name: "Show archived only" })).toBeVisible();
  await expect(page.getByText("Showing 1 to 1 of 1")).toBeVisible();
  await expect(page.getByText("OD02AB1234")).toBeVisible();
  await page.getByLabel("Search category").selectOption("customer");
  await expect(page.getByLabel("Job status")).toBeHidden();
  await expect(page.getByLabel("Customer type")).toBeVisible();
  await expect(page.getByText("No matching records")).toBeVisible();
  const searchClear = page.locator(".portal > .list-filter-bar").getByRole("button", { name: "Clear", exact: true });
  await expect(searchClear).toHaveClass(/filter-clear-action/);
  await searchClear.click();
  await expect(page.getByText("Please select a category to activate search")).toBeVisible();
  await page.getByLabel("Search category").selectOption("job");
  await expect(page.getByLabel("Job status")).toBeVisible();
  const monthYear = page.getByLabel("Search month-year");
  await expect(monthYear).toBeVisible();
  const monthValues = await monthYear.locator("option").evaluateAll((options) => options.map((option) => option.getAttribute("value") ?? ""));
  expect(monthValues[0]).toBe("");
  expect(monthValues.slice(1)).toEqual([...monthValues.slice(1)].sort().reverse());
  await page.getByLabel("Job status").selectOption("IN_PROGRESS");
  await expect(page.getByText(/Showing 1 to .* of/)).toBeVisible();
  await page.getByLabel("Search records").fill("inv-08947");
  await page.getByLabel("Search category").selectOption("invoice");
  await expect(page.getByLabel("Job status")).toBeHidden();
  await expect(page.getByText("Showing 1 to 1 of 1")).toBeVisible();
  await expect(page.getByText("INV-08947")).toBeVisible();
});

test("admin Search exposes operational workspaces without restoring hidden rail entries", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  const adminRail = page.locator(".role-nav");
  await expect(adminRail.getByRole("button", { name: "Material Requests", exact: true })).toHaveCount(0);
  await expect(adminRail.getByRole("button", { name: "Issue Material", exact: true })).toHaveCount(0);
  await expect(adminRail.getByRole("button", { name: "Stock", exact: true })).toHaveCount(0);
  await page.locator(".role-nav").getByRole("button", { name: "Search", exact: true }).click();
  const categorySelect = page.getByLabel("Search category");
  for (const [value, label] of [["material-requests", "Material Requests"], ["issue-material", "Issue Material"], ["reconcile", "Reconcile Stock"], ["stock", "Stock"], ["estimate", "Estimate"], ["follow-ups", "Follow-ups"]]) {
    await expect(categorySelect.locator(`option[value="${value}"]`)).toHaveText(label);
  }

  await categorySelect.selectOption("material-requests");
  await expect(page.getByRole("heading", { name: "Material Requests", exact: true })).toBeVisible();
  await categorySelect.selectOption("issue-material");
  await expect(page.getByRole("heading", { name: "Issue Material", exact: true })).toBeVisible();
  await categorySelect.selectOption("reconcile");
  await expect(page.getByRole("heading", { name: "Reconcile", exact: true })).toBeVisible();
  await categorySelect.selectOption("stock");
  await expect(page.getByLabel("Search records")).toBeVisible();
  await expect(page.getByRole("table", { name: "Stock search results" })).toBeVisible();
  await categorySelect.selectOption("estimate");
  await expect(page.getByRole("heading", { name: "Estimates", exact: true })).toBeVisible();
  await expect(page.getByText("All workshop jobs")).toBeVisible();
  await categorySelect.selectOption("follow-ups");
  await expect(page.getByRole("heading", { name: "Follow-ups", exact: true })).toBeVisible();
});

test("non-admin Search keeps its existing category availability", async ({ page }) => {
  await loginAs(page, "service@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Search", exact: true }).click();
  const categorySelect = page.getByLabel("Search category");
  for (const category of ["material-requests", "issue-material", "reconcile", "estimate", "follow-ups"]) {
    await expect(categorySelect.locator(`option[value="${category}"]`)).toHaveCount(0);
  }
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

test("core entity lists switch views and expose deterministic totals", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Load Large Demo Dataset" }).click();
  for (const [name, total] of [["Job Cards", 144], ["Media", 288]] as const) {
    await page.locator(".role-nav").getByRole("button", { name, exact: true }).click();
    await expect(page.getByText(`Showing 1 to 10 of ${total}`)).toBeVisible();
    await page.getByRole("button", { name: "Table", exact: true }).click();
    await expect(page.locator("tbody tr")).toHaveCount(10);
    await page.getByRole("button", { name: "Grid", exact: true }).click();
    await expect(page.locator(".record-card")).toHaveCount(10);
  }
  await page.locator(".role-nav").getByRole("button", { name: "Search", exact: true }).click();
  for (const [category, total] of [["customer", 120], ["vehicle", 132]] as const) {
    await page.getByLabel("Search category").selectOption(category);
    await expect(page.getByText(`Showing 1 to 10 of ${total}`)).toBeVisible();
    await page.getByRole("button", { name: "Table", exact: true }).click();
    await expect(page.locator("tbody tr")).toHaveCount(10);
    await page.getByRole("button", { name: "Grid", exact: true }).click();
    await expect(page.locator(".record-card")).toHaveCount(10);
  }
});

test("media filters use the linked job received date and scope job cards to the advisor", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Load Large Demo Dataset" }).click();
  await page.locator(".role-nav").getByRole("button", { name: "Media", exact: true }).click();

  const monthYear = page.getByLabel("Media month-year");
  const months = await monthYear.locator("option").evaluateAll((options) => options.map((option) => option.getAttribute("value") ?? ""));
  expect(months[0]).toBe("");
  expect(months.slice(1)).toEqual([...months.slice(1)].sort().reverse());

  await page.getByRole("button", { name: "Next page", exact: true }).first().click();
  await expect(page.getByText("Showing 11 to 20 of 288")).toBeVisible();
  await monthYear.selectOption("2026-07");
  await expect(page.getByText("Showing 1 to 10 of 36")).toBeVisible();
  await page.getByLabel("Media received date").fill("2026-08-14");
  await expect(page.getByText("Showing 1 to 2 of 2")).toBeVisible();
  const mediaClear = page.getByRole("button", { name: "Clear", exact: true });
  await expect(mediaClear).toHaveClass(/filter-clear-action/);
  await mediaClear.click();
  await expect(page.getByText("Showing 1 to 10 of 288")).toBeVisible();

  const adminJobIds = await page.getByLabel("Job card filter").locator("option").evaluateAll((options) => options.slice(1).map((option) => option.getAttribute("value")));
  await page.getByRole("button", { name: "Logout" }).click();
  await loginAs(page, "advisor.aa@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Media", exact: true }).click();
  const advisorJobIds = await page.getByLabel("Job card filter").locator("option").evaluateAll((options) => options.slice(1).map((option) => option.getAttribute("value")));
  expect(advisorJobIds).not.toHaveLength(0);
  expect(advisorJobIds.length).toBeLessThan(adminJobIds.length);
  expect(advisorJobIds.every((id) => adminJobIds.includes(id))).toBe(true);
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
  await page.getByRole("button", { name: "Go Back" }).click();
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
  await page.getByRole("button", { name: "Go Back" }).click();
  await expect(viewButton).toBeFocused();

  await page.locator(".record-card").first().getByRole("button", { name: "Edit", exact: true }).click();
  await expect(page.getByRole("dialog", { name: /Edit Job/ })).toBeVisible();
  await expect(page.getByRole("button", { name: "Save Job Card" })).toBeVisible();
  await page.keyboard.press("Escape");

  await page.locator(".role-nav").getByRole("button", { name: "Search", exact: true }).click();
  await page.getByLabel("Search category").selectOption("job");
  await page.locator("main").getByRole("button", { name: "Search", exact: true }).click();
  await page.getByRole("table", { name: "Job Card search results" }).locator("tbody tr").first().getByRole("button", { name: "View" }).click();
  await expect(page.getByRole("dialog", { name: /View Job/ })).toBeVisible();
});

test("Job Cards grid uses direct, permission-aware view, edit and archive actions", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();

  const grid = page.locator(".record-grid.jobs");
  const card = grid.locator(".job-card").first();
  await expect(card.locator(".doc-chip")).toHaveCount(4);
  await expect(card).toHaveClass(/job-status-/);
  expect(await grid.evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length)).toBe(4);

  const quickView = card.getByRole("button", { name: "View", exact: true });
  await expect(quickView).toHaveAttribute("title", /Quick view/);
  await quickView.click();
  await expect(page.getByRole("dialog", { name: /View Job/ })).toBeVisible();
  await page.getByRole("button", { name: "Go Back" }).click();
  await expect(quickView).toBeFocused();

  await expect(card.getByRole("button", { name: "Edit", exact: true })).toHaveAttribute("title", /Edit/);
  await expect(card.getByRole("button", { name: "Archive", exact: true })).toHaveAttribute("title", /Archive/);

  const beforeArchive = await grid.locator(".job-card").count();
  page.once("dialog", (dialog) => dialog.accept());
  await card.getByRole("button", { name: "Archive", exact: true }).click();
  await expect(grid.locator(".job-card")).toHaveCount(beforeArchive - 1);

  await page.setViewportSize({ width: 390, height: 844 });
  await expectNoPageOverflow(page);
});

test("job card document actions stack editors, replace creation actions after save, and download financial PDFs", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  await page.getByRole("tab", { name: "Invoices", exact: true }).click();
  const invoiceManager = page.getByRole("table", { name: "Invoices manager" });
  const openInvoiceRow = invoiceManager.locator("tbody tr:not(.billing-detail-row)").filter({ hasText: "Unpaid" }).first();
  await openInvoiceRow.click();
  await expect(invoiceManager.getByRole("table", { name: "Invoice lines" })).toContainText("%");
  await invoiceManager.getByRole("button", { name: "Void Invoice" }).click();
  await invoiceManager.getByLabel("Void Invoice reason").fill("Recreate from job card E2E");
  await invoiceManager.getByRole("button", { name: "Confirm Void Invoice" }).click();

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
  await expect(estimateDialog).toHaveClass(/dialog-document-editor/);
  await estimateDialog.getByLabel("Notes").fill("Edited from job card");
  await estimateDialog.getByRole("button", { name: "Save Estimate" }).click();
  await expect(jobDialog).toBeVisible();

  const invoiceRow = jobDialog.locator(".document-row").filter({ has: page.getByText("Invoice", { exact: true }) });
  await invoiceRow.getByRole("button", { name: "Create Invoice" }).click();
  const createInvoice = page.getByRole("dialog", { name: "Create Invoice" });
  await expect(createInvoice).toHaveClass(/dialog-document-editor/);
  await expect(page.getByRole("dialog")).toHaveCount(2);
  await expect(createInvoice.getByLabel("Billing job")).toHaveCount(0);
  await expect(createInvoice.getByLabel("Document available")).toHaveCount(0);
  await expect(createInvoice.getByText("Document available", { exact: true })).toHaveCount(0);
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
  await expect(editInvoice).toHaveClass(/dialog-document-editor/);
  await editInvoice.getByLabel("Notes").fill("Edited from job card");
  await editInvoice.getByRole("button", { name: "Save Invoice" }).click();
  await expect(editInvoice).toBeHidden();
  const pdfPromise = page.waitForEvent("download");
  await invoiceRow.first().getByRole("button", { name: "Download PDF" }).click();
  expect((await pdfPromise).suggestedFilename()).toMatch(/-invoice\.pdf$/);
  // the voided invoice stays listed with a frozen copy
  await expect(jobDialog.locator(".document-row").filter({ hasText: "void (frozen copy)" })).toHaveCount(1);

  // Record Payment (mode + reference) creates the Receipt and clears the invoice without closing the job; void reopens it.
  await jobDialog.getByRole("tab", { name: "Payment" }).click();
  const paymentPanel = jobDialog.getByRole("region", { name: "Job payment" });
  await paymentPanel.getByLabel("Payment mode").selectOption("UPI");
  await paymentPanel.getByLabel("Payment reference").fill("E2E-UPI-1");
  await paymentPanel.getByRole("button", { name: "Record Payment" }).click();
  await expect(paymentPanel.getByRole("table", { name: "Payment", exact: true })).toContainText("E2E-UPI-1");
  await expect(paymentPanel.getByRole("table", { name: "Payment", exact: true })).toContainText("RCT-");
  await expect(paymentPanel).toContainText("Cleared");
  await paymentPanel.getByRole("button", { name: "Void Payment" }).click();
  const voidPayment = page.getByRole("dialog", { name: "Void Payment?" });
  await voidPayment.getByLabel("Reason").fill("E2E correction");
  await voidPayment.getByRole("button", { name: "Void" }).click();
  await expect(paymentPanel.getByRole("button", { name: "Record Payment" })).toBeVisible();
});

test("customer and vehicle records use distinct view and edit dialogs on every list surface", async ({ page }) => {
  await loginAs(page, "admin@example.com");

  await page.locator(".role-nav").getByRole("button", { name: "Search", exact: true }).click();
  await page.getByLabel("Search category").selectOption("customer");
  const customerCard = page.locator(".record-card").first();
  await customerCard.getByRole("button", { name: "View", exact: true }).click();
  const customerView = page.getByRole("dialog", { name: "View Customer" });
  await expect(customerView).toBeVisible();
  await expect(customerView.getByRole("button", { name: "Save Customer" })).toHaveCount(0);
  await page.keyboard.press("Escape");
  await customerCard.getByRole("button", { name: "Edit", exact: true }).click();
  await page.getByRole("dialog", { name: "Edit Customer" }).getByRole("button", { name: "Save Customer" }).click();
  await expect(page.getByRole("dialog", { name: "Edit Customer" })).toBeHidden();

  await page.getByLabel("Search category").selectOption("vehicle");
  await page.getByRole("button", { name: "Table", exact: true }).click();
  const vehicleRow = page.locator(".table-wrap tbody tr").first();
  await vehicleRow.getByRole("button", { name: "View", exact: true }).click();
  const vehicleView = page.getByRole("dialog", { name: "View Vehicle" });
  await expect(vehicleView.getByText("Owner", { exact: true })).toBeVisible();
  await expect(vehicleView.getByRole("button", { name: "Save Vehicle" })).toHaveCount(0);
  await page.getByRole("button", { name: "Go Back" }).click();
  await vehicleRow.getByRole("button", { name: "Edit", exact: true }).click();
  await page.getByRole("dialog", { name: "Edit Vehicle" }).getByRole("button", { name: "Save Vehicle" }).click();

  await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  for (const tab of ["Customers", "Vehicles"] as const) {
    await page.getByRole("tab", { name: tab, exact: true }).click();
    const record = page.getByRole("tabpanel").locator(".management-table tbody tr").first();
    await record.getByRole("button", { name: "View", exact: true }).click();
    await expect(page.getByRole("dialog", { name: `View ${tab.slice(0, -1)}` })).toBeVisible();
    await page.getByRole("button", { name: "Go Back" }).click();
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
  await expect(page.locator(".data-flow-line .timeline-event").first()).toBeVisible();
  await expect(page.locator(".data-flow-line .timeline-event.latest")).toHaveCount(1);
  await expect(page.getByRole("region", { name: "Active lifecycle stage" })).toHaveCount(0);
  await expect(page.getByRole("separator", { name: "Not yet" })).toBeVisible();
  await expect(page.locator(".data-flow-line .timeline-event.ghost").first()).toBeVisible();
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

  const dataFlowClear = page.locator(".data-flow-filters").getByRole("button", { name: "Clear", exact: true });
  await expect(dataFlowClear).toHaveClass(/filter-clear-action/);
  await dataFlowClear.click();
  await jobSearch.fill("OD02AB1234");
  await page.getByRole("option", { name: /JC-2026-001245/ }).click();
  const pdfPromise = page.waitForEvent("download");
  const pdfButton = page.locator(".data-flow-line .timeline-event").filter({ hasText: "Estimate created" }).locator("button.document-download");
  await pdfButton.click();
  await expect(pdfButton).toHaveText(/Preparing/);
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
  await expect(page.locator(".data-flow-line .timeline-event").first()).toBeVisible();
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

test("Accounts billing lists include records received outside today and print colored documents", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Load Large Demo Dataset" }).click();

  await page.locator(".logout").click();
  await loginAs(page, "accounts@example.com");

  for (const [tab, total] of [["Invoice", 51], ["Payment", 27], ["Delivery", 27]] as const) {
    await page.locator(".role-nav").getByRole("button", { name: tab, exact: true }).click();
    await expect(page.getByText(`Showing 1 to 10 of ${total}`)).toBeVisible();
  }

  for (const [tab, manager, heading] of [["Invoice", "Invoices", "TAX INVOICE"], ["Payment", "Payments", "PAYMENT RECEIPT"], ["Delivery", "Delivery", "GATE PASS"]] as const) {
    await page.locator(".role-nav").getByRole("button", { name: tab, exact: true }).click();
    const table = page.getByRole("table", { name: `${manager} manager` });
    const popupPromise = page.waitForEvent("popup");
    await table.locator("tbody tr").filter({ has: page.getByRole("button", { name: "Print", exact: true }) }).first().getByRole("button", { name: "Print", exact: true }).click();
    const popup = await popupPromise;
    await popup.waitForLoadState("domcontentloaded");
    await expect(popup.locator("body")).toContainText(heading);
    await expect(popup.locator("header")).toHaveCSS("background-color", "rgb(31, 95, 153)");
    await expect(popup.locator("th").first()).toHaveCSS("background-color", "rgb(31, 95, 153)");
    const printStyles = await popup.locator("style").evaluate((element) => element.textContent ?? "");
    expect(printStyles).toContain("print-color-adjust:exact");
    expect(printStyles).toContain("-webkit-print-color-adjust:exact");
    await popup.close();
  }
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
  await expect(page.getByText(/Showing 1 to .* of/)).toBeVisible();
  await page.getByLabel("Invoices status filter").selectOption("Cleared");
  await expect(page.getByRole("table", { name: "Invoices manager" }).locator("tbody tr").first()).toContainText("Cleared");
  const next = page.getByRole("navigation", { name: "Results pagination" }).first().getByRole("button", { name: "Next page" });
  if (await next.isEnabled()) { await next.click(); await expect(page.getByText(/Page 2 of/).first()).toBeVisible(); }
  await page.getByRole("table", { name: "Invoices manager" }).locator("tbody tr").first().click();
  await expect(page.getByRole("table", { name: "Invoice lines" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Edit" })).toHaveCount(0);

  await page.locator(".logout").click();
  await loginAs(page, "accounts@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Invoice", exact: true }).click();
  await expect(page.locator('[data-billing-manager="Invoices"]')).toBeVisible();
  const invoicesManager = page.locator('[data-billing-manager="Invoices"]');
  const invoicesTable = page.getByRole("table", { name: "Invoices manager" });
  const invoiceMonthFilter = page.getByLabel("Invoices Month-Year filter");
  await expect(invoicesTable.locator("tbody tr.billing-row-invoice-pending, tbody tr.billing-row-invoice-cleared").first()).toBeVisible();
  await expect(invoiceMonthFilter).toBeVisible();
  await expect(invoicesManager.locator('input[type="date"]')).toHaveCount(0);
  await expect(invoicesTable.locator("tbody tr.billing-row-invoice-cleared").first()).toBeVisible();
  const invoiceMonth = await invoiceMonthFilter.locator("option").nth(1).getAttribute("value");
  expect(invoiceMonth).toMatch(/^\d{4}-\d{2}$/);
  await invoiceMonthFilter.selectOption(invoiceMonth!);
  await expect(invoicesTable.locator("tbody tr")).not.toHaveCount(0);
  const invoiceNext = page.getByRole("navigation", { name: "Results pagination" }).first().getByRole("button", { name: "Next page" });
  if (await invoiceNext.isEnabled()) await invoiceNext.click();
  await invoicesManager.getByRole("button", { name: "Clear", exact: true }).click();
  await expect(invoiceMonthFilter).toHaveValue("ALL");
  await page.locator(".role-nav").getByRole("button", { name: "Payment", exact: true }).click();
  await expect(page.locator('[data-billing-manager="Payments"]')).toBeVisible();
  const paymentsTable = page.getByRole("table", { name: "Payments manager" });
  const paymentsManager = page.locator('[data-billing-manager="Payments"]');
  await expect(page.getByLabel("Payments status filter")).toHaveCount(0);
  const paymentModeFilter = page.getByLabel("Payment mode filter");
  const paymentMonthFilter = page.getByLabel("Payments Month-Year filter");
  await expect(paymentModeFilter).toBeVisible();
  await expect(paymentMonthFilter).toBeVisible();
  await expect(paymentsManager.locator('input[type="date"]')).toHaveCount(0);
  await expect(paymentsManager.getByRole("button", { name: "Clear", exact: true })).toBeVisible();
  const firstRow = paymentsTable.locator("tbody tr").first();
  await expect(firstRow).toContainText("Paid");
  await expect(firstRow.getByRole("button", { name: "Receipt", exact: true })).toBeVisible();
  const paidJob = (await firstRow.locator("td").nth(1).textContent())!.trim();
  const paidMode = (await firstRow.locator("td").nth(5).textContent())!.trim();
  const paymentRecordRows = paymentsTable.locator("tbody tr:not(.billing-detail-row)");
  const paymentRecordCount = await paymentRecordRows.count();
  await page.getByLabel("Search payments").fill(paidJob);
  await expect(paymentRecordRows).toHaveCount(1);
  await paymentsManager.getByRole("button", { name: "Clear", exact: true }).click();
  await expect(paymentRecordRows).toHaveCount(paymentRecordCount);
  await paymentModeFilter.selectOption(paidMode);
  await expect(paymentRecordRows).not.toHaveCount(0);
  expect(await paymentRecordRows.locator("td:nth-child(6)").allTextContents()).toEqual(expect.arrayContaining([paidMode]));
  expect((await paymentRecordRows.locator("td:nth-child(6)").allTextContents()).every((mode) => mode.trim() === paidMode)).toBe(true);
  await paymentsManager.getByRole("button", { name: "Clear", exact: true }).click();
  await expect(paymentModeFilter).toHaveValue("ALL");
  for (const [mode, highlightClass] of [["UPI", "billing-row-payment-upi"], ["Cash", "billing-row-payment-cash"], ["Card", "billing-row-payment-card"], ["Bank transfer", "billing-row-payment-bank-transfer"], ["Other", "billing-row-payment-other"]] as const) {
    await paymentModeFilter.selectOption(mode);
    await expect(paymentRecordRows.first()).toHaveClass(new RegExp(highlightClass));
  }
  await paymentsManager.getByRole("button", { name: "Clear", exact: true }).click();
  await page.locator(".role-nav").getByRole("button", { name: "Delivery", exact: true }).click();
  const deliveryManager = page.locator('[data-billing-manager="Delivery"]');
  const deliveryTable = page.getByRole("table", { name: "Delivery manager" });
  const deliveryMonthFilter = page.getByLabel("Delivery Month-Year filter");
  await expect(page.getByLabel("Delivery status filter")).toHaveCount(0);
  await expect(deliveryMonthFilter).toBeVisible();
  await expect(deliveryManager.locator('input[type="date"]')).toHaveCount(0);
  await expect(deliveryManager.getByRole("button", { name: "Clear", exact: true })).toBeVisible();
  const deliveryRows = deliveryTable.locator("tbody tr");
  const deliveryRecordCount = await deliveryRows.count();
  const deliveryRow = deliveryRows.filter({ has: page.getByRole("button", { name: "Delivered", exact: true }) }).first();
  await expect(deliveryRow).toContainText("GP-");
  await expect(deliveryRow).toContainText("Pending");
  const deliveryJob = (await deliveryRow.locator("td").first().textContent())!.trim();
  await page.getByLabel("Search delivery").fill(deliveryJob);
  await expect(deliveryRows).toHaveCount(1);
  await deliveryManager.getByRole("button", { name: "Clear", exact: true }).click();
  await expect(deliveryRows).toHaveCount(deliveryRecordCount);
  const deliveryMonth = await deliveryMonthFilter.locator("option").nth(1).getAttribute("value");
  await deliveryMonthFilter.selectOption(deliveryMonth!);
  await expect(deliveryRows).not.toHaveCount(0);
  await deliveryManager.getByRole("button", { name: "Clear", exact: true }).click();
  await expect(deliveryMonthFilter).toHaveValue("ALL");
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
  await expect(correctedTimeline.locator(".timeline-event.voided").first()).toBeVisible();
});

test("Manage Job Cards uses view and edit dialogs with documents and confirmed archive", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  await page.getByRole("tab", { name: "Job Cards", exact: true }).click();

  await page.getByRole("button", { name: "Create Job Card", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Create Job Card" })).toBeVisible();
  await page.getByRole("button", { name: "Go Back" }).click();
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
  await page.locator(".document-row").filter({ has: page.getByText("Estimate", { exact: true }) }).getByRole("button", { name: "Download PDF" }).click();
  expect((await pdfPromise).suggestedFilename()).toMatch(/-estimate\.pdf$/);
  await page.getByRole("button", { name: "Go Back" }).click();

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
  await page.locator(".role-nav").getByRole("button", { name: "Search", exact: true }).click();
  await page.getByLabel("Search category").selectOption("customer");
  await page.getByRole("button", { name: "Table", exact: true }).click();
  const add = page.getByRole("button", { name: "Add Customer", exact: true });
  await expect(add).toBeVisible();
  await add.click();
  await expect(page.getByLabel("Customer name")).toBeVisible();
});

test("store stock and material requests combine search with domain filters", async ({ page }) => {
  await loginAs(page, "store@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Stock", exact: true }).click();
  await page.getByLabel("Stock category").selectOption("PPF");
  await expect(page.getByText("Showing 1 to 10 of 127")).toBeVisible();
  await page.locator("main").getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByText("Showing 1 to 10 of 61")).toBeVisible();
  await page.getByLabel("Stock status").selectOption("LOW");
  await expect(page.getByRole("table", { name: "Stock results" }).locator("tbody tr")).toHaveCount(10);
  await page.locator("main").getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByText("No matching records")).toBeVisible();
  await page.getByLabel("Stock category").selectOption("Paint");
  await page.locator("main").getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByText(/Showing 1 to \d+ of \d+/)).toBeVisible();
  await page.getByLabel("Stock status").selectOption("ALL");
  await page.getByLabel("Stock category").selectOption("PPF");
  await page.getByLabel("Search stock").fill("70%VLT Nano Ceramic");
  await page.locator("main").getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByRole("table", { name: "Stock results" }).locator("tbody tr")).toHaveCount(1);
  await expect(page.getByText("70%VLT Nano Ceramic Film (UG)")).toBeVisible();
  await page.getByLabel("Search stock").fill("no-such-stock-item");
  await expect(page.getByText("No matching records")).toHaveCount(0);
  await page.locator("main").getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByText("No matching records")).toBeVisible();
  const emptyStateClear = page.locator(".list-empty").getByRole("button", { name: "Clear filters" });
  await expect(emptyStateClear).toHaveClass(/filter-clear-action/);
  await emptyStateClear.click();
  await expect(page.getByText("Showing 1 to 10 of 127")).toBeVisible();

  await page.locator(".role-nav").getByRole("button", { name: "Material Requests", exact: true }).click();
  await page.getByLabel("Status").selectOption("Pending");
  await expect(page.getByRole("table", { name: "Material Requests results" }).locator("tbody tr")).toHaveCount(1);
  await page.getByLabel("Item").fill("nano");
  await page.getByRole("option", { name: /70%VLT Nano Ceramic Film/ }).click();
  await expect(page.getByRole("table", { name: "Material Requests results" }).getByRole("cell", { name: "JC-2026-001246" })).toBeVisible();
});

test("stock filter toolbars use no more than two rows above mobile", async ({ page }) => {
  await loginAs(page, "store@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Stock", exact: true }).click();

  for (const viewport of [{ width: 1440, height: 900 }, { width: 900, height: 900 }]) {
    await page.setViewportSize(viewport);
    for (const tab of ["Inventory List", "Low Stock", "Stock Movements"]) {
      await page.getByRole("tab", { name: tab, exact: true }).click();
      await expectStockToolbarHasAtMostTwoRows(page);
    }
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("tab", { name: "Inventory List", exact: true }).click();
  await expectNoPageOverflow(page);
  await page.getByRole("tab", { name: "Low Stock", exact: true }).click();
  await expectNoPageOverflow(page);
  await page.getByRole("tab", { name: "Stock Movements", exact: true }).click();
  await expectNoPageOverflow(page);
});

test("stock list combines stock and unit, and quick add records inward in a dialog", async ({ page }) => {
  await loginAs(page, "store@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Stock", exact: true }).click();
  const stockTable = page.getByRole("table", { name: "Stock results" });
  await expect(stockTable.getByRole("columnheader", { name: "Unit", exact: true })).toHaveCount(0);
  await expect(stockTable.locator("tbody tr").first().locator("td").nth(3)).toHaveText(/\S+\s+\S+/);
  await expect(page.locator(".stock-main-grid")).toHaveCount(0);

  const stockList = page.locator(".store-list-page");
  const quickAddButton = stockList.getByRole("button", { name: "Quick Add Stock", exact: true });
  await expect(quickAddButton).toHaveCount(1);
  await expect(page.locator(".stock-overview").getByRole("button", { name: "Quick Add Stock", exact: true })).toHaveCount(0);
  await quickAddButton.click();
  const quickAdd = page.getByRole("dialog", { name: "Quick Add Stock" });
  await expect(quickAdd).toBeVisible();

  await quickAdd.getByLabel("Existing SKU").click();
  await quickAdd.getByRole("option").first().click();
  await quickAdd.getByLabel("Inward quantity").fill("2");
  await quickAdd.getByRole("button", { name: "Record Inward" }).click();
  await expect(quickAdd).toHaveCount(0);
  await page.getByRole("tab", { name: "Stock Movements" }).click();
  await page.getByLabel("Search stock movements").fill("Quick inward");
  const movements = page.getByRole("table", { name: "Stock movement results" });
  await expect(movements).toContainText("STOCK_IN");
  const movementDate = await movements.locator("tbody tr").first().locator("td").first().textContent();
  expect(movementDate).toMatch(/^\d{4}-\d{2}-\d{2}/);
  const exactDate = movementDate!.slice(0, 10);
  const movementMonth = exactDate.slice(0, 7);
  const monthFilter = page.getByLabel("Stock movement month");
  await expect(monthFilter.locator('option[value=""]').first()).toHaveText("All months");
  await monthFilter.selectOption(movementMonth);
  await page.getByLabel("Stock movement direction").selectOption("STOCK_IN");
  await page.getByLabel("Stock movement date").fill(exactDate);
  await expect(movements.locator("tbody tr")).not.toHaveCount(0);
  await page.getByRole("button", { name: "Clear", exact: true }).click();
  await expect(page.getByLabel("Search stock movements")).toHaveValue("");
  await expect(page.getByLabel("Stock movement date")).toHaveValue("");
  await expect(monthFilter).toHaveValue("");
  await expect(page.getByLabel("Stock movement direction")).toHaveValue("ALL");

  await page.getByRole("tab", { name: "Inventory List" }).click();
  await quickAddButton.click();
  const newSkuDialog = page.getByRole("dialog", { name: "Quick Add Stock" });
  await newSkuDialog.getByRole("button", { name: "Add new SKU" }).click();
  await newSkuDialog.getByLabel("New SKU", { exact: true }).fill("QUICK-E2E");
  await newSkuDialog.getByLabel("New material name").fill("Quick add film");
  await newSkuDialog.getByLabel("New SKU category").fill("E2E");
  await newSkuDialog.getByLabel("New SKU unit").fill("piece");
  await newSkuDialog.getByLabel("New SKU low-stock threshold").fill("2");
  await newSkuDialog.getByLabel("New SKU selling price").fill("325");
  await newSkuDialog.getByLabel("Initial inward quantity").fill("4");
  await newSkuDialog.getByRole("button", { name: "Create SKU & Record Inward" }).click();
  await expect(newSkuDialog).toHaveCount(0);
  await page.getByLabel("Search stock").fill("QUICK-E2E");
  const stockRow = stockTable.locator("tbody tr").filter({ hasText: "QUICK-E2E" });
  await expect(stockRow).toContainText("Quick add film");
  await expect(stockRow.locator("td").nth(3)).toHaveText("4 piece");
  await stockRow.getByRole("button", { name: "Edit" }).click();
  const dialog = page.getByRole("dialog", { name: "Edit stock details" });
  await dialog.getByLabel("Edit selling price").fill("400");
  await dialog.getByRole("button", { name: "Save changes" }).click();
  await stockRow.getByRole("button", { name: "Edit" }).click();
  await expect(page.getByRole("dialog", { name: "Edit stock details" }).getByLabel("Edit selling price")).toHaveValue("400");

  await page.setViewportSize({ width: 390, height: 844 });
  await expectNoPageOverflow(page);
  const footer = page.getByRole("dialog", { name: "Edit stock details" }).locator(".dialog-footer");
  const box = await footer.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x + box!.width).toBeLessThanOrEqual(390);
});

test("issue and reconcile lists filter by item and reconciliation state", async ({ page }) => {
  await loginAs(page, "store@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Issue Material", exact: true }).click();
  await page.getByLabel("Item").fill("nano");
  await page.getByRole("option", { name: /70%VLT Nano Ceramic Film/ }).click();
  await expect(page.getByRole("table", { name: "Issue Material results" }).locator("tbody tr")).toHaveCount(1);

  await page.locator(".role-nav").getByRole("button", { name: "Reconcile", exact: true }).click();
  await page.getByLabel("Reconciliation state").selectOption("Matched");
  await expect(page.getByRole("table", { name: "Reconcile results" }).locator("tbody tr")).toHaveCount(2);
  await page.getByLabel("Reconciliation state").selectOption("Open");
  await expect(page.getByRole("table", { name: "Reconcile results" }).locator("tbody tr")).toHaveCount(1);
});

test("material record queues use compact rows and issue actions do not open their row", async ({ page }) => {
  await loginAs(page, "store@example.com");

  for (const pageName of ["Material Requests", "Issue Material"] as const) {
    await page.locator(".role-nav").getByRole("button", { name: pageName, exact: true }).click();
    const table = page.getByRole("table", { name: `${pageName} results` });
    await expect(table).toHaveClass(/store-material-record-table/);
    await expect(table.locator("tbody tr").first().locator("td").first()).toHaveCSS("padding-top", "7px");
    await expect(table.locator(".store-material-status").first()).toHaveCSS("min-height", "24px");
  }

  const issueTable = page.getByRole("table", { name: "Issue Material results" });
  const issueAction = issueTable.getByRole("button", { name: "Issue Material", exact: true }).first();
  const approvalAction = issueTable.getByRole("button", { name: "Needs Approval", exact: true }).first();
  await expect(issueAction).toHaveClass(/action-primary/);
  await expect(approvalAction).toHaveClass(/action-secondary/);
  await expect(issueAction).toHaveCSS("min-height", "30px");
  await expect(approvalAction).toHaveCSS("min-height", "30px");

  await approvalAction.click();
  await expect(page.getByRole("heading", { name: "Job Card", exact: true })).toHaveCount(0);
});

test("store reconciliation states use status pills and shared table actions", async ({ page }) => {
  await loginAs(page, "store@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Reconcile", exact: true }).click();

  const results = page.getByRole("table", { name: "Reconcile results" });
  await expect(results.locator(".store-material-status-matched")).toHaveCount(2);
  await expect(results.getByRole("button", { name: "Edit Reconciliation" }).first()).toHaveClass(/store-material-action/);
});

test("reconciliation opens per row, requires zero-return acknowledgement, and preserves row navigation", async ({ page }) => {
  await loginAs(page, "store@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Reconcile", exact: true }).click();

  const results = page.getByRole("table", { name: "Reconcile results" });
  const action = results.getByRole("button", { name: "Reconcile", exact: true }).first();
  await action.click();
  const dialog = page.getByRole("dialog", { name: "Reconcile Material" });
  await expect(dialog).toBeVisible();
  await expect(page.getByLabel("Used quantity")).toBeFocused();
  await page.getByLabel("Used quantity").fill("1");
  await page.getByLabel("Returned quantity").fill("0");
  await page.getByLabel("Wasted quantity").fill("0");
  await expect(dialog.getByRole("button", { name: "Save Reconciliation" })).toBeDisabled();
  await page.getByLabel("Confirm no return or wastage").check();
  await expect(dialog.getByRole("button", { name: "Save Reconciliation" })).toBeEnabled();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(action).toBeFocused();

  await action.click();
  await page.getByLabel("Used quantity").fill("1");
  await page.getByLabel("Returned quantity").fill("0");
  await page.getByLabel("Wasted quantity").fill("0");
  await page.getByLabel("Confirm no return or wastage").check();
  await page.getByRole("dialog", { name: "Reconcile Material" }).getByRole("button", { name: "Save Reconciliation" }).click();
  await expect(page.getByRole("dialog", { name: "Reconcile Material" })).toBeHidden();
  await expect(results.locator(".store-material-status-open")).toHaveCount(1);

  await results.getByRole("button", { name: "Edit Reconciliation" }).first().click();
  await page.getByLabel("Used quantity").fill("0");
  await page.getByLabel("Returned quantity").fill("0");
  await page.getByLabel("Wasted quantity").fill("0");
  await page.getByLabel("Confirm no return or wastage").check();
  await page.getByRole("dialog", { name: "Reconcile Material" }).getByRole("button", { name: "Save Reconciliation" }).click();
  await expect(results.locator(".store-material-status-open")).toHaveCount(2);
});

test("store material queues default to today and keep record filters, exports and workflows in sync", async ({ page }) => {
  await loginAs(page, "store@example.com");
  const today = await page.evaluate(() => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60_000;
    return new Date(now.getTime() - offset).toISOString().slice(0, 10);
  });

  for (const pageName of ["Material Requests", "Issue Material"] as const) {
    await page.locator(".role-nav").getByRole("button", { name: pageName, exact: true }).click();
    const date = page.getByLabel(`${pageName} record date`);
    const month = page.getByLabel(`${pageName} record month`);
    const disclosure = page.locator(".workspace:visible .workflow-disclosure");
    await expect(date).toHaveValue(today);
    if (await disclosure.getAttribute("open") === null) await disclosure.locator("summary").getByText(pageName === "Material Requests" ? "Purchase, Stock & Issue" : "Issue workflow", { exact: true }).click();
    await expect(disclosure).toHaveAttribute("open", "");

    const availableMonth = month.locator("option").nth(1);
    if (await availableMonth.count()) {
      await month.selectOption(await availableMonth.getAttribute("value") ?? "");
      await expect(date).toHaveValue("");
      await date.fill(today);
      await expect(month).toHaveValue("");
    }

    // Remove the time scope only while proving the searchable selector against
    // the full fixture set.
    await date.fill("");

    await page.getByLabel("Item").fill("nano");
    await page.getByRole("option", { name: /70%VLT Nano Ceramic Film/ }).click();

    await page.getByRole("button", { name: "Clear", exact: true }).click();
    await expect(date).toHaveValue("");
    await expect(month).toHaveValue("");
    await expect(page.getByLabel("Status")).toHaveValue("ALL");
    await expect(page.getByLabel("Item")).toHaveValue("All items");
    const toolbarControls = page.locator(".material-record-filter-grid > label, .material-record-filter-grid > .list-search-actions");
    await expect(toolbarControls).toHaveCount(5);
    await expect(toolbarControls).toHaveText([/^Date/, /^Month-Year/, /^Status/, /^Item/, /^Clear$/]);

    await page.getByRole("button", { name: "Download", exact: true }).click();
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("menuitem", { name: "Excel" }).click();
    const worksheet = await readWorksheet(await downloadPromise);
    expect(String(worksheet[2]?.[1])).not.toContain("Record date:");

    for (const viewport of [{ width: 1440, height: 900 }, { width: 900, height: 900 }]) {
      await page.setViewportSize(viewport);
      await expectMaterialRecordToolbarHasOneRow(page);
      await expectNoPageOverflow(page);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await expectNoPageOverflow(page);
  }
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
  expect(ppfRows.slice(5)).toHaveLength(61);
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
  await page.getByLabel("Status").selectOption("Pending");
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
  const created = page.locator(".management-table tbody tr").filter({ hasText: "persistent@example.com" });
  await created.getByRole("button", { name: "Edit" }).click();
  await page.getByLabel("User name").fill("Updated User");
  await page.getByRole("button", { name: "Save User" }).click();
  await expect(page.getByText("Updated User")).toBeVisible();
  await created.getByRole("button", { name: "Archive" }).click();
  await expect(page.getByText("persistent@example.com")).toHaveCount(0);
  const self = page.locator(".management-table tbody tr").filter({ hasText: "admin@example.com" });
  await expect(self.getByRole("button", { name: "Archive" })).toBeDisabled();
});

test("company settings validate, preview, reset and persist report assets", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Admin Console", exact: true }).click();
  await page.getByRole("tab", { name: "Company Settings", exact: true }).click();
  await page.getByLabel("Company name").fill("E2E Auto Studio");
  await page.getByLabel("Terms / footer").fill("E2E footer terms");
  await page.getByLabel("Address").fill("9 Test Road");

  const logo = page.locator(".company-image-field").filter({ hasText: "Company logo" });
  const fileInput = logo.locator('input[type="file"]');
  await fileInput.setInputFiles({ name: "logo.png", mimeType: "image/png", buffer: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", "base64") });
  const preview = logo.getByRole("img", { name: "Company logo preview" });
  await expect(preview).toHaveAttribute("src", /^data:image\/png;base64,/);
  const validSrc = await preview.getAttribute("src");
  await fileInput.setInputFiles({ name: "bad.txt", mimeType: "text/plain", buffer: Buffer.from("not an image") });
  await expect(page.getByRole("alert")).toContainText("must be a PNG or JPEG");
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
  await page.getByRole("tab", { name: "Company Settings", exact: true }).click();
  await expect(page.getByLabel("Company name")).toHaveValue("E2E Auto Studio");
  await expect(page.getByLabel("Terms / footer")).toHaveValue("E2E footer terms");
  await expect(page.getByLabel("Address")).toHaveValue("9 Test Road");
  await expect(page.getByRole("img", { name: "Company logo preview" })).toBeVisible();
});

test("App Theme previews, saves live UI tokens, and restores the default", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Admin Console", exact: true }).click();
  await page.getByRole("tab", { name: "App Theme", exact: true }).click();
  const font = page.getByRole("combobox", { name: "Application font" });
  await font.fill("Georgia");
  await page.getByRole("option", { name: "Georgia", exact: true }).click();
  await page.getByRole("button", { name: "Go Blue", exact: true }).click();
  await expect(page.getByLabel("App theme preview")).toHaveCSS("font-family", /Georgia/);
  await page.getByRole("button", { name: "Save App Theme", exact: true }).click();
  await expect(page.getByText("App theme saved for this session.")).toBeVisible();
  await page.locator(".role-nav").getByRole("button", { name: "Stock", exact: true }).click();
  await expect(page.locator(".rail")).toHaveCSS("background-color", "rgb(220, 236, 255)");
  await expect(page.locator(".role-nav button.active")).toHaveCSS("background-color", "rgb(200, 225, 255)");
  await expect(page.locator("table th").first()).toHaveCSS("background-color", "rgb(212, 232, 251)");
  await expect(page.locator(".app-shell")).toHaveCSS("font-family", /Georgia/);

  await page.locator(".role-nav").getByRole("button", { name: "Admin Console", exact: true }).click();
  await page.getByRole("tab", { name: "App Theme", exact: true }).click();
  await page.getByRole("button", { name: "Set to Default", exact: true }).click();
  await page.getByRole("button", { name: "Save App Theme", exact: true }).click();
  await expect(page.locator(".rail")).toHaveCSS("background-color", "rgb(225, 241, 235)");
  await expect(page.locator(".app-shell")).toHaveCSS("font-family", /Inter/);
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

  for (const category of ["estimate", "invoice", "gate-pass", "job-card", "payment-receipt"]) {
    await page.getByLabel("Report category").selectOption(category);
    await expect(page.locator(".template-preview")).toBeVisible();
    await expect(page.getByLabel("Report template").locator("option:checked")).toContainText("(Active)");
  }

  await page.getByLabel("Report category").selectOption("invoice");
  await page.getByRole("button", { name: "New Template" }).click();
  await page.getByLabel("Template name").fill("Compact Invoice");
  await page.getByLabel("Template HTML").fill('<section onclick="alert(1)"><script>window.bad=1</script><img src="https://bad.example/logo.png"><h1>{{report.number}}</h1><p>{{customer.name}}</p></section>');
  await page.getByText("Active template", { exact: true }).getByRole("checkbox").check();

  page.once("dialog", (dialog) => dialog.dismiss());
  await page.getByLabel("Report category").selectOption("gate-pass");
  await expect(page.getByLabel("Report category")).toHaveValue("invoice");

  const preview = page.frameLocator(".template-preview");
  await expect(preview.getByRole("heading", { name: "INV-2026-0042" })).toBeVisible();
  await expect(preview.locator("script")).toHaveCount(0);
  await expect(preview.locator("img")).not.toHaveAttribute("src");
  await expect(preview.locator("section")).not.toHaveAttribute("onclick");

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
  await expect(page.locator(".record-card").first().locator(".doc-chip")).toHaveCount(4);
  await page.locator(".record-card").first().getByRole("button", { name: "View", exact: true }).click();
  await page.getByRole("tab", { name: "Documents" }).click();

  for (const label of ["Job Card", "Payment Receipt", "Gate Pass", "Estimate", "Invoice"]) {
    const row = page.locator(".document-row").filter({ has: page.getByText(label, { exact: true }) }).first();
    const downloadPromise = page.waitForEvent("download");
    await row.getByRole("button", { name: "Download PDF" }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(new RegExp(`-${label.toLowerCase().replace(" ", "-")}\.pdf$`));
    await expect(row.getByRole("button", { name: "Downloaded ✓" })).toBeVisible();
  }

  const printRow = page.locator(".document-row").filter({ has: page.getByText("Payment Receipt", { exact: true }) }).first();
  const popupPromise = page.waitForEvent("popup");
  await printRow.getByRole("button", { name: "Print", exact: true }).click();
  const popup = await popupPromise;
  await popup.waitForLoadState("domcontentloaded");
  await expect(popup.locator('meta[http-equiv="Content-Security-Policy"]')).toHaveAttribute("content", /default-src 'none'/);
  await expect(popup.locator("body")).toContainText("PAYMENT RECEIPT");
  await popup.close();
  await page.evaluate(() => Object.defineProperty(window, "open", { configurable: true, value: () => null }));
  await page.locator(".document-row").filter({ has: page.getByText("Job Card", { exact: true }) }).getByRole("button", { name: "Print", exact: true }).click();
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
  await expect(editor.getByRole("tab")).toHaveText(["Details", "Body Mark", "Materials", "Documents", "Photos / Media", "Invoice", "Payment"]);
  await expect(editor.getByRole("group", { name: "Downloads" })).toBeVisible();
  await editor.getByRole("tab", { name: "Materials" }).click();
  await expect(editor.getByRole("region", { name: "Job materials" })).toBeVisible();
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
  await confirmation.getByRole("button", { name: "Go Back", exact: true }).click();
  await expect(confirmation).toBeHidden();
});

test("lifecycle surfaces provide keyboard tabs, stacked dialogs, accessible names and mobile containment", async ({ page }) => {
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 390, height: 844 });
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  await page.getByLabel("Search job cards").fill("JC-2026-001247");
  await page.getByLabel("Search job cards").press("Enter");
  const editCard = page.locator(".record-card").filter({ hasText: "JC-2026-001247" });
  const editTrigger = editCard.getByRole("button", { name: "Edit", exact: true });
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
  await expect(confirmation.getByRole("button", { name: "Go Back" })).toBeFocused();
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
  await expect(estimate).toHaveClass(/dialog-document-editor/);
  await expect(estimate.getByLabel("Discount")).toBeVisible();
  await expect(estimate.getByLabel("Item 1 GST type")).toHaveValue("CGST+SGST");
  await expect(estimate.getByLabel("Item 1 GST rate")).toHaveValue("18%");
  await expectNoPageOverflow(page);
  await page.keyboard.press("Escape");
  await expect(estimateTrigger).toBeFocused();

  await page.locator(".role-nav").getByRole("button", { name: "Data Flow", exact: true }).click();
  const combobox = page.getByRole("combobox", { name: "Find a job" });
  await combobox.focus();
  await page.keyboard.press("ArrowDown");
  await expect(combobox).toHaveAttribute("aria-activedescendant", /data-flow-job-/);
  await page.keyboard.press("Enter");
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
  await dialog.getByRole("button", { name: "Go Back", exact: true }).click();
  await page.getByRole("button", { name: "Edit Estimate" }).click();
  dialog = page.getByRole("dialog", { name: "Edit Estimate" });
  await expect(dialog.getByLabel("Item 1 description")).toHaveValue(savedDescription);
  await dialog.getByRole("button", { name: "Add Item" }).click();
  await dialog.getByLabel("Item 2 kind").selectOption("Material");
  await dialog.getByLabel("Item 2 description").fill("E2E polish");
  await dialog.getByLabel("Item 2 quantity").fill("2");
  await dialog.getByLabel("Item 2 rate").fill("250");
  await dialog.getByLabel("Item 2 GST type").selectOption("IGST");
  await dialog.getByLabel("Item 2 GST rate").click();
  await dialog.getByRole("option", { name: "12%" }).click();
  await dialog.getByLabel("Discount").fill("50");
  await dialog.getByLabel("Notes").fill("E2E estimate note");
  await dialog.getByRole("button", { name: "Save Estimate" }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByText("E2E polish")).toBeVisible();
  await expect(page.getByText("E2E estimate note")).toBeVisible();
});

test("service advisor Job Card shows assigned active jobs without preset delivery filters", async ({ page }) => {
  await loginAs(page, "service@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "My Queue", exact: true }).click();
  const queue = page.locator(".embedded-list");
  await expect(queue).toContainText("JC-2026-001247");
  await expect(queue).not.toContainText("JC-2026-001245");
  await expect(queue).not.toContainText("JC-2026-001246");
  await expect(queue.locator(".row-list").getByText("CLOSED", { exact: true })).toHaveCount(0);
  await expect(queue.locator(".row-list").getByText("CANCELLED", { exact: true })).toHaveCount(0);

  await page.locator(".role-nav").getByRole("button", { name: "Job Card", exact: true }).click();
  const jobCards = page.locator(".service-advisor-list");
  await expect(jobCards.getByRole("heading", { name: "Job Cards", exact: true })).toBeVisible();
  await expect(jobCards.getByLabel("Job cards estimated delivery date")).toHaveValue("");
  await expect(jobCards.getByLabel("Job cards month-year")).toHaveValue("");
  await expect(jobCards).toContainText("JC-2026-001247");
  await expect(jobCards).not.toContainText("JC-2026-001245");
  await expect(jobCards).not.toContainText("JC-2026-001246");
  await expect(jobCards.locator("tbody").getByText("CLOSED", { exact: true })).toHaveCount(0);
  await expect(jobCards.locator("tbody").getByText("CANCELLED", { exact: true })).toHaveCount(0);
  await expect(jobCards.locator("tbody tr")).toHaveCount(1);
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
  await job.getByRole("button", { name: "Go Back" }).click();
  await page.locator(".logout").click();

  await loginAs(page, "reception@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Search", exact: true }).click();
  await page.getByLabel("Search category").selectOption("job");
  await page.locator("main").getByRole("button", { name: "Search", exact: true }).click();
  const results = page.getByRole("table", { name: "Job Card search results" });
  await expect(results.getByRole("button", { name: "View" }).first()).toBeVisible();
  await expect(results.getByRole("button", { name: "Edit", exact: true })).toHaveCount(0);
  await results.getByRole("button", { name: "View" }).first().click();
  job = page.getByRole("dialog", { name: /View Job/ });
  await job.getByRole("tab", { name: "Photos / Media" }).click();
  await expect(job.getByText(/Read only.*Owner.*linked Service Advisor/)).toBeVisible();
  await expect(job.getByLabel("Image file")).toHaveCount(0);
});

async function loginAs(page: import("@playwright/test").Page, email: string) {
  await page.getByLabel("Emulate User:").selectOption(email);
  await page.getByRole("button", { name: "Login" }).click();
}

test("Store creates a purchase order and reconciles its receipt through Stock Inward", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  await page.getByRole("tab", { name: "Suppliers", exact: true }).click();
  await page.getByRole("button", { name: "Add new supplier", exact: true }).click();
  await page.getByLabel("Name", { exact: true }).fill("E2E Receiving Supplier");
  await page.getByRole("button", { name: "Save supplier" }).click();
  await page.getByRole("button", { name: "Logout" }).click();
  await loginAs(page, "store@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Purchase Orders", exact: true }).click();
  await page.getByRole("button", { name: "New purchase order" }).click();
  await page.getByLabel("PO supplier").selectOption({ index: 1 });
  await page.getByLabel("PO number").fill("E2E-PO-001");
  const picker = page.getByRole("combobox", { name: "PO line 1 item", exact: true });
  await picker.fill("oil");
  await picker.press("ArrowDown");
  await picker.press("Enter");
  await picker.press("Escape");
  await page.getByLabel("PO line 1 quantity").fill("2");
  await page.getByRole("button", { name: "Create draft" }).click();
  await page.getByRole("button", { name: "Send saved PO" }).click();
  await expect(page.getByText("Shortages and excesses are flags only")).toBeVisible();
  await page.locator(".role-nav").getByRole("button", { name: "Stock", exact: true }).click();
  await page.getByRole("button", { name: "Quick Add Stock", exact: true }).click();
  const inward = page.getByRole("dialog", { name: "Quick Add Stock" });
  await inward.getByLabel("Existing SKU").click();
  await inward.getByRole("option").filter({ hasText: "oil" }).first().click();
  await inward.getByLabel("Inward quantity").fill("2");
  await inward.getByLabel("Purchase order").selectOption({ label: "E2E-PO-001" });
  await inward.getByLabel("Purchase order line").selectOption({ label: /E2E-PO-001/ });
  await inward.getByRole("button", { name: "Record Inward" }).click();
  await page.locator(".role-nav").getByRole("button", { name: "Purchase Orders", exact: true }).click();
  await expect(page.getByRole("table", { name: "Purchase order register" })).toContainText("Ready to Close");
});

async function expectNoPageOverflow(page: import("@playwright/test").Page) {
  const dimensions = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
  expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport + 1);
  expect(dimensions.body).toBeLessThanOrEqual(dimensions.viewport + 1);
}

async function expectStockToolbarHasAtMostTwoRows(page: import("@playwright/test").Page) {
  const rows = await page.locator(".stock-filter-grid > label, .stock-filter-grid > .list-search-actions").evaluateAll((controls) => {
    const positions = controls.map((control) => Math.round(control.getBoundingClientRect().bottom));
    return [...new Set(positions)].sort((left, right) => left - right);
  });
  expect(rows.length).toBeLessThanOrEqual(2);
}

async function expectMaterialRecordToolbarHasOneRow(page: import("@playwright/test").Page) {
  const rows = await page.locator(".material-record-filter-grid > label, .material-record-filter-grid > .list-search-actions").evaluateAll((controls) => {
    const positions = controls.map((control) => Math.round(control.getBoundingClientRect().bottom));
    return [...new Set(positions)].sort((left, right) => left - right);
  });
  expect(rows.length).toBe(1);
}

async function expectJobCardToolbarHasOneRow(page: import("@playwright/test").Page) {
  const rows = await page.locator(".job-card-filter-grid > label, .job-card-filter-grid > .list-search-actions").evaluateAll((controls) => {
    const positions = controls.map((control) => Math.round(control.getBoundingClientRect().bottom));
    return [...new Set(positions)].sort((left, right) => left - right);
  });
  expect(rows).toHaveLength(1);
}

async function expectManagementToolbarHasOneRow(scope: import("@playwright/test").Locator, selector: string) {
  const rows = await scope.locator(`${selector} > label, ${selector} > .list-search-actions, ${selector} > .filter-clear-action`).evaluateAll((controls) => {
    const positions = controls.map((control) => Math.round(control.getBoundingClientRect().bottom));
    return [...new Set(positions)].sort((left, right) => left - right);
  });
  expect(rows).toHaveLength(1);
}

async function expectManagementToolbarStacks(scope: import("@playwright/test").Locator, selector: string) {
  const rows = await scope.locator(`${selector} > label, ${selector} > .list-search-actions, ${selector} > .filter-clear-action`).evaluateAll((controls) => new Set(controls.map((control) => Math.round(control.getBoundingClientRect().bottom))).size);
  expect(rows).toBeGreaterThan(1);
}

async function readWorksheet(download: import("@playwright/test").Download) {
  const filePath = await download.path();
  if (!filePath) throw new Error("Downloaded workbook was not saved");
  const workbook = XLSX.readFile(filePath);
  return XLSX.utils.sheet_to_json<(string | number)[]>(workbook.Sheets.Report, { header: 1, defval: "" });
}

async function pngPixels(page: import("@playwright/test").Page, download: import("@playwright/test").Download) {
  const filePath = await download.path();
  if (!filePath) throw new Error("Downloaded image was not saved");
  const png = readFileSync(filePath).toString("base64");
  return page.evaluate(async (encoded) => {
    const image = new Image();
    await new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = () => reject(new Error("PNG could not be decoded")); image.src = `data:image/png;base64,${encoded}`; });
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas is not available");
    context.drawImage(image, 0, 0);
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let nonWhite = 0;
    let markerRed = 0;
    for (let index = 0; index < pixels.length; index += 4) {
      const [red, green, blue, alpha] = pixels.subarray(index, index + 4);
      if (alpha > 0 && (red < 245 || green < 245 || blue < 245)) nonWhite += 1;
      if (red > 180 && green < 110 && blue < 110) markerRed += 1;
    }
    return { width: canvas.width, height: canvas.height, nonWhite, markerRed };
  }, png);
}

test("job sheet intake fields and damage marks persist through the Job Card edit dialog", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  await page.locator(".record-card").first().getByRole("button", { name: "Edit", exact: true }).click();
  const sheet = page.getByRole("region", { name: "Job sheet" });
  await sheet.getByLabel("Service Type").selectOption("PPF");
  await sheet.getByLabel("Estimated Delivery Date").fill("2026-10-15");
  await sheet.getByLabel("Engine Number").fill("ENG-E2E-1");
  await sheet.getByLabel("Address").fill("12 MG Road");
  await sheet.getByRole("button", { name: "Save Job Sheet" }).click();
  await page.getByRole("tab", { name: "Body Mark" }).click();
  const body = page.getByRole("region", { name: "Body mark" });
  const diagram = body.getByTestId("damage-diagram");
  await expect(diagram.getByRole("img", { name: "Vehicle body illustration" })).toHaveAttribute("src", "/car-damage-diagram.png");
  const blankDownload = page.waitForEvent("download");
  await body.getByRole("button", { name: "Download image" }).click();
  const blankPixels = await pngPixels(page, await blankDownload);
  const canvas = diagram.locator(".body-mark-canvas");
  const box = await canvas.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.height / box!.width).toBeCloseTo(682 / 511, 1);
  await canvas.click({ position: { x: box!.width / 2, y: box!.height / 2 } });
  await canvas.click({ position: { x: box!.width * .25, y: box!.height * .25 } });
  await expect(body.getByTestId("damage-mark")).toHaveCount(2);
  await body.getByTestId("damage-mark").first().click();
  await expect(body.getByTestId("damage-mark")).toHaveCount(1);
  const markedDownload = page.waitForEvent("download");
  await body.getByRole("button", { name: "Download image" }).click();
  const markedPixels = await pngPixels(page, await markedDownload);
  expect(markedPixels.width).toBeGreaterThan(0);
  expect(markedPixels.height).toBeGreaterThan(0);
  expect(markedPixels.nonWhite).toBeGreaterThan(10_000);
  expect(markedPixels.markerRed).toBeGreaterThan(blankPixels.markerRed + 100);
  await body.getByRole("button", { name: "Save Body Marks" }).click();
  await page.getByRole("button", { name: "Go Back" }).click();
  await page.locator(".record-card").first().getByRole("button", { name: "View", exact: true }).click();
  const view = page.getByRole("region", { name: "Job sheet" });
  await expect(view.getByText("ENG-E2E-1")).toBeVisible();
  await expect(view.getByText("12 MG Road")).toBeVisible();
  await expect(view.getByText("PPF", { exact: true })).toBeVisible();
  await expect(view.getByText("2026-10-15", { exact: true })).toBeVisible();
  await page.getByRole("tab", { name: "Body Mark" }).click();
  await expect(page.getByRole("region", { name: "Body mark" }).getByTestId("damage-mark")).toHaveCount(1);
});

test("owner adds, requests and cancels a material row with an over-stock warning", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  await page.locator(".record-card").filter({ hasText: "JC-2026-001246" }).getByRole("button", { name: "Edit", exact: true }).click();
  const editor = page.getByRole("dialog", { name: /Edit Job/ });
  await editor.getByRole("tab", { name: "Materials" }).click();
  await editor.getByLabel("Add material item", { exact: true }).fill("Tack");
  await expect(editor.getByRole("option", { name: /in stock: 14/ })).toBeVisible();
  await editor.getByRole("option", { name: /Tack Cloth/ }).getByRole("button").click();
  await editor.getByLabel("Add material quantity").fill("20");
  await editor.getByRole("button", { name: "Add row" }).click();
  const row = editor.getByRole("list", { name: "Material rows" }).locator("li").filter({ hasText: "Draft" });
  await expect(row).toContainText("in stock: 14");
  await expect(row.getByRole("status")).toContainText("more than the 14 in stock");
  await expect(row.getByRole("button", { name: "Delete" })).toBeVisible();
  await row.getByRole("button", { name: "Request", exact: true }).click();
  const requested = editor.getByRole("list", { name: "Material rows" }).locator("li").filter({ hasText: "Tack Cloth" });
  await expect(requested).toContainText("Requested");
  await expect(requested.getByRole("button", { name: "Delete" })).toHaveCount(0);
  await requested.getByRole("button", { name: "Cancel request" }).click();
  await expect(requested).toContainText("Cancelled");
});

test("owner releases a requested row, then edits it as Issued with a note", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  await page.locator(".record-card").filter({ hasText: "JC-2026-001246" }).getByRole("button", { name: "Edit", exact: true }).click();
  const editor = page.getByRole("dialog", { name: /Edit Job/ });
  await editor.getByRole("tab", { name: "Materials" }).click();
  await editor.getByLabel("Add material item", { exact: true }).fill("Tack");
  await editor.getByRole("option", { name: /Tack Cloth/ }).getByRole("button").click();
  await editor.getByLabel("Add material quantity").fill("2");
  await editor.getByRole("button", { name: "Add row" }).click();
  const row = editor.getByRole("list", { name: "Material rows" }).locator("li").last();
  await row.getByRole("button", { name: "Request", exact: true }).click();
  await row.getByRole("button", { name: "Release" }).click();
  await expect(row).toContainText("Issued");
  await expect(row).toContainText("in stock: 12");
  await row.getByRole("button", { name: "Edit issued row" }).click();
  await row.getByLabel("Material quantity").fill("3");
  await row.getByRole("button", { name: "Save issued edit" }).click();
  await expect(row.getByRole("alert")).toContainText("note is required");
  await row.getByLabel("Edit note").fill("Customer wanted more");
  await row.getByRole("button", { name: "Save issued edit" }).click();
  await expect(row).toContainText("in stock: 11");
  await expect(row).toContainText("Issued");
});

test("estimate approval and invoice creation enable Completed with per-line GST totals", async ({ page }) => {
  await loginAs(page, "admin@example.com");
  await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  await page.getByLabel("Main status").selectOption("IN_PROGRESS");
  await page.locator("main").getByRole("button", { name: "Search", exact: true }).click();
  await page.locator(".record-card").first().getByRole("button", { name: "Edit", exact: true }).click();
  const editor = page.getByRole("dialog", { name: /Edit Job/ });
  await editor.getByRole("tab", { name: "Invoice" }).click();
  await expect(editor.getByText("No invoice yet.")).toBeVisible();
  await expect(editor.getByRole("button", { name: "Complete Work" })).toBeDisabled();
  const approve = editor.getByRole("button", { name: "Approve Estimate" });
  if (await approve.count()) {
    await approve.first().click();
    await page.getByRole("dialog", { name: "Approve Estimate?" }).getByRole("button", { name: "Approve Estimate" }).click();
  }
  await editor.getByRole("button", { name: "Create Invoice" }).first().click();
  const create = page.getByRole("dialog", { name: "Create Invoice" });
  await create.getByLabel("Invoice item 1 rate").fill("1000");
  await create.getByLabel("Invoice item 1 quantity").fill("1");
  await expect(create.getByLabel("Invoice item 1 GST type")).toHaveValue("CGST+SGST");
  await expect(create.getByLabel("Invoice item 1 GST rate")).toHaveValue("18%");
  await create.getByLabel("Invoice discount").fill("100");
  await expect(create.getByLabel("Invoice totals")).toContainText("Discount");
  await create.getByRole("button", { name: "Save Invoice" }).click();
  await expect(create).toBeHidden();
  await expect(editor.getByRole("table", { name: "Invoice lines" })).toBeVisible();
  await expect(editor.getByRole("button", { name: "Complete Work" })).toBeEnabled();
});
