# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workshopos.spec.ts >> job lifecycle editor is ordered, status is read-only, and every action requires a confirmation note
- Location: tests\workshopos.spec.ts:2058:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('dialog', { name: /Edit Job/ }).getByRole('button', { name: 'Start Rework' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('dialog', { name: /Edit Job/ }).getByRole('button', { name: 'Start Rework' }) with timeout 5000ms
  - waiting for getByRole('dialog', { name: /Edit Job/ }).getByRole('button', { name: 'Start Rework' })

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
  - dialog "Edit Job JC-2026-001392":
    - heading "Edit Job JC-2026-001392" [level=2]
    - paragraph: OD04DM1003 · Demo Customer 003
    - region "Job lifecycle":
      - text: NEW JC-2026-001392 · OD04DM1003
      - button "Start Work"
      - button "Cancel Job"
      - heading "Lifecycle Checklist" [level=2]
      - paragraph: NEW · cycle 1
      - paragraph: "2 remaining: Create Estimate → Get Confirmation"
      - list:
        - listitem:
          - checkbox "Gather Requirements Completed 2 Oct 2026, 12:55 pm by System" [checked]
          - strong: Gather Requirements
          - text: Completed 2 Oct 2026, 12:55 pm by System
        - listitem:
          - checkbox "Create Estimate Started 2 Oct 2026, 12:55 pm" [disabled]
          - strong: Create Estimate
          - text: Started 2 Oct 2026, 12:55 pm
        - listitem:
          - checkbox "Get Confirmation Waiting for the previous step" [disabled]
          - strong: Get Confirmation
          - text: Waiting for the previous step
          - button "Mark N/A"
    - tablist "Job record sections":
      - tab "Details"
      - tab "Task List"
      - tab "Body Mark"
      - tab "Materials"
      - tab "Documents" [selected]
      - tab "Photos / Media"
      - tab "Invoice"
      - tab "Payment"
    - tabpanel "Documents":
      - region "Current job documents":
        - strong: Job Card
        - text: JC-2026-001392 - ready
        - group "Job Card actions":
          - button "Download PDF"
          - button "Print"
        - strong: Estimate
        - text: Estimate not created
        - group "Estimate actions":
          - button "Create Estimate"
        - strong: Invoice
        - text: Invoice not created - approve an estimate first
        - group "Invoice actions"
        - strong: Payment Receipt
        - text: Payment Receipt not created - created when a payment is recorded
        - group "Payment Receipt actions"
        - strong: Gate Pass
        - text: Gate Pass not created - created when the job is closed
        - group "Gate Pass actions"
    - button "Go Back"
  - heading "Job Cards" [level=2]
  - paragraph: Browse and manage job cards
  - button "Add Job Card"
  - text: Search
  - textbox "Search job cards":
    - /placeholder: Job, vehicle, customer or mobile
  - text: Main status
  - combobox "Main status":
    - option "All statuses" [selected]
    - option "NEW"
    - option "IN_PROGRESS"
    - option "COMPLETED"
    - option "CANCELLED"
    - option "CLOSED"
  - text: Workflow
  - combobox "Workflow status":
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
  - text: Estimated Delivery Date
  - textbox "Estimated delivery date"
  - text: Estimated Delivery Month-Year
  - combobox "Estimated delivery month-year":
    - option "All months"
    - option "October 2026" [selected]
  - text: Service advisor
  - combobox "Service advisor filter":
    - option "All advisors" [selected]
    - option "Service advisor 1"
    - option "Service advisor AA"
    - option "Service advisor BB1"
  - text: Sort
  - combobox "Sort results":
    - option "Newest" [selected]
    - option "Oldest"
    - option "Estimated delivery (soonest)"
    - option "Estimated delivery (latest)"
    - option "Amount (high to low)"
    - option "Amount (low to high)"
  - text: Show archived only
  - switch "Show archived only"
  - group "Search actions":
    - button "Clear"
  - button "Download"
  - group "View mode":
    - button "Grid" [pressed]
    - button "Table"
  - text: Showing 1 to 10 of 91 Per page
  - combobox "Records per page":
    - option "10" [selected]
    - option "20"
    - option "50"
  - navigation "Results pagination":
    - button "First page" [disabled]
    - button "Previous page" [disabled]
    - button "Page 1": "1"
    - button "Page 2": "2"
    - button "Page 3": "3"
    - button "Page 4": "4"
    - button "Page 5": "5"
    - button "Page 10": "10"
    - button "Next page"
    - button "Last page"
  - article:
    - strong: OD04DM1003
    - text: Tata Nexon
    - heading "JC-2026-001392" [level=3]
    - paragraph: Demo Customer 003 · 8100000003
    - text: NEW · Create Estimate Est Inv Rcpt GP Total
    - strong: Rs 0
    - text: Estimated Delivery Date
    - strong: 2026-10-09
    - button "View"
    - button "Edit"
    - button "Archive"
  - article:
    - strong: OD07DM1006
    - text: Toyota Fortuner
    - heading "JC-2026-002138" [level=3]
    - paragraph: Demo Customer 006 · 8100000006
    - text: IN PROGRESS · QC Pending Est Inv Rcpt GP Total
    - strong: Rs 9,440
    - text: Estimated Delivery Date
    - strong: 2026-10-09
    - button "View"
    - button "Edit"
    - button "Archive"
  - article:
    - strong: OD06DM1005
    - text: Honda City
    - heading "JC-2026-002137" [level=3]
    - paragraph: Demo Customer 005 · 8100000005
    - text: IN PROGRESS · Photos Shared Est Inv Rcpt GP Total
    - strong: Rs 8,555
    - text: Estimated Delivery Date
    - strong: 2026-10-31
    - button "View"
    - button "Edit"
    - button "Archive"
  - article:
    - strong: OD05DM1004
    - text: Maruti Brezza
    - heading "JC-2026-002136" [level=3]
    - paragraph: Demo Customer 004 · 8100000004
    - text: IN PROGRESS · Follow-up Needed Est Inv Rcpt GP Total
    - strong: Rs 7,080
    - text: Estimated Delivery Date
    - strong: 2026-10-13
    - button "View"
    - button "Edit"
    - button "Archive"
  - article:
    - strong: OD04DM1003
    - text: Tata Nexon
    - heading "JC-2026-002135" [level=3]
    - paragraph: Demo Customer 003 · 8100000003
    - text: IN PROGRESS · Work Started Est Inv Rcpt GP Total
    - strong: Rs 6,785
    - text: Estimated Delivery Date
    - strong: 2026-10-11
    - button "View"
    - button "Edit"
    - button "Archive"
  - article:
    - strong: OD03DM1002
    - text: Mahindra Thar
    - heading "JC-2026-002134" [level=3]
    - paragraph: Demo Customer 002 · 8100000002
    - text: IN PROGRESS · Washing Needed Est Inv Rcpt GP Total
    - strong: Rs 5,900
    - text: Estimated Delivery Date
    - strong: 2026-10-30
    - button "View"
    - button "Edit"
    - button "Archive"
  - article:
    - strong: OD02DM1001
    - text: Hyundai Creta
    - heading "JC-2026-002133" [level=3]
    - paragraph: Demo Customer 001 · 8100000001
    - text: IN PROGRESS · Material Issued Est Inv Rcpt GP Total
    - strong: Rs 5,015
    - text: Estimated Delivery Date
    - strong: 2026-10-12
    - button "View"
    - button "Edit"
    - button "Archive"
  - article:
    - strong: OD13DM1132
    - text: Maruti Brezza
    - heading "JC-2026-002132" [level=3]
    - paragraph: Demo Customer 012 · 8100000012
    - text: IN PROGRESS · Material Requested Est Inv Rcpt GP Total
    - strong: Rs 3,540
    - text: Estimated Delivery Date
    - strong: 2026-10-10
    - button "View"
    - button "Edit"
    - button "Archive"
  - article:
    - strong: OD12DM1131
    - text: Tata Nexon
    - heading "JC-2026-002131" [level=3]
    - paragraph: Demo Customer 011 · 8100000011
    - text: NEW · Get Confirmation Est Inv Rcpt GP Total
    - strong: Rs 13,865
    - text: Estimated Delivery Date
    - strong: 2026-10-29
    - button "View"
    - button "Edit"
    - button "Archive"
  - article:
    - strong: OD11DM1130
    - text: Mahindra Thar
    - heading "JC-2026-002130" [level=3]
    - paragraph: Demo Customer 010 · 8100000010
    - text: NEW · Create Estimate Est Inv Rcpt GP Total
    - strong: Rs 12,980
    - text: Estimated Delivery Date
    - strong: 2026-10-18
    - button "View"
    - button "Edit"
    - button "Archive"
  - navigation "Results pagination":
    - button "First page" [disabled]
    - button "Previous page" [disabled]
    - button "Page 1": "1"
    - button "Page 2": "2"
    - button "Page 3": "3"
    - button "Page 4": "4"
    - button "Page 5": "5"
    - button "Page 10": "10"
    - button "Next page"
    - button "Last page"
```

# Test source

```ts
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
  2070 |   await expect(editor.getByRole("region", { name: "Current job documents" })).toBeVisible();
  2071 |   await expect(editor.getByRole("region", { name: "Current job documents" }).getByText("Job Card", { exact: true })).toBeVisible();
  2072 |   await expect(editor.getByText(/remaining:|All steps complete/)).toBeVisible();
> 2073 |   await expect(editor.getByRole("button", { name: "Start Rework" })).toBeVisible();
       |                                                                      ^ Error: expect(locator).toBeVisible() failed
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
```