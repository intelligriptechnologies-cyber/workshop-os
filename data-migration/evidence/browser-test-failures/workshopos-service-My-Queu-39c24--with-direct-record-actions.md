# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workshopos.spec.ts >> service My Queue is a responsive active-job table with direct record actions
- Location: tests\workshopos.spec.ts:86:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('.my-queue-panel').getByRole('table', { name: 'My Queue' }).locator('tbody > tr')
Expected: 1
Received: 10
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" locator('.my-queue-panel').getByRole('table', { name: 'My Queue' }).locator('tbody > tr') with timeout 5000ms
  - waiting for locator('.my-queue-panel').getByRole('table', { name: 'My Queue' }).locator('tbody > tr')
    14 × locator resolved to 10 elements
       - unexpected value "10"

```

# Page snapshot

```yaml
- generic [ref=f1e3]:
  - complementary [ref=f1e4]:
    - generic [ref=f1e10]:
      - strong [ref=f1e11]: WorkshopOS
      - generic [ref=f1e12]: Workshop Management. Simplified.
    - button "Hide left menu" [ref=f1e13] [cursor=pointer]
    - generic [ref=f1e17]: Service Advisor
    - navigation "Service Advisor menu" [ref=f1e18]:
      - button "My Queue" [active] [ref=f1e19] [cursor=pointer]
      - button "Job Card" [ref=f1e24] [cursor=pointer]
      - button "Estimate" [ref=f1e29] [cursor=pointer]
      - button "Follow-ups" [ref=f1e33] [cursor=pointer]
      - button "Media" [ref=f1e39] [cursor=pointer]
      - button "Search" [ref=f1e44] [cursor=pointer]
    - button "Logout" [ref=f1e49] [cursor=pointer]
  - main [ref=f1e54]:
    - generic [ref=f1e55]:
      - generic [ref=f1e56]:
        - paragraph [ref=f1e57]: Service Advisor
        - heading "Command queue for estimates, approvals and customer updates." [level=1] [ref=f1e58]
      - generic [ref=f1e59]: service@example.com
    - generic [ref=f1e64]:
      - generic [ref=f1e69]:
        - heading "My Queue" [level=2] [ref=f1e70]
        - paragraph [ref=f1e71]: Open advisor jobs
      - generic [ref=f1e72]:
        - generic [ref=f1e73]:
          - generic [ref=f1e74]:
            - text: Search
            - textbox "Search my queue" [ref=f1e75]:
              - /placeholder: Job, vehicle or customer
          - generic [ref=f1e76]:
            - text: Status
            - combobox "My Queue status" [ref=f1e77]:
              - option "All statuses" [selected]
              - option "NEW"
              - option "IN_PROGRESS"
              - option "COMPLETED"
              - option "CLOSED"
          - group "Search actions" [ref=f1e78]:
            - button "Clear" [ref=f1e79] [cursor=pointer]
        - generic [ref=f1e80]:
          - button "Download" [ref=f1e83] [cursor=pointer]
          - generic [ref=f1e87]: Showing 1 to 10 of 36
          - generic [ref=f1e88]:
            - generic [ref=f1e89]:
              - text: Per page
              - combobox "My Queue records per page" [ref=f1e90]:
                - option "10" [selected]
                - option "20"
                - option "50"
            - navigation "Results pagination" [ref=f1e91]:
              - button "First page" [disabled] [ref=f1e92]
              - button "Previous page" [disabled] [ref=f1e95]
              - generic [ref=f1e98]:
                - button "Page 1" [ref=f1e99] [cursor=pointer]: "1"
                - button "Page 2" [ref=f1e100] [cursor=pointer]: "2"
                - button "Page 3" [ref=f1e101] [cursor=pointer]: "3"
                - button "Page 4" [ref=f1e102] [cursor=pointer]: "4"
              - button "Next page" [ref=f1e103] [cursor=pointer]
              - button "Last page" [ref=f1e106] [cursor=pointer]
        - table "My Queue" [ref=f1e110]:
          - rowgroup [ref=f1e111]:
            - row [ref=f1e112]:
              - columnheader "Job Card" [ref=f1e113]
              - columnheader "Vehicle" [ref=f1e114]
              - columnheader "Customer" [ref=f1e115]
              - columnheader "Status" [ref=f1e116]
              - columnheader "Workflow" [ref=f1e117]
              - columnheader "Actions" [ref=f1e118]
          - rowgroup [ref=f1e119]:
            - row [ref=f1e120]:
              - cell "JC-2026-002141" [ref=f1e121]
              - cell "OD10DM1009" [ref=f1e122]
              - cell "Demo Customer 009" [ref=f1e123]
              - cell "COMPLETED · Remind Customer for Sharing Google Review/Feedback" [ref=f1e124]
              - cell "Remind Customer for Sharing Google Review/Feedback" [ref=f1e126]
              - cell [ref=f1e127]:
                - generic [ref=f1e128]:
                  - button "View" [ref=f1e129] [cursor=pointer]
                  - button "Edit" [ref=f1e130] [cursor=pointer]
            - row [ref=f1e131]:
              - cell "JC-2026-002138" [ref=f1e132]
              - cell "OD07DM1006" [ref=f1e133]
              - cell "Demo Customer 006" [ref=f1e134]
              - cell "IN PROGRESS · QC Pending" [ref=f1e135]
              - cell "QC Pending" [ref=f1e137]
              - cell [ref=f1e138]:
                - generic [ref=f1e139]:
                  - button "View" [ref=f1e140] [cursor=pointer]
                  - button "Edit" [ref=f1e141] [cursor=pointer]
            - row [ref=f1e142]:
              - cell "JC-2026-002135" [ref=f1e143]
              - cell "OD04DM1003" [ref=f1e144]
              - cell "Demo Customer 003" [ref=f1e145]
              - cell "IN PROGRESS · Work Started" [ref=f1e146]
              - cell "Work Started" [ref=f1e148]
              - cell [ref=f1e149]:
                - generic [ref=f1e150]:
                  - button "View" [ref=f1e151] [cursor=pointer]
                  - button "Edit" [ref=f1e152] [cursor=pointer]
            - row [ref=f1e153]:
              - cell "JC-2026-002132" [ref=f1e154]
              - cell "OD13DM1132" [ref=f1e155]
              - cell "Demo Customer 012" [ref=f1e156]
              - cell "IN PROGRESS · Material Requested" [ref=f1e157]
              - cell "Material Requested" [ref=f1e159]
              - cell [ref=f1e160]:
                - generic [ref=f1e161]:
                  - button "View" [ref=f1e162] [cursor=pointer]
                  - button "Edit" [ref=f1e163] [cursor=pointer]
            - row [ref=f1e164]:
              - cell "JC-2026-002129" [ref=f1e165]
              - cell "OD10DM1129" [ref=f1e166]
              - cell "Demo Customer 009" [ref=f1e167]
              - cell "NEW · Get Confirmation" [ref=f1e168]
              - cell "Get Confirmation" [ref=f1e170]
              - cell [ref=f1e171]:
                - generic [ref=f1e172]:
                  - button "View" [ref=f1e173] [cursor=pointer]
                  - button "Edit" [ref=f1e174] [cursor=pointer]
            - row [ref=f1e175]:
              - cell "JC-2026-002123" [ref=f1e176]
              - cell "OD04DM1123" [ref=f1e177]
              - cell "Demo Customer 003" [ref=f1e178]
              - cell "COMPLETED · Remind Customer for Sharing Google Review/Feedback" [ref=f1e179]
              - cell "Remind Customer for Sharing Google Review/Feedback" [ref=f1e181]
              - cell [ref=f1e182]:
                - generic [ref=f1e183]:
                  - button "View" [ref=f1e184] [cursor=pointer]
                  - button "Edit" [ref=f1e185] [cursor=pointer]
            - row [ref=f1e186]:
              - cell "JC-2026-002120" [ref=f1e187]
              - cell "OD01DM1120" [ref=f1e188]
              - cell "Demo Customer 120" [ref=f1e189]
              - cell "IN PROGRESS · Follow-up Needed" [ref=f1e190]
              - cell "Follow-up Needed" [ref=f1e192]
              - cell [ref=f1e193]:
                - generic [ref=f1e194]:
                  - button "View" [ref=f1e195] [cursor=pointer]
                  - button "Edit" [ref=f1e196] [cursor=pointer]
            - row [ref=f1e197]:
              - cell "JC-2026-002117" [ref=f1e198]
              - cell "OD28DM1117" [ref=f1e199]
              - cell "Demo Customer 117" [ref=f1e200]
              - cell "IN PROGRESS · Material Issued" [ref=f1e201]
              - cell "Material Issued" [ref=f1e203]
              - cell [ref=f1e204]:
                - generic [ref=f1e205]:
                  - button "View" [ref=f1e206] [cursor=pointer]
                  - button "Edit" [ref=f1e207] [cursor=pointer]
            - row [ref=f1e208]:
              - cell "JC-2026-002114" [ref=f1e209]
              - cell "OD25DM1114" [ref=f1e210]
              - cell "Demo Customer 114" [ref=f1e211]
              - cell "NEW · Create Estimate" [ref=f1e212]
              - cell "Create Estimate" [ref=f1e214]
              - cell [ref=f1e215]:
                - generic [ref=f1e216]:
                  - button "View" [ref=f1e217] [cursor=pointer]
                  - button "Edit" [ref=f1e218] [cursor=pointer]
            - row [ref=f1e219]:
              - cell "JC-2026-002105" [ref=f1e220]
              - cell "OD16DM1105" [ref=f1e221]
              - cell "Demo Customer 105" [ref=f1e222]
              - cell "IN PROGRESS · Photos Shared" [ref=f1e223]
              - cell "Photos Shared" [ref=f1e225]
              - cell [ref=f1e226]:
                - generic [ref=f1e227]:
                  - button "View" [ref=f1e228] [cursor=pointer]
                  - button "Edit" [ref=f1e229] [cursor=pointer]
        - navigation "Results pagination" [ref=f1e230]:
          - button "First page" [disabled] [ref=f1e231]
          - button "Previous page" [disabled] [ref=f1e234]
          - generic [ref=f1e237]:
            - button "Page 1" [ref=f1e238] [cursor=pointer]: "1"
            - button "Page 2" [ref=f1e239] [cursor=pointer]: "2"
            - button "Page 3" [ref=f1e240] [cursor=pointer]: "3"
            - button "Page 4" [ref=f1e241] [cursor=pointer]: "4"
          - button "Next page" [ref=f1e242] [cursor=pointer]
          - button "Last page" [ref=f1e245] [cursor=pointer]
```

# Test source

```ts
  1   | import { expect, test, type Locator } from "@playwright/test";
  2   | import XLSX from "xlsx";
  3   | import { readFileSync, statSync } from "node:fs";
  4   | 
  5   | const roles = [
  6   |   ["reception@example.com", ["Today Queue", "Advance Bookings", "Customers", "Vehicles", "Search"]],
  7   |   ["service@example.com", ["My Queue", "Job Card", "Estimate", "Follow-ups", "Media", "Search"]],
  8   |   ["store@example.com", ["Material Requests", "Issue Material", "Reconcile", "Stock", "Search"]],
  9   |   ["tech@example.com", ["My Tasks", "Work Update", "QC Prep", "Search"]],
  10  |   ["accounts@example.com", ["Ready To Invoice", "Invoice", "Payment", "Delivery", "Search"]],
  11  |   ["admin@example.com", ["Dashboard", "Data Flow", "Job Cards", "Media", "Search"]],
  12  | ] as const;
  13  | 
  14  | test.beforeEach(async ({ page }) => {
  15  |   await page.goto("/");
  16  |   await page.evaluate(() => localStorage.clear());
  17  |   await page.reload();
  18  | });
  19  | 
  20  | async function expectAlignedJobCardFilterRows(toolbar: Locator) {
  21  |   await expect(toolbar.locator(".job-card-filter-row")).toHaveCount(2);
  22  |   const rows = await toolbar.locator(".job-card-filter-row").evaluateAll((elements) => elements.map((row) => ({
  23  |     top: row.getBoundingClientRect().top,
  24  |     controls: Array.from(row.children, (cell) => {
  25  |       const field = cell.matches(".list-search-actions") ? cell.querySelector(".filter-clear-action")
  26  |         : cell.matches(".job-card-archive-filter") ? cell.querySelector(".job-card-archive-switch")
  27  |           : cell.querySelector("input, select");
  28  |       const cellBox = cell.getBoundingClientRect();
  29  |       const fieldBox = field?.getBoundingClientRect();
  30  |       return { left: cellBox.left, width: cellBox.width, bottom: fieldBox?.bottom, height: fieldBox?.height, clear: cell.classList.contains("list-search-actions") };
  31  |     }),
  32  |   })));
  33  |   expect(rows.map((row) => row.controls.length)).toEqual([5, 4]);
  34  |   expect(rows[1].top).toBeGreaterThan(rows[0].top);
  35  |   expect(rows[0].controls.some((cell) => cell.clear)).toBe(false);
  36  |   expect(rows[1].controls[3].clear).toBe(true);
  37  |   for (let index = 0; index < 4; index++) {
  38  |     expect(Math.abs(rows[0].controls[index].left - rows[1].controls[index].left)).toBeLessThanOrEqual(1);
  39  |     expect(Math.abs(rows[0].controls[index].width - rows[1].controls[index].width)).toBeLessThanOrEqual(1);
  40  |   }
  41  |   for (const row of rows) {
  42  |     const bottoms = row.controls.map((cell) => cell.bottom!);
  43  |     expect(Math.max(...bottoms) - Math.min(...bottoms)).toBeLessThanOrEqual(1);
  44  |     for (const cell of row.controls) expect(cell.height).toBe(44);
  45  |   }
  46  | }
  47  | 
  48  | for (const [email, navItems] of roles) {
  49  |   test(`${email} can open every role screen`, async ({ page }) => {
  50  |     await loginAs(page, email);
  51  |     for (const item of navItems) {
  52  |       await page.locator(".role-nav").getByRole("button", { name: item, exact: true }).click();
  53  |       await expect(page.getByText(item).first()).toBeVisible();
  54  |     }
  55  |   });
  56  | }
  57  | 
  58  | test("service Job Cards uses a one-row table toolbar without customer, advisor, or view controls", async ({ page }) => {
  59  |   await page.setViewportSize({ width: 1440, height: 900 });
  60  |   await loginAs(page, "service@example.com");
  61  |   await page.locator(".role-nav").getByRole("button", { name: "Job Card", exact: true }).click();
  62  | 
  63  |   const toolbar = page.locator(".job-card-filter-grid--service");
  64  |   await expect(page.locator(".service-advisor-list .table-wrap table")).toBeVisible();
  65  |   await expect(page.getByRole("group", { name: "View mode" })).toHaveCount(0);
  66  |   await expect(toolbar.getByLabel("Customer filter")).toHaveCount(0);
  67  |   await expect(toolbar.getByLabel("Service advisor filter")).toHaveCount(0);
  68  |   await expect(toolbar.getByLabel("Vehicle filter")).toHaveCount(0);
  69  |   await expect(toolbar.getByLabel("Estimated delivery month-year")).toHaveValue(await page.evaluate(() => { const now = new Date(); return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`; }));
  70  |   await expect(toolbar.locator(".job-card-filter-row")).toHaveCount(1);
  71  |   await expect(toolbar.locator(".job-card-filter-row > label, .job-card-filter-row > .list-search-actions")).toHaveCount(7);
  72  |   const desktopRows = await toolbar.locator(".job-card-filter-row > label, .job-card-filter-row > .list-search-actions").evaluateAll((controls) => new Set(controls.map((control) => Math.round(control.getBoundingClientRect().bottom))).size);
  73  |   expect(desktopRows).toBe(1);
  74  | 
  75  |   await toolbar.getByRole("button", { name: "Clear", exact: true }).click();
  76  |   const assignedJob = await page.locator(".service-advisor-list .table-wrap table tbody tr").first().locator("td").first().textContent();
  77  |   await toolbar.getByLabel("Search job cards").fill(assignedJob ?? "");
  78  |   await expect(page.locator(".service-advisor-list .table-wrap table tbody tr")).toHaveCount(1);
  79  |   await toolbar.getByRole("button", { name: "Clear", exact: true }).click();
  80  |   await expect(toolbar.getByLabel("Search job cards")).toHaveValue("");
  81  | 
  82  |   await page.setViewportSize({ width: 390, height: 844 });
  83  |   await expectNoPageOverflow(page);
  84  | });
  85  | 
  86  | test("service My Queue is a responsive active-job table with direct record actions", async ({ page }) => {
  87  |   await page.setViewportSize({ width: 1440, height: 900 });
  88  |   await loginAs(page, "service@example.com");
  89  |   await page.locator(".role-nav").getByRole("button", { name: "My Queue", exact: true }).click();
  90  | 
  91  |   const queue = page.locator(".my-queue-panel");
  92  |   const toolbar = queue.locator(".my-queue-filter-bar");
  93  |   const table = queue.getByRole("table", { name: "My Queue" });
  94  |   await expect(table).toBeVisible();
  95  |   await expect(table.locator("thead")).toContainText("Job Card");
  96  |   await expect(table.locator("thead")).toContainText("Vehicle");
  97  |   await expect(table.locator("thead")).toContainText("Customer");
  98  |   await expect(table.locator("thead")).toContainText("Status");
  99  |   await expect(table.locator("thead")).toContainText("Workflow");
  100 |   await expect(table.locator("thead")).toContainText("Actions");
> 101 |   await expect(table.locator("tbody > tr")).toHaveCount(1);
      |                                             ^ Error: expect(locator).toHaveCount(expected) failed
  102 |   await expect(table).toContainText("JC-2026-001247");
  103 |   await expect(table).not.toContainText("CLOSED");
  104 |   await expect(table).not.toContainText("CANCELLED");
  105 |   await expect(queue.getByText("Selected Job", { exact: true })).toHaveCount(0);
  106 | 
  107 |   const filterRows = await toolbar.locator("> label, > .list-search-actions").evaluateAll((controls) => new Set(controls.map((control) => Math.round(control.getBoundingClientRect().bottom))).size);
  108 |   expect(filterRows).toBe(1);
  109 | 
  110 |   const firstRow = table.locator("tbody > tr").first();
  111 |   const jobNo = (await firstRow.locator("td").first().textContent())!.trim();
  112 |   await firstRow.getByRole("button", { name: "View", exact: true }).click();
  113 |   await expect(page.getByRole("dialog", { name: `View Job ${jobNo}` })).toBeVisible();
  114 |   await page.getByRole("button", { name: "Go Back" }).click();
  115 |   await firstRow.getByRole("button", { name: "Edit", exact: true }).click();
  116 |   await expect(page.getByRole("dialog", { name: `Edit Job ${jobNo}` })).toBeVisible();
  117 |   await page.getByRole("button", { name: "Go Back" }).click();
  118 | 
  119 |   await page.setViewportSize({ width: 390, height: 844 });
  120 |   await expect(toolbar.getByLabel("Search my queue")).toBeVisible();
  121 |   await expect(toolbar.getByLabel("My Queue status")).toBeVisible();
  122 |   await expect(toolbar.getByRole("button", { name: "Clear", exact: true })).toBeVisible();
  123 |   await expect(table.getByRole("button", { name: "View", exact: true }).first()).toBeVisible();
  124 |   await expect(table.getByRole("button", { name: "Edit", exact: true }).first()).toBeVisible();
  125 | });
  126 | 
  127 | test("advance bookings are limited to the next two complete months", async ({ page }) => {
  128 |   await loginAs(page, "reception@example.com");
  129 |   await page.locator(".role-nav").getByRole("button", { name: "Advance Bookings", exact: true }).click();
  130 | 
  131 |   const expected = await page.evaluate(() => {
  132 |     const now = new Date();
  133 |     const month = (offset: number) => {
  134 |       const value = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  135 |       return {
  136 |         key: `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}`,
  137 |         label: value.toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
  138 |       };
  139 |     };
  140 |     const first = month(1);
  141 |     const last = month(2);
  142 |     return {
  143 |       first,
  144 |       last,
  145 |       min: `${first.key}-01`,
  146 |       max: `${last.key}-${String(new Date(now.getFullYear(), now.getMonth() + 3, 0).getDate()).padStart(2, "0")}`,
  147 |     };
  148 |   });
  149 | 
  150 |   const calendar = page.getByLabel("Booking month calendar");
  151 |   await expect(calendar.getByRole("heading", { level: 3 })).toHaveText(expected.first.label);
  152 |   await expect(calendar.getByRole("button", { name: "Previous month" })).toBeDisabled();
  153 | 
  154 |   await calendar.getByRole("button", { name: "Next month" }).click();
  155 |   await expect(calendar.getByRole("heading", { level: 3 })).toHaveText(expected.last.label);
  156 |   await expect(calendar.getByRole("button", { name: "Next month" })).toBeDisabled();
  157 | 
  158 |   await page.getByRole("button", { name: "Create Booking" }).click();
  159 |   const dateInput = page.getByRole("dialog", { name: "Create advance booking" }).getByLabel("Booking date");
  160 |   await expect(dateInput).toHaveValue(`${expected.last.key}-01`);
  161 |   await expect(dateInput).toHaveAttribute("min", expected.min);
  162 |   await expect(dateInput).toHaveAttribute("max", expected.max);
  163 | });
  164 | 
  165 | test("Accounts Ready To Invoice lists only active pending invoices and is read only", async ({ page }) => {
  166 |   await loginAs(page, "accounts@example.com");
  167 |   await page.locator(".role-nav").getByRole("button", { name: "Ready To Invoice", exact: true }).click();
  168 | 
  169 |   const manager = page.locator('[data-billing-manager="Invoices"]');
  170 |   const table = page.getByRole("table", { name: "Invoices manager" });
  171 |   const records = table.locator("tbody > tr:not(.billing-detail-row)");
  172 |   await expect(manager.getByRole("heading", { name: "Ready To Invoice" })).toBeVisible();
  173 |   await expect(records).not.toHaveCount(0);
  174 |   expect((await records.locator("td:nth-last-child(2)").allTextContents()).every((status) => status.trim() === "Pending")).toBe(true);
  175 |   await expect(table.getByRole("button", { name: "Quick Mark Paid", exact: true })).toHaveCount(0);
  176 |   await expect(table.getByRole("button", { name: "Download", exact: true }).first()).toBeVisible();
  177 | 
  178 |   await table.getByRole("button", { name: "View", exact: true }).first().click();
  179 |   await expect(page.getByRole("dialog", { name: "View Invoice" })).toBeVisible();
  180 |   await expect(page.getByRole("dialog", { name: "View Invoice" }).getByRole("button", { name: /Save Invoice|Update Invoice/ })).toHaveCount(0);
  181 | });
  182 | 
  183 | test("desktop main content scrolls without moving the navigation rail", async ({ page }) => {
  184 |   await page.setViewportSize({ width: 1440, height: 720 });
  185 |   await loginAs(page, "admin@example.com");
  186 |   await page.locator(".role-nav").getByRole("button", { name: "Manage", exact: true }).click();
  187 |   page.once("dialog", (dialog) => dialog.accept());
  188 |   await page.getByRole("button", { name: "Load Large Demo Dataset" }).click();
  189 |   await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  190 | 
  191 |   const rail = page.locator(".rail");
  192 |   const main = page.locator("main");
  193 |   const railBefore = await rail.boundingBox();
  194 |   const scroll = await main.evaluate((element) => {
  195 |     element.scrollTop = element.scrollHeight;
  196 |     return { clientHeight: element.clientHeight, scrollHeight: element.scrollHeight, scrollTop: element.scrollTop };
  197 |   });
  198 | 
  199 |   expect(scroll.scrollHeight).toBeGreaterThan(scroll.clientHeight);
  200 |   expect(scroll.scrollTop).toBeGreaterThan(0);
  201 |   expect(await page.evaluate(() => window.scrollY)).toBe(0);
```