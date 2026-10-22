# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workshopos.spec.ts >> fresh demo data provides a multi-supplier price review before PO approval
- Location: tests\workshopos.spec.ts:2410:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: getByRole('table', { name: 'Purchase order register' }).getByRole('row', { name: /DEMO-PR-0001/ })
Expected substring: "PO Request"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" getByRole('table', { name: 'Purchase order register' }).getByRole('row', { name: /DEMO-PR-0001/ }) with timeout 5000ms
  - waiting for getByRole('table', { name: 'Purchase order register' }).getByRole('row', { name: /DEMO-PR-0001/ })

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
  - heading "Purchase Orders" [level=2]
  - paragraph: Ordering commitments; stock is recorded only through Stock Inward.
  - button "New Purchase Request"
  - text: Search
  - textbox "Search purchase orders":
    - /placeholder: PO number or supplier
    - text: DEMO-PR-0001
  - text: Status
  - combobox "Purchase order status":
    - option "All statuses" [selected]
    - option "PO Request"
    - option "PO Request Approved"
    - option "PO Issued"
    - option "PO Received"
    - option "PO Confirmation"
    - option "Draft"
    - option "Sent"
    - option "Partially Received"
    - option "Ready to Close"
    - option "Closed"
    - option "Cancelled"
  - group "Search actions":
    - button "Clear"
  - table "Purchase order register":
    - rowgroup:
      - row "PO Date Supplier Ordered Received Total Status Actions":
        - columnheader "PO"
        - columnheader "Date"
        - columnheader "Supplier"
        - columnheader "Ordered"
        - columnheader "Received"
        - columnheader "Total"
        - columnheader "Status"
        - columnheader "Actions"
    - rowgroup
```

# Test source

```ts
  2315 |   await archive.getByLabel("Archive reason").fill("Duplicate view");
  2316 |   await archive.getByRole("button", { name: "Archive photo" }).click();
  2317 |   await expect(candidate).toHaveCount(0);
  2318 | 
  2319 |   const durableContainsMedia = await page.evaluate(() => Object.values(localStorage).some((value) => {
  2320 |     try { return atob(value).includes("Completed inspection") || atob(value).includes("/9j/"); } catch { return false; }
  2321 |   }));
  2322 |   expect(durableContainsMedia).toBe(false);
  2323 |   await job.getByRole("tab", { name: "Details" }).click();
  2324 |   await job.getByRole("tab", { name: "Photos / Media" }).click();
  2325 |   await media.getByRole("tab", { name: "After Work" }).click();
  2326 |   await expect(media.getByRole("img", { name: "Completed inspection" })).toBeVisible();
  2327 | 
  2328 |   await page.setViewportSize({ width: 390, height: 844 });
  2329 |   const galleryBox = await media.getByTestId("job-media-gallery").boundingBox();
  2330 |   expect(galleryBox).not.toBeNull();
  2331 |   expect(galleryBox!.x + galleryBox!.width).toBeLessThanOrEqual(390);
  2332 | 
  2333 |   await page.reload();
  2334 |   await loginAs(page, "admin@example.com");
  2335 |   await page.locator(".role-nav").getByRole("button", { name: "Job Cards", exact: true }).click();
  2336 |   await page.getByRole("button", { name: "Show filters", exact: true }).click();
  2337 |   await page.locator(".job-card-filter-grid--admin").getByRole("button", { name: "Clear", exact: true }).click();
  2338 |   await page.getByLabel("Search job cards").fill("JC-2026-002141");
  2339 |   await page.locator(".record-card").filter({ hasText: "JC-2026-002141" }).getByRole("button", { name: "View", exact: true }).click();
  2340 |   await page.getByRole("dialog", { name: /View Job/ }).getByRole("tab", { name: "Photos / Media" }).click();
  2341 |   await expect(page.getByText("Completed inspection")).toHaveCount(0);
  2342 | });
  2343 | 
  2344 | test("Developer Console manages demo tenants, messages, billing and writable role emulation", async ({ page }) => {
  2345 |   await page.getByLabel("Email").fill("developer@admin.com");
  2346 |   await page.getByLabel("Password").fill("admin123");
  2347 |   await page.getByRole("button", { name: "Login" }).click();
  2348 |   await expect(page.getByRole("heading", { name: "Developer Console" })).toBeVisible();
  2349 |   await expect(page.getByRole("heading", { name: "Apex Auto Studio" })).toBeVisible();
  2350 | 
  2351 |   await page.getByLabel("New tenant name").fill("North Star Garage");
  2352 |   await page.getByRole("button", { name: "Create tenant" }).click();
  2353 |   await expect(page.getByRole("heading", { name: "North Star Garage" })).toBeVisible();
  2354 |   await page.getByRole("button", { name: "Disable tenant" }).click();
  2355 |   await expect(page.getByText("Disabled tenants cannot be emulated or used operationally.")).toBeVisible();
  2356 |   await expect(page.getByRole("button", { name: "Emulate tenant" })).toBeDisabled();
  2357 |   await page.getByRole("button", { name: "Restore tenant" }).click();
  2358 | 
  2359 |   await page.getByRole("tab", { name: "Communications" }).click();
  2360 |   await page.getByRole("button", { name: "Send simulated test" }).first().click();
  2361 |   await expect(page.getByText(/email to .* — simulated/)).toBeVisible();
  2362 | 
  2363 |   await page.getByRole("tab", { name: "Billing" }).click();
  2364 |   await page.getByLabel("Description").fill("Demo platform plan");
  2365 |   await page.getByLabel("Amount").fill("1000");
  2366 |   await page.getByLabel("Due date").fill("2026-10-31");
  2367 |   await page.getByRole("button", { name: "Create charge" }).click();
  2368 |   await expect(page.getByText(/Demo platform plan/)).toBeVisible();
  2369 |   await page.getByLabel("Payment for Demo platform plan").fill("400");
  2370 |   await page.getByRole("button", { name: "Record payment" }).click();
  2371 |   await expect(page.getByText(/Partial/)).toBeVisible();
  2372 | 
  2373 |   await page.getByRole("tab", { name: "Tenants" }).click();
  2374 |   await page.getByLabel("Emulate role").selectOption("reception");
  2375 |   await page.getByRole("button", { name: "Emulate tenant" }).click();
  2376 |   await expect(page.locator(".rail-role")).toHaveText("Reception");
  2377 |   await page.getByRole("button", { name: "Return to Developer" }).first().click();
  2378 |   await expect(page.getByRole("heading", { name: "Developer Console" })).toBeVisible();
  2379 | });
  2380 | 
  2381 | test("linked advisor can change job media while other authorized job viewers are read only", async ({ page }) => {
  2382 |   await loginAs(page, "service@example.com");
  2383 |   await page.locator(".role-nav").getByRole("button", { name: "My Queue", exact: true }).click();
  2384 |   await page.getByRole("table", { name: "My Queue" }).getByRole("button", { name: "View", exact: true }).first().click();
  2385 |   let job = page.getByRole("dialog", { name: /View Job/ });
  2386 |   await job.getByRole("tab", { name: "Photos / Media" }).click();
  2387 |   await job.getByRole("tab", { name: "After Work" }).click();
  2388 |   await expect(job.getByLabel("Image file")).toBeVisible();
  2389 |   await job.getByRole("button", { name: "Go Back" }).click();
  2390 |   await page.locator(".logout").click();
  2391 | 
  2392 |   await loginAs(page, "reception@example.com");
  2393 |   await page.locator(".role-nav").getByRole("button", { name: "Search", exact: true }).click();
  2394 |   await page.getByLabel("Search category").selectOption("job");
  2395 |   const results = page.getByRole("table", { name: "Job Card search results" });
  2396 |   await expect(results.getByRole("button", { name: "View" }).first()).toBeVisible();
  2397 |   await expect(results.getByRole("button", { name: "Edit", exact: true })).toHaveCount(0);
  2398 |   await results.getByRole("button", { name: "View" }).first().click();
  2399 |   job = page.getByRole("dialog", { name: /View Job/ });
  2400 |   await job.getByRole("tab", { name: "Photos / Media" }).click();
  2401 |   await expect(job.getByText(/Read only.*Owner.*linked Service Advisor/)).toBeVisible();
  2402 |   await expect(job.getByLabel("Image file")).toHaveCount(0);
  2403 | });
  2404 | 
  2405 | async function loginAs(page: import("@playwright/test").Page, email: string) {
  2406 |   await page.getByLabel("Emulate User:").selectOption(email);
  2407 |   await page.getByRole("button", { name: "Login" }).click();
  2408 | }
  2409 | 
  2410 | test("fresh demo data provides a multi-supplier price review before PO approval", async ({ page }) => {
  2411 |   await loginAs(page, "admin@example.com");
  2412 |   await page.locator(".role-nav").getByRole("button", { name: "Purchase Orders", exact: true }).click();
  2413 |   await page.getByLabel("Search purchase orders").fill("DEMO-PR-0001");
  2414 |   const row = page.getByRole("table", { name: "Purchase order register" }).getByRole("row", { name: /DEMO-PR-0001/ });
> 2415 |   await expect(row).toContainText("PO Request");
       |                     ^ Error: expect(locator).toContainText(expected) failed
  2416 |   await row.getByRole("button", { name: "Process", exact: true }).click();
  2417 | 
  2418 |   const request = page.getByRole("dialog", { name: "DEMO-PR-0001" });
  2419 |   const review = request.getByRole("region", { name: "Previous Price Review" });
  2420 |   await expect(review).toContainText("Apex Protection Films");
  2421 |   await expect(review).toContainText("Detail Supply Co.");
  2422 |   await expect(review).toContainText("Prime Auto Materials");
  2423 |   await expect(review.getByRole("table", { name: /Previous purchases for TPU Gloss PPF/ }).locator("tbody tr")).toHaveCount(3);
  2424 |   await expect(review).toContainText("No completed purchase history.");
  2425 | 
  2426 |   await request.getByRole("button", { name: "Review & approve request", exact: true }).click();
  2427 |   await expect(page.getByRole("dialog", { name: "Approve DEMO-PR-0001" })).toBeVisible();
  2428 | });
  2429 | 
  2430 | test("Store creates a Purchase Request without supplier access or later-stage actions", async ({ page }) => {
  2431 |   await page.setViewportSize({ width: 1024, height: 900 });
  2432 |   await loginAs(page, "store@example.com");
  2433 |   await page.locator(".role-nav").getByRole("button", { name: "Purchase Orders", exact: true }).click();
  2434 |   await page.getByRole("button", { name: "New Purchase Request", exact: true }).click();
  2435 | 
  2436 |   const request = page.getByRole("dialog", { name: "New Purchase Request" });
  2437 |   await expect(request.getByLabel("PO number")).toHaveValue("PO-WOS-A-00001");
  2438 |   await expect(request.getByLabel("PO supplier")).toBeDisabled();
  2439 |   await expect(request.getByText(/supplier and pricing are completed by Admin/i)).toBeVisible();
  2440 |   await request.getByRole("button", { name: "Add line", exact: true }).click();
  2441 |   await request.getByLabel("Item type").nth(1).selectOption("new");
  2442 |   await request.getByLabel("PO line 2 new item name").fill("Workshop label");
  2443 |   await expect(request.getByRole("button", { name: "Create request" })).toBeDisabled();
  2444 |   await request.getByLabel("PO line 2 unit").fill("piece");
  2445 |   await request.getByLabel("PO line 2 quantity").fill("2");
  2446 |   await expect(request.locator(".purchase-request-line-row")).toHaveCount(2);
  2447 |   expect(await request.locator(".purchase-request-line-row").evaluateAll((rows) =>
  2448 |     rows.every((row) => row.scrollWidth <= row.clientWidth),
  2449 |   )).toBe(true);
  2450 | 
  2451 |   await page.setViewportSize({ width: 390, height: 844 });
  2452 |   expect(await request.evaluate((dialog) => dialog.getBoundingClientRect().width)).toBe(390);
  2453 |   await page.setViewportSize({ width: 1024, height: 900 });
  2454 |   await request.getByRole("button", { name: "Create request" }).click();
  2455 | 
  2456 |   const process = page.getByRole("dialog", { name: "PO-WOS-A-00001" });
  2457 |   await expect(process.getByRole("button", { name: /Send saved PO|Close PO|Cancel PO/ })).toHaveCount(0);
  2458 |   await expect(process.getByRole("button", { name: "Edit request" })).toBeVisible();
  2459 | });
  2460 | 
  2461 | test("Admin can create a Purchase Request", async ({ page }) => {
  2462 |   await loginAs(page, "admin@example.com");
  2463 |   await page.locator(".role-nav").getByRole("button", { name: "Purchase Orders", exact: true }).click();
  2464 |   await page.getByRole("button", { name: "New Purchase Request", exact: true }).click();
  2465 | 
  2466 |   const request = page.getByRole("dialog", { name: "New Purchase Request" });
  2467 |   await expect(request.getByLabel("PO number")).toHaveValue("PO-WOS-A-00001");
  2468 |   await expect(request.getByRole("button", { name: "Create request", exact: true })).toBeEnabled();
  2469 |   await request.getByRole("button", { name: "Create request", exact: true }).click();
  2470 | 
  2471 |   await expect(page.getByRole("dialog", { name: "PO-WOS-A-00001" })).toBeVisible();
  2472 | });
  2473 | 
  2474 | test("Store Materials Requests keeps inward unavailable and hands a New Item Request to the controlled PO form", async ({ page }) => {
  2475 |   await loginAs(page, "store@example.com");
  2476 |   await page.locator(".role-nav").getByRole("button", { name: "Material Requests", exact: true }).click();
  2477 |   const triage = page.getByRole("region", { name: "Material procurement triage" });
  2478 |   await expect(triage.getByText("Available to issue")).toBeVisible();
  2479 |   await expect(triage.getByText("Existing-SKU procurement")).toBeVisible();
  2480 |   await expect(triage.getByRole("heading", { name: "New Item Requests" })).toBeVisible();
  2481 |   await expect(page.getByRole("button", { name: /Quick Add Stock|Record Inward|Purchase, Stock & Issue/ })).toHaveCount(0);
  2482 |   await triage.getByRole("button", { name: "Create New Item Request" }).click();
  2483 |   const request = page.getByRole("dialog", { name: "New Purchase Request" });
  2484 |   await expect(request.getByLabel("Item type")).toHaveValue("new");
  2485 |   await expect(request.getByLabel("PO supplier")).toBeDisabled();
  2486 |   await expect(request.getByLabel("PO notes")).toHaveValue("From New Item Request");
  2487 | });
  2488 | 
  2489 | test("Admin records optional quotations and sees an N/A Previous Price Review for a New Item Request", async ({ page }) => {
  2490 |   await loginAs(page, "store@example.com");
  2491 |   await page.locator(".role-nav").getByRole("button", { name: "Purchase Orders", exact: true }).click();
  2492 |   await page.getByRole("button", { name: "New Purchase Request", exact: true }).click();
  2493 |   const request = page.getByRole("dialog", { name: "New Purchase Request" });
  2494 |   await request.getByLabel("Item type").selectOption("new");
  2495 |   await request.getByLabel("PO line 1 new item name").fill("Uncatalogued tool");
  2496 |   await request.getByLabel("PO line 1 unit").fill("piece");
  2497 |   await request.getByRole("button", { name: "Create request" }).click();
  2498 |   await page.getByRole("dialog", { name: "PO-WOS-A-00001" }).getByRole("button", { name: "Go Back" }).click();
  2499 |   await page.getByRole("button", { name: "Logout" }).click();
  2500 | 
  2501 |   await loginAs(page, "admin@example.com");
  2502 |   await page.locator(".role-nav").getByRole("button", { name: "Purchase Orders", exact: true }).click();
  2503 |   await page.getByRole("button", { name: "Process", exact: true }).click();
  2504 |   const process = page.getByRole("dialog", { name: "PO-WOS-A-00001" });
  2505 |   const review = process.getByRole("region", { name: "Previous Price Review" });
  2506 |   await expect(review).toContainText("Uncatalogued tool");
  2507 |   await expect(review).toContainText(/N\/A.*New Item Request/i);
  2508 |   await expect(review).toContainText("No quotations recorded. This is optional.");
  2509 |   await review.getByRole("button", { name: "Add quotation" }).click();
  2510 |   await review.getByLabel(/Quotation supplier/).fill("Quote supplier");
  2511 |   await review.getByLabel(/Quotation price/).fill("42");
  2512 |   await review.getByRole("button", { name: "Save quotation" }).click();
  2513 |   await expect(review).toContainText("Quote supplier");
  2514 |   await expect(review).toContainText(/Rs\s*42(?:\.00)? pre-GST/);
  2515 | });
```