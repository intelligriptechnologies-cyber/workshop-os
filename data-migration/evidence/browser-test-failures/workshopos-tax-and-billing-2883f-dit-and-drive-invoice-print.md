# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workshopos.spec.ts >> tax and billing settings validate, normalize, persist, audit and drive invoice print
- Location: tests\workshopos.spec.ts:1920:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.record-card').first().getByRole('button', { name: 'View', exact: true })

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
      - button "Job Cards" [active] [ref=f2e39] [cursor=pointer]
      - button "Media" [ref=f2e44] [cursor=pointer]
      - button "Purchase Orders" [ref=f2e49] [cursor=pointer]
      - button "Manage" [ref=f2e53] [cursor=pointer]
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
    - generic [ref=f2e84]:
      - generic [ref=f2e85]:
        - generic [ref=f2e86]:
          - heading "Job Cards" [level=2] [ref=f2e87]
          - paragraph [ref=f2e88]: Browse and manage job cards
        - button "Add Job Card" [ref=f2e89] [cursor=pointer]
      - generic [ref=f2e92]:
        - generic [ref=f2e93]:
          - generic [ref=f2e94]:
            - text: Search
            - textbox "Search job cards" [ref=f2e95]:
              - /placeholder: Job, vehicle, customer or mobile
          - generic [ref=f2e96]:
            - text: Main status
            - combobox "Main status" [ref=f2e97]:
              - option "All statuses"
              - option "NEW"
              - option "IN_PROGRESS"
              - option "COMPLETED"
              - option "CANCELLED"
              - option "CLOSED" [selected]
          - generic [ref=f2e98]:
            - text: Workflow
            - combobox "Workflow status" [ref=f2e99]:
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
          - generic [ref=f2e100]:
            - text: Estimated Delivery Date
            - textbox "Estimated delivery date" [ref=f2e101]
          - generic [ref=f2e102]:
            - text: Estimated Delivery Month-Year
            - combobox "Estimated delivery month-year" [ref=f2e103]:
              - option "All months"
              - option "October 2026" [selected]
        - generic [ref=f2e104]:
          - generic [ref=f2e105]:
            - text: Service advisor
            - combobox "Service advisor filter" [ref=f2e106]:
              - option "All advisors" [selected]
              - option "Service advisor 1"
              - option "Service advisor AA"
              - option "Service advisor BB1"
          - generic [ref=f2e107]:
            - text: Sort
            - combobox "Sort results" [ref=f2e108]:
              - option "Newest" [selected]
              - option "Oldest"
              - option "Estimated delivery (soonest)"
              - option "Estimated delivery (latest)"
              - option "Amount (high to low)"
              - option "Amount (low to high)"
          - generic [ref=f2e109]:
            - generic [ref=f2e110]: Show archived only
            - switch "Show archived only" [ref=f2e111] [cursor=pointer]
          - group "Search actions" [ref=f2e114]:
            - button "Clear" [ref=f2e115] [cursor=pointer]
      - generic [ref=f2e116]:
        - generic [ref=f2e117]:
          - button "Download" [disabled] [ref=f2e119]
          - group "View mode" [ref=f2e123]:
            - button "Grid" [pressed] [ref=f2e124] [cursor=pointer]
            - button "Table" [ref=f2e125] [cursor=pointer]
        - generic [ref=f2e126]: Showing 0 to 0 of 0
        - generic [ref=f2e127]:
          - generic [ref=f2e128]:
            - text: Per page
            - combobox "Records per page" [ref=f2e129]:
              - option "10" [selected]
              - option "20"
              - option "50"
          - navigation "Results pagination" [ref=f2e130]:
            - button "First page" [disabled] [ref=f2e131]
            - button "Previous page" [disabled] [ref=f2e134]
            - button "Page 1" [ref=f2e138] [cursor=pointer]: "1"
            - button "Next page" [disabled] [ref=f2e139]
            - button "Last page" [disabled] [ref=f2e142]
      - generic [ref=f2e145]:
        - heading "No matching records" [level=3] [ref=f2e146]
        - paragraph [ref=f2e147]: Adjust the search or clear the filters.
        - button "Clear filters" [ref=f2e148] [cursor=pointer]
      - navigation "Results pagination" [ref=f2e149]:
        - button "First page" [disabled] [ref=f2e150]
        - button "Previous page" [disabled] [ref=f2e153]
        - button "Page 1" [ref=f2e157] [cursor=pointer]: "1"
        - button "Next page" [disabled] [ref=f2e158]
        - button "Last page" [disabled] [ref=f2e161]
```

# Test source

```ts
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
  1943 |   await expect(page.getByLabel("GSTIN", { exact: true })).toHaveValue("21ABCDE1234F1Z5");
  1944 |   await expect(page.getByLabel("IFSC", { exact: true })).toHaveValue("SBIN0001234");
  1945 |   await expect(page.getByLabel("Account number", { exact: true })).toHaveValue("001234567890");
  1946 | 
  1947 |   await page.getByLabel("Bank name", { exact: true }).fill("Reset me");
  1948 |   page.once("dialog", (dialog) => dialog.accept());
  1949 |   await page.getByRole("button", { name: "Reset to Saved" }).click();
  1950 |   await expect(page.getByLabel("Bank name", { exact: true })).toHaveValue("Saved E2E Bank");
  1951 | 
  1952 |   await page.getByRole("tab", { name: "Support & Logs", exact: true }).click();
  1953 |   await page.getByRole("tab", { name: "Feature Activity", exact: true }).click();
  1954 |   await expect(page.getByText("Business settings saved", { exact: true })).toBeVisible();
  1955 | 
  1956 |   await page.reload();
  1957 |   await loginAs(page, "admin@example.com");
  1958 |   await page.locator(".role-nav").getByRole("button", { name: "Admin Console", exact: true }).click();
  1959 |   await page.getByRole("tab", { name: "Business Settings", exact: true }).click();
  1960 |   await page.getByRole("tab", { name: "Tax & Billing", exact: true }).click();
  1961 |   await expect(page.getByLabel("Bank name", { exact: true })).toHaveValue("Saved E2E Bank");
  1962 |   await page.getByLabel("Bank name", { exact: true }).fill("UNSAVED BANK");
  1963 | 
  1964 |   await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  1965 |   page.once("dialog", (dialog) => dialog.accept());
  1966 |   await page.getByRole("button", { name: "Load Large Demo Dataset" }).click();
  1967 |   await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  1968 |   await page.getByLabel("Main status").selectOption("CLOSED");
> 1969 |   await page.locator(".record-card").first().getByRole("button", { name: "View", exact: true }).click();
       |                                                                                                 ^ Error: locator.click: Test timeout of 30000ms exceeded.
  1970 |   await page.getByRole("tab", { name: "Documents" }).click();
  1971 |   const invoiceRow = page.locator(".document-row").filter({ has: page.getByText("Invoice", { exact: true }) });
  1972 |   const downloadPromise = page.waitForEvent("download");
  1973 |   await invoiceRow.getByRole("button", { name: "Download PDF" }).click();
  1974 |   expect((await downloadPromise).suggestedFilename()).toMatch(/-invoice\.pdf$/);
  1975 | });
  1976 | 
  1977 | test("report templates preview safely, validate, activate and persist", async ({ page }) => {
  1978 |   await loginAs(page, "admin@example.com");
  1979 |   await page.locator(".role-nav").getByRole("button", { name: "Admin Console", exact: true }).click();
  1980 |   await page.getByRole("tab", { name: "Report Templates", exact: true }).click();
  1981 | 
  1982 |   for (const category of ["estimate", "invoice", "gate-pass", "job-card", "payment-receipt"]) {
  1983 |     await page.getByLabel("Report category").selectOption(category);
  1984 |     await expect(page.locator(".template-preview")).toBeVisible();
  1985 |     await expect(page.getByLabel("Report template").locator("option:checked")).toContainText("(Active)");
  1986 |   }
  1987 | 
  1988 |   await page.getByLabel("Report category").selectOption("invoice");
  1989 |   await page.getByRole("button", { name: "New Template" }).click();
  1990 |   await page.getByLabel("Template name").fill("Compact Invoice");
  1991 |   await page.getByLabel("Template HTML").fill('<section onclick="alert(1)"><script>window.bad=1</script><img src="https://bad.example/logo.png"><h1>{{report.number}}</h1><p>{{customer.name}}</p></section>');
  1992 |   await page.getByText("Active template", { exact: true }).getByRole("checkbox").check();
  1993 | 
  1994 |   page.once("dialog", (dialog) => dialog.dismiss());
  1995 |   await page.getByLabel("Report category").selectOption("gate-pass");
  1996 |   await expect(page.getByLabel("Report category")).toHaveValue("invoice");
  1997 | 
  1998 |   const preview = page.frameLocator(".template-preview");
  1999 |   await expect(preview.getByRole("heading", { name: "INV-2026-0042" })).toBeVisible();
  2000 |   await expect(preview.locator("script")).toHaveCount(0);
  2001 |   await expect(preview.locator("img")).not.toHaveAttribute("src");
  2002 |   await expect(preview.locator("section")).not.toHaveAttribute("onclick");
  2003 | 
  2004 |   await page.getByLabel("Template HTML").fill("<p>{{unsupported.value}}</p>");
  2005 |   await page.getByRole("button", { name: "Create Template" }).click();
  2006 |   await expect(page.getByRole("alert").filter({ hasText: "unsupported.value" }).first()).toBeVisible();
  2007 |   await page.getByLabel("Template HTML").fill("<h1>{{report.number}}</h1><p>{{customer.name}}</p>{{blocks.line_items}}");
  2008 |   await page.getByRole("button", { name: "Create Template" }).click();
  2009 |   await expect(page.getByText("Template saved for this session.")).toBeVisible();
  2010 |   await expect(page.getByLabel("Report template").locator("option:checked")).toContainText("Compact Invoice (Active)");
  2011 | 
  2012 |   await page.getByLabel("Template name").fill("Dirty name");
  2013 |   page.once("dialog", (dialog) => dialog.dismiss());
  2014 |   await page.getByRole("tab", { name: "Business Settings", exact: true }).click();
  2015 |   await expect(page.getByRole("heading", { name: "Report Templates" })).toBeVisible();
  2016 |   await page.getByLabel("Template name").fill("Compact Invoice");
  2017 | 
  2018 |   await page.reload();
  2019 |   await loginAs(page, "admin@example.com");
  2020 |   await page.locator(".role-nav").getByRole("button", { name: "Admin Console", exact: true }).click();
  2021 |   await page.getByRole("tab", { name: "Report Templates", exact: true }).click();
  2022 |   await expect(page.getByLabel("Report template").locator("option:checked")).toContainText("Compact Invoice (Active)");
  2023 | });
  2024 | 
  2025 | test("job documents download financial PDFs, print other templated reports and explain blocked popups", async ({ page }) => {
  2026 |   await loginAs(page, "admin@example.com");
  2027 |   await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  2028 |   page.once("dialog", (dialog) => dialog.accept());
  2029 |   await page.getByRole("button", { name: "Load Large Demo Dataset" }).click();
  2030 |   await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  2031 |   await page.getByLabel("Main status").selectOption("CLOSED");
  2032 |   await expect(page.locator(".record-card").first().locator(".doc-chip")).toHaveCount(4);
  2033 |   await page.locator(".record-card").first().getByRole("button", { name: "View", exact: true }).click();
  2034 |   await page.getByRole("tab", { name: "Documents" }).click();
  2035 | 
  2036 |   for (const label of ["Job Card", "Payment Receipt", "Gate Pass", "Estimate", "Invoice"]) {
  2037 |     const row = page.locator(".document-row").filter({ has: page.getByText(label, { exact: true }) }).first();
  2038 |     const downloadPromise = page.waitForEvent("download");
  2039 |     await row.getByRole("button", { name: "Download PDF" }).click();
  2040 |     const download = await downloadPromise;
  2041 |     expect(download.suggestedFilename()).toMatch(new RegExp(`-${label.toLowerCase().replace(" ", "-")}\.pdf$`));
  2042 |     await expect(row.getByRole("button", { name: "Downloaded ✓" })).toBeVisible();
  2043 |   }
  2044 | 
  2045 |   const printRow = page.locator(".document-row").filter({ has: page.getByText("Payment Receipt", { exact: true }) }).first();
  2046 |   const popupPromise = page.waitForEvent("popup");
  2047 |   await printRow.getByRole("button", { name: "Print", exact: true }).click();
  2048 |   const popup = await popupPromise;
  2049 |   await popup.waitForLoadState("domcontentloaded");
  2050 |   await expect(popup.locator('meta[http-equiv="Content-Security-Policy"]')).toHaveAttribute("content", /default-src 'none'/);
  2051 |   await expect(popup.locator("body")).toContainText("PAYMENT RECEIPT");
  2052 |   await popup.close();
  2053 |   await page.evaluate(() => Object.defineProperty(window, "open", { configurable: true, value: () => null }));
  2054 |   await page.locator(".document-row").filter({ has: page.getByText("Job Card", { exact: true }) }).getByRole("button", { name: "Print", exact: true }).click();
  2055 |   await expect(page.getByRole("alert")).toContainText("Allow pop-ups");
  2056 | });
  2057 | 
  2058 | test("job lifecycle editor is ordered, status is read-only, and every action requires a confirmation note", async ({ page }) => {
  2059 |   await loginAs(page, "admin@example.com");
  2060 |   await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  2061 |   await page.locator(".record-card").first().getByRole("button", { name: "Edit", exact: true }).click();
  2062 |   const editor = page.getByRole("dialog", { name: /Edit Job/ });
  2063 |   await expect(editor.getByLabel("Main Status")).toBeDisabled();
  2064 |   await expect(editor.getByLabel("Sub Status")).toHaveCount(0);
  2065 |   await expect(editor.getByRole("region", { name: "Job lifecycle" }).locator(".lifecycle-checklist li")).toHaveCount(6);
  2066 |   await expect(editor.getByRole("tab")).toHaveText(["Details", "Task List", "Body Mark", "Materials", "Documents", "Photos / Media", "Invoice", "Payment"]);
  2067 |   await editor.getByRole("tab", { name: "Materials" }).click();
  2068 |   await expect(editor.getByRole("region", { name: "Job materials" })).toBeVisible();
  2069 |   await editor.getByRole("tab", { name: "Documents" }).click();
```