# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workshopos.spec.ts >> opening a paginated record and returning preserves list state
- Location: tests\workshopos.spec.ts:1047:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Next page', exact: true }).first()
    - locator resolved to <button disabled type="button" title="Next page" aria-label="Next page">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
      - waiting 100ms
    52 × waiting for element to be visible, enabled and stable
       - element is not enabled
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [ref=f1e3]:
  - complementary [ref=f1e4]:
    - generic [ref=f1e10]:
      - strong [ref=f1e11]: WorkshopOS
      - generic [ref=f1e12]: Workshop Management. Simplified.
    - button "Hide left menu" [ref=f1e13] [cursor=pointer]
    - generic [ref=f1e17]: Owner/Admin
    - navigation "Owner/Admin menu" [ref=f1e18]:
      - button "Dashboard" [ref=f1e19] [cursor=pointer]
      - button "Advance Bookings" [ref=f1e24] [cursor=pointer]
      - button "Approvals (0)" [ref=f1e28] [cursor=pointer]
      - button "Data Flow" [ref=f1e33] [cursor=pointer]
      - button "Job Cards" [active] [ref=f1e39] [cursor=pointer]
      - button "Media" [ref=f1e44] [cursor=pointer]
      - button "Purchase Orders" [ref=f1e49] [cursor=pointer]
      - button "Manage" [ref=f1e53] [cursor=pointer]
      - button "Search" [ref=f1e58] [cursor=pointer]
      - button "Admin Console" [ref=f1e63] [cursor=pointer]
      - group [ref=f1e68]:
        - generic "Sales CRM" [ref=f1e69] [cursor=pointer]
    - button "Logout" [ref=f1e70] [cursor=pointer]
  - main [ref=f1e75]:
    - generic [ref=f1e76]:
      - generic [ref=f1e77]:
        - paragraph [ref=f1e78]: Owner/Admin
        - heading "Control room for linked workflow, blockers and cash." [level=1] [ref=f1e79]
      - generic [ref=f1e80]: admin@example.com
    - generic [ref=f1e84]:
      - generic [ref=f1e85]:
        - generic [ref=f1e86]:
          - heading "Job Cards" [level=2] [ref=f1e87]
          - paragraph [ref=f1e88]: Browse and manage job cards
        - button "Add Job Card" [ref=f1e89] [cursor=pointer]
      - generic [ref=f1e92]:
        - generic [ref=f1e93]:
          - generic [ref=f1e94]:
            - text: Search
            - textbox "Search job cards" [ref=f1e95]:
              - /placeholder: Job, vehicle, customer or mobile
          - generic [ref=f1e96]:
            - text: Main status
            - combobox "Main status" [ref=f1e97]:
              - option "All statuses"
              - option "NEW"
              - option "IN_PROGRESS" [selected]
              - option "COMPLETED"
              - option "CANCELLED"
              - option "CLOSED"
          - generic [ref=f1e98]:
            - text: Workflow
            - combobox "Workflow status" [ref=f1e99]:
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
          - generic [ref=f1e100]:
            - text: Estimated Delivery Date
            - textbox "Estimated delivery date" [ref=f1e101]
          - generic [ref=f1e102]:
            - text: Estimated Delivery Month-Year
            - combobox "Estimated delivery month-year" [ref=f1e103]:
              - option "All months"
              - option "October 2026" [selected]
        - generic [ref=f1e104]:
          - generic [ref=f1e105]:
            - text: Service advisor
            - combobox "Service advisor filter" [ref=f1e106]:
              - option "All advisors" [selected]
              - option "Service advisor 1"
              - option "Service advisor AA"
              - option "Service advisor BB1"
          - generic [ref=f1e107]:
            - text: Sort
            - combobox "Sort results" [ref=f1e108]:
              - option "Newest" [selected]
              - option "Oldest"
              - option "Estimated delivery (soonest)"
              - option "Estimated delivery (latest)"
              - option "Amount (high to low)"
              - option "Amount (low to high)"
          - generic [ref=f1e109]:
            - generic [ref=f1e110]: Show archived only
            - switch "Show archived only" [ref=f1e111] [cursor=pointer]
          - group "Search actions" [ref=f1e114]:
            - button "Clear" [ref=f1e115] [cursor=pointer]
      - generic [ref=f1e116]:
        - generic [ref=f1e117]:
          - button "Download" [disabled] [ref=f1e119]
          - group "View mode" [ref=f1e123]:
            - button "Grid" [pressed] [ref=f1e124] [cursor=pointer]
            - button "Table" [ref=f1e125] [cursor=pointer]
        - generic [ref=f1e126]: Showing 0 to 0 of 0
        - generic [ref=f1e127]:
          - generic [ref=f1e128]:
            - text: Per page
            - combobox "Records per page" [ref=f1e129]:
              - option "10" [selected]
              - option "20"
              - option "50"
          - navigation "Results pagination" [ref=f1e130]:
            - button "First page" [disabled] [ref=f1e131]
            - button "Previous page" [disabled] [ref=f1e134]
            - button "Page 1" [ref=f1e138] [cursor=pointer]: "1"
            - button "Next page" [disabled] [ref=f1e139]
            - button "Last page" [disabled] [ref=f1e142]
      - generic [ref=f1e145]:
        - heading "No matching records" [level=3] [ref=f1e146]
        - paragraph [ref=f1e147]: Adjust the search or clear the filters.
        - button "Clear filters" [ref=f1e148] [cursor=pointer]
      - navigation "Results pagination" [ref=f1e149]:
        - button "First page" [disabled] [ref=f1e150]
        - button "Previous page" [disabled] [ref=f1e153]
        - button "Page 1" [ref=f1e157] [cursor=pointer]: "1"
        - button "Next page" [disabled] [ref=f1e158]
        - button "Last page" [disabled] [ref=f1e161]
```

# Test source

```ts
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
> 1054 |   await page.getByRole("button", { name: "Next page", exact: true }).first().click();
       |                                                                              ^ Error: locator.click: Test timeout of 30000ms exceeded.
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
  1140 |   const estimateDialog = page.getByRole("dialog", { name: "Edit Estimate" });
  1141 |   await expect(estimateDialog).toHaveClass(/dialog-document-editor/);
  1142 |   await estimateDialog.getByLabel("Notes").fill("Edited from job card");
  1143 |   await estimateDialog.getByRole("button", { name: "Save Estimate" }).click();
  1144 |   await expect(jobDialog).toBeVisible();
  1145 | 
  1146 |   const invoiceRow = jobDialog.locator(".document-row").filter({ has: page.getByText("Invoice", { exact: true }) });
  1147 |   await invoiceRow.getByRole("button", { name: "Create Invoice" }).click();
  1148 |   const createInvoice = page.getByRole("dialog", { name: "Create Invoice" });
  1149 |   await expect(createInvoice).toHaveClass(/dialog-document-editor/);
  1150 |   await expect(page.getByRole("dialog")).toHaveCount(2);
  1151 |   await expect(createInvoice.getByLabel("Billing job")).toHaveCount(0);
  1152 |   await expect(createInvoice.getByLabel("Document available")).toHaveCount(0);
  1153 |   await expect(createInvoice.getByText("Document available", { exact: true })).toHaveCount(0);
  1154 |   await expect(createInvoice.getByLabel("Invoice item 1 description")).not.toHaveValue("");
```