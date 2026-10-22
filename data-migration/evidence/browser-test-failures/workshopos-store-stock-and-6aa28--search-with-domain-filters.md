# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workshopos.spec.ts >> store stock and material requests combine search with domain filters
- Location: tests\workshopos.spec.ts:1506:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Showing 1 to 10 of 61')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('Showing 1 to 10 of 61') with timeout 5000ms
  - waiting for getByText('Showing 1 to 10 of 61')

```

```yaml
- complementary:
  - strong: WorkshopOS
  - text: Workshop Management. Simplified.
  - button "Hide left menu"
  - text: Store
  - navigation "Store menu":
    - button "Material Requests"
    - button "Issue Material"
    - button "Reconcile"
    - button "Stock"
    - button "Purchase Orders"
    - button "Search"
  - button "Logout"
- main:
  - paragraph: Store
  - heading "Issue counter for accountable material movement." [level=1]
  - text: store@example.com
  - heading "Stock" [level=2]
  - paragraph: Inventory levels, low-stock attention and movement history
  - tablist "Stock views":
    - tab "Inventory List" [selected]
    - tab "Low Stock"
    - tab "Stock Movements"
  - strong: "4"
  - text: Total SKUs
  - strong: "642"
  - text: Total Units
  - strong: "1"
  - text: Low Stock
  - strong: "0"
  - text: Out of Stock
  - heading "Stock" [level=2]
  - paragraph: Search, filter and export the current list
  - text: Search
  - textbox "Search stock":
    - /placeholder: SKU, item, category or unit
  - text: Category
  - combobox "Stock category":
    - option "All categories"
    - option "33"
    - option "Detailing"
    - option "PPF" [selected]
    - option "Paint"
  - text: Stock status
  - combobox "Stock status":
    - option "All stock" [selected]
    - option "Low stock"
    - option "In stock"
  - text: Unit
  - combobox "Stock unit":
    - option "All units" [selected]
    - option "4"
    - option "litre"
    - option "metre"
  - group "Search actions":
    - button "Clear"
  - button "Download"
  - text: Showing 1 to 1 of 1 Per page
  - combobox "Stock records per page":
    - option "10" [selected]
    - option "20"
    - option "50"
  - navigation "Results pagination":
    - button "First page" [disabled]
    - button "Previous page" [disabled]
    - button "Page 1": "1"
    - button "Next page" [disabled]
    - button "Last page" [disabled]
  - table "Stock results":
    - rowgroup:
      - row "SKU Item Category Stock Minimum Sell Price Status Action":
        - columnheader "SKU"
        - columnheader "Item"
        - columnheader "Category"
        - columnheader "Stock"
        - columnheader "Minimum"
        - columnheader "Sell Price"
        - columnheader "Status"
        - columnheader "Action"
    - rowgroup:
      - row "PPF-ROLL Gloss PPF roll PPF 500 metre 40 Rs 0 In stock Edit":
        - cell "PPF-ROLL"
        - cell "Gloss PPF roll"
        - cell "PPF"
        - cell "500 metre"
        - cell "40"
        - cell "Rs 0"
        - cell "In stock"
        - cell "Edit":
          - button "Edit"
  - navigation "Results pagination":
    - button "First page" [disabled]
    - button "Previous page" [disabled]
    - button "Page 1": "1"
    - button "Next page" [disabled]
    - button "Last page" [disabled]
```

# Test source

```ts
  1410 |   await expect(paymentRecordRows).toHaveCount(1);
  1411 |   await paymentsManager.getByRole("button", { name: "Clear", exact: true }).click();
  1412 |   await expect(paymentRecordRows).toHaveCount(paymentRecordCount);
  1413 |   await paymentModeFilter.selectOption(paidMode);
  1414 |   await expect(paymentRecordRows).not.toHaveCount(0);
  1415 |   expect(await paymentRecordRows.locator("td:nth-child(6)").allTextContents()).toEqual(expect.arrayContaining([paidMode]));
  1416 |   expect((await paymentRecordRows.locator("td:nth-child(6)").allTextContents()).every((mode) => mode.trim() === paidMode)).toBe(true);
  1417 |   await paymentsManager.getByRole("button", { name: "Clear", exact: true }).click();
  1418 |   await expect(paymentModeFilter).toHaveValue("ALL");
  1419 |   await paymentsManager.getByRole("button", { name: "Clear", exact: true }).click();
  1420 |   await page.locator(".role-nav").getByRole("button", { name: "Delivery", exact: true }).click();
  1421 |   const deliveryManager = page.locator('[data-billing-manager="Delivery"]');
  1422 |   const deliveryTable = page.getByRole("table", { name: "Delivery manager" });
  1423 |   const deliveryMonthFilter = page.getByLabel("Delivery Month-Year filter");
  1424 |   await expect(page.getByLabel("Delivery status filter")).toHaveCount(0);
  1425 |   await expect(deliveryMonthFilter).toBeVisible();
  1426 |   await expect(deliveryManager.locator('input[type="date"]')).toHaveCount(0);
  1427 |   await expect(deliveryManager.getByRole("button", { name: "Clear", exact: true })).toBeVisible();
  1428 |   const deliveryRows = deliveryTable.locator("tbody tr");
  1429 |   const deliveryRecordCount = await deliveryRows.count();
  1430 |   const deliveryRow = deliveryRows.filter({ hasText: "Pending" }).first();
  1431 |   await expect(deliveryRow).toContainText("GP-");
  1432 |   await expect(deliveryRow).toContainText("Pending");
  1433 |   const deliveryJob = (await deliveryRow.locator("td").nth(1).textContent())!.trim();
  1434 |   await page.getByLabel("Search delivery").fill(deliveryJob);
  1435 |   await expect(deliveryRows).toHaveCount(1);
  1436 |   await deliveryManager.getByRole("button", { name: "Clear", exact: true }).click();
  1437 |   await expect(deliveryRows).toHaveCount(deliveryRecordCount);
  1438 |   const deliveryMonth = await deliveryMonthFilter.locator("option").nth(1).getAttribute("value");
  1439 |   await deliveryMonthFilter.selectOption(deliveryMonth!);
  1440 |   await expect(deliveryRows).not.toHaveCount(0);
  1441 |   await deliveryManager.getByRole("button", { name: "Clear", exact: true }).click();
  1442 |   await expect(deliveryMonthFilter).toHaveValue("ALL");
  1443 | });
  1444 | 
  1445 | test("Manage Job Cards uses view and edit dialogs with documents and confirmed archive", async ({ page }) => {
  1446 |   await loginAs(page, "admin@example.com");
  1447 |   await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  1448 |   await page.getByRole("tab", { name: "Job Cards", exact: true }).click();
  1449 | 
  1450 |   await page.getByRole("button", { name: "Add Job Card", exact: true }).click();
  1451 |   await expect(page.getByRole("dialog", { name: "Add Job Card" })).toBeVisible();
  1452 |   await page.getByRole("button", { name: "Go Back" }).click();
  1453 |   await expect(page.getByRole("dialog", { name: "Add Job Card" })).toBeHidden();
  1454 | 
  1455 |   const table = page.getByRole("table", { name: "Managed job cards" });
  1456 |   const firstRow = table.locator("tbody tr").filter({ hasText: "JC-2026-002144" });
  1457 |   await expect(table.locator("thead th")).toHaveText(["Job Card", "Vehicle", "Customer", "Estimated Delivery Date", "Status", "Actions"]);
  1458 |   await expect(firstRow.getByRole("button", { name: "View", exact: true })).toBeVisible();
  1459 |   await expect(firstRow.getByRole("button", { name: "Edit", exact: true })).toBeVisible();
  1460 | 
  1461 |   await firstRow.getByRole("button", { name: "View", exact: true }).click();
  1462 |   await expect(page.getByRole("dialog", { name: /View Job/ })).toBeVisible();
  1463 |   await page.getByRole("tab", { name: "Documents" }).click();
  1464 |   const pdfPromise = page.waitForEvent("download");
  1465 |   await page.locator(".document-row").filter({ has: page.getByText("Estimate", { exact: true }) }).getByRole("button", { name: "Download PDF" }).click();
  1466 |   expect((await pdfPromise).suggestedFilename()).toMatch(/-estimate\.pdf$/);
  1467 |   await page.getByRole("button", { name: "Go Back" }).click();
  1468 | 
  1469 |   await firstRow.getByRole("button", { name: "Edit", exact: true }).click();
  1470 |   await expect(page.getByRole("button", { name: "Save Job Details" })).toBeVisible();
  1471 |   const archive = page.getByRole("button", { name: "Archive Job", exact: true });
  1472 |   await expect(archive).toBeVisible();
  1473 |   page.once("dialog", (dialog) => dialog.accept());
  1474 |   await archive.click();
  1475 |   await expect(page.getByRole("dialog", { name: /Edit Job/ })).toBeHidden();
  1476 | });
  1477 | 
  1478 | test("admin receives readable duplicate user validation", async ({ page }) => {
  1479 |   await loginAs(page, "admin@example.com");
  1480 |   await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  1481 |   await page.getByRole("button", { name: "Add User" }).click();
  1482 |   await page.getByLabel("User name").fill("Duplicate Admin");
  1483 |   await page.getByLabel("User email").fill("ADMIN@example.com");
  1484 |   await page.getByLabel("User role").selectOption("admin");
  1485 |   await page.getByLabel("User password").fill("secure123");
  1486 |   page.once("dialog", async (dialog) => {
  1487 |     expect(dialog.message()).toBe("A user with this email already exists.");
  1488 |     await dialog.accept();
  1489 |   });
  1490 |   await page.getByRole("button", { name: "Save User" }).click();
  1491 |   await expect(page.getByLabel("User email")).toBeVisible();
  1492 | });
  1493 | 
  1494 | test("contextual create actions remain visible on mobile role screens", async ({ page }) => {
  1495 |   await page.setViewportSize({ width: 390, height: 844 });
  1496 |   await loginAs(page, "reception@example.com");
  1497 |   await page.locator(".role-nav").getByRole("button", { name: "Search", exact: true }).click();
  1498 |   await page.getByLabel("Search category").selectOption("customer");
  1499 |   await page.getByRole("button", { name: "Table", exact: true }).click();
  1500 |   const add = page.getByRole("button", { name: "Add Customer", exact: true });
  1501 |   await expect(add).toBeVisible();
  1502 |   await add.click();
  1503 |   await expect(page.getByLabel("Customer name")).toBeVisible();
  1504 | });
  1505 | 
  1506 | test("store stock and material requests combine search with domain filters", async ({ page }) => {
  1507 |   await loginAs(page, "store@example.com");
  1508 |   await page.locator(".role-nav").getByRole("button", { name: "Stock", exact: true }).click();
  1509 |   await page.getByLabel("Stock category").selectOption("PPF");
> 1510 |   await expect(page.getByText("Showing 1 to 10 of 61")).toBeVisible();
       |                                                         ^ Error: expect(locator).toBeVisible() failed
  1511 |   await page.getByLabel("Stock status").selectOption("LOW");
  1512 |   await expect(page.getByText("No matching records")).toBeVisible();
  1513 |   await page.getByLabel("Stock category").selectOption("Paint");
  1514 |   await expect(page.getByText(/Showing 1 to \d+ of \d+/)).toBeVisible();
  1515 |   await page.getByLabel("Stock status").selectOption("ALL");
  1516 |   await page.getByLabel("Stock category").selectOption("PPF");
  1517 |   await page.getByLabel("Search stock").fill("70%VLT Nano Ceramic");
  1518 |   await expect(page.getByRole("table", { name: "Stock results" }).locator("tbody tr")).toHaveCount(1);
  1519 |   await expect(page.getByText("70%VLT Nano Ceramic Film (UG)")).toBeVisible();
  1520 |   await page.getByLabel("Search stock").fill("no-such-stock-item");
  1521 |   await expect(page.getByText("No matching records")).toBeVisible();
  1522 |   const emptyStateClear = page.locator(".list-empty").getByRole("button", { name: "Clear filters" });
  1523 |   await expect(emptyStateClear).toHaveClass(/filter-clear-action/);
  1524 |   await emptyStateClear.click();
  1525 |   await expect(page.getByText("Showing 1 to 10 of 127")).toBeVisible();
  1526 | 
  1527 |   await page.locator(".role-nav").getByRole("button", { name: "Material Requests", exact: true }).click();
  1528 |   await page.getByLabel("Status").selectOption("Pending");
  1529 |   await expect(page.getByRole("table", { name: "Material Requests results" }).locator("tbody tr")).toHaveCount(1);
  1530 |   await page.getByLabel("Item").fill("nano");
  1531 |   await page.getByRole("option", { name: /70%VLT Nano Ceramic Film/ }).click();
  1532 |   await expect(page.getByRole("table", { name: "Material Requests results" }).getByRole("cell", { name: "JC-2026-001246" })).toBeVisible();
  1533 | });
  1534 | 
  1535 | test("stock filter toolbars use no more than two rows above mobile", async ({ page }) => {
  1536 |   await loginAs(page, "store@example.com");
  1537 |   await page.locator(".role-nav").getByRole("button", { name: "Stock", exact: true }).click();
  1538 | 
  1539 |   for (const viewport of [{ width: 1440, height: 900 }, { width: 900, height: 900 }]) {
  1540 |     await page.setViewportSize(viewport);
  1541 |     for (const tab of ["Inventory List", "Low Stock", "Stock Movements"]) {
  1542 |       await page.getByRole("tab", { name: tab, exact: true }).click();
  1543 |       await expectStockToolbarHasAtMostTwoRows(page);
  1544 |     }
  1545 |   }
  1546 | 
  1547 |   await page.setViewportSize({ width: 390, height: 844 });
  1548 |   await page.getByRole("tab", { name: "Inventory List", exact: true }).click();
  1549 |   await expectNoPageOverflow(page);
  1550 |   await page.getByRole("tab", { name: "Low Stock", exact: true }).click();
  1551 |   await expectNoPageOverflow(page);
  1552 |   await page.getByRole("tab", { name: "Stock Movements", exact: true }).click();
  1553 |   await expectNoPageOverflow(page);
  1554 | });
  1555 | 
  1556 | test("Store cannot bypass the Purchase Order workflow with direct Stock Inward", async ({ page }) => {
  1557 |   await loginAs(page, "store@example.com");
  1558 |   await page.locator(".role-nav").getByRole("button", { name: "Stock", exact: true }).click();
  1559 |   const stockTable = page.getByRole("table", { name: "Stock results" });
  1560 |   await expect(stockTable.getByRole("columnheader", { name: "Unit", exact: true })).toHaveCount(0);
  1561 |   await expect(stockTable.locator("tbody tr").first().locator("td").nth(3)).toHaveText(/\S+\s+\S+/);
  1562 |   await expect(page.locator(".stock-main-grid")).toHaveCount(0);
  1563 |   await expect(page.getByRole("button", { name: "Quick Add Stock", exact: true })).toHaveCount(0);
  1564 |   await expect(page.getByRole("dialog", { name: "Quick Add Stock" })).toHaveCount(0);
  1565 | });
  1566 | 
  1567 | test("Materials Requests triage issueable, shortage, and New Item demand into Purchase Requests", async ({ page }) => {
  1568 |   await loginAs(page, "store@example.com");
  1569 |   await page.locator(".role-nav").getByRole("button", { name: "Material Requests", exact: true }).click();
  1570 |   const triage = page.getByRole("region", { name: "Material procurement triage" });
  1571 |   await expect(triage.getByRole("heading", { name: "Available to issue" })).toBeVisible();
  1572 |   await expect(triage.getByRole("heading", { name: "Existing-SKU procurement" })).toBeVisible();
  1573 |   await expect(triage.getByRole("heading", { name: "New Item Requests" })).toBeVisible();
  1574 |   await expect(triage.getByRole("button", { name: "Create Purchase Request" })).toBeDisabled();
  1575 |   await triage.getByRole("button", { name: "Create New Item Request" }).click();
  1576 |   await expect(page.getByRole("heading", { name: "Purchase Orders", exact: true })).toBeVisible();
  1577 |   const purchaseRequest = page.getByRole("dialog", { name: "New Purchase Request" });
  1578 |   await expect(purchaseRequest).toBeVisible();
  1579 |   await expect(purchaseRequest.getByLabel("Item type")).toHaveValue("new");
  1580 | });
  1581 | 
  1582 | test("issue and reconcile lists filter by item and reconciliation state", async ({ page }) => {
  1583 |   await loginAs(page, "store@example.com");
  1584 |   await page.locator(".role-nav").getByRole("button", { name: "Issue Material", exact: true }).click();
  1585 |   await page.getByLabel("Item").fill("nano");
  1586 |   await page.getByRole("option", { name: /70%VLT Nano Ceramic Film/ }).click();
  1587 |   await expect(page.getByRole("table", { name: "Issue Material results" }).locator("tbody tr")).toHaveCount(1);
  1588 | 
  1589 |   await page.locator(".role-nav").getByRole("button", { name: "Reconcile", exact: true }).click();
  1590 |   await page.getByLabel("Reconciliation state").selectOption("Matched");
  1591 |   await expect(page.getByRole("table", { name: "Reconcile results" }).locator("tbody tr")).toHaveCount(2);
  1592 |   await page.getByLabel("Reconciliation state").selectOption("Open");
  1593 |   await expect(page.getByRole("table", { name: "Reconcile results" }).locator("tbody tr")).toHaveCount(0);
  1594 |   await expect(page.getByText("No matching records")).toBeVisible();
  1595 | });
  1596 | 
  1597 | test("material record queues use compact rows and issue actions do not open their row", async ({ page }) => {
  1598 |   await loginAs(page, "store@example.com");
  1599 | 
  1600 |   for (const pageName of ["Material Requests", "Issue Material"] as const) {
  1601 |     await page.locator(".role-nav").getByRole("button", { name: pageName, exact: true }).click();
  1602 |     const table = page.getByRole("table", { name: `${pageName} results` });
  1603 |     await expect(table).toHaveClass(/store-material-record-table/);
  1604 |     await expect(table.locator("tbody tr").first().locator("td").first()).toHaveCSS("padding-top", "7px");
  1605 |     await expect(table.locator(".store-material-status").first()).toHaveCSS("min-height", "24px");
  1606 |   }
  1607 | 
  1608 |   const issueTable = page.getByRole("table", { name: "Issue Material results" });
  1609 |   const issueAction = issueTable.getByRole("button", { name: "Issue Material", exact: true }).first();
  1610 |   const approvalAction = issueTable.getByRole("button", { name: "Needs Approval", exact: true }).first();
```