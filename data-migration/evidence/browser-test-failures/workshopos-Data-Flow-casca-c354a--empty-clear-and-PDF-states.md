# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workshopos.spec.ts >> Data Flow cascades visit filters and supports keyboard, mouse, empty, clear, and PDF states
- Location: tests\workshopos.spec.ts:1232:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('option', { name: /JC-2026-001245/ })

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
      - generic [ref=f1e91]:
        - heading "Data Flow" [level=2] [ref=f1e92]
        - paragraph [ref=f1e93]: Select a job
      - generic [ref=f1e94]:
        - generic [ref=f1e95]:
          - text: Visit month
          - combobox "Visit month" [ref=f1e96]:
            - option "All months" [selected]
            - option "October 2026"
            - option "August 2026"
            - option "July 2026"
            - option "June 2026"
            - option "May 2026"
            - option "April 2026"
            - option "March 2026"
            - option "February 2026"
            - option "January 2026"
        - generic [ref=f1e97]:
          - text: Visit date
          - combobox "Visit date" [ref=f1e98]:
            - option "All dates" [selected]
            - option "2 Oct 2026"
            - option "27 Aug 2026"
            - option "26 Aug 2026"
            - option "25 Aug 2026"
            - option "24 Aug 2026"
            - option "23 Aug 2026"
            - option "22 Aug 2026"
            - option "21 Aug 2026"
            - option "20 Aug 2026"
            - option "19 Aug 2026"
            - option "14 Aug 2026"
            - option "13 Aug 2026"
            - option "12 Aug 2026"
            - option "11 Aug 2026"
            - option "10 Aug 2026"
            - option "9 Aug 2026"
            - option "8 Aug 2026"
            - option "7 Aug 2026"
            - option "6 Aug 2026"
            - option "22 Jul 2026"
            - option "21 Jul 2026"
            - option "20 Jul 2026"
            - option "19 Jul 2026"
            - option "18 Jul 2026"
            - option "17 Jul 2026"
            - option "16 Jul 2026"
            - option "15 Jul 2026"
            - option "14 Jul 2026"
            - option "9 Jul 2026"
            - option "8 Jul 2026"
            - option "7 Jul 2026"
            - option "6 Jul 2026"
            - option "5 Jul 2026"
            - option "4 Jul 2026"
            - option "3 Jul 2026"
            - option "2 Jul 2026"
            - option "1 Jul 2026"
            - option "27 Jun 2026"
            - option "26 Jun 2026"
            - option "25 Jun 2026"
            - option "24 Jun 2026"
            - option "23 Jun 2026"
            - option "17 Jun 2026"
            - option "16 Jun 2026"
            - option "15 Jun 2026"
            - option "14 Jun 2026"
            - option "13 Jun 2026"
            - option "12 Jun 2026"
            - option "11 Jun 2026"
            - option "10 Jun 2026"
            - option "9 Jun 2026"
            - option "4 Jun 2026"
            - option "3 Jun 2026"
            - option "2 Jun 2026"
            - option "1 Jun 2026"
            - option "26 May 2026"
            - option "25 May 2026"
            - option "24 May 2026"
            - option "23 May 2026"
            - option "22 May 2026"
            - option "21 May 2026"
            - option "20 May 2026"
            - option "19 May 2026"
            - option "18 May 2026"
            - option "12 May 2026"
            - option "11 May 2026"
            - option "10 May 2026"
            - option "9 May 2026"
            - option "8 May 2026"
            - option "7 May 2026"
            - option "6 May 2026"
            - option "5 May 2026"
            - option "4 May 2026"
            - option "27 Apr 2026"
            - option "26 Apr 2026"
            - option "21 Apr 2026"
            - option "20 Apr 2026"
            - option "19 Apr 2026"
            - option "18 Apr 2026"
            - option "17 Apr 2026"
            - option "16 Apr 2026"
            - option "15 Apr 2026"
            - option "14 Apr 2026"
            - option "13 Apr 2026"
            - option "7 Apr 2026"
            - option "6 Apr 2026"
            - option "5 Apr 2026"
            - option "4 Apr 2026"
            - option "3 Apr 2026"
            - option "2 Apr 2026"
            - option "1 Apr 2026"
            - option "27 Mar 2026"
            - option "26 Mar 2026"
            - option "25 Mar 2026"
            - option "24 Mar 2026"
            - option "23 Mar 2026"
            - option "22 Mar 2026"
            - option "21 Mar 2026"
            - option "16 Mar 2026"
            - option "15 Mar 2026"
            - option "14 Mar 2026"
            - option "13 Mar 2026"
            - option "12 Mar 2026"
            - option "11 Mar 2026"
            - option "10 Mar 2026"
            - option "9 Mar 2026"
            - option "8 Mar 2026"
            - option "2 Mar 2026"
            - option "1 Mar 2026"
            - option "24 Feb 2026"
            - option "23 Feb 2026"
            - option "22 Feb 2026"
            - option "21 Feb 2026"
            - option "20 Feb 2026"
            - option "19 Feb 2026"
            - option "18 Feb 2026"
            - option "17 Feb 2026"
            - option "16 Feb 2026"
            - option "11 Feb 2026"
            - option "10 Feb 2026"
            - option "9 Feb 2026"
            - option "8 Feb 2026"
            - option "7 Feb 2026"
            - option "6 Feb 2026"
            - option "5 Feb 2026"
            - option "4 Feb 2026"
            - option "3 Feb 2026"
            - option "27 Jan 2026"
            - option "26 Jan 2026"
            - option "25 Jan 2026"
            - option "19 Jan 2026"
            - option "18 Jan 2026"
            - option "17 Jan 2026"
            - option "16 Jan 2026"
            - option "15 Jan 2026"
            - option "14 Jan 2026"
            - option "13 Jan 2026"
            - option "12 Jan 2026"
            - option "11 Jan 2026"
            - option "6 Jan 2026"
            - option "5 Jan 2026"
            - option "4 Jan 2026"
            - option "3 Jan 2026"
            - option "2 Jan 2026"
            - option "1 Jan 2026"
        - generic [ref=f1e99]:
          - generic [ref=f1e100]: Find a job
          - combobox "Find a job" [expanded] [active] [ref=f1e101]: OD02AB1234
          - listbox "Matching jobs" [ref=f1e102]:
            - status [ref=f1e103]: No matching jobs
        - button "Clear" [ref=f1e104] [cursor=pointer]
      - generic [ref=f1e105]: Select a job to view its data flow.
```

# Test source

```ts
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
  1223 |     await record.getByRole("button", { name: "View", exact: true }).click();
  1224 |     await expect(page.getByRole("dialog", { name: `View ${tab.slice(0, -1)}` })).toBeVisible();
  1225 |     await page.getByRole("button", { name: "Go Back" }).click();
  1226 |     await record.getByRole("button", { name: "Edit", exact: true }).click();
  1227 |     await expect(page.getByRole("dialog", { name: `Edit ${tab.slice(0, -1)}` })).toBeVisible();
  1228 |     await page.keyboard.press("Escape");
  1229 |   }
  1230 | });
  1231 | 
  1232 | test("Data Flow cascades visit filters and supports keyboard, mouse, empty, clear, and PDF states", async ({ page }) => {
  1233 |   await loginAs(page, "admin@example.com");
  1234 |   await page.locator(".role-nav").getByRole("button", { name: "Data Flow", exact: true }).click();
  1235 |   const jobSearch = page.getByRole("combobox", { name: "Find a job" });
  1236 |   await expect(jobSearch).toHaveValue("");
  1237 |   await expect(page.getByText("Select a job to view its data flow.")).toBeVisible();
  1238 | 
  1239 |   const dateValue = await page.getByLabel("Visit date").locator("option").nth(1).getAttribute("value");
  1240 |   expect(dateValue).toBeTruthy();
  1241 |   await page.getByLabel("Visit date").selectOption(dateValue!);
  1242 |   await expect(page.getByLabel("Visit month")).toHaveValue(dateValue!.slice(0, 7));
  1243 |   await page.getByLabel("Visit month").selectOption("");
  1244 |   await expect(page.getByLabel("Visit date")).toHaveValue("");
  1245 | 
  1246 |   await page.getByRole("button", { name: "Clear", exact: true }).click();
  1247 |   await expect(page.getByLabel("Visit date")).toHaveValue("");
  1248 |   await jobSearch.focus();
  1249 |   await page.keyboard.press("ArrowDown");
  1250 |   await page.keyboard.press("Enter");
  1251 |   await expect(page.locator(".data-flow-line .timeline-event").first()).toBeVisible();
  1252 |   await expect(page.locator(".data-flow-line .timeline-event.latest")).toHaveCount(1);
  1253 |   await expect(page.getByRole("region", { name: "Active lifecycle stage" })).toHaveCount(0);
  1254 |   await expect(page.getByRole("separator", { name: "Not yet" })).toBeVisible();
  1255 |   await expect(page.locator(".data-flow-line .timeline-event.ghost").first()).toBeVisible();
  1256 |   const timeline = page.getByRole("region", { name: "Chronological data flow" });
  1257 |   await expect(timeline).toBeVisible();
  1258 |   await expect(timeline).toContainText("Vehicle visit received");
  1259 |   await expect(timeline).toContainText(/checklist started|Status changed/);
  1260 |   const timelineTimes = await timeline.locator("time").evaluateAll((nodes) => nodes.map((node) => node.getAttribute("datetime") ?? ""));
  1261 |   expect(timelineTimes).toEqual([...timelineTimes].sort((left, right) => new Date(left).getTime() - new Date(right).getTime()));
  1262 | 
  1263 |   await jobSearch.fill("nothing-can-match-this");
  1264 |   await expect(page.getByText("No matching jobs")).toBeVisible();
  1265 |   await expect(page.getByText("Select a job to view its data flow.")).toBeVisible();
  1266 |   await page.keyboard.press("Escape");
  1267 |   await expect(jobSearch).toHaveAttribute("aria-expanded", "false");
  1268 | 
  1269 |   const dataFlowClear = page.locator(".data-flow-filters").getByRole("button", { name: "Clear", exact: true });
  1270 |   await expect(dataFlowClear).toHaveClass(/filter-clear-action/);
  1271 |   await dataFlowClear.click();
  1272 |   await jobSearch.fill("OD02AB1234");
> 1273 |   await page.getByRole("option", { name: /JC-2026-001245/ }).click();
       |                                                              ^ Error: locator.click: Test timeout of 30000ms exceeded.
  1274 |   const pdfPromise = page.waitForEvent("download");
  1275 |   const pdfButton = page.locator(".data-flow-line .timeline-event").filter({ hasText: "Estimate created" }).locator("button.document-download");
  1276 |   await pdfButton.click();
  1277 |   await expect(pdfButton).toHaveText(/Preparing/);
  1278 |   expect((await pdfPromise).suggestedFilename()).toBe("JC-2026-001245-estimate.pdf");
  1279 | 
  1280 |   await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  1281 |   await page.getByRole("tab", { name: "Estimates", exact: true }).click();
  1282 |   await expect(page.getByRole("searchbox", { name: "Job for Estimates search" })).toBeVisible();
  1283 |   await page.locator(".role-nav").getByRole("button", { name: "Data Flow", exact: true }).click();
  1284 |   await expect(page.getByRole("combobox", { name: "Find a job" })).toHaveValue("");
  1285 |   await expect(page.getByText("Select a job to view its data flow.")).toBeVisible();
  1286 | });
  1287 | 
  1288 | test("Data Flow filters and suggestions stay within a mobile viewport", async ({ page }) => {
  1289 |   await page.setViewportSize({ width: 390, height: 844 });
  1290 |   await loginAs(page, "admin@example.com");
  1291 |   await page.locator(".role-nav").getByRole("button", { name: "Data Flow", exact: true }).click();
  1292 |   const jobSearch = page.getByRole("combobox", { name: "Find a job" });
  1293 |   await jobSearch.fill("OD02");
  1294 |   await expect(page.getByRole("listbox", { name: "Matching jobs" })).toBeVisible();
  1295 |   const overflow = await page.locator(".data-flow-filters").evaluate((element) => ({ right: element.getBoundingClientRect().right, viewport: document.documentElement.clientWidth, bodyScroll: document.body.scrollWidth }));
  1296 |   expect(overflow.right).toBeLessThanOrEqual(overflow.viewport + 1);
  1297 |   expect(overflow.bodyScroll).toBeLessThanOrEqual(overflow.viewport + 1);
  1298 |   await page.keyboard.press("ArrowDown");
  1299 |   await page.keyboard.press("Enter");
  1300 |   await expect(page.locator(".data-flow-line .timeline-event").first()).toBeVisible();
  1301 | });
  1302 | 
  1303 | test("admin management domains expose contextual creation paths", async ({ page }) => {
  1304 |   await loginAs(page, "admin@example.com");
  1305 |   await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  1306 |   for (const tab of ["Users", "Customers", "Vehicles", "Suppliers", "Job Cards", "Estimates", "Invoices", "Payments", "Delivery"]) {
  1307 |     await expect(page.getByRole("tab", { name: tab, exact: true })).toBeVisible();
  1308 |     await page.getByRole("tab", { name: tab, exact: true }).click();
  1309 |     if (["Invoices", "Payments", "Delivery"].includes(tab)) await expect(page.locator(`[data-billing-manager="${tab}"]`)).toBeVisible();
  1310 |     else await expect(page.getByRole("tabpanel").first()).toBeVisible();
  1311 |   }
  1312 |   await page.getByRole("tab", { name: "Customers", exact: true }).click();
  1313 |   await page.getByRole("button", { name: "Add Customer", exact: true }).click();
  1314 |   await expect(page.getByLabel("Customer name")).toBeVisible();
  1315 |   await expect(page.getByRole("button", { name: "Save Customer", exact: true })).toBeVisible();
  1316 | });
  1317 | 
  1318 | test("Accounts billing lists include records received outside today and print colored documents", async ({ page }) => {
  1319 |   await loginAs(page, "admin@example.com");
  1320 |   await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  1321 |   page.once("dialog", (dialog) => dialog.accept());
  1322 |   await page.getByRole("button", { name: "Load Large Demo Dataset" }).click();
  1323 | 
  1324 |   await page.locator(".logout").click();
  1325 |   await loginAs(page, "accounts@example.com");
  1326 | 
  1327 |   for (const [tab, total] of [["Invoice", 51], ["Payment", 27], ["Delivery", 27]] as const) {
  1328 |     await page.locator(".role-nav").getByRole("button", { name: tab, exact: true }).click();
  1329 |     await expect(page.getByText(`Showing 1 to 10 of ${total}`)).toBeVisible();
  1330 |   }
  1331 | 
  1332 |   for (const [tab, manager, heading] of [["Invoice", "Invoices", "TAX INVOICE"], ["Payment", "Payments", "PAYMENT RECEIPT"], ["Delivery", "Delivery", "GATE PASS"]] as const) {
  1333 |     await page.locator(".role-nav").getByRole("button", { name: tab, exact: true }).click();
  1334 |     const table = page.getByRole("table", { name: `${manager} manager` });
  1335 |     const popupPromise = page.waitForEvent("popup");
  1336 |     await table.locator("tbody tr").filter({ has: page.getByRole("button", { name: "Print", exact: true }) }).first().getByRole("button", { name: "Print", exact: true }).click();
  1337 |     const popup = await popupPromise;
  1338 |     await popup.waitForLoadState("domcontentloaded");
  1339 |     await expect(popup.locator("body")).toContainText(heading);
  1340 |     await expect(popup.locator("header")).toHaveCSS("background-color", "rgb(31, 95, 153)");
  1341 |     await expect(popup.locator("th").first()).toHaveCSS("background-color", "rgb(31, 95, 153)");
  1342 |     const printStyles = await popup.locator("style").evaluate((element) => element.textContent ?? "");
  1343 |     expect(printStyles).toContain("print-color-adjust:exact");
  1344 |     expect(printStyles).toContain("-webkit-print-color-adjust:exact");
  1345 |     await popup.close();
  1346 |   }
  1347 | });
  1348 | 
  1349 | test("Manage and Accounts reuse global searchable billing managers with CRUD, filters and pagination", async ({ page }) => {
  1350 |   test.setTimeout(45_000);
  1351 |   await loginAs(page, "admin@example.com");
  1352 |   await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  1353 |   page.once("dialog", (dialog) => dialog.accept());
  1354 |   await page.getByRole("button", { name: "Load Large Demo Dataset" }).click();
  1355 |   await page.getByRole("tab", { name: "Invoices", exact: true }).click();
  1356 |   await expect(page.locator('[data-billing-manager="Invoices"]')).toBeVisible();
  1357 |   await expect(page.getByRole("table", { name: "Invoices manager" })).toBeVisible();
  1358 |   await expect(page.getByText(/Showing 1 to 10 of/)).toBeVisible();
  1359 |   await page.getByLabel("Search invoices").fill("INV-");
  1360 |   await expect(page.getByText(/Showing 1 to .* of/)).toBeVisible();
  1361 |   await page.getByLabel("Invoices status filter").selectOption("Cleared");
  1362 |   await expect(page.getByRole("table", { name: "Invoices manager" }).locator("tbody tr").first()).toContainText("Cleared");
  1363 |   const next = page.getByRole("navigation", { name: "Results pagination" }).first().getByRole("button", { name: "Next page" });
  1364 |   if (await next.isEnabled()) {
  1365 |     await next.click();
  1366 |     await expect(next.locator("..").getByRole("button", { name: "Page 2" })).toHaveAttribute("aria-current", "page");
  1367 |   }
  1368 |   await page.getByRole("table", { name: "Invoices manager" }).locator("tbody tr").first().click();
  1369 |   await expect(page.getByRole("table", { name: "Invoice lines" })).toBeVisible();
  1370 |   await expect(page.getByRole("button", { name: "Edit" })).toHaveCount(0);
  1371 | 
  1372 |   await page.locator(".logout").click();
  1373 |   await loginAs(page, "accounts@example.com");
```