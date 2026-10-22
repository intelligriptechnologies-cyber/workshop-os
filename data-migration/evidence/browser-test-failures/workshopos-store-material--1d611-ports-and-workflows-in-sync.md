# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workshopos.spec.ts >> store material queues default to today and keep record filters, exports and workflows in sync
- Location: tests\workshopos.spec.ts:1670:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('option', { name: /70%VLT Nano Ceramic Film/ })

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
      - button "Issue Material" [ref=f1e26] [cursor=pointer]
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
      - region "Material procurement triage" [ref=f1e72]:
        - generic [ref=f1e73]:
          - paragraph [ref=f1e74]: Materials Request
          - heading "Material procurement triage" [level=2] [ref=f1e75]
          - paragraph [ref=f1e76]: Choose the next safe action for each demand. Procurement starts only as a Purchase Request.
        - generic [ref=f1e77]:
          - article [ref=f1e78]:
            - heading "Available to issue" [level=3] [ref=f1e79]
            - strong [ref=f1e80]: "8"
            - paragraph [ref=f1e81]: Existing SKUs have enough stock for their outstanding requested quantity.
            - button "Open Issue Material" [ref=f1e82] [cursor=pointer]
          - article [ref=f1e83]:
            - heading "Existing-SKU procurement" [level=3] [ref=f1e84]
            - strong [ref=f1e85]: "0"
            - paragraph [ref=f1e86]: Existing SKUs are short. Create a Purchase Request; do not add stock directly.
            - button "Create Purchase Request" [disabled] [ref=f1e87]
          - article [ref=f1e88]:
            - heading "New Item Requests" [level=3] [ref=f1e89]
            - strong [ref=f1e90]: "0"
            - paragraph [ref=f1e91]: New Item Requests are the uncatalogued lines already recorded on open Purchase Requests.
            - button "Create New Item Request" [ref=f1e92] [cursor=pointer]
      - generic [ref=f1e93]:
        - generic [ref=f1e101]:
          - heading "Material Requests" [level=2] [ref=f1e102]
          - paragraph [ref=f1e103]: Search, filter and export the current list
        - generic [ref=f1e104]:
          - generic [ref=f1e105]:
            - text: Date
            - textbox "Material Requests record date" [ref=f1e106]
          - generic [ref=f1e107]:
            - text: Month-Year
            - combobox "Material Requests record month" [ref=f1e108]:
              - option "All months" [selected]
              - option "August 2026"
              - option "July 2026"
              - option "June 2026"
              - option "May 2026"
              - option "April 2026"
              - option "March 2026"
              - option "February 2026"
              - option "January 2026"
          - generic [ref=f1e109]:
            - text: Status
            - combobox "Status" [ref=f1e110]:
              - option "All states" [selected]
              - option "Pending"
              - option "Partially issued"
              - option "Issued"
              - option "Reconciled"
          - generic [ref=f1e111]:
            - text: Item
            - generic [ref=f1e112]:
              - combobox "Item" [expanded] [active] [ref=f1e113]: nano
              - listbox "Item options" [ref=f1e114]:
                - option [selected] [ref=f1e115]:
                  - button "All items" [ref=f1e116] [cursor=pointer]
          - group "Search actions" [ref=f1e117]:
            - button "Clear" [ref=f1e118] [cursor=pointer]
        - generic [ref=f1e119]:
          - button "Download" [ref=f1e122] [cursor=pointer]
          - generic [ref=f1e126]: Showing 1 to 10 of 117
          - generic [ref=f1e127]:
            - generic [ref=f1e128]:
              - text: Per page
              - combobox "Material Requests records per page" [ref=f1e129]:
                - option "10" [selected]
                - option "20"
                - option "50"
            - navigation "Results pagination" [ref=f1e130]:
              - button "First page" [disabled] [ref=f1e131]
              - button "Previous page" [disabled] [ref=f1e134]
              - generic [ref=f1e137]:
                - button "Page 1" [ref=f1e138] [cursor=pointer]: "1"
                - button "Page 2" [ref=f1e139] [cursor=pointer]: "2"
                - button "Page 3" [ref=f1e140] [cursor=pointer]: "3"
                - button "Page 4" [ref=f1e141] [cursor=pointer]: "4"
                - button "Page 5" [ref=f1e142] [cursor=pointer]: "5"
                - generic [aria-hidden] [ref=f1e143]: …
                - button "Page 12" [ref=f1e144] [cursor=pointer]: "12"
              - button "Next page" [ref=f1e145] [cursor=pointer]
              - button "Last page" [ref=f1e148] [cursor=pointer]
        - table "Material Requests results" [ref=f1e152]:
          - rowgroup [ref=f1e153]:
            - row [ref=f1e154]:
              - columnheader "Job Card" [ref=f1e155]
              - columnheader "Vehicle" [ref=f1e156]
              - columnheader "Type" [ref=f1e157]
              - columnheader "Item" [ref=f1e158]
              - columnheader "Requested" [ref=f1e159]
              - columnheader "Issued" [ref=f1e160]
              - columnheader "Status" [ref=f1e161]
          - rowgroup [ref=f1e162]:
            - row [ref=f1e163] [cursor=pointer]:
              - cell [ref=f1e164]:
                - button "JC-2026-002144" [ref=f1e165]
              - cell "OD13DM1012" [ref=f1e166]
              - cell "Inventory" [ref=f1e167]
              - cell "Gloss PPF roll" [ref=f1e168]
              - cell "2" [ref=f1e169]
              - cell "2" [ref=f1e170]
              - cell "Reconciled" [ref=f1e171]
            - row [ref=f1e173] [cursor=pointer]:
              - cell [ref=f1e174]:
                - button "JC-2026-002143" [ref=f1e175]
              - cell "OD12DM1011" [ref=f1e176]
              - cell "Inventory" [ref=f1e177]
              - cell "Clear coat" [ref=f1e178]
              - cell "2" [ref=f1e179]
              - cell "2" [ref=f1e180]
              - cell "Reconciled" [ref=f1e181]
            - row [ref=f1e183] [cursor=pointer]:
              - cell [ref=f1e184]:
                - button "JC-2026-002142" [ref=f1e185]
              - cell "OD11DM1010" [ref=f1e186]
              - cell "Inventory" [ref=f1e187]
              - cell "Ceramic coating" [ref=f1e188]
              - cell "2" [ref=f1e189]
              - cell "2" [ref=f1e190]
              - cell "Reconciled" [ref=f1e191]
            - row [ref=f1e193] [cursor=pointer]:
              - cell [ref=f1e194]:
                - button "JC-2026-002141" [ref=f1e195]
              - cell "OD10DM1009" [ref=f1e196]
              - cell "Inventory" [ref=f1e197]
              - cell "Gloss PPF roll" [ref=f1e198]
              - cell "2" [ref=f1e199]
              - cell "2" [ref=f1e200]
              - cell "Issued" [ref=f1e201]
            - row [ref=f1e203] [cursor=pointer]:
              - cell [ref=f1e204]:
                - button "JC-2026-002140" [ref=f1e205]
              - cell "OD09DM1008" [ref=f1e206]
              - cell "Inventory" [ref=f1e207]
              - cell "Clear coat" [ref=f1e208]
              - cell "2" [ref=f1e209]
              - cell "2" [ref=f1e210]
              - cell "Issued" [ref=f1e211]
            - row [ref=f1e213] [cursor=pointer]:
              - cell [ref=f1e214]:
                - button "JC-2026-002139" [ref=f1e215]
              - cell "OD08DM1007" [ref=f1e216]
              - cell "Inventory" [ref=f1e217]
              - cell "Ceramic coating" [ref=f1e218]
              - cell "2" [ref=f1e219]
              - cell "2" [ref=f1e220]
              - cell "Issued" [ref=f1e221]
            - row [ref=f1e223] [cursor=pointer]:
              - cell [ref=f1e224]:
                - button "JC-2026-002138" [ref=f1e225]
              - cell "OD07DM1006" [ref=f1e226]
              - cell "Inventory" [ref=f1e227]
              - cell "Gloss PPF roll" [ref=f1e228]
              - cell "2" [ref=f1e229]
              - cell "2" [ref=f1e230]
              - cell "Issued" [ref=f1e231]
            - row [ref=f1e233] [cursor=pointer]:
              - cell [ref=f1e234]:
                - button "JC-2026-002137" [ref=f1e235]
              - cell "OD06DM1005" [ref=f1e236]
              - cell "Inventory" [ref=f1e237]
              - cell "Clear coat" [ref=f1e238]
              - cell "2" [ref=f1e239]
              - cell "2" [ref=f1e240]
              - cell "Issued" [ref=f1e241]
            - row [ref=f1e243] [cursor=pointer]:
              - cell [ref=f1e244]:
                - button "JC-2026-002136" [ref=f1e245]
              - cell "OD05DM1004" [ref=f1e246]
              - cell "Inventory" [ref=f1e247]
              - cell "Ceramic coating" [ref=f1e248]
              - cell "2" [ref=f1e249]
              - cell "2" [ref=f1e250]
              - cell "Issued" [ref=f1e251]
            - row [ref=f1e253] [cursor=pointer]:
              - cell [ref=f1e254]:
                - button "JC-2026-002135" [ref=f1e255]
              - cell "OD04DM1003" [ref=f1e256]
              - cell "Inventory" [ref=f1e257]
              - cell "Gloss PPF roll" [ref=f1e258]
              - cell "2" [ref=f1e259]
              - cell "2" [ref=f1e260]
              - cell "Issued" [ref=f1e261]
        - navigation "Results pagination" [ref=f1e263]:
          - button "First page" [disabled] [ref=f1e264]
          - button "Previous page" [disabled] [ref=f1e267]
          - generic [ref=f1e270]:
            - button "Page 1" [ref=f1e271] [cursor=pointer]: "1"
            - button "Page 2" [ref=f1e272] [cursor=pointer]: "2"
            - button "Page 3" [ref=f1e273] [cursor=pointer]: "3"
            - button "Page 4" [ref=f1e274] [cursor=pointer]: "4"
            - button "Page 5" [ref=f1e275] [cursor=pointer]: "5"
            - generic [aria-hidden] [ref=f1e276]: …
            - button "Page 12" [ref=f1e277] [cursor=pointer]: "12"
          - button "Next page" [ref=f1e278] [cursor=pointer]
          - button "Last page" [ref=f1e281] [cursor=pointer]
      - group [ref=f1e284]:
        - generic "Procurement and issue workflow" [ref=f1e285] [cursor=pointer]
```

# Test source

```ts
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
  1704 |     await page.getByLabel("Item").fill("nano");
> 1705 |     await page.getByRole("option", { name: /70%VLT Nano Ceramic Film/ }).click();
       |                                                                          ^ Error: locator.click: Test timeout of 30000ms exceeded.
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
  1733 |   await loginAs(page, "store@example.com");
  1734 |   await page.locator(".role-nav").getByRole("button", { name: "Stock", exact: true }).click();
  1735 |   await page.getByLabel("Stock category").selectOption("PPF");
  1736 |   await page.getByRole("button", { name: "Download", exact: true }).click();
  1737 |   const pdfPromise = page.waitForEvent("download");
  1738 |   await page.getByRole("menuitem", { name: "PDF" }).click();
  1739 |   const pdf = await pdfPromise;
  1740 |   expect(pdf.suggestedFilename()).toBe("stock.pdf");
  1741 |   const pdfPath = await pdf.path();
  1742 |   expect(pdfPath && statSync(pdfPath).size).toBeGreaterThan(500);
  1743 | 
  1744 |   await page.getByRole("button", { name: "Download", exact: true }).click();
  1745 |   const ppfDownloadPromise = page.waitForEvent("download");
  1746 |   await page.getByRole("menuitem", { name: "Excel" }).click();
  1747 |   const ppfRows = await readWorksheet(await ppfDownloadPromise);
  1748 |   expect(ppfRows[0][0]).toBe("Stock");
  1749 |   expect(ppfRows[2][1]).toContain("Category: PPF");
  1750 |   expect(ppfRows[4]).toEqual(["SKU", "Item", "Category", "Stock", "Unit", "Minimum", "Sell Price", "Status"]);
  1751 |   expect(ppfRows.slice(5)).toHaveLength(61);
  1752 |   expect(ppfRows.slice(5).every((row) => row[2] === "PPF")).toBeTruthy();
  1753 | 
  1754 |   await page.getByLabel("Stock category").selectOption("Paint");
  1755 |   await page.getByRole("button", { name: "Download", exact: true }).click();
  1756 |   const paintDownloadPromise = page.waitForEvent("download");
  1757 |   await page.getByRole("menuitem", { name: "Excel" }).click();
  1758 |   const paintRows = await readWorksheet(await paintDownloadPromise);
  1759 |   expect(paintRows[2][1]).toContain("Category: Paint");
  1760 |   expect(paintRows.slice(5).every((row) => row[2] === "Paint")).toBeTruthy();
  1761 |   expect(paintRows.slice(5).map((row) => row[0])).not.toEqual(ppfRows.slice(5).map((row) => row[0]));
  1762 | });
  1763 | 
  1764 | test("store pagination resets after filtering", async ({ page }) => {
  1765 |   await loginAs(page, "admin@example.com");
  1766 |   await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  1767 |   page.once("dialog", (dialog) => dialog.accept());
  1768 |   await page.getByRole("button", { name: "Load Large Demo Dataset" }).click();
  1769 |   await page.getByRole("button", { name: "Logout" }).click();
  1770 |   await loginAs(page, "store@example.com");
  1771 |   await page.getByLabel("Material Requests record date").fill("");
  1772 |   await page.getByRole("button", { name: "Next page", exact: true }).first().click();
  1773 |   await expect(page.getByText(/Showing 11 to 20 of/)).toBeVisible();
  1774 |   await page.getByLabel("Status").selectOption("Pending");
  1775 |   await expect(page.getByText(/Showing 1 to/)).toBeVisible();
  1776 | });
  1777 | 
  1778 | test("admin user CRUD persists and protects the signed-in admin", async ({ page }) => {
  1779 |   await loginAs(page, "admin@example.com");
  1780 |   await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  1781 |   await page.getByRole("button", { name: "Add User" }).click();
  1782 |   await page.getByLabel("User name").fill("Persistent User");
  1783 |   await page.getByLabel("User email").fill("persistent@example.com");
  1784 |   await page.getByLabel("User password").fill("secure123");
  1785 |   await page.getByRole("button", { name: "Save User" }).click();
  1786 |   await page.reload();
  1787 |   await loginAs(page, "admin@example.com");
  1788 |   await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  1789 |   const created = page.locator(".management-table tbody tr").filter({ hasText: "persistent@example.com" });
  1790 |   await created.getByRole("button", { name: "Edit" }).click();
  1791 |   await page.getByLabel("User name").fill("Updated User");
  1792 |   await page.getByRole("button", { name: "Save User" }).click();
  1793 |   await expect(page.getByText("Updated User")).toBeVisible();
  1794 |   await created.getByRole("button", { name: "Archive" }).click();
  1795 |   await expect(page.getByText("persistent@example.com")).toHaveCount(0);
  1796 |   const self = page.locator(".management-table tbody tr").filter({ hasText: "admin@example.com" });
  1797 |   await expect(self.getByRole("button", { name: "Archive" })).toBeDisabled();
  1798 | });
  1799 | 
  1800 | test("Team Structure creates departments and manages appointed manager advisor teams responsively", async ({ page }) => {
  1801 |   await loginAs(page, "admin@example.com");
  1802 |   await page.locator(".role-nav").getByRole("button", { name: "Admin Console", exact: true }).click();
  1803 | 
  1804 |   await page.getByRole("button", { name: "Add User" }).click();
  1805 |   await page.getByLabel("User name").fill("Team Manager");
```