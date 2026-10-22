# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workshopos.spec.ts >> job documents download financial PDFs, print other templated reports and explain blocked popups
- Location: tests\workshopos.spec.ts:2025:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('.record-card').first().locator('.doc-chip')
Expected: 4
Received: 0
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" locator('.record-card').first().locator('.doc-chip') with timeout 5000ms
  - waiting for locator('.record-card').first().locator('.doc-chip')
    14 × locator resolved to 0 elements
       - unexpected value "0"

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
      - button "Job Cards" [active] [ref=f1e39] [cursor=pointer]
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
    - generic [ref=f1e84]:
      - generic [ref=f1e85]:
        - generic [ref=f1e86]:
          - heading "Job Cards" [level=2] [ref=f1e87]
          - paragraph [ref=f1e88]: Browse and manage job cards
        - button "Add Job Card" [ref=f1e89] [cursor=pointer]
      - generic [ref=f1e92]:
        - generic [ref=f1e93]:
          - generic [ref=f1e94]:
            - text: Search
            - textbox "Search job cards" [ref=f1e95]:
              - /placeholder: Job, vehicle, customer or mobile
          - generic [ref=f1e96]:
            - text: Main status
            - combobox "Main status" [ref=f1e97]:
              - option "All statuses"
              - option "NEW"
              - option "IN_PROGRESS"
              - option "COMPLETED"
              - option "CANCELLED"
              - option "CLOSED" [selected]
          - generic [ref=f1e98]:
            - text: Workflow
            - combobox "Workflow status" [ref=f1e99]:
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
          - generic [ref=f1e100]:
            - text: Estimated Delivery Date
            - textbox "Estimated delivery date" [ref=f1e101]
          - generic [ref=f1e102]:
            - text: Estimated Delivery Month-Year
            - combobox "Estimated delivery month-year" [ref=f1e103]:
              - option "All months"
              - option "October 2026" [selected]
        - generic [ref=f1e104]:
          - generic [ref=f1e105]:
            - text: Service advisor
            - combobox "Service advisor filter" [ref=f1e106]:
              - option "All advisors" [selected]
              - option "Service advisor 1"
              - option "Service advisor AA"
              - option "Service advisor BB1"
          - generic [ref=f1e107]:
            - text: Sort
            - combobox "Sort results" [ref=f1e108]:
              - option "Newest" [selected]
              - option "Oldest"
              - option "Estimated delivery (soonest)"
              - option "Estimated delivery (latest)"
              - option "Amount (high to low)"
              - option "Amount (low to high)"
          - generic [ref=f1e109]:
            - generic [ref=f1e110]: Show archived only
            - switch "Show archived only" [ref=f1e111] [cursor=pointer]
          - group "Search actions" [ref=f1e114]:
            - button "Clear" [ref=f1e115] [cursor=pointer]
      - generic [ref=f1e116]:
        - generic [ref=f1e117]:
          - button "Download" [disabled] [ref=f1e119]
          - group "View mode" [ref=f1e123]:
            - button "Grid" [pressed] [ref=f1e124] [cursor=pointer]
            - button "Table" [ref=f1e125] [cursor=pointer]
        - generic [ref=f1e126]: Showing 0 to 0 of 0
        - generic [ref=f1e127]:
          - generic [ref=f1e128]:
            - text: Per page
            - combobox "Records per page" [ref=f1e129]:
              - option "10" [selected]
              - option "20"
              - option "50"
          - navigation "Results pagination" [ref=f1e130]:
            - button "First page" [disabled] [ref=f1e131]
            - button "Previous page" [disabled] [ref=f1e134]
            - button "Page 1" [ref=f1e138] [cursor=pointer]: "1"
            - button "Next page" [disabled] [ref=f1e139]
            - button "Last page" [disabled] [ref=f1e142]
      - generic [ref=f1e145]:
        - heading "No matching records" [level=3] [ref=f1e146]
        - paragraph [ref=f1e147]: Adjust the search or clear the filters.
        - button "Clear filters" [ref=f1e148] [cursor=pointer]
      - navigation "Results pagination" [ref=f1e149]:
        - button "First page" [disabled] [ref=f1e150]
        - button "Previous page" [disabled] [ref=f1e153]
        - button "Page 1" [ref=f1e157] [cursor=pointer]: "1"
        - button "Next page" [disabled] [ref=f1e158]
        - button "Last page" [disabled] [ref=f1e161]
```

# Test source

```ts
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
  1969 |   await page.locator(".record-card").first().getByRole("button", { name: "View", exact: true }).click();
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
> 2032 |   await expect(page.locator(".record-card").first().locator(".doc-chip")).toHaveCount(4);
       |                                                                           ^ Error: expect(locator).toHaveCount(expected) failed
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
  2070 |   await expect(editor.getByRole("region", { name: "Current job documents" })).toBeVisible();
  2071 |   await expect(editor.getByRole("region", { name: "Current job documents" }).getByText("Job Card", { exact: true })).toBeVisible();
  2072 |   await expect(editor.getByText(/remaining:|All steps complete/)).toBeVisible();
  2073 |   await expect(editor.getByRole("button", { name: "Start Rework" })).toBeVisible();
  2074 |   await editor.getByRole("button", { name: "Start Rework" }).click();
  2075 |   const confirmation = page.getByRole("dialog", { name: "Start Rework?" });
  2076 |   const note = confirmation.getByLabel("Confirmation note");
  2077 |   await expect(note).toBeFocused();
  2078 |   await confirmation.getByRole("button", { name: "Confirm status change" }).click();
  2079 |   await expect(confirmation.getByRole("alert")).toHaveText("A confirmation note is required.");
  2080 |   await note.fill("Customer requested cancellation");
  2081 |   await confirmation.getByRole("button", { name: "Go Back", exact: true }).click();
  2082 |   await expect(confirmation).toBeHidden();
  2083 | });
  2084 | 
  2085 | test("lifecycle surfaces provide keyboard tabs, stacked dialogs, accessible names and mobile containment", async ({ page }) => {
  2086 |   test.setTimeout(60_000);
  2087 |   await page.setViewportSize({ width: 390, height: 844 });
  2088 |   await loginAs(page, "admin@example.com");
  2089 |   await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  2090 |   await page.getByRole("button", { name: "Show filters", exact: true }).click();
  2091 |   await page.getByLabel("Search job cards").fill("JC-2026-001247");
  2092 |   const editCard = page.locator(".record-card").filter({ hasText: "JC-2026-001247" });
  2093 |   const editTrigger = editCard.getByRole("button", { name: "Edit", exact: true });
  2094 |   await editTrigger.click();
  2095 |   const jobDialog = page.getByRole("dialog", { name: /Edit Job/ });
  2096 |   await expect(jobDialog).toBeVisible();
  2097 |   await expect(jobDialog.getByRole("tab", { name: "Details" })).toHaveAttribute("tabindex", "0");
  2098 |   await jobDialog.getByRole("tab", { name: "Details" }).focus();
  2099 |   await page.keyboard.press("ArrowRight");
  2100 |   await page.keyboard.press("ArrowRight");
  2101 |   await page.keyboard.press("ArrowRight");
  2102 |   await expect(jobDialog.getByRole("tab", { name: "Materials" })).toHaveAttribute("aria-selected", "true");
  2103 |   await page.keyboard.press("ArrowRight");
  2104 |   await page.keyboard.press("ArrowRight");
  2105 |   await expect(jobDialog.getByRole("tab", { name: "Photos / Media" })).toHaveAttribute("aria-selected", "true");
  2106 |   await expect(jobDialog.getByRole("tabpanel", { name: "Photos / Media" })).toBeVisible();
  2107 |   const before = jobDialog.getByRole("tab", { name: "Before Work" });
  2108 |   await before.focus();
  2109 |   await page.keyboard.press("ArrowRight");
  2110 |   await expect(jobDialog.getByRole("tab", { name: "After Work" })).toHaveAttribute("aria-selected", "true");
  2111 |   await jobDialog.getByRole("tab", { name: "Details" }).click();
  2112 | 
  2113 |   const lifecycle = jobDialog.getByRole("region", { name: "Job lifecycle" });
  2114 |   const action = lifecycle.getByRole("button", { name: /Cancel Job|Start Work|Complete Work|Start Rework|Close Job|Reopen Job/ }).first();
  2115 |   await action.click();
  2116 |   const confirmation = page.getByRole("dialog", { name: /\?$/ });
  2117 |   await expect(page.getByRole("dialog")).toHaveCount(2);
  2118 |   const note = confirmation.getByLabel("Confirmation note");
  2119 |   await expect(note).toBeFocused();
  2120 |   await page.keyboard.press("Shift+Tab");
  2121 |   await expect(confirmation.getByRole("button", { name: "Go Back" })).toBeFocused();
  2122 |   await page.keyboard.press("Escape");
  2123 |   await expect(confirmation).toBeHidden();
  2124 |   await expect(jobDialog).toBeVisible();
  2125 |   await expect(action).toBeFocused();
  2126 |   expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");
  2127 |   await expectNoPageOverflow(page);
  2128 |   await page.keyboard.press("Escape");
  2129 |   await expect(jobDialog).toBeHidden();
  2130 |   await expect(editTrigger).toBeFocused();
  2131 | 
  2132 |   await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
```