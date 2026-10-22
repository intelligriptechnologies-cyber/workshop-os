# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workshopos.spec.ts >> material record queues use compact rows and issue actions do not open their row
- Location: tests\workshopos.spec.ts:1597:1

# Error details

```
Error: expect(locator).toHaveClass(expected) failed

Locator: getByRole('table', { name: 'Material Requests results' })
Expected pattern: /store-material-record-table/
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toHaveClass" getByRole('table', { name: 'Material Requests results' }) with timeout 5000ms
  - waiting for getByRole('table', { name: 'Material Requests results' })

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
  - region "Material procurement triage":
    - paragraph: Materials Request
    - heading "Material procurement triage" [level=2]
    - paragraph: Choose the next safe action for each demand. Procurement starts only as a Purchase Request.
    - article:
      - heading "Available to issue" [level=3]
      - strong: "8"
      - paragraph: Existing SKUs have enough stock for their outstanding requested quantity.
      - button "Open Issue Material"
    - article:
      - heading "Existing-SKU procurement" [level=3]
      - strong: "0"
      - paragraph: Existing SKUs are short. Create a Purchase Request; do not add stock directly.
      - button "Create Purchase Request" [disabled]
    - article:
      - heading "New Item Requests" [level=3]
      - strong: "0"
      - paragraph: New Item Requests are the uncatalogued lines already recorded on open Purchase Requests.
      - button "Create New Item Request"
  - heading "Material Requests" [level=2]
  - paragraph: Search, filter and export the current list
  - text: Date
  - textbox "Material Requests record date": 2026-10-21
  - text: Month-Year
  - combobox "Material Requests record month":
    - option "All months" [selected]
    - option "August 2026"
    - option "July 2026"
    - option "June 2026"
    - option "May 2026"
    - option "April 2026"
    - option "March 2026"
    - option "February 2026"
    - option "January 2026"
  - text: Status
  - combobox "Status":
    - option "All states" [selected]
    - option "Pending"
    - option "Partially issued"
    - option "Issued"
    - option "Reconciled"
  - text: Item
  - combobox "Item": All items
  - group "Search actions":
    - button "Clear"
  - button "Download" [disabled]
  - text: Showing 0 to 0 of 0 Per page
  - combobox "Material Requests records per page":
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
  - group: Procurement and issue workflow
```

# Test source

```ts
  1503 |   await expect(page.getByLabel("Customer name")).toBeVisible();
  1504 | });
  1505 | 
  1506 | test("store stock and material requests combine search with domain filters", async ({ page }) => {
  1507 |   await loginAs(page, "store@example.com");
  1508 |   await page.locator(".role-nav").getByRole("button", { name: "Stock", exact: true }).click();
  1509 |   await page.getByLabel("Stock category").selectOption("PPF");
  1510 |   await expect(page.getByText("Showing 1 to 10 of 61")).toBeVisible();
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
> 1603 |     await expect(table).toHaveClass(/store-material-record-table/);
       |                         ^ Error: expect(locator).toHaveClass(expected) failed
  1604 |     await expect(table.locator("tbody tr").first().locator("td").first()).toHaveCSS("padding-top", "7px");
  1605 |     await expect(table.locator(".store-material-status").first()).toHaveCSS("min-height", "24px");
  1606 |   }
  1607 | 
  1608 |   const issueTable = page.getByRole("table", { name: "Issue Material results" });
  1609 |   const issueAction = issueTable.getByRole("button", { name: "Issue Material", exact: true }).first();
  1610 |   const approvalAction = issueTable.getByRole("button", { name: "Needs Approval", exact: true }).first();
  1611 |   await expect(issueAction).toHaveClass(/action-primary/);
  1612 |   await expect(approvalAction).toHaveClass(/action-secondary/);
  1613 |   await expect(issueAction).toHaveCSS("min-height", "30px");
  1614 |   await expect(approvalAction).toHaveCSS("min-height", "30px");
  1615 | 
  1616 |   await approvalAction.click();
  1617 |   await expect(page.getByRole("heading", { name: "Job Card", exact: true })).toHaveCount(0);
  1618 | });
  1619 | 
  1620 | test("store reconciliation states use status pills and shared table actions", async ({ page }) => {
  1621 |   await loginAs(page, "store@example.com");
  1622 |   await page.locator(".role-nav").getByRole("button", { name: "Reconcile", exact: true }).click();
  1623 | 
  1624 |   const results = page.getByRole("table", { name: "Reconcile results" });
  1625 |   await expect(results.locator(".store-material-status-matched")).toHaveCount(2);
  1626 |   await expect(results.getByRole("button", { name: "Edit Reconciliation" }).first()).toHaveClass(/store-material-action/);
  1627 | });
  1628 | 
  1629 | test("reconciliation opens per row, requires zero-return acknowledgement, and preserves row navigation", async ({ page }) => {
  1630 |   await loginAs(page, "store@example.com");
  1631 |   await page.locator(".role-nav").getByRole("button", { name: "Issue Material", exact: true }).click();
  1632 |   await page.getByRole("table", { name: "Issue Material results" }).getByRole("button", { name: "Issue Material", exact: true }).first().click();
  1633 |   await page.getByRole("dialog", { name: "Confirm material release" }).getByRole("button", { name: "Confirm release", exact: true }).click();
  1634 |   await page.locator(".role-nav").getByRole("button", { name: "Reconcile", exact: true }).click();
  1635 | 
  1636 |   const results = page.getByRole("table", { name: "Reconcile results" });
  1637 |   const action = results.getByRole("button", { name: "Reconcile", exact: true }).first();
  1638 |   await action.click();
  1639 |   const dialog = page.getByRole("dialog", { name: "Reconcile Material" });
  1640 |   await expect(dialog).toBeVisible();
  1641 |   await expect(page.getByLabel("Used quantity")).toBeFocused();
  1642 |   await page.getByLabel("Used quantity").fill("1");
  1643 |   await page.getByLabel("Returned quantity").fill("0");
  1644 |   await page.getByLabel("Wasted quantity").fill("0");
  1645 |   await expect(dialog.getByRole("button", { name: "Save Reconciliation" })).toBeDisabled();
  1646 |   await page.getByLabel("Confirm no return or wastage").check();
  1647 |   await expect(dialog.getByRole("button", { name: "Save Reconciliation" })).toBeEnabled();
  1648 |   await page.keyboard.press("Escape");
  1649 |   await expect(dialog).toBeHidden();
  1650 |   await expect(action).toBeFocused();
  1651 | 
  1652 |   await action.click();
  1653 |   await page.getByLabel("Used quantity").fill("1");
  1654 |   await page.getByLabel("Returned quantity").fill("0");
  1655 |   await page.getByLabel("Wasted quantity").fill("0");
  1656 |   await page.getByLabel("Confirm no return or wastage").check();
  1657 |   await page.getByRole("dialog", { name: "Reconcile Material" }).getByRole("button", { name: "Save Reconciliation" }).click();
  1658 |   await expect(page.getByRole("dialog", { name: "Reconcile Material" })).toBeHidden();
  1659 |   await expect(results.locator(".store-material-status-open")).toHaveCount(1);
  1660 | 
  1661 |   await results.getByRole("button", { name: "Edit Reconciliation" }).first().click();
  1662 |   await page.getByLabel("Used quantity").fill("0");
  1663 |   await page.getByLabel("Returned quantity").fill("0");
  1664 |   await page.getByLabel("Wasted quantity").fill("0");
  1665 |   await page.getByLabel("Confirm no return or wastage").check();
  1666 |   await page.getByRole("dialog", { name: "Reconcile Material" }).getByRole("button", { name: "Save Reconciliation" }).click();
  1667 |   await expect(results.locator(".store-material-status-open")).toHaveCount(2);
  1668 | });
  1669 | 
  1670 | test("store material queues default to today and keep record filters, exports and workflows in sync", async ({ page }) => {
  1671 |   await loginAs(page, "store@example.com");
  1672 |   const today = await page.evaluate(() => {
  1673 |     const now = new Date();
  1674 |     const offset = now.getTimezoneOffset() * 60_000;
  1675 |     return new Date(now.getTime() - offset).toISOString().slice(0, 10);
  1676 |   });
  1677 | 
  1678 |   for (const pageName of ["Material Requests", "Issue Material"] as const) {
  1679 |     await page.locator(".role-nav").getByRole("button", { name: pageName, exact: true }).click();
  1680 |     const date = page.getByLabel(`${pageName} record date`);
  1681 |     const month = page.getByLabel(`${pageName} record month`);
  1682 |     const disclosure = page.locator(".workspace:visible .workflow-disclosure");
  1683 |     await expect(date).toHaveValue(today);
  1684 |     if (pageName === "Material Requests")
  1685 |       await expect(page.getByRole("region", { name: "Material procurement triage" })).toBeVisible();
  1686 |     else {
  1687 |       if (await disclosure.getAttribute("open") === null)
  1688 |         await disclosure.locator("summary").getByText("Issue workflow", { exact: true }).click();
  1689 |       await expect(disclosure).toHaveAttribute("open", "");
  1690 |     }
  1691 | 
  1692 |     const availableMonth = month.locator("option").nth(1);
  1693 |     if (await availableMonth.count()) {
  1694 |       await month.selectOption(await availableMonth.getAttribute("value") ?? "");
  1695 |       await expect(date).toHaveValue("");
  1696 |       await date.fill(today);
  1697 |       await expect(month).toHaveValue("");
  1698 |     }
  1699 | 
  1700 |     // Remove the time scope only while proving the searchable selector against
  1701 |     // the full fixture set.
  1702 |     await date.fill("");
  1703 | 
```