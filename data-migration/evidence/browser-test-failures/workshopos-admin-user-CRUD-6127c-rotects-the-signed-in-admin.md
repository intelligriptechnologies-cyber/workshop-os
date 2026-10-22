# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workshopos.spec.ts >> admin user CRUD persists and protects the signed-in admin
- Location: tests\workshopos.spec.ts:1778:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.management-table tbody tr').filter({ hasText: 'persistent@example.com' }).getByRole('button', { name: 'Edit' })

```

# Page snapshot

```yaml
- generic [ref=f2e3]:
  - complementary [ref=f2e4]:
    - generic [ref=f2e10]:
      - strong [ref=f2e11]: WorkshopOS
      - generic [ref=f2e12]: Workshop Management. Simplified.
    - button "Hide left menu" [ref=f2e13] [cursor=pointer]
    - generic [ref=f2e17]: Owner/Admin
    - navigation "Owner/Admin menu" [ref=f2e18]:
      - button "Dashboard" [ref=f2e19] [cursor=pointer]
      - button "Advance Bookings" [ref=f2e24] [cursor=pointer]
      - button "Approvals (0)" [ref=f2e28] [cursor=pointer]
      - button "Data Flow" [ref=f2e33] [cursor=pointer]
      - button "Job Cards" [ref=f2e39] [cursor=pointer]
      - button "Media" [ref=f2e44] [cursor=pointer]
      - button "Purchase Orders" [ref=f2e49] [cursor=pointer]
      - button "Manage" [active] [ref=f2e53] [cursor=pointer]
      - button "Search" [ref=f2e58] [cursor=pointer]
      - button "Admin Console" [ref=f2e63] [cursor=pointer]
      - group [ref=f2e68]:
        - generic "Sales CRM" [ref=f2e69] [cursor=pointer]
    - button "Logout" [ref=f2e70] [cursor=pointer]
  - main [ref=f2e75]:
    - generic [ref=f2e76]:
      - generic [ref=f2e77]:
        - paragraph [ref=f2e78]: Owner/Admin
        - heading "Control room for linked workflow, blockers and cash." [level=1] [ref=f2e79]
      - generic [ref=f2e80]: admin@example.com
    - generic [ref=f2e85]:
      - generic [ref=f2e90]:
        - heading "Management Hub" [level=2] [ref=f2e91]
        - paragraph [ref=f2e92]: Admin master data and workflow controls
      - generic [ref=f2e93]:
        - generic [ref=f2e94]:
          - strong [ref=f2e95]: Large demo dataset
          - generic [ref=f2e96]: 120 customers, 132 vehicles, 144 jobs and 288 offline media records.
        - button "Load Large Demo Dataset" [ref=f2e97] [cursor=pointer]
      - tablist "Management areas" [ref=f2e98]:
        - tab "Users" [selected] [ref=f2e99] [cursor=pointer]
        - tab "Customers" [ref=f2e100] [cursor=pointer]
        - tab "Vehicles" [ref=f2e101] [cursor=pointer]
        - tab "Suppliers" [ref=f2e102] [cursor=pointer]
        - tab "Job Cards" [ref=f2e103] [cursor=pointer]
        - tab "Estimates" [ref=f2e104] [cursor=pointer]
        - tab "Invoices" [ref=f2e105] [cursor=pointer]
        - tab "Payments" [ref=f2e106] [cursor=pointer]
        - tab "Delivery" [ref=f2e107] [cursor=pointer]
      - tabpanel "Users" [ref=f2e108]:
        - tabpanel [ref=f2e109]:
          - generic [ref=f2e110]:
            - heading "Users" [level=3] [ref=f2e111]
            - button "Add User" [ref=f2e112] [cursor=pointer]
          - generic [ref=f2e113]:
            - generic [ref=f2e114]:
              - text: Search
              - textbox "Search users" [ref=f2e115]:
                - /placeholder: Name, email or role
            - generic [ref=f2e116]:
              - text: Role
              - combobox "Filter users by role" [ref=f2e117]:
                - option "All roles" [selected]
                - option "Owner/Admin"
                - option "Service Advisor"
                - option "Service Department Manager"
                - option "Reception"
                - option "Accounts"
                - option "Store"
                - option "Technician"
            - generic [ref=f2e118]:
              - text: Status
              - combobox "Filter users by status" [ref=f2e119]:
                - option "All statuses" [selected]
                - option "Active"
                - option "Archived"
            - group "Search actions" [ref=f2e120]:
              - button "Clear" [ref=f2e121] [cursor=pointer]
          - generic [ref=f2e122]:
            - button "Download" [ref=f2e125] [cursor=pointer]
            - generic [ref=f2e129]: Showing 1 to 10 of 11
            - generic [ref=f2e130]:
              - generic [ref=f2e131]:
                - text: Per page
                - combobox "User records per page" [ref=f2e132]:
                  - option "10" [selected]
                  - option "20"
                  - option "50"
              - navigation "Results pagination" [ref=f2e133]:
                - button "First page" [disabled] [ref=f2e134]
                - button "Previous page" [disabled] [ref=f2e137]
                - generic [ref=f2e140]:
                  - button "Page 1" [ref=f2e141] [cursor=pointer]: "1"
                  - button "Page 2" [ref=f2e142] [cursor=pointer]: "2"
                - button "Next page" [ref=f2e143] [cursor=pointer]
                - button "Last page" [ref=f2e146] [cursor=pointer]
          - table "User manager" [ref=f2e150]:
            - rowgroup [ref=f2e151]:
              - row [ref=f2e152]:
                - columnheader "Name" [ref=f2e153]
                - columnheader "Email" [ref=f2e154]
                - columnheader "Role" [ref=f2e155]
                - columnheader "Status" [ref=f2e156]
                - columnheader "Actions" [ref=f2e157]
            - rowgroup [ref=f2e158]:
              - row [ref=f2e159]:
                - cell "Owner/Admin" [ref=f2e160]
                - cell "admin@example.com" [ref=f2e163]
                - cell "Owner/Admin" [ref=f2e164]
                - cell "Active" [ref=f2e165]
                - cell [ref=f2e166]:
                  - generic [ref=f2e167]:
                    - button "Edit" [ref=f2e168] [cursor=pointer]
                    - button "Archive" [disabled] [ref=f2e169]
              - row [ref=f2e170]:
                - cell "Service advisor 1" [ref=f2e171]
                - cell "service@example.com" [ref=f2e174]
                - cell "Service Advisor" [ref=f2e175]
                - cell "Active" [ref=f2e176]
                - cell [ref=f2e177]:
                  - generic [ref=f2e178]:
                    - button "Edit" [ref=f2e179] [cursor=pointer]
                    - button "Archive" [ref=f2e180] [cursor=pointer]
              - row [ref=f2e181]:
                - cell "Reception Desk" [ref=f2e182]
                - cell "reception@example.com" [ref=f2e185]
                - cell "Reception" [ref=f2e186]
                - cell "Active" [ref=f2e187]
                - cell [ref=f2e188]:
                  - generic [ref=f2e189]:
                    - button "Edit" [ref=f2e190] [cursor=pointer]
                    - button "Archive" [ref=f2e191] [cursor=pointer]
              - row [ref=f2e192]:
                - cell "Accounts Desk" [ref=f2e193]
                - cell "accounts@example.com" [ref=f2e196]
                - cell "Accounts" [ref=f2e197]
                - cell "Active" [ref=f2e198]
                - cell [ref=f2e199]:
                  - generic [ref=f2e200]:
                    - button "Edit" [ref=f2e201] [cursor=pointer]
                    - button "Archive" [ref=f2e202] [cursor=pointer]
              - row [ref=f2e203]:
                - cell "Store Counter" [ref=f2e204]
                - cell "store@example.com" [ref=f2e207]
                - cell "Store" [ref=f2e208]
                - cell "Active" [ref=f2e209]
                - cell [ref=f2e210]:
                  - generic [ref=f2e211]:
                    - button "Edit" [ref=f2e212] [cursor=pointer]
                    - button "Archive" [ref=f2e213] [cursor=pointer]
              - row [ref=f2e214]:
                - cell "Technician Bay" [ref=f2e215]
                - cell "tech@example.com" [ref=f2e218]
                - cell "Technician" [ref=f2e219]
                - cell "Active" [ref=f2e220]
                - cell [ref=f2e221]:
                  - generic [ref=f2e222]:
                    - button "Edit" [ref=f2e223] [cursor=pointer]
                    - button "Archive" [ref=f2e224] [cursor=pointer]
              - row [ref=f2e225]:
                - cell "Service advisor AA" [ref=f2e226]
                - cell "advisor.aa@example.com" [ref=f2e229]
                - cell "Service Advisor" [ref=f2e230]
                - cell "Active" [ref=f2e231]
                - cell [ref=f2e232]:
                  - generic [ref=f2e233]:
                    - button "Edit" [ref=f2e234] [cursor=pointer]
                    - button "Archive" [ref=f2e235] [cursor=pointer]
              - row [ref=f2e236]:
                - cell "Service advisor BB1" [ref=f2e237]
                - cell "advisor.bb1@example.com" [ref=f2e240]
                - cell "Service Advisor" [ref=f2e241]
                - cell "Active" [ref=f2e242]
                - cell [ref=f2e243]:
                  - generic [ref=f2e244]:
                    - button "Edit" [ref=f2e245] [cursor=pointer]
                    - button "Archive" [ref=f2e246] [cursor=pointer]
              - row [ref=f2e247]:
                - cell "General Service Manager" [ref=f2e248]
                - cell "general.service.manager@example.com" [ref=f2e251]
                - cell "Service Department Manager" [ref=f2e252]
                - cell "Active" [ref=f2e253]
                - cell [ref=f2e254]:
                  - generic [ref=f2e255]:
                    - button "Edit" [ref=f2e256] [cursor=pointer]
                    - button "Archive" [ref=f2e257] [cursor=pointer]
              - row [ref=f2e258]:
                - cell "PPF/Paint Manager" [ref=f2e259]
                - cell "ppf.paint.manager@example.com" [ref=f2e262]
                - cell "Service Department Manager" [ref=f2e263]
                - cell "Active" [ref=f2e264]
                - cell [ref=f2e265]:
                  - generic [ref=f2e266]:
                    - button "Edit" [ref=f2e267] [cursor=pointer]
                    - button "Archive" [ref=f2e268] [cursor=pointer]
          - navigation "Results pagination" [ref=f2e269]:
            - button "First page" [disabled] [ref=f2e270]
            - button "Previous page" [disabled] [ref=f2e273]
            - generic [ref=f2e276]:
              - button "Page 1" [ref=f2e277] [cursor=pointer]: "1"
              - button "Page 2" [ref=f2e278] [cursor=pointer]: "2"
            - button "Next page" [ref=f2e279] [cursor=pointer]
            - button "Last page" [ref=f2e282] [cursor=pointer]
```

# Test source

```ts
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
> 1790 |   await created.getByRole("button", { name: "Edit" }).click();
       |                                                       ^ Error: locator.click: Test timeout of 30000ms exceeded.
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
  1852 |   expect(createForm).toBeLessThanOrEqual(391);
  1853 |   const controlRows = await page.locator(".team-create-form > label, .team-create-form > button").evaluateAll((controls) => new Set(controls.map((control) => Math.round(control.getBoundingClientRect().top))).size);
  1854 |   expect(controlRows).toBeGreaterThan(1);
  1855 |   await expectNoPageOverflow(page);
  1856 | });
  1857 | 
  1858 | test("company settings validate, preview, reset and persist report assets", async ({ page }) => {
  1859 |   await loginAs(page, "admin@example.com");
  1860 |   await page.locator(".role-nav").getByRole("button", { name: "Admin Console", exact: true }).click();
  1861 |   await page.getByRole("tab", { name: "Company Settings", exact: true }).click();
  1862 |   await page.getByLabel("Company name").fill("E2E Auto Studio");
  1863 |   await page.getByLabel("Terms / footer").fill("E2E footer terms");
  1864 |   await page.getByLabel("Address").fill("9 Test Road");
  1865 | 
  1866 |   const logo = page.locator(".company-image-field").filter({ hasText: "Company logo" });
  1867 |   const fileInput = logo.locator('input[type="file"]');
  1868 |   await fileInput.setInputFiles({ name: "logo.png", mimeType: "image/png", buffer: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", "base64") });
  1869 |   const preview = logo.getByRole("img", { name: "Company logo preview" });
  1870 |   await expect(preview).toHaveAttribute("src", /^data:image\/png;base64,/);
  1871 |   const validSrc = await preview.getAttribute("src");
  1872 |   await fileInput.setInputFiles({ name: "bad.txt", mimeType: "text/plain", buffer: Buffer.from("not an image") });
  1873 |   await expect(page.getByRole("alert")).toContainText("must be a PNG or JPEG");
  1874 |   await expect(preview).toHaveAttribute("src", validSrc!);
  1875 | 
  1876 |   await page.getByRole("button", { name: "Save Company Settings" }).click();
  1877 |   await expect(page.getByText("Company settings saved for this session.")).toBeVisible();
  1878 |   await logo.getByRole("button", { name: "Clear" }).click();
  1879 |   await expect(preview).toHaveCount(0);
  1880 |   page.once("dialog", (dialog) => dialog.accept());
  1881 |   await page.getByRole("button", { name: "Reset to Saved" }).click();
  1882 |   await expect(logo.getByRole("img", { name: "Company logo preview" })).toBeVisible();
  1883 | 
  1884 |   await page.reload();
  1885 |   await loginAs(page, "admin@example.com");
  1886 |   await page.locator(".role-nav").getByRole("button", { name: "Admin Console", exact: true }).click();
  1887 |   await page.getByRole("tab", { name: "Company Settings", exact: true }).click();
  1888 |   await expect(page.getByLabel("Company name")).toHaveValue("E2E Auto Studio");
  1889 |   await expect(page.getByLabel("Terms / footer")).toHaveValue("E2E footer terms");
  1890 |   await expect(page.getByLabel("Address")).toHaveValue("9 Test Road");
```