# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workshopos.spec.ts >> Team Structure creates departments and manages appointed manager advisor teams responsively
- Location: tests\workshopos.spec.ts:1800:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.management-table tbody tr').filter({ hasText: 'team.manager@example.com' })
Expected substring: "Manager · Collision Repair East"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" locator('.management-table tbody tr').filter({ hasText: 'team.manager@example.com' }) with timeout 5000ms
  - waiting for locator('.management-table tbody tr').filter({ hasText: 'team.manager@example.com' })

```

```yaml
- complementary:
  - strong: WorkshopOS
  - text: Workshop Management. Simplified.
  - button "Hide left menu"
  - text: Owner/Admin
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
  - button "Logout"
- main:
  - paragraph: Owner/Admin
  - heading "Control room for linked workflow, blockers and cash." [level=1]
  - text: admin@example.com
  - heading "Admin Console" [level=2]
  - paragraph: Owner/Admin configuration for this demo session
  - tablist "Admin Console tabs":
    - tab "Users" [selected]
    - tab "Team Structure"
    - tab "Service Task"
    - tab "Roles & Page Access"
    - tab "Business Settings"
    - tab "App Theme"
    - tab "Company Settings"
    - tab "Report Templates"
    - tab "Inventory Import"
    - tab "Support & Logs"
  - tabpanel:
    - heading "Users" [level=3]
    - button "Add User"
    - text: Search
    - textbox "Search users":
      - /placeholder: Name, email or role
    - text: Role
    - combobox "Filter users by role":
      - option "All roles" [selected]
      - option "Owner/Admin"
      - option "Service Advisor"
      - option "Service Department Manager"
      - option "Reception"
      - option "Accounts"
      - option "Store"
      - option "Technician"
    - text: Status
    - combobox "Filter users by status":
      - option "All statuses" [selected]
      - option "Active"
      - option "Archived"
    - group "Search actions":
      - button "Clear"
    - button "Download"
    - text: Showing 1 to 10 of 12 Per page
    - combobox "User records per page":
      - option "10" [selected]
      - option "20"
      - option "50"
    - navigation "Results pagination":
      - button "First page" [disabled]
      - button "Previous page" [disabled]
      - button "Page 1": "1"
      - button "Page 2": "2"
      - button "Next page"
      - button "Last page"
    - table "User manager":
      - rowgroup:
        - row "Name Email Role Status Actions":
          - columnheader "Name"
          - columnheader "Email"
          - columnheader "Role"
          - columnheader "Status"
          - columnheader "Actions"
      - rowgroup:
        - row "Owner/Admin admin@example.com Owner/Admin Active Edit Archive":
          - cell "Owner/Admin"
          - cell "admin@example.com"
          - cell "Owner/Admin"
          - cell "Active"
          - cell "Edit Archive":
            - button "Edit"
            - button "Archive" [disabled]
        - row "Service advisor 1 service@example.com Service Advisor Active Edit Archive":
          - cell "Service advisor 1"
          - cell "service@example.com"
          - cell "Service Advisor"
          - cell "Active"
          - cell "Edit Archive":
            - button "Edit"
            - button "Archive"
        - row "Reception Desk reception@example.com Reception Active Edit Archive":
          - cell "Reception Desk"
          - cell "reception@example.com"
          - cell "Reception"
          - cell "Active"
          - cell "Edit Archive":
            - button "Edit"
            - button "Archive"
        - row "Accounts Desk accounts@example.com Accounts Active Edit Archive":
          - cell "Accounts Desk"
          - cell "accounts@example.com"
          - cell "Accounts"
          - cell "Active"
          - cell "Edit Archive":
            - button "Edit"
            - button "Archive"
        - row "Store Counter store@example.com Store Active Edit Archive":
          - cell "Store Counter"
          - cell "store@example.com"
          - cell "Store"
          - cell "Active"
          - cell "Edit Archive":
            - button "Edit"
            - button "Archive"
        - row "Technician Bay tech@example.com Technician Active Edit Archive":
          - cell "Technician Bay"
          - cell "tech@example.com"
          - cell "Technician"
          - cell "Active"
          - cell "Edit Archive":
            - button "Edit"
            - button "Archive"
        - row "Service advisor AA advisor.aa@example.com Service Advisor Active Edit Archive":
          - cell "Service advisor AA"
          - cell "advisor.aa@example.com"
          - cell "Service Advisor"
          - cell "Active"
          - cell "Edit Archive":
            - button "Edit"
            - button "Archive"
        - row "Service advisor BB1 advisor.bb1@example.com Service Advisor Active Edit Archive":
          - cell "Service advisor BB1"
          - cell "advisor.bb1@example.com"
          - cell "Service Advisor"
          - cell "Active"
          - cell "Edit Archive":
            - button "Edit"
            - button "Archive"
        - row "General Service Manager Manager · General Service Work general.service.manager@example.com Service Department Manager Active Edit Archive":
          - cell "General Service Manager Manager · General Service Work"
          - cell "general.service.manager@example.com"
          - cell "Service Department Manager"
          - cell "Active"
          - cell "Edit Archive":
            - button "Edit"
            - button "Archive"
        - row "PPF/Paint Manager Manager · PPF/Paint Work ppf.paint.manager@example.com Service Department Manager Active Edit Archive":
          - cell "PPF/Paint Manager Manager · PPF/Paint Work"
          - cell "ppf.paint.manager@example.com"
          - cell "Service Department Manager"
          - cell "Active"
          - cell "Edit Archive":
            - button "Edit"
            - button "Archive"
    - navigation "Results pagination":
      - button "First page" [disabled]
      - button "Previous page" [disabled]
      - button "Page 1": "1"
      - button "Page 2": "2"
      - button "Next page"
      - button "Last page"
```

# Test source

```ts
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
> 1842 |   await expect(page.locator(".management-table tbody tr").filter({ hasText: "team.manager@example.com" })).toContainText("Manager · Collision Repair East");
       |                                                                                                            ^ Error: expect(locator).toContainText(expected) failed
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
  1891 |   await expect(page.getByRole("img", { name: "Company logo preview" })).toBeVisible();
  1892 | });
  1893 | 
  1894 | test("App Theme previews, saves live UI tokens, and restores the default", async ({ page }) => {
  1895 |   await loginAs(page, "admin@example.com");
  1896 |   await page.locator(".role-nav").getByRole("button", { name: "Admin Console", exact: true }).click();
  1897 |   await page.getByRole("tab", { name: "App Theme", exact: true }).click();
  1898 |   const font = page.getByRole("combobox", { name: "Application font" });
  1899 |   await font.fill("Georgia");
  1900 |   await page.getByRole("option", { name: "Georgia", exact: true }).click();
  1901 |   await page.getByRole("button", { name: "Go Blue", exact: true }).click();
  1902 |   await expect(page.getByLabel("App theme preview")).toHaveCSS("font-family", /Georgia/);
  1903 |   await page.getByRole("button", { name: "Save App Theme", exact: true }).click();
  1904 |   await expect(page.getByText("App theme saved for this session.")).toBeVisible();
  1905 |   await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  1906 |   await page.getByRole("group", { name: "View mode" }).getByRole("button", { name: "Table", exact: true }).click();
  1907 |   await expect(page.locator(".rail")).toHaveCSS("background-color", "rgb(220, 236, 255)");
  1908 |   await expect(page.locator(".role-nav button.active")).toHaveCSS("background-color", "rgb(200, 225, 255)");
  1909 |   await expect(page.locator("table th").first()).toHaveCSS("background-color", "rgb(212, 232, 251)");
  1910 |   await expect(page.locator(".app-shell")).toHaveCSS("font-family", /Georgia/);
  1911 | 
  1912 |   await page.locator(".role-nav").getByRole("button", { name: "Admin Console", exact: true }).click();
  1913 |   await page.getByRole("tab", { name: "App Theme", exact: true }).click();
  1914 |   await page.getByRole("button", { name: "Set to Default", exact: true }).click();
  1915 |   await page.getByRole("button", { name: "Save App Theme", exact: true }).click();
  1916 |   await expect(page.locator(".rail")).toHaveCSS("background-color", "rgb(225, 241, 235)");
  1917 |   await expect(page.locator(".app-shell")).toHaveCSS("font-family", /Inter/);
  1918 | });
  1919 | 
  1920 | test("tax and billing settings validate, normalize, persist, audit and drive invoice print", async ({ page }) => {
  1921 |   await loginAs(page, "admin@example.com");
  1922 |   await page.locator(".role-nav").getByRole("button", { name: "Admin Console", exact: true }).click();
  1923 |   await page.getByRole("tab", { name: "Business Settings", exact: true }).click();
  1924 |   await page.getByRole("tab", { name: "Tax & Billing", exact: true }).click();
  1925 | 
  1926 |   await page.getByLabel("GSTIN", { exact: true }).fill("invalid");
  1927 |   await page.getByLabel("IFSC", { exact: true }).fill("invalid");
  1928 |   await page.getByLabel("UPI ID", { exact: true }).fill("invalid");
  1929 |   await page.getByRole("button", { name: "Save Settings" }).click();
  1930 |   await expect(page.getByRole("alert")).toContainText("GSTIN must be a valid");
  1931 |   await expect(page.getByRole("alert")).toContainText("IFSC must contain");
  1932 |   await expect(page.getByRole("alert")).toContainText("UPI ID must use");
  1933 | 
  1934 |   await page.getByLabel("GSTIN", { exact: true }).fill(" 21abcde1234f1z5 ");
  1935 |   await page.getByLabel("Account holder", { exact: true }).fill("  E2E Auto Studio  ");
  1936 |   await page.getByLabel("Bank name", { exact: true }).fill("  Saved E2E Bank  ");
  1937 |   await page.getByLabel("Account number", { exact: true }).fill(" 001234567890 ");
  1938 |   await page.getByLabel("IFSC", { exact: true }).fill(" sbin0001234 ");
  1939 |   await page.getByLabel("Bank branch", { exact: true }).fill(" <Unsafe Branch> ");
  1940 |   await page.getByLabel("UPI ID", { exact: true }).fill(" e2e@sbi ");
  1941 |   await page.getByRole("button", { name: "Save Settings" }).click();
  1942 |   await expect(page.getByText("Settings saved for this session.")).toBeVisible();
```