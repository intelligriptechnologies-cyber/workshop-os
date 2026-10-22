# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workshopos.spec.ts >> PDF and Excel downloads use the current filtered rows and visible columns
- Location: tests\workshopos.spec.ts:1732:1

# Error details

```
Error: expect(received).toHaveLength(expected)

Expected length: 61
Received length: 1
Received array:  [["PPF-ROLL", "Gloss PPF roll", "PPF", 500, "metre", 40, "Rs 0", "In stock"]]
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
      - generic [ref=f1e72]:
        - generic [ref=f1e84]:
          - heading "Stock" [level=2] [ref=f1e85]
          - paragraph [ref=f1e86]: Inventory levels, low-stock attention and movement history
        - tablist "Stock views" [ref=f1e87]:
          - tab "Inventory List" [selected] [ref=f1e88] [cursor=pointer]
          - tab "Low Stock" [ref=f1e89] [cursor=pointer]
          - tab "Stock Movements" [ref=f1e90] [cursor=pointer]
        - generic "Stock summary" [ref=f1e91]:
          - generic [ref=f1e92]:
            - strong [ref=f1e103]: "4"
            - text: Total SKUs
          - generic [ref=f1e104]:
            - strong [ref=f1e109]: "642"
            - text: Total Units
          - generic [ref=f1e110]:
            - strong [ref=f1e115]: "1"
            - text: Low Stock
          - generic [ref=f1e116]:
            - strong [ref=f1e120]: "0"
            - text: Out of Stock
      - generic [ref=f1e121]:
        - generic [ref=f1e134]:
          - heading "Stock" [level=2] [ref=f1e135]
          - paragraph [ref=f1e136]: Search, filter and export the current list
        - generic [ref=f1e137]:
          - generic [ref=f1e138]:
            - text: Search
            - textbox "Search stock" [ref=f1e139]:
              - /placeholder: SKU, item, category or unit
          - generic [ref=f1e140]:
            - text: Category
            - combobox "Stock category" [ref=f1e141]:
              - option "All categories"
              - option "33"
              - option "Detailing"
              - option "PPF" [selected]
              - option "Paint"
          - generic [ref=f1e142]:
            - text: Stock status
            - combobox "Stock status" [ref=f1e143]:
              - option "All stock" [selected]
              - option "Low stock"
              - option "In stock"
          - generic [ref=f1e144]:
            - text: Unit
            - combobox "Stock unit" [ref=f1e145]:
              - option "All units" [selected]
              - option "4"
              - option "litre"
              - option "metre"
          - group "Search actions" [ref=f1e146]:
            - button "Clear" [ref=f1e147] [cursor=pointer]
        - generic [ref=f1e148]:
          - button "Download" [ref=f1e151] [cursor=pointer]
          - generic [ref=f1e155]: Showing 1 to 1 of 1
          - generic [ref=f1e156]:
            - generic [ref=f1e157]:
              - text: Per page
              - combobox "Stock records per page" [ref=f1e158]:
                - option "10" [selected]
                - option "20"
                - option "50"
            - navigation "Results pagination" [ref=f1e159]:
              - button "First page" [disabled] [ref=f1e160]
              - button "Previous page" [disabled] [ref=f1e163]
              - button "Page 1" [ref=f1e167] [cursor=pointer]: "1"
              - button "Next page" [disabled] [ref=f1e168]
              - button "Last page" [disabled] [ref=f1e171]
        - table "Stock results" [ref=f1e175]:
          - rowgroup [ref=f1e176]:
            - row [ref=f1e177]:
              - columnheader "SKU" [ref=f1e178]
              - columnheader "Item" [ref=f1e179]
              - columnheader "Category" [ref=f1e180]
              - columnheader "Stock" [ref=f1e181]
              - columnheader "Minimum" [ref=f1e182]
              - columnheader "Sell Price" [ref=f1e183]
              - columnheader "Status" [ref=f1e184]
              - columnheader "Action" [ref=f1e185]
          - rowgroup [ref=f1e186]:
            - row [ref=f1e187]:
              - cell "PPF-ROLL" [ref=f1e188]
              - cell "Gloss PPF roll" [ref=f1e189]
              - cell "PPF" [ref=f1e190]
              - cell "500 metre" [ref=f1e191]
              - cell "40" [ref=f1e192]
              - cell "Rs 0" [ref=f1e193]
              - cell "In stock" [ref=f1e194]
              - cell [ref=f1e195]:
                - button "Edit" [ref=f1e196] [cursor=pointer]
        - navigation "Results pagination" [ref=f1e197]:
          - button "First page" [disabled] [ref=f1e198]
          - button "Previous page" [disabled] [ref=f1e201]
          - button "Page 1" [ref=f1e205] [cursor=pointer]: "1"
          - button "Next page" [disabled] [ref=f1e206]
          - button "Last page" [disabled] [ref=f1e209]
```

# Test source

```ts
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
> 1751 |   expect(ppfRows.slice(5)).toHaveLength(61);
       |                            ^ Error: expect(received).toHaveLength(expected)
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
  1806 |   await page.getByLabel("User email").fill("team.manager@example.com");
  1807 |   await page.getByLabel("User role").selectOption("service_manager");
  1808 |   await page.getByLabel("User password").fill("secure123");
  1809 |   await page.getByRole("button", { name: "Save User" }).click();
  1810 | 
  1811 |   await page.getByRole("button", { name: "Add User" }).click();
  1812 |   await page.getByLabel("User name").fill("Team Advisor");
  1813 |   await page.getByLabel("User email").fill("team.advisor@example.com");
  1814 |   await page.getByLabel("User role").selectOption("service");
  1815 |   await page.getByLabel("User password").fill("secure123");
  1816 |   await page.getByRole("button", { name: "Save User" }).click();
  1817 | 
  1818 |   await page.getByRole("tab", { name: "Team Structure", exact: true }).click();
  1819 |   await page.getByLabel("New department").fill("Collision Repair");
  1820 |   await page.getByRole("button", { name: "Create department", exact: true }).click();
  1821 | 
  1822 |   const table = page.getByRole("table", { name: "Service departments" });
  1823 |   const departmentRow = table.locator("tbody tr").filter({ hasText: "Collision Repair" });
  1824 |   await expect(departmentRow).toHaveClass(/team-department-selected/);
  1825 |   await expect(page.getByRole("region", { name: "Collision Repair team management" })).toBeVisible();
  1826 |   await departmentRow.getByRole("button", { name: "Rename", exact: true }).click();
  1827 |   await expect(page.getByRole("dialog", { name: "Rename department" })).toBeVisible();
  1828 |   await page.getByLabel("Department name").fill("Collision Repair East");
  1829 |   await page.getByRole("button", { name: "Save department", exact: true }).click();
  1830 |   await expect(departmentRow).toContainText("Collision Repair East");
  1831 |   await page.getByLabel("Eligible manager").selectOption({ label: "Team Manager" });
  1832 |   await page.getByRole("button", { name: "Appoint manager", exact: true }).click();
  1833 |   await expect(departmentRow).toContainText("Team Manager");
  1834 |   await expect(page.getByLabel("Appointed manager")).toHaveValue(/.+/);
  1835 | 
  1836 |   await page.getByLabel("Eligible advisor").selectOption({ label: "Team Advisor" });
  1837 |   await page.getByRole("button", { name: "Assign advisor", exact: true }).click();
  1838 |   await expect(departmentRow).toContainText("Team Advisor");
  1839 |   await page.getByRole("region", { name: "Collision Repair East team management" }).getByRole("button", { name: "Remove", exact: true }).last().click();
  1840 |   await expect(departmentRow).toContainText("—");
  1841 |   await page.getByRole("tab", { name: "Users", exact: true }).click();
  1842 |   await expect(page.locator(".management-table tbody tr").filter({ hasText: "team.manager@example.com" })).toContainText("Manager · Collision Repair East");
  1843 |   await page.getByRole("tab", { name: "Team Structure", exact: true }).click();
  1844 |   const layout = await page.locator(".team-create-form, .team-department-table").evaluateAll((elements) => elements.map((element) => {
  1845 |     const rect = element.getBoundingClientRect();
  1846 |     return { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right, width: rect.width };
  1847 |   }));
  1848 |   expect(layout[1].top).toBeGreaterThanOrEqual(layout[0].bottom);
  1849 | 
  1850 |   await page.setViewportSize({ width: 390, height: 844 });
  1851 |   const createForm = await page.locator(".team-create-form").evaluate((element) => element.getBoundingClientRect().right);
```