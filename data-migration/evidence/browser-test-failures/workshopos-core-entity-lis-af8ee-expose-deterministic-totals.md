# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workshopos.spec.ts >> core entity lists switch views and expose deterministic totals
- Location: tests\workshopos.spec.ts:969:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Showing 1 to 10 of 144')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('Showing 1 to 10 of 144') with timeout 5000ms
  - waiting for getByText('Showing 1 to 10 of 144')

```

```yaml
- complementary:
  - strong: WorkshopOS
  - text: Workshop Management. Simplified.
  - button "Hide left menu"
  - text: Owner/Admin
  - navigation "Owner/Admin menu":
    - button "Dashboard"
    - button "Advance Bookings"
    - button "Approvals (0)"
    - button "Data Flow"
    - button "Job Cards"
    - button "Media"
    - button "Purchase Orders"
    - button "Manage"
    - button "Search"
    - button "Admin Console"
    - group: Sales CRM
  - button "Logout"
- main:
  - paragraph: Owner/Admin
  - heading "Control room for linked workflow, blockers and cash." [level=1]
  - text: admin@example.com
  - heading "Job Cards" [level=2]
  - paragraph: Browse and manage job cards
  - button "Add Job Card"
  - text: Search
  - textbox "Search job cards":
    - /placeholder: Job, vehicle, customer or mobile
  - text: Main status
  - combobox "Main status":
    - option "All statuses" [selected]
    - option "NEW"
    - option "IN_PROGRESS"
    - option "COMPLETED"
    - option "CANCELLED"
    - option "CLOSED"
  - text: Workflow
  - combobox "Workflow status":
    - option "All workflows" [selected]
    - option "Create Estimate"
    - option "Customer Verification"
    - option "Delivered"
    - option "Follow-up Needed"
    - option "Gate Pass Generated"
    - option "Gather Requirements"
    - option "Get Confirmation"
    - option "Invoice Ready"
    - option "Material Issued"
    - option "Material Requested"
    - option "Payment Received"
    - option "Photos Shared"
    - option "QC Pending"
    - option "Receipt Generated"
    - option "Washing Needed"
    - option "Work Started"
  - text: Estimated Delivery Date
  - textbox "Estimated delivery date"
  - text: Estimated Delivery Month-Year
  - combobox "Estimated delivery month-year":
    - option "All months"
    - option "October 2026" [selected]
  - text: Service advisor
  - combobox "Service advisor filter":
    - option "All advisors" [selected]
    - option "Service advisor 1"
    - option "Service advisor AA"
    - option "Service advisor BB1"
  - text: Sort
  - combobox "Sort results":
    - option "Newest" [selected]
    - option "Oldest"
    - option "Estimated delivery (soonest)"
    - option "Estimated delivery (latest)"
    - option "Amount (high to low)"
    - option "Amount (low to high)"
  - text: Show archived only
  - switch "Show archived only"
  - group "Search actions":
    - button "Clear"
  - button "Download" [disabled]
  - group "View mode":
    - button "Grid" [pressed]
    - button "Table"
  - text: Showing 0 to 0 of 0 Per page
  - combobox "Records per page":
    - option "10" [selected]
    - option "20"
    - option "50"
  - navigation "Results pagination":
    - button "First page" [disabled]
    - button "Previous page" [disabled]
    - button "Page 1": "1"
    - button "Next page" [disabled]
    - button "Last page" [disabled]
  - heading "No matching records" [level=3]
  - paragraph: Adjust the search or clear the filters.
  - button "Clear filters"
  - navigation "Results pagination":
    - button "First page" [disabled]
    - button "Previous page" [disabled]
    - button "Page 1": "1"
    - button "Next page" [disabled]
    - button "Last page" [disabled]
```

# Test source

```ts
  876  | });
  877  | 
  878  | test("Search gives delegated categories the shared filter grid without changing their filters", async ({ page }) => {
  879  |   await loginAs(page, "admin@example.com");
  880  |   await page.locator(".role-nav").getByRole("button", { name: "Search", exact: true }).click();
  881  |   const categorySelect = page.getByLabel("Search category");
  882  |   const searchToolbar = page.locator(".search-topbar-controls");
  883  |   await categorySelect.selectOption("job");
  884  |   const categoryBackground = await categorySelect.evaluate((control) => getComputedStyle(control).backgroundColor);
  885  |   const headerBackground = await page.locator("th").first().evaluate((header) => getComputedStyle(header).backgroundColor);
  886  |   expect(categoryBackground).toBe(headerBackground);
  887  |   await expect(searchToolbar.getByRole("button", { name: "Clear category", exact: true })).toHaveCSS("background-color", "rgb(229, 231, 235)");
  888  | 
  889  |   for (const [category, selector] of [
  890  |     ["customer", ".entity-list-page .search-filter-layout .search-filter-row"],
  891  |     ["vehicle", ".entity-list-page .search-filter-layout .search-filter-row"],
  892  |     ["material-requests", ".material-record-filter-grid.search-filter-layout"],
  893  |     ["issue-material", ".material-record-filter-grid.search-filter-layout"],
  894  |     ["reconcile", ".reconcile-filter-grid.search-filter-layout"],
  895  |     ["estimate", ".service-advisor-list .search-filter-layout .search-filter-row"],
  896  |     ["follow-ups", ".service-advisor-list .search-filter-layout .search-filter-row"],
  897  |   ] as const) {
  898  |     await categorySelect.selectOption(category);
  899  |     const filters = page.locator(selector);
  900  |     await expect(filters).toBeVisible();
  901  |     await expect(filters.getByRole("button", { name: "Clear", exact: true })).toBeVisible();
  902  |     if (["customer", "vehicle", "material-requests", "issue-material", "reconcile", "estimate", "follow-ups"].includes(category))
  903  |       await expect(page.locator(".portal > .list-filter-bar")).toHaveCount(0);
  904  |     if (category === "customer" || category === "vehicle") {
  905  |       await expect(filters.getByLabel("Search records")).toBeVisible();
  906  |       await expect(filters.getByLabel("Search records")).toHaveCount(1);
  907  |       const rows = await filters.locator(":scope > label, :scope > .ui-switch, :scope > .list-search-actions").evaluateAll((controls) => new Set(controls.map((control) => Math.round(control.getBoundingClientRect().bottom))).size);
  908  |       expect(rows).toBe(1);
  909  |     }
  910  |   }
  911  | 
  912  |   await page.setViewportSize({ width: 390, height: 844 });
  913  |   await categorySelect.selectOption("customer");
  914  |   const entityControls = page.locator(".entity-search-filter-row > label, .entity-search-filter-row > .ui-switch, .entity-search-filter-row > .list-search-actions");
  915  |   const entityWidths = await entityControls.evaluateAll((items) => items.map((item) => Math.round(item.getBoundingClientRect().width)));
  916  |   expect(entityWidths.every((width) => width > 0)).toBe(true);
  917  |   expect(new Set(entityWidths).size).toBe(1);
  918  |   await expectNoPageOverflow(page);
  919  |   await categorySelect.selectOption("reconcile");
  920  |   const controls = page.locator(".reconcile-filter-grid.search-filter-layout > *");
  921  |   const widths = await controls.evaluateAll((items) => items.map((item) => Math.round(item.getBoundingClientRect().width)));
  922  |   expect(widths.every((width) => width > 0)).toBe(true);
  923  |   expect(new Set(widths).size).toBe(1);
  924  | });
  925  | 
  926  | test("non-admin Search keeps its existing category availability", async ({ page }) => {
  927  |   await loginAs(page, "service@example.com");
  928  |   await page.locator(".role-nav").getByRole("button", { name: "Search", exact: true }).click();
  929  |   const categorySelect = page.getByLabel("Search category");
  930  |   for (const category of ["material-requests", "issue-material", "reconcile", "estimate", "follow-ups"]) {
  931  |     await expect(categorySelect.locator(`option[value="${category}"]`)).toHaveCount(0);
  932  |   }
  933  | });
  934  | 
  935  | test("admin loads the deterministic large dataset and paginates core lists", async ({ page }) => {
  936  |   await loginAs(page, "admin@example.com");
  937  |   await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  938  |   page.once("dialog", (dialog) => dialog.accept());
  939  |   await page.getByRole("button", { name: "Load Large Demo Dataset" }).click();
  940  |   await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  941  |   await expect(page.getByText("Showing 1 to 10 of 144")).toBeVisible();
  942  |   await expect(page.locator(".record-card")).toHaveCount(10);
  943  |   await page.getByRole("button", { name: "Table", exact: true }).click();
  944  |   await expect(page.locator("tbody tr")).toHaveCount(10);
  945  |   const pagination = page.getByRole("navigation", { name: "Results pagination" }).first();
  946  |   await expect(pagination.getByRole("button", { name: "First page" })).toBeDisabled();
  947  |   await expect(pagination.getByRole("button", { name: "Previous page" })).toBeDisabled();
  948  |   await expect(pagination.getByRole("button", { name: "Page 1", exact: true })).toHaveAttribute("aria-current", "page");
  949  |   await pagination.getByRole("button", { name: "Page 3", exact: true }).click();
  950  |   await expect(page.getByText("Showing 21 to 30 of 144")).toBeVisible();
  951  |   await pagination.getByRole("button", { name: "Previous page" }).click();
  952  |   await expect(page.getByText("Showing 11 to 20 of 144")).toBeVisible();
  953  |   await pagination.getByRole("button", { name: "First page" }).click();
  954  |   await expect(page.getByText("Showing 1 to 10 of 144")).toBeVisible();
  955  |   await pagination.getByRole("button", { name: "Last page" }).click();
  956  |   await expect(page.getByText("Showing 141 to 144 of 144")).toBeVisible();
  957  |   await expect(pagination.getByRole("button", { name: "Page 15", exact: true })).toHaveAttribute("aria-current", "page");
  958  |   await expect(pagination.getByRole("button", { name: "Next page" })).toBeDisabled();
  959  |   await expect(pagination.getByRole("button", { name: "Last page" })).toBeDisabled();
  960  |   await expect(page.getByLabel("Records per page").locator("option")).toHaveText(["10", "20", "50"]);
  961  |   await page.getByLabel("Records per page").selectOption("20");
  962  |   await expect(page.locator("tbody tr")).toHaveCount(20);
  963  |   await page.getByRole("button", { name: "Next page", exact: true }).first().click();
  964  |   await expect(page.getByText("Showing 21 to 40 of 144")).toBeVisible();
  965  |   await page.getByLabel("Search job cards").fill("JC-2026-002001");
  966  |   await expect(page.getByText("Showing 1 to 1 of 1")).toBeVisible();
  967  | });
  968  | 
  969  | test("core entity lists switch views and expose deterministic totals", async ({ page }) => {
  970  |   await loginAs(page, "admin@example.com");
  971  |   await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  972  |   page.once("dialog", (dialog) => dialog.accept());
  973  |   await page.getByRole("button", { name: "Load Large Demo Dataset" }).click();
  974  |   for (const [name, total] of [["Job Cards", 144], ["Media", 288]] as const) {
  975  |     await page.locator(".role-nav").getByRole("button", { name, exact: true }).click();
> 976  |     await expect(page.getByText(`Showing 1 to 10 of ${total}`)).toBeVisible();
       |                                                                 ^ Error: expect(locator).toBeVisible() failed
  977  |     await page.getByRole("button", { name: "Table", exact: true }).click();
  978  |     await expect(page.locator("tbody tr")).toHaveCount(10);
  979  |     await page.getByRole("button", { name: "Grid", exact: true }).click();
  980  |     await expect(page.locator(".record-card")).toHaveCount(10);
  981  |   }
  982  |   await page.locator(".role-nav").getByRole("button", { name: "Search", exact: true }).click();
  983  |   for (const [category, total] of [["customer", 120], ["vehicle", 132]] as const) {
  984  |     await page.getByLabel("Search category").selectOption(category);
  985  |     await expect(page.getByText(`Showing 1 to 10 of ${total}`)).toBeVisible();
  986  |     await page.getByRole("button", { name: "Table", exact: true }).click();
  987  |     await expect(page.locator("tbody tr")).toHaveCount(10);
  988  |     await page.getByRole("button", { name: "Grid", exact: true }).click();
  989  |     await expect(page.locator(".record-card")).toHaveCount(10);
  990  |     await page.getByRole("button", { name: "Next page", exact: true }).first().click();
  991  |     await expect(page.getByText(`Showing 11 to 20 of ${total}`)).toBeVisible();
  992  |     await page.getByLabel("Search records").fill("definitely-no-workshop-record");
  993  |     await expect(page.getByText("Showing 0 to 0 of 0")).toBeVisible();
  994  |     await page.locator(".entity-search-filter-row").getByRole("button", { name: "Clear", exact: true }).click();
  995  |     await expect(page.getByText(`Showing 1 to 10 of ${total}`)).toBeVisible();
  996  |   }
  997  | });
  998  | 
  999  | test("media filters use the linked job received date and scope job cards to the advisor", async ({ page }) => {
  1000 |   await loginAs(page, "admin@example.com");
  1001 |   await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  1002 |   page.once("dialog", (dialog) => dialog.accept());
  1003 |   await page.getByRole("button", { name: "Load Large Demo Dataset" }).click();
  1004 |   await page.locator(".role-nav").getByRole("button", { name: "Media", exact: true }).click();
  1005 | 
  1006 |   const monthYear = page.getByLabel("Media month-year");
  1007 |   const months = await monthYear.locator("option").evaluateAll((options) => options.map((option) => option.getAttribute("value") ?? ""));
  1008 |   expect(months[0]).toBe("");
  1009 |   expect(months.slice(1)).toEqual([...months.slice(1)].sort().reverse());
  1010 | 
  1011 |   await page.getByRole("button", { name: "Next page", exact: true }).first().click();
  1012 |   await expect(page.getByText("Showing 11 to 20 of 288")).toBeVisible();
  1013 |   await monthYear.selectOption("2026-07");
  1014 |   await expect(page.getByText("Showing 1 to 10 of 36")).toBeVisible();
  1015 |   await page.getByLabel("Media received date").fill("2026-08-14");
  1016 |   await expect(page.getByText("Showing 1 to 2 of 2")).toBeVisible();
  1017 |   const mediaClear = page.getByRole("button", { name: "Clear", exact: true });
  1018 |   await expect(mediaClear).toHaveClass(/filter-clear-action/);
  1019 |   await mediaClear.click();
  1020 |   await expect(page.getByText("Showing 1 to 10 of 288")).toBeVisible();
  1021 | 
  1022 |   const adminJobIds = await page.getByLabel("Job card filter").locator("option").evaluateAll((options) => options.slice(1).map((option) => option.getAttribute("value")));
  1023 |   await page.getByRole("button", { name: "Logout" }).click();
  1024 |   await loginAs(page, "advisor.aa@example.com");
  1025 |   await page.locator(".role-nav").getByRole("button", { name: "Media", exact: true }).click();
  1026 |   const advisorJobIds = await page.getByLabel("Job card filter").locator("option").evaluateAll((options) => options.slice(1).map((option) => option.getAttribute("value")));
  1027 |   expect(advisorJobIds).not.toHaveLength(0);
  1028 |   expect(advisorJobIds.length).toBeLessThan(adminJobIds.length);
  1029 |   expect(advisorJobIds.every((id) => adminJobIds.includes(id))).toBe(true);
  1030 | });
  1031 | 
  1032 | test("mobile lists use cards, compact pagination and no horizontal overflow", async ({ page }) => {
  1033 |   await page.setViewportSize({ width: 390, height: 844 });
  1034 |   await loginAs(page, "admin@example.com");
  1035 |   await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  1036 |   page.once("dialog", (dialog) => dialog.accept());
  1037 |   await page.getByRole("button", { name: "Load Large Demo Dataset" }).click();
  1038 |   await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  1039 |   await expect(page.getByText("Page 1 of 15").first()).toBeVisible();
  1040 |   const pagination = page.getByRole("navigation", { name: "Results pagination" }).first();
  1041 |   await expect(pagination.locator(".numbered-pages")).toBeHidden();
  1042 |   await expect(pagination.getByRole("button")).toHaveCount(4);
  1043 |   await expect(page.locator(".record-card")).toHaveCount(10);
  1044 |   expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBeTruthy();
  1045 | });
  1046 | 
  1047 | test("opening a paginated record and returning preserves list state", async ({ page }) => {
  1048 |   await loginAs(page, "admin@example.com");
  1049 |   await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  1050 |   page.once("dialog", (dialog) => dialog.accept());
  1051 |   await page.getByRole("button", { name: "Load Large Demo Dataset" }).click();
  1052 |   await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  1053 |   await page.getByLabel("Main status").selectOption("IN_PROGRESS");
  1054 |   await page.getByRole("button", { name: "Next page", exact: true }).first().click();
  1055 |   await page.locator(".record-card").first().getByRole("button", { name: "View", exact: true }).click();
  1056 |   await expect(page.getByRole("dialog", { name: /View Job/ })).toBeVisible();
  1057 |   await page.getByRole("button", { name: "Go Back" }).click();
  1058 |   await expect(page.getByText(/Showing 11 to 20 of/)).toBeVisible();
  1059 |   await expect(page.getByLabel("Main status")).toHaveValue("IN_PROGRESS");
  1060 | });
  1061 | 
  1062 | test("job dialogs expose distinct modes, documents, focus return and shared search entry", async ({ page }) => {
  1063 |   await loginAs(page, "admin@example.com");
  1064 |   await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  1065 |   const viewButton = page.locator(".record-card").first().getByRole("button", { name: "View", exact: true });
  1066 |   await viewButton.click();
  1067 |   await expect(page.getByRole("dialog", { name: /View Job/ })).toBeVisible();
  1068 |   await page.getByRole("tab", { name: "Documents" }).click();
  1069 |   await expect(page.locator(".document-center")).toBeVisible();
  1070 |   await page.getByRole("button", { name: "Go Back" }).click();
  1071 |   await expect(viewButton).toBeFocused();
  1072 | 
  1073 |   await page.locator(".record-card").first().getByRole("button", { name: "Edit", exact: true }).click();
  1074 |   await expect(page.getByRole("dialog", { name: /Edit Job/ })).toBeVisible();
  1075 |   await expect(page.getByRole("button", { name: "Save Job Details" })).toBeVisible();
  1076 |   await page.keyboard.press("Escape");
```