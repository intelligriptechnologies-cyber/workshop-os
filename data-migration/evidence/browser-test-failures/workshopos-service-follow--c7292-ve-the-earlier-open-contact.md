# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workshopos.spec.ts >> service follow-ups show all assigned jobs and resolve the earlier open contact
- Location: tests\workshopos.spec.ts:2217:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.service-advisor-list')
Expected substring: "JC-2026-001247"
Received string:    "Follow-upsJobs assigned to youSearchReceived dateMonth-YearAll monthsAugust 2026July 2026June 2026May 2026April 2026March 2026February 2026January 2026Clear DownloadShowing 1 to 10 of 48Per page102050Page 1 of 512345Job CardVehicleCustomerEstimate StatusFollow-up StatusActionsJC-2026-002144OD13DM1012Demo Customer 012ApprovedDone(1)ViewJC-2026-002141OD10DM1009Demo Customer 009ApprovedPending (0/1)Add Follow-upJC-2026-002138OD07DM1006Demo Customer 006ApprovedPending (0/1)Add Follow-upJC-2026-002135OD04DM1003Demo Customer 003ApprovedPending (0/1)Add Follow-upJC-2026-002132OD13DM1132Demo Customer 012ApprovedPending (0/1)Add Follow-upJC-2026-002129OD10DM1129Demo Customer 009DraftPending (0/0)Add Follow-upJC-2026-002126OD07DM1126Demo Customer 006ApprovedDone(1)ViewJC-2026-002123OD04DM1123Demo Customer 003ApprovedPending (0/1)Add Follow-upJC-2026-002120OD01DM1120Demo Customer 120ApprovedPending (0/1)Add Follow-upJC-2026-002117OD28DM1117Demo Customer 117ApprovedPending (0/1)Add Follow-upPage 1 of 512345"
Timeout: 5000ms

Call log:
  - Expect "toContainText" locator('.service-advisor-list') with timeout 5000ms
  - waiting for locator('.service-advisor-list')
    14 × locator resolved to <section class="entity-list-page service-advisor-list">…</section>
       - unexpected value "Follow-upsJobs assigned to youSearchReceived dateMonth-YearAll monthsAugust 2026July 2026June 2026May 2026April 2026March 2026February 2026January 2026Clear DownloadShowing 1 to 10 of 48Per page102050Page 1 of 512345Job CardVehicleCustomerEstimate StatusFollow-up StatusActionsJC-2026-002144OD13DM1012Demo Customer 012ApprovedDone(1)ViewJC-2026-002141OD10DM1009Demo Customer 009ApprovedPending (0/1)Add Follow-upJC-2026-002138OD07DM1006Demo Customer 006ApprovedPending (0/1)Add Follow-upJC-2026-002135OD04DM1003Demo Customer 003ApprovedPending (0/1)Add Follow-upJC-2026-002132OD13DM1132Demo Customer 012ApprovedPending (0/1)Add Follow-upJC-2026-002129OD10DM1129Demo Customer 009DraftPending (0/0)Add Follow-upJC-2026-002126OD07DM1126Demo Customer 006ApprovedDone(1)ViewJC-2026-002123OD04DM1123Demo Customer 003ApprovedPending (0/1)Add Follow-upJC-2026-002120OD01DM1120Demo Customer 120ApprovedPending (0/1)Add Follow-upJC-2026-002117OD28DM1117Demo Customer 117ApprovedPending (0/1)Add Follow-upPage 1 of 512345"

```

```yaml
- heading "Follow-ups" [level=2]
- paragraph: Jobs assigned to you
- text: Search
- textbox "Search follow-ups":
  - /placeholder: Job, vehicle or customer
- text: Received date
- textbox "Follow-ups received date"
- text: Month-Year
- combobox "Follow-ups month-year":
  - option "All months" [selected]
  - option "August 2026"
  - option "July 2026"
  - option "June 2026"
  - option "May 2026"
  - option "April 2026"
  - option "March 2026"
  - option "February 2026"
  - option "January 2026"
- group "Search actions":
  - button "Clear"
- button "Download"
- text: Showing 1 to 10 of 48 Per page
- combobox "Follow-ups records per page":
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
  - button "Next page"
  - button "Last page"
- table:
  - rowgroup:
    - row "Job Card Vehicle Customer Estimate Status Follow-up Status Actions":
      - columnheader "Job Card"
      - columnheader "Vehicle"
      - columnheader "Customer"
      - columnheader "Estimate Status"
      - columnheader "Follow-up Status"
      - columnheader "Actions"
  - rowgroup:
    - row "JC-2026-002144 OD13DM1012 Demo Customer 012 Approved View":
      - cell "JC-2026-002144"
      - cell "OD13DM1012"
      - cell "Demo Customer 012"
      - cell "Approved"
      - cell:
        - status: Done(1)
      - cell "View":
        - button "View"
    - row "JC-2026-002141 OD10DM1009 Demo Customer 009 Approved Add Follow-up":
      - cell "JC-2026-002141"
      - cell "OD10DM1009"
      - cell "Demo Customer 009"
      - cell "Approved"
      - cell:
        - status: Pending (0/1)
      - cell "Add Follow-up":
        - button "Add Follow-up"
    - row "JC-2026-002138 OD07DM1006 Demo Customer 006 Approved Add Follow-up":
      - cell "JC-2026-002138"
      - cell "OD07DM1006"
      - cell "Demo Customer 006"
      - cell "Approved"
      - cell:
        - status: Pending (0/1)
      - cell "Add Follow-up":
        - button "Add Follow-up"
    - row "JC-2026-002135 OD04DM1003 Demo Customer 003 Approved Add Follow-up":
      - cell "JC-2026-002135"
      - cell "OD04DM1003"
      - cell "Demo Customer 003"
      - cell "Approved"
      - cell:
        - status: Pending (0/1)
      - cell "Add Follow-up":
        - button "Add Follow-up"
    - row "JC-2026-002132 OD13DM1132 Demo Customer 012 Approved Add Follow-up":
      - cell "JC-2026-002132"
      - cell "OD13DM1132"
      - cell "Demo Customer 012"
      - cell "Approved"
      - cell:
        - status: Pending (0/1)
      - cell "Add Follow-up":
        - button "Add Follow-up"
    - row "JC-2026-002129 OD10DM1129 Demo Customer 009 Draft Add Follow-up":
      - cell "JC-2026-002129"
      - cell "OD10DM1129"
      - cell "Demo Customer 009"
      - cell "Draft"
      - cell:
        - status: Pending (0/0)
      - cell "Add Follow-up":
        - button "Add Follow-up"
    - row "JC-2026-002126 OD07DM1126 Demo Customer 006 Approved View":
      - cell "JC-2026-002126"
      - cell "OD07DM1126"
      - cell "Demo Customer 006"
      - cell "Approved"
      - cell:
        - status: Done(1)
      - cell "View":
        - button "View"
    - row "JC-2026-002123 OD04DM1123 Demo Customer 003 Approved Add Follow-up":
      - cell "JC-2026-002123"
      - cell "OD04DM1123"
      - cell "Demo Customer 003"
      - cell "Approved"
      - cell:
        - status: Pending (0/1)
      - cell "Add Follow-up":
        - button "Add Follow-up"
    - row "JC-2026-002120 OD01DM1120 Demo Customer 120 Approved Add Follow-up":
      - cell "JC-2026-002120"
      - cell "OD01DM1120"
      - cell "Demo Customer 120"
      - cell "Approved"
      - cell:
        - status: Pending (0/1)
      - cell "Add Follow-up":
        - button "Add Follow-up"
    - row "JC-2026-002117 OD28DM1117 Demo Customer 117 Approved Add Follow-up":
      - cell "JC-2026-002117"
      - cell "OD28DM1117"
      - cell "Demo Customer 117"
      - cell "Approved"
      - cell:
        - status: Pending (0/1)
      - cell "Add Follow-up":
        - button "Add Follow-up"
- navigation "Results pagination":
  - button "First page" [disabled]
  - button "Previous page" [disabled]
  - button "Page 1": "1"
  - button "Page 2": "2"
  - button "Page 3": "3"
  - button "Page 4": "4"
  - button "Page 5": "5"
  - button "Next page"
  - button "Last page"
```

# Test source

```ts
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
  2195 |   const queue = page.locator(".embedded-list");
  2196 |   await expect(queue.locator("tbody tr").first()).toBeVisible();
  2197 | 
  2198 |   await page.locator(".role-nav").getByRole("button", { name: "Job Card", exact: true }).click();
  2199 |   const jobCards = page.locator(".service-advisor-list");
  2200 |   await expect(jobCards.getByRole("heading", { name: "Job Cards", exact: true })).toBeVisible();
  2201 |   await expect(jobCards.getByLabel("Estimated delivery date")).toHaveValue("");
  2202 |   await expect(jobCards.getByLabel("Estimated delivery month-year")).toHaveValue("2040-01");
  2203 |   for (const label of ["Main status", "Workflow status", "Sort results"])
  2204 |     await expect(jobCards.getByLabel(label)).toBeVisible();
  2205 |   await expect(jobCards.getByLabel("Vehicle filter")).toHaveCount(0);
  2206 |   await expect(jobCards.locator("tbody tr")).toHaveCount(0);
  2207 |   await jobCards.getByRole("button", { name: "Clear", exact: true }).click();
  2208 |   await expect(jobCards.getByLabel("Estimated delivery month-year")).toHaveValue("");
  2209 |   await expect(jobCards.locator("tbody tr").first()).toBeVisible();
  2210 |   await expect(jobCards.getByRole("columnheader", { name: "Service Advisor", exact: true })).toBeVisible();
  2211 |   await expect(jobCards.getByRole("columnheader", { name: "Follow-up Status", exact: true })).toHaveCount(0);
  2212 |   const assignedJob = jobCards.locator("tbody tr").first();
  2213 |   await expect(assignedJob.getByRole("button", { name: "View", exact: true })).toBeVisible();
  2214 |   await expect(assignedJob.getByRole("button", { name: "Edit", exact: true })).toBeVisible();
  2215 | });
  2216 | 
  2217 | test("service follow-ups show all assigned jobs and resolve the earlier open contact", async ({ page }) => {
  2218 |   await loginAs(page, "service@example.com");
  2219 |   await page.locator(".role-nav").getByRole("button", { name: "Follow-ups", exact: true }).click();
  2220 | 
  2221 |   const followups = page.locator(".service-advisor-list");
  2222 |   await expect(followups.getByLabel("Follow-ups received date")).toHaveValue("");
> 2223 |   await expect(followups).toContainText("JC-2026-001247");
       |                           ^ Error: expect(locator).toContainText(expected) failed
  2224 |   await expect(followups.locator("tbody tr")).toHaveCount(1);
  2225 |   await followups.getByLabel("Search follow-ups").fill("JC-2026-001247");
  2226 |   await expect(followups.locator("tbody tr")).toHaveCount(1);
  2227 |   await followups.getByRole("button", { name: "Clear", exact: true }).click();
  2228 |   await expect(followups.getByLabel("Search follow-ups")).toHaveValue("");
  2229 | 
  2230 |   const row = followups.locator("tbody tr").filter({ hasText: "JC-2026-001247" });
  2231 |   await expect(row.getByRole("button", { name: "Add Follow-up", exact: true })).toBeVisible();
  2232 |   await row.getByRole("button", { name: "Add Follow-up", exact: true }).click();
  2233 |   let dialog = page.getByRole("dialog", { name: "Follow-ups" });
  2234 |   await dialog.getByLabel("Note").fill("Initial unanswered call");
  2235 |   await dialog.getByRole("button", { name: "Save Follow-up", exact: true }).click();
  2236 |   await expect(row.getByRole("status")).toHaveText("Pending (0/1)");
  2237 | 
  2238 |   await row.getByRole("button", { name: "Add Follow-up", exact: true }).click();
  2239 |   dialog = page.getByRole("dialog", { name: "Follow-ups" });
  2240 |   await dialog.getByLabel("Note").fill("Customer confirmed the update");
  2241 |   await dialog.getByRole("checkbox", { name: "Mark this follow-up done" }).click();
  2242 |   await dialog.getByRole("button", { name: "Save Follow-up", exact: true }).click();
  2243 |   await expect(row.getByRole("status")).toHaveText("Done(2)");
  2244 | 
  2245 |   await row.getByRole("button", { name: "Add Follow-up", exact: true }).click();
  2246 |   dialog = page.getByRole("dialog", { name: "Follow-ups" });
  2247 |   await expect(dialog.getByRole("region", { name: "Follow-up history" })).toContainText("Initial unanswered call");
  2248 |   await expect(dialog.getByRole("region", { name: "Follow-up history" })).toContainText("Customer confirmed the update");
  2249 |   await dialog.getByLabel("Note").fill("Follow-up requested after the call");
  2250 |   await dialog.getByRole("button", { name: "Save Follow-up", exact: true }).click();
  2251 |   await expect(row.getByRole("status")).toHaveText("Pending (2/3)");
  2252 | });
  2253 | 
  2254 | test("job card media validates, compresses, edits, archives, stays session-only, and responds on mobile", async ({ page }) => {
  2255 |   const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", "base64");
  2256 |   await loginAs(page, "admin@example.com");
  2257 |   await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  2258 |   await page.locator(".job-card-filter-grid--admin").getByRole("button", { name: "Clear", exact: true }).click();
  2259 |   await page.getByLabel("Search job cards").fill("JC-2026-002141");
  2260 |   await page.locator(".record-card").filter({ hasText: "JC-2026-002141" }).getByRole("button", { name: "Edit", exact: true }).click();
  2261 |   const job = page.getByRole("dialog", { name: /Edit Job/ });
  2262 |   await job.getByRole("tab", { name: "Photos / Media" }).click();
  2263 |   const media = job.getByRole("region", { name: "Job card photos and media" });
  2264 |   await expect(media.getByRole("tab", { name: "All Photos" })).toHaveAttribute("aria-selected", "true");
  2265 |   await expect(media.getByLabel("Upload phase")).toHaveValue("After Work");
  2266 |   await expect(media.getByRole("tab", { name: "Before Work" })).toBeVisible();
  2267 |   await expect(media.getByRole("tab", { name: "After Work" })).toBeVisible();
  2268 |   await media.getByLabel("Upload phase").selectOption("Before Work");
  2269 |   await expect(media.getByText("Before Photos are locked after the job leaves NEW.")).toBeVisible();
  2270 |   await expect(media.getByLabel("Image file")).toHaveCount(0);
  2271 |   await media.getByLabel("Upload phase").selectOption("After Work");
  2272 | 
  2273 |   await media.getByLabel("Image file").setInputFiles({ name: "unsafe.svg", mimeType: "image/svg+xml", buffer: Buffer.from("<svg></svg>") });
  2274 |   await expect(media.getByRole("alert")).toContainText("JPEG, PNG, or WebP");
  2275 |   await media.getByLabel("Image file").setInputFiles({ name: "wrong.jpg", mimeType: "image/jpeg", buffer: png });
  2276 |   await expect(media.getByRole("alert")).toContainText("does not match");
  2277 | 
  2278 |   await media.getByLabel("Photo label").fill("Arrival inspection");
  2279 |   await media.getByLabel("Image file").setInputFiles({ name: "before.png", mimeType: "image/png", buffer: png });
  2280 |   await expect(media.getByText(/Ready: 1 × 1/)).toBeVisible();
  2281 |   await media.getByRole("button", { name: "Upload to After Work" }).click();
  2282 |   const uploaded = media.getByRole("article").filter({ hasText: "Arrival inspection" });
  2283 |   const uploadedImage = uploaded.getByRole("img", { name: "Arrival inspection" });
  2284 |   await expect(uploadedImage).toHaveAttribute("src", /^data:image\/jpeg;base64,/);
  2285 |   const compressedBytes = await uploadedImage.evaluate((image) => Math.floor(((image.getAttribute("src")?.split(",")[1].length ?? 0) * 3) / 4));
  2286 |   expect(compressedBytes).toBeLessThanOrEqual(1_000_000);
  2287 | 
  2288 |   await job.getByRole("tab", { name: "Details" }).click();
  2289 |   await job.getByRole("tab", { name: "Photos / Media" }).click();
  2290 |   await expect(media.getByRole("tab", { name: "All Photos" })).toHaveAttribute("aria-selected", "true");
  2291 |   await expect(media.getByRole("img", { name: "Arrival inspection" })).toBeVisible();
  2292 |   await media.getByRole("tab", { name: "Before Work" }).click();
  2293 |   await expect(media.getByText("No before work images yet.")).toBeVisible();
  2294 |   await media.getByRole("tab", { name: "After Work" }).click();
  2295 |   await expect(media.getByRole("img", { name: "Arrival inspection" })).toBeVisible();
  2296 | 
  2297 |   await uploaded.getByRole("button", { name: "Edit" }).click();
  2298 |   const edit = page.getByRole("dialog", { name: "Edit photo metadata" });
  2299 |   await edit.getByLabel("Photo label").fill("Completed inspection");
  2300 |   await edit.getByLabel("Work phase").selectOption("After Work");
  2301 |   await edit.getByRole("button", { name: "Save metadata" }).click();
  2302 |   await media.getByRole("tab", { name: "Before Work" }).click();
  2303 |   await expect(media.getByText("No before work images yet.")).toBeVisible();
  2304 |   await media.getByRole("tab", { name: "After Work" }).click();
  2305 |   await expect(media.getByRole("img", { name: "Completed inspection" })).toBeVisible();
  2306 | 
  2307 |   await media.getByRole("tab", { name: "After Work" }).click();
  2308 |   await media.getByLabel("Photo label").fill("Archive candidate");
  2309 |   await media.getByLabel("Image file").setInputFiles({ name: "archive.png", mimeType: "image/png", buffer: png });
  2310 |   await media.getByRole("button", { name: "Upload to After Work" }).click();
  2311 |   const candidate = media.getByRole("article").filter({ hasText: "Archive candidate" });
  2312 |   await candidate.getByRole("button", { name: "Archive" }).click();
  2313 |   const archive = page.getByRole("dialog", { name: "Archive photo?" });
  2314 |   await expect(archive.getByLabel("Archive reason")).toBeFocused();
  2315 |   await archive.getByLabel("Archive reason").fill("Duplicate view");
  2316 |   await archive.getByRole("button", { name: "Archive photo" }).click();
  2317 |   await expect(candidate).toHaveCount(0);
  2318 | 
  2319 |   const durableContainsMedia = await page.evaluate(() => Object.values(localStorage).some((value) => {
  2320 |     try { return atob(value).includes("Completed inspection") || atob(value).includes("/9j/"); } catch { return false; }
  2321 |   }));
  2322 |   expect(durableContainsMedia).toBe(false);
  2323 |   await job.getByRole("tab", { name: "Details" }).click();
```