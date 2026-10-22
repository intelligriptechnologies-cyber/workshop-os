# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workshopos.spec.ts >> lifecycle surfaces provide keyboard tabs, stacked dialogs, accessible names and mobile containment
- Location: tests\workshopos.spec.ts:2085:1

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: locator.click: Test timeout of 60000ms exceeded.
Call log:
  - waiting for locator('.record-card').filter({ hasText: 'JC-2026-001247' }).getByRole('button', { name: 'Edit', exact: true })

```

# Page snapshot

```yaml
- generic [ref=f1e3]:
  - complementary [ref=f1e4]:
    - navigation "Owner/Admin menu" [ref=f1e5]:
      - button "Dashboard" [ref=f1e6] [cursor=pointer]
      - button "Advance Bookings" [ref=f1e11] [cursor=pointer]
      - button "Approvals (0)" [ref=f1e15] [cursor=pointer]
      - button "Data Flow" [ref=f1e20] [cursor=pointer]
      - button "Job Cards" [ref=f1e26] [cursor=pointer]
      - button "Media" [ref=f1e31] [cursor=pointer]
      - button "Purchase Orders" [ref=f1e36] [cursor=pointer]
      - button "Manage" [ref=f1e40] [cursor=pointer]
      - button "Search" [ref=f1e45] [cursor=pointer]
      - button "Admin Console" [ref=f1e50] [cursor=pointer]
      - group [ref=f1e55]:
        - generic "Sales CRM" [ref=f1e56] [cursor=pointer]
  - main [ref=f1e57]:
    - generic [ref=f1e58]:
      - generic [ref=f1e59]:
        - paragraph [ref=f1e60]: Owner/Admin
        - heading "Control room for linked workflow, blockers and cash." [level=1] [ref=f1e61]
      - generic [ref=f1e62]: admin@example.com
      - button "Logout" [ref=f1e66] [cursor=pointer]
    - generic [ref=f1e70]:
      - generic [ref=f1e71]:
        - generic [ref=f1e72]:
          - heading "Job Cards" [level=2] [ref=f1e73]
          - paragraph [ref=f1e74]: Browse and manage job cards
        - button "Add Job Card" [ref=f1e75] [cursor=pointer]
      - generic [ref=f1e76]:
        - button "Hide filters" [expanded] [ref=f1e77] [cursor=pointer]
        - generic [ref=f1e79]:
          - generic [ref=f1e80]:
            - generic [ref=f1e81]:
              - text: Search
              - textbox "Search job cards" [active] [ref=f1e82]:
                - /placeholder: Job, vehicle, customer or mobile
                - text: JC-2026-001247
            - generic [ref=f1e83]:
              - text: Main status
              - combobox "Main status" [ref=f1e84]:
                - option "All statuses" [selected]
                - option "NEW"
                - option "IN_PROGRESS"
                - option "COMPLETED"
                - option "CANCELLED"
                - option "CLOSED"
            - generic [ref=f1e85]:
              - text: Workflow
              - combobox "Workflow status" [ref=f1e86]:
                - option "All workflows" [selected]
                - option "Create Estimate"
                - option "Delivered"
                - option "Follow-up Needed"
                - option "Gather Requirements"
                - option "Get Confirmation"
                - option "Invoice Ready"
                - option "Material Issued"
                - option "Material Requested"
                - option "Photos Shared"
                - option "QC Pending"
                - option "Remind Customer for Sharing Google Review/Feedback"
                - option "Washing Needed"
                - option "Work Started"
            - generic [ref=f1e87]:
              - text: Estimated Delivery Date
              - textbox "Estimated delivery date" [ref=f1e88]
            - generic [ref=f1e89]:
              - text: Estimated Delivery Month-Year
              - combobox "Estimated delivery month-year" [ref=f1e90]:
                - option "All months"
                - option "October 2026" [selected]
          - generic [ref=f1e91]:
            - generic [ref=f1e92]:
              - text: Service advisor
              - combobox "Service advisor filter" [ref=f1e93]:
                - option "All advisors" [selected]
                - option "Service advisor 1"
                - option "Service advisor AA"
                - option "Service advisor BB1"
            - generic [ref=f1e94]:
              - text: Sort
              - combobox "Sort results" [ref=f1e95]:
                - option "Newest" [selected]
                - option "Oldest"
                - option "Estimated delivery (soonest)"
                - option "Estimated delivery (latest)"
                - option "Amount (high to low)"
                - option "Amount (low to high)"
            - generic [ref=f1e96]:
              - generic [ref=f1e97]: Show archived only
              - switch "Show archived only" [ref=f1e98] [cursor=pointer]
            - group "Search actions" [ref=f1e101]:
              - button "Clear" [ref=f1e102] [cursor=pointer]
      - generic [ref=f1e103]:
        - generic [ref=f1e104]:
          - button "Download" [disabled] [ref=f1e106]
          - group "View mode" [ref=f1e110]:
            - button "Grid" [pressed] [ref=f1e111] [cursor=pointer]
            - button "Table" [ref=f1e112] [cursor=pointer]
        - generic [ref=f1e113]: Showing 0 to 0 of 0
        - navigation "Results pagination" [ref=f1e115]:
          - button "First page" [disabled] [ref=f1e116]
          - button "Previous page" [disabled] [ref=f1e119]
          - generic [ref=f1e122]: Page 1 of 1
          - button "Next page" [disabled] [ref=f1e123]
          - button "Last page" [disabled] [ref=f1e126]
      - generic [ref=f1e129]:
        - heading "No matching records" [level=3] [ref=f1e130]
        - paragraph [ref=f1e131]: Adjust the search or clear the filters.
        - button "Clear filters" [ref=f1e132] [cursor=pointer]
      - navigation "Results pagination" [ref=f1e133]:
        - button "First page" [disabled] [ref=f1e134]
        - button "Previous page" [disabled] [ref=f1e137]
        - generic [ref=f1e140]: Page 1 of 1
        - button "Next page" [disabled] [ref=f1e141]
        - button "Last page" [disabled] [ref=f1e144]
```

# Test source

```ts
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
> 2094 |   await editTrigger.click();
       |                     ^ Error: locator.click: Test timeout of 60000ms exceeded.
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
  2133 |   const managementTabs = page.getByRole("tablist", { name: "Management areas" });
  2134 |   await managementTabs.getByRole("tab", { name: "Users", exact: true }).focus();
  2135 |   await page.keyboard.press("End");
  2136 |   await expect(managementTabs.getByRole("tab", { name: "Delivery", exact: true })).toHaveAttribute("aria-selected", "true");
  2137 |   await page.keyboard.press("Home");
  2138 |   await expect(managementTabs.getByRole("tab", { name: "Users", exact: true })).toHaveAttribute("aria-selected", "true");
  2139 |   await page.getByRole("tab", { name: "Estimates", exact: true }).click();
  2140 |   await page.getByLabel("Job results").selectOption({ index: 1 });
  2141 |   const estimateTrigger = page.getByRole("button", { name: /Edit Estimate|Create Estimate/ });
  2142 |   await estimateTrigger.click();
  2143 |   const estimate = page.getByRole("dialog", { name: /Estimate$/ });
  2144 |   await expect(estimate).toHaveClass(/dialog-document-editor/);
  2145 |   await expect(estimate.getByLabel("Discount")).toBeVisible();
  2146 |   await expect(estimate.getByLabel("Item 1 GST type")).toHaveValue("CGST+SGST");
  2147 |   await expect(estimate.getByLabel("Item 1 GST rate")).toHaveValue("18%");
  2148 |   await expectNoPageOverflow(page);
  2149 |   await page.keyboard.press("Escape");
  2150 |   await expect(estimateTrigger).toBeFocused();
  2151 | 
  2152 |   await page.locator(".role-nav").getByRole("button", { name: "Data Flow", exact: true }).click();
  2153 |   const combobox = page.getByRole("combobox", { name: "Find a job" });
  2154 |   await combobox.focus();
  2155 |   await page.keyboard.press("ArrowDown");
  2156 |   await expect(combobox).toHaveAttribute("aria-activedescendant", /data-flow-job-/);
  2157 |   await page.keyboard.press("Enter");
  2158 |   await expect(page.getByRole("region", { name: "Chronological data flow" })).toBeVisible();
  2159 |   await expectNoPageOverflow(page);
  2160 | });
  2161 | 
  2162 | test("estimate dialog stages item CRUD and persists only on Save", async ({ page }) => {
  2163 |   await loginAs(page, "admin@example.com");
  2164 |   await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  2165 |   await page.getByRole("tab", { name: "Estimates", exact: true }).click();
  2166 |   await page.getByLabel("Job results").selectOption({ index: 1 });
  2167 |   await page.getByRole("button", { name: "Edit Estimate" }).click();
  2168 |   let dialog = page.getByRole("dialog", { name: "Edit Estimate" });
  2169 |   const savedDescription = await dialog.getByLabel("Item 1 description").inputValue();
  2170 |   await dialog.getByLabel("Item 1 description").fill("Unsaved change");
  2171 |   await dialog.getByRole("button", { name: "Go Back", exact: true }).click();
  2172 |   await page.getByRole("button", { name: "Edit Estimate" }).click();
  2173 |   dialog = page.getByRole("dialog", { name: "Edit Estimate" });
  2174 |   await expect(dialog.getByLabel("Item 1 description")).toHaveValue(savedDescription);
  2175 |   await dialog.getByRole("button", { name: "Add Item" }).click();
  2176 |   await dialog.getByLabel("Item 2 kind").selectOption("Material");
  2177 |   await dialog.getByLabel("Item 2 description").fill("E2E polish");
  2178 |   await dialog.getByLabel("Item 2 quantity").fill("2");
  2179 |   await dialog.getByLabel("Item 2 rate").fill("250");
  2180 |   await dialog.getByLabel("Item 2 GST type").selectOption("IGST");
  2181 |   await dialog.getByLabel("Item 2 GST rate").click();
  2182 |   await dialog.getByRole("option", { name: "12%" }).click();
  2183 |   await dialog.getByLabel("Discount").fill("50");
  2184 |   await dialog.getByLabel("Notes").fill("E2E estimate note");
  2185 |   await dialog.getByRole("button", { name: "Save Estimate" }).click();
  2186 |   await expect(dialog).toBeHidden();
  2187 |   await expect(page.getByText("E2E polish")).toBeVisible();
  2188 |   await expect(page.getByText("E2E estimate note")).toBeVisible();
  2189 | });
  2190 | 
  2191 | test("service advisor Job Card defaults to the current delivery month", async ({ page }) => {
  2192 |   await page.clock.install({ time: new Date("2040-01-15T12:00:00") });
  2193 |   await loginAs(page, "service@example.com");
  2194 |   await page.locator(".role-nav").getByRole("button", { name: "My Queue", exact: true }).click();
```