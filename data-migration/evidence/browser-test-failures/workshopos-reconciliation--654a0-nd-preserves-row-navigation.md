# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workshopos.spec.ts >> reconciliation opens per row, requires zero-return acknowledgement, and preserves row navigation
- Location: tests\workshopos.spec.ts:1629:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('table', { name: 'Issue Material results' }).getByRole('button', { name: 'Issue Material', exact: true }).first()

```

# Page snapshot

```yaml
- generic [ref=f1e3]:
  - complementary [ref=f1e4]:
    - generic [ref=f1e10]:
      - strong [ref=f1e11]: WorkshopOS
      - generic [ref=f1e12]: Workshop Management. Simplified.
    - button "Hide left menu" [ref=f1e13] [cursor=pointer]
    - generic [ref=f1e17]: Store
    - navigation "Store menu" [ref=f1e18]:
      - button "Material Requests" [ref=f1e19] [cursor=pointer]
      - button "Issue Material" [active] [ref=f1e26] [cursor=pointer]
      - button "Reconcile" [ref=f1e32] [cursor=pointer]
      - button "Stock" [ref=f1e36] [cursor=pointer]
      - button "Purchase Orders" [ref=f1e48] [cursor=pointer]
      - button "Search" [ref=f1e52] [cursor=pointer]
    - button "Logout" [ref=f1e57] [cursor=pointer]
  - main [ref=f1e62]:
    - generic [ref=f1e63]:
      - generic [ref=f1e64]:
        - paragraph [ref=f1e65]: Store
        - heading "Issue counter for accountable material movement." [level=1] [ref=f1e66]
      - generic [ref=f1e67]: store@example.com
    - generic [ref=f1e71]:
      - generic [ref=f1e72]:
        - generic [ref=f1e79]:
          - heading "Issue Material" [level=2] [ref=f1e80]
          - paragraph [ref=f1e81]: Search, filter and export the current list
        - generic [ref=f1e82]:
          - generic [ref=f1e83]:
            - text: Date
            - textbox "Issue Material record date" [ref=f1e84]: 2026-10-21
          - generic [ref=f1e85]:
            - text: Month-Year
            - combobox "Issue Material record month" [ref=f1e86]:
              - option "All months" [selected]
              - option "April 2026"
          - generic [ref=f1e87]:
            - text: Status
            - combobox "Status" [ref=f1e88]:
              - option "All states" [selected]
              - option "Pending"
              - option "Partially issued"
              - option "Issued"
              - option "Reconciled"
          - generic [ref=f1e89]:
            - text: Item
            - combobox "Item" [ref=f1e91]: All items
          - group "Search actions" [ref=f1e92]:
            - button "Clear" [ref=f1e93] [cursor=pointer]
        - generic [ref=f1e94]:
          - button "Download" [disabled] [ref=f1e97]
          - generic [ref=f1e101]: Showing 0 to 0 of 0
          - generic [ref=f1e102]:
            - generic [ref=f1e103]:
              - text: Per page
              - combobox "Issue Material records per page" [ref=f1e104]:
                - option "10" [selected]
                - option "20"
                - option "50"
            - navigation "Results pagination" [ref=f1e105]:
              - button "First page" [disabled] [ref=f1e106]
              - button "Previous page" [disabled] [ref=f1e109]
              - button "Page 1" [ref=f1e113] [cursor=pointer]: "1"
              - button "Next page" [disabled] [ref=f1e114]
              - button "Last page" [disabled] [ref=f1e117]
        - generic [ref=f1e120]:
          - heading "No matching records" [level=3] [ref=f1e121]
          - paragraph [ref=f1e122]: Adjust the search or clear the filters.
          - button "Clear filters" [ref=f1e123] [cursor=pointer]
        - navigation "Results pagination" [ref=f1e124]:
          - button "First page" [disabled] [ref=f1e125]
          - button "Previous page" [disabled] [ref=f1e128]
          - button "Page 1" [ref=f1e132] [cursor=pointer]: "1"
          - button "Next page" [disabled] [ref=f1e133]
          - button "Last page" [disabled] [ref=f1e136]
      - group [ref=f1e139]:
        - generic "Issue workflow" [ref=f1e140] [cursor=pointer]
```

# Test source

```ts
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
> 1632 |   await page.getByRole("table", { name: "Issue Material results" }).getByRole("button", { name: "Issue Material", exact: true }).first().click();
       |                                                                                                                                          ^ Error: locator.click: Test timeout of 30000ms exceeded.
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
  1704 |     await page.getByLabel("Item").fill("nano");
  1705 |     await page.getByRole("option", { name: /70%VLT Nano Ceramic Film/ }).click();
  1706 | 
  1707 |     await page.getByRole("button", { name: "Clear", exact: true }).click();
  1708 |     await expect(date).toHaveValue("");
  1709 |     await expect(month).toHaveValue("");
  1710 |     await expect(page.getByLabel("Status")).toHaveValue("ALL");
  1711 |     await expect(page.getByLabel("Item")).toHaveValue("All items");
  1712 |     const toolbarControls = page.locator(".material-record-filter-grid > label, .material-record-filter-grid > .list-search-actions");
  1713 |     await expect(toolbarControls).toHaveCount(5);
  1714 |     await expect(toolbarControls).toHaveText([/^Date/, /^Month-Year/, /^Status/, /^Item/, /^Clear$/]);
  1715 | 
  1716 |     await page.getByRole("button", { name: "Download", exact: true }).click();
  1717 |     const downloadPromise = page.waitForEvent("download");
  1718 |     await page.getByRole("menuitem", { name: "Excel" }).click();
  1719 |     const worksheet = await readWorksheet(await downloadPromise);
  1720 |     expect(String(worksheet[2]?.[1])).not.toContain("Record date:");
  1721 | 
  1722 |     for (const viewport of [{ width: 1440, height: 900 }, { width: 900, height: 900 }]) {
  1723 |       await page.setViewportSize(viewport);
  1724 |       await expectMaterialRecordToolbarHasOneRow(page);
  1725 |       await expectNoPageOverflow(page);
  1726 |     }
  1727 |     await page.setViewportSize({ width: 390, height: 844 });
  1728 |     await expectNoPageOverflow(page);
  1729 |   }
  1730 | });
  1731 | 
  1732 | test("PDF and Excel downloads use the current filtered rows and visible columns", async ({ page }) => {
```