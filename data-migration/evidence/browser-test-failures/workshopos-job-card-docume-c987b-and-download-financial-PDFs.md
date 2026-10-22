# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workshopos.spec.ts >> job card document actions stack editors, replace creation actions after save, and download financial PDFs
- Location: tests\workshopos.spec.ts:1114:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('table', { name: 'Invoices manager' }).getByRole('button', { name: 'Void Invoice' })

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
      - button "Job Cards" [ref=f1e39] [cursor=pointer]
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
    - generic [ref=f1e85]:
      - generic [ref=f1e90]:
        - heading "Management Hub" [level=2] [ref=f1e91]
        - paragraph [ref=f1e92]: Admin master data and workflow controls
      - generic [ref=f1e93]:
        - generic [ref=f1e94]:
          - strong [ref=f1e95]: Large demo dataset
          - generic [ref=f1e96]: 120 customers, 132 vehicles, 144 jobs and 288 offline media records.
        - button "Load Large Demo Dataset" [ref=f1e97] [cursor=pointer]
      - tablist "Management areas" [ref=f1e98]:
        - tab "Users" [ref=f1e99] [cursor=pointer]
        - tab "Customers" [ref=f1e100] [cursor=pointer]
        - tab "Vehicles" [ref=f1e101] [cursor=pointer]
        - tab "Suppliers" [ref=f1e102] [cursor=pointer]
        - tab "Job Cards" [ref=f1e103] [cursor=pointer]
        - tab "Estimates" [ref=f1e104] [cursor=pointer]
        - tab "Invoices" [selected] [ref=f1e105] [cursor=pointer]
        - tab "Payments" [ref=f1e106] [cursor=pointer]
        - tab "Delivery" [ref=f1e107] [cursor=pointer]
      - tabpanel "Invoices" [ref=f1e108]:
        - tabpanel [ref=f1e109]:
          - tabpanel [ref=f1e110]:
            - generic [ref=f1e111]:
              - generic [ref=f1e112]: INV-09038 · Pending
              - button "View Invoice" [ref=f1e113] [cursor=pointer]
              - button "Edit Invoice" [ref=f1e114] [cursor=pointer]
            - generic [ref=f1e115]:
              - generic [ref=f1e116]:
                - text: Search
                - textbox "Search invoices" [ref=f1e117]:
                  - /placeholder: Job, invoice, customer, vehicle or reference
              - generic [ref=f1e118]:
                - text: Month-Year
                - combobox "Invoices Month-Year filter" [ref=f1e119]:
                  - option "All months" [selected]
                  - option "October 2026"
                  - option "August 2026"
                  - option "July 2026"
                  - option "June 2026"
                  - option "May 2026"
                  - option "April 2026"
                  - option "March 2026"
              - generic [ref=f1e120]:
                - text: Status
                - combobox "Invoices status filter" [ref=f1e121]:
                  - option "All" [selected]
                  - option "Pending"
                  - option "Partial"
                  - option "Cleared"
              - group "Search actions" [ref=f1e122]:
                - button "Clear" [ref=f1e123] [cursor=pointer]
            - generic [ref=f1e124]:
              - button "Download" [ref=f1e127] [cursor=pointer]
              - generic [ref=f1e131]: Showing 1 to 10 of 52
              - generic [ref=f1e132]:
                - generic [ref=f1e133]:
                  - text: Per page
                  - combobox "Invoices records per page" [ref=f1e134]:
                    - option "10" [selected]
                    - option "20"
                    - option "50"
                - navigation "Results pagination" [ref=f1e135]:
                  - button "First page" [disabled] [ref=f1e136]
                  - button "Previous page" [disabled] [ref=f1e139]
                  - generic [ref=f1e142]:
                    - button "Page 1" [ref=f1e143] [cursor=pointer]: "1"
                    - button "Page 2" [ref=f1e144] [cursor=pointer]: "2"
                    - button "Page 3" [ref=f1e145] [cursor=pointer]: "3"
                    - button "Page 4" [ref=f1e146] [cursor=pointer]: "4"
                    - button "Page 5" [ref=f1e147] [cursor=pointer]: "5"
                    - button "Page 6" [ref=f1e148] [cursor=pointer]: "6"
                  - button "Next page" [ref=f1e149] [cursor=pointer]
                  - button "Last page" [ref=f1e152] [cursor=pointer]
            - table "Invoices manager" [ref=f1e156]:
              - rowgroup [ref=f1e157]:
                - row [ref=f1e158]:
                  - columnheader "Created" [ref=f1e159]
                  - columnheader "Job" [ref=f1e160]
                  - columnheader "Invoice" [ref=f1e161]
                  - columnheader "Customer" [ref=f1e162]
                  - columnheader "Total" [ref=f1e163]
                  - columnheader "Status" [ref=f1e164]
                  - columnheader "Actions" [ref=f1e165]
              - rowgroup [ref=f1e166]:
                - row [expanded] [active] [ref=f1e167] [cursor=pointer]:
                  - cell "2 Oct 2026, 7:31 am" [ref=f1e168]
                  - cell "JC-2026-002138" [ref=f1e169]
                  - cell "INV-09038" [ref=f1e170]
                  - cell "Demo Customer 006" [ref=f1e171]
                  - cell "9440" [ref=f1e172]
                  - cell "Pending" [ref=f1e173]
                  - cell [ref=f1e174]:
                    - generic [ref=f1e175]:
                      - button "View" [ref=f1e176]
                      - button "Download" [ref=f1e180]
                      - button "Print" [ref=f1e184]
                - row [ref=f1e189]:
                  - cell [ref=f1e190]:
                    - generic "JC-2026-002138 detail" [ref=f1e191]:
                      - generic [ref=f1e193]:
                        - heading "Invoice · INV-09038 Pending" [level=3] [ref=f1e194]:
                          - text: Invoice · INV-09038
                          - generic [ref=f1e195]: Pending
                        - paragraph [ref=f1e196]: JC-2026-002138 · OD07DM1006 · Demo Customer 006
                      - table "Invoice lines" [ref=f1e198]:
                        - rowgroup [ref=f1e199]:
                          - row [ref=f1e200]:
                            - columnheader "Type" [ref=f1e201]
                            - columnheader "Description" [ref=f1e202]
                            - columnheader "Qty" [ref=f1e203]
                            - columnheader "Rate" [ref=f1e204]
                            - columnheader "GST type" [ref=f1e205]
                            - columnheader "GST %" [ref=f1e206]
                            - columnheader "Amount" [ref=f1e207]
                        - rowgroup [ref=f1e208]:
                          - row [ref=f1e209]:
                            - cell "Service" [ref=f1e210]
                            - cell "Paint correction" [ref=f1e211]
                            - cell "1" [ref=f1e212]
                            - cell "₹8,000" [ref=f1e213]
                            - cell "CGST+SGST" [ref=f1e214]
                            - cell "18%" [ref=f1e215]
                            - cell "₹8,000" [ref=f1e216]
                          - row [ref=f1e217]:
                            - cell "Material" [ref=f1e218]
                            - cell "Gloss PPF roll" [ref=f1e219]
                            - cell "2" [ref=f1e220]
                            - cell "₹0" [ref=f1e221]
                            - cell "CGST+SGST" [ref=f1e222]
                            - cell "18%" [ref=f1e223]
                            - cell "₹0" [ref=f1e224]
                      - generic "Invoice summary" [ref=f1e225]:
                        - generic [ref=f1e226]:
                          - text: Subtotal
                          - strong [ref=f1e227]: ₹8,000
                        - generic [ref=f1e228]:
                          - text: Discount
                          - strong [ref=f1e229]: ₹0
                        - generic [ref=f1e230]:
                          - text: GST
                          - strong [ref=f1e231]: ₹1,440
                        - generic [ref=f1e232]:
                          - text: Total
                          - strong [ref=f1e233]: ₹9,440
                - row [ref=f1e234] [cursor=pointer]:
                  - cell "27 Aug 2026, 8:30 pm" [ref=f1e235]
                  - cell "JC-2026-002016" [ref=f1e236]
                  - cell "INV-2026-00016" [ref=f1e237]
                  - cell "Demo Customer 016" [ref=f1e238]
                  - cell "7080" [ref=f1e239]
                  - cell "Cleared" [ref=f1e240]
                  - cell [ref=f1e241]:
                    - generic [ref=f1e242]:
                      - button "View" [ref=f1e243]
                      - button "Download" [ref=f1e247]
                      - button "Print" [ref=f1e251]
                - row [ref=f1e256] [cursor=pointer]:
                  - cell "26 Aug 2026, 6:30 pm" [ref=f1e257]
                  - cell "JC-2026-002032" [ref=f1e258]
                  - cell "INV-2026-00032" [ref=f1e259]
                  - cell "Demo Customer 032" [ref=f1e260]
                  - cell "10620" [ref=f1e261]
                  - cell "Cleared" [ref=f1e262]
                  - cell [ref=f1e263]:
                    - generic [ref=f1e264]:
                      - button "View" [ref=f1e265]
                      - button "Download" [ref=f1e269]
                      - button "Print" [ref=f1e273]
                - row [ref=f1e278] [cursor=pointer]:
                  - cell "25 Aug 2026, 4:30 pm" [ref=f1e279]
                  - cell "JC-2026-002048" [ref=f1e280]
                  - cell "INV-2026-00048" [ref=f1e281]
                  - cell "Demo Customer 048" [ref=f1e282]
                  - cell "3540" [ref=f1e283]
                  - cell "Cleared" [ref=f1e284]
                  - cell [ref=f1e285]:
                    - generic [ref=f1e286]:
                      - button "View" [ref=f1e287]
                      - button "Download" [ref=f1e291]
                      - button "Print" [ref=f1e295]
                - row [ref=f1e300] [cursor=pointer]:
                  - cell "24 Aug 2026, 2:30 pm" [ref=f1e301]
                  - cell "JC-2026-002064" [ref=f1e302]
                  - cell "INV-2026-00064" [ref=f1e303]
                  - cell "Demo Customer 064" [ref=f1e304]
                  - cell "7080" [ref=f1e305]
                  - cell "Cleared" [ref=f1e306]
                  - cell [ref=f1e307]:
                    - generic [ref=f1e308]:
                      - button "View" [ref=f1e309]
                      - button "Download" [ref=f1e313]
                      - button "Print" [ref=f1e317]
                - row [ref=f1e322] [cursor=pointer]:
                  - cell "23 Aug 2026, 9:30 pm" [ref=f1e323]
                  - cell "JC-2026-002080" [ref=f1e324]
                  - cell "INV-2026-00080" [ref=f1e325]
                  - cell "Demo Customer 080" [ref=f1e326]
                  - cell "10620" [ref=f1e327]
                  - cell "Cleared" [ref=f1e328]
                  - cell [ref=f1e329]:
                    - generic [ref=f1e330]:
                      - button "View" [ref=f1e331]
                      - button "Download" [ref=f1e335]
                      - button "Print" [ref=f1e339]
                - row [ref=f1e344] [cursor=pointer]:
                  - cell "22 Aug 2026, 7:30 pm" [ref=f1e345]
                  - cell "JC-2026-002096" [ref=f1e346]
                  - cell "INV-2026-00096" [ref=f1e347]
                  - cell "Demo Customer 096" [ref=f1e348]
                  - cell "3540" [ref=f1e349]
                  - cell "Cleared" [ref=f1e350]
                  - cell [ref=f1e351]:
                    - generic [ref=f1e352]:
                      - button "View" [ref=f1e353]
                      - button "Download" [ref=f1e357]
                      - button "Print" [ref=f1e361]
                - row [ref=f1e366] [cursor=pointer]:
                  - cell "21 Aug 2026, 5:30 pm" [ref=f1e367]
                  - cell "JC-2026-002112" [ref=f1e368]
                  - cell "INV-2026-00112" [ref=f1e369]
                  - cell "Demo Customer 112" [ref=f1e370]
                  - cell "7080" [ref=f1e371]
                  - cell "Cleared" [ref=f1e372]
                  - cell [ref=f1e373]:
                    - generic [ref=f1e374]:
                      - button "View" [ref=f1e375]
                      - button "Download" [ref=f1e379]
                      - button "Print" [ref=f1e383]
                - row [ref=f1e388] [cursor=pointer]:
                  - cell "20 Aug 2026, 3:30 pm" [ref=f1e389]
                  - cell "JC-2026-002128" [ref=f1e390]
                  - cell "INV-2026-00128" [ref=f1e391]
                  - cell "Demo Customer 008" [ref=f1e392]
                  - cell "10620" [ref=f1e393]
                  - cell "Cleared" [ref=f1e394]
                  - cell [ref=f1e395]:
                    - generic [ref=f1e396]:
                      - button "View" [ref=f1e397]
                      - button "Download" [ref=f1e401]
                      - button "Print" [ref=f1e405]
                - row [ref=f1e410] [cursor=pointer]:
                  - cell "19 Aug 2026, 1:30 pm" [ref=f1e411]
                  - cell "JC-2026-002144" [ref=f1e412]
                  - cell "INV-2026-00144" [ref=f1e413]
                  - cell "Demo Customer 012" [ref=f1e414]
                  - cell "3540" [ref=f1e415]
                  - cell "Cleared" [ref=f1e416]
                  - cell [ref=f1e417]:
                    - generic [ref=f1e418]:
                      - button "View" [ref=f1e419]
                      - button "Download" [ref=f1e423]
                      - button "Print" [ref=f1e427]
            - navigation "Results pagination" [ref=f1e432]:
              - button "First page" [disabled] [ref=f1e433]
              - button "Previous page" [disabled] [ref=f1e436]
              - generic [ref=f1e439]:
                - button "Page 1" [ref=f1e440] [cursor=pointer]: "1"
                - button "Page 2" [ref=f1e441] [cursor=pointer]: "2"
                - button "Page 3" [ref=f1e442] [cursor=pointer]: "3"
                - button "Page 4" [ref=f1e443] [cursor=pointer]: "4"
                - button "Page 5" [ref=f1e444] [cursor=pointer]: "5"
                - button "Page 6" [ref=f1e445] [cursor=pointer]: "6"
              - button "Next page" [ref=f1e446] [cursor=pointer]
              - button "Last page" [ref=f1e449] [cursor=pointer]
```

# Test source

```ts
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
> 1122 |   await invoiceManager.getByRole("button", { name: "Void Invoice" }).click();
       |                                                                      ^ Error: locator.click: Test timeout of 30000ms exceeded.
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
  1155 |   await createInvoice.getByLabel("Tally invoice number").fill("TLY-JOB-CARD");
  1156 |   await createInvoice.getByLabel("Invoice item 1 quantity").fill("2");
  1157 |   await createInvoice.getByLabel("Invoice discount").fill("50");
  1158 |   await expect(createInvoice.getByLabel("Invoice totals")).toContainText("Total");
  1159 |   await createInvoice.getByLabel("Notes").fill("Created from job card");
  1160 |   await createInvoice.getByRole("button", { name: "Save Invoice" }).click();
  1161 |   await expect(createInvoice).toBeHidden();
  1162 |   await expect(jobDialog).toBeVisible();
  1163 |   await expect(invoiceRow.getByRole("button", { name: "Create Invoice" })).toHaveCount(0);
  1164 |   await expect(invoiceRow.getByRole("button", { name: "Edit", exact: true })).toBeVisible();
  1165 | 
  1166 |   await invoiceRow.getByRole("button", { name: "Edit", exact: true }).click();
  1167 |   const editInvoice = page.getByRole("dialog", { name: "Edit Invoice" });
  1168 |   await expect(editInvoice).toHaveClass(/dialog-document-editor/);
  1169 |   await editInvoice.getByLabel("Notes").fill("Edited from job card");
  1170 |   await editInvoice.getByRole("button", { name: "Update Invoice" }).click();
  1171 |   await expect(editInvoice).toBeHidden();
  1172 |   const pdfPromise = page.waitForEvent("download");
  1173 |   await invoiceRow.first().getByRole("button", { name: "Download PDF" }).click();
  1174 |   expect((await pdfPromise).suggestedFilename()).toMatch(/-invoice\.pdf$/);
  1175 |   // the voided invoice stays listed with a frozen copy
  1176 |   await expect(jobDialog.locator(".document-row").filter({ hasText: "void (frozen copy)" })).toHaveCount(1);
  1177 | 
  1178 |   // Record Payment (mode + reference) creates the Receipt and clears the invoice without closing the job; void reopens it.
  1179 |   await jobDialog.getByRole("tab", { name: "Payment" }).click();
  1180 |   const paymentPanel = jobDialog.getByRole("region", { name: "Job payment" });
  1181 |   await paymentPanel.getByLabel("Payment mode").selectOption("UPI");
  1182 |   await paymentPanel.getByLabel("Payment reference").fill("E2E-UPI-1");
  1183 |   await paymentPanel.getByRole("button", { name: "Confirm Payment" }).click();
  1184 |   await expect(paymentPanel.getByRole("table", { name: "Payment", exact: true })).toContainText("E2E-UPI-1");
  1185 |   await expect(paymentPanel.getByRole("table", { name: "Payment", exact: true })).toContainText("RCT-");
  1186 |   await expect(paymentPanel).toContainText("Cleared");
  1187 |   await paymentPanel.getByRole("button", { name: "Void Payment" }).click();
  1188 |   const voidPayment = page.getByRole("dialog", { name: "Void Payment?" });
  1189 |   await voidPayment.getByLabel("Reason").fill("E2E correction");
  1190 |   await voidPayment.getByRole("button", { name: "Void" }).click();
  1191 | });
  1192 | 
  1193 | test("customer and vehicle records use distinct view and edit dialogs on every list surface", async ({ page }) => {
  1194 |   await loginAs(page, "admin@example.com");
  1195 | 
  1196 |   await page.locator(".role-nav").getByRole("button", { name: "Search", exact: true }).click();
  1197 |   await page.getByLabel("Search category").selectOption("customer");
  1198 |   const customerCard = page.locator(".record-card").first();
  1199 |   await customerCard.getByRole("button", { name: "View", exact: true }).click();
  1200 |   const customerView = page.getByRole("dialog", { name: "View Customer" });
  1201 |   await expect(customerView).toBeVisible();
  1202 |   await expect(customerView.getByRole("button", { name: "Save Customer" })).toHaveCount(0);
  1203 |   await page.keyboard.press("Escape");
  1204 |   await customerCard.getByRole("button", { name: "Edit", exact: true }).click();
  1205 |   await page.getByRole("dialog", { name: "Edit Customer" }).getByRole("button", { name: "Save Customer" }).click();
  1206 |   await expect(page.getByRole("dialog", { name: "Edit Customer" })).toBeHidden();
  1207 | 
  1208 |   await page.getByLabel("Search category").selectOption("vehicle");
  1209 |   await page.getByRole("button", { name: "Table", exact: true }).click();
  1210 |   const vehicleRow = page.locator(".table-wrap tbody tr").first();
  1211 |   await vehicleRow.getByRole("button", { name: "View", exact: true }).click();
  1212 |   const vehicleView = page.getByRole("dialog", { name: "View Vehicle" });
  1213 |   await expect(vehicleView.getByText("Owner", { exact: true })).toBeVisible();
  1214 |   await expect(vehicleView.getByRole("button", { name: "Save Vehicle" })).toHaveCount(0);
  1215 |   await page.getByRole("button", { name: "Go Back" }).click();
  1216 |   await vehicleRow.getByRole("button", { name: "Edit", exact: true }).click();
  1217 |   await page.getByRole("dialog", { name: "Edit Vehicle" }).getByRole("button", { name: "Save Vehicle" }).click();
  1218 | 
  1219 |   await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  1220 |   for (const tab of ["Customers", "Vehicles"] as const) {
  1221 |     await page.getByRole("tab", { name: tab, exact: true }).click();
  1222 |     const record = page.getByRole("tabpanel").locator(".management-table tbody tr").first();
```