# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workshopos.spec.ts >> advance bookings are limited to the next two complete months
- Location: tests\workshopos.spec.ts:127:1

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator:  getByLabel('Booking month calendar').getByRole('heading', { level: 3 })
Expected: "November 2026"
Received: "October 2026"
Timeout:  5000ms

Call log:
  - Expect "toHaveText" getByLabel('Booking month calendar').getByRole('heading', { level: 3 }) with timeout 5000ms
  - waiting for getByLabel('Booking month calendar').getByRole('heading', { level: 3 })
    13 × locator resolved to <h3>October 2026</h3>
       - unexpected value "October 2026"

```

```yaml
- heading "October 2026" [level=3]
```

# Test source

```ts
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
  101 |   await expect(table.locator("tbody > tr")).toHaveCount(1);
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
> 151 |   await expect(calendar.getByRole("heading", { level: 3 })).toHaveText(expected.first.label);
      |                                                             ^ Error: expect(locator).toHaveText(expected) failed
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
  202 |   expect((await rail.boundingBox())?.y).toBe(railBefore?.y);
  203 | });
  204 | 
  205 | test("desktop navigation scrolls independently in a short viewport", async ({ page }) => {
  206 |   await page.setViewportSize({ width: 1440, height: 360 });
  207 |   await loginAs(page, "admin@example.com");
  208 | 
  209 |   const nav = page.locator(".role-nav");
  210 |   const scroll = await nav.evaluate((element) => {
  211 |     element.scrollTop = element.scrollHeight;
  212 |     return { clientHeight: element.clientHeight, scrollHeight: element.scrollHeight, scrollTop: element.scrollTop };
  213 |   });
  214 | 
  215 |   expect(scroll.scrollHeight).toBeGreaterThan(scroll.clientHeight);
  216 |   expect(scroll.scrollTop).toBeGreaterThan(0);
  217 |   await nav.getByRole("button", { name: "Search", exact: true }).scrollIntoViewIfNeeded();
  218 |   await expect(nav.getByRole("button", { name: "Search", exact: true })).toBeVisible();
  219 | });
  220 | 
  221 | test("admin hides customer and vehicle pages from its navigation rail", async ({ page }) => {
  222 |   await loginAs(page, "admin@example.com");
  223 |   const nav = page.locator(".role-nav");
  224 |   await expect(nav.getByRole("button", { name: "Search", exact: true })).toBeVisible();
  225 |   await expect(nav.getByRole("button", { name: "Customers", exact: true })).toHaveCount(0);
  226 |   await expect(nav.getByRole("button", { name: "Vehicles", exact: true })).toHaveCount(0);
  227 | });
  228 | 
  229 | test("saved Store page access immediately removes Purchase Orders from its inventory navigation", async ({ page }) => {
  230 |   await loginAs(page, "admin@example.com");
  231 |   await page.locator(".role-nav").getByRole("button", { name: "Admin Console", exact: true }).click();
  232 |   await page.getByRole("tab", { name: "Roles & Page Access", exact: true }).click();
  233 |   await page.locator(".role-list").getByRole("button", { name: /Store/ }).click();
  234 |   await page.getByLabel("Purchase Orders", { exact: true }).uncheck();
  235 |   await page.getByRole("button", { name: "Save Changes", exact: true }).click();
  236 |   await page.getByRole("button", { name: "Logout", exact: true }).click();
  237 | 
  238 |   await loginAs(page, "store@example.com");
  239 |   const nav = page.locator(".role-nav");
  240 |   await expect(nav.getByRole("button", { name: "Stock", exact: true })).toBeVisible();
  241 |   await expect(nav.getByRole("button", { name: "Purchase Orders", exact: true })).toHaveCount(0);
  242 | });
  243 | 
  244 | test("admin dashboard presents live metrics in an accessible command-center grid", async ({ page }) => {
  245 |   await page.setViewportSize({ width: 1440, height: 900 });
  246 |   await loginAs(page, "admin@example.com");
  247 | 
  248 |   const dashboard = page.getByRole("region", { name: "Workshop command center" });
  249 |   const grid = dashboard.locator(".command-grid");
  250 |   const metrics = ["Active today", "Total visits", "In progress", "Closed", "On hold", "Total collections", "Projected monthly collection", "Payments received", "Invoices generated", "Customers served", "Vehicles served", "Low-stock items", "Pending approvals", "Material requests", "Materials issued"];
  251 |   await expect(grid.locator(".command-card")).toHaveCount(4);
```