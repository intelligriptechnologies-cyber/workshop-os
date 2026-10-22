# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workshopos.spec.ts >> mobile lists use cards, compact pagination and no horizontal overflow
- Location: tests\workshopos.spec.ts:1032:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Page 1 of 15').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('Page 1 of 15').first() with timeout 5000ms
  - waiting for getByText('Page 1 of 15').first()

```

```yaml
- complementary:
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
- main:
  - paragraph: Owner/Admin
  - heading "Control room for linked workflow, blockers and cash." [level=1]
  - text: admin@example.com
  - button "Logout"
  - heading "Job Cards" [level=2]
  - paragraph: Browse and manage job cards
  - button "Add Job Card"
  - button "Show filters"
  - button "Download" [disabled]
  - group "View mode":
    - button "Grid" [pressed]
    - button "Table"
  - text: Showing 0 to 0 of 0
  - navigation "Results pagination":
    - button "First page" [disabled]
    - button "Previous page" [disabled]
    - text: Page 1 of 1
    - button "Next page" [disabled]
    - button "Last page" [disabled]
  - heading "No matching records" [level=3]
  - paragraph: Adjust the search or clear the filters.
  - button "Clear filters"
  - navigation "Results pagination":
    - button "First page" [disabled]
    - button "Previous page" [disabled]
    - text: Page 1 of 1
    - button "Next page" [disabled]
    - button "Last page" [disabled]
```

# Test source

```ts
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
  976  |     await expect(page.getByText(`Showing 1 to 10 of ${total}`)).toBeVisible();
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
> 1039 |   await expect(page.getByText("Page 1 of 15").first()).toBeVisible();
       |                                                        ^ Error: expect(locator).toBeVisible() failed
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
  1077 | 
  1078 |   await page.locator(".role-nav").getByRole("button", { name: "Search", exact: true }).click();
  1079 |   await page.getByLabel("Search category").selectOption("job");
  1080 |   await page.getByRole("table", { name: "Job Card search results" }).locator("tbody tr").first().getByRole("button", { name: "View" }).click();
  1081 |   await expect(page.getByRole("dialog", { name: /View Job/ })).toBeVisible();
  1082 | });
  1083 | 
  1084 | test("Job Cards grid uses direct, permission-aware view, edit and archive actions", async ({ page }) => {
  1085 |   await page.setViewportSize({ width: 1440, height: 900 });
  1086 |   await loginAs(page, "admin@example.com");
  1087 |   await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  1088 | 
  1089 |   const grid = page.locator(".record-grid.jobs");
  1090 |   const card = grid.locator(".job-card").first();
  1091 |   await expect(card.locator(".doc-chip")).toHaveCount(4);
  1092 |   await expect(card).toHaveClass(/job-status-/);
  1093 |   expect(await grid.evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length)).toBe(4);
  1094 | 
  1095 |   const quickView = card.getByRole("button", { name: "View", exact: true });
  1096 |   await expect(quickView).toBeVisible();
  1097 |   await quickView.click();
  1098 |   await expect(page.getByRole("dialog", { name: /View Job/ })).toBeVisible();
  1099 |   await page.getByRole("button", { name: "Go Back" }).click();
  1100 |   await expect(quickView).toBeFocused();
  1101 | 
  1102 |   await expect(card.getByRole("button", { name: "Edit", exact: true })).toBeVisible();
  1103 |   await expect(card.getByRole("button", { name: "Archive", exact: true })).toBeVisible();
  1104 | 
  1105 |   const archivedJobNo = await card.locator("h3").textContent();
  1106 |   page.once("dialog", (dialog) => dialog.accept());
  1107 |   await card.getByRole("button", { name: "Archive", exact: true }).click();
  1108 |   await expect(grid.locator(".job-card").filter({ hasText: archivedJobNo ?? "" })).toHaveCount(0);
  1109 | 
  1110 |   await page.setViewportSize({ width: 390, height: 844 });
  1111 |   await expectNoPageOverflow(page);
  1112 | });
  1113 | 
  1114 | test("job card document actions stack editors, replace creation actions after save, and download financial PDFs", async ({ page }) => {
  1115 |   await loginAs(page, "admin@example.com");
  1116 |   await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  1117 |   await page.getByRole("tab", { name: "Invoices", exact: true }).click();
  1118 |   const invoiceManager = page.getByRole("table", { name: "Invoices manager" });
  1119 |   const openInvoiceRow = invoiceManager.locator("tbody tr:not(.billing-detail-row)").filter({ hasText: "Pending" }).first();
  1120 |   await openInvoiceRow.click();
  1121 |   await expect(invoiceManager.getByRole("table", { name: "Invoice lines" })).toContainText("%");
  1122 |   await invoiceManager.getByRole("button", { name: "Void Invoice" }).click();
  1123 |   await invoiceManager.getByLabel("Void Invoice reason").fill("Recreate from job card E2E");
  1124 |   await invoiceManager.getByRole("button", { name: "Confirm Void Invoice" }).click();
  1125 | 
  1126 |   await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  1127 |   await page.getByLabel("Main status").selectOption("COMPLETED");
  1128 |   await page.locator(".record-card").first().getByRole("button", { name: "View", exact: true }).click();
  1129 |   const jobDialog = page.getByRole("dialog", { name: /View Job/ });
  1130 |   await jobDialog.getByRole("tab", { name: "Documents" }).click();
  1131 | 
  1132 |   const estimateRow = jobDialog.locator(".document-row").filter({ has: page.getByText("Estimate", { exact: true }) });
  1133 |   const estimateEdit = estimateRow.getByRole("button", { name: "Edit", exact: true });
  1134 |   await estimateEdit.click();
  1135 |   await expect(page.getByRole("dialog")).toHaveCount(2);
  1136 |   await page.keyboard.press("Escape");
  1137 |   await expect(jobDialog).toBeVisible();
  1138 |   await expect(estimateEdit).toBeFocused();
  1139 |   await estimateEdit.click();
```